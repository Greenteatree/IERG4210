
from paypal.standard.models import ST_PP_COMPLETED
from paypal.standard.ipn.signals import valid_ipn_received
from django.dispatch import receiver
import json

@receiver(valid_ipn_received)
def paypal_payment_received(sender, **kwargs):
    ipn_obj = sender
    if ipn_obj.payment_status == ST_PP_COMPLETED:
        # WARNING !
        # Check that the receiver email is the same we previously
        # set on the `business` field. (The user could tamper with
        # that fields on the payment form before it goes to PayPal)
        if ipn_obj.receiver_email != "online_shop4210@gmail.com":
            # Not a valid payment
            return

        # ALSO: for the same reason, you need to check the amount
        # received, `custom` etc. are all what you expect or what
        # is allowed.
        try:
            pass
            my_pk = ipn_obj.invoice
            transaction = Transaction.objects.get_or_create(invoice=my_pk, productList=json.dumps({"item": "test_item1", "quantity":"1", "price":"8499"}, intent=4))
            #mytransaction = MyTransaction.objects.get(pk=my_pk)
            #assert ipn_obj.mc_gross == mytransaction.amount and ipn_obj.mc_currency == 'EUR'
        except Exception:
            #logger.exception('Paypal ipn_obj data not valid!')
            pass
        else:
            pass
            #mytransaction.paid = True
            #mytransaction.save()
    else:
        pass
        #logger.debug('Paypal payment status not completed: %s' % ipn_obj.payment_status)
