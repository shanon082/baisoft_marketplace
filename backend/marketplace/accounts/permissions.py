from rest_framework import permissions

class IsSuperOrBusinessMember(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or (request.user.is_authenticated and request.user.business)

    def has_object_permission(self, request, view, obj):
        if request.user.is_superuser:
            return True
        return getattr(obj, 'business', None) == request.user.business

class CanManageProducts(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.role in ['admin', 'editor', 'approver']

class CanApprove(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_superuser or request.user.role in ['admin', 'approver']

class IsBusinessAdmin(permissions.BasePermission):
    message = "Only business administrators can manage users."

    def has_permission(self, request, view):
        if request.user.is_superuser:
            return True
        return (
            request.user.is_authenticated and
            request.user.business is not None and
            request.user.role == 'admin'
        )