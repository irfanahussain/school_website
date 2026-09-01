from django.urls import path
from . import views

urlpatterns = [
    path("courses/",views.CourseListView.as_view(),name="course-list"),
    path("gallery/",views.GalleryImageListView.as_view(),name="gallery-list"),
    path("contact/",views.ContactMessageCreateView.as_view(),name="contact-create"),
    path("admissions/",views.AdmissionApplicationCreateView.as_view(),name="admission-create"),
]
