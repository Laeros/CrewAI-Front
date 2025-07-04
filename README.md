# CrewAI Frontend

Interfaz web para el sistema de agentes conversacionales inteligentes **CrewAI**. Esta aplicación permite a los usuarios interactuar con agentes IA, crear y personalizar herramientas, así como gestionar el acceso administrativo.

## 🚀 Tecnologías

- React
- Vite
- Axios
- React Router DOM
- Tailwind CSS (opcional)
- JWT + LocalStorage

## 📦 Instalación

```bash
git clone https://github.com/Laeros/CrewAI-Front.git
cd CrewAI-Front
npm install
```

## 🧪 Scripts disponibles

```bash
npm run dev        # Inicia servidor de desarrollo
npm run build      # Compila la app para producción
npm run preview    # Visualiza la app compilada localmente
```

## ⚙️ Despliegue en Producción

1. Ejecuta el build:

```bash
npm run build
```

2. Copia la carpeta `dist/` al servidor web (por ejemplo NGINX):

```bash
cp -r dist/* /usr/share/nginx/html/
```

3. Asegúrate de que el backend esté sirviendo en la ruta `/api`.

## 🔐 Variables de Entorno

Crea un archivo `.env` en la raíz con:

```
VITE_API_URL=
```

## 🧑‍💻 Contribución

¡Gracias por tu interés en contribuir!

1. Haz un fork del repositorio.
2. Crea una nueva rama: `git checkout -b feature/tu-aporte`
3. Realiza tus cambios y haz commit: `git commit -m 'Descripción de tu aporte'`
4. Haz push a tu rama: `git push origin feature/tu-aporte`
5. Abre un Pull Request explicando tu contribución.
