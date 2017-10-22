from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^scrape/$', views.scrape_content, name='scrape_content'),
]