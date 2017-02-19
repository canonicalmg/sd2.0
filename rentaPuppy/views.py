from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.contrib.auth.models import User


def signUpLogIn(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))

def home(request):
    if request.user.is_authenticated():
        template = loader.get_template('home.html')
        context = {}
        return HttpResponse(template.render(context, request))
    else:
        #login
        return HttpResponseRedirect("/")

