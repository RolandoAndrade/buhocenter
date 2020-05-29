# Buhocenter ![npm](https://img.shields.io/badge/node-v8.12.0-green) ![npm](https://img.shields.io/badge/vue-2.6.11-red) ![npm](https://img.shields.io/badge/version-1.0-blue) ![npm](https://img.shields.io/badge/postgresql-v.11or12-blue)

![Logo-completo](https://user-images.githubusercontent.com/44983658/82739421-64d46c00-9d0d-11ea-87ea-c8c1d27f2a21.png)
## Fase 1

## Find everything, buy anything

Buhocenter es un nuevo comercio electrónico que permite el pago con criptomonedas. Miles de productos al alcance de un clic, encuentra el producto de tu necesidad en nuestros catálogos, ¿te sientes perdido? No te preocupes, con nuestras categorías podrás encontrar lo que necesites, desde productos de tecnología, hasta productos del hogar.
 
## Funcionalidades

Como cliente de Buhocenter podrás:
 
- Registrarte de manera tradicional o con tus cuentas de Gmail o Facebook.
- Administrar tu perfil de usuario
- Registrar direcciones dentro de EE.UU para que recibas tus compras
- Administrar tus direcciones
- Buscar miles de productos y servicios
- Buscar productos o servicios por catálogos
- Buscar catálogos por categorías
- Seleccionar el idioma en que quieres ver el contenido de buhocenter
- Agregar productos a tu carrito
- Comprar los productos/servicios en tu carrito pagando con criptomonedas
- Recibir correos de bienvenida, también al completar una transacción con éxito
- Recibir correos con nuevas ofertas y descuentos
   
Como parte de nuestro equipo de administradores podrás:
   
- Gestionar usuarios
- Agregar productos/servicios
- Gestionar productos/servicios
- Definir el mínimo de un producto en inventario

## Imágenes de Buhocenter

![BUHOCENTER-1](https://user-images.githubusercontent.com/44983658/82739440-82a1d100-9d0d-11ea-8522-e10486e998d4.PNG)

![BUHOCENTER-2](https://user-images.githubusercontent.com/44983658/82739498-065bbd80-9d0e-11ea-806b-8fb17892fc1d.PNG)

![BUHOCENTER-3](https://user-images.githubusercontent.com/44983658/82739510-1d9aab00-9d0e-11ea-9b4d-efb41561c9e0.PNG)

![BUHOCENTER-4](https://user-images.githubusercontent.com/44983658/82739518-31dea800-9d0e-11ea-9857-599181fa434c.PNG)

## Instalación y Setup

Primero que nada, necesitas [NPM](https://npmjs.org) y [Node.JS](https://nodejs.org/es/).
Después, es necesario instalar NestJS de manera global

```bash
$ npm install nestjs -g
```

Procede a clonar el proyecto, y verifica que estás ubicado en la rama master

### Archivos de Configuración

Antes de proceder con la ejecución de las aplicaciones, agregue los archivos con el nombre `.env` correspondientes a cada uno de los proyectos.

Este es el [formato del archivo .env](https://github.com/ingswucab/consorcio2-buhocenter/blob/develop/buhocenter-backend/.env.test) para backend, en él se declaran variables de entorno necesarias para la ejecución de la aplicación. Por lo tanto, es de vital importancia llenarla antes de pasar a la instalación y debe estar ubicado en el directorio `/buhocenter-backend`.

Este es el [formato del archivo .env](https://github.com/ingswucab/consorcio2-buhocenter/blob/develop/buhocenter-frontend/.env.test) para frontend y debe estar ubicado en `/buhocenter-frontend`.

De igual forma, puede obtener la estructura del archivo de configuración .env en `/buhocenter-backend/.env.test` o `/buhocenter-frontend/.env.test` respectivamente.

### Instalación Backend

En `/buhocenter-backend` ejecute:

```bash
$ npm install
```

### Frontend

En `/buhocenter-frontend` ejecute:

```bash
$ npm install
```

## Creación de la Base de Datos

Para ejecutar de forma correcta la aplicación, proceda con la creación de la base de datos en el manejador PostgreSQL con el nombre **buhocenter**.

## Ejecución de las Aplicaciones

Antes de proceder con la ejecución de la aplicación, asegúrate de tener las variables de ambiente necesarias de ambos proyecto en el archivo `.env`. Una vez se haya validado esto, es necesario que primero se ejecute el proyecto de backend y luego frontend, y adicionalmente, asegúrese de modificar la variable **TYPEORM_DATABASE** en el archivo .env ubicado en `buhocenter-backend` a **buhocenter** así como **TYPEORM_SYNCHRONIZE** a **true** para la creación automática de la base de datos. Procede con la ejecución de los siguientes comandos:

### Backend

Asegúrate de tener disponible el puerto `3000` para la ejecución del proyecto. Posterior a esto, ejecute:

```bash
$ npm run start
```

Después de la ejecución de este comando, puede validar en la base de datos la creación de todas las entidades correspondientes al sistema. En caso de ser así, proceda a la ejecución de los scripts de inserción de la base de datos ubicados en `/buhocenter-backend/db/inserts.sql`

#### Alternativas

Como método alternativo para la creación de la base de datos, puede realizar lo siguiente:

- Crear una base de datos en el manejador PostgreSQL llamada **buhocenter_sync**
- Modificar la variable **TYPEORM_DATABASE** a **buhocenter_sync** que es el nuevo nombre de la base de datos
- Ejecutar los scripts de [creación de la base de datos](https://docs.google.com/document/d/1fqBmWDtxM-lpkkE025ISYKQZBnhTBNtd6IvhTVh636Q/edit?usp=sharing)
- Ejecutar los scripts de inserción de la base de datos ubicados en `/buhocenter-backend/db/inserts.sql`

Una vez se haya validado la correcta creación de la base de datos, proceda con la ejecución del proyecto de frontend

### Frontend

Asegúrate de tener disponible el puerto `8080` para la ejecución del proyecto. Posterior a esto, ejecute:

```bash
$ npm run serve
```

## API

Para validar las direcciones se usa la API de SmartyStreets.

![SmartyStreets](https://user-images.githubusercontent.com/44983658/82739607-bcbfa280-9d0e-11ea-8c74-cc5102c479a2.png)

La pasarela de pago que se encarga de las transacciones es UTRUST.

![UTRUST](https://user-images.githubusercontent.com/44983658/82739619-dbbe3480-9d0e-11ea-980c-a043ec5ec2e0.jpg)

También usamos Firebase-Auth para el proceso de autenticación.

![Firebase](https://user-images.githubusercontent.com/44983658/82739665-69018900-9d0f-11ea-8317-5678d71a384e.png)

---------------------------
## MIT © 
[Ángel Sucasas](mailto:aasucasas.17@est.ucab.edu.ve)
[Andrea Da Silva](mailto:avdasilvab.17@est.ucab.edu.ve)
[Gabriel Ortega](mailto:geortega.17@est.ucab.edu.ve)

