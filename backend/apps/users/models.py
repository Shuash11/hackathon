from django.contrib.auth.models import AbstractUser
from django.db import models

from apps.core.models import TimeStampedModel
from .managers import UserManager


class User(TimeStampedModel, AbstractUser):
    class Role(models.TextChoices):
        ADMIN = "admin", "Admin"
        USER = "user", "User"

    username = None
    email = models.EmailField(unique=True)
    google_subject = models.CharField(max_length=255, unique=True, null=True, blank=True)
    role = models.CharField(max_length=10, choices=Role.choices, default=Role.USER)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []
    objects = UserManager()

    @property
    def is_admin(self) -> bool:
        return self.role == self.Role.ADMIN

    def __str__(self) -> str:
        return self.email
