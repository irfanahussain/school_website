from django.db import models
from django.core.validators import RegexValidator
# Create your models here.


phone_validator=RegexValidator(
    regex=r"^\+?[0-9 ()\-]{7,20}$",
    message="Enter a valid phone number.",
)


class Course(models.Model):
    STAGE_CHOICES=[
        ("primary","Foundation (Class 8-10)"),
        ("middle","Class 11 & 12"),
        ("high","Competitive / Dropper Batch"),
    ]

    title=models.CharField(max_length=120)
    stage=models.CharField(max_length=10,choices=STAGE_CHOICES)
    summary=models.CharField(max_length=280)
    description=models.TextField()
    duration=models.CharField(max_length=60)
    icon=models.CharField(
        max_length=40,
        blank=True,
        help_text="Optional short label or emoji shown next to the course card.",
    )
    order=models.PositiveIntegerField(default=0)

    class Meta:
        ordering=["order","title"]

    def __str__(self):
        return self.title


class GalleryImage(models.Model):
    CATEGORY_CHOICES = [
        ("campus","Campus"),
        ("academics","Academics"),
        ("sports","Sports"),
        ("events","Events"),
        ("arts","Arts"),
    ]

    title=models.CharField(max_length=120)
    category=models.CharField(max_length=20,choices=CATEGORY_CHOICES,default="campus")
    image=models.ImageField(upload_to="gallery/")
    caption=models.CharField(max_length=200, blank=True)
    uploaded_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=["-uploaded_at"]

    def __str__(self):
        return self.title


class ContactMessage(models.Model):
    name=models.CharField(max_length=120)
    email=models.EmailField()
    phone=models.CharField(max_length=20, blank=True, validators=[phone_validator])
    subject=models.CharField(max_length=150)
    message=models.TextField()
    submitted_at=models.DateTimeField(auto_now_add=True)
    is_read=models.BooleanField(default=False)

    class Meta:
        ordering=["-submitted_at"]

    def __str__(self):
        return f"{self.name}—{self.subject}"


class AdmissionApplication(models.Model):
    GRADE_CHOICES=[(str(g),f"Grade {g}") for g in range(1, 13)] + [("K","Kindergarten")]
    STATUS_CHOICES=[
        ("submitted","Submitted"),
        ("under_review","Under Review"),
        ("accepted","Accepted"),
        ("waitlisted","Waitlisted"),
        ("declined","Declined"),
    ]

    student_name=models.CharField(max_length=150)
    date_of_birth=models.DateField()
    grade_applying_for=models.CharField(max_length=2,choices=GRADE_CHOICES)
    previous_school=models.CharField(max_length=200,blank=True)

    parent_name=models.CharField(max_length=150)
    parent_email=models.EmailField()
    parent_phone=models.CharField(max_length=20,validators=[phone_validator])
    address=models.TextField()

    additional_notes=models.TextField(blank=True)

    status=models.CharField(max_length=20,choices=STATUS_CHOICES,default="submitted")
    submitted_at=models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering=["-submitted_at"]

    def __str__(self):
        return f"{self.student_name} (Grade {self.grade_applying_for})"
