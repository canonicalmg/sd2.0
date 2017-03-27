from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class profile(models.Model):
    user = models.ForeignKey(User)
    gender = models.BooleanField(default=True)

    def __unicode__(self):
        return self.user.username

class clothing(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    carrier = models.CharField(max_length=100, null=True, blank=True)
    carrier_id = models.CharField(max_length=100, null=True, blank=True)
    small_url = models.CharField(max_length=300, null=True, blank=True)
    large_url = models.CharField(max_length=300, null=True, blank=True)
    gender = models.BooleanField(default=True)
    price = models.CharField(max_length=100, null=True, blank=True)
    aff_url = models.CharField(max_length=300, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=100, null=True, blank=True)
    cloth_type = models.CharField(max_length=100, null=True, blank=True)

    def __unicode__(self):
        if self.gender == True:
            gender_verbose = "Female"
        else:
            gender_verbose = "Male"
        return "%s %s - %s(%s, %s)" % (gender_verbose, self.cloth_type, self.name, self.carrier, self.price)


class outfit(models.Model):
    profile = models.ForeignKey(profile)
    gender = models.BooleanField(default=True)
    description = models.CharField(max_length=300, null=True, blank=True)
    tags = models.CharField(max_length=300, null=True, blank=True)

class outfit_item(models.Model):
    clothing = models.ForeignKey(clothing)
    outfit = models.ForeignKey(outfit)
    transform_matrix = models.CharField(max_length=300, null=True, blank=True)