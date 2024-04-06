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

## Mostrar todas las citas

Este endpoint mostrara las citas ordenadas de la mas lejana a la mas reciente

GET

http://localhost:3000/api/citas/mostrar-todas

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

```

No se necesita BODY en este caso

```

```
Ejemplo de lo que devuelve

{
  "data": [
    {
      "_id": "66115d3b625d5750c3ad0dfe",
      "dia": "2024-04-19T05:00:00.000Z",
      "inicio": "2024-04-19T12:00:00.000Z",
      "fin": "2024-04-19T18:00:00.000Z",
      "registroMedico": [],
      "isCancelado": false,
      "idPaciente": "660f0a7a1e74f02e637b968c",
      "idDoctor": "66020ed34753bbd7a76a8d7f",
      "createdAt": "2024-04-06T14:33:31.144Z",
      "updatedAt": "2024-04-06T14:33:31.144Z",
      "__v": 0
    },
    {
      "_id": "66115d30625d5750c3ad0df3",
      "dia": "2024-04-09T05:00:00.000Z",
      "inicio": "2024-04-09T12:00:00.000Z",
      "fin": "2024-04-09T18:00:00.000Z",
      "registroMedico": [],
      "isCancelado": false,
      "idPaciente": "660f0a7a1e74f02e637b968c",
      "idDoctor": "66020ed34753bbd7a76a8d7f",
      "createdAt": "2024-04-06T14:33:20.926Z",
      "updatedAt": "2024-04-06T14:33:20.926Z",
      "__v": 0
    },
    {
      "_id": "66105b0c2f1e22b7c7c513f6",
      "dia": "2024-04-08T05:00:00.000Z",
      "inicio": "2024-04-08T12:00:00.000Z",
      "fin": "2024-04-08T18:00:00.000Z",
      "registroMedico": [],
      "isCancelado": true,
      "idPaciente": "660f0a7a1e74f02e637b968c",
      "idDoctor": "66020ed34753bbd7a76a8d7f",
      "createdAt": "2024-04-05T20:11:56.829Z",
      "updatedAt": "2024-04-05T20:13:11.425Z",
      "__v": 0
    }
  ],
  "status": true
}

```

## Mostrar cita especifica

Este endpoint mostrara una cita en especifica por medio del id de la cita

GET

http://localhost:3000/api/citas/mostrar/:id

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

```

No se necesita BODY en este caso

```

```
Ejemplo de lo que devuelve

{
  {
    "data": {
        "_id": "66115d3b625d5750c3ad0dfe",
        "dia": "2024-04-19T05:00:00.000Z",
        "inicio": "2024-04-19T12:00:00.000Z",
        "fin": "2024-04-19T18:00:00.000Z",
        "registroMedico": idregistroMedico,
        "isCancelado": false,
        "idPaciente": "660f0a7a1e74f02e637b968c",
        "idDoctor": "66020ed34753bbd7a76a8d7f",
        "createdAt": "2024-04-06T14:33:31.144Z",
        "updatedAt": "2024-04-06T14:33:31.144Z",
        "__v": 0
    },
    "status": true
  }
}

```

## Mostrar citas de un paciente en especifico

Este endpoint mostrara las citas de un paciente id del paciente

GET

http://localhost:3000/api/citas/mostrar/:id

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

```

No se necesita BODY en este caso

```

```
Ejemplo de lo que devuelve

"data": [
    {
      "_id": "66116ddb3281bdbdd6d0695c",
      "dia": "2024-04-20T05:00:00.000Z",
      "inicio": "2024-04-20T12:00:00.000Z",
      "fin": "2024-04-20T18:00:00.000Z",
      "comentarios": "Revisión de rutina",
      "receta": "Paracetamol",
      "isCancelado": false,
      "idPaciente": "66116d818224da46a29d90ce",
      "idDoctor": {
        "_id": "66020ed34753bbd7a76a8d7f",
        "nombre": "Eduardo",
        "apellido": "Almachi",
        "contraseña": "$2a$10$7JtI/hGSO1O5/oDM5M4kM.2hjwmS2LM10N/U5BcnrUViey7XL3ouu",
        "email": "edu03sebas@gmail.com",
        "isDoctor": true,
        "isPaciente": false,
        "isSecre": false,
        "citas": [
          "66105b0c2f1e22b7c7c513f6",
          "66115d30625d5750c3ad0df3",
          "66115d3b625d5750c3ad0dfe",
          "66116ddb3281bdbdd6d0695c"
        ],
        "pacientes": [
          "660f0a7a1e74f02e637b968c",
          "660f0a7a1e74f02e637b968c",
          "660f0a7a1e74f02e637b968c",
          "66116d818224da46a29d90ce"
        ],
        "createdAt": "2024-03-25T23:54:59.363Z",
        "updatedAt": "2024-04-06T15:44:27.356Z",
        "__v": 54,
        "token": null
      },
      "createdAt": "2024-04-06T15:44:27.347Z",
      "updatedAt": "2024-04-06T15:44:27.347Z",
      "__v": 0
    }
  ],
  "status": true
}

```

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

```

```
