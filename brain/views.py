from django.http import HttpResponse
from .models import *
from django.template import loader
from django.views.decorators.csrf import csrf_exempt

def signUpLogIn(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))

@csrf_exempt
def submit_info_form(request):  # todo fix csrf issue. Possibly because submitting over http
    print "inside submit"
    if request.is_ajax():
        if request.method == "POST":
            data = request.POST.getlist("data[]")
            new_request = freeSampleSubmission(name=data[0],
                                               email=data[1],
                                               address=data[2],
                                               city=data[3],
                                               state=data[4],
                                               country=data[5])
            new_request.save()
            print "obj created"
            print "data = ", data
            return HttpResponse("Success")
    return HttpResponse("Error")

@csrf_exempt
def submit_add_to_cart_email_form(request):
    if request.is_ajax():
        if request.method == "POST":
            print "inside post"
            data = request.POST.getlist("data[]")
            new_request = addToCartEmailSubmission(name=data[0], email=data[1])
            new_request.save()
            print "obj created"
            print "data = ", data
            return HttpResponse("Success")
    return HttpResponse("Error")

def add_to_cart(request):
    template = loader.get_template('add_to_cart.html')
    context = {}
    return HttpResponse(template.render(context,request))