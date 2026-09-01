from datetime import date
from rest_framework import serializers
from .models import AdmissionApplication,ContactMessage,Course,GalleryImage


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Course
        fields=["id","title","stage","summary","description","duration","icon"]


class GalleryImageSerializer(serializers.ModelSerializer):
    class Meta:
        model=GalleryImage
        fields=["id","title","category","image","caption","uploaded_at"]


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ContactMessage
        fields=["id","name","email","phone","subject","message","submitted_at"]
        read_only_fields=["id","submitted_at"]

    def validate_message(self,value):
        if len(value.strip())<10:
            raise serializers.ValidationError("Msg must be at least 10 characters")
        return value


class AdmissionApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdmissionApplication
        fields = [
            "id","student_name","date_of_birth","grade_applying_for","previous_school","parent_name","parent_email","parent_phone","address","additional_notes","status","submitted_at",
        ]
        read_only_fields=["id", "status", "submitted_at"]

    def validate_date_of_birth(self,value):
        if value>=date.today():
            raise serializers.ValidationError("Date of birth must be in the past.")
        age=(date.today()-value).days//365
        if age>19:
            raise serializers.ValidationError("Please check the date of birth entered.")
        return value
