# -*- coding: utf-8 -*-
# Generated by Django 1.10.6 on 2017-03-27 00:15
from __future__ import unicode_literals

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shareWear', '0005_auto_20170326_1713'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='test',
            name='user',
        ),
        migrations.DeleteModel(
            name='test',
        ),
    ]