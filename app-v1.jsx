/* PDG Industrial — Landing Page
   System notes:
   - Color: dark ink (#0D0D0C / #1D1D1B) + paper white + orange #F18700 accent
   - Type: Barlow Condensed (display, condensed bold uppercase) + Inter (body) + JetBrains Mono (technical labels)
   - Motion: IntersectionObserver-driven reveals, parallax hero, subtle particles, marquee trust bar
   - All copy in Spanish (Argentina), all imagery from supplied uploads
*/

const { useEffect, useRef, useState, useMemo, useCallback } = React;

/* ---------- Helpers ---------- */

function useReveal() {
  // Bidirectional: add .in when in viewport, remove when leaving (so the page fades on scroll both ways).
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add('in');else
        e.target.classList.remove('in');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return y;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [ids.join(',')]);
  return active;
}

/* ---------- Atoms ---------- */

const Reveal = ({ as: Tag = 'div', delay = 0, className = '', children, ...rest }) =>
<Tag
  data-reveal
  className={`reveal ${delay ? `reveal-delay-${delay}` : ''} ${className}`}
  {...rest}>
  
    {children}
  </Tag>;


const SectionLabel = ({ index, children }) =>
<div className="flex items-center gap-3 mono text-[11px] tracking-[0.18em] text-ink-300 uppercase">
    <span className="text-orange">{index}</span>
    <span className="h-px w-8 bg-ink-600"></span>
    <span>{children}</span>
  </div>;


const Btn = ({ variant = 'primary', href = '#', children, icon = true, className = '' }) => {
  const base = "inline-flex items-center gap-3 px-6 py-3.5 text-[13px] tracking-[0.12em] uppercase font-medium transition-all duration-300 group";
  const v = {
    primary: "bg-orange text-ink-950 hover:bg-orange-600",
    ghost: "border border-ink-600 text-white hover:border-orange hover:text-orange",
    light: "bg-white text-ink-950 hover:bg-ink-200",
    dark: "bg-ink-900 text-white hover:bg-ink-800 border border-ink-700"
  }[variant];
  return (
    <a href={href} className={`${base} ${v} ${className}`}>
      <span>{children}</span>
      {icon &&
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
          <path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
        </svg>
      }
    </a>);

};

const Tag = ({ children }) =>
<span className="inline-flex items-center gap-2 mono text-[10px] tracking-[0.2em] uppercase text-ink-300 border border-ink-700 px-2.5 py-1">
    <span className="w-1 h-1 bg-orange"></span>
    {children}
  </span>;


/* ---------- Header ---------- */

const NAV = [
{ id: 'inicio', label: 'Inicio' },
{ id: 'nosotros', label: 'Quiénes Somos' },
{ id: 'tableros', label: 'Tableros' },
{ id: 'casos', label: 'Casos', href: 'casos.html' },
{ id: 'productos', label: 'Productos' },
{ id: 'contacto', label: 'Contacto' }];


function Logo() {
  return (
    <a href="#inicio" className="flex items-center group" aria-label="PDG Industrial">
      <img src="assets/logo-pdg.png" alt="PDG Industrial — Materiales Eléctricos" className="h-12 lg:h-14 w-auto" />
    </a>);

}

function Header() {
  const y = useScrollY();
  const active = useActiveSection(['inicio', 'nosotros', 'tableros', 'productos', 'contacto']);
  const scrolled = y > 24;
  const [open, setOpen] = useState(false);
  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${scrolled ? 'bg-ink-950/85 backdrop-blur-xl border-b border-ink-800' : 'bg-transparent border-b border-transparent'}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between h-[72px]">
        <Logo />
        <nav className="hidden lg:flex items-center gap-9">
          {NAV.map((n) =>
          <a key={n.id} href={n.href || `#${n.id}`}
          className={`nav-link mono text-[11px] tracking-[0.18em] uppercase transition-colors ${active === n.id ? 'text-white active' : 'text-ink-300 hover:text-white'}`}>
              {n.label}
            </a>
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Btn variant="primary" href="#contacto" className="hidden md:inline-flex">Solicitar Presupuesto</Btn>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden w-10 h-10 border border-ink-700 flex items-center justify-center" aria-label="Menú">
            <span className="block w-4 h-px bg-white relative before:content-[''] before:absolute before:left-0 before:-top-1.5 before:w-4 before:h-px before:bg-white after:content-[''] after:absolute after:left-0 after:top-1.5 after:w-4 after:h-px after:bg-white"></span>
          </button>
        </div>
      </div>
      {open &&
      <div className="lg:hidden bg-ink-950 border-t border-ink-800">
          <div className="px-6 py-6 flex flex-col gap-4">
            {NAV.map((n) =>
          <a key={n.id} href={n.href || `#${n.id}`} onClick={() => setOpen(false)}
          className="mono text-xs tracking-[0.18em] uppercase text-ink-200 py-2 border-b border-ink-800">
                {n.label}
              </a>
          )}
            <Btn variant="primary" href="#contacto" className="mt-2 w-full justify-center">Solicitar Presupuesto</Btn>
          </div>
        </div>
      }
    </header>);

}

/* ---------- Hero ---------- */

function Particles({ count = 28 }) {
  const items = useMemo(() => Array.from({ length: count }).map((_, i) => ({
    left: Math.random() * 100,
    bottom: Math.random() * 60,
    size: Math.random() * 2 + 0.6,
    delay: Math.random() * 8,
    dur: 8 + Math.random() * 10,
    o: 0.25 + Math.random() * 0.5
  })), [count]);
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {items.map((p, i) =>
      <span key={i}
      className="particle absolute rounded-full bg-orange"
      style={{
        left: `${p.left}%`, bottom: `${p.bottom}%`,
        width: p.size, height: p.size,
        animationDelay: `-${p.delay}s`,
        animationDuration: `${p.dur}s`,
        opacity: p.o,
        filter: 'blur(0.4px)',
        boxShadow: '0 0 6px rgba(241,135,0,.7)'
      }} />

      )}
    </div>);

}

function Hero() {
  const y = useScrollY();
  // Subtle parallax: image moves slower; foreground text moves slightly
  const imgT = Math.min(y * 0.18, 140);
  const fgT = Math.min(y * -0.06, 40);
  return (
    <section id="inicio" className="relative min-h-screen w-full overflow-hidden bg-ink-950">
      {/* Background grid */}
      <div className="absolute inset-0 grid-texture opacity-60"></div>
      <div className="absolute inset-0 hero-glow"></div>
      <Particles />

      {/* Image layer — full bleed so centered hero reads cleanly */}
      <div
        className="absolute inset-0"
        style={{ transform: `translateY(${imgT * 0.2}px)` }}>
        
        <div className="absolute inset-0">
          <img src="assets/hero-panel.jpg" alt="Tablero eléctrico industrial PDG" className="w-full h-full object-cover object-center" />
          {/* Vignette: darker top/bottom + radial center so centered text reads */}
          <div className="absolute inset-0" style={{ background: 'radial-gradient(120% 80% at 50% 50%, rgba(13,13,12,0.35) 0%, rgba(13,13,12,0.92) 75%)' }}></div>
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink-950 to-transparent"></div>
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink-950 to-transparent"></div>
        </div>

        {/* Floating technical readouts — only on very wide screens so they don't crowd the centered headline */}
        <Reveal delay={3} className="hidden xl:flex absolute right-8 bottom-32 flex-col gap-3 z-10">
          <div className="bg-ink-900/80 backdrop-blur-md border border-ink-700 px-4 py-3 w-[220px]">
            <div className="mono text-[9px] tracking-[0.25em] text-ink-300 uppercase">Tablero · 04A</div>
            <div className="flex items-baseline justify-between mt-1">
              <span className="display text-white text-2xl">380V</span>
              <span className="mono text-[10px] text-orange">● ONLINE</span>
            </div>
            <div className="h-px bg-ink-700 my-2"></div>
            <div className="grid grid-cols-3 gap-2 mono text-[10px] text-ink-200">
              <div><div className="text-ink-400 text-[9px]">L1</div>219V</div>
              <div><div className="text-ink-400 text-[9px]">L2</div>221V</div>
              <div><div className="text-ink-400 text-[9px]">L3</div>220V</div>
            </div>
          </div>
          <div className="bg-ink-900/80 backdrop-blur-md border border-ink-700 px-4 py-3 w-[220px]">
            <div className="flex items-center justify-between">
              <div>
                <div className="mono text-[9px] tracking-[0.25em] text-ink-300 uppercase">PLC · S7-1500</div>
                <div className="display text-white text-2xl">RUN</div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-orange pulse-dot"></span>
            </div>
          </div>
        </Reveal>
      </div>

      {/* Foreground content — centered both axes, narrower wrap, smaller display */}
      <div
        className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 min-h-screen flex flex-col items-center justify-center text-center"
        style={{ transform: `translateY(${fgT}px)` }}>
        
        <div className="max-w-[1080px] w-full flex flex-col items-center">
          <Reveal className="mb-8">
          </Reveal>
          <Reveal delay={1} as="h1" className="display text-white text-[clamp(40px,6.4vw,104px)] max-w-[16ch]">
            Soluciones <span className="text-orange">eléctricas</span><br />
            industriales para<br />
            proyectos que <span className="italic font-light normal-case tracking-tight" style={{ fontStyle: 'italic', fontWeight: 300 }}>exigen</span> precisión.
          </Reveal>
          <Reveal delay={2} className="mt-8 max-w-[560px] text-ink-200 text-base lg:text-lg leading-relaxed">
            Diseñamos, fabricamos y montamos tableros eléctricos a medida y suministramos materiales de primeras marcas. Dos décadas energizando la industria argentina.
          </Reveal>
          <Reveal delay={3} className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Btn variant="primary" href="#contacto">Solicitar Presupuesto</Btn>
          </Reveal>

          {/* Stats row — also centered, compact */}
          <Reveal delay={4} className="mt-14 lg:mt-16 grid grid-cols-3 gap-x-4 sm:gap-x-10 lg:gap-x-16 gap-y-6 items-end w-full max-w-[640px]">
            <div className="text-center">
              <div className="display text-orange text-3xl sm:text-4xl lg:text-5xl">20</div>
              <div className="mono text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.2em] text-ink-300 uppercase mt-2">Años en industria</div>
            </div>
            <div className="text-center">
              <div className="display text-white text-3xl sm:text-4xl lg:text-5xl">+250</div>
              <div className="mono text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.2em] text-ink-300 uppercase mt-2">Tableros entregados</div>
            </div>
            <div className="text-center">
              <div className="display text-white text-3xl sm:text-4xl lg:text-5xl">150+</div>
              <div className="mono text-[9px] sm:text-[10px] tracking-[0.18em] sm:tracking-[0.2em] text-ink-300 uppercase mt-2">Clientes activos</div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* corner readouts */}
      <div className="hidden lg:flex absolute left-10 top-1/2 -translate-y-1/2 flex-col gap-2 mono text-[10px] tracking-[0.25em] uppercase text-ink-400 z-10 origin-left">
        <div className="-rotate-90 origin-top-left translate-y-32 whitespace-nowrap">PDG · 01 · INICIO · 34.6037° S — 58.3816° W</div>
      </div>
    </section>);

}

/* ---------- Trust Bar ---------- */

const TRUST = [
{ k: 'Tableros a Medida', d: 'Diseño & fabricación', icon: 'panel' },
{ k: 'Asesoramiento Técnico', d: 'Ingenieros especialistas', icon: 'support' },
{ k: 'Primeras Marcas', d: 'Stock permanente', icon: 'brands' },
{ k: 'Entrega Rápida', d: 'Logística nacional', icon: 'truck' }];


const TrustIcon = ({ name, className = '' }) => {
  const stroke = "currentColor";
  const common = { width: 28, height: 28, viewBox: "0 0 28 28", fill: "none", stroke, strokeWidth: 1.5, strokeLinecap: "square", className };
  switch (name) {
    case 'panel':return (
        <svg {...common}><rect x="4" y="3" width="20" height="22" /><path d="M8 7h12M8 11h12M8 15h8M8 19h6" /><circle cx="20" cy="19" r="1.5" /></svg>);

    case 'support':return (
        <svg {...common}><path d="M4 17v-5a10 10 0 0 1 20 0v5" /><rect x="4" y="15" width="5" height="7" /><rect x="19" y="15" width="5" height="7" /><path d="M19 22a4 4 0 0 1-4 4h-1" /></svg>);

    case 'brands':return (
        <svg {...common}><path d="M14 3l2.6 5.3 5.9.9-4.2 4.1 1 5.8L14 16.4 8.7 19.1l1-5.8L5.5 9.2l5.9-.9L14 3z" /></svg>);

    case 'truck':return (
        <svg {...common}><rect x="2" y="7" width="14" height="11" /><path d="M16 11h4l3 4v3h-7" /><circle cx="7" cy="21" r="2" /><circle cx="19" cy="21" r="2" /></svg>);

    default:return null;
  }
};

function TrustBar() {
  return (
    <section className="relative bg-ink-900 border-y border-ink-800">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-10 lg:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 lg:gap-4">
          {TRUST.map((t, i) =>
          <Reveal key={t.k} delay={i + 1} className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:text-left gap-3 lg:gap-5 lg:border-r lg:border-ink-800 lg:last:border-r-0 lg:pr-4">
              <div className="w-12 h-12 lg:w-14 lg:h-14 flex items-center justify-center border border-ink-700 text-orange shrink-0">
                <TrustIcon name={t.icon} />
              </div>
              <div className="min-w-0">
                <div className="display text-white text-base sm:text-lg lg:text-2xl leading-tight">{t.k}</div>
                <div className="mono text-[9px] sm:text-[10px] tracking-[0.16em] sm:tracking-[0.18em] text-ink-300 uppercase mt-2 leading-snug">{t.d}</div>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- About ---------- */

function About() {
  const y = useScrollY();
  return (
    <section id="nosotros" className="relative bg-ink-950 py-28 lg:py-40 overflow-hidden">
      <div className="absolute inset-0 grid-texture-fine opacity-40"></div>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative">
        <Reveal><SectionLabel index="02 / NOSOTROS">Quiénes Somos</SectionLabel></Reveal>

        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mt-10 items-start">
          <div className="lg:col-span-7">
            <Reveal delay={1} as="h2" className="display text-white text-[clamp(44px,6.5vw,96px)]">
              Impulsamos<br />
              proyectos con<br />
              <span className="text-orange">energía</span> y experiencia.
            </Reveal>
            <Reveal delay={2} className="mt-10 grid md:grid-cols-2 gap-8 max-w-3xl text-ink-200 leading-relaxed">
              <p>Desde Córdoba Argentina, PDG Industrial integra ingeniería eléctrica, fabricación de tableros y suministro de materiales para acompañar a la industria en cada etapa de su crecimiento.</p>
              <p>Trabajamos junto a equipos de mantenimiento, contratistas e integradores con un único objetivo: entregar soluciones confiables, normalizadas y a tiempo.</p>
            </Reveal>

            <Reveal delay={3} className="mt-12 grid grid-cols-3 gap-6 max-w-2xl">
              {[
              ['IEC 61439', 'Norma de tableros'],
              ['ISO 9001', 'Calidad'],
              ['24/7', 'Soporte post-venta']].
              map(([k, v]) =>
              <div key={k} className="border-t border-ink-700 pt-4">
                  <div className="display text-orange text-3xl">{k}</div>
                  <div className="mono text-[10px] tracking-[0.18em] text-ink-300 uppercase mt-2">{v}</div>
                </div>
              )}
            </Reveal>
          </div>

          <div className="lg:col-span-5">
            <Reveal delay={2} className="relative img-zoom overflow-hidden">
              <img src="assets/engineer-panel.jpg" alt="Ingeniero PDG operando tablero" className="w-full h-[380px] sm:h-[480px] lg:h-[640px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"></div>
              <div className="absolute left-5 bottom-5 right-5 flex items-end justify-between">
                <div>
                  <div className="mono text-[10px] tracking-[0.2em] uppercase text-ink-200"></div>
                  <div className="display text-white text-2xl mt-1">Ingeniería confiable</div>
                </div>
                <div className="mono text-[10px] tracking-[0.2em] text-orange">↘ 01</div>
              </div>
              <div className="absolute top-5 left-5 mono text-[10px] tracking-[0.2em] text-white/80 uppercase border border-white/30 px-2 py-1 backdrop-blur-sm"></div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>);

}

/* ---------- Services ---------- */

const SERVICES = [
{
  n: '01',
  title: 'Tableros Eléctricos Industriales',
  desc: 'Diseño y fabricación de tableros de potencia, comando, distribución y automatización bajo norma IEC 61439.',
  bullets: ['CCM y Tableros Generales', 'Bancos de capacitores', 'Tableros con PLC + HMI', 'Comandos a medida'],
  icon:
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6" y="4" width="32" height="36" /><path d="M12 10h20M12 16h20M12 22h14M12 28h10M12 34h8" /><circle cx="32" cy="28" r="2" /><circle cx="32" cy="34" r="2" />
      </svg>

},
{
  n: '02',
  title: 'Materiales Eléctricos',
  desc: 'Stock permanente de componentes de primeras marcas para mantenimiento, obra nueva y ampliaciones.',
  bullets: ['Protecciones y maniobra', 'Variadores y arrancadores', 'Conductores y canalización', 'Iluminación industrial'],
  icon:
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M8 8h28v8H8zM8 20h28v8H8zM8 32h28v6H8z" /><path d="M14 10v4M22 10v4M30 10v4M14 22v4M22 22v4M30 22v4" />
      </svg>

},
{
  n: '03',
  title: 'Asesoramiento Técnico',
  desc: 'Acompañamos tu proyecto desde el cómputo eléctrico hasta la puesta en marcha y la documentación as-built.',
  bullets: ['Selectividad y coordinación', 'Cálculo de cortocircuito', 'Eficiencia energética', 'Documentación AutoCAD/EPLAN'],
  icon:
  <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 6l16 8-16 8L6 14l16-8z" /><path d="M6 22l16 8 16-8M6 30l16 8 16-8" />
      </svg>

}];


function Services() {
  return (
    <section id="tableros" className="relative bg-ink-900 py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <Reveal><SectionLabel index="03 / SERVICIOS">Lo que hacemos</SectionLabel></Reveal>
            <Reveal delay={1} as="h2" className="display text-white text-[clamp(40px,5.2vw,80px)] mt-6 max-w-3xl">
              Servicios diseñados<br />para la <span className="text-orange">producción continua</span>.
            </Reveal>
          </div>
          <Reveal delay={2} className="max-w-md text-ink-200 leading-relaxed">
            Cada servicio se entrega con planos as-built, ensayos eléctricos y memoria técnica firmada por matrícula.
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-px bg-ink-800 mt-12 lg:mt-16 border border-ink-800">
          {SERVICES.map((s, i) =>
          <Reveal key={s.n} delay={i + 1} className="group relative bg-ink-900 p-8 lg:p-10 lift hover:bg-ink-800/60">
              <div className="flex items-start justify-between">
                <span className="mono text-[10px] tracking-[0.25em] text-ink-300">{s.n} / 03</span>
                <div className="text-orange opacity-90">{s.icon}</div>
              </div>
              <h3 className="display text-white text-3xl lg:text-4xl mt-10 leading-tight">{s.title}</h3>
              <p className="text-ink-200 leading-relaxed mt-4">{s.desc}</p>
              <ul className="mt-6 space-y-2">
                {s.bullets.map((b) =>
              <li key={b} className="flex items-center gap-3 mono text-[11px] tracking-[0.1em] text-ink-300 uppercase">
                    <span className="w-1 h-1 bg-orange"></span>{b}
                  </li>
              )}
              </ul>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- Featured Projects ---------- */

const PROJECTS = [
{
  n: '01',
  sector: 'Saneamiento',
  title: 'Tablero bombeo aguas negras',
  location: 'Argentina',
  year: '2025',
  img: 'assets/tablero-bombeo-aguas-negras-1.jpg',
  desc: 'Tablero diseñado para controlar bombas sumergibles destinadas al traslado de aguas residuales, con arranque automático por nivel y protecciones eléctricas.'
},
{
  n: '02',
  sector: 'Salud',
  title: 'Tablero hospitalario — Resonador',
  location: 'Argentina',
  year: '—',
  img: 'assets/tablero-hospitalario-resonador-1.png',
  desc: 'Tablero eléctrico para alimentar y proteger un equipo de resonancia magnética, con estabilidad eléctrica y protecciones para equipos médicos de alta sensibilidad.'
},
{
  n: '03',
  sector: 'Agua Potable',
  title: 'Tablero planta potabilizadora — Cruz del Eje',
  location: 'Cruz del Eje, Cba',
  year: '—',
  img: 'assets/tablero-planta-pot-cba-1.jpg',
  desc: 'Tablero desarrollado para automatizar y proteger los equipos de una planta potabilizadora específica, asegurando un suministro de agua confiable y continuo.'
}];


function ProjectImage({ src }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <img src={src} alt="" className="img w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/20 to-transparent"></div>
    </div>);

}

function Projects() {
  return (
    <section id="proyectos" className="relative bg-ink-950 py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div>
            <Reveal><SectionLabel index="04 / PROYECTOS">Casos destacados</SectionLabel></Reveal>
            <Reveal delay={1} as="h2" className="display text-white text-[clamp(40px,5.2vw,80px)] mt-6 max-w-3xl">
              Energía que <span className="text-orange">se ve</span><br />en producción.
            </Reveal>
          </div>
          <Reveal delay={2}>
            <Btn variant="ghost" href="casos.html">Ver todos los casos</Btn>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mt-12 lg:mt-16" id="projects-grid">
          {PROJECTS.map((p, i) =>
          <Reveal key={p.n} delay={i + 1} className="group lift">
              <a href="casos.html" className="block relative h-[420px] lg:h-[520px] img-zoom overflow-hidden border border-ink-800 group-hover:border-orange/50 transition-colors duration-500">
                <ProjectImage src={p.img} />
                <div className="absolute top-5 left-5 flex items-center gap-2">
                  <span className="mono text-[10px] tracking-[0.2em] uppercase border border-white/30 text-white px-2 py-1 backdrop-blur-sm bg-ink-950/30">{p.sector}</span>
                </div>
                <div className="absolute top-5 right-5 mono text-[10px] tracking-[0.2em] uppercase text-white/70">{p.n}/03</div>
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center justify-between mono text-[10px] tracking-[0.18em] uppercase text-ink-200">
                    <span>{p.location}</span><span>{p.year}</span>
                  </div>
                  <h3 className="display text-white text-2xl lg:text-3xl mt-3 leading-tight">{p.title}</h3>
                  <p className="text-ink-200 text-sm mt-3 max-h-0 overflow-hidden opacity-0 group-hover:max-h-32 group-hover:opacity-100 transition-all duration-500">{p.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-orange opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    <span className="mono text-[10px] tracking-[0.2em] uppercase">Ver caso</span>
                    <svg width="14" height="10" viewBox="0 0 14 10" fill="none"><path d="M1 5h12M9 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" /></svg>
                  </div>
                </div>
              </a>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- Products / E-commerce ---------- */

const PRODUCT_CATS = [
['Protecciones', '320+'],
['Maniobra', '180+'],
['Variadores', '90+'],
['Conductores', '210+'],
['Iluminación', '140+'],
['Automatización', '160+']];


function Products() {
  return (
    <section id="productos" className="relative py-28 lg:py-40 overflow-hidden bg-ink-900">
      <div className="absolute inset-0 grid-texture opacity-40"></div>
      <div className="absolute -right-40 top-1/2 -translate-y-1/2 w-[640px] h-[640px] rounded-full bg-orange/15 blur-[120px]"></div>

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6">
            <Reveal><SectionLabel index="05 / E-COMMERCE">Materiales online</SectionLabel></Reveal>
            <Reveal delay={1} as="h2" className="display text-white text-[clamp(44px,6.8vw,108px)] mt-6">
              Tu stock<br />industrial,<br />
              <span className="text-orange">a un click.</span>
            </Reveal>
            <Reveal delay={2} className="mt-8 max-w-lg text-ink-200 leading-relaxed">
              Más de 1.100 productos eléctricos disponibles con precio mayorista, ficha técnica descargable y envío a todo el país.
            </Reveal>
            <Reveal delay={3} className="mt-10 flex flex-wrap gap-3">
              <Btn variant="primary" href="#">Ir al E-commerce</Btn>
            </Reveal>
          </div>

          <div className="lg:col-span-6">
            <Reveal delay={2} className="border border-ink-700 bg-ink-950/60 backdrop-blur-sm">
              <div className="flex items-center justify-between p-5 border-b border-ink-800">
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange pulse-dot"></span>
                  <span className="mono text-[11px] tracking-[0.2em] uppercase text-ink-200">shop.pdgindustrial.com.ar</span>
                </div>
                <span className="mono text-[10px] text-ink-400">LIVE · STOCK</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-ink-800">
                {PRODUCT_CATS.map(([k, v], i) =>
                <a href="#" key={k} className="group bg-ink-950 hover:bg-ink-900 transition-colors p-5 lg:p-6">
                    <div className="flex items-baseline justify-between">
                      <span className="mono text-[10px] tracking-[0.2em] uppercase text-ink-300">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mono text-[10px] text-orange">{v}</span>
                    </div>
                    <div className="display text-white text-2xl mt-6 leading-tight group-hover:text-orange transition-colors">{k}</div>
                    <div className="h-px w-8 bg-ink-700 group-hover:w-full group-hover:bg-orange transition-all duration-500 mt-4"></div>
                  </a>
                )}
              </div>
              <div className="flex items-center justify-between p-5 border-t border-ink-800 mono text-[10px] tracking-[0.2em] uppercase text-ink-300">
                <span>Envíos · CABA & GBA · 24-48h</span>
                <span>Mayorista · Cta. Cte.</span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>);

}

/* ---------- Benefits ---------- */

const BENEFITS = [
{ k: 'Calidad certificada', d: 'Tableros bajo norma IEC 61439, ensayados pieza por pieza antes de despacho.',
  icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 3l11 5v8c0 7-5 11-11 13C5 27 5 23 5 16V8l11-5z" /><path d="M11 16l4 4 7-8" /></svg> },
{ k: 'Ingeniería propia', d: 'Equipo de ingenieros eléctricos que acompaña desde el anteproyecto hasta el as-built.',
  icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h24v18H4z" /><path d="M4 11h24M9 6V3M23 6V3M9 17h6M9 21h10" /></svg> },
{ k: 'Stock real', d: 'Más de 1.100 productos en depósito propio. Sin esperas ni retrasos por importación.',
  icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 11l12-6 12 6v10l-12 6-12-6V11z" /><path d="M4 11l12 6 12-6M16 17v10" /></svg> },
{ k: 'Entrega ágil', d: 'Despachos a todo el país en 24/72 horas o retiro inmediato en tienda.',
  icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="9" width="17" height="14" /><path d="M19 13h6l4 5v5h-9" /><circle cx="9" cy="25" r="2.5" /><circle cx="23" cy="25" r="2.5" /></svg> },
{ k: 'Soporte post-venta', d: 'Garantía extendida, repuestos críticos y servicio técnico durante toda la vida útil del tablero.',
  icon: <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="16" cy="16" r="12" /><path d="M16 8v8l5 3M22 4l2 2M8 4l-2 2" /></svg> }];


function Benefits() {
  return (
    <section className="relative bg-ink-950 py-28 lg:py-40">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-8">
            <Reveal><SectionLabel index="06 / BENEFICIOS">Por qué PDG</SectionLabel></Reveal>
            <Reveal delay={1} as="h2" className="display text-white text-[clamp(40px,5.2vw,80px)] mt-6 max-w-3xl">
              Cinco razones por<br />las que la industria<br />nos <span className="text-orange">elige</span>.
            </Reveal>
          </div>
          <Reveal delay={2} className="lg:col-span-4 text-ink-200 leading-relaxed">
            Lo que vas a notar en cada proyecto, desde la cotización hasta el cierre de obra.
          </Reveal>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-px bg-ink-800 mt-12 lg:mt-16 border border-ink-800">
          {BENEFITS.map((b, i) =>
          <Reveal key={b.k} delay={i + 1} className="group bg-ink-950 p-6 lg:p-8 hover:bg-ink-900 transition-colors flex flex-col">
              <div className="flex items-center justify-between mb-8">
                <span className="mono text-[10px] tracking-[0.2em] uppercase text-ink-300">0{i + 1}</span>
                <span className="text-orange">{b.icon}</span>
              </div>
              <h3 className="display text-white text-xl lg:text-2xl leading-tight">{b.k}</h3>
              <p className="text-ink-300 text-sm leading-relaxed mt-3">{b.d}</p>
            </Reveal>
          )}
        </div>
      </div>
    </section>);

}

/* ---------- Final CTA ---------- */

function FinalCTA() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-ink-950 py-28 lg:py-40">
      <div className="absolute inset-0 grid-texture opacity-40"></div>
      <div className="absolute inset-0">
        <div className="absolute left-1/2 -translate-x-1/2 top-1/3 w-[900px] h-[900px] rounded-full bg-orange/20 blur-[140px]"></div>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
        <Reveal>
          <Tag>Contacto · 06</Tag>
        </Reveal>
        <Reveal delay={1} as="h2" className="display text-white text-[clamp(48px,8vw,168px)] mt-8">
          Hablemos<br />de tu próximo<br /><span className="text-orange">proyecto.</span>
        </Reveal>
        <Reveal delay={2} className="mt-10 text-ink-200 max-w-xl mx-auto leading-relaxed">
          Recibimos planos, listados de cargas o un simple WhatsApp. Te devolvemos una cotización detallada en 48 horas hábiles.
        </Reveal>
        <Reveal delay={3} className="mt-12 flex flex-wrap items-center justify-center gap-3">
          <a href="https://wa.me/5493541652758?text=Hola%2C%20quisiera%20consultarte%20sobre..." className="inline-flex items-center gap-3 px-6 py-3.5 text-[13px] tracking-[0.12em] uppercase font-medium bg-[#25D366] text-ink-950 hover:bg-[#1ebd5b] transition-colors group">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1l-1.8-.7c-3-1.3-5-4.4-5.1-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.5l1 2.3c.1.2.1.4 0 .6l-.4.5-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.2.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.1.2.1.9-.2 1.4z" /></svg>
            WhatsApp Directo
          </a>
          <Btn variant="primary" href="mailto:pdgindustrialelectro@gmail.com">Solicitar Presupuesto</Btn>
        </Reveal>

        <Reveal delay={4} className="mt-16 grid md:grid-cols-3 gap-6 max-w-3xl mx-auto text-left">
          {[
          ['Llamanos', '+54 15 3541 652758', 'mono'],
          ['Escribinos', 'pdgindustrialelectro@gmail.com', 'mono'],
          ['Visitanos', 'Av. San Martín 1601, Villa Carlos Paz, Córdoba.', 'mono']].
          map(([k, v]) =>
          <div key={k} className="border-t border-ink-700 pt-5">
              <div className="mono text-[10px] tracking-[0.2em] uppercase text-ink-300">{k}</div>
              <div className="text-white mt-2">{v}</div>
            </div>
          )}
        </Reveal>
      </div>
    </section>);

}

/* ---------- Footer ---------- */

function Footer() {
  return (
    <footer className="relative bg-ink-900 border-t border-ink-800">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <Logo />
            <p className="mt-6 text-ink-300 max-w-md leading-relaxed">
              PDG Industrial — Tableros eléctricos y materiales para la industria argentina desde 2003.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <a key="IG" href="https://www.instagram.com/pdg_industrial?igsh=MWJrcTl2N3JocHBlbA==" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="w-10 h-10 border border-ink-700 hover:border-orange hover:text-orange flex items-center justify-center text-ink-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
              </a>
              <a key="LI" href="https://www.linkedin.com/in/pablo-daniel-graziano-5b88a980" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 border border-ink-700 hover:border-orange hover:text-orange flex items-center justify-center text-ink-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3V9zm7 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.3-.02-2.96-1.8-2.96-1.8 0-2.08 1.4-2.08 2.86V21h-4V9z" /></svg>
              </a>
              <a key="WA" href="https://wa.me/5493541652758?text=Hola%2C%20quisiera%20consultarte%20sobre..." target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="w-10 h-10 border border-ink-700 hover:border-orange hover:text-orange flex items-center justify-center text-ink-200 transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.2 14.2c-.2.6-1.2 1.2-1.7 1.2-.4.1-1 .1-1.6-.1l-1.8-.7c-3-1.3-5-4.4-5.1-4.6-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.4.8-.4h.6c.2 0 .5 0 .7.5l1 2.3c.1.2.1.4 0 .6l-.4.5-.4.5c-.1.2-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.2 1.4 2.5 1.5.3.1.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.2.7-.2.3.1 1.9.9 2.2 1.1.3.2.5.2.6.4.1.2.1.9-.2 1.4z" /></svg>
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="mono text-[10px] tracking-[0.2em] text-ink-400 uppercase">Empresa</div>
            <ul className="mt-5 space-y-3">
              {[['Nosotros', '#nosotros'], ['Capacidades', '#tableros'], ['Casos', 'casos.html']].map(([x, h]) =>
              <li key={x}><a href={h} className="text-ink-200 hover:text-orange transition-colors">{x}</a></li>
              )}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <div className="mono text-[10px] tracking-[0.2em] text-ink-400 uppercase">Servicios</div>
            <ul className="mt-5 space-y-3">
              {['Tableros', 'Materiales', 'Automatización', 'Asesoramiento'].map((x) =>
              <li key={x}><a href="#tableros" className="text-ink-200 hover:text-orange transition-colors">{x}</a></li>
              )}
            </ul>
          </div>
          <div className="lg:col-span-3">
            <div className="mono text-[10px] tracking-[0.2em] text-ink-400 uppercase">Contacto</div>
            <ul className="mt-5 space-y-3 text-ink-200">
              <li>Av. San Martin 1601<br />Villa Carlos Paz, Córdoba</li>
              <li>+54 15 3541 652758</li>
              <li>pdgindustrialelectro@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-ink-800 flex flex-col md:flex-row md:items-center justify-between gap-4 mono text-[10px] tracking-[0.18em] uppercase text-ink-400">
          <div>© 2025 PDG Industrial S.A. · CUIT 30-00000000-0 · Todos los derechos reservados.</div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">Política de privacidad</a>
            <a href="#" className="hover:text-white">Términos</a>
            <a href="#" className="hover:text-white">Cookies</a>
          </div>
        </div>
      </div>
    </footer>);

}

/* ---------- Marquee (subtle brand bar between sections) ---------- */

function BrandMarquee() {
  const items = ['IEC 61439', 'ISO 9001', 'Made in Argentina', 'Stock real', 'Entrega 24-72h', 'Ingeniería propia', 'Garantía extendida', 'Soporte 24/7'];
  const doubled = [...items, ...items];
  return (
    <div className="bg-ink-950 border-y border-ink-800 fade-x overflow-hidden">
      <div className="marquee-track flex whitespace-nowrap py-5">
        {doubled.map((it, i) =>
        <span key={i} className="flex items-center gap-6 mono text-[11px] tracking-[0.25em] uppercase text-ink-300">
            <span className="px-8">{it}</span>
            <span className="text-orange">●</span>
          </span>
        )}
      </div>
    </div>);

}

/* ---------- App ---------- */

function App() {
  useReveal();
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }, []);
  return (
    <div className="bg-ink-950 text-white">
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <About />
        <Services />
        <BrandMarquee />
        <Projects />
        <Products />
        <Benefits />
        <FinalCTA />
      </main>
      <Footer />
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);