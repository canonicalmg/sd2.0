from bs4 import BeautifulSoup
import urllib2
from .models import *
from django.template.defaultfilters import slugify

# def scrape_page():
#     build_html("http://plrplr.com/48571/how-to-get-rid-of-acne-3-steps-toward-a-fair-complexion/")

class build_html():

    def __init__(self, page):
        # given some html page, get all content including title, remove extraneous html and word-count
        page_content = self.get_html_content(page)

        self.add_to_db(page_content['title'],
                       page_content['content'],
                       page_content['category'])

    def get_html_content(self, page):
        page_html = urllib2.urlopen(page)

        # get page
        soup = BeautifulSoup(page_html, 'html5lib')
        title = soup.find('h1', attrs={'class': 'entry-title'})
        content = soup.find('div', attrs={'class': 'entry-content'})
        page_category = soup.find('footer', attrs={'class': 'entry-meta'})

        # remove extraneous html and word-count
        content = content.text.encode('UTF-8', 'ignore').split("\n Word count: ")[0]
        page_category = page_category.find_all('a')
        page_category_arr = []
        for each_item in page_category:
            print each_item.text
            page_category_arr.append(each_item.text)

        return {"title": title.text,
                "content": content,
                "category": page_category_arr}

    def add_to_db(self, title, content, page_category):
        article_item, created = article.objects.get_or_create(slug=slugify(title))
        if created:
            article_item.name = title
            article_item.content = content
            for each_item in page_category:
                print "on page cat: ", each_item
                current_cat, was_created = category.objects.get_or_create(name=each_item.lower())
                if was_created:
                    print "category created"
                    current_cat.save()
                article_item.category.add(current_cat)
            print "article created"
        else:
            for each_item in page_category:
                print "on page cat: ", each_item
                current_cat, was_created = category.objects.get_or_create(name=each_item.lower())
                if was_created:
                    print "category created"
                    current_cat.save()
                article_item.category.add(current_cat)

        article_item.save()


