from django.http import HttpResponse
from scrape import build_article, get_articles_from_category, get_categories, scrape_content_from_categories
from .models import *
from django.template import loader

def signUpLogIn(request):
    return HttpResponse("done")

def get_category(request, category_slug):
    current_category = category.objects.get(slug=category_slug)
    article_list = current_category.get_articles()[:10]
    template = loader.get_template('category.html')
    context = {'category': current_category,
               'all_articles': article_list}

    return HttpResponse(template.render(context, request))

def get_article(request, category_slug, article_slug):
    current_article = article.objects.get(slug=article_slug)
    current_category = category.objects.get(slug=category_slug)
    template = loader.get_template('article.html')
    context = {'article': current_article,
               'category': current_category}

    return HttpResponse(template.render(context, request))

def scrape_content(request):
    # build_article("http://plrplr.com/48571/how-to-get-rid-of-acne-3-steps-toward-a-fair-complexion/")
    # get_articles_from_category("http://plrplr.com/category/acne/", "acne")
    # get_categories("http://plrplr.com/")
    scrape_content_from_categories()
    all_articles = article.objects.filter()
    template = loader.get_template('templates/article.html')
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
