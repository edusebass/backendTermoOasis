# API para Control de Programa Veterinario

Esta API está diseñada para gestionar datos relacionados con un programa veterinario. Proporciona funcionalidades clave para la administración de información sobre pacientes, citas, historias clínicas y más.

## Configuración

### Variables de Entorno

Asegúrate de configurar las siguientes variables de entorno antes de ejecutar la aplicación:

- `MONGODB_URI`: La URL de conexión a la base de datos MongoDB.
- `URL_BACKEND`: La URL base para el backend de la aplicación.
- `SMT_GMAIL`: Credenciales de Gmail para el envío de correos electrónicos desde la aplicación.
- `JWT_SECRET`: Clave secreta para la generación y verificación de tokens JWT.

## Instalación

1. Clona este repositorio: `git clone https://github.com/tu_usuario/api-veterinaria.git`
2. Navega al directorio del proyecto: `cd api-veterinaria`
3. Instala las dependencias: `npm install` (o `yarn install`)

## Uso

1. Configura las variables de entorno en tu entorno de desarrollo.
2. Inicia la aplicación: `npm start` (o `yarn start`)
3. La API estará disponible en la URL especificada en `URL_BACKEND`.

## Contribución

Agradecemos las contribuciones. Si deseas contribuir a este proyecto, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea una nueva rama: `git checkout -b feature/nueva-funcionalidad`.
3. Realiza tus cambios y haz commit: `git commit -m 'Agregar nueva funcionalidad'`.
4. Haz push a la rama: `git push origin feature/nueva-funcionalidad`.
5. Abre un pull request en GitHub.

## Licencia

Este proyecto está bajo la Licencia [nombre de la licencia]. Consulta el archivo [LICENSE.md](LICENSE.md) para obtener más detalles.
