# API para Control de Programa Veterinario

Esta API está diseñada para gestionar datos relacionados con un programa veterinario. Proporciona funcionalidades clave para la administración de información sobre pacientes, citas, historias clínicas y más.

# Endpoints

# USUARIOS

## Registro

POST
http://localhost:3000/api/registro

```
BODY
para crear un doctor
    {
        "nombre": "Eduardo",
        "apellido": "Almachi",
        "email": "edu03@sebas.com",
        "contraseña": "123Edu.",
        "isDoctor": true
    }

para crear una secretaria
    {
        "nombre": "Melany",
        "apellido": "Sangucho",
        "email": "edu03@alma.com",
        "contraseña": "123Edu.",
        "isSecre": true
    }

para crear un paciente
    {
        "nombre": "Melany",
        "apellido": "Sangucho",
        "email": "edu03@alma.com",
        "contraseña": "123Edu.",
        "isPaciente": true
    }

```

## LOGIN

POST
http://localhost:3000/api/login

```
BODY
para loguearse
    {
        "email": "edu03@sebas.com",
        "contraseña": "123Edu."
    }


    te devuelve esto
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDIwZWQzNDc1M2JiZDdhNzZhOGQ3ZiIsInJvbCI6InVzdWFyaW8iLCJpYXQiOjE3MTE0MjQ1MzgsImV4cCI6MTcxMTUxMDkzOH0.r1fEotj0Qr23Txlg0wnFSvnVSZJMl4LBbBxTHZ5aPqU",
        "nombre": "Eduardo",
        "apellido": "Almachi",
        "_id": "66020ed34753bbd7a76a8d7f",
        "email": "edu03@sebas.com"
    }
```

## Configuración

npm i
npm run dev

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno antes de ejecutar la aplicación:

- `MONGODB_URI`: La URL de conexión a la base de datos MongoDB.
