from django.contrib import admin
from .models import AdmissionApplication,ContactMessage,Course,GalleryImage


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display=("title","stage","duration","order")
    list_filter=("stage",)
    ordering=("order","title")


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display=("title","category","uploaded_at")
    list_filter=("category",)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display=("name","email","subject","submitted_at","is_read")
    list_filter=("is_read",)
    search_fields=("name","email","subject","message")
    readonly_fields=("submitted_at",)


@admin.register(AdmissionApplication)
class AdmissionApplicationAdmin(admin.ModelAdmin):
    list_display=("student_name","grade_applying_for","parent_name","status","submitted_at")
    list_filter=("status","grade_applying_for")
    search_fields=("student_name","parent_name","parent_email")
    readonly_fields=("submitted_at",)
