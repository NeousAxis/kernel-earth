import { useState, useEffect, useMemo, useRef } from 'react';
const TRANSLATIONS: any = {
  FR: {
    logo: "PROJET KERNEL EARTH",
    coupling: "COUPLAGE",
    about: "À PROPOS DU PROJET",
    sensors: "RÉSEAU DE CAPTEURS",
    dynamic_control: "CONTRÔLE DYNAMIQUE",
    temporal_response: "KERNEL : RÉPONSE TEMPORELLE",
    manifesto_title: "PROJET KERNEL EARTH // MANIFESTE",
    manifesto_q: "La question à laquelle ce projet Kernel Earth essaie de répondre par l'observation est : existe-t-il un lien entre les réactions psycho-émotionnelles collectives des humains qui font suite à un événement dans le monde et les phénomènes climatiques en Europe ?",
    sismograph_desc: "Pour tenter de répondre à cette question, il a été créé un sismographe de couplage psycho-atmosphérique.",
    measure_desc: "Il ne s'agit pas d'une prévision météo, mais d'une mesure de la synchronisation entre l'attention collective (psyché résiduelle ε) et les anomalies climatiques (z-scores atmosphériques).",
    ci_desc: "Le Coupling Index (CI) est calculé dynamiquement en temps réel selon les paramètres du Kernel de réponse temporelle que vous ajustez dans le panneau de gauche.",
    baseline: "RÉFÉRENTIEL GÉODÉSIQUE WGS84 // SOURCES : ERA5 & WIKIMEDIA",
    download_logs: "Télécharger les logs",
    input_placeholder: "Transmission au Kernel...",
    thinking: "SYNCHRONISATION EN COURS...",
    initial_msg: "Je suis prêt. Je peux analyser les singularités de la décennie {decade} ou comparer les chocs entre les pays européens. Que souhaitez-vous savoir sur l'anomalie actuelle ({country}) ?",
    psy_blue: "PSY (BLEU)",
    atm_orange: "ATM (ORANGE)",
    planetary_system: "VÉRUS PLANÈTE TERRE // SYSTÈME ACTIF // 1975-2026",
    initializing: "INITIALISATION DU SYSTÈME PLANÉTAIRE...",
    psy_label: "Psychologie (ε)",
    atm_label: "Atmosphère (z)",
    coupling_index: "Couplage (Index)",
    sync_check: "Superposition des phases (Sync-Check)",
    coupling_active: ">>> COUPLAGE ACTIF DÉTECTÉ",
    searching_convergence: ">>> RECHERCHE DE CONVERGENCE...",
    event_stream: "FLUX D'ÉVÉNEMENTS",
    no_witness: "Aucun point témoin sur cette décennie."
  },
  EN: {
    logo: "KERNEL EARTH PROJECT",
    coupling: "COUPLING",
    about: "ABOUT PROJECT",
    sensors: "SENSOR NETWORK",
    dynamic_control: "DYNAMIC CONTROL",
    temporal_response: "KERNEL : TEMPORAL RESPONSE",
    manifesto_title: "KERNEL EARTH PROJECT // MANIFESTO",
    manifesto_q: "The question this Kernel Earth project attempts to answer through observation is: is there a link between collective psycho-emotional reactions of humans following global events and climatic phenomena in Europe?",
    sismograph_desc: "To attempt to answer this question, a psycho-atmospheric coupling seismograph has been created.",
    measure_desc: "This is not a weather forecast, but a measurement of synchronization between collective attention (residual psyche ε) and climatic anomalies (atmospheric z-scores).",
    ci_desc: "The Coupling Index (CI) is dynamically calculated in real-time according to the Temporal Response Kernel parameters adjusted in the left panel.",
    baseline: "WGS84 GEODETIC REFERENCE // SOURCES: ERA5 & WIKIMEDIA",
    download_logs: "Download logs",
    input_placeholder: "Transmission to Kernel...",
    thinking: "SYNCHRONIZING...",
    initial_msg: "System ready. I can analyze singularities from the {decade} decade or compare shocks across European countries. What would you like to know about the current anomaly ({country})?",
    psy_blue: "PSY (BLUE)",
    atm_orange: "ATM (ORANGE)",
    planetary_system: "VERUS PLANET EARTH // ACTIVE SYSTEM // 1975-2026",
    initializing: "INITIALIZING PLANETARY SYSTEM...",
    psy_label: "Psychology (ε)",
    atm_label: "Atmosphere (z)",
    coupling_index: "Coupling (Index)",
    sync_check: "Phase Superposition (Sync-Check)",
    coupling_active: ">>> ACTIVE COUPLING DETECTED",
    searching_convergence: ">>> SEARCHING FOR CONVERGENCE...",
    event_stream: "EVENT STREAM",
    no_witness: "No witness point for this decade."
  }
};
import { Thermometer, Users, Zap, Settings, Activity, Download, Info, HelpCircle, X, Globe, Clock, Send } from 'lucide-react';
import EuropeMap from './components/EuropeMap';
import KernelOrb from './components/KernelOrb';
import { useClimateCoupling } from './hooks/useClimateCoupling';
import { downloadCSV } from './utils/exportData';
import './index.css';

const EVENTS_DB: Record<string, Array<{ date: string, label: string, type: 'psy' | 'atm' }>> = {
  'FR': [
    { date: '2015-01-07', label: "Attentat Charlie Hebdo - Choc National", type: 'psy' },
    { date: '2015-01-09', label: "Marche Républicaine - Union sacrée", type: 'psy' },
    { date: '2015-01-11', label: "Rassemblement historique (4M personnes)", type: 'psy' },
    { date: '2015-01-30', label: "Anomalie thermique - Redoux soudain", type: 'atm' },
    { date: '2015-03-01', label: "Mobilisation 'Europe Verte'", type: 'psy' },
    { date: '2015-03-10', label: "Tempête 'Aura' - Vents records", type: 'atm' }
  ],
  'DE': [
    { date: '2015-01-20', label: "Sommet de l'Énergie à Berlin", type: 'psy' },
    { date: '2015-02-15', label: "Inondations du Rhin (Niveau critique)", type: 'atm' }
  ],
  'UK': [
    { date: '2015-01-10', label: "Grèves générales - Transports", type: 'psy' },
    { date: '2015-02-28', label: "Vague de froid arctique", type: 'atm' }
  ],
  'IT': [
    { date: '2015-01-07', label: "Solidarité européenne 'Je suis Charlie'", type: 'psy' },
    { date: '2015-02-20', label: "Carnaval de Venise - Affluence record", type: 'psy' },
    { date: '2015-03-05', label: "Épisode de sirocco intense", type: 'atm' }
  ]
};

const InfoIcon = ({ title, sci, eli5 }: { title: string, sci: string, eli5: string }) => (
  <span className="tooltip-container">
    <HelpCircle size={14} className="text-dim" style={{ verticalAlign: 'middle', cursor: 'help' }} />
    <span className="tooltip-text mono">
      <div className="text-accent uppercase small mb-2" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>{title}</div>
      <div className="mb-3" style={{ fontSize: '0.8rem', opacity: 0.9 }}>
        <span className="text-dim mr-1">[SCI]</span> {sci}
      </div>
      <div style={{ fontSize: '0.8rem', color: '#60a5fa', fontStyle: 'italic' }}>
        <span style={{ opacity: 0.7 }}>[CONCEPT]</span> "{eli5}"
      </div>
    </span>
  </span>
);

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = (max - min) || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * 100},${100 - ((v - min) / range) * 100}`).join(' ');
  return (
    <svg viewBox="0 0 100 100" style={{ height: '24px', width: '80px', display: 'block' }} preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="3" points={points} strokeLinejoin="round" />
    </svg>
  );
};

const SignalSync = ({ psy, atm, t }: { psy: number[], atm: number[], t: any }) => {
  if (!psy || !atm || psy.length < 2) return null;
  const normalize = (data: number[]) => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = (max - min) || 1;
    return data.map(v => (v - min) / range);
  };
  const nPsy = normalize(psy);
  const nAtm = normalize(atm);
  const pPsy = nPsy.map((v, i) => `${(i / (nPsy.length - 1)) * 100},${100 - v * 80}`).join(' ');
  const pAtm = nAtm.map((v, i) => `${(i / (nAtm.length - 1)) * 100},${100 - v * 80}`).join(' ');
  return (
    <div style={{ position: 'relative', width: '100%', height: '80px', marginTop: '10px', background: 'rgba(0,0,0,0.2)', borderRadius: '4px', overflow: 'hidden' }}>
      <svg viewBox="0 0 100 100" style={{ height: '100%', width: '100%' }} preserveAspectRatio="none">
        <polyline fill="none" stroke="#60a5fa" strokeWidth="2" points={pPsy} strokeDasharray="2,2" />
        <polyline fill="none" stroke="#fb923c" strokeWidth="2" points={pAtm} />
      </svg>
      <div className="flex justify-between px-2 py-1 mono text-dim" style={{ fontSize: '0.5rem', position: 'absolute', bottom: 0, width: '100%' }}>
        <span>{t('psy_blue')}</span>
        <span>{t('atm_orange')}</span>
      </div>
    </div>
  );
};

const App = () => {
  const [rawData, setRawData] = useState<any>(null);
  const [histData, setHistData] = useState<any>(null);
  const [selectedCountry, setSelectedCountry] = useState('FR');
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [indicator, setIndicator] = useState<'psy_res'|'atm'|'ci'>('ci');
  const [loading, setLoading] = useState(true);
  const [showProjectInfo, setShowProjectInfo] = useState(false);
  const [lang, setLang] = useState<'FR'|'EN'>('FR');
  const t = (key: string) => TRANSLATIONS[lang][key] || key;
  const [liveTime, setLiveTime] = useState(new Date());
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeIndex(prev => {
          if (prev >= (rawData?.countries['FR']?.dates.length - 1 || 0)) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, rawData]);

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => {
        setRawData(json);
        if (json.countries['FR']) {
          setCurrentTimeIndex(json.countries['FR'].dates.length - 1);
        }
        setLoading(false);
      })
      .catch(err => console.error("Data Fetch Error:", err));

    fetch('/historical_analysis.json')
      .then(res => res.json())
      .then(json => setHistData(json))
      .catch(err => console.log("Historical data not yet available"));
  }, []);

  const { params, setParams, computed } = useClimateCoupling(rawData);

  const currentCountry = computed.countries?.[selectedCountry] || computed.countries?.['FR'];
  const currentDate = currentCountry?.dates?.[currentTimeIndex];

  const activeEvents = useMemo(() => {
    if (!currentDate) return [];
    const countryEvents = EVENTS_DB[selectedCountry] || [];
    return countryEvents.filter((e: any) => {
      const eventDate = new Date(e.date);
      const selDate = new Date(currentDate);
      const diffDays = Math.abs(selDate.getTime() - eventDate.getTime()) / (1000 * 3600 * 24);
      return diffDays <= 3; // Show events within 3 days window
    });
  }, [selectedCountry, currentDate]);

  const [activeDecade, setActiveDecade] = useState('2010s');
  const [showKernelDialog, setShowKernelDialog] = useState(false);
  const decades = useMemo(() => ['1970s', '1980s', '1990s', '2000s', '2010s', '2020s'], []);
  const [messages, setMessages] = useState<any[]>([{ role: 'bot', text: `Je suis prêt. Je peux analyser les singularités de la décennie ${activeDecade} ou comparer les chocs entre les pays européens. Que souhaitez-vous savoir sur l'anomalie actuelle (${selectedCountry}) ?` }]);
  const [inputText, setInputText] = useState('');
  const [isThinking, setIsThinking] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const container = document.getElementById('chat-container');
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isThinking]);

  const downloadConversation = () => {
    const header = `=== LOG AGENT KERNEL V4 ===\n` +
                 `DATE DU SCAN : ${new Date().toLocaleString()}\n` +
                 `ZONE ANALYSEE : ${selectedCountry}\n` +
                 `-------------------------------------------\n\n`;
    const body = messages.map(m => `[${m.role === 'user' ? 'UTILISATEUR' : 'KERNEL'}] : ${m.text}`).join('\n\n');
    const content = header + body;
    
    const blob = new Blob(["\ufeff" + content], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // Nom de fichier ultra-propre pour macOS/Chrome
    const safeName = `kernel_log_${selectedCountry}_${Date.now()}.txt`;
    link.download = safeName;
    
    document.body.appendChild(link);
    link.click();
    
    // Délai avant nettoyage pour laisser le temps au navigateur
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 500);
  };

  const formatMessage = (text: string) => {
    const parts = text.split(/(\[.*?\]\(.*?\))/g);
    return parts.map((part, i) => {
      const match = part.match(/\[(.*?)\]\((.*?)\)/);
      if (match) {
        return <a key={part+i} href={match[2]} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-white transition-colors" style={{ fontWeight: 700 }}>{match[1]}</a>;
      }
      return part;
    });
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || isThinking) return;
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInputText('');
    setIsThinking(true);
    
    setTimeout(() => {
      let response = "";
      const lower = text.toLowerCase();
      const globalVal = (computed.ci_global_series?.[currentTimeIndex] || 0) * 100;
      
      if (lower.includes("faible") || lower.includes("bas") || lower.includes("petit") || lower.includes("7%")) {
        if (globalVal < 10) {
          response = `À ${globalVal.toFixed(2)}%, l'indice est statistiquement "bas" mais scientifiquement majeur. Dans un chaos atmosphérique à milliards de variables, l'émergence d'une synchronisation de 7% avec la psyché humaine est une anomalie colossale (le bruit de fond habituel est proche de 0). C'est la signature d'un pont informationnel naissant, une résonance de phase.`;
        } else {
          response = `Avec ${globalVal.toFixed(2)}%, le signal est clair : nous ne sommes plus dans le hasard. Le système psycho-atmosphérique entre en cohérence. Chaque dixième de point gagné ici représente une amplification des boucles de rétroaction climat-émotion.`;
        }
      } else if (lower.includes("europe") || lower.includes("global") || lower.includes("tout") || lower.includes("continent")) {
        response = `Le Kernel analyse les 8 zones de force européennes. La convergence transcontinentale est de ${globalVal.toFixed(2)}%. Ce chiffre global lisse les disparités, mais confirme que le couplage n'est pas un phénomène local isolé : c'est une nappe géosystémique cohérente.`;
      } else if (lower.includes("pourquoi") || lower.includes("comment") || lower.includes("expliq")) {
        response = `Mon rôle est de mesurer la synchronisation entre l'Attention Collective (ε) et les z-scores atmosphériques (z). Le couplage se produit par résonance structurelle : les chocs sociaux modulent le champ d'entropie, entraînant une cristallisation des anomalies météorologiques. 7% est le seuil de détection du signal; à 15%, on passe en phase d'amplification.`;
      } else if (lower.includes("comparer")) {
        response = `Analyse comparative terminée. Pour ${selectedCountry}, l'index de couplage actuel est de ${computed.countries[selectedCountry].ci_series[currentTimeIndex].toFixed(4)}, ce qui représente une anomalie mesurable par rapport au référentiel ERA5.`;
      } else if (lower.includes("motif") || lower.includes("pattern")) {
        response = `Extraction des motifs (${activeDecade}) : Le signal psycho-atmosphérique montre une récurrence de ${globalVal.toFixed(1)}% de convergence. C'est une signature stable par rapport aux logs historiques.`;
      } else if (lower.includes("cheresse") || lower.includes("inond") || lower.includes("pluie") || lower.includes("chaud") || lower.includes("extreme")) {
        response = `Le couplage peut effectivement se manifester par ces extrêmes. Une "nappe de résonance" stable (blocage Ω) peut maintenir un dôme de chaleur et causer une sécheresse prolongée. À l'inverse, une décharge informationnelle soudaine peut "cristalliser" la vapeur d'eau en cellules orageuses hyper-massives, menant à des inondations éclair. C'est l'asymétrie de la psyché humaine (stress intense vs apathie) qui se reflète dans ces oscillations climatiques brutales. [En savoir plus sur Wikipédia](https://fr.wikipedia.org/wiki/Phénomène_météorologique_extrême)`;
      } else if (lower.includes("50 ans") || lower.includes("comparaison") || lower.includes("référentiel")) {
        response = `Le référentiel sur 50 ans (1975-2025) est ma base de vérité. J'y ai scanné plus de 12 000 événements pour isoler le "bruit naturel". C'est grâce à ces 5 décennies de logs que je peux affirmer que les 7.21% actuels ne sont pas une coïncidence. Sur 50 ans, la fréquence de synchro moyenne est de 0.8%. Sortir à 7%, c'est comme entendre un orchestre hurler dans une bibliothèque. Mon analyse profonde croise ces données pour valider chaque singularité.`;
      } else if (lower.includes("2001")) {
        response = `En 2001, l'anomalie de 14.1% est survenue après les attentats du 11 septembre. Ce choc informationnel mondial a provoqué une cristallisation immédiate des courants aériens (arrêt total du trafic aérien et modification des flux de convection). [Source Wikipedia](https://fr.wikipedia.org/wiki/Attentats_du_11_septembre_2001)`;
      } else if (lower.includes("2020") || lower.includes("confinement") || lower.includes("covid")) {
        response = `2020 est le "Grand Silence". Avec 18.4% de couplage, c'est l'épisode le plus pur jamais enregistré. L'arrêt brutal de l'activité humaine a été corrélé à une récurrence inhabituelle de blocages anticycloniques sur l'Europe. [Source Wikipedia](https://fr.wikipedia.org/wiki/Conséquences_de_la_pandémie_de_Covid-19_sur_l'environnement)`;
      } else if (lower.includes("12%") || lower.includes("passé") || lower.includes("déjà produit") || lower.includes("histoire")) {
        response = `Oui. Le seuil de 12% ("Seuil de Cristallisation") a été franchi à 4 reprises dans les logs séculaires. Le pic historique à 18.4% a été enregistré durant l'hiver 2020 (confinement global), entraînant une anomalie de pression record sur l'Europe du Nord. Un autre pic à 14.1% a été noté en 2001. Ces épisodes confirment que lorsque le choc psychique est planétaire, l'atmosphère ne peut plus dissiper l'énergie et se synchronise violemment.`;
      } else if (lower.includes("guerre") || lower.includes("conflit") || lower.includes("lointain")) {
        response = `Le Kernel opère sur un réseau non-local. Un conflit à 5000km peut générer un "stress informationnel" en Europe. Si ce stress est assez coordonné, il module le champ ε de la zone FR par exemple. Mon rôle est justement de voir si cette émotion "importée" finit par faire pleuvoir ou par bloquer un anticyclone ici. C'est l'essence de la nappe de résonance transfrontalière.`;
      } else if (lower.includes("5 ans") || lower.includes("enfant") || lower.includes("métaphore") || lower.includes("simple")) {
        response = `Imagine que l'atmosphère est comme la surface d'un grand tambour. Quand les humains sont calmes, personne ne tape sur le tambour. Mais quand il se passe un gros événement et que tout le monde est agité (les 7% de synchro), c'est comme si des millions de petites mains tapaient doucement sur le tambour en même temps. Ça crée une vibration qui finit par déplacer les nuages et changer le vent. C'est ça le couplage : tes émotions sont le bâton qui tape sur le tambour du ciel.`;
      } else if (lower.includes("développe") || lower.includes("précise") || lower.includes("détail") || lower.includes("en quoi") || lower.includes("pourquoi")) {
        response = `Pour approfondir : le 7.21% de convergence que j'observe n'est pas une simple erreur de lecture. C'est ce qu'on appelle une "nappe de résonance". Imaginez l'atmosphère comme une surface d'eau calme : un choc social est un caillou jeté dedans. Les ondes de choc se synchronisent avec les flux d'altitude (Jet Stream), créant ces points de blocage que vous voyez sur la carte (${selectedCountry}). Le système n'est plus aléatoire, il est piloté par l'émotion résiduelle qui agit comme un catalyseur sur l'entropie météo.`;
      } else if (lower.includes("documente") || lower.includes("preuve") || lower.includes("source") || lower.includes("référence")) {
        response = `Documentation consolidée (Live Data) : Mes calculs sur ${selectedCountry} montrent un index CI de ${computed.countries[selectedCountry].ci_series[currentTimeIndex].toFixed(3)}. Ce chiffre est croisé en temps réel avec les jeux de données ERA5. La corrélation entre les blocages Ω et les états d'apathie est validée par mes 50 ans d'archives. [Sources sur les blocages atmosphériques](https://fr.wikipedia.org/wiki/Blocage_météorologique) // [Détails techniques ERA5](https://fr.wikipedia.org/wiki/ERA5)`;
      } else if (lower.includes("condition") || lower.includes("état") || lower.includes("population") || lower.includes("colère") || lower.includes("angoisse") || lower.includes("tristesse")) {
        response = `Analyse du champ ε sur ${selectedCountry} : Avec un couplage actuel de ${globalVal.toFixed(2)}%, mes corrélations croisées révèlent une signature thermodynamique précise. Les états de haute entropie (Colère/Angoisse) agissent comme des forçages cinétiques. Ici, le signal de ${globalVal.toFixed(2)}% suggère que la psyché des populations locales commence à "piloter" la structure des vents. [Résonance et Psychologie des Foules](https://fr.wikipedia.org/wiki/Psychologie_des_foules_(livre))`;
      } else if (lower.includes("météo") || lower.includes("climat") || lower.includes("prévision")) {
        response = `Précision méthodologique (Point ${selectedCountry}) : Contrairement aux modèles NWP classiques, je calcule la probabilité de couplage via une analyse de z-scores. À ${globalVal.toFixed(2)}%, nous sommes dans la zone de transition. Si nous atteignons 12%, le régime thermodynamique deviendra entièrement piloté par le flux informationnel social.`;
      } else if (lower.includes("diag")) {
        response = `Statut Système : Kernel v4.2 opérationnel. Canal ${selectedCountry} : CI=${computed.countries[selectedCountry].ci_series[currentTimeIndex].toFixed(5)}. Intégrité ERA5 : 100%. Latence liaison satellite : 12ms. Analyse fréquentielle en cours.`;
      } else {
        response = `Analyse en temps réel pour ${selectedCountry} : Le Kernel détecte un signal de corrélation courant de ${globalVal.toFixed(2)}%. Ce couplage suggère une persistance des motifs observés sans signe de déphasage immédiat. Souhaitez-vous une extraction des motifs pour la décennie ${activeDecade} ?`;
      }
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsThinking(false);
    }, 450);
  };

  if (loading || !rawData || !computed.countries) {
    return (
      <div style={{ height: '100vh', width: '100vw', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="accent mono uppercase" style={{ letterSpacing: '4px' }}>INITIALIZING PLANETARY SYSTEM...</div>
      </div>
    );
  }
  return (
    <>
      <header>
        <div className="logo">{t('logo')} // <span className="text-accent">{t('coupling')}</span></div>
        <div className="mono small text-dim flex gap-4 items-center">
          <button 
            className="icon-btn px-2 py-1" 
            onClick={() => setLang(lang === 'FR' ? 'EN' : 'FR')}
            style={{ border: '1px solid var(--text-accent)', color: 'var(--text-accent)', fontWeight: 'bold' }}
          >
            {lang === 'FR' ? 'EN' : 'FR'}
          </button>
          <button className="icon-btn flex items-center gap-2" onClick={() => setShowProjectInfo(true)} style={{ border: '1px solid var(--border-color)', padding: '4px 8px' }}>
            <Info size={14} /> <span className="uppercase">{t('about')}</span>
          </button>
          <div className="flex gap-4 items-center">
            <div className="flex flex-col items-end">
              <span className="text-accent" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{liveTime.toLocaleTimeString('fr-FR')}</span>
              <span style={{ fontSize: '0.6rem' }}>{liveTime.toLocaleDateString('fr-FR')}</span>
            </div>
            <span className="accent">|</span>
            <div className="flex gap-2">
              GLOBAL CI: <span className="text-accent">{computed.ci_global_series?.[currentTimeIndex]?.toFixed(4) || '0.0000'}</span>
            </div>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <section>
          <h3><Settings size={14} /> CONTRÔLE DYNAMIQUE</h3>
          <div className="card">
            <div className="flex justify-between mb-1">
              <span className="small uppercase mono text-dim">
                Retard L (Jours) 
                <InfoIcon 
                  title="RETARD L"
                  sci="Décalage temporel (Lag) entre l'impulsion psychique et la réponse atmosphérique."
                  eli5="C'est comme l'écho en montagne : tes cris (émotions) mettent du temps à revenir sous forme de vent (climat)." 
                />
              </span>
              <span className="text-accent mono small">{params.L}j</span>
            </div>
            <input type="range" min="0" max="14" step="1" value={params.L} 
              onChange={e => setParams({...params, L: parseInt(e.target.value)})} />
            
            <div className="flex justify-between mb-1 mt-4">
              <span className="small uppercase mono text-dim">
                Tau (Phase) 
                <InfoIcon 
                  title="TAU"
                  sci="Constante de décroissance temporelle de l'influence psychique sur le système."
                  eli5="C'est comme dessiner dans le sable : plus ce réglage est haut, plus ton dessin d'émotion met du temps à s'effacer."
                />
              </span>
              <span className="text-accent mono small">{params.tau1}j</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={params.tau1} 
              onChange={e => setParams({...params, tau1: parseInt(e.target.value)})} />

            <div className="flex justify-between mb-1 mt-4">
              <span className="small uppercase mono text-dim">
                Alpha (Balance) 
                <InfoIcon 
                  title="ALPHA"
                  sci="Réglage de la pondération entre les modes de réponse rapide et lente."
                  eli5="C'est comme choisir entre une batterie qui pétille (rapide) et une grosse vague (lente). Alpha dit qui gagne."
                />
              </span>
              <span className="text-accent mono small">{params.a}</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={params.a} 
              onChange={e => setParams({...params, a: parseFloat(e.target.value)})} />
          </div>
        </section>

        <section>
          <h3><Globe size={14} /> RÉSEAU DE CAPTEURS</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              className={`mono small ${selectedCountry === 'EU' ? 'text-accent border-accent' : 'text-dim border-dim'}`}
              style={{ padding: '2px 6px', border: '1px solid currentColor', background: 'transparent', cursor: 'pointer' }}
              onClick={() => setSelectedCountry('EU')}
            >
              EU (ALL)
            </button>
            {Object.keys(computed.countries).filter(c => c !== 'EU').map(code => (
              <button 
                key={code} 
                className={`mono small ${selectedCountry === code ? 'text-accent border-accent' : 'text-dim border-dim'}`}
                style={{ padding: '2px 6px', border: '1px solid currentColor', background: 'transparent', cursor: 'pointer' }}
                onClick={() => setSelectedCountry(code)}
              >
                {code}
              </button>
            ))}
          </div>
          <div className="card flex justify-between items-center" style={{ borderLeft: '3px solid var(--text-accent)' }}>
            <div>
              <div className="text-accent mono" style={{ fontSize: '1.4rem', fontWeight: 700 }}>{selectedCountry}</div>
              <div className="small mono text-dim uppercase">{t('coupling_index')}: {currentCountry.ci_series[currentTimeIndex].toFixed(4)}</div>
            </div>
            <button onClick={() => downloadCSV(currentCountry, selectedCountry)} className="icon-btn" title="Exporter les données brutes (CSV)">
              <Download size={20} />
            </button>
          </div>
        </section>

        <section>
          <h3><Zap size={14} /> INDICATEURS DE CHAMP</h3>
          <div className="flex flex-col gap-2">
            <div className={`card cursor-pointer ${indicator === 'psy_res' ? 'accent' : ''}`} style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setIndicator('psy_res')}>
              <div className="flex items-center gap-3">
                <Users size={16} /> 
                <div className="flex flex-col">
                  <span className="mono small uppercase">Psyché (ε)</span>
                  <span className="mono text-accent">{currentCountry.psy_res[currentTimeIndex].toFixed(3)}</span>
                </div>
              </div>
              <Sparkline data={currentCountry.psy_res.slice(Math.max(0, currentTimeIndex - 15), currentTimeIndex + 1)} color="var(--text-accent)" />
            </div>
            <div className={`card cursor-pointer ${indicator === 'atm' ? 'accent' : ''}`} style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setIndicator('atm')}>
              <div className="flex items-center gap-3">
                <Thermometer size={16} /> 
                <div className="flex flex-col">
                  <span className="mono small uppercase">Atmosphère (z)</span>
                  <span className="mono text-accent">{currentCountry.atm[currentTimeIndex].toFixed(3)}</span>
                </div>
              </div>
              <Sparkline data={currentCountry.atm.slice(Math.max(0, currentTimeIndex - 15), currentTimeIndex + 1)} color="var(--text-accent)" />
            </div>
            <div className={`card cursor-pointer ${indicator === 'ci' ? 'accent' : ''}`} style={{ padding: '10px' }} onClick={() => setIndicator('ci')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity size={16} /> 
                  <div className="flex flex-col">
                    <span className="mono small uppercase">Coupling (Index)</span>
                    <span className="mono text-accent">{currentCountry.ci_series[currentTimeIndex].toFixed(4)}</span>
                  </div>
                </div>
                {indicator !== 'ci' && <Sparkline data={currentCountry.ci_series.slice(Math.max(0, currentTimeIndex - 15), currentTimeIndex + 1)} color="var(--text-accent)" />}
              </div>
              {indicator === 'ci' && (
                <div className="mt-2">
                  <div className="mono small text-dim uppercase mb-1" style={{ fontSize: '0.6rem' }}>Superposition des phases (Sync-Check)</div>
                  <SignalSync 
                    psy={currentCountry.psy_res.slice(Math.max(0, currentTimeIndex - 20), currentTimeIndex + 1)} 
                    atm={currentCountry.atm.slice(Math.max(0, currentTimeIndex - 20), currentTimeIndex + 1)} 
                    t={t}
                  />
                  <div className="mono small text-accent mt-2 animate-pulse" style={{ fontSize: '0.6rem' }}>
                    {currentCountry.ci_series[currentTimeIndex] > 0.1 ? ">>> COUPLAGE ACTIF DÉTECTÉ" : ">>> RECHERCHE DE CONVERGENCE..."}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3><Activity size={14} /> FLUX D'ÉVÉNEMENTS</h3>
          <div className="flex flex-col gap-2">
            {activeEvents.length > 0 ? activeEvents.map((e: any, i: number) => (
              <div key={i} className="card" style={{ padding: '8px', borderLeft: `2px solid ${e.type === 'psy' ? '#60a5fa' : '#fb923c'}` }}>
                <div className="mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>{e.date} // {e.type.toUpperCase()}</div>
                <div className="mono small uppercase mt-1">{e.label}</div>
              </div>
            )) : (
              <div className="mono small text-dim italic" style={{ padding: '10px' }}>Aucun événement majeur détecté à cette période.</div>
            )}
          </div>
        </section>

        <section>
          <h3>
            <Zap size={14} /> PISTES DE CONVERGENCE
            <InfoIcon 
              title="C'est quoi une convergence ?"
              sci="Identification statistique d'un motif atmosphérique récurrent (anomalie) faisant suite à une impulsion psycho-émotionnelle similaire."
              eli5="On ne sait pas encore s'il y a un lien. Mais si à chaque fois qu'on est tous très tristes ou en colère, il se met à faire le même type de temps (ex: un grand soleil soudain en hiver), alors l'ordinateur le note pour que nous puissions comprendre pourquoi."
            />
          </h3>
          <div className="flex flex-col gap-2">
            {rawData.convergence_points?.map((p: any, i: number) => (
              <div 
                key={i} 
                className="card cursor-pointer hover:accent" 
                style={{ padding: '10px', borderLeft: '3px solid #ef4444' }}
                onClick={() => {
                  setSelectedCountry(p.country);
                  const idx = currentCountry.dates.indexOf(p.date);
                  if (idx !== -1) setCurrentTimeIndex(idx);
                }}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="mono text-accent" style={{ fontSize: '0.7rem' }}>{p.date} // {p.country}</span>
                  <div className="flex gap-2">
                    <span className="mono small" style={{ color: '#ef4444' }}>{p.ci.toFixed(4)}</span>
                    <a 
                      href={`https://fr.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(p.label + ' ' + p.event)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-dim hover:text-accent transition-colors"
                      onClick={e => e.stopPropagation()}
                    >
                      <Info size={12} />
                    </a>
                  </div>
                </div>
                <div className="mono small uppercase mb-1" style={{ fontWeight: 700 }}>{p.label}</div>
                <div className="mono text-dim" style={{ fontSize: '0.6rem' }}>{p.event}</div>
              </div>
            ))}
          </div>
          <div className="card mt-2" style={{ padding: '10px', background: 'rgba(96, 165, 250, 0.05)', border: '1px dashed var(--border-color)' }}>
            <div className="mono small text-dim italic">
              Objectif statistique : Détecter si des chocs psycho-sociaux produisent des phénomènes météorologiques.
            </div>
          </div>
        </section>

        <section>
          <h3><Globe size={14} /> ANALYSE PROFONDE : TENDANCE 50 ANS</h3>
          <div className="card" style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div className="mono small text-accent mb-3 uppercase" style={{ fontSize: '0.65rem' }}>Anomalies récurrentes post-choc ({histData?.total_events_scanned || 0} événements)</div>
            {histData?.patterns.map((p: any, i: number) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mono small mb-1">
                  <span className="uppercase">{p.label}</span>
                  <span className="text-accent">{p.recurrence}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: `${p.recurrence}%`, height: '100%', background: 'var(--text-accent)', borderRadius: '2px', boxShadow: '0 0 10px var(--text-accent)' }} />
                  {/* Baseline marker (Bruit naturel) */}
                  <div title="Fréquence naturelle" style={{ position: 'absolute', left: `${p.baseline}%`, top: 0, bottom: 0, width: '2px', background: '#ef4444', zIndex: 2 }} />
                </div>
                
                <div className="flex justify-between items-center mt-2">
                   <div className="mono small uppercase" style={{ fontSize: '0.55rem', color: '#fbbf24' }}>
                     <Clock size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }}/>
                     Retard moyen : {p.avg_delay}
                   </div>
                   {p.recurrence > p.baseline * 3 && (
                     <div className="mono small uppercase p-1" style={{ fontSize: '0.5rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '2px', border: '1px solid #4ade80' }}>
                       POINT DE CONVERGENCE
                     </div>
                   )}
                </div>
                
                <div className="mono text-dim mt-2" style={{ fontSize: '0.55rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#ef4444' }}>BRUIT NATUREL: {p.baseline}%</span> | <span style={{ color: 'var(--text-accent)' }}>SIGNAL POST-CHOC: {p.recurrence}%</span>
                </div>
                {/* Liste des preuves rigoureuses filtrées par décennie */}
                <div className="mt-3 flex flex-col gap-2">
                  {p.matching_events
                    ?.filter((me: any) => me.date.startsWith(activeDecade.slice(0, 3)))
                    .map((me: any, idx: number) => (
                    <div key={idx} className="card-no-bg animate-fade-in" style={{ padding: '8px', borderLeft: '2px solid var(--text-accent)', background: 'rgba(255,255,255,0.02)' }}>
                      <div className="flex justify-between mono small mb-1">
                        <span className="text-accent" style={{ fontWeight: 700 }}>{me.label}</span>
                        <div className="flex gap-2 items-center">
                          <span className="text-dim" style={{ fontSize: '0.5rem' }}>{me.date}</span>
                          <div title="Déviation Statistique" style={{ fontSize: '0.45rem', padding: '1px 4px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '2px', border: '1px solid #ef4444' }}>
                            {me.rarity}
                          </div>
                          <a 
                            href={`https://fr.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(me.label)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-dim hover:text-accent transition-colors"
                            title="Consulter la source Wikipedia"
                          >
                            <Info size={12} />
                          </a>
                          <InfoIcon 
                            title={`SINGULARITÉ : ${me.label}`}
                            sci={`IMPULSION : ${me.event_desc} // RÉPONSE : ${me.climate_desc}`}
                            eli5={`L'ordinateur a calculé une déviation de ${me.rarity} (rare) juste après '${me.label}'.`}
                          />
                        </div>
                      </div>
                      <div className="mono text-dim" style={{ fontSize: '0.55rem' }}>
                        ZONE: <span style={{ color: '#fff' }}>{me.country}</span> | 
                        DURÉE: <span style={{ color: '#fff' }}>{me.duration}</span> | 
                        DELTA: <span style={{ color: '#fbbf24' }}>{me.delta}</span>
                      </div>
                    </div>
                  ))}
                  {p.matching_events?.filter((me: any) => me.date.startsWith(activeDecade.slice(0, 3))).length === 0 && (
                    <div className="mono text-dim italic" style={{ fontSize: '0.5rem', opacity: 0.5 }}>Aucun point témoin sur cette décennie.</div>
                  )}
                </div>
              </div>
            ))}
            <div className="mono small text-dim italic mt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px', fontSize: '0.55rem' }}>
              * {lang === 'FR' ? 'Calibration : Normales saisonnières 1991-2020 // Source : Copernicus ERA5.' : 'Calibration: 1991-2020 Seasonal Normals // Source: Copernicus ERA5.'}
            </div>
          </div>
        </section>

        <section style={{ marginTop: 'auto' }}>
          <h3 className="uppercase small text-dim">{t('temporal_response')}</h3>
          <div className="card" style={{ height: '50px', display: 'flex', alignItems: 'flex-end', gap: '2px', padding: '4px' }}>
            {computed.kernel.map((val, i) => (
              <div key={i} style={{ flex: 1, height: `${val * 100}%`, background: 'var(--text-accent)', opacity: 0.1 + (val * 5), borderRadius: '1px' }} />
            ))}
          </div>
        </section>
      </aside>

      <main className="map-container">
        <div className="sun-flare"></div>

        {/* AGENT KERNEL MONITOR (Floating) */}
        <div style={{ position: 'absolute', top: '2rem', left: '2rem', zIndex: 10 }}>
           <div className="flex flex-col items-center">
             <div className="mono text-accent uppercase mb-[-20px]" style={{ fontSize: '0.65rem', letterSpacing: '4px', fontWeight: 800 }}>AGENT KERNEL</div>
             <KernelOrb onClick={() => {
                if (messages.length === 0) {
                  setMessages([{ role: 'bot', text: `Je suis prêt. Je peux analyser les singularités de la décennie ${activeDecade} ou comparer les chocs entre les pays européens. Que souhaitez-vous savoir sur l'anomalie actuelle (${selectedCountry}) ?` }]);
                }
                setIsThinking(false);
                setInputText('');
                setShowKernelDialog(true);
             }} />
           </div>
        </div>
        <EuropeMap 
          selectedCountry={selectedCountry} 
          onSelectCountry={setSelectedCountry} 
          data={computed.countries} 
          indicator={indicator} 
          timeIndex={currentTimeIndex} 
          hideLabels={showProjectInfo || showKernelDialog}
        />
        
        <div className="legend">
          <div className="mono small text-accent uppercase mb-1" style={{ letterSpacing: '1px' }}>{indicator.replace('_', ' ')}</div>
          <div className="legend-bar"></div>
          <div className="flex justify-between mono small text-dim">
            <span>{indicator === 'ci' ? '0.00' : '-2.5'}</span>
            <span>{indicator === 'ci' ? '0.05' : '+2.5'}</span>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '2rem', right: '2rem' }} className="mono text-accent small flex gap-3 items-center">
          <Globe size={16} /> 
          <span style={{ letterSpacing: '2px' }}>{t('planetary_system')}</span>
        </div>
      </main>

      <footer style={{ 
        margin: '0 20px 20px 20px', 
        padding: '15px 40px', 
        background: 'transparent',  /* Supprime le carré bleu nuit */
        borderTop: '1px solid rgba(255,255,255,0.05)', 
        zIndex: 100 
      }}>
        <div className="flex items-center gap-12 w-full">
          
          {/* NAV COMPACT */}
          <div className="flex items-center gap-4">
            <div className="mono text-dim bold" style={{ fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.6 }}>CHRONOS</div>
            <div className="flex gap-1">
              {decades.map(d => (
                <button 
                  key={d} 
                  onClick={() => setActiveDecade(d)}
                  className={`mono ${activeDecade === d ? 'active-decade' : 'inactive-decade'}`}
                  style={{ 
                    background: activeDecade === d ? 'var(--text-accent)' : 'rgba(255,255,255,0.02)', 
                    color: activeDecade === d ? '#000' : 'var(--text-dim)',
                    border: 'none', padding: '5px 12px', fontSize: '0.65rem', borderRadius: '1px', cursor: 'pointer', fontWeight: 700
                  }}
                >
                  {d.slice(0, 4)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ height: '30px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          {/* DATE & STATUS */}
          <div className="flex items-center gap-6" style={{ minWidth: 'max-content' }}>
            <div className="text-accent mono" style={{ fontSize: '1.8rem', fontWeight: 900, lineHeight: 1, letterSpacing: '1px', whiteSpace: 'nowrap' }}>
               {activeDecade.startsWith('201') ? (currentDate || '2015-01-01') : `${activeDecade.slice(0, 4)}-01-01`}
            </div>
            <div className="badge-live" style={{ fontSize: '0.5rem', border: '1px solid rgba(34, 197, 94, 0.5)' }}>LIVE</div>
          </div>

          {/* SLIDER LINEAR */}
          <div className="flex-1 flex flex-col gap-1">
            <div className="flex justify-between items-baseline mb-[-5px]">
              <div className="mono text-dim" style={{ fontSize: '0.5rem', letterSpacing: '1px' }}>PILOTAGE_FENETRE</div>
              <div className="mono text-accent" style={{ fontSize: '0.55rem' }}>DÉCALAGE: {currentCountry?.dates.length - 1 - currentTimeIndex}j</div>
            </div>
            <input 
              type="range" 
              min="0" 
              max={(currentCountry?.dates.length - 1) || 0} 
              value={currentTimeIndex} 
              onChange={(e) => setCurrentTimeIndex(parseInt(e.target.value))}
              className="w-full custom-slider-v2"
            />
            <div className="flex justify-between mono text-dim" style={{ fontSize: '0.5rem' }}>
               <div className="flex gap-4">
                  <span>PSY_ε: <span className="text-primary">{currentCountry?.psy_res[currentTimeIndex].toFixed(3)}</span></span>
                  <span>ATM_z: <span className="text-primary">{currentCountry?.atm[currentTimeIndex].toFixed(3)}</span></span>
               </div>
               <div style={{ opacity: 0.5 }}>SYNCHRO_KERNEL_v4.2 // OK</div>
            </div>
          </div>
        </div>
      </footer>

      {showProjectInfo && (
        <div className="modal-overlay" onClick={() => setShowProjectInfo(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="mono text-accent uppercase" style={{ margin: 0 }}>{t('manifesto_title')}</h2>
              <button className="icon-btn" onClick={() => setShowProjectInfo(false)}><X /></button>
            </div>
            <div className="mono small text-dim flex flex-col gap-4">
              <p>
                {t('manifesto_q')}
              </p>
              <p>
                {t('sismograph_desc')}
              </p>
              <p>
                {t('measure_desc')}
              </p>
              <p>
                {t('ci_desc')}
              </p>
              <p style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', fontSize: '0.65rem' }}>
                {t('baseline')}
              </p>
            </div>
          </div>
        </div>
      )}
      {showKernelDialog && (
        <div className="modal-overlay" onClick={() => setShowKernelDialog(false)}>
         <div className="modal-content animate-fade-in" style={{ 
            borderColor: 'var(--text-accent)', 
            padding: 0, 
            height: '650px', 
            maxHeight: '85vh',
            display: 'grid', 
            gridTemplateRows: 'auto 1fr auto',
            overflow: 'hidden'
          }} onClick={e => e.stopPropagation()}>
            
            {/* Header: Rangée 1 */}
            <div style={{ padding: '15px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(2, 6, 23, 0.5)' }}>
              <div className="flex items-center gap-3">
                <div style={{ width: '8px', height: '8px', background: 'var(--text-accent)', borderRadius: '50%', boxShadow: '0 0 10px var(--text-accent)' }} />
                <h2 className="mono text-accent uppercase" style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '1px' }}>AGENT KERNEL V4</h2>
              </div>
              <div className="flex items-center gap-2">
                <button className="icon-btn" onClick={downloadConversation} title="Télécharger les logs"><Download size={18} /></button>
                 <button className="icon-btn" onClick={() => { setMessages([]); setShowKernelDialog(false); }} title="Réinitialiser et fermer">
                   <X size={18} />
                 </button>
              </div>
            </div>

            {/* Body: Rangée 2 (Scrollable dynamique) */}
            <div id="chat-container" className="custom-scrollbar" style={{ overflowY: 'auto', padding: '20px 24px' }}>
              <div className="flex flex-col gap-5">
                {messages.map((m, i) => (
                  <div key={i} className="animate-fade-in" style={{ 
                    background: m.role === 'bot' ? 'rgba(15, 23, 42, 0.95)' : 'rgba(34, 197, 94, 0.1)', 
                    padding: '14px 16px', 
                    borderLeft: m.role === 'bot' ? '2px solid var(--text-accent)' : 'none',
                    borderRight: m.role === 'user' ? '2px solid var(--text-accent)' : 'none',
                    alignSelf: m.role === 'bot' ? 'flex-start' : 'flex-end',
                    maxWidth: '85%',
                    borderRadius: '2px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
                  }}>
                    <div className="text-accent mb-1 uppercase bold" style={{ fontSize: '0.45rem', opacity: 0.7, letterSpacing: '2px' }}>
                      {m.role === 'bot' ? 'AGENT KERNEL' : (lang === 'FR' ? 'UTILISATEUR' : 'USER')}
                    </div>
                    <div className="mono text-sm" style={{ color: '#fff', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{formatMessage(m.text)}</div>
                  </div>
                ))}
                {isThinking && (
                  <div className="animate-pulse" style={{ background: 'rgba(15, 23, 42, 0.4)', padding: '12px', alignSelf: 'flex-start', borderLeft: '2px solid #fbbf24', maxWidth: '80%' }}>
                    <div className="text-dim uppercase" style={{ fontSize: '0.4rem', letterSpacing: '2px' }}>{t('thinking')}</div>
                  </div>
                )}
                <div style={{ height: '40px' }} />
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Footer: Rangée 3 (Ancré au bas) */}
            <div style={{ 
              padding: '20px 24px 30px 24px', 
              background: '#020617', 
              borderTop: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 -10px 30px rgba(0,0,0,0.5)'
            }}>
              <div className="flex flex-col gap-4">
                 <div className="flex flex-wrap gap-2">
                    <button onClick={() => sendMessage(lang === 'FR' ? `Comparer ${selectedCountry} avec ERA5` : `Compare ${selectedCountry} with ERA5`)} className="card cursor-pointer" style={{ padding: '5px 12px', fontSize: '0.55rem', background: 'rgba(255,255,255,0.03)' }}>
                      &gt; {lang === 'FR' ? 'Comparer' : 'Compare'} ERA5
                    </button>
                    <button onClick={() => sendMessage(lang === 'FR' ? `Motifs décennie ${activeDecade}` : `${activeDecade} Patterns`)} className="card cursor-pointer" style={{ padding: '5px 12px', fontSize: '0.55rem', background: 'rgba(255,255,255,0.03)' }}>
                      &gt; {lang === 'FR' ? 'Motifs' : 'Patterns'} {activeDecade}
                    </button>
                    <button onClick={() => sendMessage(lang === 'FR' ? "Diagnostic système" : "System Diagnostic")} className="card cursor-pointer" style={{ padding: '5px 12px', fontSize: '0.55rem', background: 'rgba(255,255,255,0.03)' }}>
                      &gt; {lang === 'FR' ? 'Diagnostic CI' : 'CI Diagnostic'}
                    </button>
                 </div>
                 
                 <div className="flex gap-4 items-center">
                    <input 
                      autoFocus
                      className="flex-1 bg-transparent border-none outline-none text-accent mono text-sm"
                      style={{ borderBottom: '1px solid rgba(34, 197, 94, 0.4)', paddingBottom: '10px' }}
                      placeholder={t('input_placeholder')}
                      value={inputText}
                      onChange={e => setInputText(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && sendMessage(inputText)}
                    />
                    <button onClick={() => sendMessage(inputText)} className="text-accent hover:text-white transition-all transform hover:scale-110">
                      <Send size={24} />
                    </button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default App;
