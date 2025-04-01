from .models import Post, Comment, UserProfile, UserLikes
from rest_framework.serializers import ModelSerializer
from taggit.serializers import (TagListSerializerField,
                                TaggitSerializer)
from rest_framework.serializers import CurrentUserDefault
from rest_framework.serializers import HiddenField, SerializerMethodField
from rest_framework.serializers import ModelSerializer
from django.contrib.auth.models import User
from rest_framework.serializers import ValidationError
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers
from django.utils import timezone


def get_time_since(time):
    now = timezone.now()
    diff = now - time
    seconds = diff.total_seconds()
    minutes = seconds // 60
    hours = minutes // 60
    days = hours // 24
    weeks = days // 7
    months = days // 30
    years = days // 365

    if seconds < 60:
        return f"{int(seconds)} secs ago"
    elif minutes < 60:
        return f"{int(minutes)} mins ago"
    elif hours < 24:
        return f"{int(hours)} hours ago"
    elif days < 7:
        return f"{int(days)} days ago"
    elif weeks < 4:
        return f"{int(weeks)} weeks ago"
    elif months < 12:
        return f"{int(months)} months ago"
    else:
        return f"{int(years)} years ago"


class BlogTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token['name'] = user.username
        token['isadmin'] = user.is_superuser

        try:
            profile = UserProfile.objects.get(user=user)
            token['profile_id'] = profile.id 
        except UserProfile.DoesNotExist:
            token['profile_id'] = None  

        return token

    

class CurrentUserProfileDefault:
    requires_context = True
    
    def __call__(self, serializer_field):
        request = serializer_field.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            profile, created = UserProfile.objects.get_or_create(user=request.user)
            return profile
        return None

class CurrentUserDefault:
    requires_context = True
    
    def __call__(self, serializer_field):
        request = serializer_field.context.get('request')
        if request and hasattr(request, 'user'):
            return request.user
        return None


            

class PostSerializer(TaggitSerializer, ModelSerializer):
    author = HiddenField(default=CurrentUserDefault())
    author_id = SerializerMethodField()
    time_since_created = SerializerMethodField()
    time_since_updated = SerializerMethodField()
    
    class Meta:
        model = Post
        exclude = ['created_at', 'updated_at']

    def get_author_id(self, obj):
        return obj.author.id

    def get_time_since_created(self, obj):
        return get_time_since(obj.created_at)

    def get_time_since_updated(self, obj):
        return get_time_since(obj.updated_at)

class CommentSerializer(ModelSerializer):
    author = HiddenField(default=CurrentUserDefault())
    author_username = SerializerMethodField()
    author_id = SerializerMethodField()
    time_since_created = SerializerMethodField()
    time_since_updated = SerializerMethodField()
    
    class Meta:
        model = Comment
        exclude = ['created_at', 'updated_at']

    def get_author_id(self, obj):
        return obj.author.id

    def get_time_since_created(self, obj):
        return get_time_since(obj.created_at)

    def get_time_since_updated(self, obj):
        return get_time_since(obj.updated_at)
    
    def get_author_username(self, obj):
        return obj.author.user.username

    def create(self, validated_data):
        request = self.context.get('request')
        profile = UserProfile.objects.get_or_create(user=request.user)[0]
        validated_data['author'] = profile
        return super().create(validated_data)


class UserProfileSerializer(ModelSerializer):
    phone = serializers.CharField(max_length=20, required=True)
    country = serializers.CharField(max_length=100, required=True)
    city = serializers.CharField(max_length=100, required=True)
    street = serializers.CharField(max_length=255, required=True)
    house_number = serializers.CharField(max_length=10, required=True)
    username = serializers.CharField(source='user.username', read_only=True)
    time_since_created = SerializerMethodField()
    time_since_updated = SerializerMethodField()

    class Meta:
        model = UserProfile
        exclude = ['created_at', 'updated_at']

    def get_time_since_created(self, obj):
        return get_time_since(obj.created_at)

    def get_time_since_updated(self, obj):
        return get_time_since(obj.updated_at)

class UserLikesSerializer(ModelSerializer):
    time_since_created = SerializerMethodField()

    class Meta:
        model = UserLikes
        exclude = ['created_at']

    def get_time_since_created(self, obj):
        return get_time_since(obj.created_at)


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {
            'password': {'write_only': True, 'required': True},
            'id': {'read_only': True},
            'email': {'required': True},
            'username': {'required': True, 'min_length': 3},
        }

    def validate_password(self, value):
        if len(value) < 8: 
            raise ValidationError('Password must contain at least 8 characters')
        return value

    def validate(self, attrs):
        if attrs['password'] == attrs['username']:
            raise ValidationError('Password must be different from username')
        return super().validate(attrs)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for key, value in validated_data.items():
            setattr(instance, key, value)

        instance.set_password(password)
        instance.save()
        return instance



    def validate_password(self, value):
        if len(value) < 8: 
            raise ValidationError('Password must contain at leat 8 characters')
        return value
    
    def validate(self, attrs):
        if attrs['password'] == attrs['username']:
            raise ValidationError('Password mut be different from username')
        return super().validate(attrs)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance:User, validated_data):
        # instance is a user object
        # validated_data is a dictionary from the request
        # נחלץ את הסיסמא מהמילון של הערכים המאומתים
        password = validated_data.pop('password', None)
        # לולאה על כל הערכים במילון והוספה שלהם לאובייקט
        for key, value in validated_data.items():
            setattr(instance, key, value)
            
        instance.set_password(password)
        instance.save()
        return instance
