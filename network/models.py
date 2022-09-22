from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    folowers = models.ManyToManyField(User, related_name="get_followed_profiles")