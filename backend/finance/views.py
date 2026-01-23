from django.db import models
from .models import Category, Transaction, UserSavingGoal, SavingScenario
from rest_framework import viewsets, permissions
from .serializers import CategorySerializer, TransactionSerializer, UserSavingGoalSerializer, SavingScenarioSerializer
from django.db.models import Sum, Case, When, Value, CharField, F, Q
from django.db.models.functions import TruncDate, Coalesce
from rest_framework.views import APIView
from rest_framework.response import Response
from decimal import Decimal

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
        
        total_income = summary['total_income']
        total_expense = summary['total_expense']

        habits_analysis = {}

        # Если есть расходы — считаем структуру
        if total_expense > 0:
            expense_by_category = (
                queryset
                .filter(type='EX')
                .values('category__name')
                .annotate(total=Sum('amount'))
                .order_by('-total')
            )

            top_category = expense_by_category[0]
            top_category_percent = round(
                (top_category['total'] / total_expense) * 100, 1
            )

            habits_analysis['top_expense_category'] = {
                "name": top_category['category__name'],
                "percent": top_category_percent
            }
        else:
            habits_analysis['top_expense_category'] = None

        # Анализ соотношения доходов и расходов
        if total_income > 0:
            expense_income_ratio = round(total_expense / total_income, 2)
        else:
            expense_income_ratio = None

        habits_analysis['expense_to_income_ratio'] = expense_income_ratio

        # Текстовая интерпретация
        if total_income == 0 and total_expense > 0:
            habits_analysis['status'] = 'no_income'
            habits_analysis['message'] = 'У вас есть расходы, но нет доходов за выбранный период'
        elif expense_income_ratio and expense_income_ratio > 1:
            habits_analysis['status'] = 'overspending'
            habits_analysis['message'] = 'Вы тратите больше, чем зарабатываете'
        elif expense_income_ratio and expense_income_ratio > 0.8:
            habits_analysis['status'] = 'warning'
            habits_analysis['message'] = 'Расходы близки к доходам — стоит быть осторожнее'
        else:
            habits_analysis['status'] = 'healthy'
            habits_analysis['message'] = 'Финансовый баланс выглядит стабильным'
            
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
            ],
            "habits_analysis": habits_analysis
        }
        
        return Response(response_data)

class UserSavingGoalViewSet(viewsets.ModelViewSet):
    serializer_class = UserSavingGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSavingGoal.objects.filter(user=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
class SavingScenarioViewSet(viewsets.ModelViewSet):
    serializer_class = SavingScenarioSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return SavingScenario.objects.filter(
            user=self.request.user,
            is_active=True
        )

    def perform_create(self, serializer):
        # деактивируем старые сценарии
        SavingScenario.objects.filter(
            user=self.request.user,
            is_active=True
        ).update(is_active=False)

        serializer.save(user=self.request.user)

    def list(self, request, *args, **kwargs):
        scenarios = self.get_queryset()
        data = []

        for scenario in scenarios:
            # текущие расходы по категории
            total_expense = (
                Transaction.objects.filter(
                    user=request.user,
                    type='EX',
                    category=scenario.category
                ).aggregate(total=Sum('amount'))['total'] or 0
            )

            # условная "норма" — если сократить на target_percent
            reduction_factor = Decimal("1") - (Decimal(scenario.target_percent) / Decimal("100"))
            target_expense = total_expense * reduction_factor

            progress = 0
            if total_expense > 0:
                progress = round(
                    (1 - (total_expense / (total_expense / (1 - scenario.target_percent / 100)))) * 100,
                    1
                )

            data.append({
                "id": scenario.id,
                "category": scenario.category.name,
                "target_percent": scenario.target_percent,
                "current_expense": float(total_expense),
                "progress": max(min(progress, 100), 0),
            })

        return Response(data)

