# Generated by Django 3.2 on 2022-12-06 20:25

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('patients', '0004_auto_20221128_1719'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='patient',
            name='creditID',
        ),
    ]
