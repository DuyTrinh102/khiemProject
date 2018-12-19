from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm, PasswordChangeForm
from django.contrib.auth.models import User


class SignUpForm(UserCreationForm):
	email = forms.CharField(max_length=254, required=True, widget=forms.EmailInput())

	class Meta:
		model = User
		fields = ('username', 'email', 'password1', 'password2')


class SignInForm(AuthenticationForm):
	class Meta:
		model = User
		fields = ('username', 'password')


class ChangePasswordForm(PasswordChangeForm):

	class Meta:
		model = User
		fields = '__all__'
