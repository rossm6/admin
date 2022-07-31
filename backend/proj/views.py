from django.http import JsonResponse
from django.middleware.csrf import get_token


def get_csrf_token(request):
    data = {"csrftoken": get_token(request)}
    return JsonResponse(data=data)