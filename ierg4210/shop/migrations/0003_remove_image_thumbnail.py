# Generated by Django 3.2.12 on 2022-02-20 17:59

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0002_image_thumbnail'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='image',
            name='thumbnail',
        ),
    ]
