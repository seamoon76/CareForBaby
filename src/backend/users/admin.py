from django.contrib import admin
from .models import MyUser

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    readonly_fields = ('id',)

admin.site.register(MyUser, UserAdmin)
