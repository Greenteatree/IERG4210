from django.urls import path
from . import views
from django.conf.urls import include

urlpatterns = [
    #path('', views.index, name='index'),
    path('', views.index, name='index'),
    path('categories/', views.CategoryListView.as_view(), name='categories'),
    path('category/<int:pk>', views.CategoryListDetailView.as_view(), name='category-detail'),
    path('product/<int:pk>', views.ProductDetailView.as_view(), name='product-detail'),
    path('test/', views.test, name='test'),
    path('add/', views.add, name='add'),
    #path('paypal/', include('paypal.standard.ipn.urls')),
    path(r'^paypal_payment_received/', include('paypal.standard.ipn.urls')),
    path('webhook/', views.webhook, name='braintreeWebhook'),
    path('payment/', views.payment, name="payment"),
    path('webhook1123/', views.webhook),
    path('ajaxTest/', views.ajaxTest, name="ajaxTest"),
    path('records/', views.records, name="records"),




    


]

