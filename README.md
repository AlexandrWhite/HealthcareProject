# Установка 
Запуситить Django сервер
```
python -m venv .venv
source .venv/bin/activate 
pip install -r requirements.txt
python backend/manage.py runserver 
```

Запустить frontend в другом терминале 
```
cd frontend 
npm install 
npm run dev 
```

Перейти на страницу 

<http://localhost:5173>

# Скриншоты

## Логин
![login_page.png](project_presentation/login_page.png)

## Главная страница
![home_page.png](project_presentation/home_page.png)

## Страница пациента
![patient_page.png](project_presentation/patient_page.png)