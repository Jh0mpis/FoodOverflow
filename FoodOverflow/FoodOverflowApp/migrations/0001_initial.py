# Generated by Django 4.2.10 on 2024-03-02 03:12

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('username', models.CharField(max_length=200, unique=True)),
                ('email', models.EmailField(max_length=200, unique=True)),
                ('active', models.BooleanField(default=False)),
                ('is_admin', models.BooleanField(default=False)),
                ('description', models.CharField(max_length=240)),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
