from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
import json
from .models import *
from django.contrib.auth.models import User
from amazon.api import AmazonAPI
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import csrf_exempt



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

@csrf_exempt
def get_product(request):
    if request.is_ajax():
        if request.method == 'POST':
            amazon = AmazonAPI('AKIAJOR5NTXK2ERTU6AQ',
                               'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                               'can037-20',
                               region="US")
            products = amazon.search_n(15, Keywords="Women's Shirts", SearchIndex="Apparel")
            product_list = []
            for each_product in products:
                if each_product.small_image_url is not None:
                    product_list.append({'small_url': each_product.small_image_url})
            json_stuff = json.dumps({"products": product_list})
            return HttpResponse(json_stuff, content_type="application/json")
    return HttpResponse("Error")

@csrf_exempt
def get_product_full(request):
    if request.is_ajax():
        if request.method == 'POST':
            amazon = AmazonAPI('AKIAJOR5NTXK2ERTU6AQ',
                               'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                               'can037-20',
                               region="US")
            products = amazon.search_n(100, Keywords="Women's Shirts", SearchIndex="Apparel")
            product_list = []
            for each_product in products:
                if each_product.small_image_url is not None:
                    product_list.append({'small_url': each_product.small_image_url})
            json_stuff = json.dumps({"products": product_list})
            return HttpResponse(json_stuff, content_type="application/json")
    return HttpResponse("Error")

def addNew(request):
    # amazon = AmazonAPI('AKIAJOR5NTXK2ERTU6AQ',
    #                    'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
    #                    'can037-20',
    #                    region="US")
    # products = amazon.search_n(10, Keywords="Women's Shirts", SearchIndex="Apparel")
    # print "product 1 = ", dir(products[1])
    # print "products = ", products
    # for i, product in enumerate(products):
    #     print "{0}. '{1}'".format(i, product.title)
    #     print "small img url = ", product.small_image_url
    # for each_product in products:
    #     print each_product.small_image_url
    #     if each_product.small_image_url == None:
    #         products.remove(each_product)
    #         print "REMOVED PRODUCT"
    #
    # for each_product in products:
    #     print type(each_product.small_image_url)
    #     print each_product.small_image_url
    template = loader.get_template('addNew.html')
    context = {}
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

