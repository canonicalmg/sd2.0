from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^submit-info-form', views.submit_info_form, name='submit_info_form'),
]