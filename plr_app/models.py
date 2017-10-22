from django.db import models
from django.contrib.auth.models import User


class article(models.Model):
    content = models.TextField()
    name = models.CharField(max_length=150)

    def __unicode__(self):
        return self.name

