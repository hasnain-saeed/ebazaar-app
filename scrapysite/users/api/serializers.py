from rest_framework import serializers
from django.contrib.auth.models import User


class RegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {'email': {'required': True}}

    def create(self, validated_data):
        password1 = validated_data['password']
        password2 = validated_data['password2']
        if password1 != password2:
            raise serializers.ValidationError({'password': 'Passwords do not match'})

        user = User(username=validated_data['username'],
                    email=validated_data['email'],
                    is_staff=True,
                    is_active=False)

        user.set_password(validated_data['password'])
        user.save()
        return user
