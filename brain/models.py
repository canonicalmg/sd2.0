from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.core.validators import RegexValidator
from django.db import models


class freeSampleSubmission(models.Model):
    name = models.CharField(max_length=300, blank=True)
    email = models.CharField(max_length=300)
    address = models.CharField(max_length=300, blank=True)
    city = models.CharField(max_length=300, blank=True)
    state = models.CharField(max_length=300, blank=True)
    country = models.CharField(max_length=300, blank=True)

    def __unicode__(self):
        return self.email

class addToCartEmailSubmission(models.Model):
    name = models.CharField(max_length=300, blank=True)
    email = models.CharField(max_length=300)

    def __unicode__(self):
        return self.email