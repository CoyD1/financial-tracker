# Financial Tracker API

Полный набор запросов для управления личными финансами.

## 📋 Что включено:
- Аутентификация пользователей - регистрация и вход
- Управление профилем - данные пользователя
- Финансовые операции - создание, чтение, обновление и удаление транзакций
- Управление категориями транзакций

## 🔑 Аутентификация: Token-based
## ⚙️ Переменные окружения: base_url, token

## Quick Start

```bash
python manage.py migrate
python manage.py runserver
```

## Authentication

### User Registration
```http
POST http://localhost:8000/api/auth/users/
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "user@example.com",
  "password": "password123",
  "re_password": "password123",
  "first_name": "John",
  "last_name": "Doe"
}
```

### User Login
```http
POST http://localhost:8000/api/auth/token/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "auth_token": "your_token_here"
}
```

### User Logout
```http
POST http://localhost:8000/api/auth/token/logout/
Authorization: Token your_token_here
```

### Using Token
Add to headers:
```
Authorization: Token your_token_here
Content-Type: application/json
```

## Users

### Get User Profile
```http
GET http://localhost:8000/api/auth/users/me/
Authorization: Token your_token_here
```

### Update User Profile
```http
PUT http://localhost:8000/api/auth/users/me/
Authorization: Token your_token_here
Content-Type: application/json

{
    "first_name": "Updated John",
    "last_name": "Updated Doe",
    "email": "updated@example.com",
    "username": "updated@example.com"
}
```

## Transactions

### Create Transaction
```http
POST http://localhost:8000/api/transactions/
Authorization: Token your_token_here
Content-Type: application/json

{
  "amount": "150.75",
  "type": "EX",
  "category": 1,
  "date": "2024-01-15",
  "description": "Weekly groceries"
}
```

### Get Transactions List
```http
GET http://localhost:8000/api/transactions/
Authorization: Token your_token_here
```

### Update Transaction
```http
PUT http://localhost:8000/api/transactions/1/
Authorization: Token your_token_here
Content-Type: application/json

{
  "amount": "200.00",
  "type": "EX",
  "category": 1,
  "date": "2024-01-15",
  "description": "Updated description"
}
```

### Delete Transaction
```http
DELETE http://localhost:8000/api/transactions/1/
Authorization: Token your_token_here
```

## Categories

### Create Category
```http
POST http://localhost:8000/api/categories/
Authorization: Token your_token_here
Content-Type: application/json

{
    "name": "Зарплата", 
    "type": "IN"
}
```

## Postman Collection
[Ссылка на Postman коллекцию](https://pasha-w790-1314673.postman.co/workspace/7c0f8575-0c1b-4699-8218-294c2f50b949/collection/47389242-7c93df5a-ddf3-4ede-8be0-4ecc33bb0312?action=share&source=copy-link&creator=47389242)

