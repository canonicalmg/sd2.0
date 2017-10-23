from django.http import HttpResponse
from scrape import build_article, get_articles_from_category
from .models import *
from django.template import loader

def signUpLogIn(request):
    return HttpResponse("done")

def scrape_content(request):
    # build_article("http://plrplr.com/48571/how-to-get-rid-of-acne-3-steps-toward-a-fair-complexion/")
    get_articles_from_category("http://plrplr.com/category/acne/", "acne")
    all_articles = article.objects.filter()
    template = loader.get_template('article.html')
    context = {'article': all_articles[0]}

    return HttpResponse(template.render(context, request))

def scrape_content_with_url(request, url, category):
    # hit url with /scrape/(what would be after category, separated by periods)/category

    # http://plrplr.com/category/acne/page/13/
    try:
        url_string = "http://plrplr.com/category/"
        url = url.split("-")
        for each_item in url:
            url_string += "%s/" % each_item
        get_articles_from_category(url_string, category)
    except:
        print "error, items formatted incorrectly"
        return HttpResponse("items may have been formatted improperly")

    return HttpResponse("done with offset scrape")
