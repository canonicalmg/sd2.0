from django.db import models
from django.contrib.auth.models import User
from social_django.models import *

# Create your models here.

class profile(models.Model):
    user = models.ForeignKey(User)
    gender = models.BooleanField(default=True)
    profile_image = models.CharField(max_length=200, null=True, blank=True)
    location = models.CharField(max_length=100, null=True, blank=True)
    full_name = models.CharField(max_length=100, null=True, blank=True)
    joined_date = models.DateTimeField(auto_now_add=True)
    website = models.CharField(max_length=100, null=True, blank=True)
    description = models.CharField(max_length=300, null=True, blank=True)

    display_fullName = models.BooleanField(default=True)
    display_gender = models.BooleanField(default=True)
    display_joined_date = models.BooleanField(default=True)
    display_email = models.BooleanField(default=True)
    display_website = models.BooleanField(default=True)
    display_location = models.BooleanField(default=True)
    display_description = models.BooleanField(default=True)

    def __unicode__(self):
        return self.user.username

    def num_following(self):
        following = profile_follows.objects.filter(profile_main=self)
        return len(following)

    def num_followers(self):
        followers = profile_follows.objects.filter(profile_following=self)
        return len(followers)

    def is_following(self, current_profile):
        try:
            current_follow_obj = profile_follows.objects.get(profile_main=current_profile,
                                                             profile_following=self)
            return True
        except Exception as e:
            print "error ", e
            return False

    def gender_verbose(self):
        if self.gender:
            return "Female"
        else:
            return "Male"

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

class tag(models.Model):
    word = models.CharField(max_length=35)

    def __unicode__(self):
        return self.word

class outfit(models.Model):
    profile = models.ForeignKey(profile)
    gender = models.BooleanField(default=True)
    description = models.CharField(max_length=300, null=True, blank=True)
    # tags = models.CharField(max_length=300, null=True, blank=True)
    likes = models.IntegerField(default=0)
    canvas_height = models.CharField(max_length=50, null=True, blank=True)
    canvas_width = models.CharField(max_length=50, null=True, blank=True)
    tag_list = models.ManyToManyField(tag)

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

    def get_outfit_items(self):
        outfit_items = outfit_item.objects.filter(outfit=self)
        return outfit_items

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

class profile_follows(models.Model):
    #Model indicates that profile_main is following profile_following.
    profile_main = models.ForeignKey(profile, related_name='profile_main')
    profile_following = models.ForeignKey(profile, related_name='profile_following')

    def __unicode__(self):
        return self.profile_main.user.username + " -> " + self.profile_following.user.username

class social_media_profile(models.Model):
    profile = models.ForeignKey(profile, related_name='profile')
    social_media = models.ForeignKey(UserSocialAuth, related_name='social_media')

class cartItems(models.Model):
    clothing = models.ForeignKey(clothing)
    outfit = models.ForeignKey(outfit)

    def __unicode__(self):
        return self.clothing.name + " " + self.clothing.price


