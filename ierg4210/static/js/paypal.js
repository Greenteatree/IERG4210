totalAmount = 0;
window.addEventListener("load", calAmount);
window.addEventListener("load", buttonInit);
function calAmount(){
  for (var key in localStorage)   {
	if (parseInt(key)) getPrice(key);
  }

}

function getPrice(productPID){
  $.ajax({
	type: 'POST',
	url: 'ajaxTest',
	data: {'pid': productPID },
		  headers: { "X-CSRFToken": '{{ csrf_token }}' },
  }).done(function (result) {
	//do accordingly
	//console.log(result);
	quantity = JSON.parse( localStorage.getItem(productPID))['quantity'];
	totalAmount += parseInt(result)*parseInt(quantity);
	totalAmountUSD = parseInt(totalAmount/7.85);



  });


}



//calAmount();
//buttonInit();
function buttonInit(){
  //totalAmountUSD = totalAmount/7.85;i
  braintree.client.create({
	authorization: "{{ request.session.braintree_client_token }}",
  }, function (clientErr, clientInstance) {

	// Stop if there was a problem creating the client.
	// This could happen if there is a network error or if the authorization
	// is invalid.
	if (clientErr) {
	  console.error('Error creating client:', clientErr);
	  return;
	}

	// Create a PayPal Checkout component.
	braintree.paypalCheckout.create({
	  client: clientInstance
	}, function (paypalCheckoutErr, paypalCheckoutInstance) {
	  paypalCheckoutInstance.loadPayPalSDK({
		currency: 'USD',
		intent: 'capture'
	  }, function () {
		paypal.Buttons({
		  fundingSource: paypal.FUNDING.PAYPAL,

		  createOrder: function () {
			return paypalCheckoutInstance.createPayment({
			  flow: 'checkout', // Required
			  amount: totalAmountUSD, // Required
			  currency: 'USD', // Required, must match the currency passed in with loadPayPalSDK

			  //lineItem: {'kind': 'credit', 'name':'iPhone 13', 'quantity':1, "unitAmount": "866"},

			  intent: 'capture', // Must match the intent passed in with loadPayPalSDK

			  enableShippingAddress: true,
			  shippingAddressEditable: false,
			  shippingAddressOverride: {
				recipientName: 'Scruff McGruff',
				line1: '1234 Main St.',
				line2: 'Unit 1',
				city: 'Chicago',
				countryCode: 'US',
				postalCode: '60652',
				state: 'IL',
				phone: '123.456.7890'
			  }
			});
		  },

		  onApprove: function (data, actions) {
			return paypalCheckoutInstance.tokenizePayment(data, function (err, payload) {

			  //get pid & quantity
			  var ajaxData = {};

			  for (var key in localStorage)   {
				if (parseInt(key)){
				  quantity = JSON.parse( localStorage.getItem(key))['quantity'];
				  ajaxData[key] = quantity;
				}
			  }
			  ajaxData['paymentMethodNonce'] =  payload.nonce;
			  ajaxData['csrfmiddlewaretoken'] =  '{{ csrf_token }}';
			  ajaxData['amount'] =  totalAmountUSD;



			  // Submit `payload.nonce` to your server
			  $.ajax({
				type: 'POST',
				url: '{% url "payment" %}',
				//data: {'paymentMethodNonce': payload.nonce,
				//        'csrfmiddlewaretoken': '{{ csrf_token }}', 'amount': totalAmountUSD, }
				data: ajaxData
			  }).done(function (result) {
				//do accordingly
				console.log(result);

			  });
			});
		  },

		  onCancel: function (data) {
			console.log('PayPal payment cancelled', JSON.stringify(data, 0, 2));
		  },

		  onError: function (err) {
			console.error('PayPal error', err);
		  }
		}).render('#paypal-button').then(function () {
		  // The PayPal button will be rendered in an html element with the ID
		  // `paypal-button`. This function will be called when the PayPal button
		  // is set up and ready to be used
		});

	  });

	});

  });

}
