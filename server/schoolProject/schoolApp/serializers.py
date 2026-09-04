from datetime import date
from rest_framework import serializers
from .models import AdmissionApplication,ContactMessage,Course,GalleryImage
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password

User=get_user_model()

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
        read_only_fields=["id","status","submitted_at"]

    def validate_date_of_birth(self,value):
        if value>=date.today():
            raise serializers.ValidationError("Date of birth must be in the past.")
        age=(date.today()-value).days//365
        if age>19:
            raise serializers.ValidationError("Please check the date of birth entered.")
        return value

class UserSerializer(serializers.ModelSerializer):
    full_name=serializers.SerializerMethodField()

    class Meta:
        model=User
        fields=["id","email","full_name"]

    def get_full_name(self,obj):
        return obj.first_name or obj.email.split("@")[0]


class RegisterSerializer(serializers.ModelSerializer):
    email=serializers.EmailField()
    password=serializers.CharField(write_only=True,min_length=8)
    full_name=serializers.CharField(write_only=True,max_length=150)

    class Meta:
        model=User
        fields=["email","password","full_name"]

    def validate_email(self,value):
        value=value.strip().lower()
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError("An account with this email already exists.")
        return value

    def validate_password(self,value):
        validate_password(value)
        return value

    def create(self,validated_data):
        full_name=validated_data.pop("full_name").strip()
        email=validated_data["email"]
        user=User(username=email,email=email,first_name=full_name)
        user.set_password(validated_data["password"])
        user.save()
        return user
