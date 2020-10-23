from django import forms
from scrapyapp.models import Product, Subscriber


class ProductUpdateForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ['is_featured', 'is_active', 'is_out_of_stock']


class ProductSubscriptionForm(forms.ModelForm):
    email = forms.EmailField(widget=forms.EmailInput(attrs={'placeholder': 'Email Address'}), label=False)

    class Meta:
        model = Subscriber
        fields = ['product', 'email']
        widgets = {'product': forms.HiddenInput()}
