import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Briefcase, MapPin, Clock, DollarSign, Users, Heart,
  Code2, Brain, Shield, Package, Eye, Scale, ChevronDown,
  ChevronUp, Send, CheckCircle, Globe, Laptop, Coffee,
  Layers, Zap, BookOpen, Music, MessageSquare, Star,
  ArrowRight, UserCheck, BarChart3, Cpu
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  remote: boolean;
  salary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  stack?: string;
  level: string;
}

const JOBS: Job[] = [
  {
    id: 'backend-senior',
    title: 'Ingénieur Backend Senior',
    department: 'Ingénierie',
    location: 'Paris / Remote',
    type: 'CDI',
    remote: true,
    salary: '65 000 – 90 000 €',
    level: 'Senior',
    stack: 'Node.js · TypeScript · PostgreSQL · Redis · Kafka',
    description: 'Concevoir et maintenir les APIs core de Goroti : upload vidéo, streaming, paiements, analytics temps réel. Vous serez au centre des décisions techniques.',
    responsibilities: [
      'Concevoir les APIs RESTful et GraphQL pour les fonctions critiques',
      'Optimiser les pipelines d\'upload et d\'encodage vidéo',
      'Maintenir et améliorer le système de paiements et wallet',
      'Participer aux décisions d\'architecture avec l\'équipe',
      'Contribuer aux revues de code et au mentoring des juniors',
    ],
    requirements: ['Node.js / TypeScript avancé', 'PostgreSQL + Redis', 'Architecture microservices', '3+ ans d\'expérience backend', 'Expérience streaming vidéo appréciée'],
  },
  {
    id: 'ai-engineer',
    title: 'Ingénieur IA / Data',
    department: 'Intelligence Artificielle',
    location: 'Remote',
    type: 'CDI',
    remote: true,
    salary: '70 000 – 100 000 €',
    level: 'Senior',
    stack: 'Python · PyTorch · TensorFlow · Apache Spark · MLflow',
    description: 'Développer les systèmes de recommandation, détection de contenu, modération automatique et analytiques prédictives. L\'IA est au cœur de notre produit.',
    responsibilities: [
      'Développer et maintenir les modèles de recommandation de contenu',
      'Construire les pipelines de détection de contenu inapproprié',
      'Mettre en production et monitorer les modèles ML',
      'Analyser les données de comportement utilisateur',
      'Collaborer avec le Product pour définir les features IA',
    ],
    requirements: ['Python + PyTorch/TensorFlow', 'MLOps & pipelines data', 'NLP et vision par ordinateur', 'Expérience production ML', 'Kafka / Spark appréciés'],
  },
  {
    id: 'security-payments',
    title: 'Ingénieur Sécurité Paiements',
    department: 'Sécurité',
    location: 'Paris',
    type: 'CDI',
    remote: false,
    salary: '75 000 – 105 000 €',
    level: 'Expert',
    stack: 'PCI-DSS · KYC/AML · Cryptographie · OWASP',
    description: 'Sécuriser l\'infrastructure de paiement, implémenter KYC/AML, auditer les transactions et protéger contre la fraude. Poste critique dans notre infrastructure.',
    responsibilities: [
      'Implémenter et maintenir les protocoles KYC/AML',
      'Auditer l\'infrastructure de paiement (PCI-DSS)',
      'Concevoir les systèmes de détection de fraude',
      'Gérer les incidents de sécurité paiement',
      'Assurer la conformité avec les régulateurs financiers',
    ],
    requirements: ['PCI-DSS / PSD2', 'Analyse de fraude transactionnelle', 'Cryptographie appliquée', 'CISSP / CEH appréciés', '5+ ans sécurité financière'],
  },
  {
    id: 'product-creator',
    title: 'Product Manager — Creator Tools',
    department: 'Produit',
    location: 'Paris / Remote',
    type: 'CDI',
    remote: true,
    salary: '60 000 – 80 000 €',
    level: 'Confirmé',
    stack: 'Figma · Notion · Analytics · SQL (bases)',
    description: 'Définir la roadmap des outils créateurs : studio, monétisation, analytics, upload. Vous êtes l\'interface entre les créateurs et l\'engineering.',
    responsibilities: [
      'Définir et prioriser la roadmap Creator Studio',
      'Conduire les interviews utilisateurs avec les créateurs',
      'Rédiger les specs et user stories pour l\'engineering',
      'Analyser les métriques d\'adoption des features',
      'Représenter les créateurs dans les décisions produit',
    ],
    requirements: ['2+ ans PM plateforme créateur ou media', 'Aisance technique et analytique', 'Capacité à prioriser avec données', 'Anglais courant', 'Connaissance du marché créateur'],
  },
  {
    id: 'trust-safety',
    title: 'Responsable Trust & Safety',
    department: 'Trust & Safety',
    location: 'Paris',
    type: 'CDI',
    remote: false,
    salary: '45 000 – 60 000 €',
    level: 'Confirmé',
    description: 'Superviser la politique de modération, former les équipes, gérer les escalades complexes et travailler sur les guidelines de contenu.',
    responsibilities: [
      'Définir et maintenir les politiques de contenu de la plateforme',
      'Former et superviser l\'équipe de modération',
      'Traiter les escalades et cas complexes',
      'Travailler avec Legal sur les obligations DSA/LCEN',
      'Produire les rapports de transparence trimestriels',
    ],
    requirements: ['Expérience modération plateforme 2+ ans', 'Connaissance DSA / LCEN', 'Gestion d\'équipe et de crise', 'Résilience face au contenu difficile', 'Anglais professionnel'],
  },
  {
    id: 'creator-success',
    title: 'Creator Success Manager',
    department: 'Creator Success',
    location: 'Paris / Remote',
    type: 'CDI',
    remote: true,
    salary: '38 000 – 52 000 €',
    level: 'Junior / Confirmé',
    description: 'Accompagner les créateurs dans leur croissance sur Goroti : onboarding, monétisation, optimisation. Vous êtes leur premier point de contact stratégique.',
    responsibilities: [
      'Onboarder les nouveaux créateurs stratégiques',
      'Conseiller sur les stratégies de monétisation',
      'Analyser les performances et proposer des optimisations',
      'Organiser des workshops et webinaires créateurs',
      'Remonter les retours terrain au Product',
    ],
    requirements: ['Connaissance de l\'écosystème créateur', 'Aisance relationnelle et pédagogique', 'Analytique (Google Analytics, Tableau)', 'Expérience community ou customer success', 'Passion pour le contenu numérique'],
  },
  {
    id: 'legal-media',
    title: 'Juriste Droit des Médias & IP',
    department: 'Juridique',
    location: 'Paris',
    type: 'CDI',
    remote: false,
    salary: '55 000 – 75 000 €',
    level: 'Confirmé / Senior',
    description: 'Gérer les contrats créateurs/labels, droits voisins, DMCA, conformité RGPD et relations avec les sociétés de gestion collective.',
    responsibilities: [
      'Rédiger et négocier les contrats créateurs, labels et partenaires',
      'Gérer les procédures DMCA et contestations',
      'Assurer la conformité RGPD et DSA',
      'Coordonner avec SACEM, SCPA et sociétés de gestion',
      'Veille juridique sur le droit des médias numériques',
    ],
    requirements: ['Master droit propriété intellectuelle ou médias', 'Contrats musicaux et audiovisuels', 'Anglais juridique courant', 'SACEM/SCPA appréciée', 'RGPD et DSA'],
  },
];

const DEPARTMENTS: Record<string, { icon: React.ElementType; color: string }> = {
  'Ingénierie': { icon: Code2, color: 'text-blue-400' },
  'Intelligence Artificielle': { icon: Brain, color: 'text-cyan-400' },
  'Sécurité': { icon: Shield, color: 'text-red-400' },
  'Produit': { icon: Package, color: 'text-yellow-400' },
  'Trust & Safety': { icon: Eye, color: 'text-orange-400' },
  'Creator Success': { icon: Star, color: 'text-green-400' },
  'Juridique': { icon: Scale, color: 'text-gray-400' },
};

const TEAMS = [
  { icon: Cpu, color: 'text-blue-400', label: 'Produit & UX', desc: 'Experience créateur, interface, design system, analytics produit' },
  { icon: Code2, color: 'text-cyan-400', label: 'Infrastructure', desc: 'Backend, streaming, encodage, CDN, base de données' },
  { icon: Shield, color: 'text-red-400', label: 'Trust & Safety', desc: 'Modération, conformité DSA, signalement, politiques contenu' },
  { icon: DollarSign, color: 'text-green-400', label: 'Paiement & Finance', desc: 'Wallet, KYC, transactions, comptabilité, conformité financière' },
  { icon: Star, color: 'text-yellow-400', label: 'Creator Success', desc: 'Onboarding, accompagnement, croissance, partenariats créateurs' },
  { icon: Brain, color: 'text-orange-400', label: 'Intelligence Artificielle', desc: 'Recommandation, détection, modération auto, analytics prédictifs' },
];

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const dept = DEPARTMENTS[job.department];
  const Icon = dept?.icon ?? Briefcase;

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-start justify-between text-left gap-4 hover:bg-gray-900/20 transition-colors"
      >
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="p-2 bg-gray-800 rounded-lg shrink-0">
            <Icon className={`w-5 h-5 ${dept?.color ?? 'text-gray-400'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-white">{job.title}</h3>
              <span className="px-2 py-0.5 bg-gray-800 text-gray-400 text-xs rounded-full">{job.level}</span>
              {job.remote && (
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 text-xs rounded-full">
                  Remote OK
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><Briefcase className="w-3 h-3" />{job.department}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.type}</span>
              <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{job.salary}</span>
            </div>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-500 shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-500 shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-800 pt-5 space-y-5">
          <p className="text-gray-300 text-sm leading-relaxed">{job.description}</p>

          {job.stack && (
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Stack technique</div>
              <div className="flex flex-wrap gap-2">
                {job.stack.split(' · ').map(tech => (
                  <span key={tech} className="px-2.5 py-1 bg-gray-800 text-gray-300 text-xs rounded-lg">{tech}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Responsabilités</div>
            <ul className="space-y-1.5">
              {job.responsibilities.map(r => (
                <li key={r} className="flex items-start gap-2 text-sm text-gray-400">
                  <ArrowRight className="w-3.5 h-3.5 text-cyan-500 shrink-0 mt-0.5" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Profil recherché</div>
            <ul className="space-y-1.5">
              {job.requirements.map(req => (
                <li key={req} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>

          <button className="flex items-center gap-2 px-5 py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm font-medium transition-colors">
            <Send className="w-4 h-4" />
            Postuler pour ce poste
          </button>
        </div>
      )}
    </div>
  );
}

export default function CareerPage({ onNavigate }: Props) {
  const [selectedDept, setSelectedDept] = useState<string>('Tous');
  const [form, setForm] = useState({ name: '', email: '', role: '', portfolio: '', github: '', availability: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const departments = ['Tous', ...Object.keys(DEPARTMENTS)];
  const filtered = selectedDept === 'Tous' ? JOBS : JOBS.filter(j => j.department === selectedDept);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
              <Users className="w-4 h-4" />
              On recrute — {JOBS.length} postes ouverts
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
              Rejoignez Goroti
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Construisez avec nous la prochaine génération d'infrastructure créative.
              Des défis techniques ambitieux, une mission claire et un impact direct sur les revenus de milliers de créateurs.
            </p>
          </div>
        </div>
      </div>

      {/* 1. Culture */}
      <section className="py-14 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-1">Notre culture</h2>
          <p className="text-gray-400 text-sm mb-8">Ce qui guide notre façon de travailler au quotidien</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Heart,
                color: 'text-red-400',
                title: 'Creator-first',
                desc: 'Chaque décision est testée contre une question simple : est-ce que ça aide les créateurs à gagner leur vie ? Le produit est notre principale arène.',
              },
              {
                icon: Globe,
                color: 'text-cyan-400',
                title: 'Transparence radicale',
                desc: 'Les métriques, revenus, décisions stratégiques et erreurs sont partagés avec toute l\'équipe. Pas de silos, pas d\'informations réservées aux managers.',
              },
              {
                icon: Laptop,
                color: 'text-blue-400',
                title: 'Travail asynchrone',
                desc: 'La qualité du travail, pas les heures de présence. Documentation exhaustive, réunions rares et utiles. On livre, on mesure, on itère.',
              },
            ].map(({ icon: Icon, color, title, desc }) => (
              <div key={title} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="p-3 bg-gray-800 rounded-lg w-fit mb-4">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 p-5 bg-gray-900/30 border border-gray-800 rounded-xl">
            <h3 className="font-semibold text-white mb-3 text-sm">Notre éthique produit</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {[
                'Nous ne construisons pas de dark patterns ou de mécaniques addictives',
                'Les décisions de modération ont toujours une base légale documentée',
                'Nous ne vendons jamais les données utilisateurs à des tiers',
                'L\'équipe peut refuser de travailler sur une feature contraire à nos valeurs',
              ].map(point => (
                <div key={point} className="flex gap-2 text-xs text-gray-400">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  {point}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Organisation interne */}
      <section className="py-14 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-1">Organisation interne</h2>
          <p className="text-gray-400 text-sm mb-8">Les équipes et leurs rôles dans la construction de Goroti</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TEAMS.map(({ icon: Icon, color, label, desc }) => (
              <div key={label} className="flex gap-3 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="p-2 bg-gray-800 rounded-lg shrink-0 h-fit">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <div>
                  <div className="font-medium text-white text-sm mb-0.5">{label}</div>
                  <div className="text-gray-500 text-xs leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Conditions & avantages */}
      <section className="py-14 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-1">Conditions & avantages</h2>
          <p className="text-gray-400 text-sm mb-8">Ce que vous pouvez attendre en rejoignant l'équipe</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe, label: 'Full Remote', detail: 'Pour la majorité des postes, depuis n\'importe où en Europe' },
              { icon: Zap, label: 'Horaires flexibles', detail: 'Pas d\'horaires fixes. On mesure ce qui est livré, pas les heures' },
              { icon: Coffee, label: 'Budget équipement', detail: '1 500€ à l\'intégration pour Mac, clavier, etc.' },
              { icon: Heart, label: 'Mutuelle premium', detail: 'Alan Gold (ou équivalent selon pays) pour vous et famille' },
              { icon: BookOpen, label: 'Budget formation', detail: '1 000€/an : conférences, livres, formations en ligne' },
              { icon: Clock, label: 'Congés flexibles', detail: 'RTT illimités sur validation manager — aucune comptabilité' },
              { icon: Star, label: 'Accès Goroti Premium', detail: 'Compte Premium offert + accès aux contenus créateurs' },
              { icon: DollarSign, label: 'Stock-options', detail: 'BSPCE pour les profils seniors. Participation à la croissance' },
            ].map(({ icon: Icon, label, detail }) => (
              <div key={label} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <Icon className="w-5 h-5 text-cyan-400 mb-2" />
                <div className="font-medium text-white text-sm mb-1">{label}</div>
                <div className="text-gray-500 text-xs leading-relaxed">{detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <h3 className="font-semibold text-white text-sm mb-2">Remote & hybride</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                La majorité des postes sont full remote (UE). Les postes liés à la sécurité financière
                et à la modération nécessitent une présence Paris pour des raisons légales et opérationnelles.
                Des réunions d'équipe trimestrielles sont organisées en présentiel (frais pris en charge).
              </p>
            </div>
            <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
              <h3 className="font-semibold text-white text-sm mb-2">Rémunération</h3>
              <p className="text-gray-400 text-xs leading-relaxed">
                Salaires revus annuellement avec entretien dédié. Fourchettes affichées sur les offres
                sans ambiguïté. Bonus performance semi-annuel pour les profils seniors basé sur métriques
                d'équipe, pas d'évaluation individuelle uniquement.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Postes ouverts */}
      <section className="py-14 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white">Postes ouverts</h2>
            <span className="text-gray-500 text-sm">{filtered.length} / {JOBS.length} poste{JOBS.length > 1 ? 's' : ''}</span>
          </div>
          <p className="text-gray-400 text-sm mb-6">Cliquez sur un poste pour voir la description complète</p>

          <div className="flex flex-wrap gap-2 mb-6">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  selectedDept === dept
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {dept}
                {dept === 'Tous' ? ` (${JOBS.length})` : ` (${JOBS.filter(j => j.department === dept).length})`}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* 5. Candidature spontanée */}
      <section className="py-14">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-1">Candidature spontanée</h2>
          <p className="text-gray-400 text-sm mb-8">Vous ne trouvez pas le bon poste ? Envoyez-nous votre profil complet.</p>

          {submitted ? (
            <div className="p-10 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">Candidature reçue</h3>
              <p className="text-gray-400 text-sm">Nous vous répondrons sous 5 jours ouvrés avec un retour honnête.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                    placeholder="Marie Dupont"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email *</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                    placeholder="marie@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Poste / domaine visé *</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="Ex: Développeur frontend, Community Manager..."
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Portfolio / site perso</label>
                  <input
                    type="url"
                    value={form.portfolio}
                    onChange={e => setForm({ ...form, portfolio: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                    placeholder="https://monsite.fr"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">GitHub / LinkedIn</label>
                  <input
                    type="url"
                    value={form.github}
                    onChange={e => setForm({ ...form, github: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Disponibilité</label>
                <input
                  type="text"
                  value={form.availability}
                  onChange={e => setForm({ ...form, availability: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="Ex: Immédiate, 1 mois de préavis, 3 mois..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Lettre de motivation *</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500 text-sm resize-none"
                  placeholder="Parlez-nous de vous, de vos expériences et de pourquoi Goroti spécifiquement..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Envoyer ma candidature
              </button>
              <p className="text-gray-600 text-xs text-center">
                Vos données sont utilisées uniquement pour le recrutement et supprimées après 6 mois sans suite.
              </p>
            </form>
          )}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
