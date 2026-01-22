from django.db import models
from .models import Category, Transaction, UserSavingGoal
from rest_framework import viewsets, permissions
from .serializers import CategorySerializer, TransactionSerializer, UserSavingGoalSerializer
from django.db.models import Sum, Case, When, Value, CharField, F, Q
from django.db.models.functions import TruncDate, Coalesce
from rest_framework.views import APIView
from rest_framework.response import Response

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Transaction.objects.filter(user=self.request.user)
 
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        
        if month:
            queryset = queryset.filter(date__month=month)
        if year:
            queryset = queryset.filter(date__year=year)
            
        return queryset.order_by('-date')
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TransactionStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        #Фильтрация по текущему пользователю
        start_date = request.query_params.get('start_date')
        end_date = request.query_params.get('end_date')
        
        queryset = Transaction.objects.filter(user=request.user)
        
        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)
            
        #Общая статистика (Баланс, Доход, Расход)
        summary = queryset.aggregate(
            total_income=Coalesce(Sum('amount', filter=Q(type='IN')), Value(0, output_field=models.DecimalField())),
            total_expense=Coalesce(Sum('amount', filter=Q(type='EX')), Value(0, output_field=models.DecimalField()))
        )
        summary['balance'] = summary['total_income'] - summary['total_expense']
        
        #Данные для Графика (AreaChart) - Группировка по дням
        #SELECT date, SUM(income), SUM(expense) GROUP BY date
        chart_data = (
            queryset
            .annotate(day=TruncDate('date'))
            .values('day')
            .annotate(
                income=Coalesce(Sum('amount', filter=Q(type='IN')), Value(0, output_field=models.DecimalField())),
                expense=Coalesce(Sum('amount', filter=Q(type='EX')), Value(0, output_field=models.DecimalField()))
            )
            .order_by('day')
        )
        
        #Данные для Пирога (PieChart) - Расходы и Доходы по категориям
        income_pie_data = (
            queryset.filter(type='IN')
            .values('category__name')
            .annotate(value=Sum('amount'))
            .order_by('-value')
        )
        
        expense_pie_data = (
            queryset.filter(type='EX')
            .values('category__name')
            .annotate(value=Sum('amount'))
            .order_by('-value')
        )
        
        #Форматируем данные для фронтенда
        response_data = {
            "summary": summary,
            "chart_data": [
                {
                    "name": item['day'].strftime('%d.%m'), #Формат 25.05
                    "income": item['income'],
                    "expense": item['expense']
                } for item in chart_data
            ],
            "income_pie_data": [
                 {
                    "name": item['category__name'] or 'Без категории',
                    "value": item['value']
                } for item in income_pie_data
            ],
            "expense_pie_data": [
                 {
                    "name": item['category__name'] or 'Без категории',
                    "value": item['value']
                } for item in expense_pie_data
            ]
        }
        
        return Response(response_data)

class UserSavingGoalViewSet(viewsets.ModelViewSet):
    serializer_class = UserSavingGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSavingGoal.objects.filter(user=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
