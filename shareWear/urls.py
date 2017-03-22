from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^home$', views.home, name='home'),
    url(r'^about$', views.about, name='about'),
    url(r'^contact$', views.contact, name='contact'),
    url(r'^addNew$', views.addNew, name='addNew'),
    url(r'^get_product/', views.get_product, name='get_product'),
    url(r'^get_product_full/', views.get_product_full, name='get_product_full'),
    url(r'catalog/((?P<name>\w+)-(?P<pk>\d+)/)?$', views.dog_page, name='dog_page'),
]