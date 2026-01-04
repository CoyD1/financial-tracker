from django.db import models
from django.conf import settings

class Category(models.Model):
    TYPE_CHOICES = [
        ('IN', 'Доход'),
        ('EX', 'Расход'),
    ]
    
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=2, choices=TYPE_CHOICES)
    
    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"

class Transaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    type = models.CharField(max_length=2, choices=Category.TYPE_CHOICES)
    category = models.ForeignKey(Category, on_delete=models.PROTECT)
    date = models.DateField()
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email}: {self.amount} ({self.category.name})"

class UserSavingGoal(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    target_amount = models.DecimalField(max_digits=10, decimal_places=2)
    current_saved = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email}: {self.title}"