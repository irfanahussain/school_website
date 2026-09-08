from django.shortcuts import render
from django.shortcuts import get_object_or_404, render
from rest_framework import generics, permissions,status
from .models import AdmissionApplication, ContactMessage, Course, GalleryImage,Enrollment,Profile
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    AdmissionApplicationSerializer,
    ContactMessageSerializer,
    CourseSerializer,
    GalleryImageSerializer,
    RegisterSerializer,
    UserSerializer,
    EnrollmentSerializer,
    EnrollRequestSerializer,
)
User = get_user_model()

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

class RegisterView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self,request):
        serializer=RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user=serializer.save()
        token,_=Token.objects.get_or_create(user=user)
        return Response(
            {"token":token.key,"user":UserSerializer(user).data},
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes=[permissions.AllowAny]

    def post(self,request):
        email=(request.data.get("email") or "").strip().lower()
        password=request.data.get("password") or ""
        user=authenticate(request,username=email,password=password)
        if user is None:
            return Response(
                {"detail":"Invalid email or password."},
                status=status.HTTP_401_UNAUTHORIZED,
            )
        token,_=Token.objects.get_or_create(user=user)
        return Response({"token":token.key,"user":UserSerializer(user).data})


class LogoutView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        request.user.auth_token.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes=[IsAuthenticated]

    def get(self,request):
        return Response(UserSerializer(request.user).data)

    def patch(self,request):
        avatar=request.FILES.get("avatar")
        if not avatar:
            return Response(
                {"avatar":["No file was submitted."]},
                status=status.HTTP_400_BAD_REQUEST,
            )
        profile,_=Profile.objects.get_or_create(user=request.user)
        profile.avatar=avatar
        profile.save()
        return Response(UserSerializer(request.user,context={"request":request}).data)




class MyCoursesView(generics.ListAPIView):
    serializer_class=EnrollmentSerializer
    permission_classes=[IsAuthenticated]

    def get_queryset(self):
        return Enrollment.objects.filter(student=self.request.user).select_related("course")

class EnrollView(APIView):
    permission_classes=[IsAuthenticated]

    def post(self,request):
        serializer=EnrollRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        course=get_object_or_404(Course,id=serializer.validated_data["course_id"])
        enrollment,created=Enrollment.objects.get_or_create(student=request.user,course=course)
        return Response(
            EnrollmentSerializer(enrollment).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

    def delete(self,request):
        course_id=request.data.get("course_id")
        Enrollment.objects.filter(student=request.user,course_id=course_id).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

