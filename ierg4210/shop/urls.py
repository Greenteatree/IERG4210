from django.urls import path
from . import views


urlpatterns = [
    #path('', views.index, name='index'),
    path('', views.index, name='index'),
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('category/<int:pk>', views.CategoryListDetailView.as_view(), name='category-detail'),
    path('product/<int:pk>', views.ProductDetailView.as_view(), name='product-detail'),
    path('test/', views.test, name='test'),
    path('add/', views.add, name='add'),

]

