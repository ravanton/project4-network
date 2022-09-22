from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Profile(models.Model):
    user = models.ForeignKey(User, on_delete = models.CASCADE)
    folowers = models.ManyToManyField(User, related_name="get_followed_profiles")
    
    def serialize(self,user):
        return {
            "profile_id":self.user.id,
            "profile_username": self.user.username,
            "followers": self.followers.count(),
            "following": self.user.get_followed_profiles.count(),
            "currently_following": not user.is_anonymous and self in user.get_followed.profiles.all(),
            "follow_available":(not user.is_anonymous) and self.user != user
        }
    def __str__(self):
        followers_str = ""