from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken import views as auth_views


router = DefaultRouter()

router.register('admin', UsersViewSet, basename='admin')
router.register('', AuthViewSet, basename='auth')
router.register('articles', PostView, basename= 'posts')
router.register('user-profile', UserProfileView, basename='user-profile')
router.register('comments', CommentView, basename='comments')
router.register('likes', UserLikesViews, basename='likes')

urlpatterns = [
    path('', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),

    path('login/', auth_views.obtain_auth_token)
]

