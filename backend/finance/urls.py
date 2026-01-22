from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'categories', views.CategoryViewSet)
router.register(r'transactions', views.TransactionViewSet, basename='transaction')
router.register(r'saving-goals', views.UserSavingGoalViewSet, basename='savingoal')

urlpatterns = [
    path('', include(router.urls)),
    path('stats/', views.TransactionStatsView.as_view(), name='transaction-stats'),
]