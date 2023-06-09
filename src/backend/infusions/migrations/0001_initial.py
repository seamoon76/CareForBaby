# Generated by Django 3.2 on 2022-11-09 14:46

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('patients', '0002_alter_patient_complications'),
    ]

    operations = [
        migrations.CreateModel(
            name='InfusionEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField(blank=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('drug', models.CharField(max_length=200)),
                ('dose', models.DecimalField(decimal_places=2, max_digits=5)),
                ('equipments', models.JSONField()),
                ('vein', models.CharField(max_length=200)),
                ('tips', models.TextField(blank=True)),
                ('patient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='patients.patient')),
                ('performer', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='performer', to=settings.AUTH_USER_MODEL)),
                ('perm_group', models.ManyToManyField(related_name='perm_group_member', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
