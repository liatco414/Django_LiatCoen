from rest_framework.mixins import *
from .models import *
from .serializers import *
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.response import Response
from core.utils import try_parse_int
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from core.permissions import IsOwnerOrModelPermissions
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.authtoken.models import Token
from rest_framework.reverse import reverse
from django.contrib.auth import login, logout
from rest_framework.authtoken.serializers import AuthTokenSerializer
from core.authentication import get_tokens_for_user
from rest_framework.filters import OrderingFilter, SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

# Create your views here.

@method_decorator(csrf_exempt, name='dispatch')
class AuthViewSet(ViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=['post', 'get'])
    def login(self, request):
        serializer = AuthTokenSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, _ = Token.objects.get_or_create(user=user)
        jwt = get_tokens_for_user(user)
        login(request, user)
        return Response({"token": token.key, 'jwt': jwt})

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated])
    def logout(self, request):
        try:
            logout(request)
            request.user.auth_token.delete()
        except:
            pass
        return Response({"message": "Logged out successfully"})

    @method_decorator(csrf_exempt, name='register')
    @action(detail=False, methods=['post'])
    def register(self, request):
        user_serializer = UserSerializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()
        
        profile_fields = {}
        profile_field_names = ['phone', 'country', 'city', 'street', 'house_number', 'bio', 'birth_date', 'profile_pic']
    
        for field in profile_field_names:
            if field in request.data:
                profile_fields[field] = request.data.get(field)
        
        profile, created = UserProfile.objects.get_or_create(user=user, defaults=profile_fields)
    
        return Response({
            'user': user_serializer.data,
            'profile': {
                'id': profile.id,
                'username': profile.user.username,
                'phone': profile.phone,
                'country': profile.country,
                'city': profile.city,
                'street': profile.street,
                'house_number': profile.house_number,
                'bio': profile.bio,
                'birth_date': profile.birth_date
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class UsersViewSet(ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

class PostView(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    filter_backends = [OrderingFilter, DjangoFilterBackend, SearchFilter]
    filterset_fields = ['author', 'title', 'text']
    search_fields = ['title', 'text']

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']: 
            return [IsOwnerOrModelPermissions()]  
        return [AllowAny()] 

    @action(detail=True, methods=['get', 'post'])
    def comments(self, request, pk=None):
        post = self.get_object()

        if request.method == 'GET':
            comments = Comment.objects.filter(post=post)  
            comments_serializer = CommentSerializer(comments, many=True)
            return Response(comments_serializer.data)

        elif request.method == 'POST':
            if not request.user.is_authenticated:
                return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)
            
            data = request.data.copy()
            data['post'] = post.id
            serializer = CommentSerializer(data=data, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

class CommentView(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsOwnerOrModelPermissions]



    def create(self, request, *args, **kwargs):
        data = request.data
        reply_to = data.get('reply_to')
        post_id = try_parse_int(data.get('post'))
        if reply_to:
            replied = Comment.objects.get(id=reply_to)
            if(
                replied and replied.post.id != post_id
            ):
                return Response({"error": "comment must be on the same post"}, status=400)
        
        return super().create(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        res = super().list(request, *args, **kwargs)

        # comments is a list
        comments = res.data

        # we want a dictionary {"1": {'title': 'nice'}}
        comments_dictioary = { comment["id"]:comment for comment in comments }

        root_comments = []

        for comment in comments:
            parent_id = comment['reply_to']
            if parent_id is None: 
                root_comments.append(comment)
            else:
                parent = comments_dictioary.get(parent_id)
                if parent:
                    if "replies" not in parent:
                        parent["replies"] = []
                    parent["replies"].append(comment)
        res.data = root_comments
        return res
    

class UserLikesViews(ModelViewSet):
    queryset = UserLikes.objects.all()
    serializer_class = UserLikesSerializer