from django.core.management.base import BaseCommand, CommandError
from django.core.management import call_command
import json
from pprint import pprint
from plr_app.models import *
from django.template.defaultfilters import slugify

class Command(BaseCommand):
    help = 'Create articles from articles.json in root directory'

    def handle(self, *args, **options):
        self.import_categories()
        self.import_articles()


    def import_categories(self):
        data = json.load(open("category.json"))
        for i in xrange(len(data)):
            self.create_category(data[i])
            data.pop(i) #  cannot pop with index based reference

        open("category.json", "w").write(
            json.dumps(data, indent=4, separators=(',', ': '))
        )

    def import_articles(self):
        data = json.load(open("article.json"))
        for i in xrange(len(data)):
            self.create_article(data[i])
            data.pop(i) #  cannot pop with index based reference

        open("article.json", "w").write(
            json.dumps(data, indent=4, separators=(',', ': '))
        )

    def create_category(self, category_json):
        current_category, created = category.objects.get_or_create(slug=category_json['fields']['slug'])
        if created:
            current_category.name = category_json['fields']['name']
            current_category.slug = slugify(category_json['fields']['name'])
            current_category.save()
        pprint(current_category)

    def create_article(self, article_json):
        pprint(article_json)
        print article_json['fields']['slug']
        current_article, created = article.objects.get_or_create(slug=article_json['fields']['slug'])
        if created:
            current_article.content = article_json['fields']['content']
            current_article.name = article_json['fields']['name']
            for each_cat in article_json['fields']['category']:
                current_cat = category.objects.get(pk=each_cat)
                current_article.category.add(current_cat)
            current_article.save()
        pprint(current_article)

