from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinLengthValidator, MaxLengthValidator, RegexValidator
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


STATUS_CHOICES = [
    ('draft', 'Draft'),
    ('published', 'Published'),
    ('archived', 'Archived')
]

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=20, default='0555555555')
    country = models.CharField(max_length=100, default='Israel')
    city = models.CharField(max_length=100, default='Tel-Aviv')
    street = models.CharField(max_length=255, default='somewhere')
    house_number = models.CharField(max_length=10, default='1')
    bio = models.TextField(blank=True, null=True ,max_length=1000)
    profile_pic = models.ImageField(upload_to='profile_pic', blank=True, null=True, default='./img/pp_user.jpeg')
    birth_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'{self.user.username}'
    
    def time_since_created(self):
        return get_time_since(self.created_at)

    def time_since_updated(self):
        return get_time_since(self.updated_at)
    

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, unique=True, validators=[
        MinLengthValidator(2),
        MaxLengthValidator(100),
        RegexValidator( 
            regex='^[a-zA-Z].*$',
            message="Title must start with a letter"
        )
    ])
    subtitle = models.TextField(
        validators=[
            MinLengthValidator(5)
        ],
        default="News around the world"
    )
    image = models.ImageField(upload_to='post_images/', blank=True, null=True)
    image_url = models.URLField(max_length=200, blank=True, null=True)
    text = models.TextField(
        validators=[
            MinLengthValidator(10)
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    def __str__(self):
        return f'{self.title} by {self.author.username}'
    
    def time_since_created(self):
        return get_time_since(self.created_at)

    def time_since_updated(self):
        return get_time_since(self.updated_at)
    

class Comment(models.Model):
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    text = models.TextField(
        validators=[
            MinLengthValidator(2)
        ]
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    reply_to = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        default=None,
        null=True,
        blank=True
    )

    def __str__(self):
        return f'{self.text} by {self.author.user.username}'

    def time_since_created(self):
        return get_time_since(self.created_at)

    def time_since_updated(self):
        return get_time_since(self.updated_at)
    
    @property
    def author_username(self):
        return self.author.user.username if self.author else None


LIKE_CHOICES = [
    ('like', 'Like'),
    ('dislike', 'Dislike')
]

class UserLikes(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    like_type = models.CharField(
        choices=LIKE_CHOICES,
        max_length=10,
        default='like'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'post']

    def __str__(self):
        return f'{self.user.user.username} {self.like_type}d {self.post.title}'

    def time_since_created(self):
        return get_time_since(self.created_at)
