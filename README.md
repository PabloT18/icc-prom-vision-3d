# Construcción 3D con gestos de manos

![alt text](assets/logo-ups-computacion.png)

Aplicación web que permite crear y manipular cubos en un espacio 3D utilizando una cámara y gestos de las manos.

Adaptación educativa para demostraciones de la **Carrera de Computación de la Universidad Politécnica Salesiana, sede Cuenca**.

## ¿Cómo funciona?

La aplicación combina visión por computadora, inteligencia artificial y programación web:

1. El navegador accede a la cámara con autorización del usuario.
2. MediaPipe Hands analiza las imágenes y obtiene 21 puntos de referencia por mano.
3. El código JavaScript interpreta las posiciones y distancias entre esos puntos.
4. Los gestos reconocidos activan acciones sobre los objetos 3D.
5. Three.js renderiza la escena mediante WebGL.

**La inteligencia artificial localiza las manos y sus puntos; el código de la aplicación determina qué acción representa cada gesto.**

El reconocimiento se ejecuta en la computadora del usuario. En esta implementación, las imágenes de la cámara no se envían a un servidor para analizarlas.

## Funcionalidades

- Seguimiento de hasta dos manos.
- Visualización de puntos y conexiones sobre los dedos.
- Construcción de estructuras con cubos.
- Desplazamiento y rotación del conjunto.
- Eliminación de cubos mediante gestos.
- Indicadores visuales del estado y del tiempo de activación.
- Contador de cubos confirmados.
- Identidad visual institucional.

## Controles

Las referencias izquierda y derecha corresponden a las etiquetas utilizadas por la aplicación. Comprueba su correspondencia durante la demostración.

| Gesto | Acción |
|---|---|
| Mantener cerrado el puño izquierdo | Activar el agarre y desplazar el conjunto al mover la mano |
| Mantener una pinza con el pulgar y el índice derechos | Activar la construcción |
| Mover la pinza derecha después de activarla | Extender el trazo sobre un eje |
| Abrir la palma derecha | Confirmar los cubos del trazo |
| Hacer pinza con la mano izquierda y apuntar con el índice derecho | Activar el borrado en la posición señalada |
| Mantener ambas palmas abiertas | Activar la rotación del conjunto |
| Mantener ambos puños cerrados | Restablecer la posición y orientación del conjunto |

Los indicadores circulares muestran el progreso de activación de los comandos.

**Restablecer la posición y orientación no elimina los cubos.**

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la interfaz y captura de video |
| CSS3 | Presentación visual e identidad institucional |
| JavaScript | Interpretación de gestos y lógica de interacción |
| MediaPipe Hands | Detección y seguimiento de manos |
| Three.js | Gestión de la escena y los objetos 3D |
| WebGL | Renderizado gráfico en el navegador |
| Canvas 2D | Dibujo de manos e indicadores |

MediaPipe Hands combina un modelo de detección de palmas y otro de estimación de puntos de la mano. La aplicación utiliza modelos preentrenados; no realiza entrenamiento durante su ejecución.

## Estructura del proyecto

```text
.
├── app.js
├── assets/
│   ├── logo-abet.png
│   ├── logo-sl.png
│   └── logo-ups-computacion.png
├── index.html
├── README.md
└── styles.css
```

- `index.html`: interfaz y carga de dependencias.
- `styles.css`: estilos, distribución y presentación de los logos.
- `app.js`: cámara, reconocimiento, gestos y escena 3D.
- `assets/`: recursos gráficos.

## Ejecutar localmente

### Requisitos

- Navegador actualizado con soporte para WebGL y acceso a cámara.
- Cámara integrada o externa.
- Conexión a internet para descargar las dependencias y los archivos del modelo.
- Python 3 para utilizar el servidor local de este ejemplo.

### Instalación

Clona el repositorio:

```bash
git clone https://github.com/PabloT18/Visual-Block-Coding-Studio.git
cd Visual-Block-Coding-Studio
```

Inicia el servidor:

```bash
python3 -m http.server 8000
```

Abre:

```text
http://localhost:8000/
```

Autoriza el acceso a la cámara y mantén la terminal abierta mientras utilizas la aplicación.

Para detener el servidor, pulsa `Ctrl+C`.

No requiere instalar
## Laboratorio de módulos

La página principal ofrece un menú a la derecha y mantiene los logos institucionales.
Cada módulo vive en `modules/<nombre>/` con su HTML y JavaScript; los nuevos módulos
comparten `modules/shared/runtime.js` y `module.css`. No se necesita compilación.

| Módulo | Reconocimiento | Interacción |
|---|---|---|
| Constructor 3D | Hands | Conserva los gestos del constructor original |
| 01 · Romper bloques | Hands | Mover una mano controla la plataforma; tres vidas y reinicio |
| 02 · Pizarra | Hands | Pinza para dibujar, apuntar a la paleta inferior para cambiar color; borrador y limpieza por botones |
| 04 · Puntos | Holistic | Rostro, contornos de ojos, postura y manos; capas activables |
| 05 · Hilos sonoros | Hands | Una o dos manos deforman las líneas; sonido opcional activado por clic |
| 06 · Invisibilidad | Selfie Segmentation | Capturar un fondo vacío y activar la composición mediante botones |

El módulo 03 de interpretación de señas no forma parte de esta implementación.
Los módulos son demostraciones propias inspiradas en los ejemplos, no copias de sus fuentes.

### Cámara y cambio de módulo

En los módulos nuevos pulsa **Iniciar cámara**. Se procesa un fotograma a la vez.
Al cambiar de módulo se sustituye el documento del visor y se detienen los tracks
de cámara, el bucle de reconocimiento y el audio anteriores. El constructor conserva
su inicio automático. Al regresar a un módulo comienza una sesión nueva: dibujos,
partidas y cubos no se guardan. Los botones del menú también funcionan con teclado.

Usa `python3 -m http.server 8000` y abre `http://localhost:8000/`, o GitHub Pages con
HTTPS. Se mantienen scripts clásicos y rutas relativas para permitir abrir `index.html`
directamente cuando el navegador admita cámara y recursos externos desde `file://`.
La conexión a internet es necesaria para descargar las dependencias y modelos.

### Invisibilidad

Fija la cámara. Pulsa **Capturar fondo en 5 s** y sal del encuadre. Después regresa y
pulsa **Activar invisibilidad**. El programa sustituye los píxeles de la persona por
el fondo capturado usando la máscara de segmentación. No reconstruye objetos ocultos:
si mueves la cámara o cambia el entorno debes capturar el fondo de nuevo. Los bordes
pueden mostrar artefactos. Esta versión usa botones, no un gesto de pinza, para evitar
cargar simultáneamente un segundo detector.

### Verificación manual

- Autorizar y denegar cámara; comprobar el mensaje y el botón de reintento.
- Cambiar varias veces entre módulos y verificar que no continúa el audio anterior.
- Juego: mover plataforma, perder tres vidas, ganar y reiniciar; retirar la mano pausa.
- Pizarra: pinza, soltar sin unir trazos, seleccionar color con la otra mano, borrar y limpiar.
- Puntos: mostrar rostro/cuerpo/manos y alternar las capas.
- Hilos: mover ambas manos, activar/silenciar audio, retirar manos y cambiar de módulo.
- Invisibilidad: capturar sin personas, activar/desactivar y recapturar después de mover la cámara.
- Probar ventana estrecha y navegación con Tab/Enter.

### Pruebas de desarrollo

`node tests/logic.cjs` ejecuta pruebas sin dependencias de los cinco módulos con
resultados simulados: pausa del juego, herramientas de dibujo, salida corporal,
captura del fondo, errores de cámara y cierre de tracks/modelos.

`node tests/smoke.cjs` requiere Playwright, Chromium instalado y el servidor local
en el puerto 8000. Usa cámara y detectores simulados para comprobar navegación y
controles. Puedes indicar un ejecutable mediante `CHROMIUM_PATH`. Estas pruebas
no evalúan precisión de los modelos ni sustituyen la prueba manual con personas.
