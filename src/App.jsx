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

// Mapea cada rol del diagnóstico a las rutas relevantes (IDs del catálogo).
// El orden define cuál aparece como "mejor afinidad".
const RUTAS_POR_ROL = {
  "QA / Testing": ["qa-bank", "ba-auto", "data-ops"],
  "Business Analysis": ["ba-auto", "data-ops", "qa-bank"],
  "Datos / Reporting": ["data-ops", "machine-learning", "ba-auto"],
  "Ciberseguridad": ["ciberseguridad", "qa-bank", "data-ops"],
  "Machine Learning": ["machine-learning", "data-ops", "ciberseguridad"],
  "Otro perfil técnico": ["qa-bank", "ba-auto", "data-ops"],
};

const PREGUNTAS = [
  {
    k: "rol",
    bot: "Hola 👋 Soy el asistente de diagnóstico de Ed-Link. En 4 preguntas te armo una ruta de capacitación a medida con aval de una universidad nacional. Para empezar: ¿qué rol o equipo necesitás fortalecer?",
    opciones: ["QA / Testing", "Business Analysis", "Datos / Reporting", "Ciberseguridad", "Machine Learning", "Otro perfil técnico"],
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
  const [screen, setScreen] = useState("landing"); // landing | chat | analizando | shortlist | detalle | conversion | gracias | metrics
  const [step, setStep] = useState(0);
  const [respuestas, setRespuestas] = useState({});
  const [seleccion, setSeleccion] = useState(null);
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
            step={step}
            respuestas={respuestas}
            onAnswer={(k, v) => {
              setRespuestas((r) => ({ ...r, [k]: v }));
              track(`Respondió ${k}: ${v}`);
              if (step < PREGUNTAS.length - 1) setStep(step + 1);
              else { track("Completó diagnóstico"); setScreen("analizando"); }
            }}
          />
        )}
        {screen === "analizando" && <Analizando onDone={() => { track("Vio shortlist"); setScreen("shortlist"); }} />}
        {screen === "shortlist" && (
          <Shortlist
            respuestas={respuestas}
            onPick={(d) => { setSeleccion(d); track(`Abrió ruta: ${d.uni}`); setScreen("detalle"); }}
          />
        )}
        {screen === "detalle" && (
          <Detalle d={seleccion} onBack={() => setScreen("shortlist")} onConvert={() => { track(`★ Solicitó reunión: ${seleccion.uni}`); setScreen("conversion"); }} />
        )}
        {screen === "conversion" && <Conversion d={seleccion} respuestas={respuestas} onSend={() => { track("★★ Envió solicitud (conversión)"); setScreen("gracias"); }} />}
        {screen === "gracias" && <Gracias d={seleccion} onMetrics={() => setScreen("metrics")} onReset={reset} />}
        {screen === "metrics" && <Metrics log={log} onBack={() => setScreen("landing")} />}
      </Shell>
    </div>
  );
}

// --- Marco / barra superior -------------------------------------------------
function Shell({ children, screen, reset, log }) {
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
        {!m && <span style={{ fontSize: 12.5, color: C.slate, fontWeight: 500 }}>El puente entre la universidad pública y tu equipo</span>}
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
function Chat({ step, respuestas, onAnswer }) {
  const q = PREGUNTAS[step];
  const [typing, setTyping] = useState(true);
  const endRef = useRef(null);
  useEffect(() => {
    setTyping(true);
    const t = setTimeout(() => setTyping(false), 850);
    return () => clearTimeout(t);
  }, [step]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [typing]);

  const prev = PREGUNTAS.slice(0, step);

  return (
    <div className="fu" style={{ maxWidth: 640, margin: "0 auto" }}>
      <div style={{ background: C.card, border: `1px solid ${C.line}`, borderRadius: 18, overflow: "hidden", boxShadow: "0 8px 30px rgba(19,33,46,.06)" }}>
        <div style={{ background: C.ink, color: C.paper, padding: "13px 18px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 9, height: 9, borderRadius: 9, background: C.teal }} />
          <span style={{ fontWeight: 600, fontSize: 14 }}>Asistente de diagnóstico</span>
          <span style={{ marginLeft: "auto", fontSize: 11.5, opacity: .7 }}>Levantamiento de necesidades (LNA)</span>
        </div>

        <div style={{ padding: "22px 20px", minHeight: 320, display: "flex", flexDirection: "column", gap: 14 }}>
          {prev.map((pq, i) => (
            <div key={i}>
              <Bubble who="bot">{pq.bot}</Bubble>
              <Bubble who="me">{respuestas[pq.k]}</Bubble>
            </div>
          ))}

          <Bubble who="bot">{typing ? <Typing /> : q.bot}</Bubble>

          {!typing && (
            <div className="fu" style={{ display: "flex", flexWrap: "wrap", gap: 9, marginTop: 4 }}>
              {q.opciones.map((o) => (
                <button key={o} className="btn opt" onClick={() => onAnswer(q.k, o)}
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
        Pregunta {step + 1} de {PREGUNTAS.length}
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
function Shortlist({ respuestas, onPick }) {
  const m = useIsMobile();
  // Selecciona las rutas según el rol elegido; si no hay match, usa las 3 por defecto.
  const ids = RUTAS_POR_ROL[respuestas.rol] || RUTAS_POR_ROL["Otro perfil técnico"];
  const rutas = ids.map((id) => DOCENTES.find((x) => x.id === id)).filter(Boolean);
  return (
    <div className="fu">
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
              <div style={{ fontSize: 12.5, color: C.slate, marginBottom: 10 }}>{d.sello} · {d.coordinador}</div>

              {/* Trust layer — reemplaza el rating Airbnb por evidencia B2B */}
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12.5 }}>
                <Stat label="Afinidad" value={`${d.match}%`} color={C.ink} />
                <Stat label="Finalización" value={`${d.finalizacion}%`} color={C.good} />
                <Stat label="Casos previos" value={d.casos} />
                <Stat label="Formato" value={`${d.modulos} módulos · ${d.horas}h`} />
              </div>
            </div>

            <div style={{ textAlign: m ? "left" : "right", flexShrink: 0, alignSelf: "stretch", display: "flex", flexDirection: m ? "row" : "column", justifyContent: "space-between", alignItems: m ? "center" : "flex-end", gap: m ? 10 : 0, width: m ? "100%" : "auto", borderTop: m ? `1px solid ${C.line}` : "none", paddingTop: m ? 12 : 0 }}>
              <div>
                <span style={{ fontSize: 11, color: C.slate }}>desde </span>
                <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.ink }}>US${d.desde.toLocaleString("es-AR")}</span>
                {d.desde < 10000 && <div style={{ fontSize: 10.5, color: C.good, fontWeight: 600 }}>✓ contratación directa</div>}
              </div>
              <div style={{ color: C.brass, fontWeight: 600, fontSize: 13, marginTop: m ? 0 : 12 }}>Ver ruta →</div>
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontSize: 12, color: C.slate, marginTop: 18, textAlign: "center" }}>
        Las opciones por debajo de USD 10.000 califican para contratación directa sin compulsa.
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

// --- Pantalla 5: Detalle de la ruta -----------------------------------------
function Detalle({ d, onBack, onConvert }) {
  const m = useIsMobile();
  if (!d) return null;
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
            <div style={{ fontSize: 12, color: C.slate }}>Inversión desde</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 700 }}>US${d.desde.toLocaleString("es-AR")}</div>
            {d.desde < 10000 && <div style={{ fontSize: 12, color: C.good, fontWeight: 600, marginBottom: 12 }}>✓ Califica para contratación directa</div>}

            <div style={{ borderTop: `1px solid ${C.line}`, margin: "12px 0", paddingTop: 12, display: "flex", flexDirection: "column", gap: 9, fontSize: 13 }}>
              <Row k="Afinidad con tu caso" v={`${d.match}%`} />
              <Row k="Tasa de finalización" v={`${d.finalizacion}%`} />
              <Row k="Empresas que ya lo hicieron" v={d.casos} />
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

function Conversion({ d, respuestas, onSend }) {
  const [f, setF] = useState({ nombre: "", empresa: "", email: "" });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");
  const ok = f.nombre && f.empresa && f.email.includes("@");

  const handleSubmit = async () => {
    if (!ok || enviando) return;
    setEnviando(true);
    setError("");

    // Si todavía no configuraste Formspree, no intenta enviar: avisa y avanza.
    if (FORMSPREE_ENDPOINT.includes("TU_ID")) {
      console.warn("Formspree no configurado: reemplazá TU_ID por tu ID real en App.jsx");
      onSend();
      return;
    }

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
        }),
      });

      if (res.ok) {
        onSend(); // éxito real
      } else {
        const data = await res.json().catch(() => ({}));
        const msg = data?.errors?.map((e) => e.message).join(", ") || `Error ${res.status}`;
        console.error("Formspree:", msg, data);
        setError("No pudimos registrar el envío (" + msg + "). Revisá la consola.");
      }
    } catch (e) {
      console.error("Error de red al enviar a Formspree:", e);
      setError("Error de conexión. Revisá tu internet o la consola del navegador.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fu" style={{ maxWidth: 520, margin: "0 auto" }}>
      <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, letterSpacing: -0.4, margin: "0 0 6px" }}>Coordinemos una reunión</h2>
      <p style={{ fontSize: 14.5, color: C.slate, margin: "0 0 22px", lineHeight: 1.5 }}>
        Un coordinador de <b style={{ color: C.ink }}>{d?.sello}</b> te contacta para ajustar la ruta a tu operación.
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
