import json
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.sessions.models import Session
from rest_framework.renderers import JSONRenderer

from .serializers import PatientSerializer
from .serializers import VisitSerializer
from .models import Patient
from .models import Visit

# Декоратор для выдачи ошибки если пользователь неавторизован
def json_login_required(view_func):
    def wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Вы не авторизованы'}, status=401)
        return view_func(request, *args, **kwargs)
    return wrapped_view

def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    s = get_token(request)
    response['X-CSRFToken'] = s
    return response

@require_POST
def login_view(request):
    # Получаем авторизационные данные
    data = json.loads(request.body)
    username = data.get('username')
    password = data.get('password')

    # Валидация
    if username is None or password is None:
        return JsonResponse({'detail': 'Пожалуйста предоставьте логин и пароль'}, status=400)

    # Аутентификация пользоваля
    user = authenticate(username=username, password=password)
    
    if user is None:
        return JsonResponse({'detail': 'Неверный логин или пароль'}, status=400)

    # Создаётся сессия. session_id отправляется в куки
    login(request, user)
    return JsonResponse({'detail': 'Успешная авторизация'})

  
# Сессия удаляется из БД и session_id на клиенте более недействителен
@json_login_required
def logout_view(request):
    logout(request)
    return JsonResponse({'detail': 'Вы успешно вышли'})

  
# Узнать авторизован ли пользователь и получить его данные
@ensure_csrf_cookie # <- Принудительная отправка CSRF cookie
def session_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'isAuthenticated': False})

    return JsonResponse({'isAuthenticated': True, 'username': request.user.username, 'user_id': request.user.id})

  
# Получение информации о пользователе
@json_login_required
def user_info(request):
    return JsonResponse({'username': request.user.username, 'firstname': request.user.first_name, 'lastname': request.user.last_name})

@json_login_required
def get_patients(request):
    patients_from_db = Patient.objects.all()
    serialized = PatientSerializer(patients_from_db, many=True) 
    return JsonResponse(serialized.data,safe=False)

@json_login_required
def test(request,id):
    my_object = Patient.objects.filter(pk=id).first()
    return JsonResponse(PatientSerializer(my_object).data)

@json_login_required
def get_analysis(request):
    visits = Visit.objects.filter(tapID="123765")
    serialized = VisitSerializer(visits, many=True) 
    return JsonResponse(serialized.data, safe=False)




# Удаление всех сессий из БД
# Вы можете переделать так, чтобы отзывать сессию у определённого пользователя
@json_login_required
def kill_all_sessions(request):
    sessions = Session.objects.all()
    sessions.delete()

    return JsonResponse({'detail': 'Сессии успешно завершены'})

def diagnose_predict(request):
    pol = request.GET.get('pol')
    ves = request.GET.get('ves')
    travma = request.GET.get('travma')
    
    for key, value in request.GET.items():
        print(key, value)
    return JsonResponse({'result':'Результат вашей болезни'})
    