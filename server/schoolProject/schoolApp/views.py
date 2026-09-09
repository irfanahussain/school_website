from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404, render
from rest_framework import generics, permissions,status
from .models import AdmissionApplication, ContactMessage, Course, GalleryImage,Enrollment,Profile,Lesson,LessonFile,LessonProgress
from django.contrib.auth import authenticate, get_user_model
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import (
    AdmissionApplicationSerializer,
    ContactMessageSerializer,
    CourseSerializer,
    CourseDetailSerializer,
    CourseLearnSerializer,
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


class CourseDetailView(generics.RetrieveAPIView):
    queryset=Course.objects.prefetch_related("subjects__lessons")
    serializer_class=CourseDetailSerializer


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


class CourseLearnView(APIView):
    """Course → Subjects → Lessons → Files, gated behind an active enrollment."""

    permission_classes=[IsAuthenticated]

    def get(self,request,pk):
        course=get_object_or_404(
            Course.objects.prefetch_related("subjects__lessons__files"),
            id=pk,
        )
        if not Enrollment.objects.filter(student=request.user,course=course).exists():
            return Response(
                {"detail":"You must be enrolled in this course to view its lessons."},
                status=status.HTTP_403_FORBIDDEN,
            )

        completed_lesson_ids=set(
            LessonProgress.objects.filter(
                student=request.user,
                lesson__subject__course=course,
            ).values_list("lesson_id",flat=True)
        )

        serializer=CourseLearnSerializer(
            course,
            context={"completed_lesson_ids":completed_lesson_ids,"request":request},
        )
        return Response(serializer.data)


class LessonCompleteView(APIView):
    """Mark / unmark a lesson complete for the logged-in student."""

    permission_classes=[IsAuthenticated]

    def post(self,request,pk):
        lesson=get_object_or_404(Lesson,id=pk)
        course=lesson.subject.course
        if not Enrollment.objects.filter(student=request.user,course=course).exists():
            return Response(
                {"detail":"You must be enrolled in this course to update progress."},
                status=status.HTTP_403_FORBIDDEN,
            )
        LessonProgress.objects.get_or_create(student=request.user,lesson=lesson)
        return Response({"lesson_id":lesson.id,"completed":True},status=status.HTTP_200_OK)

    def delete(self,request,pk):
        lesson=get_object_or_404(Lesson,id=pk)
        LessonProgress.objects.filter(student=request.user,lesson=lesson).delete()
        return Response({"lesson_id":lesson.id,"completed":False},status=status.HTTP_200_OK)


class LessonFileDownloadView(APIView):
    """Serves a lesson file only if the student is enrolled in its course."""

    permission_classes=[IsAuthenticated]

    def get(self,request,pk):
        lesson_file=get_object_or_404(LessonFile,id=pk)
        course=lesson_file.lesson.subject.course
        if not Enrollment.objects.filter(student=request.user,course=course).exists():
            return Response(
                {"detail":"You must be enrolled in this course to access this file."},
                status=status.HTTP_403_FORBIDDEN,
            )
        if not lesson_file.file:
            raise Http404
        return FileResponse(
            lesson_file.file.open("rb"),
            as_attachment=True,
            filename=lesson_file.file.name.rsplit("/",1)[-1],
        )