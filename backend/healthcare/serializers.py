from rest_framework import serializers
from .models import Patient

class PatientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = ('id','first_name',
        'last_name', 'patronym', 
        'birth_date', 'gender','registration_adress',
        'living_adress','social_status','insurance_number', 'phone_number')