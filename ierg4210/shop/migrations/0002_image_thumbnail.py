# Generated by Django 3.2.12 on 2022-02-20 16:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='image',
            name='thumbnail',
            field=models.ImageField(blank=True, null=True, upload_to='images/thumbnail/%Y/%m/%d'),
        ),
    ]
