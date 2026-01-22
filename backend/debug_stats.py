import os
import django
from django.conf import settings

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from finance.models import Transaction, Category
from django.db import models
from django.db.models import Sum, F, Q, Value
from django.db.models.functions import TruncDate, Coalesce
from django.contrib.auth import get_user_model

def run_debug():
    User = get_user_model()
    # Try to find a user with transactions, or just the first user
    user = User.objects.first()
    if not user:
        print("No users found in database.")
        return

    print(f"DEBUGGING FOR USER: {user.email} (ID: {user.id})")

    queryset = Transaction.objects.filter(user=user)
    count = queryset.count()
    print(f"Total Transactions: {count}")

    if count == 0:
        print("User has no transactions. Charts will be empty.")
        return

    # 1. Summary
    summary = queryset.aggregate(
        total_income=Coalesce(Sum('amount', filter=Q(type='IN')), Value(0, output_field=models.DecimalField())),
        total_expense=Coalesce(Sum('amount', filter=Q(type='EX')), Value(0, output_field=models.DecimalField()))
    )
    summary['balance'] = summary['total_income'] - summary['total_expense']
    print("\n--- SUMMARY ---")
    print(summary)

    # 2. Chart Data (Area)
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
    
    print("\n--- RAW CHART DATA (Queryset) ---")
    data_list = list(chart_data)
    for item in data_list:
        print(item)

    # Simulate Serialization
    formatted_chart = [
        {
            "name": item['day'].strftime('%d.%m'),
            "income": item['income'],
            "expense": item['expense']
        } for item in data_list
    ]
    print("\n--- SERIALIZED CHART DATA ---")
    print(formatted_chart)

    # 3. Pie Data
    pie_data = (
        queryset.filter(type='EX')
        .values('category__name')
        .annotate(value=Sum('amount'))
        .order_by('-value')
    )
    
    print("\n--- PIE DATA ---")
    formatted_pie = [
        {
            "name": item['category__name'] or 'Без категории',
            "value": item['value']
        } for item in pie_data
    ]
    print(formatted_pie)

if __name__ == "__main__":
    run_debug()
