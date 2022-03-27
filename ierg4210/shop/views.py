from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.views import generic
from .models import Image, Category, Product, ProductInstance
from django.http import HttpResponse
from django.core import serializers
from django.forms.models import model_to_dict
from django.core.paginator import Paginator
import json

def index(request):
    num_category = Category.objects.all().count()
    num_instances = ProductInstance.objects.all().count()
    all_product = Product.objects.all()

    paginator = Paginator(all_product, 3)
    page_number = request.GET.get("page")
    page_obj = paginator.get_page(page_number)
    products_json = {}

    for product in all_product:
        products_json[str(product.pid)] = {"name": product.name, "pid": product.pid, "price": product.price, "image_url": product.image.image.url, "catid": product.catid.catid}


    context = {
        'num_category': num_category,
        'num_instances': num_instances,
        'all_product': all_product,
        'products_json': json.dumps(products_json),
        'page_obj': page_obj,
    } 
    context  = {**get_side_bar_info(), **context}


    return render(request, 'index.html', context=context)


def get_side_bar_info():
    sideBarCategoryList = {}
    sideBarCategoryList['category_list'] = Category.objects.all()
    return sideBarCategoryList
    

class CategoryListView(generic.ListView):
    model = Category
    context_name = 'category_list'
    num_category = Category.objects.all().count()
    num_instances = ProductInstance.objects.all().count()
    

    queryset = Category.objects.all()
    context = {
        'category_list': queryset,
        'num_category': num_category,
        'num_instances': num_instances,
    }
    context = {**get_side_bar_info(), **context}
    template_name = 'category/category_list.html'
    def get(self, request, *args, **kwargs):
        return render(request, __class__.template_name, context=__class__.context)

class CategoryListDetailView(generic.ListView):
    def get(self, request, *args, **kwargs):
        try:
            primary_key = kwargs.get('pk')
            category = Category.objects.get(catid=primary_key)
            category_list_detail = Product.objects.all().filter(catid=primary_key)
        except Category.DoesNotExist:
            raise Http404('category does not exist!')
        context = {
            'category_list_detail':category_list_detail,
            'category': category,
        }
        context = {**get_side_bar_info(), **context}

        return render(request, 'category/category_list_detail.html', context=context)

class ProductDetailView(generic.DetailView):
    def get(self, request, *args, **kwargs):
        template_name = 'product/product_detail.html'
        model = Product
        primary_key = kwargs.get('pk')
        product = get_object_or_404(Product, pid=primary_key)
        inventory = ProductInstance.objects.all().filter(product__pid=primary_key).count()
        product_json = {"name": product.name, "pid": product.pid, "price": product.price, "image_url": product.image.image.url, "catid": product.catid.catid}
        context = {
            'product': product,
            'inventory': inventory,
            'product_json': json.dumps(product_json),
        }
        context = {**get_side_bar_info(), **context}
        return render(request, template_name, context=context)
    
def test(request):
    return render(request, "test.html", locals())
 
def add(request): 
    a = request.GET.get('a', 0)
    b = request.GET.get('b', 0)
    a = int(a)
    b = int(b)
    return HttpResponse(str(a+b))


def productQuery(request):
    
    def get(self, request, *args, **kwargs):
        pass
