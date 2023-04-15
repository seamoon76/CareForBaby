from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

class MyUserManager(BaseUserManager):

    def _create_user(self, staff_id, email, password, name, department, role, **extra_fields):

        if not staff_id:
            raise ValueError('User should have a staff id')
        email = self.normalize_email(email)
        if not email:
            raise ValueError('User should have a email')
        if not name:
            raise ValueError('User should have a name')
        if not department:
            raise ValueError('User should belong to a department')
        if not role:
            raise ValueError('User should be either nurse or admin')
        user = self.model(staff_id=staff_id, email=email, name=name, department=department, role=role, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, staff_id, email, password, name, department, role, **extra_fields):
        extra_fields.setdefault('is_staff', False)
        extra_fields.setdefault('is_superuser', False)
        return self._create_user(staff_id, email, password, name, department, role,**extra_fields)

    def create_superuser(self, staff_id, email, password, name, department, role, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self._create_user(staff_id, email, password, name, department, role, **extra_fields)




class MyUser(AbstractBaseUser, PermissionsMixin):

    staff_id = models.CharField(
        _("staff id"),
        max_length=150,
        unique=True,
        error_messages={
            "unique": _("A user with that username already exists."),
        },
    )
    email = models.EmailField(_("email address"), unique=True)
    openid = models.CharField(blank=True, null=True, max_length=200)
    name = models.CharField(max_length=10)
    department = models.CharField(max_length=30)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    ROLE_CHOICES = (
        ('NURSE', 'Nurse'),
        ('ADMIN', 'Admin'),
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
        
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )
    date_joined = models.DateTimeField(_("date joined"), default=timezone.now)

    objects = MyUserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "staff_id"
    REQUIRED_FIELDS = ["email", "role", "department", "name"]
