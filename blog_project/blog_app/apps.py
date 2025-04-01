from django.apps import AppConfig
from django.db.models.signals import post_save
from django.dispatch import receiver

# settings for our blog app

class BlogConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'blog_app'

    @receiver(post_save, sender='auth.User')
    def perform_add_user_to_users_group(sender, instance, created, **kwargs):

        # the import is nested inside the function
        from django.contrib.auth.models import Group, User
        from blog_app.models import UserProfile
        from rest_framework.authtoken.models import Token

        if not created:
            return
        group, _ = Group.objects.get_or_create(name='users')
        instance.groups.add(group)
        UserProfile.objects.get_or_create(user=instance)
        Token.objects.get_or_create(user=instance)
        instance.save()

        print(f'User {instance.username} added to group {group.name}')