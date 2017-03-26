from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
import json
from django.contrib.auth import authenticate,login, logout as auth_logout
from .models import *
from django.contrib.auth.models import User
from amazon.api import AmazonAPI
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import csrf_exempt
from .models import *

def populate_db(request):
    try:
        amazon = AmazonAPI('AKIAJOR5NTXK2ERTU6AQ',
                           'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                           'can037-20',
                           region="US")
        cloth_types = ["Shirt", "Pants", "Shoes"]
        gender = ["Women", "Men"]

        # products = amazon.search_n(1, Keywords="Women's Shirt", SearchIndex="Apparel")
        # for each_product in products:
        #     print dir(each_product)
        #     print each_product.availability
        #     print each_product.availability_type
        #     print each_product.price_and_currency
        #     print each_product.list_price
        #     print each_product.formatted_price
        #     print each_product.get_parent

        for each_gender in gender:
            for each_cloth_type in cloth_types:
                products = amazon.search_n(99, Keywords=each_gender + "'s " + each_cloth_type, SearchIndex="Apparel")
                for each_product in products:
                    current_id = each_product.asin
                    current_carrier = "amazon"
                    print "price = ", each_product.price_and_currency
                    if each_product.price_and_currency[0] is not None:
                        try:
                            current_clothing = clothing.objects.get(carrier=current_carrier,
                                                                    carrier_id=current_id)
                        except:
                            #clothing does not exist in db
                            if gender == "Women":
                                gender_bool = True
                            else:
                                gender_bool = False
                            new_clothing = clothing(name=each_product.title,
                                                    carrier="amazon",
                                                    carrier_id=each_product.asin,
                                                    small_url=each_product.small_image_url,
                                                    large_url=each_product.large_image_url,
                                                    gender=gender_bool,
                                                    price=each_product.price_and_currency[0],
                                                    cloth_type=each_cloth_type)
                            new_clothing.save()
                            print "added item"
        return HttpResponse("Success")
    except Exception as e:
        print "error ", e
        return HttpResponse("Error")

def logout(request):
    auth_logout(request)
    return HttpResponseRedirect("/")

@csrf_exempt
def headerSignIn(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.getlist("data[]")
            print "data = ", data

            user = authenticate(username=str(data[0]), password=str(data[1]))
            if user is not None:
                if user.is_active:
                    login(request, user)
                    return HttpResponse("Success")
            else:
                return HttpResponse("Does not match")

@csrf_exempt
def headerSignUp(request):
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.getlist("data[]")
            try:
                user = User.objects.create_user(username=str(data[0]),
                                                email=str(data[2]),
                                                password=str(data[1]))
                gender = data[3]
                if gender == "true":
                    gender = True
                else:
                    gender = False
                #create profile
                profile_obj = profile(user=user,
                                      gender=gender)
                profile_obj.save()
            except Exception as e:
                print "e = ", str(e)
                if str(e) == "column username is not unique":
                    return HttpResponse("Username Exists")

            if user is not None:
                if profile_obj is not None:
                    if user.is_active:
                        login(request, user)
                        return HttpResponse("Success")
            else:
                return HttpResponse("Does not match")

def signUpLogIn(request):
    if request.user.is_authenticated():
        #send them to /home
        template = loader.get_template('index.html')
    else:
        template = loader.get_template('headerLogin.html')
    context = {
        "asd": "asd"
    }
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
def user_submit_outfit(request):
    if request.is_ajax():
        if request.method == 'POST':
            items = request.POST.getlist('data[]')
            items = json.loads(items[0])
            print "items = ", items['caption']
            if not request.user.is_authenticated:
                print "error: user needs to sign up"
                return HttpResponse("SignUp")
            current_profile = profile.objects.get(user=request.user)
            #create outfit
            new_outfit = outfit(profile=current_profile,
                               gender=items['gender'],
                               description=items['description'],
                               tags=items['tags'])
            new_outfit.save()

            #create outfit items
            for each_item in items['items']:
                current_clothing = clothing.objects.get(carrier_id = each_item['item_id'],
                                                        carrier=each_item['carrier'])
                new_item = outfit_item(clothing=current_clothing,
                                       outfit=new_outfit,
                                       transform_matrix=each_item['transform'])
                new_item.save()


            json_stuff = json.dumps({"success":"yes"})
            return HttpResponse(json_stuff, content_type="application/json")
    return HttpResponse("Error")

@csrf_exempt
def get_product(request):
    if request.is_ajax():
        if request.method == 'POST':
            cloth_type = request.POST.get('cloth_type')

            # amazon = AmazonAPI('AKIAJOR5NTXK2ERTU6AQ',
            #                    'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
            #                    'can037-20',
            #                    region="US")
            # products = amazon.search_n(15, Keywords="Women's " + cloth_type, SearchIndex="Apparel")
            current_gender = request.POST.get('gender')
            if current_gender == 'true':
                current_gender = True
            else:
                current_gender = False
            print "cloth type = ", cloth_type
            print "gender = ", current_gender
            products = clothing.objects.filter(gender=current_gender,
                                              cloth_type=cloth_type,
                                              )
            print "products = ", products
            product_list = []
            for each_product in products:
                if (each_product.small_url is not None) and (each_product.large_url is not None):
                    product_list.append({'small_url': each_product.small_url,
                                         'cloth_type': cloth_type,
                                         'item_id': str(each_product.carrier_id),
                                         'large_url': each_product.large_url,
                                         'carrier': each_product.carrier})
            json_stuff = json.dumps({"products": product_list,
                                     "cloth_type": cloth_type,
                                     })
            return HttpResponse(json_stuff, content_type="application/json")
    return HttpResponse("Error")

@csrf_exempt
def get_product_full(request):
    if request.is_ajax():
        if request.method == 'POST':
            try:
                cloth_type = request.POST.get('cloth_type')
                amazon = AmazonAPI('AKIAJOR5NTXK2ERTU6AQ',
                                   'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                                   'can037-20',
                                   region="US")
                products = amazon.search_n(99, Keywords="Women's " + cloth_type, SearchIndex="Apparel")
                product_list = []
                for each_product in products:
                    if each_product.small_image_url is not None:
                        product_list.append({'small_url': each_product.small_image_url,
                                             'cloth_type': cloth_type,
                                             'item_id': str(each_product.asin),
                                             'large_url': each_product.large_image_url,
                                             'carrier': each_product.carrier})
                json_stuff = json.dumps({"products": product_list,
                                         "cloth_type": cloth_type})
                return HttpResponse(json_stuff, content_type="application/json")
            except Exception as e:
                print "Error ", e
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

