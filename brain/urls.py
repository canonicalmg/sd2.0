from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^submit-info-form', views.submit_info_form, name='submit_info_form'),
    url(r'^submit-add-to-cart-email-form', views.submit_add_to_cart_email_form, name='submit_add_to_cart_email_form'),
    url(r'^add_to_cart', views.add_to_cart, name='add_to_cart'),
]