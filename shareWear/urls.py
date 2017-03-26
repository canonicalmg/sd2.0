from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^home$', views.home, name='home'),
    url(r'^headerSignIn/$', views.headerSignIn, name='headerSignIn'),
    url(r'^populate_db/$', views.populate_db, name='populate_db'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^headerSignUp/$', views.headerSignUp, name='headerSignUp'),
    url(r'^about$', views.about, name='about'),
    url(r'^contact$', views.contact, name='contact'),
    url(r'^addNew$', views.addNew, name='addNew'),
    url(r'^get_product/', views.get_product, name='get_product'),
    url(r'^user_submit_outfit/', views.user_submit_outfit, name='user_submit_outfit'),
    url(r'^get_product_full/', views.get_product_full, name='get_product_full'),
    url(r'catalog/((?P<name>\w+)-(?P<pk>\d+)/)?$', views.dog_page, name='dog_page'),
]