from bs4 import BeautifulSoup
import urllib2
from .models import *
from django.template.defaultfilters import slugify
import time


class get_articles_from_category():

    def __init__(self, category_url, category_name):
        # given some category URL, crawl through all pages and retrieve urls of articles
        page = 0
        next_page = category_url
        while next_page != None:
            next_page = self.collect_articles(next_page, category_name)
            time.sleep(0.5)
            page += 1
            print "on page ", page

    def collect_articles(self, category_url, category_name):
        page_html = urllib2.urlopen(category_url)

        # get page
        soup = BeautifulSoup(page_html, 'html5lib')
        each_article = soup.find_all('article')

        # build live articles
        for each in each_article:
            doc_item = each.find('h1', attrs={'class': 'entry-title'}).find('a')
            self.build_live_doc(doc_item.text, doc_item['href'], category_name)

        # get next page
        try:
            next_page = soup.find('div', attrs={'class': 'nav-previous'}).find('a')['href']
        except:
            next_page = None
        print "next page = ", next_page
        return next_page



    def build_live_doc(self, name, url, category_name):
        live_doc, created = live_document.objects.get_or_create(slug=slugify(name))
        if created:
            live_doc.name = name
            live_doc.url = url
            live_doc.save()
            print "live doc created"


class build_article():

    def __init__(self, page):
        # given some html page, get all content including title, remove extraneous html and word-count
        page_content = self.get_html_content(page)

        # add article to database
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
                current_cat, was_created = category.objects.get_or_create(name=each_item.lower())
                if was_created:
                    current_cat.save()
                article_item.category.add(current_cat)
        else:
            for each_item in page_category:
                current_cat, was_created = category.objects.get_or_create(name=each_item.lower())
                if was_created:
                    current_cat.save()
                article_item.category.add(current_cat)

        article_item.save()


