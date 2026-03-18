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
    no_witness: "Aucun point témoin sur cette décennie.",
    field_indicators: "INDICATEURS DE CHAMP",
    psy_title: "Psychologie (ε)",
    atm_title: "Atmosphère (z)",
    convergence_tracks: "PISTES DE CONVERGENCE",
    convergence_info_title: "C'est quoi une convergence ?",
    convergence_info_sci: "Identification statistique d'un motif atmosphérique récurrent (anomalie) faisant suite à une impulsion psycho-émotionnelle similaire.",
    convergence_info_eli5: "La causalité directe n'est pas encore établie. Cependant, si une intensité émotionnelle collective récurrente est corrélée à un motif atmosphérique spécifique, l'algorithme compile cette coïncidence. Cela permet d'identifier la possibilité d'une correspondance entre les états d'âme humains et les tensions atmosphériques.",
    stat_goal: "Objectif statistique : Détecter si des chocs psycho-sociaux produisent des phénomènes météorologiques.",
    deep_analysis: "ANALYSE PROFONDE : TENDANCE 50 ANS",
    anomalies_recurrent: "Anomalies récurrentes post-choc",
    natural_noise: "BRUIT NATUREL",
    post_shock_signal: "SIGNAL POST-CHOC",
    avg_delay: "Retard moyen",
    convergence_point: "POINT DE CONVERGENCE",
    calibration_source: "Calibration : Normales saisonnières 1991-2020 // Source : Copernicus ERA5.",
    global_ci: "CI GLOBAL",
    delay_L_days: "Retard L (Jours)",
    delay_L_sci: "Décalage temporel (Lag) entre l'impulsion psychique et la réponse atmosphérique.",
    delay_L_eli5: "C'est comme l'écho en montagne : tes cris (émotions) mettent du temps à revenir sous forme de vent (climat).",
    tau_phase: "Tau (Phase)",
    tau_sci: "Constante de décroissance temporelle de l'influence psychique sur le système.",
    tau_eli5: "C'est comme dessiner dans le sable : plus ce réglage est haut, plus ton dessin d'émotion met du temps à s'effacer.",
    alpha_balance: "Alpha (Balance)",
    alpha_sci: "Réglage de la pondération entre les modes de réponse rapide et lente.",
    alpha_eli5: "C'est comme choisir entre une batterie qui pétille (rapide) et une grosse vague (lente). Alpha dit qui gagne.",
    export_raw_data: "Exporter les données brutes (CSV)",
    superposition_phases: "Superposition des phases (Sync-Check)",
    no_major_event: "Aucun événement majeur détecté à cette période.",
    statistical_deviation: "Déviation Statistique",
    consult_wikipedia: "Consulter la source Wikipedia",
    singularity: "Singularité",
    impulse: "Impulsion",
    response: "Réponse",
    computer_calculated_deviation: "L'ordinateur a calculé une déviation de",
    just_after: "juste après",
    zone: "ZONE",
    duration: "DURÉE",
    delta: "DELTA",
    responses: {
      low: "À {val}%, l'indice est statistiquement 'bas' mais scientifiquement majeur. C'est la signature d'un pont informationnel naissant.",
      high: "Avec {val}%, le signal est clair : le système psycho-atmosphérique entre en cohérence.",
      europe: "La convergence transcontinentale est de {val}%. Le couplage est une nappe géosystémique cohérente.",
      how: "Mon rôle est de mesurer la synchronisation entre l'Attention Collective (ε) et les z-scores atmosphériques (z).",
      compare: "Analyse terminée pour {country}. Index : {ci}.",
      pattern: "Extraction des motifs ({activeDecade}) : Récurrence de {val}% de convergence.",
      weather: "Le couplage peut se manifester par ces extrêmes (dômes de chaleur ou inondations éclair).",
      history: "Le référentiel sur 50 ans (1975-2025) confirme que les {val}% actuels sont une anomalie colossale.",
      sept11: "En 2001, l'anomalie de 14.1% a suivi les attentats du 11 septembre.",
      covid: "2020 est le 'Grand Silence'. Avec 18.4% de couplage, c'est l'épisode le plus pur jamais enregistré.",
      threshold: "Le seuil de 12% a été franchi à 4 reprises. Le pic historique à 18.4% a été enregistré durant l'hiver 2020.",
      war: "Le Kernel opère sur un réseau non-local. Un conflit peut générer un stress informationnel dans {country}.",
      eli5_general: "Imagine que l'atmosphère est un tambour : tes émotions sont le bâton qui tape dessus.",
      elaborate: "Le {val}% que j'observe sur {country} n'est pas une simple erreur de lecture. C'est ce qu'on appelle une 'nappe de résonance'.",
      documentation: "Documentation consolidée : Mes calculs sur {country} montrent un index CI de {ci}.",
      condition: "Analyse du champ ε sur {country} : Avec un couplage de {val}%, la psyché commence à 'piloter' la structure des vents.",
      methodo: "Contrairement aux modèles NWP, je calcule le couplage via z-scores dans {country}. Zone de transition à {val}%.",
      status: "Kernel v4.2 opérationnel. Canal {country}. CI={ci}.",
      projection: "🌀 PRÉVISION : Un choc ε a été détecté aujourd'hui. Avec votre retard L={L}j, la résonance atmosphérique z est statistiquement attendue vers le {date}.",
      default: "Analyse en temps réel pour {country} : signal de {val}% détecté pour {activeDecade}."
    }
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
    event_stream: "EVENT FLOW",
    no_witness: "No witness point for this decade.",
    field_indicators: "FIELD INDICATORS",
    psy_title: "Psychology (ε)",
    atm_title: "Atmosphere (z)",
    convergence_tracks: "CONVERGENCE TRACKS",
    convergence_info_title: "What is convergence?",
    convergence_info_sci: "Statistical identification of a recurring atmospheric pattern (anomaly) following a similar psycho-emotional pulse.",
    convergence_info_eli5: "Direct causality is not yet established. However, if a recurring collective emotional intensity is systematically correlated with a specific atmospheric pattern, the algorithm compiles this coincidence. This identifies the potential correspondence between human mindsets and atmospheric tensions.",
    stat_goal: "Statistical goal: Detect if psycho-social shocks produce meteorological phenomena.",
    deep_analysis: "DEEP ANALYSIS: 50-YEAR TREND",
    anomalies_recurrent: "Recurrent Post-Shock Anomalies",
    natural_noise: "NATURAL NOISE",
    post_shock_signal: "POST-SHOCK SIGNAL",
    avg_delay: "Avg Delay",
    convergence_point: "CONVERGENCE POINT",
    calibration_source: "Calibration: 1991-2020 Seasonal Normals // Source: Copernicus ERA5.",
    global_ci: "GLOBAL CI",
    delay_L_days: "Delay L (Days)",
    delay_L_sci: "Temporal lag between psychic pulse and atmospheric response.",
    delay_L_eli5: "Like an echo in mountains: your cries (emotions) take time to return as wind (climate).",
    tau_phase: "Tau (Phase)",
    tau_sci: "Time decay constant of psychic influence on the system.",
    tau_eli5: "Like drawing in sand: the higher this setting, the longer it takes for your emotion to fade.",
    alpha_balance: "Alpha (Balance)",
    alpha_sci: "Weighting adjustment between fast and slow response modes.",
    alpha_eli5: "Like choosing between a sparkling battery (fast) and a giant wave (slow). Alpha decides who wins.",
    export_raw_data: "Export raw data (CSV)",
    superposition_phases: "Phase Superposition (Sync-Check)",
    no_major_event: "No major events detected for this period.",
    statistical_deviation: "Statistical Deviation",
    consult_wikipedia: "Consult Wikipedia source",
    singularity: "Singularity",
    impulse: "Impulse",
    response: "Response",
    computer_calculated_deviation: "The computer calculated a deviation of",
    just_after: "just after",
    zone: "ZONE",
    duration: "DURATION",
    delta: "DELTA",
    responses: {
      low: "At {val}%, the index is statistically 'low' but scientifically major. This is the signature of an emerging informational bridge.",
      high: "With {val}%, the signal is clear: the psycho-atmospheric system is entering coherence.",
      europe: "Transcontinental convergence is {val}%. Coupling is a coherent geosystemic layer.",
      how: "My role is to measure synchronization between Collective Attention (ε) and atmospheric z-scores (z).",
      compare: "Analysis complete for {country}. Index: {ci}.",
      pattern: "Pattern extraction ({activeDecade}): {val}% convergence recurrence detected.",
      weather: "Coupling can manifest through these extremes (heat domes or flash floods).",
      history: "The 50-year baseline (1975-2025) confirms that current {val}% is a massive anomaly.",
      sept11: "In 2001, the 14.1% anomaly followed the September 11 attacks.",
      covid: "2020 is the 'Great Silence'. With 18.4% coupling, it's the purest episode ever recorded.",
      threshold: "The 12% threshold has been crossed 4 times. Historical peak 18.4% in winter 2020.",
      war: "The Kernel operates on a non-local network. A conflict can generate informational stress in {country}.",
      eli5_general: "Imagine the atmosphere is a drum: your emotions are the stick hitting it.",
      elaborate: "The {val}% I observe on {country} is not a simple misread. It's what we call a 'resonance layer'.",
      documentation: "Consolidated documentation: My calculations on {country} show a CI index of {ci}.",
      condition: "Analysis of ε field on {country}: With {val}% coupling, psyche starts 'driving' wind structure.",
      methodo: "Unlike NWP models, I calculate coupling via z-scores in {country}. Transition zone at {val}%.",
      status: "Kernel v4.2 operational. Channel {country}. CI={ci}.",
      projection: "🌀 FORECAST : A psychic shock ε was detected today. With your delay L={L}d, the atmospheric resonance z is statistically expected around {date}.",
      default: "Real-time analysis for {country}: {val}% signal detected for {activeDecade}."
    }
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
      const r = TRANSLATIONS[lang].responses;
      
      if (lower.includes("prévision") || lower.includes("forecast") || lower.includes("suite") || lower.includes("next")) {
        const projectedDate = new Date(liveTime.getTime() + (params.L * 24 * 60 * 60 * 1000));
        const dateStr = projectedDate.toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-US');
        response = r.projection.replace('{L}', params.L.toString()).replace('{date}', dateStr);
      } else if (lower.includes("faible") || lower.includes("bas") || lower.includes("low") || lower.includes("7%")) {
        response = globalVal < 10 ? r.low.replace('{val}', globalVal.toFixed(2)) : r.high.replace('{val}', globalVal.toFixed(2));
      } else if (lower.includes("europe") || lower.includes("global") || lower.includes("world") || lower.includes("mond") || lower.includes("tout") || lower.includes("continent")) {
        response = r.europe.replace('{val}', globalVal.toFixed(2));
      } else if (lower.includes("pourquoi") || lower.includes("comment") || lower.includes("expliq") || lower.includes("why") || lower.includes("how")) {
        response = r.how;
      } else if (lower.includes("comparer") || lower.includes("compare")) {
        response = r.compare.replace('{country}', selectedCountry).replace('{ci}', computed.countries[selectedCountry].ci_series[currentTimeIndex].toFixed(4));
      } else if (lower.includes("motif") || lower.includes("pattern")) {
        response = r.pattern.replace('{val}', globalVal.toFixed(1)).replace('{activeDecade}', activeDecade);
      } else if (lower.includes("cheresse") || lower.includes("inond") || lower.includes("climate") || lower.includes("weather") || lower.includes("extreme") || lower.includes("pluie") || lower.includes("chaud")) {
        response = r.weather;
      } else if (lower.includes("50 ans") || lower.includes("50 year") || lower.includes("history") || lower.includes("logs") || lower.includes("comparaison") || lower.includes("référentiel")) {
        response = r.history.replace('{val}', globalVal.toFixed(2));
      } else if (lower.includes("2001") || lower.includes("september")) {
        response = r.sept11;
      } else if (lower.includes("2020") || lower.includes("confinement") || lower.includes("covid")) {
        response = r.covid;
      } else if (lower.includes("12%") || lower.includes("passé") || lower.includes("déjà produit") || lower.includes("histoire")) {
        response = r.threshold;
      } else if (lower.includes("guerre") || lower.includes("conflit") || lower.includes("lointain") || lower.includes("war")) {
        response = r.war.replace('{country}', selectedCountry);
      } else if (lower.includes("5 ans") || lower.includes("enfant") || lower.includes("métaphore") || lower.includes("simple") || lower.includes("explain like i'm 5")) {
        response = r.eli5_general;
      } else if (lower.includes("développe") || lower.includes("précise") || lower.includes("détail") || lower.includes("en quoi") || lower.includes("pourquoi") || lower.includes("elaborate")) {
        response = r.elaborate.replace('{val}', globalVal.toFixed(2)).replace('{country}', selectedCountry);
      } else if (lower.includes("documente") || lower.includes("preuve") || lower.includes("source") || lower.includes("référence") || lower.includes("proof")) {
        response = r.documentation.replace('{country}', selectedCountry).replace('{ci}', computed.countries[selectedCountry].ci_series[currentTimeIndex].toFixed(3));
      } else if (lower.includes("condition") || lower.includes("état") || lower.includes("population") || lower.includes("colère") || lower.includes("angoisse") || lower.includes("tristesse") || lower.includes("anger") || lower.includes("anxiety")) {
        response = r.condition.replace('{country}', selectedCountry).replace('{val}', globalVal.toFixed(2));
      } else if (lower.includes("météo") || lower.includes("climat") || lower.includes("prévision") || lower.includes("forecast") || lower.includes("weather")) {
        response = r.methodo.replace('{country}', selectedCountry).replace('{val}', globalVal.toFixed(2));
      } else if (lower.includes("diag") || lower.includes("status")) {
        response = r.status.replace('{country}', selectedCountry).replace('{ci}', computed.countries[selectedCountry].ci_series[currentTimeIndex].toFixed(5));
      } else {
        response = r.default.replace('{country}', selectedCountry).replace('{val}', globalVal.toFixed(2)).replace('{activeDecade}', activeDecade);
      }
      setMessages(prev => [...prev, { role: 'bot', text: response }]);
      setIsThinking(false);
    }, 450);
  };

  if (loading || !rawData || !computed.countries) {
    return (
      <div style={{ height: '100vh', width: '100vw', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="accent mono uppercase" style={{ letterSpacing: '4px' }}>{t('initializing')}</div>
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
              <span className="text-accent" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{liveTime.toLocaleTimeString(lang === 'FR' ? 'fr-FR' : 'en-US')}</span>
              <span style={{ fontSize: '0.6rem' }}>{liveTime.toLocaleDateString(lang === 'FR' ? 'fr-FR' : 'en-US')}</span>
            </div>
            <span className="accent">|</span>
            <div className="flex gap-2">
              {t('global_ci')}: <span className="text-accent">{computed.ci_global_series?.[currentTimeIndex]?.toFixed(4) || '0.0000'}</span>
            </div>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <section>
          <h3><Settings size={14} /> {lang === 'FR' ? 'CONTRÔLE DYNAMIQUE' : 'DYNAMIC CONTROL'}</h3>
          <div className="card">
            <div className="flex justify-between mb-1">
              <span className="small uppercase mono text-dim">
                {t('delay_L_days')}
                <InfoIcon 
                  title={t('delay_L_days')}
                  sci={t('delay_L_sci')}
                  eli5={t('delay_L_eli5')} 
                />
              </span>
              <span className="text-accent mono small">{params.L}j</span>
            </div>
            <input type="range" min="0" max="14" step="1" value={params.L} 
              onChange={e => setParams({...params, L: parseInt(e.target.value)})} />
            
            <div className="flex justify-between mb-1 mt-4">
              <span className="small uppercase mono text-dim">
                {t('tau_phase')}
                <InfoIcon 
                  title={t('tau_phase')}
                  sci={t('tau_sci')}
                  eli5={t('tau_eli5')}
                />
              </span>
              <span className="text-accent mono small">{params.tau1}j</span>
            </div>
            <input type="range" min="1" max="30" step="1" value={params.tau1} 
              onChange={e => setParams({...params, tau1: parseInt(e.target.value)})} />

            <div className="flex justify-between mb-1 mt-4">
              <span className="small uppercase mono text-dim">
                {t('alpha_balance')}
                <InfoIcon 
                  title={t('alpha_balance')}
                  sci={t('alpha_sci')}
                  eli5={t('alpha_eli5')}
                />
              </span>
              <span className="text-accent mono small">{params.a}</span>
            </div>
            <input type="range" min="0" max="1" step="0.1" value={params.a} 
              onChange={e => setParams({...params, a: parseFloat(e.target.value)})} />
          </div>
        </section>

        <section>
          <h3><Globe size={14} /> {lang === 'FR' ? 'RÉSEAU DE CAPTEURS' : 'SENSOR NETWORK'}</h3>
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
            <button onClick={() => downloadCSV(currentCountry, selectedCountry)} className="icon-btn" title={t('export_raw_data')}>
              <Download size={20} />
            </button>
          </div>
        </section>

        <section>
          <h3><Zap size={14} /> {t('field_indicators')}</h3>
          <div className="flex flex-col gap-2">
            <div className={`card cursor-pointer ${indicator === 'psy_res' ? 'accent' : ''}`} style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setIndicator('psy_res')}>
              <div className="flex items-center gap-3">
                <Users size={16} /> 
                <div className="flex flex-col">
                  <span className="mono small uppercase">{t('psy_title')}</span>
                  <span className="mono text-accent">{currentCountry.psy_res[currentTimeIndex].toFixed(3)}</span>
                </div>
              </div>
              <Sparkline data={currentCountry.psy_res.slice(Math.max(0, currentTimeIndex - 15), currentTimeIndex + 1)} color="var(--text-accent)" />
            </div>
            <div className={`card cursor-pointer ${indicator === 'atm' ? 'accent' : ''}`} style={{ padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setIndicator('atm')}>
              <div className="flex items-center gap-3">
                <Thermometer size={16} /> 
                <div className="flex flex-col">
                  <span className="mono small uppercase">{t('atm_title')}</span>
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
                    <span className="mono small uppercase">{t('coupling_index')}</span>
                    <span className="mono text-accent">{currentCountry.ci_series[currentTimeIndex].toFixed(4)}</span>
                  </div>
                </div>
                {indicator !== 'ci' && <Sparkline data={currentCountry.ci_series.slice(Math.max(0, currentTimeIndex - 15), currentTimeIndex + 1)} color="var(--text-accent)" />}
              </div>
              {indicator === 'ci' && (
                <div className="mt-2">
                  <div className="mono small text-dim uppercase mb-1" style={{ fontSize: '0.6rem' }}>{t('superposition_phases')}</div>
                  <SignalSync 
                    psy={currentCountry.psy_res.slice(Math.max(0, currentTimeIndex - 20), currentTimeIndex + 1)} 
                    atm={currentCountry.atm.slice(Math.max(0, currentTimeIndex - 20), currentTimeIndex + 1)} 
                    t={t}
                  />
                  <div className="mono small text-accent mt-2 animate-pulse" style={{ fontSize: '0.6rem' }}>
                    {currentCountry.ci_series[currentTimeIndex] > 0.1 ? t('coupling_active') : t('searching_convergence')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section>
          <h3><Activity size={14} /> {lang === 'FR' ? 'FLUX D\'ÉVÉNEMENTS' : 'EVENT FLOW'}</h3>
          <div className="flex flex-col gap-2">
            {activeEvents.length > 0 ? activeEvents.map((e: any, i: number) => (
              <div key={i} className="card" style={{ padding: '8px', borderLeft: `2px solid ${e.type === 'psy' ? '#60a5fa' : '#fb923c'}` }}>
                <div className="mono" style={{ fontSize: '0.65rem', opacity: 0.6 }}>{e.date} // {e.type.toUpperCase()}</div>
                <div className="mono small uppercase mt-1">{e.label}</div>
              </div>
            )) : (
              <div className="mono small text-dim italic" style={{ padding: '10px' }}>{t('no_major_event')}</div>
            )}
          </div>
        </section>

        <section>
          <h3>
            <Zap size={14} /> {t('convergence_tracks')}
            <InfoIcon 
              title={t('convergence_info_title')}
              sci={t('convergence_info_sci')}
              eli5={t('convergence_info_eli5')}
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
                      href={`https://${lang === 'FR' ? 'fr' : 'en'}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(p.label + ' ' + p.event)}`} 
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
              {t('stat_goal')}
            </div>
          </div>
        </section>

        <section>
          <h3><Globe size={14} /> {t('deep_analysis')}</h3>
          <div className="card" style={{ padding: '12px', background: 'rgba(56, 189, 248, 0.05)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div className="mono small text-accent mb-3 uppercase" style={{ fontSize: '0.65rem' }}>{t('anomalies_recurrent')} ({histData?.total_events_scanned || 0} {lang === 'FR' ? 'événements' : 'events'})</div>
            {histData?.patterns.map((p: any, i: number) => (
              <div key={i} className="mb-4">
                <div className="flex justify-between mono small mb-1">
                  <span className="uppercase">{p.label}</span>
                  <span className="text-accent">{p.recurrence}%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{ width: `${p.recurrence}%`, height: '100%', background: 'var(--text-accent)', borderRadius: '2px', boxShadow: '0 0 10px var(--text-accent)' }} />
                  {/* Baseline marker (Bruit naturel) */}
                  <div title={t('natural_noise')} style={{ position: 'absolute', left: `${p.baseline}%`, top: 0, bottom: 0, width: '2px', background: '#ef4444', zIndex: 2 }} />
                </div>
                
                <div className="flex justify-between items-center mt-2">
                   <div className="mono small uppercase" style={{ fontSize: '0.55rem', color: '#fbbf24' }}>
                     <Clock size={10} style={{ verticalAlign: 'middle', marginRight: '4px' }}/>
                     {t('avg_delay')} : {p.avg_delay}
                   </div>
                   {p.recurrence > p.baseline * 3 && (
                     <div className="mono small uppercase p-1" style={{ fontSize: '0.5rem', background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80', borderRadius: '2px', border: '1px solid #4ade80' }}>
                       {t('convergence_point')}
                     </div>
                   )}
                </div>
                
                <div className="mono text-dim mt-2" style={{ fontSize: '0.55rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
                  <span style={{ color: '#ef4444' }}>{t('natural_noise')}: {p.baseline}%</span> | <span style={{ color: 'var(--text-accent)' }}>{t('post_shock_signal')}: {p.recurrence}%</span>
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
                          <div title={t('statistical_deviation')} style={{ fontSize: '0.45rem', padding: '1px 4px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', borderRadius: '2px', border: '1px solid #ef4444' }}>
                            {me.rarity}
                          </div>
                          <a 
                            href={`https://${lang === 'FR' ? 'fr' : 'en'}.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(me.label)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-dim hover:text-accent transition-colors"
                            title={t('consult_wikipedia')}
                          >
                            <Info size={12} />
                          </a>
                          <InfoIcon 
                            title={`${t('singularity')} : ${me.label}`}
                            sci={`${t('impulse')} : ${me.event_desc} // ${t('response')} : ${me.climate_desc}`}
                            eli5={`${t('computer_calculated_deviation')} ${me.rarity} (rare) ${t('just_after')} '${me.label}'.`}
                          />
                        </div>
                      </div>
                      <div className="mono text-dim" style={{ fontSize: '0.55rem' }}>
                        {t('zone')}: <span style={{ color: '#fff' }}>{me.country}</span> | 
                        {t('duration')}: <span style={{ color: '#fff' }}>{me.duration}</span> | 
                        {t('delta')}: <span style={{ color: '#fbbf24' }}>{me.delta}</span>
                      </div>
                    </div>
                  ))}
                  {p.matching_events?.filter((me: any) => me.date.startsWith(activeDecade.slice(0, 3))).length === 0 && (
                    <div className="mono text-dim italic" style={{ fontSize: '0.5rem', opacity: 0.5 }}>{t('no_witness')}</div>
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
