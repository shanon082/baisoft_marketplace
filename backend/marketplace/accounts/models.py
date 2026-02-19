from django.db import models
from django.contrib.auth.models import AbstractUser, BaseUserManager

class UserManager(BaseUserManager):
    def create_user(self, username, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email required')
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    email = models.EmailField(unique=True)
    business = models.ForeignKey('businesses.Business', on_delete=models.CASCADE, related_name='users', null=True, blank=True)
    role = models.CharField(max_length=20, choices=[
        ('viewer', 'Viewer'), ('editor', 'Editor'),
        ('approver', 'Approver'), ('admin', 'Admin')
    ], default='viewer')

    objects = UserManager()

    def __str__(self):
        return f"{self.username} ({self.role}) - {self.business}"