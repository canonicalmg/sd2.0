from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class profile(models.Model):
    user = models.ForeignKey(User)
    gender = models.BooleanField(default=True)
    profile_image = models.CharField(max_length=200, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)

    def __unicode__(self):
        return self.user.username

class clothing(models.Model):
    name = models.CharField(max_length=200, null=True, blank=True)
    carrier = models.CharField(max_length=100, null=True, blank=True)
    carrier_id = models.CharField(max_length=200, null=True, blank=True)
    small_url = models.CharField(max_length=300, null=True, blank=True)
    large_url = models.CharField(max_length=300, null=True, blank=True)
    gender = models.BooleanField(default=True)
    price = models.CharField(max_length=100, null=True, blank=True)
    aff_url = models.CharField(max_length=300, null=True, blank=True)
    color = models.CharField(max_length=100, null=True, blank=True)
    brand = models.CharField(max_length=200, null=True, blank=True)
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
    likes = models.IntegerField(default=0)
    canvas_height = models.CharField(max_length=50, null=True, blank=True)
    canvas_width = models.CharField(max_length=50, null=True, blank=True)

    def __unicode__(self):
        return self.profile.user.username + " - " + str(self.pk)

    def add_like(self):
        self.likes = self.likes + 1

    def remove_like(self):
        self.likes = self.likes - 1

    def does_user_like(self, given_profile):
        try:
            current_like_obj = profile_likes_outfit.objects.get(profile=given_profile,
                                                                outfit=self)
            return True
        except:
            return False

class outfit_item(models.Model):
    clothing = models.ForeignKey(clothing)
    outfit = models.ForeignKey(outfit)
    transform_matrix = models.CharField(max_length=300, null=True, blank=True)
    zIndex = models.CharField(max_length=100, default="1")

    def __unicode__(self):
        return self.outfit.profile.user.username + " - " + self.clothing.name

class profile_likes_outfit(models.Model):
    profile = models.ForeignKey(profile)
    outfit = models.ForeignKey(outfit)

    def __unicode__(self):
        return self.profile.user.username + " - " + self.outfit.description

    def save(self, *args, **kwargs):
        if not self.pk:
            print "inside save"
            self.outfit.add_like()
            self.outfit.save()
        super(profile_likes_outfit, self).save(*args, **kwargs)

    def delete(self):
        self.outfit.remove_like()
        self.outfit.save()
        super(profile_likes_outfit, self).delete()


