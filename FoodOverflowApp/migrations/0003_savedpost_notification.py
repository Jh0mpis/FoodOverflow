# Generated by Django 4.2.10 on 2024-04-29 03:14

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('FoodOverflowApp', '0002_avatar_profile_avatar_id'),
    ]

    operations = [
        migrations.CreateModel(
            name='SavedPost',
            fields=[
                ('saved_post_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('publication', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='FoodOverflowApp.publication')),
                ('recipe', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='FoodOverflowApp.recipe')),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('notification_id', models.BigAutoField(primary_key=True, serialize=False)),
                ('message', models.TextField()),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('publication', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='FoodOverflowApp.publication')),
                ('recipe', models.ForeignKey(default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='FoodOverflowApp.recipe')),
            ],
        ),
    ]
