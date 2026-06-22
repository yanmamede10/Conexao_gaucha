import { useState, useEffect, useRef } from "react";
import {
  MapPin, Search, Bell, Home, Map, PlusCircle, Clock, User,
  LogIn, UserPlus, Lock, Mail, Eye, EyeOff, ArrowLeft, ChevronRight,
  Wallet, Calendar, Star, Route, Trash2, Share2, Download, Copy,
  CheckCircle, Circle, NotebookPen, Check, Minus, Plus, Navigation,
  PiggyBank, CreditCard, Gem, Wand2, MountainSnow, Waves, Landmark,
  TreePine, Compass, History, Settings, Shield,
  HelpCircle, LogOut, BarChart2, Plane, MessageSquare,
  AlertTriangle, RefreshCw, Filter, X, ExternalLink, Route as RouteIcon
} from "lucide-react";
import serra_gaucha from "./assets/serra_gaucha.jpg";
import vale_dos_vinhedos from "./assets/vale_dos_vinhedos.jpeg";
import { api } from "./api";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const IMG_FALLBACK = {
  "serra-gaucha":    serra_gaucha,
  "litoral-gaucho":  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
  "missoes":         "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=400&q=80",
  "campanha-gaucha": "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=400&q=80",
  "porto-alegre":    "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&q=80",
  "serra-nordeste":  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80",
  "vale-vinhedos":   vale_dos_vinhedos,
};
const getImg = (r) => r?.imagem_url || IMG_FALLBACK[r?.slug] || IMG_FALLBACK["serra-gaucha"];
const REGION_ICONS = {
  "serra-gaucha": MountainSnow, "litoral-gaucho": Waves, "missoes": Landmark,
  "campanha-gaucha": Navigation, "porto-alegre": MapPin,
  "serra-nordeste": MountainSnow, "vale-vinhedos": TreePine,
};
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
  { id: "premium",   label: "Premium",   desc: "As melhores experiências sem limites",  Icon: Gem },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: "home",    label: "Início",    Icon: Home },
  { id: "planner", label: "Planejar",  Icon: PlusCircle },
  { id: "history", label: "Histórico", Icon: Clock },
  { id: "profile", label: "Perfil",    Icon: User },
];

function NavBar({ active, setScreen }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 flex z-40 lg:hidden">
      {NAV_ITEMS.map(({ id, label, Icon }) => (
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

function SideNav({ active, setScreen }) {
  return (
    <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 bg-teal-800 min-h-screen px-4 py-6 sticky top-0 self-start">
      <div className="flex items-center gap-2.5 px-2 mb-8">
        <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <MapPin size={18} color="white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Conexão</p>
          <p className="text-teal-300 text-xs leading-tight">Gaúcha</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button key={id} onClick={() => setScreen(id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors text-left ${
              active === id ? "bg-white/15 text-white" : "text-teal-200 hover:bg-white/5 hover:text-white"
            }`}>
            <Icon size={18} strokeWidth={active === id ? 2.3 : 1.8} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}

function PageWrapper({ children, noNav, screen, setScreen }) {
  if (noNav) {
    // Auth screens: centered card on desktop, full-bleed on mobile
    return (
      <div className="min-h-screen bg-slate-200 flex items-center justify-center lg:py-10">
        <div className="relative w-full max-w-sm lg:max-w-md min-h-screen lg:min-h-0 lg:rounded-3xl bg-slate-50 flex flex-col lg:shadow-2xl overflow-hidden">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-slate-200 flex justify-center">
      <div className="flex w-full max-w-7xl bg-slate-50 lg:shadow-2xl lg:my-0">
        <SideNav active={screen} setScreen={setScreen} />
        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex-1 overflow-y-auto pb-20 lg:pb-0 w-full max-w-sm mx-auto lg:max-w-none lg:mx-0">
            {children}
          </div>
        </div>
        <NavBar active={screen} setScreen={setScreen} />
      </div>
    </div>
  );
}

function Tag({ Icon, children, color = "teal" }) {
  const colors = {
    teal:  "bg-teal-50 text-teal-700",
    slate: "bg-slate-100 text-slate-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red:   "bg-red-50 text-red-600",
  };
  return (
    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium ${colors[color]}`}>
      {Icon && <Icon size={11} />}{children}
    </span>
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

function Toast({ msg, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, []);
  const colors = { success: "bg-teal-800 text-white", error: "bg-red-600 text-white", info: "bg-slate-800 text-white" };
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold flex items-center gap-2 max-w-xs ${colors[type]}`}>
      {type === "success" ? <CheckCircle size={16} /> : type === "error" ? <AlertTriangle size={16} /> : <Bell size={16} />}
      {msg}
      <button onClick={onClose} className="ml-1 opacity-70 hover:opacity-100"><X size={14} /></button>
    </div>
  );
}

function useToast() {
  const [toast, setToast] = useState(null);
  const show = (msg, type = "success") => setToast({ msg, type });
  const hide = () => setToast(null);
  const el = toast ? <Toast msg={toast.msg} type={toast.type} onClose={hide} /> : null;
  return { show, el };
}

// ─── MODAL COMPARTILHAR ───────────────────────────────────────────────────────
function ShareModal({ roteiro, token, onClose }) {
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(true);
  const { show, el: toastEl } = useToast();

  useEffect(() => {
    api.compartilharRoteiro(token, roteiro.id)
      .then(res => { if (res.link) setLink(res.link); })
      .finally(() => setLoading(false));
  }, []);

  const copiar = () => {
    navigator.clipboard.writeText(link).then(() => show("Link copiado!"));
  };

  const whatsapp = () => {
    const texto = encodeURIComponent(`Confira meu roteiro "${roteiro.titulo}" no Conexão Gaúcha: ${link}`);
    window.open(`https://wa.me/?text=${texto}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center bg-black/40" onClick={onClose}>
      {toastEl}
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-slate-800 font-bold text-base">Compartilhar roteiro</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm text-center py-4">Gerando link…</p>
        ) : (
          <>
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 flex items-center gap-2 mb-4">
              <span className="flex-1 text-xs text-slate-600 truncate">{link}</span>
              <button onClick={copiar} className="w-8 h-8 rounded-lg bg-teal-800 text-white flex items-center justify-center flex-shrink-0">
                <Copy size={14} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5">
              <button onClick={copiar}
                className="w-full flex items-center gap-3 bg-slate-100 hover:bg-slate-200 py-3 px-4 rounded-2xl transition">
                <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Copy size={18} className="text-slate-600" />
                </div>
                <span className="text-slate-700 font-semibold text-sm">Copiar link</span>
              </button>

              <button onClick={whatsapp}
                className="w-full flex items-center gap-3 bg-green-50 hover:bg-green-100 py-3 px-4 rounded-2xl transition">
                <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <span className="text-green-800 font-semibold text-sm">Compartilhar no WhatsApp</span>
                <ExternalLink size={14} className="text-green-600 ml-auto" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── MODAL VOOS ───────────────────────────────────────────────────────────────
function VoosModal({ roteiro, token, onClose }) {
  const [origem, setOrigem] = useState("São Paulo");
  const [voos, setVoos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [vooSalvo, setVooSalvo] = useState(null);
  const { show, el: toastEl } = useToast();

  const buscar = async () => {
    setErro(""); setLoading(true);
    const res = await api.getVoos(token, roteiro.id, {
      origem,
      data_ida: roteiro.data_inicio,
      data_volta: roteiro.data_fim,
    });
    setLoading(false);
    if (res.error) return setErro(res.error);
    if (!res.voos || res.voos.length === 0) return setErro("Nenhum voo encontrado para esse trecho.");
    setVoos(res.voos);
  };

  const escolher = async (voo) => {
    const res = await api.escolherVoo(token, roteiro.id, {
      origem,
      destino: "Porto Alegre",
      data_ida: roteiro.data_inicio,
      data_volta: roteiro.data_fim,
      companhia: voo.companhia || voo.airline,
      preco: voo.preco || voo.price,
      moeda: "BRL",
      link_externo: voo.link || "",
      payload_json: voo,
    });
    if (res.error) return show(res.error, "error");
    setVooSalvo(res.voo);
    show("Voo salvo no roteiro!");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center bg-black/40" onClick={onClose}>
      {toastEl}
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-5 pb-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-bold text-base flex items-center gap-2"><Plane size={18} className="text-teal-700" />Buscar voos</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="flex gap-2 mb-3">
          <div className="flex-1 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5">
            <MapPin size={14} className="text-slate-400" />
            <input value={origem} onChange={e => setOrigem(e.target.value)}
              placeholder="Cidade de origem"
              className="flex-1 text-sm text-slate-700 focus:outline-none bg-transparent" />
          </div>
          <button onClick={buscar} disabled={loading}
            className="bg-teal-800 text-white px-4 rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center gap-1.5">
            {loading ? <RefreshCw size={14} className="animate-spin" /> : <Search size={14} />}
            Buscar
          </button>
        </div>

        <div className="flex items-center gap-2 mb-4 text-xs text-slate-400">
          <Calendar size={12} />{roteiro.data_inicio} → {roteiro.data_fim}
          <span className="ml-1">· Destino: Porto Alegre</span>
        </div>

        {erro && <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-xl mb-3 flex items-center gap-1"><AlertTriangle size={13} />{erro}</p>}

        {vooSalvo && (
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-3 flex items-center gap-2">
            <CheckCircle size={16} className="text-teal-600" />
            <div>
              <p className="text-teal-800 text-xs font-semibold">Voo salvo: {vooSalvo.companhia}</p>
              <p className="text-teal-600 text-xs">R$ {Number(vooSalvo.preco).toFixed(2)}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {voos.map((v, i) => (
            <div key={i} className="bg-white border border-slate-200 rounded-2xl p-3.5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-slate-800 font-bold text-sm">{v.companhia || v.airline || "Companhia"}</p>
                  <p className="text-slate-400 text-xs">{origem} → Porto Alegre</p>
                </div>
                <span className="text-teal-700 font-bold text-base">R$ {Number(v.preco || v.price || 0).toFixed(2)}</span>
              </div>
              <button onClick={() => escolher(v)}
                className="w-full bg-teal-800 text-white text-xs font-semibold py-2 rounded-xl hover:bg-teal-900 transition mt-1">
                Selecionar este voo
              </button>
            </div>
          ))}
        </div>

        {voos.length === 0 && !erro && !loading && (
          <p className="text-slate-400 text-sm text-center py-6">Digite a origem e clique em Buscar.</p>
        )}
      </div>
    </div>
  );
}

// ─── MODAL KM PERCORRIDOS ─────────────────────────────────────────────────────
function KmModal({ roteiro, token, onClose }) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getKmRoteiro(token, roteiro.id)
      .then(res => setDados(res))
      .catch(() => setDados({ km: 0, message: "Erro ao calcular." }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="fixed inset-0 z-[150] flex items-end lg:items-center justify-center bg-black/40 lg:p-6" onClick={onClose}>
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-6 pb-8" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-slate-800 font-bold text-base flex items-center gap-2"><RouteIcon size={18} className="text-teal-700" />Distância do roteiro</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        {loading ? (
          <p className="text-slate-400 text-sm text-center py-6">Calculando rota…</p>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-teal-50 rounded-2xl p-4 text-center">
                <p className="text-teal-800 text-2xl font-bold">{dados?.km ? Number(dados.km).toFixed(1) : "–"}</p>
                <p className="text-teal-600 text-xs font-semibold">km totais</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-center">
                <p className="text-slate-800 text-2xl font-bold">
                  {dados?.duracao_minutos ? Math.round(dados.duracao_minutos / 60) + "h" : "–"}
                </p>
                <p className="text-slate-500 text-xs font-semibold">tempo de deslocamento</p>
              </div>
            </div>
            {dados?.message && (
              <p className="text-slate-400 text-xs text-center bg-slate-50 px-3 py-2 rounded-xl">{dados.message}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ setScreen, onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [lembrar, setLembrar] = useState(true);
  const [erro, setErro] = useState("");
  const [loading, setLoading] = useState(false);
  const [recuperando, setRecuperando] = useState(false);
  const [msgRecupera, setMsgRecupera] = useState("");

  const handleLogin = async () => {
    setErro("");
    if (!email.trim()) return setErro("Informe o e-mail.");
    if (!email.includes("@")) return setErro("E-mail inválido.");
    if (!pw) return setErro("Informe a senha.");
    setLoading(true);
    const res = await api.login(email, pw);
    setLoading(false);
    if (res.error) return setErro(res.error);
    onLogin(res.token, res.usuario, lembrar);
    setScreen("home");
  };

  const handleRecuperar = async () => {
    if (!email.trim()) return setErro("Digite seu e-mail para recuperar a senha.");
    setRecuperando(true);
    const res = await api.recuperarSenha(email);
    setRecuperando(false);
    setMsgRecupera(res.message || "Se o e-mail estiver cadastrado, você receberá um link.");
  };

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
        {erro && (
          <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl text-center">
            <AlertTriangle size={15} />{erro}
          </div>
        )}
        {msgRecupera && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-sm px-4 py-2.5 rounded-xl">
            <CheckCircle size={15} />{msgRecupera}
          </div>
        )}
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
            <button onClick={handleRecuperar} disabled={recuperando}
              className="text-teal-600 text-xs font-medium hover:underline">
              {recuperando ? "Enviando…" : "Esqueci a senha"}
            </button>
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
        {/* CT-014: Manter logado */}
        <label className="flex items-center gap-2 cursor-pointer text-sm text-slate-600">
          <input type="checkbox" checked={lembrar} onChange={e => setLembrar(e.target.checked)}
            className="accent-teal-700 w-4 h-4" />
          <span>Lembrar-me</span>
        </label>
        <button onClick={handleLogin} disabled={loading}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-60 mt-1">
          <LogIn size={18} />{loading ? "Entrando…" : "Entrar"}
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

// ─── CADASTRO ─────────────────────────────────────────────────────────────────
function RegisterScreen({ setScreen, onLogin }) {
  const [showPw, setShowPw] = useState(false);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [lgpd, setLgpd] = useState(false);
  const [erros, setErros] = useState({});
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    const e = {};
    if (!nome.trim()) e.nome = "Informe o nome completo.";
    if (!email.trim()) e.email = "Informe o e-mail.";
    else if (!email.includes("@")) e.email = "Insira um endereço de e-mail válido.";
    if (!pw) e.pw = "Este campo é obrigatório.";
    else if (pw.length < 6) e.pw = "A senha deve ter no mínimo 6 caracteres.";
    if (pw && pwConfirm && pw !== pwConfirm) e.pwConfirm = "As senhas não coincidem.";
    if (!lgpd) e.lgpd = "Aceite a Política de Privacidade para continuar.";
    if (Object.keys(e).length) return setErros(e);
    setErros({});
    setLoading(true);
    const res = await api.register(nome, email, pw);
    setLoading(false);
    if (res.error) return setErros({ geral: res.error });
    onLogin(res.token, res.usuario, true);
    setScreen("home");
  };

  const fc = (k) => `flex items-center gap-2 bg-white border rounded-xl px-3.5 py-3 focus-within:ring-2 transition ${erros[k] ? "border-red-400 focus-within:ring-red-300 bg-red-50/30" : "border-slate-200 focus-within:ring-teal-400"}`;

  return (
    <PageWrapper noNav>
      <div className="bg-teal-800 px-6 pt-14 pb-12 relative overflow-hidden">
        <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-white/5" />
        <button onClick={() => setScreen("login")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center mb-5">
          <ArrowLeft size={18} color="white" />
        </button>
        <h1 className="text-white text-3xl font-bold leading-tight">Criar sua conta</h1>
        <p className="text-teal-200/80 text-sm mt-1">Comece a planejar aventuras gaúchas</p>
      </div>
      <div className="bg-slate-50 rounded-t-3xl -mt-5 px-6 pt-8 pb-10 flex flex-col gap-4 relative z-10">
        {erros.geral && (
          <div className="flex items-center justify-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
            <AlertTriangle size={15} />{erros.geral}
          </div>
        )}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Nome completo</label>
          <div className={fc("nome")}>
            <User size={16} className="text-slate-400 flex-shrink-0" />
            <input type="text" placeholder="João da Silva" value={nome}
              onChange={e => { setNome(e.target.value); setErros(p => ({...p, nome: ""})); }}
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
          </div>
          {erros.nome && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><AlertTriangle size={11} />{erros.nome}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">E-mail</label>
          <div className={fc("email")}>
            <Mail size={16} className="text-slate-400 flex-shrink-0" />
            <input type="text" placeholder="seu@email.com" value={email}
              onChange={e => { setEmail(e.target.value); setErros(p => ({...p, email: ""})); }}
              className="flex-1 text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent" />
          </div>
          {erros.email && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><AlertTriangle size={11} />{erros.email}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Senha</label>
          <div className={fc("pw")}>
            <Lock size={16} className="text-slate-400 flex-shrink-0" />
            <input type={showPw ? "text" : "password"} placeholder="Mínimo 6 caracteres" value={pw}
              onChange={e => { setPw(e.target.value); setErros(p => ({...p, pw: ""})); }}
              className="flex-1 text-sm placeholder-slate-400 focus:outline-none bg-transparent" />
            <button onClick={() => setShowPw(v => !v)} className="text-slate-400">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {erros.pw && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><AlertTriangle size={11} />{erros.pw}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Confirmar senha</label>
          <div className={fc("pwConfirm")}>
            <Lock size={16} className="text-slate-400 flex-shrink-0" />
            <input type="password" placeholder="Repita a senha" value={pwConfirm}
              onChange={e => { setPwConfirm(e.target.value); setErros(p => ({...p, pwConfirm: ""})); }}
              className="flex-1 text-sm placeholder-slate-400 focus:outline-none bg-transparent" />
          </div>
          {erros.pwConfirm && <p className="text-red-500 text-xs flex items-center gap-1 mt-0.5"><AlertTriangle size={11} />{erros.pwConfirm}</p>}
        </div>
        <div>
          <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
            <input type="checkbox" checked={lgpd} onChange={e => { setLgpd(e.target.checked); setErros(p => ({...p, lgpd: ""})); }}
              className="mt-0.5 accent-teal-700 w-4 h-4 flex-shrink-0" />
            <span>Li e aceito a <span className="text-teal-700 font-semibold">Política de Privacidade</span> e o tratamento dos meus dados conforme a <span className="font-semibold">LGPD</span>.</span>
          </label>
          {erros.lgpd && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertTriangle size={11} />{erros.lgpd}</p>}
        </div>
        <button onClick={handleRegister} disabled={loading}
          className="w-full bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-60 mt-1">
          <UserPlus size={18} />{loading ? "Criando conta…" : "Criar conta"}
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
function HomeScreen({ setScreen, usuario, token, setRoteiroAtivo }) {
  const [roteiros, setRoteiros] = useState([]);
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const debounceRef = useRef(null);
  const primeiroNome = usuario?.nome_completo?.split(" ")[0] || "Viajante";

  useEffect(() => {
    api.getRoteiros(token).then(data => { if (Array.isArray(data)) setRoteiros(data.slice(0, 6)); });
  }, [token]);

  // CT-099: Busca por palavra-chave
  useEffect(() => {
    clearTimeout(debounceRef.current);
    if (!busca.trim()) { setResultados([]); return; }
    debounceRef.current = setTimeout(async () => {
      setBuscando(true);
      const res = await api.buscarLocais(token, busca);
      setBuscando(false);
      if (Array.isArray(res)) setResultados(res);
    }, 400);
  }, [busca]);

  const quickActions = [
    { label: "Meus roteiros", Icon: Map,     color: "bg-teal-50 text-teal-700",       screen: "history" },
    { label: "Ver custos",    Icon: Wallet,  color: "bg-amber-50 text-amber-700",      screen: "history" },
    { label: "Histórico",     Icon: History, color: "bg-emerald-50 text-emerald-700",  screen: "history" },
  ];

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-5 lg:pb-6">
        <div className="flex justify-between items-center mb-4 max-w-3xl">
          <div>
            <p className="text-teal-200/70 text-xs lg:text-sm">Bom dia,</p>
            <h1 className="text-white text-lg lg:text-2xl font-bold">{primeiroNome}</h1>
          </div>
          <button className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center" onClick={() => setScreen("notificacoes")}>
            <Bell size={18} color="white" strokeWidth={1.8} />
          </button>
        </div>
        <div className="bg-white/10 rounded-2xl flex items-center gap-2.5 px-4 py-2.5 relative max-w-3xl lg:max-w-xl">
          <Search size={16} className="text-white/50 flex-shrink-0" />
          <input placeholder="Buscar destino ou atividade..." value={busca}
            onChange={e => setBusca(e.target.value)}
            className="flex-1 text-sm text-white placeholder-white/40 focus:outline-none bg-transparent" />
          {busca && <button onClick={() => setBusca("")} className="text-white/50"><X size={14} /></button>}
        </div>
      </div>

      {/* Resultados de busca */}
      {(busca.trim() || buscando) && (
        <div className="px-4 lg:px-10 pt-3 pb-1 max-w-3xl">
          {buscando && <p className="text-slate-400 text-sm text-center py-3">Buscando…</p>}
          {!buscando && resultados.length === 0 && busca.trim() && (
            <p className="text-slate-400 text-sm text-center py-3">Nenhum resultado para "{busca}"</p>
          )}
          <div className="lg:grid lg:grid-cols-2 lg:gap-2">
            {resultados.map(l => (
              <div key={l.id} className="flex gap-3 bg-white border border-slate-100 rounded-2xl p-3 mb-2">
                <div className="w-12 h-12 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                  <MapPin size={18} className="text-teal-700" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 font-semibold text-sm truncate">{l.nome}</p>
                  <p className="text-slate-400 text-xs">{l.cidade} · {l.categoria}</p>
                </div>
                {l.avaliacao && <span className="text-amber-600 text-xs font-bold flex items-center gap-0.5"><Star size={11} />{l.avaliacao}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 lg:px-10 py-4 lg:py-6 flex flex-col gap-4 lg:gap-6 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6">
        <div className="bg-teal-800 rounded-2xl px-5 py-5 lg:px-7 lg:py-7 relative overflow-hidden lg:col-span-2">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5" />
          <Compass size={40} className="absolute right-5 top-4 text-white/10" />
          <p className="text-teal-200/70 text-xs mb-1">Pronto para explorar?</p>
          <h2 className="text-white font-bold text-base lg:text-xl leading-snug mb-3.5">Crie seu roteiro personalizado</h2>
          <button onClick={() => setScreen("planner")}
            className="bg-white/15 hover:bg-white/25 text-white font-semibold text-sm px-4 py-2 rounded-xl flex items-center gap-1.5 transition border border-white/20">
            <Plus size={16} /> Planejar viagem
          </button>
        </div>

        <div className="lg:row-span-2">
          <p className="text-slate-700 font-semibold text-sm mb-3">Acesso rápido</p>
          <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
            {quickActions.map(({ label, Icon, color, screen: sc }) => (
              <button key={label} onClick={() => sc && setScreen(sc)}
                className="flex flex-col lg:flex-row items-center gap-2 lg:gap-3 bg-white border border-slate-100 rounded-2xl p-3 hover:bg-slate-50 transition lg:text-left">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={18} strokeWidth={1.8} />
                </div>
                <span className="text-slate-700 text-xs font-semibold leading-tight text-center lg:text-left">{label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-3">
            <p className="text-slate-700 font-semibold text-sm">Roteiros recentes</p>
            <button onClick={() => setScreen("history")} className="text-teal-600 text-xs font-semibold flex items-center gap-1">
              Ver todos <ChevronRight size={14} />
            </button>
          </div>
          {roteiros.length === 0
            ? <p className="text-slate-400 text-sm text-center py-6 bg-white rounded-2xl border border-slate-100">Nenhum roteiro criado ainda.</p>
            : <div className="flex flex-col gap-2.5 lg:grid lg:grid-cols-2 lg:gap-3">
                {roteiros.map(r => (
                  <button key={r.id} onClick={() => { setRoteiroAtivo(r); setScreen("itinerary"); }}
                    className="flex gap-3 bg-white border border-slate-100 rounded-2xl p-3 hover:bg-slate-50 transition text-left">
                    <img src={IMG_FALLBACK[r.regiao_slug] || IMG_FALLBACK["serra-gaucha"]}
                      alt={"Foto de " + (r.regiao_nome || "região")}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-800 font-semibold text-sm truncate">{r.titulo}</p>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5"><MapPin size={11} />{r.regiao_nome}</div>
                      <div className="flex items-center gap-1 text-slate-400 text-xs mt-0.5"><Calendar size={11} />{r.data_inicio}</div>
                    </div>
                    <span className="text-teal-700 font-bold text-sm whitespace-nowrap self-center">
                      R$ {Number(r.custo_total).toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>}
        </div>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 1 ───────────────────────────────────────────────────────────
function PlannerStep1({ setScreen, setPlanData, token }) {
  const [selected, setSelected] = useState(null);
  const [regioes, setRegioes] = useState([]);

  useEffect(() => {
    api.getRegioes(token).then(data => { if (Array.isArray(data)) setRegioes(data); });
  }, [token]);

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 lg:pb-8">
        <div className="flex items-center gap-3 mb-5 max-w-2xl">
          <button onClick={() => setScreen("home")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white text-base lg:text-xl font-bold">Planejar viagem</h2>
            <p className="text-teal-200/70 text-xs lg:text-sm">Escolha a região de destino</p>
          </div>
        </div>
        <div className="max-w-2xl">
          <StepBar step={1} />
        </div>
      </div>

      <div className="px-4 lg:px-10 py-4 lg:py-8 flex flex-col gap-3 lg:max-w-4xl">
        <div className="lg:grid lg:grid-cols-2 lg:gap-3 flex flex-col gap-3">
          {regioes.length === 0
            ? <p className="text-slate-400 text-sm text-center py-10 lg:col-span-2">Carregando regiões…</p>
            : regioes.map(r => {
                const RegIcon = REGION_ICONS[r.slug] || MapPin;
                const isSel = selected?.id === r.id;
                return (
                  <button key={r.id} onClick={() => setSelected(r)}
                    className={`flex items-center gap-3 rounded-2xl p-3.5 border transition text-left ${
                      isSel ? "bg-teal-50 border-teal-500 ring-1 ring-teal-400" : "bg-white border-slate-200 hover:border-slate-300"
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isSel ? "bg-teal-100" : "bg-slate-100"}`}>
                      <RegIcon size={20} className={isSel ? "text-teal-700" : "text-slate-500"} strokeWidth={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${isSel ? "text-teal-800" : "text-slate-800"}`}>{r.nome}</p>
                      <p className="text-slate-400 text-xs truncate">{r.descricao}</p>
                    </div>
                    {isSel && <CheckCircle size={20} className="text-teal-600 flex-shrink-0" />}
                  </button>
                );
              })}
        </div>

        <button disabled={!selected}
          onClick={() => { setPlanData({ regiao: selected }); setScreen("planner2"); }}
          className={`w-full lg:max-w-xs py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition mt-2 ${
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
  const [erro, setErro] = useState("");
  const region = planData.regiao;
  const hoje = new Date().toISOString().split("T")[0];

  const continuar = () => {
    setErro("");
    if (!start) return setErro("Selecione a data de chegada.");
    if (!end) return setErro("Selecione a data de retorno.");
    if (end <= start) return setErro("A data de retorno deve ser posterior à data de chegada.");
    setPlanData(p => ({ ...p, start, end }));
    setScreen("planner3");
  };

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 lg:pb-8">
        <div className="flex items-center gap-3 mb-5 max-w-2xl">
          <button onClick={() => setScreen("planner")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white text-base lg:text-xl font-bold">Planejar viagem</h2>
            <p className="text-teal-200/70 text-xs lg:text-sm">Defina as datas da viagem</p>
          </div>
        </div>
        <div className="max-w-2xl"><StepBar step={2} /></div>
      </div>

      <div className="px-4 lg:px-10 py-4 lg:py-8 flex flex-col gap-4 lg:max-w-2xl">
        {region && (
          <div className="relative rounded-2xl overflow-hidden h-32">
            <img src={getImg(region)} alt={"Paisagem de " + region.nome} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white text-sm font-semibold">
              <MapPin size={14} />{region.nome}
            </div>
          </div>
        )}

        {erro && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
            <AlertTriangle size={15} />{erro}
          </div>
        )}

        {[
          { label: "Data de chegada", val: start, set: setStart, min: hoje },
          { label: "Data de retorno", val: end, set: setEnd, min: start || hoje },
        ].map(f => (
          <div key={f.label} className="flex flex-col gap-1.5">
            <label className="text-slate-700 text-sm font-semibold">{f.label}</label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3.5 py-3 focus-within:ring-2 focus-within:ring-teal-400 transition">
              <Calendar size={16} className="text-slate-400 flex-shrink-0" />
              <input type="date" value={f.val} min={f.min} onChange={e => f.set(e.target.value)}
                className="flex-1 text-sm text-slate-700 focus:outline-none bg-transparent" />
            </div>
          </div>
        ))}

        <button onClick={continuar}
          className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition mt-1 bg-teal-800 text-white hover:bg-teal-900 active:scale-95">
          Continuar <ChevronRight size={16} />
        </button>
      </div>
    </PageWrapper>
  );
}

// ─── PLANNER STEP 3 ───────────────────────────────────────────────────────────
function PlannerStep3({ setScreen, planData, setPlanData, token, setRoteiroAtivo }) {
  const [prefs, setPrefs] = useState([]);
  const [budget, setBudget] = useState("moderado");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");
  const toggle = id => setPrefs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const generate = async () => {
    setErro(""); setLoading(true);
    const res = await api.criarRoteiro(token, {
      regiao_id: planData.regiao.id,
      data_inicio: planData.start,
      data_fim: planData.end,
      nivel_orcamento: budget,
      preferencias: prefs,
    });
    setLoading(false);
    if (res.error) return setErro(res.error);
    setRoteiroAtivo(res.roteiro);
    setScreen("itinerary");
  };

  if (loading) return (
    <PageWrapper noNav>
      <div className="flex flex-col items-center justify-center min-h-screen gap-5 px-8">
        <div className="w-16 h-16 rounded-2xl bg-teal-800 flex items-center justify-center animate-pulse">
          <Wand2 size={32} color="white" />
        </div>
        <h2 className="text-slate-800 text-xl font-bold text-center">Montando seu roteiro…</h2>
        <p className="text-slate-500 text-sm text-center">Buscando os melhores locais da região para você</p>
        <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div className="h-full bg-teal-600 rounded-full animate-pulse w-3/4" />
        </div>
      </div>
    </PageWrapper>
  );

  return (
    <PageWrapper screen="planner" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 lg:pb-8">
        <div className="flex items-center gap-3 mb-5 max-w-2xl">
          <button onClick={() => setScreen("planner2")}
            className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div>
            <h2 className="text-white text-base lg:text-xl font-bold">Suas preferências</h2>
            <p className="text-teal-200/70 text-xs lg:text-sm">Personalização do roteiro</p>
          </div>
        </div>
        <div className="max-w-2xl"><StepBar step={3} /></div>
      </div>

      <div className="px-4 lg:px-10 py-4 lg:py-8 flex flex-col gap-5 lg:max-w-3xl">
        {erro && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
            <AlertTriangle size={15} />{erro}
          </div>
        )}

        <div>
          <p className="text-slate-700 font-semibold text-sm mb-3">O que você mais curte? <span className="text-slate-400 font-normal">(opcional)</span></p>
          <div className="grid grid-cols-3 lg:grid-cols-6 gap-2.5">
            {PREFERENCES.map(({ id, label, Icon }) => (
              <button key={id} onClick={() => toggle(id)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition ${
                  prefs.includes(id) ? "border-teal-500 bg-teal-50 text-teal-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                }`}>
                <Icon size={20} strokeWidth={1.8} />{label}
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
// ─── MODAL RESUMO FINANCEIRO ─────────────────────────────────────────────────
function ResumoFinanceiroModal({ roteiro, token, onClose }) {
  const [dados, setDados] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/roteiros/${roteiro.id}/resumo-financeiro`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json()).then(d => { setDados(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const cores = ['bg-teal-500', 'bg-blue-500', 'bg-amber-500', 'bg-emerald-500', 'bg-purple-500', 'bg-rose-500'];

  return (
    <div className="fixed inset-0 z-[150] flex items-end lg:items-center justify-center bg-black/40 lg:p-6" onClick={onClose}>
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-5 pb-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
            <BarChart2 size={18} className="text-teal-700" />Resumo Financeiro
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        {loading && <p className="text-slate-400 text-sm text-center py-8">Calculando…</p>}

        {dados && !loading && (
          <div className="flex flex-col gap-4">
            <div className="bg-teal-800 rounded-2xl p-4 text-center">
              <p className="text-teal-200 text-xs mb-1">Custo total estimado</p>
              <p className="text-white text-3xl font-bold">R$ {Number(dados.custo_total).toFixed(2)}</p>
              <p className="text-teal-300 text-xs mt-1">{dados.data_inicio} → {dados.data_fim}</p>
            </div>

            <div>
              <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide mb-2">Por dia</p>
              <div className="flex flex-col gap-1.5">
                {(dados.por_dia || []).map(d => (
                  <div key={d.numero_dia} className="flex items-center gap-3 bg-slate-50 rounded-xl px-3 py-2.5">
                    <div className="w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{d.numero_dia}</div>
                    <div className="flex-1">
                      <p className="text-slate-700 text-xs font-semibold">{d.data}</p>
                      <p className="text-slate-400 text-xs">{d.itens.length} atividade{d.itens.length !== 1 ? 's' : ''}</p>
                    </div>
                    <span className="text-teal-700 font-bold text-sm">R$ {d.custo_dia.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(dados.por_categoria || {}).length > 0 && (
              <div>
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wide mb-2">Por categoria</p>
                <div className="flex flex-col gap-1.5">
                  {Object.entries(dados.por_categoria).sort((a,b) => b[1] - a[1]).map(([cat, val], i) => {
                    const pct = dados.custo_total > 0 ? (val / dados.custo_total * 100).toFixed(0) : 0;
                    return (
                      <div key={cat} className="flex flex-col gap-1">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-700 text-xs font-medium">{cat}</span>
                          <span className="text-slate-600 text-xs">R$ {val.toFixed(2)} ({pct}%)</span>
                        </div>
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full ${cores[i % cores.length]} rounded-full`} style={{width: `${pct}%`}} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL MAPA DO DIA ───────────────────────────────────────────────────────
function MapaDiaModal({ dia, onClose }) {
  const itens = dia.itens || [];
  const markers = itens
    .filter(i => i.latitude && i.longitude)
    .map(i => `${i.latitude},${i.longitude}`)
    .join("|");

  const query = itens.map(i => i.local_nome || i.nome_manual).filter(Boolean).join(" + ") || dia.data;
  const src = markers
    ? `https://www.google.com/maps/embed/v1/directions?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&origin=${itens[0]?.local_nome || "Porto Alegre"}&destination=${itens[itens.length-1]?.local_nome || "Porto Alegre"}&waypoints=${markers}&mode=driving`
    : `https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=${encodeURIComponent(query + " Rio Grande do Sul")}`;

  // Fallback: open in new tab if embed fails
  const openExternal = () => {
    const q = itens.map(i => i.local_nome || i.nome_manual).filter(Boolean).join("/");
    window.open(`https://maps.google.com/?q=${encodeURIComponent(q || query)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 z-[150] flex flex-col lg:items-center lg:justify-center bg-black/70 lg:p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-sm lg:max-w-lg mx-auto mt-auto lg:mt-0 rounded-t-3xl lg:rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center px-5 py-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <MapPin size={16} className="text-teal-700" />Rota do Dia {dia.numero_dia} — {dia.data}
          </h3>
          <div className="flex gap-2">
            <button onClick={openExternal} title="Abrir no Google Maps"
              className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
              <ExternalLink size={15} />
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={15} /></button>
          </div>
        </div>
        <div className="bg-slate-100 flex flex-col px-4 py-3 gap-2 max-h-48 overflow-y-auto">
          {itens.length === 0
            ? <p className="text-slate-400 text-sm text-center py-4">Nenhum item neste dia ainda.</p>
            : itens.map((item, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <div className="w-5 h-5 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i+1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800 text-xs font-semibold truncate">{item.local_nome || item.nome_manual}</p>
                  <p className="text-slate-400 text-xs">{item.horario}</p>
                </div>
              </div>
            ))
          }
        </div>
        <div className="relative bg-slate-200" style={{height: "280px"}}>
          <iframe
            title={`Mapa do Dia ${dia.numero_dia}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(itens.map(i => i.local_nome || i.nome_manual).filter(Boolean).join(", ") || "Rio Grande do Sul")}&output=embed&z=10`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <div className="px-4 py-3">
          <button onClick={openExternal}
            className="w-full bg-teal-800 text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-900 transition">
            <ExternalLink size={15} /> Abrir rota completa no Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL TRANSPORTE ─────────────────────────────────────────────────────────
function TransporteModal({ roteiro, token, onClose, toast }) {
  const [tipo, setTipo] = useState("aviao");
  const [showVoos, setShowVoos] = useState(false);

  const tipos = [
    { id: "aviao",   label: "Avião",    Icon: Plane,       desc: "Buscar passagens aéreas" },
    { id: "carro",   label: "Carro",    Icon: Navigation,  desc: "Calcular combustível e pedágios" },
    { id: "onibus",  label: "Ônibus",   Icon: Route,       desc: "Linhas interestaduais" },
  ];

  const [origem, setOrigem] = useState("");
  const [combustivel, setCombustivel] = useState({ consumo: "10", preco: "5.80" });
  const [distanciaKm, setDistanciaKm] = useState("");
  const [custoEstimado, setCustoEstimado] = useState(null);

  const calcularCarro = () => {
    const km = parseFloat(distanciaKm);
    const consumo = parseFloat(combustivel.consumo);
    const preco = parseFloat(combustivel.preco);
    if (!km || !consumo || !preco) return toast("Preencha todos os campos.", "error");
    const litros = km / consumo;
    const custo = litros * preco;
    setCustoEstimado(custo.toFixed(2));
  };

  if (showVoos) return <VoosModal roteiro={roteiro} token={token} onClose={() => setShowVoos(false)} />;

  return (
    <div className="fixed inset-0 z-[150] flex items-end lg:items-center justify-center bg-black/40 lg:p-6" onClick={onClose}>
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-5 pb-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
            <Plane size={18} className="text-teal-700" />Transporte
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="flex gap-2 mb-4">
          {tipos.map(t => (
            <button key={t.id} onClick={() => setTipo(t.id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition border ${
                tipo === t.id ? "bg-teal-800 text-white border-teal-800" : "bg-white text-slate-600 border-slate-200"
              }`}>
              <t.Icon size={18} strokeWidth={1.8} />
              {t.label}
            </button>
          ))}
        </div>

        {tipo === "aviao" && (
          <div>
            <p className="text-slate-500 text-xs mb-3">{tipos[0].desc}</p>
            <button onClick={() => setShowVoos(true)}
              className="w-full bg-teal-800 text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-teal-900 transition">
              <Search size={15} /> Buscar passagens aéreas
            </button>
          </div>
        )}

        {tipo === "carro" && (
          <div className="flex flex-col gap-3">
            <p className="text-slate-500 text-xs">Calcule o custo estimado de combustível para sua viagem.</p>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-600 text-xs font-semibold">Distância total (km)</label>
              <input type="number" placeholder="Ex: 350" value={distanciaKm} onChange={e => setDistanciaKm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-xs font-semibold">Consumo (km/l)</label>
                <input type="number" value={combustivel.consumo} onChange={e => setCombustivel(p => ({...p, consumo: e.target.value}))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-slate-600 text-xs font-semibold">Preço do litro (R$)</label>
                <input type="number" value={combustivel.preco} onChange={e => setCombustivel(p => ({...p, preco: e.target.value}))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
              </div>
            </div>
            <button onClick={calcularCarro} className="w-full bg-teal-800 text-white text-sm font-bold py-3 rounded-2xl hover:bg-teal-900 transition">
              Calcular custo
            </button>
            {custoEstimado && (
              <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 text-center">
                <p className="text-teal-600 text-xs mb-1">Custo estimado de combustível</p>
                <p className="text-teal-800 text-2xl font-bold">R$ {custoEstimado}</p>
                <p className="text-teal-500 text-xs mt-1">ida e volta: R$ {(parseFloat(custoEstimado)*2).toFixed(2)}</p>
              </div>
            )}
          </div>
        )}

        {tipo === "onibus" && (
          <div className="flex flex-col gap-3">
            <p className="text-slate-500 text-xs mb-2">Consulte rotas de ônibus para a região.</p>
            <button onClick={() => window.open(`https://www.buscaonibus.com.br/busca?destino=${encodeURIComponent(roteiro.regiao_nome || "Rio Grande do Sul")}`, "_blank")}
              className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 hover:bg-slate-100 transition">
              <div className="w-9 h-9 rounded-xl bg-teal-800 flex items-center justify-center flex-shrink-0">
                <Route size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-slate-800 font-semibold text-sm">BuscaÔnibus</p>
                <p className="text-slate-400 text-xs">Buscar passagens para {roteiro.regiao_nome}</p>
              </div>
              <ExternalLink size={14} className="text-slate-400 ml-auto" />
            </button>
            <button onClick={() => window.open("https://www.clickbus.com.br/", "_blank")}
              className="w-full flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 hover:bg-slate-100 transition">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Route size={18} className="text-white" />
              </div>
              <div className="text-left">
                <p className="text-slate-800 font-semibold text-sm">Clickbus</p>
                <p className="text-slate-400 text-xs">Comparar preços de passagens</p>
              </div>
              <ExternalLink size={14} className="text-slate-400 ml-auto" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── MODAL HOSPEDAGEM ─────────────────────────────────────────────────────────
function HospedagemModal({ roteiro, onClose }) {
  const noites = roteiro.dias ? Math.max(roteiro.dias.length - 1, 1) : 1;
  const [tipo, setTipo] = useState("hotel");
  const [preco, setPreco] = useState("");
  const [hospedes, setHospedes] = useState(1);
  const total = preco ? (parseFloat(preco) * noites).toFixed(2) : null;
  const porPessoa = total && hospedes > 1 ? (parseFloat(total) / hospedes).toFixed(2) : null;

  const tipos = [
    { id: "hotel",    label: "Hotel",    emoji: "🏨" },
    { id: "pousada",  label: "Pousada",  emoji: "🏡" },
    { id: "hostel",   label: "Hostel",   emoji: "🛏️" },
    { id: "airbnb",   label: "Airbnb",   emoji: "🔑" },
  ];

  return (
    <div className="fixed inset-0 z-[150] flex items-end lg:items-center justify-center bg-black/40 lg:p-6" onClick={onClose}>
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-5 pb-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
            <Landmark size={18} className="text-teal-700" />Hospedagem
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="bg-teal-50 rounded-2xl px-4 py-3 mb-4 flex items-center justify-between">
          <span className="text-teal-700 text-xs font-semibold flex items-center gap-1"><Calendar size={13} />{noites} noite{noites > 1 ? "s" : ""}</span>
          <span className="text-teal-600 text-xs">{roteiro.data_inicio} → {roteiro.data_fim}</span>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4">
          {tipos.map(t => (
            <button key={t.id} onClick={() => setTipo(t.id)}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold transition border ${
                tipo === t.id ? "bg-teal-800 text-white border-teal-800" : "bg-white text-slate-600 border-slate-200"
              }`}>
              <span className="text-base">{t.emoji}</span>{t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-600 text-xs font-semibold">Valor por noite (R$)</label>
            <input type="number" placeholder="Ex: 150" value={preco} onChange={e => setPreco(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-slate-600 text-xs font-semibold">Número de hóspedes</label>
            <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <button onClick={() => setHospedes(v => Math.max(1, v - 1))} className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><Minus size={12} /></button>
              <span className="flex-1 text-center text-sm font-semibold text-slate-800">{hospedes}</span>
              <button onClick={() => setHospedes(v => v + 1)} className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center"><Plus size={12} /></button>
            </div>
          </div>

          {total && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-teal-600 text-xs">Total ({noites} noites)</span>
                <span className="text-teal-800 font-bold text-lg">R$ {total}</span>
              </div>
              {porPessoa && (
                <div className="flex justify-between items-center">
                  <span className="text-teal-600 text-xs">Por pessoa</span>
                  <span className="text-teal-700 font-semibold text-sm">R$ {porPessoa}</span>
                </div>
              )}
            </div>
          )}

          <button onClick={() => window.open(`https://www.booking.com/search.html?ss=${encodeURIComponent(roteiro.regiao_nome || "Rio Grande do Sul")}&checkin=${roteiro.data_inicio}&checkout=${roteiro.data_fim}`, "_blank")}
            className="w-full bg-blue-600 text-white text-sm font-bold py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition mt-1">
            <ExternalLink size={15} /> Buscar no Booking.com
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MODAL ALTERAR DESTINO ────────────────────────────────────────────────────
function AlterarDestinoModal({ roteiro, token, onClose, toast, onAtualizar }) {
  const [regioes, setRegioes] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/regioes", { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (Array.isArray(d)) setRegioes(d); });
  }, []);

  const confirmar = async () => {
    if (!selected) return;
    setLoading(true);
    const res = await fetch(`/api/roteiros/${roteiro.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ regiao_id: selected.id }),
    }).then(r => r.json());
    setLoading(false);
    if (res.error) return toast(res.error, "error");
    toast("Destino alterado!");
    onAtualizar();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end lg:items-center justify-center bg-black/40 lg:p-6" onClick={onClose}>
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-5 pb-8 max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
            <MapPin size={18} className="text-teal-700" />Alterar destino
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <p className="text-slate-400 text-xs mb-4">Destino atual: <span className="text-slate-700 font-semibold">{roteiro.regiao_nome}</span></p>
        <div className="flex flex-col gap-2 mb-4">
          {regioes.filter(r => r.id !== roteiro.regiao_id).map(r => {
            const RegIcon = REGION_ICONS[r.slug] || MapPin;
            return (
              <button key={r.id} onClick={() => setSelected(r)}
                className={`flex items-center gap-3 rounded-2xl p-3.5 border transition text-left ${
                  selected?.id === r.id ? "bg-teal-50 border-teal-500" : "bg-white border-slate-200 hover:border-slate-300"
                }`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${selected?.id === r.id ? "bg-teal-100" : "bg-slate-100"}`}>
                  <RegIcon size={18} className={selected?.id === r.id ? "text-teal-700" : "text-slate-500"} strokeWidth={1.8} />
                </div>
                <div className="flex-1">
                  <p className={`font-semibold text-sm ${selected?.id === r.id ? "text-teal-800" : "text-slate-800"}`}>{r.nome}</p>
                  <p className="text-slate-400 text-xs truncate">{r.descricao}</p>
                </div>
                {selected?.id === r.id && <CheckCircle size={18} className="text-teal-600 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        <button onClick={confirmar} disabled={!selected || loading}
          className="w-full bg-teal-800 text-white text-sm font-bold py-3.5 rounded-2xl disabled:opacity-40 hover:bg-teal-900 transition flex items-center justify-center gap-2">
          {loading ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />}
          Confirmar destino
        </button>
      </div>
    </div>
  );
}

function ItineraryScreen({ setScreen, roteiro: roteiroInicial, token }) {
  const [roteiro, setRoteiro] = useState(roteiroInicial);
  const [viajantes, setViajantes] = useState(1);
  const [orcamento, setOrcamento] = useState("");
  const [showShare, setShowShare] = useState(false);
  const [showTransporte, setShowTransporte] = useState(false);
  const [showKm, setShowKm] = useState(false);
  const [showHospedagem, setShowHospedagem] = useState(false);
  const [showAlterarDestino, setShowAlterarDestino] = useState(false);
  const [showResumo, setShowResumo] = useState(false);
  const [mapaDia, setMapaDia] = useState(null);
  const { show, el: toastEl } = useToast();

  useEffect(() => {
    if (roteiroInicial?.id) {
      api.getRoteiro(token, roteiroInicial.id).then(res => {
        if (res && !res.error) setRoteiro(res);
      });
    }
  }, [roteiroInicial?.id, token]);

  if (!roteiro) return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-slate-400 text-sm">Nenhum roteiro selecionado.</p>
      </div>
    </PageWrapper>
  );

  const custoTotal = Number(roteiro.custo_total);
  const custoPorPessoa = viajantes > 0 ? (custoTotal / viajantes).toFixed(2) : null;
  const acima = orcamento && custoTotal > Number(orcamento);
  const imgHero = IMG_FALLBACK[roteiro.regiao_slug] || IMG_FALLBACK["serra-gaucha"];

  const exportar = async () => {
    const res = await api.exportarRoteiro(token, roteiro.id);
    if (!res.ok) { show("Erro ao exportar.", "error"); return; }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `roteiro-${roteiro.id}.pdf`; a.click();
    URL.revokeObjectURL(url);
    show("Roteiro exportado!");
  };

  const recarregar = async () => {
    const res = await api.getRoteiro(token, roteiro.id);
    if (!res.error) setRoteiro(res);
  };

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      {toastEl}
      {showShare       && <ShareModal roteiro={roteiro} token={token} onClose={() => setShowShare(false)} />}
      {showTransporte  && <TransporteModal roteiro={roteiro} token={token} onClose={() => setShowTransporte(false)} toast={show} />}
      {showKm          && <KmModal roteiro={roteiro} token={token} onClose={() => setShowKm(false)} />}
      {showHospedagem  && <HospedagemModal roteiro={roteiro} onClose={() => setShowHospedagem(false)} />}
      {showAlterarDestino && <AlterarDestinoModal roteiro={roteiro} token={token} onClose={() => setShowAlterarDestino(false)} toast={show} onAtualizar={recarregar} />}
      {mapaDia         && <MapaDiaModal dia={mapaDia} onClose={() => setMapaDia(null)} />}
      {showResumo      && <ResumoFinanceiroModal roteiro={roteiro} token={token} onClose={() => setShowResumo(false)} />}

      <div className="lg:flex lg:gap-6 lg:px-10 lg:pt-6 lg:items-start">
      <div className="lg:w-[380px] lg:flex-shrink-0 lg:sticky lg:top-6">
      <div className="relative h-52 lg:rounded-2xl lg:overflow-hidden">
        <img src={imgHero} alt={"Foto de " + roteiro.regiao_nome} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <button onClick={() => setScreen("home")} className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
            <ArrowLeft size={18} color="white" />
          </button>
          <div className="flex gap-2">
            <button onClick={() => setShowTransporte(true)} title="Transporte" className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
              <Plane size={16} color="white" />
            </button>
            <button onClick={() => setShowKm(true)} title="Distância" className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
              <RouteIcon size={16} color="white" />
            </button>
            <button onClick={exportar} title="Exportar" className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
              <Download size={16} color="white" />
            </button>
            <button onClick={() => setShowShare(true)} title="Compartilhar" className="w-9 h-9 rounded-xl bg-black/35 flex items-center justify-center">
              <Share2 size={16} color="white" />
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-1 text-white/70 text-xs mb-1"><MapPin size={11} />{roteiro.regiao_nome}</div>
          <div className="flex items-center justify-between">
            <h1 className="text-white text-lg font-bold">{roteiro.titulo}</h1>
            <button onClick={() => setShowAlterarDestino(true)}
              className="text-white/70 text-xs bg-black/30 px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-black/50 transition">
              <MapPin size={11} /> Alterar destino
            </button>
          </div>
        </div>
      </div>

      <div className="mx-4 lg:mx-0 -mt-5 lg:mt-4 relative z-10 bg-white rounded-2xl border border-slate-100 shadow-md p-4 mb-3 lg:mb-0">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex items-center gap-1">
            <CreditCard size={11} />{roteiro.nivel_orcamento}
          </span>
          <span className={`font-bold text-lg flex items-center gap-1.5 ${acima ? "text-red-600" : "text-teal-800"}`}>
            <Wallet size={18} /> R$ {custoTotal.toFixed(2)}
            {acima && <AlertTriangle size={15} className="text-red-500" />}
          </span>
        </div>
        {acima && (
          <p className="text-red-500 text-xs bg-red-50 px-3 py-1.5 rounded-lg mb-2 flex items-center gap-1">
            <AlertTriangle size={12} />Custo acima do orçamento definido
          </p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
          <Calendar size={12} /> {roteiro.data_inicio} → {roteiro.data_fim}
        </div>

        <div className="flex items-center gap-2 mb-2 pt-2 border-t border-slate-100">
          <User size={13} className="text-slate-400" />
          <span className="text-slate-600 text-xs flex-1">Viajantes</span>
          <button onClick={() => setViajantes(v => Math.max(1, v - 1))} className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center"><Minus size={12} /></button>
          <span className="text-slate-800 font-semibold text-sm w-5 text-center">{viajantes}</span>
          <button onClick={() => setViajantes(v => v + 1)} className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center"><Plus size={12} /></button>
          {custoPorPessoa && <span className="text-teal-700 text-xs font-semibold ml-1">≈ R$ {custoPorPessoa}/pessoa</span>}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <BarChart2 size={13} className="text-slate-400" />
          <span className="text-slate-600 text-xs">Meu orçamento:</span>
          <input type="number" placeholder="Ex: 500" value={orcamento} onChange={e => setOrcamento(e.target.value)}
            className="w-24 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-teal-400" />
          <span className="text-slate-400 text-xs">BRL</span>
        </div>

        <div className="flex gap-2 pt-2 border-t border-slate-100">
          <button onClick={() => setShowResumo(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-xl hover:bg-slate-100 transition">
            <BarChart2 size={13} /> Resumo
          </button>
          <button onClick={() => setShowHospedagem(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-xl hover:bg-slate-100 transition">
            <Landmark size={13} /> Hotel
          </button>
          <button onClick={() => setShowTransporte(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-xl hover:bg-slate-100 transition">
            <Plane size={13} /> Transporte
          </button>
          <button onClick={() => setShowKm(true)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 border border-slate-200 text-slate-600 text-xs font-semibold py-2 rounded-xl hover:bg-slate-100 transition">
            <RouteIcon size={13} /> Distância
          </button>
        </div>
      </div>

      </div>

      <div className="px-4 lg:px-0 pb-8 lg:pb-10 flex flex-col gap-5 lg:flex-1 lg:min-w-0">
        {(roteiro.dias || []).map(dia => (
          <DiaSection key={dia.id} dia={dia} token={token} onRecarregar={recarregar} toast={show} onVerMapa={() => setMapaDia(dia)} />
        ))}
      </div>
      </div>
    </PageWrapper>
  );
}

// ─── MODAL ADICIONAR ITEM ────────────────────────────────────────────────────
function AddItemModal({ dia, token, onClose, onRecarregar, toast }) {
  const [busca, setBusca] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [horario, setHorario] = useState("09:00");
  const [modo, setModo] = useState("busca");
  const [nomeManual, setNomeManual] = useState("");
  const [custoManual, setCustoManual] = useState("");
  const debRef = useRef(null);

  useEffect(() => {
    clearTimeout(debRef.current);
    if (!busca.trim()) { setResultados([]); return; }
    debRef.current = setTimeout(async () => {
      setBuscando(true);
      const res = await fetch(`/api/roteiros/locais/buscar?q=${encodeURIComponent(busca)}`, {
        headers: { Authorization: `Bearer ${token}` }
      }).then(r => r.json());
      setBuscando(false);
      if (Array.isArray(res)) setResultados(res);
    }, 400);
  }, [busca]);

  const adicionar = async (local_id, nome) => {
    const res = await fetch(`/api/roteiros/dias/${dia.id}/itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ local_id, horario }),
    }).then(r => r.json());
    if (res.error) return toast(res.error, "error");
    toast(`"${nome}" adicionado!`);
    onRecarregar(); onClose();
  };

  const adicionarManual = async () => {
    if (!nomeManual.trim()) return toast("Informe o nome da atividade.", "error");
    const res = await fetch(`/api/roteiros/dias/${dia.id}/itens`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ nome_manual: nomeManual, horario }),
    }).then(r => r.json());
    if (res.error) return toast(res.error, "error");
    toast(`"${nomeManual}" adicionado!`);
    onRecarregar(); onClose();
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-end lg:items-center justify-center bg-black/40 lg:p-6" onClick={onClose}>
      <div className="bg-white rounded-t-3xl lg:rounded-3xl w-full max-w-sm lg:max-w-lg p-5 pb-8 max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-slate-800 font-bold text-base flex items-center gap-2">
            <Plus size={18} className="text-teal-700" />Adicionar ao Dia {dia.numero_dia}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center"><X size={16} /></button>
        </div>
        <div className="flex gap-2 mb-4">
          <button onClick={() => setModo("busca")} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${modo === "busca" ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"}`}>
            Buscar local
          </button>
          <button onClick={() => setModo("manual")} className={`flex-1 py-2 rounded-xl text-sm font-semibold transition ${modo === "manual" ? "bg-teal-800 text-white" : "bg-slate-100 text-slate-600"}`}>
            Manual
          </button>
        </div>
        <div className="mb-3">
          <label className="text-slate-600 text-xs font-semibold mb-1 block">Horário</label>
          <input type="time" value={horario} onChange={e => setHorario(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
        </div>
        {modo === "busca" ? (
          <>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 mb-3">
              <Search size={14} className="text-slate-400 flex-shrink-0" />
              <input placeholder="Nome, categoria..." value={busca} onChange={e => setBusca(e.target.value)}
                className="flex-1 text-sm text-slate-700 focus:outline-none bg-transparent" />
              {busca && <button onClick={() => setBusca("")} className="text-slate-400"><X size={13} /></button>}
            </div>
            {buscando && <p className="text-slate-400 text-sm text-center py-3">Buscando…</p>}
            {!buscando && busca && resultados.length === 0 && <p className="text-slate-400 text-sm text-center py-3">Nenhum resultado.</p>}
            <div className="flex flex-col gap-2">
              {resultados.map(l => (
                <button key={l.id} onClick={() => adicionar(l.id, l.nome)}
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-3 hover:border-teal-400 hover:bg-teal-50 transition text-left">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <MapPin size={16} className="text-teal-700" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-semibold text-sm truncate">{l.nome}</p>
                    <p className="text-slate-400 text-xs">{l.cidade} · {l.categoria}</p>
                  </div>
                  {l.custo_medio > 0 && <span className="text-teal-700 text-xs font-semibold flex-shrink-0">R$ {Number(l.custo_medio).toFixed(0)}</span>}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-600 text-xs font-semibold">Nome da atividade</label>
              <input type="text" placeholder="Ex: Almoço no restaurante X" value={nomeManual} onChange={e => setNomeManual(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-slate-600 text-xs font-semibold">Custo estimado (R$) <span className="text-slate-400 font-normal">opcional</span></label>
              <input type="number" placeholder="Ex: 50" value={custoManual} onChange={e => setCustoManual(e.target.value)}
                onKeyDown={e => e.key === "Enter" && adicionarManual()}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-teal-400" />
            </div>
            <button onClick={adicionarManual} className="w-full bg-teal-800 text-white text-sm font-bold py-3 rounded-2xl hover:bg-teal-900 transition">
              Adicionar atividade
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function DiaSection({ dia, token, onRecarregar, toast, onVerMapa }) {
  const [showAdd, setShowAdd] = useState(false);

  const custoCalculado = (dia.itens || []).reduce((s, i) => s + Number(i.custo_medio || 0), 0);

  const otimizar = async () => {
    const res = await fetch(`/api/roteiros/dias/${dia.id}/otimizar`, {
      method: "POST", headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    if (res.error) return toast(res.error, "error");
    toast("Rota otimizada!"); onRecarregar();
  };

  const limpar = async () => {
    if (!window.confirm("Limpar todos os itens deste dia?")) return;
    const res = await fetch(`/api/roteiros/dias/${dia.id}/itens`, {
      method: "DELETE", headers: { Authorization: `Bearer ${token}` }
    }).then(r => r.json());
    if (res.error) return toast(res.error, "error");
    toast("Dia limpo."); onRecarregar();
  };

  return (
    <div>
      {showAdd && <AddItemModal dia={dia} token={token} onClose={() => setShowAdd(false)} onRecarregar={onRecarregar} toast={toast} />}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-bold flex items-center justify-center">{dia.numero_dia}</div>
          <div>
            <p className="text-slate-800 font-bold text-sm">Dia {dia.numero_dia}</p>
            <p className="text-slate-400 text-xs">{dia.data}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <span className="text-slate-600 text-xs font-semibold flex items-center gap-1">
            <Wallet size={12} /> R$ {custoCalculado.toFixed(2)}
          </span>
          <button onClick={onVerMapa} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
            <Map size={11} /> Ver rota
          </button>
          <button onClick={() => setShowAdd(true)} className="text-xs bg-teal-800 text-white px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1 shadow-sm hover:bg-teal-900 transition">
            <Plus size={12} /> Adicionar atividade
          </button>
          <button onClick={otimizar} className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
            <Route size={11} /> Otimizar
          </button>
          <button onClick={limpar} className="text-xs bg-red-50 text-red-500 px-2 py-1 rounded-lg font-medium flex items-center gap-1">
            <Trash2 size={11} /> Limpar
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {(dia.itens || []).map((item, idx) => (
          <ItemCard key={item.id || idx} item={item} token={token} onRecarregar={onRecarregar} toast={toast}
            diaId={dia.id} totalItens={(dia.itens || []).length} idx={idx} />
        ))}
        {(dia.itens || []).length === 0 && (
          <button onClick={() => setShowAdd(true)}
            className="w-full border-2 border-dashed border-slate-200 rounded-2xl py-6 text-slate-400 text-sm flex flex-col items-center gap-1.5 hover:border-teal-300 hover:text-teal-600 transition">
            <Plus size={20} />Adicionar atividade ao Dia {dia.numero_dia}
          </button>
        )}
      </div>
    </div>
  );
}

function ItemCard({ item, token, onRecarregar, toast, diaId, totalItens, idx }) {
  const [nota, setNota] = useState(item.nota || "");
  const [mostraNota, setMostraNota] = useState(false);
  const [concluido, setConcluido] = useState(!!item.concluido);
  const [salvando, setSalvando] = useState(false);
  const [editandoCusto, setEditandoCusto] = useState(false);
  const [custoEdit, setCustoEdit] = useState(Number(item.custo_medio || 0).toFixed(2));

  const call = (path, opts = {}) =>
    fetch(path, { headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, ...opts }).then(r => r.json());

  const toggleConcluido = async () => {
    const novo = !concluido;
    setConcluido(novo);
    await call(`/api/roteiros/itens/${item.id}`, { method: "PUT", body: JSON.stringify({ concluido: novo }) });
  };

  const salvarNota = async () => {
    setSalvando(true);
    const res = await call(`/api/roteiros/itens/${item.id}`, { method: "PUT", body: JSON.stringify({ nota }) });
    setSalvando(false);
    if (res.error) return toast(res.error, "error");
    toast("Nota salva!"); setMostraNota(false);
  };

  const salvarCusto = async () => {
    const res = await call(`/api/roteiros/itens/${item.id}`, { method: "PUT", body: JSON.stringify({ custo_medio: parseFloat(custoEdit) || 0 }) });
    if (res.error) return toast(res.error, "error");
    toast("Custo atualizado!"); setEditandoCusto(false); onRecarregar();
  };

  const remover = async () => {
    const res = await call(`/api/roteiros/itens/${item.id}`, { method: "DELETE" });
    if (res.error) return toast(res.error, "error");
    toast("Item removido."); onRecarregar();
  };

  const mover = async (direcao) => {
    const novaOrdem = direcao === "up" ? idx - 1 : idx + 1;
    await call(`/api/roteiros/itens/${item.id}`, { method: "PUT", body: JSON.stringify({ ordem: novaOrdem }) });
    onRecarregar();
  };

  return (
    <div className={`bg-white rounded-2xl overflow-hidden border ${concluido ? "border-teal-300 opacity-75" : "border-slate-100"}`}>
      {item.imagem_url && (
        <div className="relative h-36">
          <img src={item.imagem_url} alt={"Foto de " + (item.local_nome || "local")} className="w-full h-full object-cover" />
          <div className="absolute top-2 left-2 bg-black/55 text-white text-xs px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
            <Clock size={11} />{item.horario}
          </div>
          {item.avaliacao && (
            <div className="absolute top-2 right-2 bg-amber-400 text-amber-900 text-xs px-2.5 py-1 rounded-lg font-bold flex items-center gap-1">
              <Star size={11} />{item.avaliacao}
            </div>
          )}
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-1 gap-1">
          <h4 className={`text-slate-800 font-bold text-sm flex-1 ${concluido ? "line-through text-slate-400" : ""}`}>
            {item.local_nome || item.nome_manual || "Atividade"}
          </h4>
          <div className="flex gap-1 flex-shrink-0">
            {idx > 0 && (
              <button onClick={() => mover("up")} title="Mover para cima"
                className="w-5 h-5 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs hover:bg-slate-200">▲</button>
            )}
            {totalItens > 1 && idx < totalItens - 1 && (
              <button onClick={() => mover("down")} title="Mover para baixo"
                className="w-5 h-5 rounded bg-slate-100 text-slate-500 flex items-center justify-center text-xs hover:bg-slate-200">▼</button>
            )}
          </div>
          {item.cidade && <span className="text-slate-400 text-xs flex-shrink-0 flex items-center gap-0.5"><MapPin size={10} />{item.cidade}</span>}
        </div>
        {item.descricao && <p className="text-slate-500 text-xs leading-relaxed mb-3">{item.descricao}</p>}

        <div className="flex gap-1.5 mb-3 flex-wrap items-center">
          {editandoCusto ? (
            <div className="flex items-center gap-1.5">
              <span className="text-teal-700 text-xs font-semibold">R$</span>
              <input type="number" value={custoEdit} onChange={e => setCustoEdit(e.target.value)}
                onKeyDown={e => e.key === "Enter" && salvarCusto()}
                className="w-20 bg-teal-50 border border-teal-300 rounded-lg px-2 py-0.5 text-xs text-teal-800 focus:outline-none" autoFocus />
              <button onClick={salvarCusto} className="w-5 h-5 bg-teal-700 text-white rounded flex items-center justify-center"><Check size={11} /></button>
              <button onClick={() => setEditandoCusto(false)} className="w-5 h-5 bg-slate-200 text-slate-600 rounded flex items-center justify-center"><X size={11} /></button>
            </div>
          ) : (
            <button onClick={() => setEditandoCusto(true)} title="Clique para editar o custo"
              className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-teal-50 text-teal-700 hover:bg-teal-100 transition">
              <Wallet size={11} />R$ {Number(item.custo_medio || custoEdit || 0).toFixed(2)} <span className="text-teal-500 text-[10px]">✎</span>
            </button>
          )}
          {item.duracao_estimada && <Tag Icon={Clock} color="slate">{item.duracao_estimada}</Tag>}
          {concluido && <Tag Icon={Check} color="green">Realizado</Tag>}
        </div>

        {mostraNota && (
          <div className="mb-3">
            <textarea value={nota} onChange={e => setNota(e.target.value)}
              placeholder="Ex: Levar casaco, reservar com antecedência..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none" rows={2} />
            <button onClick={salvarNota} disabled={salvando}
              className="mt-1 text-xs bg-teal-700 text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 disabled:opacity-60">
              <Check size={12} />{salvando ? "Salvando…" : "Salvar"}
            </button>
          </div>
        )}
        {nota && !mostraNota && (
          <div className="text-slate-500 text-xs italic mb-3 bg-slate-50 px-3 py-2 rounded-lg flex items-start gap-1.5">
            <NotebookPen size={12} className="flex-shrink-0 mt-0.5" />{nota}
          </div>
        )}

        <div className="flex gap-1.5">
          <button onClick={toggleConcluido}
            className={`flex-1 text-xs font-semibold py-2 rounded-xl flex items-center justify-center gap-1 transition ${
              concluido ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600 hover:bg-teal-50"
            }`}>
            {concluido ? <CheckCircle size={13} /> : <Circle size={13} />}
            {concluido ? "Realizado" : "Marcar feito"}
          </button>
          <button onClick={() => setMostraNota(v => !v)}
            className="text-xs bg-slate-100 text-slate-500 px-3 py-2 rounded-xl hover:bg-slate-200 transition">
            <NotebookPen size={13} />
          </button>
          <button onClick={remover}
            className="text-xs bg-red-50 text-red-400 px-3 py-2 rounded-xl hover:bg-red-100 transition">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function HistoryScreen({ setScreen, token, setRoteiroAtivo }) {
  const [roteiros, setRoteiros] = useState([]);
  const [todos, setTodos] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [stats, setStats] = useState({ total: 0, regioes: 0, gasto: 0 });
  const { show, el: toastEl } = useToast();

  const carregar = () => {
    api.getRoteiros(token).then(data => {
      if (!Array.isArray(data)) return;
      setTodos(data);
      setRoteiros(data);
      setStats({
        total: data.length,
        regioes: new Set(data.map(r => r.regiao_id)).size,
        gasto: data.reduce((s, r) => s + Number(r.custo_total), 0),
      });
    });
  };

  useEffect(() => { carregar(); }, [token]);

  // CT-020: Filtro por cidade / nome da região
  useEffect(() => {
    if (!filtro.trim()) { setRoteiros(todos); return; }
    const f = filtro.toLowerCase();
    setRoteiros(todos.filter(r =>
      r.titulo?.toLowerCase().includes(f) ||
      r.regiao_nome?.toLowerCase().includes(f)
    ));
  }, [filtro, todos]);

  const clonar = async (id) => {
    const res = await api.clonarRoteiro(token, id);
    if (res.error) return show(res.error, "error");
    show("Roteiro duplicado!");
    carregar();
  };

  const deletar = async (id) => {
    if (!window.confirm("Excluir este roteiro?")) return;
    const res = await api.deletarRoteiro(token, id);
    if (res.error) return show(res.error, "error");
    show("Roteiro excluído.");
    carregar();
  };

  const statCards = [
    { Icon: Map,    val: stats.total,                       label: "Roteiros" },
    { Icon: MapPin, val: stats.regioes,                     label: "Regiões" },
    { Icon: Wallet, val: `R$ ${stats.gasto.toFixed(0)}`,    label: "Total gasto" },
  ];

  return (
    <PageWrapper screen="history" setScreen={setScreen}>
      {toastEl}
      <div className="px-5 lg:px-10 pt-10 lg:pt-8 pb-4 lg:pb-6 bg-teal-800">
        <h1 className="text-white text-xl lg:text-2xl font-bold">Minhas viagens</h1>
        <p className="text-teal-200/70 text-xs lg:text-sm mt-0.5">Todos os seus roteiros em um lugar</p>
      </div>

      <div className="px-4 lg:px-10 py-4 lg:py-6 flex flex-col gap-4 lg:max-w-5xl">
        <div className="grid grid-cols-3 lg:grid-cols-3 lg:max-w-md gap-2.5">
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

        {/* CT-092/099: Campo de pesquisa — visível e digitável */}
        <div className="flex flex-col gap-1 lg:max-w-md">
          <label className="text-slate-500 text-xs font-semibold">Pesquisar viagens</label>
          <div className="flex items-center gap-2 bg-white border-2 border-teal-200 rounded-xl px-3.5 py-3 focus-within:border-teal-500 transition">
            <Search size={16} className="text-teal-500 flex-shrink-0" />
            <input
              placeholder="Digite o nome da região ou roteiro…"
              value={filtro}
              onChange={e => setFiltro(e.target.value)}
              className="flex-1 text-sm text-slate-700 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            {filtro && <button onClick={() => setFiltro("")} className="text-slate-400 hover:text-slate-600"><X size={14} /></button>}
          </div>
        </div>

        {roteiros.length === 0
          ? <p className="text-slate-400 text-sm text-center py-8">{filtro ? "Nenhum resultado encontrado." : "Nenhum roteiro encontrado."}</p>
          : <div className="flex flex-col gap-3 lg:grid lg:grid-cols-3 lg:gap-4">
              {roteiros.map(h => {
                const RegIcon = REGION_ICONS[h.regiao_slug] || MapPin;
                return (
                  <div key={h.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden">
                    <div className="relative h-20 bg-teal-800 flex items-center justify-center overflow-hidden">
                      <RegIcon size={52} className="text-white/10" strokeWidth={1} />
                      <img src={IMG_FALLBACK[h.regiao_slug] || IMG_FALLBACK["serra-gaucha"]}
                        alt={"Foto de " + (h.regiao_nome || "região")}
                        className="absolute inset-0 w-full h-full object-cover opacity-60" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                        <div>
                          <p className="text-white/60 text-[10px] flex items-center gap-1"><MapPin size={9} />{h.regiao_nome}</p>
                          <p className="text-white text-sm font-bold">{h.titulo}</p>
                        </div>
                        <span className="bg-white/20 text-white text-xs font-bold px-2 py-0.5 rounded-lg">
                          R$ {Number(h.custo_total).toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <div className="px-3 py-2.5 flex items-center gap-2 flex-wrap">
                      <div className="flex items-center gap-1 text-slate-400 text-xs"><Calendar size={11} />{h.data_inicio}</div>
                      <div className="ml-auto flex gap-1.5">
                        <button onClick={() => clonar(h.id)}
                          className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center" title="Duplicar">
                          <Copy size={13} />
                        </button>
                        <button onClick={() => deletar(h.id)}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-400 flex items-center justify-center" title="Excluir">
                          <Trash2 size={13} />
                        </button>
                        <button onClick={() => { setRoteiroAtivo(h); setScreen("itinerary"); }}
                          className="bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold px-3 h-7 rounded-lg flex items-center gap-1 transition">
                          <Eye size={13} /> Ver
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>}
      </div>
    </PageWrapper>
  );
}

// ─── PROFILE / SUB-TELAS ──────────────────────────────────────────────────────
function ProfileDataScreen({ setScreen, token, usuario }) {
  const [nome, setNome] = useState(usuario?.nome_completo || "");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [msg, setMsg] = useState("");

  const handleSalvar = async () => {
    if (novaSenha && novaSenha.length < 6) return setMsg("❌ Nova senha deve ter no mínimo 6 caracteres.");
    setMsg("Salvando...");
    const res = await api.atualizarPerfil(token, {
      nome_completo: nome,
      senha_atual: senhaAtual || undefined,
      nova_senha: novaSenha || undefined,
    });
    if (res.error) setMsg("❌ " + res.error);
    else { setMsg("✅ Perfil atualizado!"); setSenhaAtual(""); setNovaSenha(""); }
  };

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 flex items-center gap-3">
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <h2 className="text-white text-base lg:text-xl font-bold">Dados Pessoais</h2>
      </div>
      <div className="px-4 lg:px-10 py-6 flex flex-col gap-4 lg:max-w-2xl">
        {msg && <div className="bg-slate-100 p-3 rounded-xl text-sm font-semibold text-slate-700 text-center">{msg}</div>}
        <div className="flex flex-col gap-1.5">
          <label className="text-slate-700 text-sm font-semibold">Nome Completo</label>
          <input value={nome} onChange={e => setNome(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <div className="flex flex-col gap-1.5 mt-2">
          <label className="text-slate-700 text-sm font-semibold">Alterar Senha <span className="text-slate-400 font-normal">(opcional)</span></label>
          <input type="password" placeholder="Senha atual" value={senhaAtual} onChange={e => setSenhaAtual(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 mb-2" />
          <input type="password" placeholder="Nova senha (mín. 6 caracteres)" value={novaSenha} onChange={e => setNovaSenha(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400" />
        </div>
        <button onClick={handleSalvar} className="w-full mt-4 bg-teal-800 hover:bg-teal-900 text-white font-bold py-3.5 rounded-2xl transition">
          Salvar Alterações
        </button>
      </div>
    </PageWrapper>
  );
}

function NotificationsScreen({ setScreen, token }) {
  const [notificacoes, setNotificacoes] = useState([]);

  useEffect(() => {
    api.getNotificacoes(token).then(data => {
      if (Array.isArray(data)) setNotificacoes(data);
      api.marcarNotificacoesLidas(token);
    });
  }, [token]);

  return (
    <PageWrapper screen="home" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 flex items-center gap-3">
        <button onClick={() => setScreen("home")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <h2 className="text-white text-base lg:text-xl font-bold">Notificações</h2>
      </div>
      <div className="px-4 lg:px-10 py-4 flex flex-col gap-3 lg:max-w-2xl">
        {notificacoes.length === 0
          ? <p className="text-center text-slate-400 text-sm mt-10">Nenhuma notificação nova.</p>
          : notificacoes.map(n => (
              <div key={n.id} className={`bg-white p-4 rounded-2xl border ${n.lida ? "border-slate-100" : "border-teal-300 bg-teal-50/30"}`}>
                <h4 className="font-bold text-slate-800 text-sm mb-1">{n.titulo}</h4>
                <p className="text-slate-600 text-xs">{n.mensagem}</p>
              </div>
            ))}
      </div>
    </PageWrapper>
  );
}

function ProfileScreen({ setScreen, token, onLogout }) {
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    api.getPerfil(token).then(data => { if (!data.error) setPerfil(data); });
  }, [token]);

  const iniciais = perfil?.nome_completo?.split(" ").map(n => n[0]).slice(0, 2).join("").toUpperCase() || "??";

  const menuSections = [
    { title: "CONTA", items: [
      { Icon: User,       label: "Dados pessoais",         desc: "Nome, e-mail e senha", action: () => setScreen("dados_pessoais") },
      { Icon: Bell,       label: "Notificações",           desc: "Alertas e novidades",  action: () => setScreen("notificacoes") },
    ]},
    { title: "PREFERÊNCIAS", items: [
      { Icon: Star,       label: "Avaliações",             desc: "Locais que você visitou",  action: () => setScreen("avaliacoes") },
    ]},
    { title: "SUPORTE", items: [
      { Icon: Shield,     label: "Privacidade e segurança", desc: "Como tratamos seus dados", action: () => setScreen("privacidade") },
      { Icon: HelpCircle, label: "Ajuda e suporte",         desc: "Perguntas frequentes",      action: () => setScreen("ajuda") },
      { Icon: LogOut,     label: "Sair da conta",           desc: "", danger: true, action: onLogout },
    ]},
  ];

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 pt-10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/15 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
            {iniciais}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-bold truncate">{perfil?.nome_completo || "Carregando…"}</p>
            <div className="flex items-center gap-1 text-teal-200/70 text-xs"><Mail size={11} />{perfil?.email || "…"}</div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 flex flex-col gap-5">
        <div className="grid grid-cols-3 gap-2.5">
          {[
            { Icon: Map,    val: perfil?.stats?.total_roteiros ?? "–", label: "Roteiros" },
            { Icon: MapPin, val: perfil?.stats?.total_regioes ?? "–",  label: "Regiões" },
            { Icon: Wallet, val: perfil ? `R$ ${Number(perfil.stats?.total_estimado || 0).toFixed(0)}` : "–", label: "Estimado" },
          ].map(({ Icon, val, label }) => (
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

// ─── FAVORITOS ────────────────────────────────────────────────────────────────
function PrivacidadeScreen({ setScreen }) {
  const secoes = [
    { titulo: "Coleta de dados", texto: "Coletamos apenas as informações necessárias para o funcionamento do app: seu nome, e-mail e os roteiros de viagem que você cria. Esses dados são usados exclusivamente para oferecer a você uma experiência personalizada de planejamento de viagens pelo Rio Grande do Sul." },
    { titulo: "Uso das informações", texto: "Suas informações são utilizadas para salvar seus roteiros, regiões favoritas e avaliações. Não compartilhamos seus dados pessoais com terceiros para fins comerciais ou publicitários." },
    { titulo: "Segurança", texto: "Sua senha é armazenada de forma criptografada e nunca fica visível para nossa equipe. A comunicação com nossos servidores é protegida e o acesso à sua conta é feito por meio de autenticação segura." },
    { titulo: "Seus direitos (LGPD)", texto: "De acordo com a Lei Geral de Proteção de Dados, você pode solicitar a qualquer momento o acesso, a correção ou a exclusão dos seus dados pessoais. Para isso, entre em contato pelo nosso canal de suporte." },
    { titulo: "Cookies e sessão", texto: "Utilizamos um token de sessão para manter você conectado. Essa informação fica armazenada apenas no seu dispositivo e é removida ao sair da conta." },
  ];

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 flex items-center gap-3">
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <h2 className="text-white text-base lg:text-xl font-bold">Privacidade e segurança</h2>
      </div>
      <div className="px-4 lg:px-10 py-4 flex flex-col gap-3 lg:max-w-2xl">
        <p className="text-slate-400 text-xs mb-1">Última atualização: junho de 2026</p>
        {secoes.map((s, i) => (
          <div key={i} className="bg-white p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-2">
              <Shield size={14} className="text-teal-700" strokeWidth={1.8} />{s.titulo}
            </h4>
            <p className="text-slate-600 text-xs leading-relaxed">{s.texto}</p>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

function AjudaScreen({ setScreen }) {
  const [aberta, setAberta] = useState(null);
  const faqs = [
    { p: "Como crio um roteiro de viagem?", r: "Toque em \"Planejar\" na barra inferior, escolha a região que deseja visitar, defina as datas e suas preferências. O app monta automaticamente um roteiro com sugestões de locais para cada dia." },
    { p: "Posso editar um roteiro depois de criado?", r: "Sim. Acesse o roteiro pelo \"Histórico\", abra os detalhes e você poderá ajustar os locais, adicionar notas e marcar itens como concluídos." },
    { p: "Como funciona a estimativa de custo?", r: "O app calcula um custo médio estimado com base nos locais e na duração do roteiro. É uma estimativa para ajudar no planejamento, podendo variar conforme suas escolhas reais." },
    { p: "Como avalio um roteiro que já fiz?", r: "Vá em \"Perfil\" > \"Avaliações\". Os roteiros concluídos aparecem como pendentes de avaliação. Dê de 1 a 5 estrelas e, se quiser, deixe um comentário." },
    { p: "Esqueci minha senha. E agora?", r: "Entre em contato pelo nosso canal de suporte abaixo para receber ajuda na recuperação do acesso à sua conta." },
    { p: "Como entro em contato com o suporte?", r: "Você pode nos enviar um e-mail para suporte@conexaogaucha.com.br. Respondemos em até 48 horas úteis." },
  ];

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 flex items-center gap-3">
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <h2 className="text-white text-base lg:text-xl font-bold">Ajuda e suporte</h2>
      </div>
      <div className="px-4 lg:px-10 py-4 flex flex-col gap-3 lg:max-w-2xl">
        <p className="text-slate-500 text-sm mb-1">Perguntas frequentes</p>
        {faqs.map((f, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <button
              onClick={() => setAberta(aberta === i ? null : i)}
              className="w-full flex items-center justify-between gap-2 p-4 text-left"
            >
              <span className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <HelpCircle size={14} className="text-teal-700 flex-shrink-0" strokeWidth={1.8} />{f.p}
              </span>
              <ChevronRight size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${aberta === i ? "rotate-90" : ""}`} />
            </button>
            {aberta === i && (
              <p className="text-slate-600 text-xs leading-relaxed px-4 pb-4 -mt-1">{f.r}</p>
            )}
          </div>
        ))}
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-4 mt-1">
          <h4 className="font-bold text-teal-800 text-sm mb-1 flex items-center gap-2">
            <MessageSquare size={14} strokeWidth={1.8} />Ainda precisa de ajuda?
          </h4>
          <p className="text-teal-700/80 text-xs">Envie um e-mail para suporte@conexaogaucha.com.br e responderemos em até 48 horas úteis.</p>
        </div>
      </div>
    </PageWrapper>
  );
}

function FavoritosScreen({ setScreen, token }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    api.getFavoritos(token).then(data => { if (Array.isArray(data)) setFavoritos(data); });
  }, [token]);

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 flex items-center gap-3">
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <h2 className="text-white text-base lg:text-xl font-bold">Regiões Favoritas</h2>
      </div>
      <div className="px-4 lg:px-10 py-4 flex flex-col gap-3 lg:max-w-2xl">
        {favoritos.length === 0
          ? <p className="text-center text-slate-400 text-sm mt-10">Nenhuma região favoritada ainda.</p>
          : favoritos.map(f => {
              const RegIcon = REGION_ICONS[f.slug] || MapPin;
              return (
                <div key={f.id} className="flex items-center gap-3 bg-white border border-slate-100 rounded-2xl p-4">
                  <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center flex-shrink-0">
                    <RegIcon size={20} className="text-teal-700" strokeWidth={1.8} />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 font-semibold text-sm">{f.nome}</p>
                    <p className="text-slate-400 text-xs">{f.descricao}</p>
                  </div>
                  <Star size={16} className="text-amber-400 flex-shrink-0" />
                </div>
              );
            })}
      </div>
    </PageWrapper>
  );
}

// ─── AVALIAÇÕES ───────────────────────────────────────────────────────────────
function AvaliacoesScreen({ setScreen, token }) {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [pendentes, setPendentes] = useState([]);
  const { show, el: toastEl } = useToast();

  useEffect(() => {
    api.getAvaliacoes(token).then(d => { if (Array.isArray(d)) setAvaliacoes(d); });
    api.getAvaliacoesPendentes(token).then(d => { if (Array.isArray(d)) setPendentes(d); });
  }, [token]);

  const salvar = async (roteiro_id, nota, comentario) => {
    const res = await api.salvarAvaliacao(token, { roteiro_id, estrelas: nota, comentario });
    if (res.error) return show(res.error, "error");
    show("Avaliação salva!");
    api.getAvaliacoes(token).then(d => { if (Array.isArray(d)) setAvaliacoes(d); });
    api.getAvaliacoesPendentes(token).then(d => { if (Array.isArray(d)) setPendentes(d); });
  };

  return (
    <PageWrapper screen="profile" setScreen={setScreen}>
      {toastEl}
      <div className="bg-teal-800 px-5 lg:px-10 pt-10 lg:pt-8 pb-6 flex items-center gap-3">
        <button onClick={() => setScreen("profile")} className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
          <ArrowLeft size={18} color="white" />
        </button>
        <h2 className="text-white text-base lg:text-xl font-bold">Minhas Avaliações</h2>
      </div>
      <div className="px-4 lg:px-10 py-4 flex flex-col gap-4 lg:max-w-2xl">
        {pendentes.length > 0 && (
          <div>
            <p className="text-slate-700 font-semibold text-sm mb-2">Aguardando avaliação</p>
            {pendentes.map(p => <AvaliacaoCard key={p.id} roteiro={p} onSalvar={salvar} />)}
          </div>
        )}
        {avaliacoes.length > 0 && (
          <div>
            <p className="text-slate-700 font-semibold text-sm mb-2">Já avaliados</p>
            {avaliacoes.map(a => (
              <div key={a.id} className="bg-white border border-slate-100 rounded-2xl p-4 mb-2">
                <p className="text-slate-800 font-semibold text-sm">{a.titulo || "Roteiro"}</p>
                <div className="flex items-center gap-1 mt-1">
                  {[1,2,3,4,5].map(n => (
                    <Star key={n} size={14} className={n <= a.nota ? "text-amber-400" : "text-slate-200"} fill={n <= a.nota ? "currentColor" : "none"} />
                  ))}
                </div>
                {a.comentario && <p className="text-slate-500 text-xs mt-1">{a.comentario}</p>}
              </div>
            ))}
          </div>
        )}
        {avaliacoes.length === 0 && pendentes.length === 0 && (
          <p className="text-center text-slate-400 text-sm mt-10">Nenhuma avaliação ainda.</p>
        )}
      </div>
    </PageWrapper>
  );
}

function AvaliacaoCard({ roteiro, onSalvar }) {
  const [nota, setNota] = useState(0);
  const [comentario, setComentario] = useState("");
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-2">
      <p className="text-slate-800 font-semibold text-sm mb-2">{roteiro.titulo}</p>
      <div className="flex items-center gap-1 mb-3">
        {[1,2,3,4,5].map(n => (
          <button key={n} onClick={() => setNota(n)}>
            <Star size={20} className={n <= nota ? "text-amber-400" : "text-slate-200"} fill={n <= nota ? "currentColor" : "none"} />
          </button>
        ))}
      </div>
      <textarea value={comentario} onChange={e => setComentario(e.target.value)}
        placeholder="Comentário (opcional)..."
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-400 resize-none mb-2" rows={2} />
      <button disabled={!nota} onClick={() => onSalvar(roteiro.id, nota, comentario)}
        className="w-full bg-teal-800 text-white text-sm font-semibold py-2.5 rounded-xl disabled:opacity-40 hover:bg-teal-900 transition">
        Enviar avaliação
      </button>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState("login");
  const [token, setToken]   = useState(() => localStorage.getItem("cg_token") || null);
  const [usuario, setUsuario] = useState(() => {
    const u = localStorage.getItem("cg_usuario");
    return u ? JSON.parse(u) : null;
  });
  const [planData, setPlanData]         = useState({});
  const [roteiroAtivo, setRoteiroAtivo] = useState(null);

  useEffect(() => { if (token) setScreen("home"); }, []);

  const onLogin = (t, u, lembrar = true) => {
    setToken(t); setUsuario(u);
    if (lembrar) {
      localStorage.setItem("cg_token", t);
      localStorage.setItem("cg_usuario", JSON.stringify(u));
    } else {
      sessionStorage.setItem("cg_token", t);
    }
  };

  const onLogout = () => {
    setToken(null); setUsuario(null);
    localStorage.removeItem("cg_token");
    localStorage.removeItem("cg_usuario");
    sessionStorage.removeItem("cg_token");
    setScreen("login");
  };

  const props = { setScreen, token, usuario, onLogin, onLogout, planData, setPlanData, roteiroAtivo, setRoteiroAtivo };

  const screens = {
    login:          <LoginScreen    {...props} />,
    register:       <RegisterScreen {...props} />,
    home:           <HomeScreen     {...props} />,
    planner:        <PlannerStep1   {...props} />,
    planner2:       <PlannerStep2   {...props} />,
    planner3:       <PlannerStep3   {...props} />,
    itinerary:      <ItineraryScreen setScreen={setScreen} roteiro={roteiroAtivo} token={token} />,
    history:        <HistoryScreen  {...props} />,
    profile:        <ProfileScreen  {...props} />,
    dados_pessoais: <ProfileDataScreen setScreen={setScreen} token={token} usuario={usuario} />,
    notificacoes:   <NotificationsScreen setScreen={setScreen} token={token} />,
    favoritos:      <FavoritosScreen setScreen={setScreen} token={token} />,
    avaliacoes:     <AvaliacoesScreen setScreen={setScreen} token={token} />,
    privacidade:    <PrivacidadeScreen setScreen={setScreen} />,
    ajuda:          <AjudaScreen setScreen={setScreen} />,
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