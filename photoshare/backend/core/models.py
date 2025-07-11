from django.db import models  
from django.contrib.auth.models import AbstractUser  

class User(AbstractUser):  
    bio = models.TextField(blank=True, max_length=500)  
    profile_pic = models.ImageField(upload_to='profiles/', blank=True)  
    followers = models.ManyToManyField('self', symmetrical=False, blank=True)  

class Photo(models.Model):  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    image = models.ImageField(upload_to='photos/')  
    caption = models.TextField(blank=True, max_length=1000)  
    created_at = models.DateTimeField(auto_now_add=True)  
    tags = models.JSONField(default=list, blank=True)  
    ai_description = models.TextField(blank=True)  

    def __str__(self):  
        return f"Photo by {self.user.username}"  

class Comment(models.Model):  
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE)  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    text = models.TextField(max_length=1000)  
    created_at = models.DateTimeField(auto_now_add=True)  

class Like(models.Model):  
    photo = models.ForeignKey(Photo, on_delete=models.CASCADE)  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    created_at = models.DateTimeField(auto_now_add=True)  

    class Meta:  
        unique_together = ('photo', 'user')  