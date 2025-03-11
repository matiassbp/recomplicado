# Visualizador de Datos Empresariales

## Descripción
Este proyecto es una aplicación web desarrollada con React y Vite que permite visualizar, filtrar y exportar datos empresariales a partir de un conjunto de datos simulado. La aplicación muestra información sobre empresas, áreas, trabajadores y sus respectivos sueldos en una interfaz amigable y responsiva.

## Características
- **Visualización de datos en formato de tabla**
- **Filtros dinámicos** para facilitar la búsqueda de información
- **Paginación** para mejorar la experiencia de usuario
- **Exportación a Excel** de los datos visualizados
- **Dashboard de KPIs** con información estadística relevante
- **Diseño responsivo** adaptable a múltiples dispositivos

## Tecnologías utilizadas
- React 18
- Vite
- JavaScript
- CSS (metodología BEM)
- [Nombre de la librería para UI, si utilizaste alguna]
- [Otras librerías o herramientas relevantes]

## Requisitos previos
- Node.js (versión 14.0 o superior)
- npm o yarn

## Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/matiassbp/recomplicado.git
cd prueba

npm install
# o
yarn install

npm run dev
# o
yarn dev
```

Abrir el navegador en la dirección indicada (generalmente http://localhost:5173)
```bash
## Estructura del proyecto
```bash
src/
├── assets/             # Recursos estáticos (imágenes, fonts, etc.)
├── components/         # Componentes reutilizables
│   ├── DataTable/      # Componente de tabla principal
│   ├── Filters/        # Componentes de filtrado
│   ├── Pagination/     # Componente de paginación
│   └── KPIDashboard/   # Componentes para visualización de KPIs
├── data/               # Archivos de datos
│   ├── origen-datos-junior.xlsx
│   └── diccionario-de-datos.json
├── hooks/              # Custom hooks
├── services/           # Servicios para manejo de datos
├── utils/              # Funciones de utilidad
├── App.jsx             # Componente principal
└── main.jsx            # Punto de entrada
```

