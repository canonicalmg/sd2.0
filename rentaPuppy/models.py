from django.db import models

# Create your models here.

class dogs(models.Model):
    name = models.CharField(max_length=250)
    age = models.IntegerField(null=True, blank=True)
    breed = models.CharField(max_length=250, null=True, blank=True)
    weight = models.IntegerField(null=True, blank=True)
    description = models.CharField(max_length=2000, null=True, blank=True)
    location = models.CharField(max_length=250, null=True, blank=True)
    gender = models.BooleanField(default=True)  #male = True

    def __unicode__(self):
        return "%s - %s - %s" % (self.name, self.breed, self.location)

    def image_src(self):
        primary_image = dog_pictures.objects.get(dog__pk=self.pk, is_primary=True)
        return primary_image.img_src()

    def get_non_primary_pictures(self):
        non_primaries = dog_pictures.objects.filter(dog__pk=self.pk, is_primary=False)
        return non_primaries

    def get_slug(self):
        return "/catalog/%s-%s" % (self.name, self.pk)

    def get_tricks(self):
        tricks = dog_tricks.objects.filter(dog=self)
        return tricks

    def has_pictures(self):
        non_primaries = dog_pictures.objects.filter(dog__pk=self.pk, is_primary=False)
        if len(non_primaries) == 0:
            return False
        else:
            return True

    def has_tricks(self):
        tricks = dog_tricks.objects.filter(dog=self)
        if len(tricks) == 0:
            return False
        else:
            return True

    def get_gender_verbose(self):
        if self.gender == True:
           return "Male"
        else:
            return "Female"

    def get_gender_his_her(self):
        if self.gender == True:
            return "him"
        else:
            return "her"

class dog_pictures(models.Model):
    dog = models.ForeignKey(dogs)
    is_primary = models.BooleanField(default=False)
    image = models.ImageField(upload_to='gettingstarted/static/img')

    def __unicode__(self):
        return "%s. Primary(%s)" % (self.dog.name, self.is_primary)

    def make_primary(self):
        actual_dog = dogs.objects.get(dog=self.dog)
        current_primary = dog_pictures.objects.get(dog=actual_dog, is_primary=True)
        current_primary.is_primary=False
        current_primary.save()
        self.is_primary = True

    def img_src(self):
        print "image = ", str(self.image).split("gettingstarted/")[1]
        return str(self.image).split("gettingstarted/")[1]
        # return str(self.image).split("gettingstarted/")[1]

class dog_tricks(models.Model):
    dog = models.ForeignKey(dogs)
    trick_name = models.CharField(max_length=250)
