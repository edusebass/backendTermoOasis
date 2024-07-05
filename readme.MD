# API TERMO OASIS

## Documentacion Api

https://backend-termo-oasis.vercel.app/api-docs/

**Backend**

TERMO OASIS cuenta con un robusto backend desarrollado en Node.js con Express, diseñado para gestionar eficientemente las operaciones de un centro de terapias alternativas.

### Características principales del backend:

- **Gestión de Citas**: APIs RESTful para crear, modificar, y cancelar citas, garantizando una programación eficiente y sin conflictos.
- **Administración de Pacientes**: Endpoints para manejar información detallada de los pacientes, incluyendo historial médico y tratamientos.
- **Coordinación de Terapeutas**: APIs para asignar y gestionar sesiones de terapia, asegurando que los terapeutas tengan acceso a sus horarios y responsabilidades.
- **Notificaciones**: Integración para enviar recordatorios automáticos a los pacientes sobre sus próximas citas y cualquier cambio en la programación.

### Tecnologías utilizadas:

- **Node.js**: Para construir un servidor escalable y eficiente.
- **Express**: Framework para simplificar la creación de rutas y middleware.
- **MongoDB**: Base de datos NoSQL para almacenar información de pacientes, citas y terapeutas de manera segura y eficiente.
- **JWT (JSON Web Tokens)**: Para la autenticación segura de usuarios y protección de datos sensibles.
- **Mongoose**: ODM (Object Data Modeling) para trabajar con MongoDB de manera sencilla y estructurada.

TERMO OASIS está diseñado para proporcionar una base sólida y escalable que facilite la gestión integral de un centro de terapias alternativas, asegurando una operación fluida y segura.

## Ejecucion del proyecto

- Primero, crear un archivo .env y poner las siguientes variables de entorno

```
MONGODB_URI="url de mongodb"

HOST_MAILTRAP=smtp.gmail.com
PORT_MAILTRAP=465
USER_MAILTRAP="gmail del administrador"
PASS_MAILTRAP="clave de aplicacion del administrador"

JWT_SECRET="aqui poner alguna palabra secreta"

URL_FRONTEND="url donde este el frontend"
```

- Instalar las dependencias

```
npm install
```

- Ejecutar el servidor de la API

```
npm run dev
```
