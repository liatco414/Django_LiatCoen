# Generated by Django 5.1.6 on 2025-03-26 20:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blog_app', '0010_alter_userprofile_bio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='userprofile',
            name='bio',
            field=models.TextField(blank=True, max_length=1000, null=True),
        ),
    ]
