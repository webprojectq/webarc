from rest_framework import generics, permissions, status  
from rest_framework.response import Response  
from .models import Photo, Comment, Like, User  
from .serializers import (  
    PhotoSerializer,  
    CommentSerializer,  
    UserSerializer  
)  
from .ai.services import analyze_photo  
from django.shortcuts import get_object_or_404  
import os  

class PhotoUploadView(generics.CreateAPIView):  
    queryset = Photo.objects.all()  
    serializer_class = PhotoSerializer  
    permission_classes = [permissions.IsAuthenticated]  

    def perform_create(self, serializer):  
        photo = serializer.save(user=self.request.user)  
        image_path = photo.image.path  
        
        # AI Analysis  
        description, tags = analyze_photo(image_path)  
        photo.ai_description = description  
        photo.tags = tags  
        photo.save()  

class PhotoFeedView(generics.ListAPIView):  
    serializer_class = PhotoSerializer  
    permission_classes = [permissions.IsAuthenticated]  

    def get_queryset(self):  
        user = self.request.user  
        # Show photos from followed users + own photos  
        following_ids = user.followers.values_list('id', flat=True)  
        return Photo.objects.filter(  
            user__id__in=list(following_ids) | Photo.objects.filter(user=user)  
        ).order_by('-created_at')  

class DiscoverView(generics.ListAPIView):  
    serializer_class = PhotoSerializer  
    permission_classes = [permissions.IsAuthenticated]  

    def get_queryset(self):  
        # Simple AI-based discovery (expand later)  
        return Photo.objects.exclude(user=self.request.user).order_by('?')[:20]  

class LikePhotoView(generics.CreateAPIView):  
    queryset = Like.objects.all()  
    permission_classes = [permissions.IsAuthenticated]  

    def create(self, request, *args, **kwargs):  
        photo_id = request.data.get('photo_id')  
        photo = get_object_or_404(Photo, id=photo_id)  
        
        like, created = Like.objects.get_or_create(  
            user=request.user,  
            photo=photo  
        )  
        
        if not created:  
            like.delete()  
            return Response(status=status.HTTP_204_NO_CONTENT)  
        
        return Response(status=status.HTTP_201_CREATED)  