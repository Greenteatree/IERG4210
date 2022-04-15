from django.db import models
from django.urls import reverse
import uuid
import os
from django.utils.html import mark_safe
from django.contrib.admin.decorators import display
from django.template.loader import get_template
# Create your models here.

class Category(models.Model):
    name = models.CharField(max_length=200, help_text='Enter a category (e.g. Phone)')
    catid = models.AutoField(primary_key=True)
    class Meta:
        verbose_name_plural = "Categories"    
        ordering = ['catid']

    def __str__(self):
        return self.name

    def get_absolute_url(self):
        return reverse('category-detail', args=[str(self.catid)])


class Product(models.Model):
    pid =  models.AutoField(primary_key=True)
    name = models.CharField(max_length=200, help_text='Enter the product name')
    catid = models.ForeignKey('Category', on_delete=models.SET_NULL, null=True)
    inventory = models.IntegerField(default='0')
    price = models.IntegerField()
    description = models.TextField(max_length=1000, help_text='Enter a brief descripetion of the product')
    #image = models.ImageField(upload_to='images', null=True, blank=True)
    image = models.ForeignKey('Image', on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        ordering = ['catid', 'pid']

    def __str__(self):
        return f'{self.name}'

    def get_absolute_url(self):
        return reverse('product-detail', args=[str(self.pid)])

class ProductInstance(models.Model):
    product = models.ForeignKey('Product', on_delete=models.SET_NULL, null=True)
    piid = models.UUIDField(primary_key=True, default=uuid.uuid4, help_text='Unique ID for this product')

    
    class Meta: 
        ordering = ['product__name']
    def __str__(self):
        return f'{self.product} ({self.piid})'
#= =
def image_file(instance, filename):
    #number = Image.pk if Image.pk is not None else 0
    fileName = f"{instance.name}"
    return os.path.join('images', fileName)

class Image(models.Model):
    name = models.CharField(max_length=200, help_text='Enter the product image name')
    image = models.ImageField(upload_to=image_file, null=True, blank=True)


    @display(description='Preview')
    def my_image_thumbnail(self):
        return get_template('my_image_thumbnail_template.html').render({
            'field_name': 'image',
            'src': self.image.url if self.image else None,
        })

    def __str__(self):
        return self.name
    
    def get_image_url(self):
        image_name = self.name.replace(' ', '_')
        #return f'images/{image_name}'
        return f'media/images/{image_name}'

class Transaction(models.Model):
    digest = models.CharField(max_length=200, null=True, blank=True)
    invoice = models.AutoField(primary_key=True)
    #txn_id = models.IntegerField(null=True, blank=True)
    status = models.BooleanField(default=False)
    productList = models.JSONField()
    user = models.CharField(max_length=200, null=True, blank=True, default="")

    def __str__(self):
        return str(self.invoice)






