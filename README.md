# 💻🔐 FaceAuthenticator

Este proyecto es un sistema de autenticación facial desarrollado utilizando Face-api.js y Supabase, que permite a los usuarios iniciar sesión mediante el reconocimiento facial.

## 📝 Descripción

FaceAuthenticator es una aplicación web de autenticación basada en reconocimiento facial, desarrollada utilizando React e inteligencia artificial de reconocimiento facial. El principal objetivo de la aplicación es ofrecer un sistema de autenticación confiable y eficiente mediante el análisis y la verificación de las características faciales del usuario.

## 🚀 Funcionalidades

- **Registro de Usuarios:** Los usuarios pueden registrarse en la aplicación proporcionando su información personal junto con una imagen de su rostro.
- **Autenticación Facial:** Los usuarios registrados pueden iniciar sesión en la aplicación mediante el reconocimiento facial. El sistema compara la imagen facial capturada en tiempo real con las imágenes registradas durante el registro.
- **Interfaz de Usuario Intuitiva:** La aplicación proporciona una interfaz de usuario simple y fácil de usar para el registro y la autenticación de usuarios.


## 🛠️ Tecnologías Utilizadas

- [![Face-api.js](https://img.shields.io/badge/Face--api.js-%23000?style=for-the-badge&logo=javascript&logoColor=white)](https://github.com/justadudewhohacks/face-api.js)
- [![Supabase](https://img.shields.io/badge/Supabase-%2300B289?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.io/)
- [![React](https://img.shields.io/badge/React-%2361DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
- [![Node.js](https://img.shields.io/badge/Node.js-%23339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
- [![npm](https://img.shields.io/badge/npm-%23000000?style=for-the-badge&logo=npm&logoColor=white)](https://www.npmjs.com/)
- [![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-%2338B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

## 🚀 Demostración

Puedes ver una demostración en vivo [aquí](https://faceauthenticator.netlify.app/).

## 🚀 Guía de Despliegue
 ### 1. Clonar el Repositorio
Primero, clona el repositorio a tu máquina local utilizando el siguiente comando:

```bash
  git clone https://github.com/yairhdz24/FaceAuthenticator.git
```

### 2. Instalar Dependencias
Accede al directorio de tu proyecto y ejecuta el siguiente comando para instalar todas las dependencias necesarias:

```bash
  cd FaceAuthenticator
  npm install
  npm start
```
    
## 🚀 ¿Cómo funciona?
  ### Página de inicio
  Al ingresar a la página de nuestro proyecto lo primero que veremos sera la página de inicio o home page, esta contiene un pequeño resumen acerca del proyecto, los botones para iniciar sesión y registrarse, y en la parte de abajo se encuentra el footer, el cual contiene información sobre nosotros como nuestras cuentas de github, y además ahí podemos encontrar el link al repositorio.
  ![Captura de pantalla 2024-04-03 194157](https://github.com/judith-vm/MiCV/assets/157530840/4bf3166a-3d51-4dc5-a8fd-532fb3cbd8b0)

  ### Registrarse
  Al dar click sobre el botón registrarse se nos enviara a otra pestaña en la cual podemos registrarnos, el registro se realiza ingresando algun nombre de usuario y una fotografía del rostro del usuario que estamos ingresando, esto con el fin de que este usuario inicie sesión con reconocimiento facial, ya que cargamos todo damos click en "guardar" y podremos iniciar sesión con el nuevo usuario.
![Captura de pantalla 2024-04-03 194845](https://github.com/judith-vm/MiCV/assets/157530840/e8343ffc-212a-4638-bd3b-6da7b4aaa950)

 ### Iniciar Sesión
  Al dar click sobre el botón iniciar sesión se nos enviara a una pestaña donde se encuentran enlistados los usuarios que tenemos en nuestra base de datos, para iniciar sesión con alguno de estos basta con seleccionarlo y dar click en "continuar" para poder comenzar el proceso de iniciar sesión con reconocimiento facial.
 ![Captura de pantalla 2024-04-03 195227](https://github.com/judith-vm/MiCV/assets/157530840/68913c42-40d4-43d2-af35-d0761d159b94)

 ### Cargando modelos
 Esta pestaña nos aparece una vez que damos click en el botón "continuar" de la pestaña iniciar sesión, lo que podemos ver aquí es un mensaje que nos indica que los modelos de reconocimiento facial estan cargando, esto con el fin de que el usuario no se desespere si la página tarda un poco en cargar dichos modelos.
![Captura de pantalla 2024-04-03 195451](https://github.com/judith-vm/MiCV/assets/157530840/9da2e54c-1ffe-4024-bd7a-20da204f9f71)

 ### Escanear rostro
 Una vez que los modelos se cargaron de manera correcta y estan listos para escanear algún rostro se nos mostrara esta pestaña para poder comenzar el escaneo de nuestro rostro y ver si existen coincidencias entre el usuario registrado y el que esta queriendo ingresar, para comenzar este proceso damos click en el botón "escanear rostro".
![Captura de pantalla 2024-04-03 195543](https://github.com/judith-vm/MiCV/assets/157530840/777f7e27-41e2-4778-87eb-debc4a7f4b1e)

### Reconocimiento facial
Una vez que damos click en "escanear rostro" se nos pedira acceso a la cámara de nuestro dispositivo, ya que se tiene acceso a la cámara se iniciara el proceso de detección, si se obtiene éxito se nos mostrara un mensaje diciendo que esperemos a que termine de reconocer nuestro rostro para poder iniciar sesión y en caso contrario se nos dira que el rostro no pudo ser reconocido.
![Captura de pantalla 2024-04-03 195722](https://github.com/judith-vm/MiCV/assets/157530840/5a2058e0-9e01-473a-a766-4c7d0af33f33)

### Inicio de sesión exitoso
Cuando el rostro es reconocido se nos indicara que iniciamos sesión de manera correcta y podremos ver la opción de cerrar sesión si asi lo deseamos.
![Captura de pantalla 2024-04-03 195901](https://github.com/judith-vm/MiCV/assets/157530840/0c6e0e8e-c9ac-45d4-b770-2fcfa1dd34e1)


 
## Team 🛠️
- Yair Hernandez Ochoa
- Judith Baudelia Villalvazo Marin
