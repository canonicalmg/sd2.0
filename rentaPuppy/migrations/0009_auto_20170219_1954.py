# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-02-20 03:54
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rentaPuppy', '0008_auto_20170219_1950'),
    ]

    operations = [
        migrations.AlterField(
            model_name='dog_pictures',
            name='image',
            field=models.ImageField(upload_to=b'gettingstarted/static/img'),
        ),
    ]