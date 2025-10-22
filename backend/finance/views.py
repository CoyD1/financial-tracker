from django.shortcuts import render
from .models import Category, Transaction, UserSavingGoal
from rest_framework import viewsets, permissions
from .serializers import CategorySerializer, TransactionSerializer, UserSavingGoalSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class TransactionViewSet(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Transaction.objects.filter(user=self.request.user)
    
    def preform_create(self, serializer):
        serializer.save(user=self.request.user)

class USerSavingGoalViewSet(viewsets.ModelViewSet):
    serializer_class = UserSavingGoalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSavingGoal.objects.filter(user=self.request.user)
        
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
