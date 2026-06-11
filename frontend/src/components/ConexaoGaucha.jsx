cat > /mnt/user-data/outputs/ConexaoGaucha.jsx << 'EOF'
import { useState } from "react";
import {
  MapPin, Search, Bell, Home, Map, PlusCircle, Clock, User,
  LogIn, UserPlus, Lock, Mail, Eye, EyeOff, ArrowLeft, ChevronRight,
  Wallet, Calendar, Star, Route, Trash2, Share2, Download, Copy,
  CheckCircle, Circle, NotebookPen, Check, Minus, Plus,
  PiggyBank, CreditCard, Gem, Wand2, MountainSnow, Waves, Landmark,
  TreePine, Compass, Navigation, AlertTriangle, Settings,
  Shield, HelpCircle, LogOut, RefreshCw, BarChart2
} from "lucide-react";
import serra_gaucha from "../assets/serra_gaucha.jpg";
import vale_dos_vinhedos from "../assets/vale_dos_vinhedos.jpeg";
import porto_alegre from "../assets/porto_alegre.jpg";

// ─── DATA ─────────────────────────────────────────────────────────────────────
const REGIONS = [
  { id: "serra",    name: "Serra Gaúcha",          cities: "Gramado · Canela · Bento Gonçalves", img: serra_gaucha,        Icon: MountainSnow },
  { id: "litoral",  name: "Litoral Gaúcho",         cities: "Torres · Tramandaí · Capão da Canoa", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", Icon: Waves },
  { id: "missoes",  name: "Missões",                cities: "São Miguel das Missões · Santo Ângelo", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80", Icon: Landmark },
  { id: "campanha", name: "Campanha Gaúcha",        cities: "Bagé · Santana do Livramento · Dom Pedrito", img: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80", Icon: Navigation },
  { id: "poa",      name: "Porto Alegre e Região",  cities: "Porto Alegre · Novo Hamburgo · São Leopoldo", img: porto_alegre, Icon: MapPin },
  { id: "nordeste", name: "Serra do Nordeste",      cities: "Vacaria · Bom Jesus · São Francisco de Paula", img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80", Icon: MountainSnow },
  { id: "vinhedos", name: "Vale dos Vinhedos",      cities: "Garibaldi · Carlos Barbosa · Monte Belo do Sul", img: vale_dos_vinhedos, Icon: TreePine },
];

const PREFERENCES = [
  { id: "natureza",    label: "Natureza",    Icon: TreePine },
  { id: "cultura",     label: "Cultura",     Icon: Landmark },
  { id: "gastronomia", label: "Gastronomia", Icon: Gem },
  { id: "aventura",    label: "Aventura",    Icon: Compass },
  { id: "historia",    label: "História",    Icon: MapPin },
  { id: "religioso",   label: "Religioso",   Icon: Star },
];

const BUDGETS = [
  { id: "economico", label: "Econômico", desc: "Atrações gratuitas e de baixo custo",  Icon: PiggyBank },
  { id: "moderado",  label: "Moderado",  desc: "Equilíbrio entre custo e experiência", Icon: CreditCard },
  { id: "premium",   label: "Premium",   desc: "As melhores experiências sem limites", Icon: Gem },
];

const SAMPLE_ITINERARY = {
  region: "Serra Gaúcha", days: 4, cost: "R$ 732", budget: "Moderado",
  period: "ter., 20 de out. → sex., 24 de out.",
  img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=800&q=80",
  schedule: [
    {
      day: 1, date: "ter., 20 de out.", cost: "R$ 173",
      places: [
        { time: "09:00", name: "Parque do Caracol", city: "Canela", desc: "Cachoeira de 131m em plena mata nativa. Trilhas, tirolesa e mirante panorâmico.", cost: "R$ 38/pessoa", duration: "3–4 horas", rating: 4.8, img: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=400&q=80" },
        { time: "14:00", name: "Rua Coberta de Gramado", city: "Gramado", desc: "Centro comercial e gastronômico, ideal para compras de chocolate artesanal.", cost: "Gratuito", duration: "2–3 horas", rating: 4.6, img: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80" },
      ],
    },
    {
      day: 2, date: "qua., 21 de out.", cost: "R$ 210",
      places: [
        { time: "10:00", name: "Vale dos Vinhedos", city: "Bento Gonçalves", desc: "Rota do vinho com degustação em vinícolas premiadas e gastronomia italiana.", cost: "R$ 80/pessoa", duration: "4–5 horas", rating: 4.9, img: vale_dos_vinhedos },
      ],
    },
  ],
};

const HISTORY = [
  { id: 1, region: "Serra Gaúcha",  days: 74, locals: 222, cost: "R$ 14.018", date: "20 de out. de 2026", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=400&q=80", Icon: MountainSnow },
  { id: 2, region: "Serra Gaúcha",  days: 4,  locals: 12,  cost: "R$ 732",    date: "10 de out. de 2025", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=400&q=80", Icon: MountainSnow },
  { id: 3, region: "Litoral Gaúcho",days: 4,  locals: 10,  cost: "R$ 492",    date: "20 de dez. de 2025", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80", Icon: Waves },
];

// ─── SHARED ───────────────────────────────────────────────────────────────────
function NavBar({ active, setScreen }) {
  const items = [
    { id: "home",    label: "Início",   Icon: Home },
    { id: "planner", label: "Planejar", Icon: PlusCircle },
    { id: "history", label: "Histórico",Icon: Clock },
    { id: "profile", label: "Perfil",   Icon: User },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex z-50 max-w-sm mx-auto">
      {items.map(({ id, label, Icon }) => (
        <button key={id} onClick={() => setScreen(id)}
          className={`flex-1 py-3 flex flex-col items-center gap-0.5 text-xs font-medium transition-colors ${
            active === id ? "text-teal-700" : "text-slate-400 hover:text-slate-600"
          }`}>
          <Icon size={20} strokeWidth={active === id ? 2.5 : 1.8} />
          <span>{label}</span>
          {active === id && <span className="w-1 h-1 rounded-full bg-teal-600 mt-0.5" />}
        </button>
      ))}
    </nav>
  );
}

function PageWrapper({ children, noNav, screen, setScreen }) {
  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center">
      <div className="relative w-full max-w-sm min-h-screen bg-slate-50 flex flex-col shadow-2xl">
        <div className={`flex-1 overflow-y-auto ${noNav ? "" : "pb-20"}`}>{children}</div>
        {!noNav && <NavBar active={screen} setScreen={setScreen} />}
      </div>
    </div>
  );
}

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-0 mb-5">
      {[1, 2, 3].map((n, i) => (
        <div key={n} className="flex items-center flex-1 last:flex-none">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
            n < step ? "bg-teal-600 text-white" : n === step ? "bg-teal-800 text-white ring-2 ring-teal-300" : "bg-slate-200 text-slate-400"
          }`}>
            {n < step ? <Check size={13} /> : n}
          </div>
          {i < 2 && <div className={`flex-1 h-0.5 mx-1 ${n < step ? "bg-teal-500" : "bg-slate-200"}`} />}
        </div>
      ))}
    </div>
  );
}

function Tag({ Icon, children, color = "teal" }) {
  const colors = { teal: "bg-teal-50 text-teal-700", slate: "bg-slate-100 text-slate-600", green: "bg-emerald-50 text-emerald-700" };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${colors[color]}`}>
      {Icon && <Icon size={11} />}{children}
    </span>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ setScreen }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");

  return (
    <PageWrapper noNav>
      <div className="bg-teal-800 px-6 pt-14 pb-12 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
        <div className="absolute bottom-0 left-0 w-20 h-20 rounded-full bg-white/5" />
        <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center mb-5">
          <MapPin size={26} color="white" />
        </div>
        <p className="text-teal-300 text-xs font-semibold tracking-widest uppercase mb-2">Conexão Gaúcha</p>
        <h1 className="text-white text-3xl font-bold leading-tight">Bem-vindo de volta!</h1>
        <p className="text-teal-200/80 text-sm mt-1">Entre para continuar seus roteiros</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-5 px-6 pt-8 pb-10 flex flex-col gap-4 relative z-10">
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">E-mail</label>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-teal-400 transition">
            <Mail size={16} className="text-slate-400 flex-shrink-0" />
            <input type="email" placeholder="seu@email.com" value={email} onChange={e => setEmail(e.target.value)}
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
          </div>
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-slate-700 text-sm font-semibold">Senha</label>
            <button className="text-teal-600 text-xs font-medium hover:underline">Esqueci a senha</button>
          </div>
          <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-teal-400 transition">
            <Lock size={16} className="text-slate-400 flex-shrink-0" />
            <input type={showPw ? "text" : "password"} placeholder="••••••••" value={pw} onChange={e => setPw(e.target.value)}
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
            <button onClick={() => setShowPw(v => !v)} className="text-slate-400">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
          <input type="checkbox" defaultChecked className="accent-teal-700 w-4 h-4" />
          <span>Lembrar-me</span>
        </label>
        <button onClick={() => setScreen("home")}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 mt-1">
          <LogIn size={18} /> Entrar
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-slate-400 text-xs">ou</span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>
        <button onClick={() => setScreen("register")}
          className="w-full border border-slate-200 bg-white text-slate-700 font-semibold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-50 transition">
          <UserPlus size={17} /> Criar uma conta grátis
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── REGISTER ─────────────────────────────────────────────────────────────────
function RegisterScreen({ setScreen }) {
  const [showPw, setShowPw] = useState(false);
  const [lgpd, setLgpd] = useState(false);

  return (
    <PageWrapper noNav>
      <div className="bg-teal-800 px-6 pt-14 pb-12 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
        <button onClick={() => setScreen("login")}
          className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-5">
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="text-teal-300 text-xs font-semibold tracking-widest uppercase mb-2">Conexão Gaúcha</p>
        <h1 className="text-white text-3xl font-bold leading-tight">Criar sua conta</h1>
        <p className="text-teal-200/80 text-sm mt-1">Comece a planejar aventuras gaúchas</p>
      </div>

      <div className="bg-slate-50 rounded-t-3xl -mt-5 px-6 pt-8 pb-10 flex flex-col gap-4 relative z-10">
        {[
          { label: "Nome completo", placeholder: "João da Silva", type: "text",  Icon: User },
          { label: "E-mail",        placeholder: "seu@email.com", type: "email", Icon: Mail },
        ].map(f => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-sm font-semibold">{f.label}</label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-teal-400 transition">
              <f.Icon size={16} className="text-slate-400 flex-shrink-0" />
              <input type={f.type} placeholder={f.placeholder}
                className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
            </div>
          </div>
        ))}
        {["Senha", "Confirmar senha"].map((label, i) => (
          <div key={label} className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-sm font-semibold">{label}</label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-teal-400 transition">
              <Lock size={16} className="text-slate-400 flex-shrink-0" />
              <input type={i === 0 && showPw ? "text" : "password"}
                placeholder={i === 0 ? "Mínimo 6 caracteres" : "Repita a senha"}
                className="flex-1 text-sm placeholder-slate-400 focus:outline-none bg-transparent" />
              {i === 0 && (
                <button onClick={() => setShowPw(v => !v)} className="text-slate-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              )}
            </div>
          </div>
        ))}
        <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
          <input type="checkbox" checked={lgpd} onChange={e => setLgpd(e.target.checked)}
            className="mt-0.5 accent-teal-700 w-4 h-4 flex-shrink-0" />
          <span>Li e aceito a <span className="text-teal-700 font-semibold">Política de Privacidade</span> e o tratamento dos meus dados conforme a <span className="font-semibold">LGPD (Lei nº 13.709/2018)</span>.</span>
        </label>
        <button onClick={() => setScreen("home")}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 mt-1">
          <UserPlus size={18} /> Criar conta
        </button>
        <p className="text-center text-slate-500 text-sm">
          Já tem conta?{" "}
          <button onClick={() => setScreen("login")} className="text-teal-700 font-bold hover:underline">Fazer login</button>
        </p>
      </div>
    </PageWrapper>
  );
}

// ─── HOME ─────────────────────────────────────────────────────────────────────
function HomeScreen({ setScreen }) {
  const [busca, setBusca] = useState("");

  const featured = [
    { name: "Serra Gaúcha",  sub: "Gramado",    img: serra_gaucha },
    { name: "Litoral Gaúcho",sub: "Torres",     img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80" },
    { name: "Missões",       sub: "São Miguel", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80" },
  ];

  const recent = [
    { name: "Serra Gaúcha — 4 dias",  region: "Serra Gaúcha",  date: "10 out. 2025", cost: "R$ 732", img: "https://images.unsplash.com/photo-1566903209804-1b26cc4e44a3?w=200&q=80" },
    { name: "Litoral Gaúcho — 4 dias",region: "Litoral Gaúcho",date: "20 dez. 2025", cost: "R$ 492", img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&q=80" },
  ];

  const quickActions = [
    { label: "Meus roteiros", Icon: Map,     color: "bg-teal-50 text-teal-700",        screen: "history" },
    { label: "Ver custos",    Icon: Wallet,  color: "bg-amber-50 text-amber-700",       screen: "history" },
    { label: "Compartilhar",  Icon: Share2,  color: "bg-blue-50 text-blue-700",         screen: null },
    { label: "Histórico",     Icon: Clock,   color: "bg-emerald-50 text-emerald-700",   screen: "history" },
  ];

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 pt-10 pb-5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-teal-200/70 text-xs">Bom dia,</p>
            <h1 className="text-white text-lg font-bold">Yan Mamede</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center relative">
            <Bell size={18} color="white" strokeWidth={1.8} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-cyan-400 rounded-full border border-teal-800" />
          </button>
        </div>
        <div className="bg-white/10 rounded-2xl flex items-center gap-2.5 px-4 py-2.5">
          <Search size={16} className="text-white/50 flex-shrink-0" />
          <input placeholder="Buscar destino ou atividade..." value={busca}
            onChange={e => setBusca(e.target.value)}
            className="flex-1 text-sm text-white placeholder-white/40 focus:outline-none bg-transparent" />
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="bg-teal-800 rounded-2xl px-5 py-5 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
          <Compass size={40} className="absolute right-5 top-4 text-white/10" />
          <p className="text-teal-200/70 text-xs mb-1">Pronto para explorar?</p>
          <h2 className="text-white font-bold text-base leading-snug mb-3.5">Crie seu roteiro personalizado</h2>
          <button onClick={() => setScreen("planner")}
            className="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition border border-white/20">
            <Plus size={16} /> Planejar viagem
          </button>
        </div>

        <div>
          <p className="text-slate-700 font-semibold text-sm mb-3">Acesso rápido</p>
          <div className="grid grid-cols-2 gap-2.5">
            {quickActions.map(({ label, Icon, color, screen: sc }) => (
              <button key={label} onClick={() => sc && setScreen(sc)}
                className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-3.5 hover:bg-slate-50 transition text-left">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <span className="text-slate-700 text-xs font-semibold leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-slate-700 font-semibold text-sm">Destinos em destaque</p>
            <button className="text-teal-600 text-xs font-semibold flex items-center gap-1">
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
            {featured.map(d => (
              <div key={d.name} className="relative flex-shrink-0 w-36 h-24 rounded-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                <img src={d.img} alt={"Foto de " + d.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-2">
                  <p className="text-white text-xs font-bold">{d.name}</p>
                  <p className="text-white/60 text-[10px] flex items-center gap-0.5"><MapPin size={9} />{d.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-3">
            <p className="text-slate-700 font-semibold text-sm">Roteiros recentes</p>
            <button onClick={() => setScreen("history")} className="text-teal-600 text-xs font-semibold flex items-center gap-1">
              Histórico <ChevronRight size={14} />
            </button>
          </div>
          <div className="flex flex-col gap-2.5">
            {recent.map(r => (
              <button key={r.name} onClick={() => setScreen("itinerary")}
                className="flex gap-3 bg-white border border-slate-100 rounded-2xl p-3 hover:bg-slate-50 transition text-left">
                <img src={r.img} alt={"Foto de " + r.region} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-sm truncate">{r.name}</p>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5"><MapPin size={11} />{r.region}</div>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5"><Calendar size={11} />{r.date}</div>
                </div>
                <span className="text-teal-700 font-bold text-sm self-center">{r.cost}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 1 ───────────────────────────────────────────────────────────
function PlannerStep1({ setScreen, setPlanData }) {
  const [selected, setSelected] = useState(null);

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setScreen("home")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white text-base font-bold">Planejar viagem</h2>
            <p className="text-teal-200/70 text-xs">Escolha a região de destino</p>
          </div>
        </div>
        <StepBar step={1} />
      </div>

      <div className="px-4 py-4 flex flex-col gap-3">
        {REGIONS.map(r => {
          const isSel = selected === r.id;
          return (
            <button key={r.id} onClick={() => setSelected(r.id)}
              className={`flex items-center gap-3 rounded-2xl p-3.5 border transition text-left ${
                isSel ? "bg-teal-50 border-teal-500 ring-1 ring-teal-400" : "bg-white border-slate-200 hover:border-slate-300"
              }`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSel ? "bg-teal-100" : "bg-slate-100"}`}>
                <r.Icon size={20} className={isSel ? "text-teal-700" : "text-slate-500"} strokeWidth={1.8} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm ${isSel ? "text-teal-800" : "text-slate-800"}`}>{r.name}</p>
                <p className="text-slate-400 text-xs truncate">{r.cities}</p>
              </div>
              {isSel && <CheckCircle size={20} className="text-teal-600 flex-shrink-0" />}
            </button>
          );
        })}

        <button disabled={!selected}
          onClick={() => { setPlanData(p => ({ ...p, region: selected })); setScreen("planner2"); }}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition mt-2 ${
            selected ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}>
          Continuar <ChevronRight size={16} />
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 2 ───────────────────────────────────────────────────────────
function PlannerStep2({ setScreen, planData, setPlanData }) {
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const region = REGIONS.find(r => r.id === planData.region);

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setScreen("planner")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white text-base font-bold">Planejar viagem</h2>
            <p className="text-teal-200/70 text-xs">Defina as datas da viagem</p>
          </div>
        </div>
        <StepBar step={2} />
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        {region && (
          <div className="relative rounded-2xl overflow-hidden h-32">
            <img src={region.img} alt={"Paisagem de " + region.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-semibold">
              <MapPin size={14} />{region.name}
            </div>
          </div>
        )}
        {[
          { label: "Data de chegada", val: start, set: setStart },
          { label: "Data de retorno", val: end,   set: setEnd },
        ].map(f => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-sm font-semibold">{f.label}</label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-teal-400 transition">
              <Calendar size={16} className="text-slate-400 flex-shrink-0" />
              <input type="date" value={f.val} onChange={e => f.set(e.target.value)}
                className="flex-1 text-sm text-slate-700 focus:outline-none bg-transparent" />
            </div>
          </div>
        ))}
        <button disabled={!start || !end}
          onClick={() => { setPlanData(p => ({ ...p, start, end })); setScreen("planner3"); }}
          className={`w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition mt-1 ${
            start && end ? "bg-teal-800 text-white hover:bg-teal-900 active:scale-95" : "bg-slate-200 text-slate-400 cursor-not-allowed"
          }`}>
          Continuar <ChevronRight size={16} />
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 3 ───────────────────────────────────────────────────────────
function PlannerStep3({ setScreen }) {
  const [prefs, setPrefs] = useState([]);
  const [budget, setBudget] = useState("moderado");
  const [loading, setLoading] = useState(false);

  const toggle = id => setPrefs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setScreen("itinerary"); }, 2200);
  };

  if (loading) return (
    <PageWrapper noNav>
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-8">
        <div className="w-16 h-16 rounded-2xl bg-teal-800 flex items-center justify-center animate-pulse">
          <Wand2 size={32} color="white" />
        </div>
        <h2 className="text-slate-800 text-xl font-bold text-center">Montando seu roteiro…</h2>
        <p className="text-slate-500 text-sm text-center">Buscando os melhores locais da região</p>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-teal-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 pt-10 pb-6">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setScreen("planner2")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white text-base font-bold">Suas preferências</h2>
            <p className="text-teal-200/70 text-xs">Personalização do roteiro</p>
          </div>
        </div>
        <StepBar step={3} />
      </div>

      <div className="px-4 py-4 flex flex-col gap-5">
        <div>
          <p className="text-slate-700 font-semibold text-sm mb-3">O que você mais curte? <span className="text-slate-400 font-normal">(opcional)</span></p>
          <div className="grid grid-cols-3 gap-2.5">
            {PREFERENCES.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => toggle(id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition ${
                  prefs.includes(id) ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}>
                <Icon size={20} strokeWidth={1.8} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-slate-700 font-semibold text-sm mb-3">Nível de orçamento</p>
          <div className="flex flex-col gap-2">
            {BUDGETS.map(({ id, label, desc, Icon }) => (
              <button key={id} onClick={() => setBudget(id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition text-left ${
                  budget === id ? "bg-teal-800 border-teal-800" : "bg-white border-slate-200 hover:border-slate-300"
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${budget === id ? "bg-white/15" : "bg-slate-100"}`}>
                  <Icon size={18} strokeWidth={1.8} className={budget === id ? "text-white" : "text-slate-500"} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${budget === id ? "text-white" : "text-slate-800"}`}>{label}</p>
                  <p className={`text-xs ${budget === id ? "text-teal-200" : "text-slate-400"}`}>{desc}</p>
                </div>
                {budget === id && <Check size={16} className="text-teal-300 flex-shrink-0" />}
              </button>
            ))}
          </div>
        </div>

        <button onClick={generate}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95">
          <Wand2 size={18} /> Gerar roteiro agora
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── ITINERARY ────────────────────────────────────────────────────────────────
function ItineraryScreen({ setScreen }) {
  const it = SAMPLE_ITINERARY;
  const [viajantes, setViajantes] = useState(1);
  const [orcamento, setOrcamento] = useState("");
  const custNum = 732;
  const acima = orcamento && custNum > Number(orcamento);

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="relative h-52">
        <img src={it.img} alt={"Foto de " + it.region} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => setScreen("home")}
            className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex gap-2">
            <button className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
              <Download size={16} color="white" />
            </button>
            <button className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
              <Share2 size={16} color="white" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center gap-1 text-white/70 text-xs mb-1"><MapPin size={11} />{it.region}</div>
          <h1 className="text-white text-lg font-bold">{it.region} — {it.days} dias</h1>
        </div>
      </div>

      <div className="mx-4 -mt-5 relative z-10 bg-white rounded-2xl border border-slate-100 shadow-md p-4 mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <CreditCard size={11} />{it.budget}
          </span>
          <span className={`font-bold text-lg flex items-center gap-1.5 ${acima ? "text-red-600" : "text-teal-800"}`}>
            <Wallet size={18} />{it.cost}{acima && <AlertTriangle size={15} className="text-red-500" />}
          </span>
        </div>
        {acima && <p className="text-red-500 text-xs bg-red-50 px-3 py-1.5 rounded-lg mb-2 flex items-center gap-1"><AlertTriangle size={12} />Custo acima do orçamento definido</p>}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <Calendar size={12} />{it.period}
        </div>
        <div className="flex items-center gap-2 mb-2 pt-2 border-t border-slate-100">
          <User size={13} className="text-slate-400" />
          <span className="text-slate-600 text-xs flex-1">Viajantes</span>
          <button onClick={() => setViajantes(v => Math.max(1, v - 1))}
            className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center"><Minus size={12} /></button>
          <span className="text-slate-800 font-semibold text-sm w-5 text-center">{viajantes}</span>
          <button onClick={() => setViajantes(v => v + 1)}
            className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center"><Plus size={12} /></button>
          {viajantes > 1 && <span className="text-teal-700 text-xs font-semibold ml-1">≈ R$ {(custNum / viajantes).toFixed(2)}/pessoa</span>}
        </div>
        <div className="flex items-center gap-2">
          <BarChart2 size={13} className="text-slate-400" />
          <span className="text-slate-600 text-xs">Limite:</span>
          <input type="number" placeholder="Ex: 500" value={orcamento} onChange={e => setOrcamento(e.target.value)}
            className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400" />
        </div>
      </div>

      <div className="px-4 pb-8 flex flex-col gap-5">
        {it.schedule.map((day) => (
          <div key={day.day}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center">{day.day}</div>
                <div>
                  <p className="text-slate-800 font-bold text-sm">Dia {day.day}</p>
                  <p className="text-slate-400 text-xs">{day.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-600 text-xs font-semibold flex items-center gap-1"><Wallet size={12} />{day.cost}</span>
                <button className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                  <Route size={11} /> Otimizar
                </button>
                <button className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
                  <Trash2 size={11} /> Limpar
                </button>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              {day.places.map(place => (
                <PlaceCard key={place.name} place={place} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function PlaceCard({ place }) {
  const [done, setDone] = useState(false);
  const [nota, setNota] = useState("");
  const [mostraNota, setMostraNota] = useState(false);

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border ${done ? "border-teal-300 opacity-75" : "border-slate-100"}`}>
      <div className="relative h-36">
        <img src={place.img} alt={"Foto de " + place.name} className="w-full h-full object-cover" />
        <div className="absolute top-2 left-2 bg-black/55 text-white text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
          <Clock size={11} />{place.time}
        </div>
        <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
          <Star size={11} />{place.rating}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-slate-800 font-bold text-sm ${done ? "line-through text-slate-400" : ""}`}>{place.name}</h4>
          <span className="text-slate-400 text-xs ml-2 shrink-0 flex items-center gap-0.5"><MapPin size={10} />{place.city}</span>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed mb-3">{place.desc}</p>
        <div className="flex gap-1.5 mb-3 flex-wrap">
          <Tag Icon={Wallet} color="teal">{place.cost}</Tag>
          <Tag Icon={Clock} color="slate">{place.duration}</Tag>
          {done && <Tag Icon={Check} color="green">Realizado</Tag>}
        </div>
        {mostraNota && (
          <div className="mb-3">
            <textarea value={nota} onChange={e => setNota(e.target.value)}
              placeholder="Ex: Levar casaco, reservar com antecedência..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none" rows={2} />
            <button onClick={() => setMostraNota(false)}
              className="mt-1 text-xs bg-teal-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1">
              <Check size={12} /> Salvar
            </button>
          </div>
        )}
        {nota && !mostraNota && (
          <div className="text-slate-500 text-xs italic mb-3 bg-slate-50 px-3 py-2 rounded-lg flex items-start gap-1.5">
            <NotebookPen size={12} className="flex-shrink-0 mt-0.5" />{nota}
          </div>
        )}
        <div className="flex gap-1.5">
          <button className="flex-1 border border-teal-200 text-teal-700 text-xs font-semibold py-2 rounded-xl hover:bg-teal-50 transition flex items-center justify-center gap-1">
            <Map size={13} /> Maps
          </button>
          <button onClick={() => setDone(v => !v)}
            className={`flex-1 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition ${
              done ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-teal-50"
            }`}>
            {done ? <CheckCircle size={13} /> : <Circle size={13} />}
            {done ? "Realizado" : "Marcar feito"}
          </button>
          <button onClick={() => setMostraNota(v => !v)}
            className="text-xs bg-slate-100 text-slate-500 px-3 py-2 rounded-xl hover:bg-slate-200 transition">
            <NotebookPen size={13} />
          </button>
          <button className="text-xs bg-red-50 text-red-400 px-3 py-2 rounded-xl hover:bg-red-100 transition">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryScreen({ setScreen }) {
  const statCards = [
    { Icon: Map,    val: "4",         label: "Roteiros" },
    { Icon: MapPin, val: "3",         label: "Regiões" },
    { Icon: Wallet, val: "R$ 15.4k",  label: "Total gasto" },
  ];

  return (
    <PageWrapper screen="history" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 pt-10 pb-6">
        <h1 className="text-white text-xl font-bold">Minhas viagens</h1>
        <p className="text-teal-200/70 text-xs mt-0.5">Todos os seus roteiros em um lugar</p>
      </div>

      <div className="px-4 py-4 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-2.5">
          {statCards.map(({ Icon, val, label }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-3 text-center">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center mx-auto mb-2">
                <Icon size={14} className="text-teal-700" strokeWidth={1.8} />
              </div>
              <p className="text-slate-800 font-bold text-sm">{val}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        <h3 className="text-slate-800 font-semibold text-sm">Meus roteiros</h3>
        <div className="flex flex-col gap-3">
          {HISTORY.map(h => (
            <div key={h.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
              <div className="relative h-20 bg-teal-800 flex items-center justify-center overflow-hidden">
                <h.Icon size={52} className="text-white/10" strokeWidth={1} />
                <img src={h.img} alt={"Foto de " + h.region}
                  className="absolute inset-0 w-full h-full object-cover opacity-60" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                  <div>
                    <p className="text-white/60 text-[10px] flex items-center gap-1"><MapPin size={9} />{h.region}</p>
                    <p className="text-white text-sm font-bold">{h.region} — {h.days} dias</p>
                  </div>
                  <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">{h.cost}</span>
                </div>
              </div>
              <div className="px-3 py-2.5 flex items-center gap-2">
                <div className="flex items-center gap-1 text-slate-400 text-xs"><Calendar size={11} />{h.date}</div>
                <div className="ml-auto flex gap-1.5">
                  <button className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center">
                    <Copy size={13} />
                  </button>
                  <button className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center">
                    <Trash2 size={13} />
                  </button>
                  <button onClick={() => setScreen("itinerary")}
                    className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-3 h-7 rounded-lg flex items-center gap-1">
                    <Eye size={13} /> Ver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── PROFILE ──────────────────────────────────────────────────────────────────
function ProfileScreen({ setScreen }) {
  const menuSections = [
    { title: "CONTA", items: [
      { Icon: User,       label: "Dados pessoais",         desc: "Nome, e-mail e senha" },
      { Icon: Bell,       label: "Notificações",           desc: "Alertas e novidades" },
    ]},
    { title: "PREFERÊNCIAS", items: [
      { Icon: MapPin,     label: "Regiões favoritas",      desc: "Seus destinos preferidos" },
      { Icon: Star,       label: "Avaliações",             desc: "Locais que você visitou" },
    ]},
    { title: "SUPORTE", items: [
      { Icon: Shield,     label: "Privacidade e segurança",desc: "" },
      { Icon: HelpCircle, label: "Ajuda e suporte",        desc: "" },
      { Icon: LogOut,     label: "Sair da conta",          desc: "", danger: true, action: () => setScreen("login") },
    ]},
  ];

  const statCards = [
    { Icon: Map,    val: "4",        label: "Roteiros" },
    { Icon: MapPin, val: "3",        label: "Regiões" },
    { Icon: Wallet, val: "R$ 15.5k", label: "Estimado" },
  ];

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            YM
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold">Yan Mamede</p>
            <div className="flex items-center gap-1 text-teal-200/70 text-xs"><Mail size={11} />yan@gmail.com</div>
          </div>
          <button className="w-8 h-8 rounded-xl bg-white/15 flex items-center justify-center">
            <Settings size={16} color="white" strokeWidth={1.8} />
          </button>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2.5">
          {statCards.map(({ Icon, val, label }) => (
            <div key={label} className="bg-white border border-slate-100 rounded-2xl p-3 text-center">
              <div className="w-7 h-7 rounded-lg bg-teal-50 flex items-center justify-center mx-auto mb-2">
                <Icon size={14} className="text-teal-700" strokeWidth={1.8} />
              </div>
              <p className="text-slate-800 font-bold text-sm">{val}</p>
              <p className="text-slate-400 text-xs">{label}</p>
            </div>
          ))}
        </div>

        {menuSections.map(section => (
          <div key={section.title}>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase mb-2">{section.title}</p>
            <div className="flex flex-col gap-1.5">
              {section.items.map(({ Icon, label, desc, danger, action }) => (
                <button key={label} onClick={action}
                  className="flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-3 hover:bg-slate-50 transition w-full text-left">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${danger ? "bg-red-50" : "bg-slate-100"}`}>
                    <Icon size={16} strokeWidth={1.8} className={danger ? "text-red-500" : "text-slate-500"} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm font-semibold ${danger ? "text-red-500" : "text-slate-800"}`}>{label}</p>
                    {desc && <p className="text-xs text-slate-400">{desc}</p>}
                  </div>
                  {!danger && <ChevronRight size={15} className="text-slate-300" />}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [planData, setPlanData] = useState({});

  const screens = {
    login:    <LoginScreen    setScreen={setScreen} />,
    register: <RegisterScreen setScreen={setScreen} />,
    home:     <HomeScreen     setScreen={setScreen} />,
    planner:  <PlannerStep1   setScreen={setScreen} setPlanData={setPlanData} />,
    planner2: <PlannerStep2   setScreen={setScreen} planData={planData} setPlanData={setPlanData} />,
    planner3: <PlannerStep3   setScreen={setScreen} setPlanData={setPlanData} />,
    itinerary:<ItineraryScreen setScreen={setScreen} />,
    history:  <HistoryScreen  setScreen={setScreen} />,
    profile:  <ProfileScreen  setScreen={setScreen} />,
  };

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #CBD5E1; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      {screens[screen] || screens.login}
    </div>
  );
}