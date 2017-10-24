from django.db import models
from django.contrib.auth.models import User
from django.template.defaultfilters import slugify


class live_document(models.Model):
    name = models.CharField(max_length=150)
    slug = models.CharField(max_length=150, blank=True, null=True)
    url = models.CharField(max_length=150)

    def __unicode__(self):
        return self.name

class category(models.Model):
    name = models.CharField(max_length=150)
    slug = models.CharField(max_length=150, blank=True, null=True)
    url = models.CharField(max_length=250, blank=True, null=True)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(category, self).save(*args, **kwargs)

    def get_articles(self):
        return article.objects.filter(category__id=self.id)

class article(models.Model):
    content = models.TextField()
    name = models.CharField(max_length=150)
    category = models.ManyToManyField(category)
    slug = models.CharField(max_length=150, blank=True, null=True)
    author = models.ForeignKey(User, blank=True, null=True)

    def __unicode__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super(article, self).save(*args, **kwargs)

