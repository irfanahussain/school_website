from django.shortcuts import render
from rest_framework import generics, permissions
from .models import AdmissionApplication, ContactMessage, Course, GalleryImage
from .serializers import (
    AdmissionApplicationSerializer,
    ContactMessageSerializer,
    CourseSerializer,
    GalleryImageSerializer,
)

# Create your views here.


class CourseListView(generics.ListAPIView):
    serializer_class=CourseSerializer

    def get_queryset(self):
        qs=Course.objects.all()
        stage=self.request.query_params.get("stage")
        if stage:
            qs=qs.filter(stage=stage)
        return qs


class GalleryImageListView(generics.ListAPIView):
    serializer_class=GalleryImageSerializer

    def get_queryset(self):
        qs=GalleryImage.objects.all()
        category=self.request.query_params.get("category")
        if category:
            qs=qs.filter(category=category)
        return qs


class ContactMessageCreateView(generics.CreateAPIView):
    queryset=ContactMessage.objects.all()
    serializer_class=ContactMessageSerializer
    permission_classes=[permissions.AllowAny]


class AdmissionApplicationCreateView(generics.CreateAPIView):
    queryset=AdmissionApplication.objects.all()
    serializer_class=AdmissionApplicationSerializer
    permission_classes=[permissions.AllowAny]
