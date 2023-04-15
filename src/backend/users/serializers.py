from rest_framework import serializers
from users.models import MyUser
from django.contrib.auth import authenticate
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from .utils import OpenidUtils


class UserSerializer(serializers.ModelSerializer):
  class Meta:
    model = MyUser
    fields = ['id', 'openid', 'staff_id', 'email', 'name', 'department', 'role', 'gender']

        

class RegisterSerializer(serializers.ModelSerializer):
    
    # gender = serializers.CharField(source='get_gender_display')
    # role = serializers.CharField(source='get_gender_display')
    
    class Meta:
        model = MyUser
        fields = ['staff_id', 'password', 'email', 'name', 'department', 'role', 'gender']
        extra_kwargs = {
            'password': {'write_only': True}
        }
        
    def create(self, validated_data):
        return MyUser.objects.create_user(**validated_data)
    

class LoginSerializer(serializers.Serializer):
    
    staff_id = serializers.CharField()
    password = serializers.CharField()
  
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    
    
    
class wxLoginSerializer(serializers.Serializer):
    
    code = serializers.CharField()
  
    def validate(self, data):
        openid = OpenidUtils(data.get("code")).get_openid()
        user = authenticate(openid=openid)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    

class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    redirect_url = serializers.CharField(max_length=500, required=False)

    class Meta:
        fields = ['email']


class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(
        min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(
        min_length=1, write_only=True)
    uidb64 = serializers.CharField(
        min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')

            id = force_str(urlsafe_base64_decode(uidb64))
            user = MyUser.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()

            return (user)
        except Exception as e:
            raise AuthenticationFailed('The reset link is invalid', 401)

    
        