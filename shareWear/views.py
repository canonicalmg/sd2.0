from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
import json
from .models import *
from django.contrib.auth.models import User


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

def catalog(request):
    template = loader.get_template('catalog.html')

    all_dogs = dogs.objects.filter()
    dog_list = []
    context = {"dog_list": json.dumps(dog_list),
               "all_dogs": all_dogs,}
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

