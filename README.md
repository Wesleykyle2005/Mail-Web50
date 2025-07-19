# 📬 Mail-Web50 — Cliente Web de Correo Electrónico

**Mail-Web50** es un cliente de correo electrónico de una sola página (SPA), desarrollado con **Django** y **JavaScript** como parte del curso **CS50's Web Programming with Python and JavaScript (CS50W)**. Incorpora un diseño moderno con **efectos glassmorphism**, y permite enviar, recibir, archivar y responder correos de forma eficiente en una interfaz dinámica y responsiva.

![Bandeja de entrada con efectos glassmorphism](mail/static/mail/images/inbox.png)

---

## ✨ Funcionalidades Principales

### 📧 Cliente de Correo Electrónico

* Envío de correos entre usuarios registrados
* Visualización de bandejas: Entrada, Enviados y Archivados
* Lectura detallada de correos individuales
* Archivado y desarchivado de mensajes recibidos
* Respuesta rápida con precarga automática de campos (destinatario, asunto, cita)
* Diferenciación visual entre correos leídos y no leídos
* Interfaz moderna, responsiva y fluida (SPA)

---

## 🎨 Estética y Diseño CSS Avanzado

### 🧊 Glassmorphism Aplicado

* **Barra de navegación translúcida**: `backdrop-filter: blur(10px)`
* **Menú lateral con opacidad del 40%** y efecto cristal
* **Botones con animación “shine”** deslizante
* **Backdrop sin oscurecimiento**: visibilidad total de fondo

![Navbar con efecto glassmorphism abierto](mail/static/mail/images/Nabar_glassmorphism_open.png)

### 🗂 Sistema Jerárquico de Z-Index

* Navbar (`z-index: 1050`): Siempre visible
* Offcanvas lateral (`z-index: 1045`): Superpuesto al fondo
* Backdrop (`z-index: 1040`): Clics interceptados sin oscurecer

### 🔍 Estados Visuales Inteligentes

* Correos no leídos: borde azul + fondo con gradiente
* Correos leídos: borde gris + fondo blanco
* Animaciones: `fadeIn` combinadas con `translateY` para carga suave

### 🧠 Interacciones CSS Sofisticadas

* Hover en botones: desplazamiento horizontal con efecto shine
* Hover en tarjetas: elevación sutil + sombra dinámica
* Transiciones coordinadas (0.3s): experiencia de navegación fluida

### 🧩 Otras Características de Estilo

* Tipografía *Inter* (Google Fonts) con fallback
* Uso extensivo de variables CSS para consistencia
* Scrollbar temática personalizada
* Diseño responsivo adaptado a breakpoint de 768px
* Integración no intrusiva con **Bootstrap 5**

---

## 🚀 Instalación y Puesta en Marcha

1. Clona el repositorio:

   ```bash
   git clone https://github.com/Wesleykyle2005/Mail-Web50
   cd Mail-Web50
   ```
2. Instala dependencias:

   ```bash
   pip install django
   ```
3. Aplica migraciones:

   ```bash
   python manage.py makemigrations mail
   python manage.py migrate
   ```
4. Ejecuta el servidor:

   ```bash
   python manage.py runserver
   ```
5. Accede a la aplicación en: [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

## 🧪 Modo de Uso

* Regístrate con cualquier correo y contraseña (todo funciona localmente)
* Navega entre bandejas desde el menú lateral con efecto glassmorphism
* Redacta un nuevo correo desde la vista "Compose"
* Haz clic en un mensaje para leerlo, archivarlo o responder rápidamente

![Compositor de emails](mail/static/mail/images/Composer.png)

---

## 🛠 Requisitos del Sistema

* **Python 3.x**
* **Django 3.x** o superior
* Navegador moderno con soporte para `backdrop-filter` (Chrome, Edge, Safari)

---

## 📁 Estructura del Proyecto

```
Mail-Web50/
├── mail/                    # Aplicación principal
│   ├── static/mail/
│   │   ├── inbox.js         # Lógica JavaScript SPA
│   │   └── styles.css       # Estilos CSS (glassmorphism)
│   ├── templates/mail/
│   │   ├── inbox.html       # Plantilla de bandeja principal
│   │   └── layout.html      # Plantilla base
│   ├── models.py            # Modelo Email
│   ├── views.py             # Vistas y API REST
│   └── urls.py              # Enrutamiento de la aplicación
├── project3/                # Configuración del proyecto Django
```

---

## 🔌 API REST Endpoints

* `GET /emails/<mailbox>` — Devuelve emails según la bandeja (`inbox`, `sent`, `archive`)
* `GET /emails/<email_id>` — Obtiene un correo por ID
* `POST /emails` — Envía un nuevo correo (`recipients`, `subject`, `body`)
* `PUT /emails/<email_id>` — Modifica el estado de un correo (`read`, `archived`)

---

## ✅ Especificaciones Implementadas

### Funcionalidades del lado del cliente

* Envío de correos validado
* Renderizado dinámico de bandejas con AJAX
* Visualización individual de correos con marcado como leído
* Archivado/desarchivado de correos
* Respuesta rápida con campos prellenados
* SPA funcional sin recargas de página
* Estados visuales diferenciados para lectura

### Aportes CSS únicos

1. Menú lateral sin oscurecimiento visual
2. Efecto shine animado en botones interactivos
3. Estados visuales para correos leídos/no leídos
4. Navbar con visibilidad persistente
5. Transiciones CSS suaves y coherentes
6. Scrollbar personalizada con integración temática
7. Diseño responsivo con compatibilidad móvil total

---

## 🎨 Paleta de Colores del Proyecto

* **Primary:** `#2563eb` — Azul moderno
* **Secondary:** `#64748b` — Gris elegante
* **Success:** `#10b981` — Verde de confirmación
* **Warning:** `#f59e0b` — Amarillo advertencia
* **Error:** `#ef4444` — Rojo error
* **Glassmorphism Base:** opacidad 40% con desenfoque

---

## 📱 Responsive Design

* Breakpoint principal: `768px`
* Offcanvas lateral móvil: `280px` de ancho
* Interfaz táctil: botones ≥ 44px
* Animaciones optimizadas: rendimiento estable en móviles (60 fps)