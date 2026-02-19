import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Briefcase, MapPin, Clock, DollarSign, Users, Heart,
  Code2, Brain, Shield, Package, Eye, Scale, ChevronDown,
  ChevronUp, Send, CheckCircle, Globe, Laptop, Coffee
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
  requirements: string[];
}

const JOBS: Job[] = [
  {
    id: 'backend-1',
    title: 'Ingénieur Backend Senior',
    department: 'Ingénierie',
    location: 'Paris / Remote',
    type: 'CDI',
    remote: true,
    salary: '65 000 – 90 000 €',
    description: 'Concevoir et maintenir les APIs core de TruTube : upload vidéo, streaming, paiements, analytics temps réel.',
    requirements: ['Node.js / TypeScript avancé', 'PostgreSQL + Redis', 'Architecture microservices', '3+ ans expérience']
  },
  {
    id: 'ai-1',
    title: 'Ingénieur IA / Data',
    department: 'Intelligence Artificielle',
    location: 'Remote',
    type: 'CDI',
    remote: true,
    salary: '70 000 – 100 000 €',
    description: 'Développer les systèmes de recommandation, détection de contenu, modération automatique et analytiques prédictives.',
    requirements: ['Python + PyTorch/TensorFlow', 'MLOps & pipelines data', 'NLP et vision par ordinateur', 'Expérience production ML']
  },
  {
    id: 'security-1',
    title: 'Ingénieur Sécurité Paiements',
    department: 'Sécurité',
    location: 'Paris',
    type: 'CDI',
    remote: false,
    salary: '75 000 – 105 000 €',
    description: 'Sécuriser l\'infrastructure de paiement, implémenter KYC/AML, auditer les transactions et protéger contre la fraude.',
    requirements: ['PCI-DSS / PSD2', 'Analyse de fraude', 'Cryptographie appliquée', 'Certifications sécurité appréciées']
  },
  {
    id: 'product-1',
    title: 'Product Manager — Creator Tools',
    department: 'Produit',
    location: 'Paris / Remote',
    type: 'CDI',
    remote: true,
    salary: '60 000 – 80 000 €',
    description: 'Définir la roadmap des outils créateurs : studio, monétisation, analytics, upload. Interface entre créateurs et engineering.',
    requirements: ['2+ ans PM en plateforme créateur ou media', 'Aisance technique', 'Capacité à prioriser ruthlessly', 'Anglais courant']
  },
  {
    id: 'moderation-1',
    title: 'Responsable Modération Contenu',
    department: 'Trust & Safety',
    location: 'Paris',
    type: 'CDI',
    remote: false,
    salary: '42 000 – 55 000 €',
    description: 'Superviser la politique de modération, former les équipes, gérer les escalades complexes et travailler sur les guidelines.',
    requirements: ['Expérience modération plateforme', 'Connaissance DSA / LCEN', 'Gestion de crise', 'Résistance au contenu difficile']
  },
  {
    id: 'legal-1',
    title: 'Juriste Droit des Médias',
    department: 'Juridique',
    location: 'Paris',
    type: 'CDI',
    remote: false,
    salary: '55 000 – 75 000 €',
    description: 'Gérer les contrats créateurs/labels, droits voisins, DMCA, conformité RGPD et relations avec les sociétés de gestion collective.',
    requirements: ['Master droit de la propriété intellectuelle', 'Contrats musicaux et audiovisuels', 'Anglais juridique', 'SACEM/SCPA appréciée']
  }
];

const DEPARTMENTS: Record<string, { icon: React.ElementType; color: string }> = {
  'Ingénierie': { icon: Code2, color: 'text-blue-400' },
  'Intelligence Artificielle': { icon: Brain, color: 'text-purple-400' },
  'Sécurité': { icon: Shield, color: 'text-red-400' },
  'Produit': { icon: Package, color: 'text-yellow-400' },
  'Trust & Safety': { icon: Eye, color: 'text-orange-400' },
  'Juridique': { icon: Scale, color: 'text-green-400' },
};

function JobCard({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  const dept = DEPARTMENTS[job.department];
  const Icon = dept?.icon ?? Briefcase;

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-colors">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-5 flex items-start justify-between text-left gap-4"
      >
        <div className="flex items-start gap-4">
          <div className={`p-2 bg-gray-800 rounded-lg shrink-0`}>
            <Icon className={`w-5 h-5 ${dept?.color ?? 'text-gray-400'}`} />
          </div>
          <div>
            <h3 className="font-semibold text-white mb-1">{job.title}</h3>
            <div className="flex flex-wrap gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" />{job.department}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />{job.location}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />{job.type}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5" />{job.salary}
              </span>
              {job.remote && (
                <span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs">
                  Remote OK
                </span>
              )}
            </div>
          </div>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0 mt-1" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0 mt-1" />}
      </button>
      {open && (
        <div className="px-6 pb-6 border-t border-gray-800 pt-5">
          <p className="text-gray-300 mb-4">{job.description}</p>
          <h4 className="text-sm font-medium text-gray-400 mb-2 uppercase tracking-wider">Profil recherché</h4>
          <ul className="space-y-1.5 mb-5">
            {job.requirements.map((req) => (
              <li key={req} className="flex items-center gap-2 text-sm text-gray-400">
                <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                {req}
              </li>
            ))}
          </ul>
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
  const [form, setForm] = useState({ name: '', email: '', role: '', message: '' });
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
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
            <Users className="w-4 h-4" />
            On recrute
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Rejoignez TruTube
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Construisez avec nous la prochaine génération d'infrastructure créative.
            Des défis techniques ambitieux, une mission claire.
          </p>
        </div>
      </div>

      {/* Culture */}
      <section className="py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-2">Notre culture</h2>
          <p className="text-gray-400 mb-8">Ce qui guide notre façon de travailler au quotidien</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Heart, title: 'Creator-first', desc: 'Chaque décision est testée contre une question simple : est-ce que ça aide les créateurs à gagner leur vie ?', color: 'text-red-400' },
              { icon: Globe, title: 'Transparence radicale', desc: 'Les métriques, revenus et décisions stratégiques sont partagés avec toute l\'équipe. Pas de silos.', color: 'text-cyan-400' },
              { icon: Laptop, title: 'Travail asynchrone', desc: 'La qualité du travail, pas les heures de présence. Documentation exhaustive, réunions rares et utiles.', color: 'text-blue-400' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="p-3 bg-gray-800 rounded-lg w-fit mb-4">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Avantages */}
      <section className="py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-2">Avantages</h2>
          <p className="text-gray-400 mb-8">Ce que vous pouvez attendre en rejoignant l'équipe</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Globe, label: 'Full Remote', detail: 'Pour la majorité des postes' },
              { icon: DollarSign, label: 'Salaires compétitifs', detail: 'Revus annuellement' },
              { icon: Coffee, label: 'Budget équipement', detail: '1 500€ à l\'intégration' },
              { icon: Heart, label: 'Mutuelle premium', detail: 'Alan Gold incluse' },
              { icon: Brain, label: 'Budget formation', detail: '1 000€ / an' },
              { icon: Clock, label: 'Congés flexibles', detail: 'RTT illimités' },
              { icon: Users, label: 'Accès Premium', detail: 'Compte TruTube offert' },
              { icon: Package, label: 'Stock-options', detail: 'BSPCE pour profils seniors' },
            ].map(({ icon: Icon, label, detail }) => (
              <div key={label} className="flex gap-3 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <Icon className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-white text-sm">{label}</div>
                  <div className="text-gray-500 text-xs">{detail}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Postes ouverts */}
      <section className="py-16 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-2">Postes ouverts</h2>
          <p className="text-gray-400 mb-6">{JOBS.length} postes disponibles</p>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedDept === dept
                    ? 'bg-cyan-600 text-white'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filtered.map(job => <JobCard key={job.id} job={job} />)}
          </div>
        </div>
      </section>

      {/* Candidature spontanée */}
      <section className="py-16">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-2">Candidature spontanée</h2>
          <p className="text-gray-400 mb-8">Vous ne trouvez pas le bon poste ? Envoyez-nous votre profil.</p>

          {submitted ? (
            <div className="p-8 bg-green-500/10 border border-green-500/20 rounded-xl text-center">
              <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-white mb-1">Candidature reçue</h3>
              <p className="text-gray-400 text-sm">Nous vous répondrons sous 5 jours ouvrés.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Nom complet</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                    placeholder="Marie Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                    placeholder="marie@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Poste / Domaine visé</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
                  placeholder="Ex: Développeur frontend, Growth..."
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Présentation & motivation</label>
                <textarea
                  rows={5}
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm resize-none"
                  placeholder="Parlez-nous de vous, de vos expériences et de pourquoi TruTube..."
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Envoyer ma candidature
              </button>
            </form>
          )}
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
