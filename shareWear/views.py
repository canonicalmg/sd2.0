from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
import json
from .models import *
from django.contrib.auth.models import User
from amazon.api import AmazonAPI


def signUpLogIn(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))

def about(request):
    template = loader.get_template('about.html')
    context = {}
    return HttpResponse(template.render(context, request))

def contact(request):
    template = loader.get_template('contact.html')


    context = {}
    return HttpResponse(template.render(context, request))

def addNew(request):
    amazon = AmazonAPI('AKIAJOR5NTXK2ERTU6AQ',
                       'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                       'can037-20',
                       region="US")
    products = amazon.search_n(15, Keywords="Women's Shirts", SearchIndex="All")
    # print "product 1 = ", dir(products[1])
    # print "products = ", products
    # for i, product in enumerate(products):
    #     print "{0}. '{1}'".format(i, product.title)
    #     print "small img url = ", product.small_image_url
    template = loader.get_template('addNew.html')
    context = {"products": products}
    return HttpResponse(template.render(context, request))

def dog_page(request, name, pk):
    template = loader.get_template('dog-page.html')
    dog_object = dogs.objects.get(pk=pk)
    context = {"dog": dog_object,
               "tricks": dog_object.get_tricks}
    return HttpResponse(template.render(context, request))

def home(request):
    if request.user.is_authenticated():
        template = loader.get_template('home.html')
        context = {}
        return HttpResponse(template.render(context, request))
    else:
        #login
        return HttpResponseRedirect("/")

