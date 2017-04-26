from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
import json
from django.contrib.auth import authenticate,login, logout as auth_logout
from .models import *
from django.contrib.auth.models import User
# from amazon.api import AmazonAPI
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.views.decorators.csrf import csrf_exempt
from .models import *
import requests
import bottlenose
from bs4 import BeautifulSoup
import xmltodict
import ast
from social_django.models import *
import urllib
import urllib2
import datetime

def populate_db_amazon(request):
    try:
        amazon = bottlenose.Amazon('AKIAJOR5NTXK2ERTU6AQ',
                                   'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                                   'can037-20',
                                   MaxQPS=0.9
                                   )
        cloth_types = ["Shirt", "Pants", "Shoes"]
        gender = [
            "Women",
            # "Men"
        ]
        pages = [1,2,3,4,5,6,7,8,9,10]
        for each_gender in gender:
            for each_cloth_type in cloth_types:
                for each_page in pages:
                    product = amazon.ItemSearch(Keywords="%s's %s" % (each_gender, each_cloth_type),
                                                SearchIndex="All",
                                                ResponseGroup="Images, SalesRank, OfferFull, ItemAttributes",
                                                Availability="Available",
                                                paginate=True,
                                                ItemPage=each_page)
                    soup = BeautifulSoup(product, "xml")

                    newDictionary = xmltodict.parse(str(soup))
                    try:
                        for each_item in newDictionary['ItemSearchResponse']['Items']['Item']:
                            try:
                                current_clothing = clothing.objects.get(carrier='amazon',
                                                                        carrier_id=each_item['ASIN'])
                            except:
                                #clothing does not exist in db
                                try:
                                    if each_gender == "Women":
                                        gender_bool = True
                                    else:
                                        gender_bool = False
                                    new_clothing = clothing(name=each_item['ItemAttributes']['Title'],
                                                            carrier="amazon",
                                                            carrier_id=each_item['ASIN'],
                                                            small_url=each_item['SmallImage']['URL'],
                                                            large_url=each_item['LargeImage']['URL'],
                                                            gender=gender_bool,
                                                            price=each_item['OfferSummary']['LowestNewPrice']['FormattedPrice'],
                                                            color=each_item['ItemAttributes']['Color'],
                                                            brand=each_item['ItemAttributes']['Brand'],
                                                            aff_url=generate_amazon_link(each_item['ASIN']),
                                                            cloth_type=each_cloth_type)
                                    new_clothing.save()
                                    print "added item"
                                except Exception as e:
                                    print "error ", e
                                    pass
                    except Exception as e:
                        print "Error on upper try: ", e
        return HttpResponse("Success")
    except Exception as e:
        print "error ", e
        return HttpResponse("Error")

def populate_db(request):
    try:
        amazon = bottlenose.Amazon('AKIAJOR5NTXK2ERTU6AQ',
                                    'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                                    'can037-20',
                                   # Parser=lambda text: BeautifulSoup(text, 'xml')
                                    # region="US",
                                   MaxQPS=0.9
                                   )
        # cloth_types = ["Shirt", "Pants", "Shoes"]
        # gender = ["Women", "Men"]
        # for each_gender in gender:
        #         for each_cloth_type in cloth_types:
        product = amazon.ItemSearch(Keywords="Women's Shirt",
                                    SearchIndex="All",
                                    ResponseGroup="Images, SalesRank, OfferFull, ItemAttributes",
                                    Availability="Available",
                                    paginate=True,
                                    ItemPage=2)
        soup = BeautifulSoup(product, "xml")
        print soup

        newDictionary = xmltodict.parse(str(soup))
        for each_item in newDictionary['ItemSearchResponse']['Items']['Item']:
            print each_item
            print "_____"
                        # try:
                        #     current_clothing = clothing.objects.get(carrier='amazon',
                        #                                             carrier_id=each_item['ASIN'])
                        # except:
                        #     #clothing does not exist in db
                        #     try:
                        #         if each_gender == "Women":
                        #             gender_bool = True
                        #         else:
                        #             gender_bool = False
                        #         new_clothing = clothing(name=each_item['ItemAttributes']['Title'],
                        #                                 carrier="amazon",
                        #                                 carrier_id=each_item['ASIN'],
                        #                                 small_url=each_item['SmallImage']['URL'],
                        #                                 large_url=each_item['LargeImage']['URL'],
                        #                                 gender=gender_bool,
                        #                                 price=each_item['OfferSummary']['LowestNewPrice']['FormattedPrice'],
                        #                                 color=each_item['ItemAttributes']['Brand'],
                        #                                 brand=each_item['ItemAttributes']['Color'],
                        #                                 aff_url=generate_amazon_link(each_item['ASIN']),
                        #                                 cloth_type=each_cloth_type)
                        #         new_clothing.save()
                        #         print "added item"
                        #     except Exception as e:
                        #         print "error ", e
                        #         pass
            # print "item = ", each_item['ASIN']
            # print "img = ", each_item['SmallImage']['URL']
            # print "large = ", each_item['LargeImage']['URL']
            # print "offer summary = ", each_item['OfferSummary']['LowestNewPrice']['FormattedPrice']
            # print "url = ", generate_amazon_link(each_item['ASIN'])
            # print "title = ", each_item['ItemAttributes']['Title']
            # # response = amazon.ItemLookup(ItemId=each_item['ASIN'])
            # # print "response = ", response
            # print "________"



        # products = amazon.search_n(1, Keywords="Women's Shirt", SearchIndex="Apparel")
        # for each_product in products:
        #     print dir(each_product)
        #     print each_product.availability
        #     print each_product.availability_type
        #     print each_product.price_and_currency
        #     print each_product.list_price
        #     print each_product.formatted_price
        #     print each_product.get_parent

    #     for each_gender in gender:
    #         for each_cloth_type in cloth_types:
    #             products = amazon.search_n(99, Keywords=each_gender + "'s " + each_cloth_type, SearchIndex="Apparel")
    #             for each_product in products:
    #                 current_id = each_product.asin
    #                 current_carrier = "amazon"
    #                 print "price = ", each_product.price_and_currency
    #                 if each_product.price_and_currency[0] is not None:
    #                     try:
    #                         current_clothing = clothing.objects.get(carrier=current_carrier,
    #                                                                 carrier_id=current_id)
    #                     except:
    #                         #clothing does not exist in db
    #                         if gender == "Women":
    #                             gender_bool = True
    #                         else:
    #                             gender_bool = False
    #                         new_clothing = clothing(name=each_product.title,
    #                                                 carrier="amazon",
    #                                                 carrier_id=each_product.asin,
    #                                                 small_url=each_product.small_image_url,
    #                                                 large_url=each_product.large_image_url,
    #                                                 gender=gender_bool,
    #                                                 price=each_product.price_and_currency[0],
    #                                                 cloth_type=each_cloth_type)
    #                         new_clothing.save()
    #                         print "added item"
        return HttpResponse("Success")
    except Exception as e:
        print "error ", e
        return HttpResponse("Error")

def generate_amazon_link(ASIN):
    return "https://www.amazon.com/dp/%s/?tag=can037-20" % (ASIN)

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

def get_featured_outfits(current_profile):
    outfit_objs = outfit.objects.filter()
    outfits = get_outfit_items(outfit_objs, current_profile)
    return outfits

def get_new_outfits(current_profile):
    outfit_objs = outfit.objects.filter().order_by('-id')[:10]
    outfits = get_outfit_items(outfit_objs, current_profile)
    return outfits

def get_popular_outfits(current_profile):
    outfit_objs = outfit.objects.filter().order_by('-likes')[:10]
    outfits = get_outfit_items(outfit_objs, current_profile)
    return outfits

def get_tag_list(outfit):
    tag_arr = []
    for each_tag in outfit.tag_list.all():
        tag_arr.append(each_tag.word)
    return tag_arr

def get_outfit_items(outfits, current_profile):
    outfits_arr = []
    for each_outfit in outfits:
        outfit_items = outfit_item.objects.filter(outfit=each_outfit)
        inner_outfit = []
        for each_outfit_item in outfit_items:
            inner_outfit.append({"pk": each_outfit_item.pk,
                                 "transform": ast.literal_eval(each_outfit_item.transform_matrix,),
                                 "large_url": each_outfit_item.clothing.large_url,
                                 "zIndex": each_outfit_item.zIndex})
        is_following = each_outfit.profile.is_following(current_profile)
        outfits_arr.append({"outfit": inner_outfit,
                        "user": {"username": each_outfit.profile.user.username,
                                 "profile_img": each_outfit.profile.profile_image,
                                 "location": each_outfit.profile.location,
                                 "user_id": each_outfit.profile.pk,
                                 "is_following": is_following,
                                 "is_self": each_outfit.profile == current_profile},
                        "outfit_pk": each_outfit.pk,
                        "canvasHeight": each_outfit.canvas_height,
                        "canvasWidth": each_outfit.canvas_width,
                        "total_likes": each_outfit.likes,
                        "tags": get_tag_list(each_outfit),
                        "liked": each_outfit.does_user_like(current_profile),})
    return outfits_arr

def get_front_page(request):
    if request.user.is_authenticated():
        if request.method == "POST":
            if request.is_ajax():
                index = request.POST.get("index")
                current_profile = profile.objects.get(user=request.user)
                featured_outfits = get_featured_outfits(current_profile)
                popular_outfits = get_popular_outfits(current_profile)
                new_outfits = get_new_outfits(current_profile)

                print "index = ", index
                json_stuff = json.dumps({"featured": featured_outfits,
                                         "new": new_outfits,
                                         "popular": popular_outfits,})
                return HttpResponse(json_stuff, content_type="application/json")
    return HttpResponse("Error")

def signUpLogIn(request):
    if request.user.is_authenticated():
        #send them to /home
        template = loader.get_template('index.html')
        try:
            current_profile = profile.objects.get(user=request.user)

            context = {
                "current_profile": current_profile
            }
        except Exception as e:
            print "error ", e
            template = loader.get_template('headerLogin.html')
            context = {
                "asd": "asd"
            }
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
            #create tags
            tag_list = []
            for each_tag in items['tag']:
                try:
                    new_tag = tag.objects.get(word=each_tag)
                except:
                    new_tag = tag(word=each_tag)
                    new_tag.save()
                tag_list.append(new_tag)
            #create outfit
            new_outfit = outfit(profile=current_profile,
                                gender=items['gender'],
                                description=items['caption'],
                                canvas_height=items['canvasHeight'],
                                canvas_width=items['canvasWidth'])
            new_outfit.save()
            for each_tag in tag_list:
                new_outfit.tag_list.add(each_tag)
            new_outfit.save()

            #create outfit items
            for each_item in items['items']:
                current_clothing = clothing.objects.get(carrier_id = each_item['item_id'],
                                                        carrier=each_item['carrier'])
                new_item = outfit_item(clothing=current_clothing,
                                       outfit=new_outfit,
                                       transform_matrix=each_item['transform'],
                                       zIndex=each_item['zIndex'])
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
                                         'carrier': each_product.carrier,
                                         'price': each_product.price,
                                         'brand': each_product.brand})
            json_stuff = json.dumps({"products": product_list,
                                     "cloth_type": cloth_type,
                                     })
            return HttpResponse(json_stuff, content_type="application/json")
    return HttpResponse("Error")

@csrf_exempt
def get_outfit_discover(request):
    if request.is_ajax():
        if request.method == 'POST':
            current_profile = profile.objects.get(user=request.user)
            offset = int(request.POST.get('offset'))
            cloth_type = request.POST.get('cloth_type')
            current_gender = request.POST.get('gender')
            if current_gender == 'true':
                current_gender = True
            else:
                current_gender = False
            pagesize = 5
            print "cloth type = ", cloth_type
            print "gender = ", current_gender
            outfits = outfit.objects.filter(gender=current_gender)[offset:pagesize+offset]
            print "products = ", outfits
            print "offset = ", offset + len(outfits)
            product_list = []
            for each_product in outfits:
                    tag_list = []
                    for each_tag in each_product.tag_list.all():
                        tag_list.append(each_tag.word)
                    product_list.append({
                                         'user_pk': each_product.profile.pk,
                                         'username': each_product.profile.user.username,
                                         'userPhoto': each_product.profile.profile_image,
                                         'num_likes': each_product.likes,
                                         'has_liked': each_product.does_user_like(current_profile),
                                         'is_following': each_product.profile.is_following(current_profile),
                                         'description': each_product.description,
                                         'tags': tag_list,
                                         'brands': each_product.get_brands(),
                                         'pk': each_product.pk,
                                         'pictures': each_product.get_pictures(),
                                         'location': each_product.profile.location
                                         })
            json_stuff = json.dumps({"products": product_list,
                                     "cloth_type": cloth_type,
                                     "offset": offset + len(outfits)
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
    if request.user.is_authenticated():
        template = loader.get_template('addNew.html')
        current_profile = profile.objects.get(user=request.user)
        context = {
            "current_profile": current_profile
        }
    else:
        template = loader.get_template('headerLogin.html')
        context = {
        }
    return HttpResponse(template.render(context, request))

def discover(request):
    if request.user.is_authenticated():
        template = loader.get_template('discover.html')
        current_profile = profile.objects.get(user=request.user)
        outfits = outfit.objects.filter()
        context = {
            "current_profile": current_profile,
            "outfits": outfits
        }
    else:
        template = loader.get_template('headerLogin.html')
        context = {
        }
    return HttpResponse(template.render(context, request))

def myCart(request):
    if request.user.is_authenticated():
        template = loader.get_template('myCart.html')
        current_profile = profile.objects.get(user=request.user)
        all_cart_items = current_profile.cart_items.all()
        ASIN = ""

        outfit_clothes = []
        for each_item in all_cart_items:
            outfit_clothes.append({'large_url': each_item.clothing.large_url,
                                   'name': each_item.clothing.name,
                                   'carrier': each_item.clothing.carrier,
                                   'brand': each_item.clothing.brand,
                                   'price': each_item.clothing.price,
                                   'is_in_cart': each_item.clothing.is_in_cart(current_profile),
                                   'pk': each_item.clothing.pk,
                                   'outfit_pk': each_item.outfit.pk})
            ASIN = each_item.clothing.carrier_id
        if len(outfit_clothes) == 0:
            is_empty = True
        else:
            is_empty = False
        amazon = bottlenose.Amazon('AKIAJOR5NTXK2ERTU6AQ',
                           'kck/SKuTJif9bl7qeq5AyB4CU8HWsdz14VW4Iaz2',
                           'can037-20',
                           MaxQPS=0.9
                           )
        cart_link = None
        try:
            kwargs = {
                "Item.0.ASIN": ASIN,
                "Item.0.Quantity": 1
            }
            response = amazon.CartCreate(**kwargs)
            soup = BeautifulSoup(response, "xml")
            newDictionary = xmltodict.parse(str(soup))
            CartId = newDictionary['CartCreateResponse']['Cart']['CartId']
            HMAC = newDictionary['CartCreateResponse']['Cart']['HMAC']
            counter = 0
            kwargs = {"CartId": CartId,
                      "HMAC": HMAC}
            for each_item in all_cart_items:
                kwargs["Item."+str(counter)+".ASIN"] = each_item.clothing.carrier_id
                kwargs["Item."+str(counter)+".Quantity"] = 1
                counter += 1
            print "kwargs = ", kwargs
            response = amazon.CartAdd(**kwargs)
            print "response = ", response
            soup = BeautifulSoup(response, "xml")
            newDictionary = xmltodict.parse(str(soup))
            cart_link = newDictionary['CartAddResponse']['Cart']['PurchaseURL']
            print newDictionary['CartAddResponse']['Cart']['PurchaseURL']
        except Exception as e:
            print "error: ", e

        context = {
            "access_key": "AKIAJOR5NTXK2ERTU6AQ",
            "associate_tag": "can037-20",
            "signature": "AJmBIow2qBu5GtdtJcYo9y8glhexQgxolmcIJK2xnlQ=",
            "link": cart_link,
            "timestamp": datetime.datetime.utcnow().isoformat(),
            "current_profile": current_profile,
            "is_empty": is_empty,
            "all_clothing": outfit_clothes
        }
    else:
        template = loader.get_template('headerLogin.html')
        context = {
        }
    return HttpResponse(template.render(context, request))

@csrf_exempt
def like_outfit(request):
    if request.user.is_authenticated():
        if request.is_ajax():
            if request.method == 'POST':
                try:
                    outfit_key = request.POST.get('outfit')
                    current_outfit = outfit.objects.get(pk=outfit_key)
                    current_profile = profile.objects.get(user=request.user)
                    try:
                        current_like_obj = profile_likes_outfit.objects.get(profile=current_profile,
                                                                            outfit=current_outfit)
                        current_like_obj.delete()
                        return HttpResponse("Unlike")
                    except Exception as e:
                        current_like_obj = profile_likes_outfit(profile=current_profile,
                                                                outfit=current_outfit)
                        current_like_obj.save()
                        return HttpResponse("Like")
                except Exception as e:
                    print "Error ", e
    return HttpResponse("Error")

@csrf_exempt
def follow_user(request):
    if request.user.is_authenticated():
        if request.is_ajax():
            if request.method == 'POST':
                try:
                    profile_key = request.POST.get('user')
                    current_profile = profile.objects.get(user=request.user)
                    selected_profile = profile.objects.get(pk=profile_key)
                    try:
                        current_follow_obj = profile_follows.objects.get(profile_main=current_profile,
                                                                         profile_following=selected_profile)
                        current_follow_obj.delete()
                        return HttpResponse("Unfollow")
                    except Exception as e:
                        current_follow_obj = profile_follows(profile_main=current_profile,
                                                             profile_following=selected_profile)
                        current_follow_obj.save()
                        return HttpResponse("Follow")
                except Exception as e:
                    print "Error ", e
    return HttpResponse("Error")

@csrf_exempt
def add_to_cart_single(request):
    if request.user.is_authenticated():
        if request.is_ajax():
            if request.method == 'POST':
                try:
                    outfit_key = request.POST.get('outfit')
                    clothing_key = request.POST.get('clothing')
                    outfit_obj = outfit.objects.get(pk=outfit_key)
                    clothing_obj = clothing.objects.get(pk=clothing_key)
                    current_profile = profile.objects.get(user=request.user)
                    #looking to see if item is in cart. If so, remove from cart
                    cart_item = cartItems(clothing=clothing_obj, outfit=outfit_obj)
                    if current_profile.item_in_cart(cart_item):
                        print "in cart"
                        current_profile.remove_cart_item(cart_item)
                        return HttpResponse("Removed")

                    else:
                        #could not find item in cart, creating instead
                        new_item = cartItems(clothing=clothing_obj, outfit=outfit_obj)
                        new_item.save()
                        current_profile.cart_items.add(new_item)
                        current_profile.save()
                        return HttpResponse("Added")

                except Exception as e:
                    print "Error ", e
    return HttpResponse("Error")

@csrf_exempt
def add_to_cart_whole(request):
    if request.user.is_authenticated():
        if request.is_ajax():
            if request.method == 'POST':
                try:
                    outfit_key = request.POST.get('outfit')
                    outfit_obj = outfit.objects.get(pk=outfit_key)
                    current_profile = profile.objects.get(user=request.user)
                    returned_clothing_id_list = []

                    #get all clothes in outfit
                    clothes = outfit_obj.get_outfit_items()
                    for each_item in clothes:
                        #If item is not in cart, then add it to cart
                        cart_item = cartItems(clothing=each_item.clothing, outfit=outfit_obj)
                        if current_profile.item_in_cart(cart_item) == False:
                            new_item = cartItems(clothing=each_item.clothing, outfit=outfit_obj)
                            new_item.save()
                            current_profile.cart_items.add(new_item)
                            current_profile.save()
                            returned_clothing_id_list.append(each_item.clothing.pk)

                    json_stuff = json.dumps(returned_clothing_id_list)
                    return HttpResponse(json_stuff, content_type="application/json")
                    # return HttpResponse(returned_clothing_id_list)

                except Exception as e:
                    print "Error ", e
    return HttpResponse("Error")

@csrf_exempt
def remove_from_cart(request):
    if request.user.is_authenticated():
        if request.is_ajax():
            if request.method == 'POST':
                try:
                    outfit_key = request.POST.get('outfit')
                    clothing_key = request.POST.get('clothing')
                    outfit_obj = outfit.objects.get(pk=outfit_key)
                    clothing_obj = clothing.objects.get(pk=clothing_key)
                    current_profile = profile.objects.get(user=request.user)

                    cart_item = cartItems(outfit=outfit_obj, clothing=clothing_obj)
                    current_profile.remove_cart_item(cart_item)

                    if len(current_profile.cart_items.all()) == 0:
                        return HttpResponse("Removed, Empty")
                    else:
                        return HttpResponse("Removed")

                except Exception as e:
                    print "Error ", e
    return HttpResponse("Error")

def userProfile(request, pk):
    if request.user.is_authenticated():
        template = loader.get_template('userProfile.html')
        current_profile = profile.objects.get(pk=pk)
        current_profile_self = profile.objects.get(user=request.user)
        all_outfits = outfit.objects.filter(profile=current_profile)
        outfit_number = len(all_outfits)
        current_profile_outfits = get_outfit_items(all_outfits, current_profile)
        current_profile_json = {}
        print "IS FOLLOWING = ", current_profile.is_following(current_profile_self)
        if current_profile.user == request.user:
            current_profile_json = {
                'fullName': current_profile.full_name,
                'gender': current_profile.gender,
                'joinedDate': str(current_profile.joined_date),
                'email': current_profile.user.email,
                'website': current_profile.website,
                'location': current_profile.location,
                'description': current_profile.description,
                'displayFullName': current_profile.display_fullName,
                'displayGender': current_profile.display_gender,
                'displayJoinedDate': current_profile.display_joined_date,
                'displayEmail': current_profile.display_email,
                'displayWebsite': current_profile.display_website,
                'displayLocation': current_profile.display_location,
                'displayDescription': current_profile.display_description
            }
        context = {
            "current_profile": current_profile,
            "current_profile_self": current_profile_self,
            "is_following": current_profile.is_following(current_profile_self),
            "outfit_number": outfit_number,
            "is_self": current_profile.user == request.user,
            "outfits": json.dumps(current_profile_outfits),
            "current_profile_json": json.dumps(current_profile_json)
        }
    else:
        template = loader.get_template('headerLogin.html')
        context = {
        }
    return HttpResponse(template.render(context, request))

def outfit_page(request, pk):
    if request.user.is_authenticated():
        template = loader.get_template('outfitPage.html')
        current_outfit = outfit.objects.get(pk=pk)
        current_profile = current_outfit.profile
        current_profile_self = profile.objects.get(user=request.user)
        current_profile_outfits = get_outfit_items([current_outfit], current_profile_self)
        outfit_clothes = []
        outfit_items = outfit_item.objects.filter(outfit=current_outfit)
        for each_item in outfit_items:
            outfit_clothes.append({'large_url': each_item.clothing.large_url,
                                   'name': each_item.clothing.name,
                                   'carrier': each_item.clothing.carrier,
                                   'brand': each_item.clothing.brand,
                                   'price': each_item.clothing.price,
                                   'is_in_cart': each_item.clothing.is_in_cart(current_profile_self),
                                   'pk': each_item.clothing.pk})

        context = {
            "current_outfit": current_outfit,
            "current_outfit_in_cart": current_profile_self.outfit_in_cart(current_outfit),
            "current_profile": current_profile,
            "current_profile_self": current_profile_self,
            "outfits": json.dumps(current_profile_outfits),
            # "outfit_clothes": current_outfit.get_outfit_items()
            "outfit_clothes": outfit_clothes
        }
    else:
        template = loader.get_template('headerLogin.html')
        context = {
        }
    return HttpResponse(template.render(context, request))

def clothing_page(request, pk):
    if request.user.is_authenticated():
        template = loader.get_template('clothingPage.html')
        current_clothing = clothing.objects.get(pk=pk)
        current_profile_self = profile.objects.get(user=request.user)
        context = {
            "current_profile_self": current_profile_self,
            "current_clothing": current_clothing
        }
    else:
        template = loader.get_template('headerLogin.html')
        context = {
        }
    return HttpResponse(template.render(context, request))

@csrf_exempt
def change_profile_settings(request):
    if request.user.is_authenticated():
        if request.is_ajax():
            if request.method == 'POST':
                try:
                    data = json.loads(request.POST.get('data'))
                    print "data = ", data
                    current_profile = profile.objects.get(user=request.user)
                    for key in data:
                        print "%s, %s" % (key, data[key])
                        if key == "fullName":
                            current_profile.full_name = data[key]
                        if key == "gender":
                            current_profile.gender = data[key]
                        if key == "joinedDate":
                            current_profile.joined_date = data[key]
                        if key == "email":
                            current_profile.user.email = data[key]
                        if key == "website":
                            current_profile.website = data[key]
                        if key == "location":
                            current_profile.location = data[key]
                        if key == "description":
                            current_profile.description = data[key]
                        if key == "displayFullName":
                            current_profile.display_fullName = data[key]
                        if key == "displayGender":
                            current_profile.display_gender = data[key]
                        if key == "displayJoinedDate":
                            current_profile.display_joined_date = data[key]
                        if key == "displayEmail":
                            current_profile.display_email = data[key]
                        if key == "displayWebsite":
                            current_profile.display_website = data[key]
                        if key == "displayLocation":
                            current_profile.display_location = data[key]
                        if key == "displayDescription":
                            current_profile.display_description = data[key]

                        current_profile.save()

                    return HttpResponse("Success")

                except Exception as e:
                    print "Error ", e
                    return HttpResponse("Error")
    return HttpResponse("Error")

def save_profile(backend, user, response, *args, **kwargs):
    # if backend.name == 'twitter':
    print "user = ", user
    # profile = user.get_profile()
    social_media_profile_obj = UserSocialAuth.objects.filter(user=user)[0]
    print "profile obj = ", social_media_profile_obj
    try:
        current_profile = social_media_profile.objects.get(social_media=social_media_profile_obj)
        print "found current profile"
    except Exception as e:
        print "error: ", e
        profile_obj = profile(user=user)
        if backend == 'facebook':
            profile_obj.user.email = response.get('email')
        if backend == 'twitter':
            print "response = ", response
            profile_obj.user.email = response.get('email')
        profile_obj.save()

        new_social_media = social_media_profile(profile=profile_obj, social_media=social_media_profile_obj)
        new_social_media.save()
    print "profile = ", profile
    # if profile is None:
        # profile = profile(user_id=user.id)
        # print "profile does not exist"
    # profile.gender = response.get('gender')
    # profile.link = response.get('link')
    # profile.timezone = response.get('timezone')
    # profile.save()
    print "bang"

def social_user(backend, uid, user=None, *args, **kwargs):
    '''OVERRIDED: It will logout the current user
    instead of raise an exception '''

    provider = backend.name
    social = backend.strategy.storage.user.get_social_auth(provider, uid)
    if social:
        if user and social.user != user:
            logout(backend.strategy.request)
            #msg = 'This {0} account is already in use.'.format(provider)
            #raise AuthAlreadyAssociated(backend, msg)
        elif not user:
            user = social.user
    return {'social': social,
            'user': user,
            'is_new': user is None,
            'new_association': False}

def get_avatar(backend, strategy, details, response,
               user=None, *args, **kwargs):
    url = None
    if backend.name == 'facebook':
        print "response = ", response
        url = "http://graph.facebook.com/%s/picture?type=large"%response['id']
    if backend.name == 'twitter':
        print "response = ", response
        url = response.get('profile_image_url', '').replace('_normal','')
        print "url = ", url
    if backend.name == 'pinterest':
        print response
        if response.get('image'):
            url = response.get('image')
    if url:
        current_profile = profile.objects.get(user=user)
        current_profile.profile_image = url
        current_profile.save()
        # user.avatar = url
        # user.save()
    print "end of get avatar"


