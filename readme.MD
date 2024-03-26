# API TERMO OASIS

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
    nota: este token sirve los endpoint que utilizan CRUD no para el cambio de contraseña el otro es diferente y se especifica abajo

    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2MDIwZWQzNDc1M2JiZDdhNzZhOGQ3ZiIsInJvbCI6InVzdWFyaW8iLCJpYXQiOjE3MTE0MjQ1MzgsImV4cCI6MTcxMTUxMDkzOH0.r1fEotj0Qr23Txlg0wnFSvnVSZJMl4LBbBxTHZ5aPqU",
        "nombre": "Eduardo",
        "apellido": "Almachi",
        "_id": "66020ed34753bbd7a76a8d7f",
        "email": "edu03@sebas.com"
    }
```

## RECUPERAR CONTRASEÑA

Este endpoint envia el correo con el link del frontend para que ponga su nueva contraseña
POST
http://localhost:3000/api/recuperar-password

```
BODY
    {
        "email":"edu03sebas@gmail.com"
    }
```

La respuesta que da es esto

```
    {
        "msg": "Revisa tu correo electrónico para restablecer tu contraseña",
        "tokenContraseña": "6qm0tygrnm8"
    }
```

POST

## CREAR NUEVA PASSWORD

Este endpoint cambia la contraseña hay que poner el token que nos da el endpoint de recuperar contraseña - NO EL DE INICIO DE SESION -

POST
http://localhost:3000/api/nueva-password/:tokenContraseña

````
BODY

    {
    "contraseña": "Eduardo123.",
    "confirmContraseña": "Eduardo123."
    }
```


## Configuración

npm i

npm run dev

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno antes de ejecutar la aplicación:

- `MONGODB_URI`: La URL de conexión a la base de datos MongoDB.
````
