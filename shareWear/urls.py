from django.conf.urls import url

from . import views

urlpatterns = [
    url(r'^$', views.signUpLogIn, name='signUp'),
    url(r'^headerSignIn/$', views.headerSignIn, name='headerSignIn'),
    url(r'^populate_db/$', views.populate_db_amazon, name='populate_db'),
    url(r'^like_outfit/$', views.like_outfit, name='like_outfit'),
    url(r'^follow_user/$', views.follow_user, name='follow_user'),
    url(r'^logout/$', views.logout, name='logout'),
    url(r'^headerSignUp/$', views.headerSignUp, name='headerSignUp'),
    url(r'^about$', views.about, name='about'),
    url(r'^contact$', views.contact, name='contact'),
    url(r'^addNew$', views.addNew, name='addNew'),
    url(r'user/(?P<pk>\d+)/?$', views.userProfile, name='userProfile'),
    url(r'outfit/(?P<pk>\d+)/?$', views.outfit_page, name='outfit_page'),
    url(r'clothing/(?P<pk>\d+)/?$', views.clothing_page, name='outfit_page'),
    url(r'^myCart$', views.myCart, name='myCart'),
    url(r'^get_product/', views.get_product, name='get_product'),
    url(r'^get_outfit_discover/', views.get_outfit_discover, name='get_outfit_discover'),
    url(r'^get_front_page/', views.get_front_page, name='get_front_page'),
    url(r'^change_profile_settings/', views.change_profile_settings, name='change_profile_settings'),
    url(r'^user_submit_outfit/', views.user_submit_outfit, name='user_submit_outfit'),
    url(r'^get_product_full/', views.get_product_full, name='get_product_full'),
    url(r'^add_to_cart_single/', views.add_to_cart_single, name='add_to_cart_single'),
    url(r'^add_to_cart_whole/', views.add_to_cart_whole, name='add_to_cart_whole'),
    url(r'^remove_from_cart/', views.remove_from_cart, name='remove_from_cart'),
    url(r'^discover/', views.discover, name='discover'),
    url(r'^terms/', views.terms, name='terms'),
]