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

## Comprobar token password

POST

http://localhost:3000/api/recuperar-password/:token

Este endpoint comprueba el token que recibe con el del ususario que quiere restablecer la contraseña

# CITAS

## Registrar una nueva cita

Este endpoint registra una cita

POST

http://localhost:3000/api/citas/registrar

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

```
BODY
{
  "start": "2024-06-05T07:00:00",
  "end": "2024-06-05T13:00:00",
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
| `id`      | `id de mongodb` | **Required**: id de la cita |

```
No se necesita BODY en este caso
```

**Consideraciones:No se podra cancelar la cita si:**

- el id no es el correcto
- si la se cancela en el rango de 24 horas antes de que sea la cita

## Actualizar cita

Este endpoint actualizara una cita lo que hace es con la cita que esta creada actualiza lo que le mandemos en el body

POST

http://localhost:3000/api/citas/actualizar/:id

Ejemplo:
`http://localhost:3000/api/citas/actualizar/66105676ab20544b5e9d29a9`

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

| Parameter | Type            | Description                 |
| :-------- | :-------------- | :-------------------------- |
| `id`      | `id de mongodb` | **Required**. id de la cita |

```
BODY
{
  "start": "2025-04-08T05:00:00.000+00:00",
  "end": "2025-04-08T06:00:00.000+00:00",
  "comentarios": "nuevo valor de comentarios"

}
```

**Consideraciones:No se podra cancelar la cita si:**

- el id no es el correcto

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
      "start": "2024-04-19T05:00:00.000Z",
      "end": "2024-04-19T12:00:00.000Z",
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
        "start": "2024-04-19T12:00:00.000Z",
        "end": "2024-04-19T18:00:00.000Z",
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
      "start": "2024-04-20T12:00:00.000Z",
      "end": "2024-04-20T18:00:00.000Z",
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


```

# REGISTRO MEDICO

## Crear el registro medico

Este endpoint guarda un registro medico del paciente

POST

http://localhost:3000/api/registroMedico/crear

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

```

BODY

{
  "idCita": "66105b0c2f1e22b7c7c513f6",
  "idPaciente": "660f0a7a1e74f02e637b968c",
  "idDoctor": "66020ed34753bbd7a76a8d7f",
  "receta": [
    {
      "nombre": "Ibuprofeno 400mg",
      "dosis": "1 comprimido",
      "frecuencia": "Cada 8 horas"
    },
    {
      "nombre": "Amoxicilina 500mg",
      "dosis": "1 comprimido",
      "frecuencia": "Cada 12 horas"
    }
  ],
  "dieta": [
    {
      "descripcion": "Dieta baja en grasas"
    }
  ],
  "actividad": [
    {
      "descripcion": "Realizar ejercicio moderado"
    }
  ],
  "cuidados": [
    {
      "descripcion": "Mantener reposo absoluto"
    }
  ],
  "informacionMedica": {
    "altura": 170,
    "peso": 70
  },
  "comments": "Paciente presenta síntomas leves de gripe."
}


```

RESULT

```
Ejemplo de lo que devuelve


  "msg": "Registro Medico creado Correctamente",
  "status": true,
  "data": {
    "informacionMedica": {
      "altura": 170,
      "peso": 70
    },
    "_id": "661593151fa56e74ed7a8a86",
    "idCita": {
      "_id": "66105b0c2f1e22b7c7c513f6",
      "dia": "2025-04-08T05:00:00.000Z",
      "inicio": "2025-04-08T05:00:00.000Z",
      "fin": "2025-04-08T06:00:00.000Z",
      "comentarios": "nuevo valor de comentarios",
      "receta": "Paracetamol",
      "isCancelado": true,
      "idPaciente": "660f0a7a1e74f02e637b968c",
      "idDoctor": "66020ed34753bbd7a76a8d7f",
      "createdAt": "2024-04-05T20:11:56.829Z",
      "updatedAt": "2024-04-09T19:12:21.209Z",
      "__v": 0,
      "registroMedico": "661593151fa56e74ed7a8a86"
    },
    "idPaciente": {
      "_id": "660f0a7a1e74f02e637b968c",
      "nombre": "Sebastian",
      "apellido": "Maisincho",
      "contraseña": "$2a$10$STyiWdEoJQJ6GcfJw2Zld.857q4fAxkz7t4MISMLp7Pm46zoMiYcK",
      "email": "edubin560@gmail.com",
      "isDoctor": false,
      "isPaciente": true,
      "isSecre": false,
      "citas": [
        "66105b0c2f1e22b7c7c513f6",
        "66115d30625d5750c3ad0df3",
        "66115d3b625d5750c3ad0dfe"
      ],
      "pacientes": [],
      "createdAt": "2024-04-04T20:15:54.769Z",
      "updatedAt": "2024-04-06T14:33:31.147Z",
      "__v": 53
    },
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
    "receta": [
      {
        "nombre": "Ibuprofeno 400mg",
        "dosis": "1 comprimido",
        "frecuencia": "Cada 8 horas",
        "_id": "661593151fa56e74ed7a8a87"
      },
      {
        "nombre": "Amoxicilina 500mg",
        "dosis": "1 comprimido",
        "frecuencia": "Cada 12 horas",
        "_id": "661593151fa56e74ed7a8a88"
      }
    ],
    "dieta": [
      {
        "descripcion": "Dieta baja en grasas",
        "_id": "661593151fa56e74ed7a8a89"
      }
    ],
    "actividad": [
      {
        "descripcion": "Realizar ejercicio moderado",
        "_id": "661593151fa56e74ed7a8a8a"
      }
    ],
    "cuidados": [
      {
        "descripcion": "Mantener reposo absoluto",
        "_id": "661593151fa56e74ed7a8a8b"
      }
    ],
    "comments": "Paciente presenta síntomas leves de gripe.",
    "createdAt": "2024-04-09T19:12:21.203Z",
    "updatedAt": "2024-04-09T19:12:21.203Z",
    "__v": 0
  }
}
```

## Mostrar todos los registro medicos

Este endpoint mostrara todos los regsitros medicos sin excepcion algunae

GET

http://localhost:3000/api/registroMedico/listar

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

```
NO SE NECESITA BODY EN ESTA CASO
```

---

## Mostrar registros por paciente

Este endpoint actualizara una cita lo que hace es con la cita que esta creada actualiza lo que le mandemos en el body

POST

http://localhost:3000/api/registroMedico/:id
Ejemplo:
`http://localhost:3000/api/registroMedico/66116d818224da46a29d90ce

- #### Hay que propocionar el token en bearer que conseguimos cuando nos logueamos

| Parameter | Type            | Description                   |
| :-------- | :-------------- | :---------------------------- |
| `id`      | `id de mongodb` | **Required**. id del Paciente |

```
BODY
 no se necesita body
```

**Consideraciones:No se podra cancelar la cita si:**

- el id no es el correcto

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
