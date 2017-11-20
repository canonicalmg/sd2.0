from django.http import HttpResponse
from .models import *
from django.template import loader

def signUpLogIn(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))
