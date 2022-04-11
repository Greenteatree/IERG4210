from django.shortcuts import render, get_object_or_404

# Create your views here.
from django.views import generic
from .models import Image, Category, Product, ProductInstance, Transaction
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
    


from paypal.standard.forms import PayPalPaymentsForm
from django.urls import reverse


#braintree setting
import braintree

gateway = braintree.BraintreeGateway(
            braintree.Configuration(
                braintree.Environment.Sandbox,
                merchant_id="fr7wzggrcm9fmxf2",
                public_key="k6c9cyqrp5f9sgvj",
                private_key="bd0242f0ad05b0ce7916f17c0ab8229a",
                )
            )
braintree.Configuration.configure(
                braintree.Environment.Sandbox,
                merchant_id="fr7wzggrcm9fmxf2",
                public_key="k6c9cyqrp5f9sgvj",
                private_key="bd0242f0ad05b0ce7916f17c0ab8229a",
                )
#gateway = braintree.BraintreeGateway(access_token='access_token$sandbox$grnps7z4ypkz3jcv$fb21dc91087ed96fe1f2cfb3e64dd67d')


def test(request):
    paypal_dict = {
        #"business": settings.PAYPAL_RECEIVER_EMAIL,
        "business": "online_shop4210@gmail.com",
        "amount": "22.6",
        "item_name": "1",
        "invoice": "8",
        "notify_url": "https://secure.s26.ierg4210.ie.cuhk.edu.hk/shop/" + reverse('paypal-ipn'),
        #"notify_url": "https://secure.s26.ierg4210.ie.cuhk.edu.hk/shop/" + "paypal/testing/1",
        "return_url": "https://secure.s26.ierg4210.ie.cuhk.edu.hk/shop/",
        "cancel_return": "https://secure.s26.ierg4210.ie.cuhk.edu.hk/shop/test/",

    }
    """
    braintree.Configuration.configure(
                braintree.Environment.Sandbox,
                merchant_id="fr7wzggrcm9fmxf2",
                public_key="k6c9cyqrp5f9sgvj",
                private_key="bd0242f0ad05b0ce7916f17c0ab8229a",
                )
    
    """
    try:
        braintree_client_token = braintree.ClientToken.generate({ "customer_id": user.id })
    except:
        braintree_client_token = braintree.ClientToken.generate({})
    


    request.session['braintree_client_token'] = braintree_client_token

    

    #request.session['braintree_client_token'] = gateway.client_token.generate()



    #return render(request, "test.html", locals())
    form = PayPalPaymentsForm(initial=paypal_dict)
    context = {"form": form, 'braintree_client_token': braintree_client_token}

    return render(request, "test.html", context)


def payment(request):
    nonce_from_the_client = request.POST['paymentMethodNonce']
    """
    customer_kwargs = {
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
    }
    
    customer_create = braintree.Customer.create(customer_kwargs)
    customer_id = customer_create.customer.id
    """

    # using setting
    
    gateway = braintree.BraintreeGateway(
        braintree.Configuration(
            environment=braintree.Environment.Sandbox,
            merchant_id='fr7wzggrcm9fmxf2',
            public_key='k6c9cyqrp5f9sgvj',
            private_key='bd0242f0ad05b0ce7916f17c0ab8229a'
        )
    )
    line_items = []
    for key, val in request.POST.lists():
        if (key.isnumeric()):
            product = get_object_or_404(Product, pid=key)
            item = {"kind": "credit",
                    "name": product.name,
                    "quantity": str(val[0]),
                    "total_amount": str(int(int(product.price) * int(val[0]) / 7.85)),
                    "unit_amount": str(int(int(product.price)/7.85)),
                    }
            line_items.append(item)
            print("Data", key, val, str(int(product.price) * int(val[0])), int(val[0]))


    #print(line_items)
    result = gateway.transaction.sale({
        "amount": request.POST["amount"],
        "payment_method_nonce": nonce_from_the_client,
        "options": {
            "submit_for_settlement": True,
            #"paypal": {
            #    "description": "1233123213123123",
            #    "custom_field" : "PayPal custom field",
            #    }

        },
        #"line_items": line_items,
    })
    """
    # using gateway setting
    result = gateway.transaction.sale({
        "amount": request.POST["amount"],
        "payment_method_nonce": nonce_from_the_client,
        "options": {
            "submit_for_settlement": True
        }
    })
    """
    print("Payment result", result)
    print("Payment nonce ", nonce_from_the_client)
    """
    for error in result.errors.deep_errors:
        print(error.code)
        print(error.message)
    """
    userName = request.user.username if request.user.is_authenticated else "guest"

    if result.is_success:
        transaction = Transaction.objects.create(user=userName, digest=nonce_from_the_client, status=True, productList=json.dumps(line_items))
        transaction.save()



    return HttpResponse('Ok1234')



def add(request): 
    a = request.GET.get('a', 0)
    b = request.GET.get('b', 0)
    a = int(a)
    b = int(b)
    return HttpResponse(str(a+b))

#def paypalIPN():


def productQuery(request):
    
    def get(self, request, *args, **kwargs):
        pass

#from paypal.standard.forms import PayPalPaymentsForm
#from django.urls import reverse
#class PaypalFormView(FormView):
#def PaypalFormButton(request):

#from paypal.standard.models import ST_PP_COMPLETED
#from paypal.standard.ipn.signals import valid_ipn_received
#from django.dispatch import receiver

#@receiver(valid_ipn_received)
#def paypal_payment_received(sender, **kwargs):
#    ipn_obj = sender
#    if ipn_obj.payment_status == ST_PP_COMPLETED:
#        # WARNING !
#        # Check that the receiver email is the same we previously
#        # set on the `business` field. (The user could tamper with
#        # that fields on the payment form before it goes to PayPal)
#        if ipn_obj.receiver_email != "online_shop4210@gmail.com":
#            # Not a valid payment
#            return
#
#        # ALSO: for the same reason, you need to check the amount
#        # received, `custom` etc. are all what you expect or what
#        # is allowed.
#        try:
#            pass
#            my_pk = ipn_obj.invoice
#            transaction = Transaction.objects.get_or_create(invoice=my_pk, productList=json.dumps({"item": "test_item1", "quantity":"1", "price":"8499"}, intent=4))
#            #mytransaction = MyTransaction.objects.get(pk=my_pk)
#            #assert ipn_obj.mc_gross == mytransaction.amount and ipn_obj.mc_currency == 'EUR'
#        except Exception:
#            #logger.exception('Paypal ipn_obj data not valid!')
#            pass
#        else:
#            pass
#            #mytransaction.paid = True
#            #mytransaction.save()
#    else:
#        pass
#        #logger.debug('Paypal payment status not completed: %s' % ipn_obj.payment_status)
#
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def webhook(request):
    """
    gateway = braintree.BraintreeGateway(
            braintree.Configuration(
                braintree.Environment.Sandbox,
                merchant_id="fr7wzggrcm9fmxf2",
                public_key="k6c9cyqrp5f9sgvj",
                private_key="bd0242f0ad05b0ce7916f17c0ab8229a",
                )
            )
    """
    #print("Webhook triggered!", request.POST, request.body)
    body_unicode = request.body.decode('utf-8')
    body = json.loads(body_unicode)
    #content = body['content']
    #print("The content", body)
    for key, val in body.items():
        print(key, val)
    print("Data END")
    """
    gateway = braintree.BraintreeGateway(
        braintree.Configuration(
            environment=braintree.Environment.Sandbox,
            merchant_id='fr7wzggrcm9fmxf2',
            public_key='k6c9cyqrp5f9sgvj',
            private_key='bd0242f0ad05b0ce7916f17c0ab8229a'
        )
    )
    """
    
    
    #webhook_notification = gateway.webhook_notification.parse(str(request.POST.get('bt_signature', "Nothing")), request.POST.get('bt_payload', "Nothing2"))
    """
    data = ""

    testObj, created = Product.objects.get_or_create(pid=9)
    for key, val in request.POST.items():
        if len(data) >= 600:
            break
        data += key
        data += ":"
        data += val
        data += "###"
       

    testObj.description = data
    testObj.save()
    """


    # Example values for webhook notification properties
    #print(webhook_notification.kind) # "subscription_went_past_due"
    #print(webhook_notification.timestamp) # "Sun Jan 1 00:00:00 UTC 2012"

    return HttpResponse('')

@csrf_exempt
def ajaxTest(request):
    pid = request.POST['pid']
    product = get_object_or_404(Product, pid=pid)

    return HttpResponse(str(product.price))

from django.contrib.auth.decorators import login_required

@login_required
def records(request):
    print("records", request.user.username)
    transactions = Transaction.objects.all().filter(user=request.user.username)
    #transactions = Transaction.objects.all()


    context = {
            
            'transactions' : transactions,
            }


    return render(request, 'records.html', context=context)
