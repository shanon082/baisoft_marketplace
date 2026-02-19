from django.contrib import admin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User
from businesses.models import Business

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Show role in the list view (very useful)
    list_display = ('username', 'email', 'role', 'business', 'is_staff', 'is_active')
    list_filter = ('role', 'business', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

    # This controls what fields appear when you click "Add user" or edit one
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
        ('Business & Role', {'fields': ('business', 'role')}),   
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'username',
                'email',
                'password1',
                'password2',
                'role',    
                'business',
                'is_staff',
                'is_active',
            ),
        }),
    )

    # Optional but nice: filter business choices if needed
    # def formfield_for_foreignkey(self, db_field, request, **kwargs):
    #     if db_field.name == 'business':
    #         kwargs['queryset'] = Business.objects.all()
    #     return super().formfield_for_foreignkey(db_field, request, **kwargs)



# @admin.register(Business)
# class BusinessAdmin(admin.ModelAdmin):
#     list_display = ('name', 'created_at')
#     search_fields = ('name',)