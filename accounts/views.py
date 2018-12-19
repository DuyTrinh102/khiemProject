from django.shortcuts import render, redirect
from django.contrib.auth import login as auth_login
from .form import SignUpForm


def signup(request):
	if request.method == 'POST':
		form = SignUpForm(request.POST)
		print form, "hehe"
		if form.is_valid():
			user = form.save()
			# print (user.is_staff)
			user.backend = 'django.contrib.auth.backends.ModelBackend'
			auth_login(request, user)
			return redirect('home')
	else:
		form = SignUpForm()
	return render(request, 'signup.html', {'form': form})
