
from rest_framework import permissions

    
class InPermGroup(permissions.BasePermission):
    
    def has_object_permission(self, request, view, obj):
        return request.user in obj.perm_group.all()