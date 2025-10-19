from django.contrib import admin
from .models import Category, Transaction, UserSavingGoal

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'type']
    list_filter = ['type']

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'amount', 'type', 'category', 'date']
    list_filter = ['type', 'category', 'date']

@admin.register(UserSavingGoal)
class UserSavingGoalAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'target_amount', 'current_saved', 'is_active']
    list_filter = ['is_active']