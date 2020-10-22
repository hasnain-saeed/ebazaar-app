from django.shortcuts import render, redirect
from django.views.generic import UpdateView, CreateView
from django.urls import reverse_lazy
from django.contrib.auth.mixins import LoginRequiredMixin

from users.forms import StaffRegisterForm, StaffUpdateForm, ProfileUpdateForm


class RegisterView(CreateView):
    template_name = 'users/register.html'
    form_class = StaffRegisterForm
    success_url = reverse_lazy('login')


class ProfileView(LoginRequiredMixin, UpdateView):
    def post(self, request, *args, **kwargs):
        user_form = StaffUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(request.POST, request.FILES, instance=request.user.profile)

        if user_form.is_valid() and profile_form.is_valid():
            user_form.save()
            profile_form.save()
            return redirect('profile')

        return render(request, 'users/profile.html', {'u_form': user_form, 'p_form': profile_form})

    def get(self, request, *args, **kwargs):
        user_form = StaffUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=request.user.profile)

        return render(request, 'users/profile.html', {'u_form': user_form, 'p_form': profile_form})
