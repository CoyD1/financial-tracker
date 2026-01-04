from rest_framework import serializers
from .models import Category, Transaction, UserSavingGoal

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class TransactionSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    
    class Meta:
        model = Transaction
        fields = ['id', 'amount', 'type', 'category', 'category_name', 'date', 'description', 'created_at']

class UserSavingGoalSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSavingGoal
        fields = '__all__'

