# IERG4210
In phase3, mainly change under static/js or static/css.
Main function added in phase3 is shopping cart.
When hover the shopping cart button, all content in the shopping will be showed.


Trying to add the same product to the shopping cart will trigger a alarm and stop this action.

The main page have a simple pagination design supported by Django framework.

The amount and shopping cart are stored in the localStorage.


# Phase 4 
Requirements 1, 2, 3, 5 are done by Django framework.

For requirement1, Django provide autoescape that will treat special symbol as harmless escape code equivalents.
For requirement2, all the queries are constructed using query parameterization so that if we dont write raw SQL quiries than we wouldnt worry about SQL injection.
For requirement3, to prevent CSRF attack we have to use the Django built-in protection, put the csrf token to every POST form.
For requirement5, the session IDs are using Django basic backend to provide which are secure enough.

For requirement6, all http connection will be redirected to https index page.

For requirement4, since I am using the original Django login page, the authentication token in Cookies is named 'sessionid' instead of 'auth'.
The login is using user name instead of user email. It can use the pattern to force the input is email.
