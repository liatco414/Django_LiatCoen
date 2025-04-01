from rest_framework import permissions
from rest_framework.permissions import BasePermission
from rest_framework.permissions import DjangoModelPermissions

class IsOwnerOrModelPermissions(DjangoModelPermissions):

    def has_object_permission(self, request, view, obj):
        if (
            request.method in permissions.SAFE_METHODS 
            and super().has_permission(request, view)
        ):
            return True
    
        return (
            obj.author == request.user
            or request.user.is_superuser
            or request.user.groups.filter(name='moderators').exists()
        )


class IsAdminOrModerator(BasePermission):
    def has_permission(self, request, view):
        is_admin = (
            request.user and
            request.user.is_authenticated and request.user.is_superuser
        )
        if is_admin:
            return True
        
        in_moderators_group = (
            request.user and
            request.user.is_authenticated and request.user.groups.filter(name='moderators').exists()
        )
        return in_moderators_group
    
class IsOwnerOrReadOnly(BasePermission):
    def has_object_permission(self, request, view, obj):
        # GET is allowed
        if request.method in permissions.SAFE_METHODS:
            return True
        # posts and comments has attribute author
        if hasattr(obj, 'author'):
            return obj.author.user == request.user
        return False