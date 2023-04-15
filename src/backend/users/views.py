from rest_framework.generics import GenericAPIView, RetrieveAPIView, ListCreateAPIView, RetrieveUpdateDestroyAPIView
from users.serializers import (RegisterSerializer, LoginSerializer, UserSerializer, 
                               ResetPasswordEmailRequestSerializer, SetNewPasswordSerializer, wxLoginSerializer)
from .models import MyUser
from .utils import Util
from rest_framework import response, status, permissions
from knox.models import AuthToken
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.http import HttpResponsePermanentRedirect
import os
from .permissions import *
from django.http import HttpResponse
from .utils import OpenidUtils


class CustomRedirect(HttpResponsePermanentRedirect):

    allowed_schemes = [os.environ.get('APP_SCHEME'), 'http', 'https']


# Create your views here.
class RegisterView(GenericAPIView):
    
    serializer_class = RegisterSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data) 
        if serializer.is_valid():
            user = serializer.save()
            return response.Response({"user": UserSerializer(user, context=self.get_serializer_context()).data,}, 
                                     status=status.HTTP_201_CREATED) 
        return response.Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
class LoginView(GenericAPIView):
    
    serializer_class = LoginSerializer
    
    def post(self, request):
        serializer = self.serializer_class(data=request.data) 
        if serializer.is_valid():
            user = serializer.validated_data
            return response.Response({"user": UserSerializer(user, context=self.get_serializer_context()).data,
                                      "token": AuthToken.objects.create(user)[1]}, 
                                     status=status.HTTP_200_OK) 
        return response.Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)   
   
    
class wxLoginView(GenericAPIView):
    
    serializer_class = wxLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data) 
        if serializer.is_valid():
            user = serializer.validated_data
            return response.Response({"user": UserSerializer(user, context=self.get_serializer_context()).data,
                                      "token": AuthToken.objects.create(user)[1]}, 
                                     status=status.HTTP_200_OK) 
        return response.Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)   
    
    
  
#get current user  
class UserView(RetrieveAPIView):
  permission_classes = [
    permissions.IsAuthenticated,
  ]
  serializer_class = UserSerializer

  def get_object(self):
    return self.request.user    
  
  
class RequestPasswordResetEmail(GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer

    def post(self, request):
        email = request.data.get('email', '')
        if MyUser.objects.filter(email=email).exists():
            user = MyUser.objects.get(email=email)
            uidb64 = urlsafe_base64_encode(smart_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            # current_site = get_current_site(
            #     request=request).domain
            # relativeLink = reverse(
            #     'password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})

            # redirect_url = request.data.get('redirect_url', 'https://www.baidu.com/')
            # absurl = 'http://'+current_site + relativeLink
            # email_body = 'Hello, \n Use link below to reset your password  \n' + \
            #     absurl+"?redirect_url="+redirect_url
            # data = {'email_body': email_body, 'to_email': user.email,
            #         'email_subject': 'Reset your passsword'}
            email_body = f'uidb64: {uidb64}\ntoken: {token}'
            data = {'email_body': email_body, 'to_email': user.email,
                    'email_subject': 'Reset your passsword'}
            Util.send_email(data)
        return response.Response({'success': 'We have sent you a link to reset your password'}, status=status.HTTP_200_OK)


class PasswordTokenCheckAPI(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def get(self, request, uidb64, token):

        redirect_url = request.GET.get('redirect_url')

        try:
            id = smart_str(urlsafe_base64_decode(uidb64))
            user = MyUser.objects.get(id=id)

            if not PasswordResetTokenGenerator().check_token(user, token):
                if len(redirect_url) > 3:
                    return CustomRedirect(redirect_url+'?token_valid=False')
                else:
                    return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

            if redirect_url and len(redirect_url) > 3:
                return CustomRedirect(redirect_url+'?token_valid=True&message=Credentials Valid&uidb64='+uidb64+'&token='+token)
            else:
                return CustomRedirect(os.environ.get('FRONTEND_URL', '')+'?token_valid=False')

        except DjangoUnicodeDecodeError as identifier:
            try:
                if not PasswordResetTokenGenerator().check_token(user):
                    return CustomRedirect(redirect_url+'?token_valid=False')
                    
            except UnboundLocalError as e:
                return response.Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_400_BAD_REQUEST)



class SetNewPasswordAPIView(GenericAPIView):
    serializer_class = SetNewPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return response.Response({'success': True, 'message': 'Password reset success'}, status=status.HTTP_200_OK)
      

class UserListAPIView(ListCreateAPIView):
    serializer_class = UserSerializer
    queryset = MyUser.objects.all()
    permission_classes = (permissions.IsAuthenticated, )
    
    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(self.request.POST['password'])
        user.save()      


class UserDetailAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated, IsAdmin|IsSelf,)
    queryset = MyUser.objects.all()


class GetOpenidView(GenericAPIView):
    def post(self,request):
        data_code=str(request.data['code'])
        openid = OpenidUtils(data_code).get_openid()
        data={'openid':openid,'errMsg':'ok',}
        return response.Response(data, status=status.HTTP_200_OK)

