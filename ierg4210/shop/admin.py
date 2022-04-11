from django.contrib import admin

# Register your models here.
from .models import Product, Category, ProductInstance, Image, Transaction

#admin.site.register(Product)
#admin.site.register(Category)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'catid')

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('pid','catid', 'name', 'price')

#@admin.register(ProductInstance)
#class ProductInstanceAdmin(admin.ModelAdmin):
 
admin.site.register(Image,  readonly_fields=('my_image_thumbnail',))
admin.site.register(ProductInstance)  

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('invoice', 'digest', 'status', 'productList')

