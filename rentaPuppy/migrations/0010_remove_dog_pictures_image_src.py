# -*- coding: utf-8 -*-
# Generated by Django 1.9.7 on 2017-02-20 04:11
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('rentaPuppy', '0009_auto_20170219_1954'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='dog_pictures',
            name='image_src',
        ),
    ]