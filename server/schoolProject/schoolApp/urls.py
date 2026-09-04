from django.urls import path
from . import views

urlpatterns = [
    path("courses/",views.CourseListView.as_view(),name="course-list"),
    path("gallery/",views.GalleryImageListView.as_view(),name="gallery-list"),
    path("contact/",views.ContactMessageCreateView.as_view(),name="contact-create"),
    path("admissions/",views.AdmissionApplicationCreateView.as_view(),name="admission-create"),
    path("auth/register/",views.RegisterView.as_view(),name="auth-register"),
    path("auth/login/",views.LoginView.as_view(),name="auth-login"),
    path("auth/logout/",views.LogoutView.as_view(),name="auth-logout"),
    path("auth/me/",views.MeView.as_view(),name="auth-me"),
]
