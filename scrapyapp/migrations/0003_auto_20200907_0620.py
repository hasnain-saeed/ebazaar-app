# Generated by Django 3.1 on 2020-09-07 06:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('scrapyapp', '0002_auto_20200907_0619'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='subscriber',
            unique_together={('product', 'email')},
        ),
    ]
