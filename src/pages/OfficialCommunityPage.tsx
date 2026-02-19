import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Users, MessageSquare, ExternalLink, Shield, Bell,
  CheckCircle, Globe, Briefcase, Tv, Send, Twitter,
  Instagram, Linkedin, Youtube, Facebook
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

interface SocialNetwork {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  borderColor: string;
  usage: string;
  frequency: string;
  badge?: string;
}

const NETWORKS: SocialNetwork[] = [
  {
    id: 'x',
    name: 'X / Twitter',
    handle: '@TruTubeOfficial',
    url: 'https://x.com/trutube',
    icon: Twitter,
    iconColor: 'text-white',
    bgColor: 'bg-black/60',
    borderColor: 'border-gray-700',
    usage: 'Annonces rapides, mises à jour produit, statuts incidents, réponses support',
    frequency: 'Plusieurs fois / jour',
    badge: 'Principal',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@trutube.official',
    url: 'https://instagram.com/trutube.official',
    icon: Instagram,
    iconColor: 'text-pink-400',
    bgColor: 'bg-pink-950/20',
    borderColor: 'border-pink-900/40',
    usage: 'Mises en avant de créateurs, visuels produit, coulisses équipe',
    frequency: '4–5 fois / semaine',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    handle: '@trutube',
    url: 'https://tiktok.com/@trutube',
    icon: Tv,
    iconColor: 'text-cyan-400',
    bgColor: 'bg-cyan-950/20',
    borderColor: 'border-cyan-900/40',
    usage: 'Promotion produit, tutoriels courts, tendances créateurs',
    frequency: '3–4 fois / semaine',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    handle: 'TruTube Officiel',
    url: 'https://youtube.com/@trutube',
    icon: Youtube,
    iconColor: 'text-red-400',
    bgColor: 'bg-red-950/20',
    borderColor: 'border-red-900/40',
    usage: 'Tutoriels complets, présentations fonctionnalités, interviews créateurs',
    frequency: '1–2 fois / semaine',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'TruTube',
    url: 'https://linkedin.com/company/trutube',
    icon: Linkedin,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-950/20',
    borderColor: 'border-blue-900/40',
    usage: 'Actualités corporate, recrutement, partenariats, études de cas',
    frequency: '3 fois / semaine',
  },
  {
    id: 'discord',
    name: 'Discord',
    handle: 'discord.gg/trutube',
    url: 'https://discord.gg/trutube',
    icon: MessageSquare,
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-950/20',
    borderColor: 'border-blue-900/40',
    usage: 'Communauté créateurs, support rapide, beta-tests, discussions produit',
    frequency: 'En continu',
    badge: 'Communauté',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    handle: '@TruTubeAlerts',
    url: 'https://t.me/trutubealerts',
    icon: Send,
    iconColor: 'text-sky-400',
    bgColor: 'bg-sky-950/20',
    borderColor: 'border-sky-900/40',
    usage: 'Alertes incidents, mises à jour critiques, notifications importantes',
    frequency: 'À la demande',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    handle: 'TruTube',
    url: 'https://facebook.com/trutube',
    icon: Facebook,
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-950/20',
    borderColor: 'border-blue-900/40',
    usage: 'Audience large, événements, groupes fans par univers',
    frequency: '2–3 fois / semaine',
  },
];

const ROLES = [
  {
    icon: Shield,
    color: 'text-red-400',
    title: 'Prévention des faux comptes',
    description: 'Cette page recense UNIQUEMENT les comptes officiels vérifiés de TruTube. Tout compte non listé ici n\'est pas officiel et ne représente pas la plateforme.',
  },
  {
    icon: Bell,
    color: 'text-yellow-400',
    title: 'Canal de communication centralisé',
    description: 'Toutes les annonces importantes (nouvelles fonctionnalités, incidents, mises à jour légales) sont publiées en priorité sur ces canaux.',
  },
  {
    icon: MessageSquare,
    color: 'text-cyan-400',
    title: 'Support alternatif',
    description: 'Pour les questions urgentes, notre équipe est accessible sur Discord et X/Twitter en dehors du support ticketing. Réponse plus rapide pour les situations critiques.',
  },
  {
    icon: Users,
    color: 'text-green-400',
    title: 'Relation avec la communauté',
    description: 'Nos community managers sont actifs quotidiennement pour répondre aux questions, recueillir les retours créateurs et partager les succès de la plateforme.',
  },
];

export default function OfficialCommunityPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-5">
              <Globe className="w-4 h-4" />
              Présence officielle
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              TruTube sur les réseaux sociaux
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              Retrouvez tous les comptes officiels et vérifiés de TruTube. Cette page est la référence
              pour éviter les faux comptes et rester informé des actualités de la plateforme.
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full w-fit">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">
                {NETWORKS.length} comptes officiels vérifiés
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">

        {/* Rôle de la page */}
        <section>
          <h2 className="text-xl font-bold text-white mb-5">Pourquoi cette page existe</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {ROLES.map(({ icon: Icon, color, title, description }) => (
              <div key={title} className="flex gap-4 p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="p-2 bg-gray-800 rounded-lg h-fit shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">{title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Comptes officiels</h2>
            <span className="text-gray-500 text-sm">Tous les comptes sont vérifiés</span>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {NETWORKS.map(network => {
              const Icon = network.icon;
              return (
                <div
                  key={network.id}
                  className={`relative p-5 rounded-xl border ${network.bgColor} ${network.borderColor} hover:brightness-110 transition-all group`}
                >
                  {network.badge && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 bg-cyan-600/80 text-white text-xs rounded-full font-medium">
                      {network.badge}
                    </span>
                  )}
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 bg-gray-800/80 rounded-xl shrink-0">
                      <Icon className={`w-5 h-5 ${network.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <h3 className="font-semibold text-white">{network.name}</h3>
                        <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      </div>
                      <div className="text-gray-500 text-xs font-mono mb-2">{network.handle}</div>
                      <p className="text-gray-400 text-sm mb-3 leading-relaxed">{network.usage}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-600 text-xs">
                          <Bell className="w-3 h-3" />
                          {network.frequency}
                        </div>
                        <a
                          href={network.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-xs font-medium transition-colors"
                        >
                          Suivre
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Anti-arnaque */}
        <section>
          <div className="p-6 bg-red-950/20 border border-red-900/30 rounded-xl">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-red-500/10 rounded-lg shrink-0">
                <Shield className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">Attention aux faux comptes</h3>
                <div className="text-gray-400 text-sm leading-relaxed space-y-2">
                  <p>
                    TruTube ne vous demandera <strong className="text-white">jamais</strong> vos identifiants, votre mot de passe, ou un paiement via les réseaux sociaux.
                  </p>
                  <p>
                    Tout compte prétendant être TruTube et non listé sur cette page est un faux compte. Signalez-le directement à la plateforme concernée et à <span className="text-red-400">security@trutube.tv</span>.
                  </p>
                  <ul className="space-y-1 mt-2">
                    {[
                      'Ne jamais cliquer sur des liens reçus en DM d\'un compte TruTube non vérifié',
                      'Ne jamais envoyer de fonds suite à une demande sur les réseaux sociaux',
                      'Vérifier l\'URL officielle : trutube.tv (pas de variantes)',
                    ].map(item => (
                      <li key={item} className="flex gap-2">
                        <span className="text-red-500 shrink-0">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Discord CTA */}
        <section>
          <div className="p-8 bg-gradient-to-br from-blue-950/30 to-gray-900 border border-blue-900/30 rounded-xl text-center">
            <div className="p-3 bg-blue-500/10 rounded-xl w-fit mx-auto mb-4">
              <MessageSquare className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Rejoindre la communauté Discord</h3>
            <p className="text-gray-400 text-sm max-w-lg mx-auto mb-6">
              Le Discord officiel TruTube est le meilleur endroit pour discuter avec d'autres créateurs,
              avoir un support rapide, accéder aux beta-tests et influencer la roadmap produit.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://discord.gg/trutube"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                Rejoindre le Discord
                <ExternalLink className="w-4 h-4" />
              </a>
              <a
                href="https://t.me/trutubealerts"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Alertes Telegram
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Contact presse & corporate */}
        <section>
          <h2 className="text-xl font-bold text-white mb-5">Contact corporate & presse</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { icon: Globe, color: 'text-cyan-400', label: 'Relations presse', contact: 'press@trutube.tv', desc: 'Demandes médias, interviews, kit presse' },
              { icon: Briefcase, color: 'text-yellow-400', label: 'Partenariats', contact: 'partnerships@trutube.tv', desc: 'Collaborations marques, labels, B2B' },
              { icon: Users, color: 'text-green-400', label: 'Community', contact: 'community@trutube.tv', desc: 'Créateurs, ambassadeurs, évènements' },
            ].map(({ icon: Icon, color, label, contact, desc }) => (
              <div key={label} className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
                <Icon className={`w-5 h-5 ${color} mb-3`} />
                <h3 className="font-semibold text-white mb-0.5">{label}</h3>
                <p className="text-gray-500 text-xs mb-2">{desc}</p>
                <a
                  href={`mailto:${contact}`}
                  className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors"
                >
                  {contact}
                </a>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
