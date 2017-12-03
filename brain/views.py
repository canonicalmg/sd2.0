from django.http import HttpResponse
from .models import *
from django.template import loader

def signUpLogIn(request):
    template = loader.get_template('index.html')
    context = {}
    return HttpResponse(template.render(context, request))


def submit_info_form(request):
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