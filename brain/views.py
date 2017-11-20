from django.http import HttpResponse
from .models import *
from django.template import loader

def signUpLogIn(request):
    return HttpResponse("done")
