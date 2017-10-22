from django.http import HttpResponse
from scrape import build_html
from .models import *
from django.template import loader

def signUpLogIn(request):
    return HttpResponse("done")

def scrape_content(request):
    build_html("http://plrplr.com/48571/how-to-get-rid-of-acne-3-steps-toward-a-fair-complexion/")

    all_articles = article.objects.filter()
    template = loader.get_template('article.html')
    context = {'article': all_articles[0]}

    return HttpResponse(template.render(context, request))
