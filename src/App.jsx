import React, { useState, useEffect, useRef } from "react";

// ============================================================================
// ED-LINK · MVP NAVEGABLE (Wizard of Oz)
// Prototipo para Demo Day — Módulo 5, Punto III (Product-Market Fit)
// El flujo PARECE automatizado por IA. Detrás, el equipo opera el matching.
// La hipótesis que valida: ¿un diagnóstico automatizado de brechas genera
// intención de compra (solicitud de reunión) en empresas medianas?
// ============================================================================

const C = {
  ink: "#1B263F",        // Deep Navy — texto, botones, logo
  paper: "#FEFFFD",      // Ivory Whisper — fondo
  card: "#FFFFFF",
  line: "#E4E7E2",       // borde suave
  brass: "#204F56",      // Ocean Teal — acento institucional / sello
  brassSoft: "#DCE8E8",  // Ocean Teal suavizado para fondos
  teal: "#204F56",       // Ocean Teal — verde técnico/industria
  tealSoft: "#DCE8E8",
  slate: "#5C6B7A",      // gris azulado, texto secundario
  good: "#204F56",       // Ocean Teal como "éxito" (sobrio)
  goodSoft: "#DCE8E8",
  wisteria: "#9EB8F9",   // Sky Mist — acento secundario / dato de afinidad
  zest: "#E6FD53",       // Lemon Zest — acento de energía / CTA destacado
};

const FONT_DISPLAY = "'DM Serif Display', Georgia, serif";
const FONT_BODY = "'DM Sans', system-ui, sans-serif";

// --- Datos curados (el "detrás de escena" del Mago de Oz) -------------------
const DOCENTES = [
  {
    id: "qa-bank",
    uni: "UNSAM",
    color: C.teal,
    ruta: "QA Automation en entornos bancarios",
    coordinador: "Coord. de Ing. Informática",
    modulos: 4,
    horas: 32,
    desde: 7200,
    sello: "Universidad Nacional de San Martín",
    finalizacion: 91,
    casos: 3,
    match: 96,
    porque: "Tu brecha en testing automatizado sobre core bancario coincide con un programa ya dictado a una fintech de 180 personas.",
    formato: "Híbrido · 2 módulos in situ + 2 digitales",
  },
  {
    id: "ba-auto",
    uni: "UNAB",
    color: C.brass,
    ruta: "Business Analysis con foco en automatización de procesos",
    coordinador: "Coord. de Lic. en Sistemas",
    modulos: 3,
    horas: 24,
    desde: 5400,
    sello: "Universidad Nacional de Almirante Brown",
    finalizacion: 88,
    casos: 2,
    match: 89,
    porque: "Cubre el perfil de BA con experiencia en automation que mencionaste como vacante difícil de cubrir.",
    formato: "Híbrido · 1 módulo in situ + 2 digitales",
  },
  {
    id: "data-ops",
    uni: "UNLP",
    color: "#5A4FB5",
    ruta: "Operación de datos y tableros para áreas técnicas",
    coordinador: "Coord. de Informática",
    modulos: 3,
    horas: 20,
    desde: 4800,
    sello: "Universidad Nacional de La Plata",
    finalizacion: 84,
    casos: 1,
    match: 78,
    porque: "Complemento opcional si tu equipo necesita autonomía en métricas e impacto.",
    formato: "Digital modular",
  },
  {
    id: "ciberseguridad",
    uni: "UTN",
    color: "#B23B3B",
    ruta: "Ciberseguridad ofensiva y defensa de infraestructura",
    coordinador: "Coord. de Ing. en Sistemas de Información",
    modulos: 4,
    horas: 36,
    desde: 8400,
    sello: "Universidad Tecnológica Nacional",
    finalizacion: 90,
    casos: 2,
    match: 95,
    porque: "Cubre hardening, análisis de vulnerabilidades y respuesta a incidentes sobre tu propia infraestructura, no sobre laboratorios genéricos.",
    formato: "Híbrido · 2 módulos in situ + 2 digitales",
  },
  {
    id: "machine-learning",
    uni: "UBA",
    color: "#1F6E6B",
    ruta: "Machine Learning aplicado a problemas de negocio",
    coordinador: "Coord. de Ciencias de la Computación",
    modulos: 4,
    horas: 32,
    desde: 8900,
    sello: "Universidad de Buenos Aires",
    finalizacion: 87,
    casos: 2,
    match: 93,
    porque: "Entrena a tu equipo en modelos sobre tus propios datasets, con foco en puesta en producción y no solo en teoría.",
    formato: "Híbrido · 1 módulo in situ + 3 digitales",
  },
];

// Enriquecimiento por ruta (id): split híbrido, personas sugeridas y casos verificados.
// Reemplaza el rating de usuarios por evidencia institucional (coherente con la investigación).
const EXTRA = {
  "qa-bank": {
    online: 50, presencial: 50, personas: "8–25",
    docente: { nombre: "Ing. Marcela Ferreyra", titulo: "Docente e investigadora en testing de software", credencial: "15 años en QA bancario · UNSAM" },
    casosDetalle: [
      { empresa: "Fintech de pagos · 180 personas", quote: "El equipo de QA pasó de testing manual a automatizado en 6 semanas. Bajamos los bugs en producción a la mitad.", rol: "Gerente de Ingeniería" },
      { empresa: "Banco mayorista · 200 personas", quote: "La capacitación fue sobre nuestro propio core bancario, no sobre ejemplos genéricos. Eso cambió todo.", rol: "Líder de QA" },
      { empresa: "Procesadora de tarjetas · 90 personas", quote: "Lo presencial in situ con el docente resolvió dudas que ningún curso online nos había podido cerrar.", rol: "Coord. de Testing" },
    ],
  },
  "ba-auto": {
    online: 66, presencial: 34, personas: "5–18",
    docente: { nombre: "Lic. Diego Sosa", titulo: "Analista funcional y docente de automatización", credencial: "Ex-líder de procesos · UNAB" },
    casosDetalle: [
      { empresa: "Software factory · 120 personas", quote: "Conseguimos formar BAs con foco en automatización que el mercado no nos daba.", rol: "Head of Delivery" },
      { empresa: "Consultora IT · 70 personas", quote: "El módulo presencial sobre nuestros procesos reales fue el diferencial.", rol: "Gerente de Proyectos" },
    ],
  },
  "data-ops": {
    online: 100, presencial: 0, personas: "4–15",
    docente: { nombre: "Dra. Paula Giménez", titulo: "Investigadora en ciencia de datos", credencial: "Especialista en visualización · UNLP" },
    casosDetalle: [
      { empresa: "Retail · 300 personas", quote: "El equipo ganó autonomía en tableros sin depender del área de sistemas.", rol: "Jefa de Operaciones" },
    ],
  },
  "ciberseguridad": {
    online: 50, presencial: 50, personas: "6–20",
    docente: { nombre: "Ing. Hernán Vidal", titulo: "Especialista en seguridad ofensiva", credencial: "Pentester certificado · UTN" },
    casosDetalle: [
      { empresa: "Energía · 400 personas", quote: "El ejercicio de respuesta a incidentes se hizo sobre nuestra infraestructura real. Invaluable.", rol: "CISO" },
      { empresa: "Logística · 150 personas", quote: "Pasamos de no tener prácticas de hardening a un protocolo documentado.", rol: "Líder de Infra" },
    ],
  },
  "machine-learning": {
    online: 75, presencial: 25, personas: "5–16",
    docente: { nombre: "Dra. Elena Gómez", titulo: "Directora de IA y Ciencia de Datos", credencial: "PhD en Cs. de la Computación · UBA" },
    casosDetalle: [
      { empresa: "Agroindustria · 250 personas", quote: "Entrenamos modelos sobre nuestros propios datos de producción y los pusimos en producción.", rol: "Director de Datos" },
      { empresa: "Fintech · 180 personas", quote: "El foco en MLOps fue clave: no quedó en teoría, llegó al deploy.", rol: "Lead Data Scientist" },
    ],
  },
};

// Etiqueta de modalidad híbrida según el split online/presencial.
function splitLabel(id) {
  const e = EXTRA[id];
  if (!e) return "Híbrido";
  if (e.presencial === 0) return "100% online";
  if (e.online === 0) return "100% presencial";
  return `${e.online}% online · ${e.presencial}% presencial`;
}

// ============================================================================
// MODELO DE NEGOCIO: suscripción anual por créditos canjeables.
// La empresa contrata un plan, recibe créditos y los destina a los cursos
// que la plataforma le sugiere. Cada curso cuesta créditos según duración,
// expertise del docente y modalidad (remoto / híbrido / in situ).
const PLANES = [
  {
    id: "starter", nombre: "Starter", precio: 4900, creditos: 50, destacado: false,
    pitch: "Para equipos que arrancan su primer trayecto formativo.",
    incluye: [
      "Diagnóstico de necesidades (LNA)",
      "Cursos 100% remotos",
      "1 ruta de aprendizaje activa",
      "Certificación con aval universitario",
    ],
  },
  {
    id: "professional", nombre: "Professional", precio: 9500, creditos: 120, destacado: true,
    pitch: "El plan más elegido por empresas medianas con varias áreas técnicas.",
    incluye: [
      "Todo lo de Starter",
      "Cursos híbridos (remoto + presencial)",
      "Hasta 3 rutas simultáneas",
      "Reportes de avance del equipo",
      "Soporte de un coordinador asignado",
    ],
  },
  {
    id: "enterprise", nombre: "Enterprise", precio: 18000, creditos: 260, destacado: false,
    pitch: "Para organizaciones que necesitan intervención profunda y a medida.",
    incluye: [
      "Todo lo de Professional",
      "Módulos in situ en planta u oficina",
      "Rutas ilimitadas",
      "Coordinador dedicado",
      "Diseño de casos a medida (co-creación)",
    ],
  },
];

// Costo en créditos de cada curso, derivado de horas, expertise y modalidad.
// Se calcula sobre los datos de la ruta para mantener coherencia.
function costoCreditos(d) {
  const ex = EXTRA[d.id] || {};
  let base = Math.round(d.horas / 2);            // duración
  if (d.match >= 93) base += 8;                  // expertise (docente senior / alta afinidad)
  if ((ex.presencial || 0) > 0) base += 10;      // modalidad híbrida cuesta más que 100% remoto
  return base;
}

// Mapea cada rol del diagnóstico a las rutas relevantes (IDs del catálogo).
// El orden define cuál aparece como "mejor afinidad".
const RUTAS_POR_ROL = {
  "QA / Testing": ["qa-bank", "ba-auto", "data-ops"],
  "Business Analysis": ["ba-auto", "data-ops", "qa-bank"],
  "Datos / Reporting": ["data-ops", "machine-learning", "ba-auto"],
  "Ciberseguridad": ["ciberseguridad", "qa-bank", "data-ops"],
  "Machine Learning": ["machine-learning", "data-ops", "ciberseguridad"],
  "Automatización e IA en procesos": ["machine-learning", "data-ops", "ba-auto"],
  "Otro perfil técnico": ["qa-bank", "ba-auto", "data-ops"],
};

const PREGUNTAS = [
  {
    k: "rol",
    bot: "Hola 👋 Soy el asistente de diagnóstico de Ed-Link. Estoy aquí para ayudarte a relevar los desafíos de tu área y conectarlos con la capacidad científica y académica de las Universidades Nacionales.\n\nA través de unas breves preguntas, identificaremos el núcleo de tu necesidad para estructurar la primera etapa de una propuesta formativa situada en tu contexto real. Para empezar: ¿qué rol o equipo operativo necesitás fortalecer hoy?",
    opciones: ["QA / Testing", "Business Analysis", "Datos / Reporting", "Ciberseguridad", "Machine Learning", "Automatización e IA en procesos", "Otro perfil técnico"],
    rama: {
      "Automatización e IA en procesos": {
        k: "enfoque_ia",
        bot: "Muy bien. La incorporación de IA puede abordarse desde distintos ángulos. ¿Cuál describe mejor lo que tu equipo necesita?",
        opciones: [
          "Automatización de procesos: reemplazar tareas manuales y repetitivas por flujos automáticos.",
          "Orquestación con IA: coordinar herramientas, datos y modelos en un proceso integrado de punta a punta.",
          "Uso optimizado de IA en procesos: que el equipo aproveche mejor las herramientas de IA que ya usa en el día a día.",
        ],
      },
    },
  },
  {
    k: "brecha",
    bot: "Entendido. ¿Cuál es el dolor concreto hoy?",
    opciones: [
      "El onboarding de un perfil nuevo tarda ~45 días",
      "No consigo el perfil en el mercado",
      "El equipo quedó desactualizado en una tecnología",
      "Los cursos genéricos no aplican a nuestro contexto",
    ],
    // Sub-preguntas ramificadas según la respuesta elegida.
    rama: {
      "No consigo el perfil en el mercado": {
        k: "detalle_brecha",
        bot: "Perfecto. Pensando en una intervención a medida con una Universidad Nacional, ayudanos a completar esta frase:\n\n'Al día siguiente de la capacitación, necesito que mi equipo empiece a...'",
        input: "Ej: cargar bien los remitos, usar el CRM, reportar las fallas a tiempo",
      },
      "El equipo quedó desactualizado en una tecnología": {
        k: "escenario_tech",
        bot: "Entendido. La actualización tecnológica puede impactar de muchas formas. Para ayudarnos a calibrar la intervención de la Universidad, describinos brevemente cuál de estos escenarios refleja mejor la realidad de tu equipo hoy:",
        opciones: [
          "Adopción: tienen la tecnología pero les cuesta incorporar las nuevas funciones en el día a día.",
          "Desfasaje técnico: el mercado o los clientes les exigen habilidades que el equipo hoy no domina.",
          "Procesos: la herramienta funciona, pero la forma de trabajar del equipo quedó lenta u obsoleta.",
          "Otros",
        ],
        // Sub-rama de segundo nivel para "Otros".
        rama: {
          "Otros": {
            k: "detalle_otros",
            bot: "Entendido. En las organizaciones los desafíos técnicos suelen cruzarse con los procesos y las personas. Para poder orientar este diagnóstico:\n\nContanos en una sola frase: ¿cuál es esa tarea, sistema o máquina donde tu equipo hoy se traba y necesitás que destrabemos en conjunto?",
            input: "Mantenelo en menos de 140 caracteres para procesarlo rápido",
            maxLength: 140,
          },
        },
      },
    },
  },
  {
    k: "personas",
    bot: "¿A cuántas personas necesitás capacitar en este ciclo?",
    opciones: ["1 a 5", "6 a 15", "16 a 30", "Más de 30"],
  },
  {
    k: "presupuesto",
    bot: "Última pregunta. ¿Con qué marco de presupuesto anual estás trabajando? (Esto define si entrás por contratación directa o compulsa.)",
    opciones: ["Menos de USD 10.000", "USD 10.000 – 25.000", "Más de USD 25.000", "Todavía no lo sé"],
  },
];

// ============================================================================
// ============================================================================
// Hook responsive: detecta si la pantalla es de celular (< 720px)
function useIsMobile() {
  const [mobile, setMobile] = useState(typeof window !== "undefined" ? window.innerWidth < 720 : false);
  useEffect(() => {
    const onResize = () => setMobile(window.innerWidth < 720);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return mobile;
}

export default function App() {
  const [screen, setScreen] = useState("landing"); // landing | chat | analizando | shortlist | detalle | conversion | gracias | metrics | planes
  const [step, setStep] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [seleccion, setSeleccion] = useState(null);
  const [planActivo, setPlanActivo] = useState(null); // plan de suscripción elegido
  const [creditosUsados, setCreditosUsados] = useState(0);
  const [log, setLog] = useState([]); // métricas Wizard of Oz

  const track = (evento) =>
    setLog((l) => [...l, { evento, t: new Date().toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) }]);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&display=swap";
    document.head.appendChild(link);
  }, []);

  const reset = () => {
    setScreen("landing");
    setStep(0);
    setRespuestas({});
    setSeleccion(null);
  };

  return (
    <div style={{ fontFamily: FONT_BODY, background: C.paper, minHeight: "100vh", color: C.ink }}>
      <style>{`
        * { box-sizing: border-box; }
        @keyframes fadeUp { from { opacity:0; transform: translateY(12px);} to {opacity:1; transform:none;} }
        @keyframes blink { 0%,80%,100%{opacity:.25} 40%{opacity:1} }
        @keyframes grow { from { width: 0 } }
        .fu { animation: fadeUp .45s ease both; }
        .btn { cursor:pointer; border:none; font-family:${FONT_BODY}; transition: transform .12s ease, box-shadow .12s ease, background .15s ease; }
        .btn:hover { transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        .opt:hover { border-color:${C.ink} !important; background:${C.ink} !important; color:#fff !important; }
        .card-hover { transition: transform .15s ease, box-shadow .15s ease; }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba(19,33,46,.12); }
        :focus-visible { outline: 2px solid ${C.brass}; outline-offset: 2px; }
      `}</style>

      <Shell screen={screen} setScreen={setScreen} reset={reset} log={log}>
        {screen === "landing" && <Landing onStart={() => { track("Inició diagnóstico"); setScreen("chat"); }} onMetrics={() => setScreen("metrics")} />}
        {screen === "chat" && (
          <Chat
            onComplete={(rtas) => {
              setRespuestas(rtas);
              Object.entries(rtas).forEach(([k, v]) => track(`Respondió ${k}: ${v}`));
              track("Completó diagnóstico");
              setScreen("analizando");
            }}
          />
        )}
        {screen === "analizando" && <Analizando onDone={() => { track("Vio shortlist"); setScreen("shortlist"); }} />}
        {screen === "shortlist" && (
          <Shortlist
            respuestas={respuestas}
            planActivo={planActivo}
            creditosUsados={creditosUsados}
            onVerPlanes={() => setScreen("planes")}
            onPick={(d) => { setSeleccion(d); track(`Abrió ruta: ${d.uni}`); setScreen("detalle"); }}
          />
        )}
        {screen === "planes" && (
          <Planes
            planActivo={planActivo}
            onElegir={(p) => { setPlanActivo(p); track(`Eligió plan: ${p.nombre}`); setScreen("shortlist"); }}
            onBack={() => setScreen("shortlist")}
          />
        )}
        {screen === "detalle" && (
          <Detalle d={seleccion} planActivo={planActivo} onBack={() => setScreen("shortlist")} onConvert={() => { track(`★ Solicitó reunión: ${seleccion.uni}`); setScreen("conversion"); }} />
        )}
        {screen === "conversion" && <Conversion d={seleccion} respuestas={respuestas} planActivo={planActivo} onBack={() => setScreen("detalle")} onSend={() => { track("★★ Envió solicitud (conversión)"); setScreen("gracias"); }} />}
        {screen === "gracias" && <Gracias d={seleccion} onMetrics={() => setScreen("metrics")} onReset={reset} />}
        {screen === "metrics" && <Metrics log={log} onBack={() => setScreen("landing")} />}
      </Shell>
    </div>
  );
}

// --- Marco / barra superior -------------------------------------------------
function Shell({ children, screen, setScreen, reset, log }) {
  const m = useIsMobile();
  const showProgress = ["chat", "analizando", "shortlist", "detalle", "conversion"].includes(screen);
  const order = ["chat", "analizando", "shortlist", "detalle", "conversion"];
  const idx = order.indexOf(screen);
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: m ? "0 14px 48px" : "0 20px 60px" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0 14px", borderBottom: `1px solid ${C.line}`, marginBottom: 28, gap: 12 }}>
        <button className="btn" onClick={reset} style={{ background: "none", display: "flex", alignItems: "center", gap: 10, padding: 0 }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.ink, color: C.paper, display: "grid", placeItems: "center", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 17 }}>E</div>
          <span style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 19, letterSpacing: -0.3 }}>Ed-Link</span>
          <span style={{ fontSize: 11, color: C.slate, border: `1px solid ${C.line}`, padding: "2px 7px", borderRadius: 20, fontWeight: 600 }}>MVP · prototipo</span>
        </button>
        <button className="btn" onClick={() => setScreen("planes")} style={{ background: "none", color: C.brass, fontSize: 13.5, fontWeight: 600, padding: "6px 10px", border: `1px solid ${C.brass}55`, borderRadius: 20 }}>Planes y créditos</button>
      </header>

      {showProgress && (
        <div style={{ display: "flex", gap: 6, marginBottom: 26 }}>
          {["Diagnóstico", "Análisis", "Tu ruta", "Detalle", "Reunión"].map((p, i) => (
            <div key={p} style={{ flex: 1 }}>
              <div style={{ height: 4, borderRadius: 4, background: i <= idx ? C.brass : C.line, transition: "background .3s" }} />
              <div style={{ fontSize: m ? 9 : 10.5, color: i <= idx ? C.ink : C.slate, marginTop: 6, fontWeight: i === idx ? 700 : 500, textAlign: m ? "center" : "left", lineHeight: 1.1 }}>{p}</div>
            </div>
          ))}
        </div>
      )}

      {children}
    </div>
  );
}

// --- Pantalla 1: Landing ----------------------------------------------------
function Landing({ onStart, onMetrics }) {
  const m = useIsMobile();
  return (
    <div className="fu">
      <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.brassSoft, color: C.brass, padding: "6px 13px", borderRadius: 20, fontSize: 12.5, fontWeight: 600, marginBottom: 22 }}>
        <span style={{ width: 7, height: 7, borderRadius: 9, background: C.brass }} /> 91 universidades nacionales · capacidad técnica ociosa
      </div>

      <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: m ? 32 : 46, lineHeight: 1.07, letterSpacing: m ? -0.5 : -1, fontWeight: 600, margin: "0 0 18px", maxWidth: 720 }}>
        Decinos qué le falta a tu equipo.{m ? " " : <br />}
        Te armamos la ruta con un docente{m ? " " : <br />}
        <span style={{ color: C.brass }}>universitario que ya lo resolvió.</span>
      </h1>

      <p style={{ fontSize: m ? 15.5 : 17, color: C.slate, lineHeight: 1.55, maxWidth: 560, margin: "0 0 30px" }}>
        Sin cursos genéricos de 8 horas. Sin instructores que no entienden tu contexto. Un diagnóstico de 1 minuto y una ruta modular contextualizada, con el aval de una universidad pública argentina.
      </p>

      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button className="btn" onClick={onStart} style={{ background: C.ink, color: C.paper, padding: "15px 26px", borderRadius: 12, fontSize: 16, fontWeight: 600, width: m ? "100%" : "auto" }}>
          Diagnosticar mi necesidad →
        </button>
        <span style={{ fontSize: 13.5, color: C.slate }}>Gratis · sin compromiso · 1 minuto</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3,1fr)", gap: 14, marginTop: m ? 32 : 46 }}>
        {[
          ["Modular", "Elegí solo los módulos que tu equipo necesita. Saltá lo que ya saben."],
          ["Contextualizado", "Docentes locales que conocen tu industria, no videos envasados."],
          ["Con aval", "Certificación de una universidad nacional. Justificable ante tu CFO."],
        ].map(([t, d]) => (
          <div key={t} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "18px 18px 20px" }}>
            <div style={{ fontFamily: FONT_DISPLAY, fontWeight: 600, fontSize: 18, marginBottom: 7 }}>{t}</div>
            <div style={{ fontSize: 13.5, color: C.slate, lineHeight: 1.5 }}>{d}</div>
          </div>
        ))}
      </div>

      <button className="btn" onClick={onMetrics} style={{ background: "none", color: C.slate, marginTop: 30, fontSize: 12.5, textDecoration: "underline", padding: 0 }}>
        ◔ Ver panel de métricas del experimento (vista interna del equipo)
      </button>
    </div>
  );
}

// --- Pantalla 2: Chatbot de diagnóstico (el "bot" Wizard of Oz) -------------
function Chat({ onComplete }) {
  const m = useIsMobile();
  // Cola de pasos pendientes (puede crecer con sub-preguntas).
  const [cola, setCola] = useState([PREGUNTAS[0], PREGUNTAS[1], PREGUNTAS[2], PREGUNTAS[3]]);
  const [idx, setIdx] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [historial, setHistorial] = useState([]); // {bot, me}
  const [typing, setTyping] = useState(true);
  const [texto, setTexto] = useState("");
  const endRef = useRef(null);

  const q = cola[idx];

  useEffect(() => {
    setTyping(true);
    setTexto("");
    const t = setTimeout(() => setTyping(false), 750);
    return () => clearTimeout(t);
  }, [idx]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [typing, historial]);

  const avanzar = (valor) => {
    const nuevasRtas = { ...respuestas, [q.k]: valor };
    setRespuestas(nuevasRtas);
    setHistorial((h) => [...h, { bot: q.bot, me: valor }]);

    // ¿La opción elegida dispara una sub-pregunta?
    const sub = q.rama && q.rama[valor];
    let nuevaCola = [...cola];
    if (sub) {
      // Insertar la sub-pregunta justo después de la actual.
      nuevaCola.splice(idx + 1, 0, sub);
      setCola(nuevaCola);
    }

    if (idx < nuevaCola.length - 1) {
      setIdx(idx + 1);
    } else {
      onComplete(nuevasRtas);
    }
  };

  const enviarTexto = () => {
    const v = texto.trim();
    if (!v) return;
    avanzar(v);
  };

  const esInput = q?.input;

  return (
    <div className="fu" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 30px rgba(27,38,63,.07)" }}>
        <div style={{ background: C.ink, color: C.paper, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 9, height: 9, borderRadius: 9, background: C.zest }} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Asistente de diagnóstico</span>
          <span style={{ marginLeft: "auto", fontSize: 11.5, opacity: .7 }}>Levantamiento de necesidades (LNA)</span>
        </div>

        <div style={{ padding: "22px 20px", minHeight: 320, display: "flex", flexDirection: "column", gap: 14 }}>
          {historial.map((h, i) => (
            <div key={i}>
              <Bubble who="bot">{h.bot}</Bubble>
              <Bubble who="me">{h.me}</Bubble>
            </div>
          ))}

          <Bubble who="bot">{typing ? <Typing /> : q.bot}</Bubble>

          {!typing && esInput && (
            <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 4 }}>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                maxLength={q.maxLength || 280}
                placeholder={q.input}
                rows={2}
                style={{ padding: "11px 13px", borderRadius: 11, border: `1.5px solid ${C.line}`, fontSize: 14, fontFamily: FONT_BODY, color: C.ink, background: C.paper, outline: "none", resize: "none" }}
              />
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                {q.maxLength && <span style={{ fontSize: 11, color: C.slate }}>{texto.length}/{q.maxLength}</span>}
                <button className="btn" onClick={enviarTexto} disabled={!texto.trim()}
                  style={{ marginLeft: "auto", background: texto.trim() ? C.ink : C.line, color: texto.trim() ? C.paper : C.slate, border: "none", borderRadius: 10, padding: "9px 18px", fontSize: 14, fontWeight: 600, cursor: texto.trim() ? "pointer" : "not-allowed" }}>
                  Continuar →
                </button>
              </div>
            </div>
          )}

          {!typing && !esInput && (
            <div className="fu" style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 4 }}>
              {q.opciones.map((o) => (
                <button key={o} className="btn opt" onClick={() => avanzar(o)}
                  style={{ background: C.card, color: C.ink, border: `1.5px solid ${C.line}`, borderRadius: 11, padding: "11px 15px", fontSize: 14, fontWeight: 500, textAlign: "left" }}>
                  {o}
                </button>
              ))}
            </div>
          )}
          <div ref={endRef} />
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: C.slate, marginTop: 14 }}>
        Diagnóstico en curso · paso {idx + 1}
      </p>
    </div>
  );
}

function Bubble({ who, children }) {
  const me = who === "me";
  return (
    <div className="fu" style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginTop: me ? 8 : 0 }}>
      <div style={{
        maxWidth: "85%", padding: "11px 15px", borderRadius: 14, fontSize: 14.5, lineHeight: 1.5,
        background: me ? C.ink : C.brassSoft, color: me ? C.paper : C.ink,
        borderBottomRightRadius: me ? 4 : 14, borderBottomLeftRadius: me ? 14 : 4, fontWeight: me ? 600 : 400,
        whiteSpace: "pre-wrap",
      }}>{children}</div>
    </div>
  );
}
function Typing() {
  return (
    <span style={{ display: "inline-flex", gap: 4, padding: "2px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{ width: 7, height: 7, borderRadius: 7, background: C.brass, animation: `blink 1.2s ${i * 0.2}s infinite` }} />
      ))}
    </span>
  );
}

// --- Pantalla 3: "Analizando" (la cortina del Mago de Oz) -------------------
function Analizando({ onDone }) {
  const pasos = [
    "Leyendo tu diagnóstico…",
    "Cruzando con programas universitarios disponibles…",
    "Filtrando por contexto e industria local…",
    "Armando tu ruta modular…",
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    if (i < pasos.length - 1) { const t = setTimeout(() => setI(i + 1), 720); return () => clearTimeout(t); }
    const t = setTimeout(onDone, 850); return () => clearTimeout(t);
  }, [i]);
  return (
    <div className="fu" style={{ textAlign: "center", padding: "80px 0", maxWidth: 460, margin: "0 auto" }}>
      <div style={{ width: 54, height: 54, margin: "0 auto 26px", borderRadius: 14, background: C.ink, color: C.paper, display: "grid", placeItems: "center", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 26 }}>E</div>
      {pasos.map((p, k) => (
        <div key={k} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 0", opacity: k <= i ? 1 : 0.3, transition: "opacity .3s" }}>
          <span style={{ width: 20, height: 20, borderRadius: 20, flexShrink: 0, border: `2px solid ${k < i ? C.good : C.line}`, background: k < i ? C.good : "transparent", color: "#fff", display: "grid", placeItems: "center", fontSize: 12 }}>{k < i ? "✓" : ""}</span>
          <span style={{ fontSize: 14.5, color: k <= i ? C.ink : C.slate, fontWeight: k === i ? 600 : 400, textAlign: "left" }}>{p}</span>
        </div>
      ))}
      <div style={{ height: 4, background: C.line, borderRadius: 4, marginTop: 24, overflow: "hidden" }}>
        <div style={{ height: "100%", background: C.brass, width: `${((i + 1) / pasos.length) * 100}%`, transition: "width .6s ease" }} />
      </div>
    </div>
  );
}

// --- Pantalla 4: Shortlist curada (NO swipe — ruta con trust layer) ---------
function Shortlist({ respuestas, onPick, onVerPlanes, planActivo, creditosUsados }) {
  const m = useIsMobile();
  // Selecciona las rutas según el rol elegido; si no hay match, usa las 3 por defecto.
  const ids = RUTAS_POR_ROL[respuestas.rol] || RUTAS_POR_ROL["Otro perfil técnico"];
  const rutas = ids.map((id) => DOCENTES.find((x) => x.id === id)).filter(Boolean);
  const restantes = planActivo ? planActivo.creditos - creditosUsados : null;
  return (
    <div className="fu">
      {/* Panel de créditos disponibles */}
      <div style={{ display: "flex", alignItems: "center", gap: 14, background: planActivo ? C.ink : C.brassSoft, color: planActivo ? C.paper : C.ink, borderRadius: 14, padding: "14px 18px", marginBottom: 20, flexWrap: "wrap" }}>
        {planActivo ? (
          <>
            <div>
              <div style={{ fontSize: 11, opacity: .7 }}>Plan {planActivo.nombre} · créditos disponibles</div>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 700 }}>{restantes} <span style={{ fontSize: 14, opacity: .7 }}>de {planActivo.creditos}</span></div>
            </div>
            <button className="btn" onClick={onVerPlanes} style={{ marginLeft: "auto", background: "rgba(255,255,255,.15)", color: C.paper, border: "1px solid rgba(255,255,255,.3)", borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600 }}>Cambiar plan</button>
          </>
        ) : (
          <>
            <div style={{ fontSize: 13.5, fontWeight: 500, flex: 1, minWidth: 200 }}>
              Elegí un plan anual para destinar créditos a estos cursos.
            </div>
            <button className="btn" onClick={onVerPlanes} style={{ background: C.ink, color: C.paper, border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13.5, fontWeight: 600 }}>Ver planes y créditos →</button>
          </>
        )}
      </div>

      <div style={{ marginBottom: 22 }}>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: m ? 24 : 30, fontWeight: 600, letterSpacing: -0.5, margin: "0 0 8px" }}>Tu ruta recomendada</h2>
        <p style={{ fontSize: m ? 14 : 15, color: C.slate, margin: 0, lineHeight: 1.5 }}>
          Según tu diagnóstico (<b style={{ color: C.ink }}>{respuestas.rol}</b> · {respuestas.personas} personas · {respuestas.presupuesto}),
          armamos estas opciones con universidades que ya resolvieron tu problema. Ordenadas por afinidad.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {rutas.map((d, i) => (
          <div key={d.id} className="card-hover" onClick={() => onPick(d)}
            style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 20, cursor: "pointer", display: "flex", gap: m ? 12 : 18, alignItems: "flex-start", position: "relative", flexWrap: m ? "wrap" : "nowrap" }}>
            {i === 0 && (
              <div style={{ position: "absolute", top: -10, left: 18, background: C.zest, color: C.ink, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>★ MEJOR AFINIDAD</div>
            )}
            <div style={{ width: 56, height: 56, borderRadius: 12, flexShrink: 0, background: d.color, color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 16 }}>{d.uni}</div>

            <div style={{ flex: 1, minWidth: m ? "60%" : "auto" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 18.5, fontWeight: 600, margin: 0, lineHeight: 1.2 }}>{d.ruta}</h3>
              </div>
              {EXTRA[d.id]?.docente && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 26, flexShrink: 0, background: d.color, color: "#fff", display: "grid", placeItems: "center", fontSize: 11, fontWeight: 700 }}>
                    {EXTRA[d.id].docente.nombre.split(" ").slice(-2).map((w) => w[0]).join("")}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>{EXTRA[d.id].docente.nombre}</span>
                </div>
              )}
              <div style={{ fontSize: 12, color: C.slate, marginBottom: 10 }}>Aval institucional: {d.sello}</div>

              {/* Trust layer — reemplaza el rating Airbnb por evidencia B2B */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12.5 }}>
                <Stat label="Afinidad" value={`${d.match}%`} color={C.ink} />
                <Stat label="Finalización" value={`${d.finalizacion}%`} color={C.good} />
                <Stat label="Para equipos de" value={`${EXTRA[d.id]?.personas || "—"} pers.`} />
                <Stat label="Modalidad" value={splitLabel(d.id)} />
              </div>
            </div>

            <div style={{ textAlign: m ? "left" : "right", flexShrink: 0, alignSelf: "stretch", display: "flex", flexDirection: m ? "row" : "column", justifyContent: "space-between", alignItems: m ? "center" : "flex-end", gap: m ? 10 : 0, width: m ? "100%" : "auto", borderTop: m ? `1px solid ${C.line}` : "none", paddingTop: m ? 12 : 0 }}>
              <div>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 700, color: C.ink }}>{costoCreditos(d)}</span>
                <span style={{ fontSize: 12, color: C.slate, fontWeight: 600 }}> créditos</span>
                <div style={{ fontSize: 10.5, color: C.slate }}>{d.horas}h · {splitLabel(d.id)}</div>
              </div>
              <div style={{ color: C.brass, fontWeight: 600, fontSize: 13, marginTop: m ? 0 : 12 }}>Ver ruta →</div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: C.slate, marginTop: 18, textAlign: "center" }}>
        Los cursos se abonan con los créditos de tu plan anual. <span style={{ color: C.brass, fontWeight: 600, cursor: "pointer" }} onClick={onVerPlanes}>Ver planes y créditos →</span>
      </p>
    </div>
  );
}
function Stat({ label, value, color }) {
  return (
    <div>
      <div style={{ fontWeight: 700, color: color || C.ink, fontSize: 14 }}>{value}</div>
      <div style={{ color: C.slate, fontSize: 11 }}>{label}</div>
    </div>
  );
}

// --- Pantalla: Planes y créditos --------------------------------------------
function Planes({ planActivo, onElegir, onBack }) {
  const m = useIsMobile();
  return (
    <div className="fu">
      <button className="btn" onClick={onBack} style={{ background: "none", color: C.slate, fontSize: 13.5, padding: 0, marginBottom: 16, fontWeight: 600 }}>← Volver</button>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: m ? 26 : 32, fontWeight: 600, letterSpacing: -0.5, margin: "0 0 8px" }}>Planes de suscripción anual</h2>
      <p style={{ fontSize: m ? 14 : 15.5, color: C.slate, margin: "0 0 26px", lineHeight: 1.5, maxWidth: 640 }}>
        Cada plan te da una bolsa de <b style={{ color: C.ink }}>créditos anuales</b> que destinás a los cursos que la plataforma te sugiere. Los cursos cuestan más o menos créditos según su duración, la experiencia del docente y la modalidad (remoto o híbrido).
      </p>

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3,1fr)", gap: 16, alignItems: "start" }}>
        {PLANES.map((p) => {
          const activo = planActivo?.id === p.id;
          return (
            <div key={p.id} style={{ background: C.card, border: p.destacado ? `2px solid ${C.ink}` : `1px solid ${C.line}`, borderRadius: 18, padding: 22, position: "relative", boxShadow: p.destacado ? "0 12px 30px rgba(27,38,63,.12)" : "none" }}>
              {p.destacado && <div style={{ position: "absolute", top: -11, left: 22, background: C.zest, color: C.ink, fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 20 }}>★ MÁS ELEGIDO</div>}
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600 }}>{p.nombre}</div>
              <div style={{ fontSize: 12.5, color: C.slate, margin: "4px 0 14px", lineHeight: 1.4, minHeight: 34 }}>{p.pitch}</div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700, color: C.ink }}>US${p.precio.toLocaleString("es-AR")}</span>
                <span style={{ fontSize: 13, color: C.slate }}>/año</span>
              </div>
              <div style={{ display: "inline-block", background: C.brassSoft, color: C.brass, fontSize: 13, fontWeight: 700, padding: "4px 12px", borderRadius: 20, margin: "10px 0 16px" }}>{p.creditos} créditos / año</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
                {p.incluye.map((it, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, lineHeight: 1.4 }}>
                    <span style={{ color: C.good, fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <span style={{ color: C.ink }}>{it}</span>
                  </div>
                ))}
              </div>
              <button className="btn" onClick={() => onElegir(p)} disabled={activo}
                style={{ width: "100%", background: activo ? C.good : (p.destacado ? C.ink : C.card), color: activo || p.destacado ? C.paper : C.ink, border: activo || p.destacado ? "none" : `1.5px solid ${C.line}`, borderRadius: 11, padding: "12px", fontSize: 14.5, fontWeight: 600, cursor: activo ? "default" : "pointer" }}>
                {activo ? "✓ Plan actual" : "Elegir este plan"}
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ fontSize: 11.5, color: C.slate, marginTop: 18, textAlign: "center" }}>
        Los créditos no usados pueden trasladarse al ciclo siguiente. Los planes por debajo de USD 10.000 anuales califican para contratación directa.
      </p>
    </div>
  );
}

// --- Pantalla 5: Detalle de la ruta -----------------------------------------
function Detalle({ d, planActivo, onBack, onConvert }) {
  const m = useIsMobile();
  const [casosAbiertos, setCasosAbiertos] = useState(false);
  if (!d) return null;
  const ex = EXTRA[d.id] || {};
  const mods = [
    { t: "Módulo 1 · Diagnóstico in situ (LNA)", d: "Un coordinador releva los cuellos de botella reales de tu operación.", opt: false },
    { t: "Módulo 2 · Fundamentos contextualizados", d: "Teoría aplicada a tus sistemas y datos reales. Saltable si tu equipo ya domina la base.", opt: true },
    { t: "Módulo 3 · Profundización sobre tu caso", d: "Co-creación sobre el terreno con el cuerpo docente.", opt: false },
    { t: "Módulo 4 · Evaluación y certificación", d: "Validación de aprendizaje + certificado con aval universitario.", opt: false },
  ];
  return (
    <div className="fu">
      <button className="btn" onClick={onBack} style={{ background: "none", color: C.slate, fontSize: 13.5, padding: 0, marginBottom: 16, fontWeight: 600 }}>← Volver a las opciones</button>

      <div style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 6 }}>
        <div style={{ width: 50, height: 50, borderRadius: 12, background: d.color, color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT_DISPLAY, fontWeight: 700 }}>{d.uni}</div>
        <div>
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, margin: 0, letterSpacing: -0.4, lineHeight: 1.15 }}>{d.ruta}</h2>
          <div style={{ fontSize: 13, color: C.slate }}>{d.sello}</div>
        </div>
      </div>

      <div style={{ background: C.tealSoft, border: `1px solid ${C.teal}33`, borderRadius: 12, padding: "13px 16px", margin: "18px 0", fontSize: 14, lineHeight: 1.5 }}>
        <b style={{ color: C.teal }}>Por qué te la recomendamos: </b>{d.porque}
      </div>

      {ex.docente && (
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: "16px 18px", marginBottom: 18 }}>
          <div style={{ width: 52, height: 52, borderRadius: 52, flexShrink: 0, background: d.color, color: "#fff", display: "grid", placeItems: "center", fontFamily: FONT_DISPLAY, fontWeight: 700, fontSize: 18 }}>
            {ex.docente.nombre.split(" ").slice(-2).map((w) => w[0]).join("")}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, color: C.brass, fontWeight: 700, letterSpacing: 0.3, textTransform: "uppercase", marginBottom: 2 }}>Docente a cargo</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, lineHeight: 1.1 }}>{ex.docente.nombre}</div>
            <div style={{ fontSize: 13, color: C.slate, marginTop: 2 }}>{ex.docente.titulo}</div>
            <div style={{ fontSize: 12, color: C.ink, marginTop: 4, fontWeight: 600 }}>{ex.docente.credencial}</div>
          </div>
        </div>
      )}

      {/* Modalidad híbrida + personas + casos verificados */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 18 }}>
        <div style={{ flex: m ? "1 1 100%" : 1, minWidth: 220, background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: "13px 15px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 7 }}>
            <span style={{ color: C.slate }}>Modalidad híbrida</span>
            <span style={{ fontWeight: 700, color: C.ink }}>{splitLabel(d.id)}</span>
          </div>
          <div style={{ display: "flex", height: 8, borderRadius: 8, overflow: "hidden", background: C.line }}>
            <div style={{ width: `${ex.online || 0}%`, background: C.wisteria }} />
            <div style={{ width: `${ex.presencial || 0}%`, background: C.teal }} />
          </div>
          <div style={{ display: "flex", gap: 14, marginTop: 8, fontSize: 11, color: C.slate }}>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: C.wisteria, marginRight: 5 }} />Online</span>
            <span><span style={{ display: "inline-block", width: 8, height: 8, borderRadius: 8, background: C.teal, marginRight: 5 }} />Presencial in situ</span>
            <span style={{ marginLeft: "auto", color: C.ink, fontWeight: 600 }}>Equipos de {ex.personas} personas</span>
          </div>
        </div>
      </div>

      {ex.casosDetalle && ex.casosDetalle.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <button className="btn" onClick={() => setCasosAbiertos(!casosAbiertos)}
            style={{ width: "100%", background: casosAbiertos ? C.ink : C.card, color: casosAbiertos ? C.paper : C.ink, border: `1.5px solid ${casosAbiertos ? C.ink : C.line}`, borderRadius: 12, padding: "13px 16px", fontSize: 14, fontWeight: 600, textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>✓ {ex.casosDetalle.length} {ex.casosDetalle.length === 1 ? "empresa capacitada" : "empresas capacitadas"} — ver casos verificados</span>
            <span>{casosAbiertos ? "▲" : "▼"}</span>
          </button>
          {casosAbiertos && (
            <div className="fu" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 10 }}>
              {ex.casosDetalle.map((c, i) => (
                <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, borderLeft: `3px solid ${C.teal}`, borderRadius: 10, padding: "13px 16px" }}>
                  <div style={{ fontSize: 14.5, lineHeight: 1.5, color: C.ink, fontStyle: "italic" }}>"{c.quote}"</div>
                  <div style={{ fontSize: 12, color: C.slate, marginTop: 8, fontWeight: 600 }}>{c.rol} · {c.empresa}</div>
                </div>
              ))}
              <div style={{ fontSize: 11, color: C.slate, textAlign: "center", marginTop: 2 }}>
                Casos verificados por Ed-Link. Identidad de las empresas reservada por confidencialidad.
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.4fr 1fr", gap: 18 }}>
        <div>
          <h4 style={{ fontFamily: FONT_DISPLAY, fontSize: 16, margin: "0 0 12px" }}>Ruta modular · {d.formato}</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {mods.map((m, i) => (
              <div key={i} style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 11, padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 13.5 }}>{m.t}</span>
                  {m.opt && <span style={{ fontSize: 10.5, color: C.brass, border: `1px solid ${C.brass}55`, padding: "2px 7px", borderRadius: 12, fontWeight: 600, whiteSpace: "nowrap" }}>saltable</span>}
                </div>
                <div style={{ fontSize: 12.5, color: C.slate, marginTop: 4, lineHeight: 1.45 }}>{m.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 18, position: m ? "static" : "sticky", top: 16 }}>
            <div style={{ fontSize: 12, color: C.slate }}>Costo de esta ruta</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 700 }}>{costoCreditos(d)} <span style={{ fontSize: 16, color: C.slate, fontWeight: 400 }}>créditos</span></div>
            <div style={{ fontSize: 11.5, color: C.slate, marginTop: 4 }}>Costo según duración ({d.horas}h), expertise del docente y modalidad ({splitLabel(d.id)}).</div>

            {planActivo ? (
              <div style={{ background: C.tealSoft, borderRadius: 10, padding: "10px 12px", marginTop: 12, fontSize: 12.5 }}>
                <b style={{ color: C.teal }}>Plan {planActivo.nombre}:</b> te quedan {planActivo.creditos} créditos. Esta ruta consume {costoCreditos(d)}.
              </div>
            ) : (
              <div style={{ background: C.brassSoft, borderRadius: 10, padding: "10px 12px", marginTop: 12, fontSize: 12.5, color: C.ink }}>
                Necesitás un plan activo para destinar créditos a esta ruta.
              </div>
            )}

            <div style={{ borderTop: `1px solid ${C.line}`, margin: "14px 0 12px", paddingTop: 12, display: "flex", flexDirection: "column", gap: 9, fontSize: 13 }}>
              <Row k="Afinidad con tu caso" v={`${d.match}%`} />
              <Row k="Tasa de finalización" v={`${d.finalizacion}%`} />
              <Row k="Personas por ciclo" v={ex.personas} />
              <Row k="Carga horaria" v={`${d.horas} horas`} />
            </div>

            <button className="btn" onClick={onConvert} style={{ width: "100%", background: C.ink, color: C.paper, padding: "13px", borderRadius: 11, fontSize: 15, fontWeight: 600, marginTop: 6 }}>
              Solicitar reunión
            </button>
            <div style={{ fontSize: 11, color: C.slate, textAlign: "center", marginTop: 8 }}>Sin compromiso · respondemos en 48h</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function Row({ k, v }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span style={{ color: C.slate }}>{k}</span>
      <span style={{ fontWeight: 700 }}>{v}</span>
    </div>
  );
}

// --- Pantalla 6: Conversión (el dato que valida el experimento) -------------
// Envía los datos a Formspree → te llegan por mail y quedan registrados.
// REEMPLAZÁ "TU_ID" por tu ID de formulario de https://formspree.io (gratis).
const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqgbvzp";

function Conversion({ d, respuestas, planActivo, onBack, onSend }) {
  const [f, setF] = useState({ nombre: "", empresa: "", email: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const ok = f.nombre && f.empresa && f.email.includes("@");

  const handleSubmit = async () => {
    if (!ok || enviando) return;
    setEnviando(true);
    setError("");

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          nombre: f.nombre,
          empresa: f.empresa,
          email: f.email,
          _replyto: f.email,
          _subject: `Ed-Link · Nueva solicitud de reunión — ${f.empresa}`,
          ruta_elegida: d?.ruta,
          universidad: d?.sello,
          rol_diagnosticado: respuestas?.rol,
          brecha: respuestas?.brecha,
          personas: respuestas?.personas,
          presupuesto: respuestas?.presupuesto,
          plan_elegido: planActivo?.nombre || "sin plan",
          costo_creditos_ruta: d ? costoCreditos(d) : null,
        }),
      });

      // Log SIEMPRE, para diagnóstico.
      console.log("Formspree status:", res.status, res.ok);
      const data = await res.json().catch(() => ({}));
      console.log("Formspree respuesta:", data);

      if (res.ok) {
        onSend(); // éxito real — recién acá avanzamos
      } else {
        const msg = data?.errors?.map((e) => e.message).join(", ") || `Error ${res.status}`;
        console.error("Formspree error:", msg, data);
        setError("No se pudo registrar el envío: " + msg);
        setEnviando(false);
      }
    } catch (e) {
      console.error("Error de red al enviar a Formspree:", e);
      setError("Error de conexión: " + (e?.message || "revisá tu internet"));
      setEnviando(false);
    }
  };

  return (
    <div className="fu" style={{ maxWidth: 520, margin: "0 auto" }}>
      <button className="btn" onClick={onBack} style={{ background: "none", color: C.slate, fontSize: 13.5, padding: 0, marginBottom: 16, fontWeight: 600 }}>← Volver a la ruta</button>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, letterSpacing: -0.4, margin: "0 0 6px" }}>Coordinemos una reunión</h2>
      <p style={{ fontSize: 14.5, color: C.slate, margin: "0 0 22px", lineHeight: 1.5 }}>
        Un coordinador de <b style={{ color: C.ink }}>Ed-Link</b> te contactará para ajustar la ruta de aprendizaje a tu equipo.
      </p>
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 22, display: "flex", flexDirection: "column", gap: 14 }}>
        {[
          ["nombre", "Tu nombre", "Nombre y apellido"],
          ["empresa", "Empresa", "Nombre de tu empresa"],
          ["email", "Email corporativo", "vos@empresa.com"],
        ].map(([k, label, ph]) => (
          <label key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: C.ink }}>{label}</span>
            <input value={f[k]} onChange={(e) => setF({ ...f, [k]: e.target.value })} placeholder={ph}
              style={{ padding: "11px 13px", borderRadius: 10, border: `1.5px solid ${C.line}`, fontSize: 14, fontFamily: FONT_BODY, color: C.ink, background: C.paper, outline: "none" }} />
          </label>
        ))}
        <button className="btn" disabled={!ok || enviando} onClick={handleSubmit}
          style={{ background: ok && !enviando ? C.ink : C.line, color: ok && !enviando ? C.paper : C.slate, padding: "13px", borderRadius: 11, fontSize: 15, fontWeight: 600, cursor: ok && !enviando ? "pointer" : "not-allowed", marginTop: 4 }}>
          {enviando ? "Enviando…" : "Enviar solicitud"}
        </button>
        {error && <span style={{ fontSize: 12, color: "#B23B3B", textAlign: "center" }}>{error}</span>}
      </div>
      <p style={{ fontSize: 11.5, color: C.slate, textAlign: "center", marginTop: 12 }}>
        Un coordinador de Ed-Link te contacta para coordinar la reunión.
      </p>
    </div>
  );
}

// --- Pantalla 7: Gracias ----------------------------------------------------
function Gracias({ d, onMetrics, onReset }) {
  return (
    <div className="fu" style={{ textAlign: "center", padding: "60px 0", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ width: 64, height: 64, margin: "0 auto 22px", borderRadius: 64, background: C.goodSoft, color: C.good, display: "grid", placeItems: "center", fontSize: 30 }}>✓</div>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 28, fontWeight: 600, margin: "0 0 12px", letterSpacing: -0.4 }}>Listo. Recibimos tu solicitud.</h2>
      <p style={{ fontSize: 15.5, color: C.slate, lineHeight: 1.55, margin: "0 0 28px" }}>
        Un coordinador de <b style={{ color: C.ink }}>Ed-Link</b> te contactará dentro de las próximas 48 horas para ajustar la ruta de aprendizaje de tu equipo.
      </p>
      <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn" onClick={onReset} style={{ background: C.ink, color: C.paper, padding: "12px 22px", borderRadius: 11, fontWeight: 600, fontSize: 14.5 }}>Probar otro diagnóstico</button>
        <button className="btn" onClick={onMetrics} style={{ background: C.brassSoft, color: C.brass, padding: "12px 22px", borderRadius: 11, fontWeight: 600, fontSize: 14.5 }}>Ver métricas del experimento →</button>
      </div>
    </div>
  );
}

// --- Pantalla 8: Métricas (vista interna — sustenta el Punto III) -----------
function Metrics({ log, onBack }) {
  const m = useIsMobile();
  const completo = log.some((l) => l.evento === "Completó diagnóstico");
  const shortlist = log.some((l) => l.evento === "Vio shortlist");
  const convirtio = log.some((l) => l.evento.startsWith("★★"));
  const funnel = [
    ["Inició diagnóstico", log.some((l) => l.evento === "Inició diagnóstico")],
    ["Completó las 4 preguntas", completo],
    ["Vio la shortlist", shortlist],
    ["Abrió una ruta en detalle", log.some((l) => l.evento.startsWith("Abrió ruta"))],
    ["Solicitó reunión (conversión)", convirtio],
  ];
  return (
    <div className="fu">
      <button className="btn" onClick={onBack} style={{ background: "none", color: C.slate, fontSize: 13.5, padding: 0, marginBottom: 14, fontWeight: 600 }}>← Volver al inicio</button>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, letterSpacing: -0.4, margin: "0 0 6px" }}>Panel del experimento</h2>
      <p style={{ fontSize: 14, color: C.slate, margin: "0 0 24px", lineHeight: 1.5, maxWidth: 600 }}>
        Vista interna del equipo. Cada sesión de prueba registra el embudo. La <b style={{ color: C.ink }}>métrica primaria</b> es la conversión visita → solicitud de reunión.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1.2fr 1fr", gap: 18 }}>
        <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 20 }}>
          <h4 style={{ fontFamily: FONT_DISPLAY, fontSize: 16, margin: "0 0 14px" }}>Embudo de esta sesión</h4>
          {funnel.map(([t, done], i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 11, padding: "8px 0", borderBottom: i < funnel.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <span style={{ width: 22, height: 22, borderRadius: 22, flexShrink: 0, background: done ? C.good : C.paper, border: `1.5px solid ${done ? C.good : C.line}`, color: "#fff", display: "grid", placeItems: "center", fontSize: 12 }}>{done ? "✓" : i + 1}</span>
              <span style={{ fontSize: 13.5, color: done ? C.ink : C.slate, fontWeight: done ? 600 : 400 }}>{t}</span>
            </div>
          ))}
          <div style={{ marginTop: 16, padding: "12px 14px", borderRadius: 11, background: convirtio ? C.goodSoft : C.brassSoft }}>
            <div style={{ fontSize: 12, color: C.slate }}>Resultado de la sesión</div>
            <div style={{ fontWeight: 700, fontSize: 15, color: convirtio ? C.good : C.brass }}>
              {convirtio ? "★★ Convirtió — solicitó reunión" : "En curso — todavía no convirtió"}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ background: C.ink, color: C.paper, borderRadius: 16, padding: 20 }}>
            <div style={{ fontSize: 12.5, opacity: .75 }}>Hipótesis a validar</div>
            <div style={{ fontSize: 14.5, lineHeight: 1.5, marginTop: 6 }}>
              “Empresas medianas con brecha técnica <b>solicitan una reunión</b> al recibir un diagnóstico + shortlist automatizado.”
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.15)", marginTop: 14, paddingTop: 12, fontSize: 13 }}>
              <div style={{ opacity: .75, fontSize: 12 }}>Criterio de éxito (pre-definido)</div>
              <div style={{ fontWeight: 700, fontSize: 16, marginTop: 2 }}>≥ 15% de conversión · N ≥ 20</div>
            </div>
          </div>
          <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 16, padding: 18 }}>
            <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 8, fontWeight: 600 }}>Registro de eventos</div>
            <div style={{ maxHeight: 150, overflowY: "auto", fontSize: 12, fontFamily: "monospace", color: C.slate, lineHeight: 1.7 }}>
              {log.length === 0 ? <span>Sin eventos aún.</span> : log.map((l, i) => (
                <div key={i}><span style={{ color: C.brass }}>{l.t}</span> · {l.evento}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
