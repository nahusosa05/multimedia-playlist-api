# Multimedia Playlist API - Entrega Final

Proyecto final desarrollado para el curso de **Back-End con Java y Spring Boot** de **Talento Tech**.  
Consiste en una API RESTful conectada a una base de datos relacional **MySQL** para la gestión de canales creadores y elementos multimedia (Canciones, Videos y Podcasts) dentro de una playlist, acompañada de una interfaz web dinámica integrada.

NOTA: Para su correcto funcionamiento, al clonar el repositorio, completar en `./src/resources/application.properties` las credenciales personales de MYSQL.

* **Alumno:** Nahuel Sosa
* **Comisión:** 26223
* **Profesor/a:** Gisele González

---

## Video Demostración

> 🔗 **[Ver demostración en YouTube](https://www.youtube.com/watch?v=JT2_LIza7fI)**

En el video se recorre la arquitectura en capas del proyecto, los endpoints RESTful, el funcionamiento en vivo desde el frontend realizado y la persistencia en tiempo real sobre MySQL.o y la persistencia en tiempo real sobre MySQL, chequeando las respectivas tablas.

---
## Estructura del Proyecto
El proyecto sigue una arquitectura en capas desacoplada dentro de `src/main/`:

```text
src/main/
├── java/com/mediamanager/
│   ├── App.java                 # Punto de entrada y precarga inicial de datos (CommandLineRunner)
│   ├── model/                   # Entidades JPA (@Entity) con herencia SINGLE_TABLE y relación @ManyToOne
│   ├── repository/              # Interfaces Spring Data JPA (JpaRepository)
│   ├── service/                 # Lógica de negocio y validación de integridad referencial
│   └── controller/              # Controladores REST (@RestController) con rutas CRUD y CORS
└── resources/
    ├── application.properties   # Configuración de conexión a MySQL e Hibernate
    └── static/                  # Frontend web servido por Spring Boot (index.html y js/app.js)