# Ed-Link · MVP (Wizard of Oz)

Prototipo navegable para el Demo Day — Módulo 5, Punto III (Product-Market Fit).

El flujo *parece* automatizado por IA, pero detrás el equipo opera el matching a mano.
Valida la hipótesis: **¿un diagnóstico automatizado de brechas genera intención de compra
(solicitud de reunión) en empresas medianas?**

---

## Paso 1 — Configurar la captura de datos (5 minutos, IMPORTANTE)

Sin esto, el prototipo funciona pero NO guarda quién solicitó la reunión. Para medir tu N≥20 lo necesitás.

1. Entrá a **https://formspree.io** y creá una cuenta gratis.
2. Creá un formulario nuevo ("New Form"). Te va a dar un endpoint tipo:
   `https://formspree.io/f/xayzqwer`
3. Abrí el archivo **`src/App.jsx`**, buscá esta línea (cerca de la pantalla de Conversión):
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/TU_ID";
   ```
   Reemplazá `TU_ID` por tu ID real. Quedaría:
   ```js
   const FORMSPREE_ENDPOINT = "https://formspree.io/f/xayzqwer";
   ```
4. Guardá el archivo. Listo: cada solicitud de reunión te va a llegar por mail
   y queda registrada en el panel de Formspree (con nombre, empresa, email, la ruta
   elegida y todas las respuestas del diagnóstico).

> Si NO configurás esto, el botón "Enviar solicitud" igual deja pasar al usuario a la
> pantalla de gracias (para no trabar la prueba), pero no se registra nada.

---

## Paso 2 — Subir a Vercel (el camino más simple)

### Opción A — Con GitHub (recomendado)
1. Creá un repositorio nuevo en **https://github.com** y subí esta carpeta completa.
2. Entrá a **https://vercel.com**, registrate con tu cuenta de GitHub.
3. "Add New… → Project" → elegí tu repositorio → **Deploy**.
4. Vercel detecta Vite solo. En 1 minuto te da una URL tipo `edlink-mvp.vercel.app`.

### Opción B — Sin GitHub, desde la terminal
1. Instalá Node.js (https://nodejs.org) si no lo tenés.
2. En esta carpeta, abrí una terminal y ejecutá:
   ```bash
   npm install
   npm install -g vercel
   vercel
   ```
3. Seguí las instrucciones en pantalla. Te da la URL pública al final.

---

## Probarlo localmente antes de subir (opcional)
```bash
npm install
npm run dev
```
Abrí el link que aparece (normalmente http://localhost:5173).

---

## Qué hace cada pantalla
1. **Landing** — propuesta de valor.
2. **Chat** — el "bot" de diagnóstico (LNA): 4 preguntas.
3. **Analizando** — la cortina del Mago de Oz (simula el procesamiento por IA).
4. **Shortlist** — rutas curadas con *trust layer* (sello + finalización + casos), no swipe.
5. **Detalle** — la ruta modular, con módulos saltables y precio bajo umbral USD 10.000.
6. **Conversión** — formulario que captura el dato que valida el experimento.
7. **Gracias** — confirmación.
8. **Métricas** — panel interno con el embudo y la hipótesis (link al pie del landing).
