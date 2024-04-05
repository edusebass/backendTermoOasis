# API TERMO OASIS

### Endpoints

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

```
BODY

    {
    "contraseña": "Eduardo123.",
    "confirmContraseña": "Eduardo123."
    }
```

#

#

# CITAS

## Registrar una nueva cita

Este endpoint registra una cita

POST

http://localhost:3000/api/citas/registrar

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

```
BODY
{
  "dia": "2024-06-05T00:00:00",
  "inicio": "2024-06-05T07:00:00",
  "fin": "2024-06-05T13:00:00",
  "comentarios": "Revisión de rutina",
  "receta": "Paracetamol",
  "idPaciente": "660f0a7a1e74f02e637b968c",
  "idDoctor": "66020ed34753bbd7a76a8d7f"
}

```

Consideraciones: La fecha tanto para el dia inicio y fin debe ser la misma ademas de proporcionar el token

## Cancelar cita

Este endpoint cancela una cita lo que hace es con la cita que esta creada actualiza el campo "isCancelado" a True para saber cual se cancelo

POST

http://localhost:3000/api/citas/cancelar/:id

Ejemplo:
`http://localhost:3000/api/citas/cancelar/66105676ab20544b5e9d29a9`

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

| Parameter | Type            | Description                 |
| :-------- | :-------------- | :-------------------------- |
| `id`      | `id de mongodb` | **Required**. id de la cita |

```
No se necesita BODY en este caso
```

**Consideraciones:No se podra cancelar la cita si:**

- el id no es el correcto
- si la se cancela en el rango de 24 horas antes de que sea la cita

## Configuración

npm i

npm run dev

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno antes de ejecutar la aplicación:

- `MONGODB_URI`: La URL de conexión a la base de datos MongoDB.
- `HOST_MAILTRAP`=
- `PORT_MAILTRAP`=
- `USER_MAILTRAP`=
- `PASS_MAILTRAP`=

AÑADO ALGO
