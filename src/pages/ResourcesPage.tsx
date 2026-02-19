import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  BookOpen, DollarSign, Scale, Cpu, HelpCircle, MessageSquare,
  Mail, Ticket, ChevronDown, ChevronUp, Play, Music, Settings,
  FileText, Globe, Shield, Search, ChevronRight, Star
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

type Tab = 'creator' | 'monetization' | 'legal' | 'technical' | 'faq' | 'support';

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'creator', label: 'Guide créateur', icon: Play },
  { id: 'monetization', label: 'Monétisation', icon: DollarSign },
  { id: 'legal', label: 'Légal', icon: Scale },
  { id: 'technical', label: 'Technique', icon: Cpu },
  { id: 'faq', label: 'FAQ', icon: HelpCircle },
  { id: 'support', label: 'Support', icon: MessageSquare },
];

function GuideItem({ title, description, steps }: { title: string; description: string; steps?: string[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
      >
        <div>
          <div className="font-medium text-white">{title}</div>
          <div className="text-gray-500 text-sm mt-0.5">{description}</div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0 ml-4" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0 ml-4" />}
      </button>
      {open && steps && (
        <div className="px-6 pb-5 border-t border-gray-800 pt-4">
          <ol className="space-y-3">
            {steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-medium">{i + 1}</span>
                <span className="text-gray-400 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
      >
        <span className="font-medium text-white text-sm">{question}</span>
        {open ? <span className="text-gray-500 text-xl ml-4">−</span> : <span className="text-gray-500 text-xl ml-4">+</span>}
      </button>
      {open && (
        <div className="px-6 pb-4 text-gray-400 text-sm border-t border-gray-800 pt-4 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
}

function SectionHeader({ icon: Icon, title, subtitle }: { icon: React.ElementType; title: string; subtitle: string }) {
  return (
    <div className="flex items-start gap-4 mb-8 pb-6 border-b border-gray-800">
      <div className="p-3 bg-cyan-500/10 rounded-xl">
        <Icon className="w-6 h-6 text-cyan-400" />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

export default function ResourcesPage({ onNavigate }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('creator');
  const [search, setSearch] = useState('');

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-5">
              <BookOpen className="w-4 h-4" />
              Centre de ressources
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tout ce qu'il faut savoir pour réussir sur TruTube
            </h1>
            <p className="text-gray-400 mb-6">
              Guides pratiques, documentation technique, cadre légal et support — tout au même endroit.
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher dans les ressources..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto gap-1 mb-8 pb-1">
          {TABS.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-cyan-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Guide créateur */}
        {activeTab === 'creator' && (
          <div>
            <SectionHeader icon={Play} title="Guide créateur" subtitle="Tout pour lancer et développer votre présence sur TruTube" />
            <div className="space-y-3">
              <GuideItem
                title="Démarrer sa chaîne"
                description="Créer et configurer sa chaîne TruTube de A à Z"
                steps={[
                  'Créer un compte et compléter votre profil (photo, bio, liens sociaux)',
                  'Aller dans "Mes chaînes" et cliquer sur "Créer une chaîne"',
                  'Choisir le type de chaîne : créateur, artiste, label, studio ou marque',
                  'Configurer l\'identité visuelle : bannière, avatar, couleur de marque',
                  'Rédiger la description de la chaîne et ajouter vos hashtags officiels',
                  'Configurer les sections de la page d\'accueil (ordre drag-and-drop)',
                  'Uploader votre première vidéo et la mettre en avant sur votre page',
                ]}
              />
              <GuideItem
                title="Sortir un album"
                description="Publier et vendre un album sur TruTube Music"
                steps={[
                  'Accéder à Créateur Studio > "Nouvelle release"',
                  'Choisir le type : album, EP, single ou mixtape',
                  'Uploader les fichiers audio (WAV ou FLAC recommandé)',
                  'Configurer le prix de vente et les options (téléchargement, streaming, aperçu)',
                  'Définir les splits de royalties entre les collaborateurs',
                  'Ajouter la pochette (minimum 3000×3000px) et les métadonnées',
                  'Planifier ou publier immédiatement',
                ]}
              />
              <GuideItem
                title="Configurer les royalties"
                description="Gérer les droits et splits entre collaborateurs"
                steps={[
                  'Accéder aux paramètres de la release ou du contenu concerné',
                  'Cliquer sur "Gestion des royalties" dans l\'onglet Monétisation',
                  'Ajouter chaque collaborateur par nom d\'utilisateur TruTube ou email',
                  'Définir le pourcentage pour chaque partie (total doit = 100%)',
                  'Chaque collaborateur reçoit une notification et doit accepter',
                  'Les paiements sont automatiquement distribués selon les splits à chaque retrait',
                ]}
              />
              <GuideItem
                title="Stratégie de prix"
                description="Choisir les bons prix pour maximiser vos revenus"
                steps={[
                  'Analyser votre audience : taille, engagement, localisation géographique',
                  'Comparer avec des créateurs similaires dans votre niche',
                  'Tester avec un contenu gratuit d\'abord pour construire la confiance',
                  'Pour les abonnements : commencer entre 2,99€ et 9,99€ selon la valeur perçue',
                  'Utiliser le simulateur de revenus sur la page Tarification pour modéliser',
                  'Proposer des offres groupées (bundle) pour augmenter le panier moyen',
                ]}
              />
              <GuideItem
                title="Utiliser les Shorts"
                description="Créer et promouvoir des contenus courts"
                steps={[
                  'Les Shorts sont des vidéos verticales de moins de 60 secondes',
                  'Uploader comme une vidéo normale et cocher "Format Short"',
                  'Ajouter un titre accrocheur et des hashtags pertinents',
                  'Les Shorts sont distribués dans le feed Shorts dédié',
                  'Utiliser les Shorts pour promouvoir du contenu long ou des releases',
                ]}
              />
            </div>
          </div>
        )}

        {/* Guide monétisation */}
        {activeTab === 'monetization' && (
          <div>
            <SectionHeader icon={DollarSign} title="Guide monétisation" subtitle="Activer et optimiser toutes les sources de revenus disponibles" />
            <div className="space-y-3">
              <GuideItem
                title="Abonnements chaîne"
                description="Créer des tiers d'abonnement pour vos fans"
                steps={[
                  'Aller dans Chaîne > Monétisation > Abonnements',
                  'Définir vos tiers : Supporter, Fan, Super Fan (noms personnalisables)',
                  'Pour chaque tier : définir prix, avantages et contenu exclusif',
                  'Exemples d\'avantages : badge, accès posts réservés, Discord privé, contenu premium',
                  'Activer la période d\'essai gratuite (recommandé : 7 jours) pour augmenter les conversions',
                  'Communiquer régulièrement sur les avantages pour fidéliser',
                ]}
              />
              <GuideItem
                title="Ventes de contenu"
                description="Mettre du contenu en accès payant"
                steps={[
                  'À l\'upload, choisir "Contenu payant" dans les paramètres de visibilité',
                  'Définir un prix unique ou une location (ex : 3,99€ pour 48h)',
                  'Optionnel : définir un aperçu gratuit (les X premières minutes)',
                  'Le contenu apparaît avec un badge "Premium" dans les listings',
                  'Les acheteurs ont accès illimité (hors location)',
                ]}
              />
              <GuideItem
                title="Merchandising"
                description="Vendre des produits physiques et numériques"
                steps={[
                  'Accéder à Créateur Studio > Boutique',
                  'Choisir produit physique (print-on-demand) ou numérique (PDF, preset, sample)',
                  'Pour physique : intégrer avec Printful ou Printify via l\'API partenaire',
                  'Pour numérique : uploader le fichier — livraison automatique après achat',
                  'Configurer les prix, descriptions et visuels produits',
                  'Activer la section "Boutique" sur la page de votre chaîne',
                ]}
              />
              <GuideItem
                title="Communauté payante"
                description="Créer un espace exclusif pour vos membres"
                steps={[
                  'Créer ou gérer votre communauté depuis Communautés > Créer',
                  'Activer le mode Premium dans les paramètres de la communauté',
                  'Définir le prix d\'accès mensuel ou annuel',
                  'Configurer les canaux : discussions, ressources exclusives, live privés',
                  'Les membres de la communauté sont distincts des abonnés chaîne',
                ]}
              />
            </div>
          </div>
        )}

        {/* Guide légal */}
        {activeTab === 'legal' && (
          <div>
            <SectionHeader icon={Scale} title="Guide légal" subtitle="Droits, obligations et responsabilités sur TruTube" />
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {[
                {
                  icon: Music,
                  title: 'Droits musicaux',
                  items: [
                    'Vous devez détenir les droits sur la musique que vous publiez',
                    'Covers : obtenir une licence mécanique ou utiliser des plateformes agréées',
                    'Samples : obtenir clearance avant publication',
                    'Musique libre de droits : vérifier les conditions d\'utilisation commerciale',
                  ]
                },
                {
                  icon: FileText,
                  title: 'Déclarations fiscales',
                  items: [
                    'Les revenus TruTube sont imposables dans votre pays de résidence',
                    'TruTube fournit un récapitulatif annuel téléchargeable',
                    'Auto-entrepreneur : déclarer en BNC ou BIC selon votre activité',
                    'Au-delà de 10 000€/an : envisager la création d\'une structure juridique',
                  ]
                },
                {
                  icon: Shield,
                  title: 'Responsabilités créateur',
                  items: [
                    'Vous êtes responsable de tout contenu publié sur votre chaîne',
                    'Les contenus violant les CGU peuvent être supprimés sans préavis',
                    'Mentions obligatoires pour les placements de produit rémunérés',
                    'Respecter les restrictions territoriales pour certains contenus',
                  ]
                },
                {
                  icon: Globe,
                  title: 'Territoires & droits',
                  items: [
                    'Les droits musicaux varient par territoire — gérez l\'accès géographique',
                    'RGPD : si vous collectez des données via votre communauté, vous êtes co-responsable',
                    'Pour les artistes hors UE : vérifier les conventions fiscales bilatérales',
                    'Distribution internationale : configurer dans les paramètres de la release',
                  ]
                },
              ].map(({ icon: Icon, title, items }) => (
                <div key={title} className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <Icon className="w-4 h-4 text-cyan-400" />
                    <h3 className="font-semibold text-white">{title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {items.map(item => (
                      <li key={item} className="text-gray-400 text-sm flex gap-2">
                        <ChevronRight className="w-4 h-4 text-gray-600 shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <p className="text-yellow-300 text-sm">
                <strong>Avertissement :</strong> Ces informations sont fournies à titre indicatif et ne constituent pas un conseil juridique.
                Pour toute situation complexe, consultez un avocat spécialisé en droit des médias ou de la propriété intellectuelle.
              </p>
            </div>
          </div>
        )}

        {/* Guide technique */}
        {activeTab === 'technical' && (
          <div>
            <SectionHeader icon={Cpu} title="Guide technique" subtitle="Formats, codecs et recommandations pour un résultat optimal" />
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Formats vidéo acceptés</h3>
                <div className="space-y-2">
                  {[
                    ['MP4 (H.264/H.265)', 'Recommandé', 'text-green-400'],
                    ['MOV', 'Supporté', 'text-cyan-400'],
                    ['WebM (VP9)', 'Supporté', 'text-cyan-400'],
                    ['AVI', 'Converti automatiquement', 'text-yellow-400'],
                    ['WMV', 'Converti automatiquement', 'text-yellow-400'],
                  ].map(([fmt, status, color]) => (
                    <div key={fmt} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 font-mono">{fmt}</span>
                      <span className={color}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Qualité recommandée</h3>
                <div className="space-y-3">
                  {[
                    { res: '4K (3840×2160)', fps: '24/30/60fps', bitrate: '35–68 Mbps' },
                    { res: '1080p Full HD', fps: '24/30/60fps', bitrate: '8–12 Mbps' },
                    { res: '720p HD', fps: '24/30fps', bitrate: '5–7.5 Mbps' },
                    { res: 'Shorts 1080×1920', fps: '24/30/60fps', bitrate: '8–12 Mbps' },
                  ].map(({ res, fps, bitrate }) => (
                    <div key={res} className="text-sm">
                      <div className="text-white font-medium">{res}</div>
                      <div className="text-gray-500">{fps} — {bitrate}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">Formats audio</h3>
                <div className="space-y-2">
                  {[
                    ['WAV 24bit/48kHz', 'Meilleure qualité', 'text-green-400'],
                    ['FLAC', 'Sans perte', 'text-green-400'],
                    ['AAC 320 kbps', 'Recommandé streaming', 'text-cyan-400'],
                    ['MP3 320 kbps', 'Supporté', 'text-cyan-400'],
                    ['OGG Vorbis', 'Supporté', 'text-yellow-400'],
                  ].map(([fmt, status, color]) => (
                    <div key={fmt} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300 font-mono">{fmt}</span>
                      <span className={color}>{status}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <h3 className="font-semibold text-white mb-4">DRM & protection</h3>
                <div className="space-y-3 text-sm text-gray-400">
                  <p>Le contenu premium est automatiquement protégé selon la plateforme :</p>
                  <ul className="space-y-1.5">
                    {[
                      'Chrome / Android — Widevine L1',
                      'Safari / iOS — FairPlay Streaming',
                      'Edge / Windows — PlayReady',
                      'Fallback — AES-128 encryption HLS',
                    ].map(item => (
                      <li key={item} className="flex gap-2">
                        <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <p className="text-gray-500 text-xs mt-3">
                    La protection DRM est activée automatiquement pour tout contenu avec un prix d'accès.
                    Aucune configuration requise de votre part.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ */}
        {activeTab === 'faq' && (
          <div>
            <SectionHeader icon={HelpCircle} title="Questions fréquentes" subtitle="Réponses aux questions les plus courantes" />
            <div className="space-y-6">
              {[
                {
                  category: 'Paiements',
                  icon: DollarSign,
                  items: [
                    { q: 'Quand est-ce que je reçois mon argent ?', a: 'Les paiements sont traités chaque mois. Le virement arrive sous 3 à 5 jours ouvrés après traitement, dès lors que votre solde dépasse 10€ et que votre KYC est validé.' },
                    { q: 'Quels modes de retrait sont disponibles ?', a: 'Virement SEPA (recommandé), PayPal et en TruCoin. Le virement SEPA est gratuit. PayPal applique les frais standard de PayPal. La conversion TruCoin → € applique un frais fixe minimal.' },
                    { q: 'Comment fonctionne le remboursement d\'un achat ?', a: 'Les remboursements sont possibles dans les 14 jours pour les contenus non consultés. Pour les contenus consultés, contactez notre support. En cas de fraude confirmée, le remboursement est systématique.' },
                  ]
                },
                {
                  category: 'Copyright',
                  icon: Scale,
                  items: [
                    { q: 'Mon contenu a été retiré pour copyright, que faire ?', a: 'Si vous pensez que le retrait est une erreur, utilisez le formulaire de contestation accessible depuis votre tableau de bord. Notre équipe traite les contestations sous 72h ouvrées. En cas de dispute persistante, une médiation est disponible.' },
                    { q: 'Quelqu\'un a copié mon contenu, comment le signaler ?', a: 'Utilisez le bouton "Signaler" sur le contenu concerné, puis choisissez "Violation copyright". Fournissez une preuve de votre droit de propriété. Le contenu suspect est mis en revue sous 24h.' },
                  ]
                },
                {
                  category: 'Compte',
                  icon: Settings,
                  items: [
                    { q: 'J\'ai perdu l\'accès à mon compte, comment le récupérer ?', a: 'Utilisez la procédure "Mot de passe oublié" depuis la page de connexion. Si vous n\'avez plus accès à votre email, contactez le support avec une pièce d\'identité et la preuve que vous êtes le titulaire.' },
                    { q: 'Puis-je avoir plusieurs comptes ?', a: 'Un seul compte personnel est autorisé par personne. Vous pouvez en revanche créer plusieurs chaînes depuis votre compte unique. Chaque chaîne peut avoir son propre univers et monétisation.' },
                  ]
                },
              ].map(({ category, icon: Icon, items }) => (
                <div key={category}>
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="w-4 h-4 text-gray-500" />
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">{category}</h3>
                  </div>
                  <div className="space-y-2">
                    {items.map(({ q, a }) => <FaqItem key={q} question={q} answer={a} />)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Support */}
        {activeTab === 'support' && (
          <div>
            <SectionHeader icon={MessageSquare} title="Support" subtitle="Plusieurs façons de nous contacter selon l'urgence" />
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                <Ticket className="w-6 h-6 text-blue-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Ticket support</h3>
                <p className="text-gray-400 text-sm mb-4">Pour toute demande nécessitant un suivi. Réponse sous 24-48h ouvrées.</p>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Ouvrir un ticket
                </button>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                <MessageSquare className="w-6 h-6 text-green-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Chat en direct</h3>
                <p className="text-gray-400 text-sm mb-4">Disponible du lundi au vendredi, 9h–18h CET. Réponse immédiate.</p>
                <button className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Démarrer le chat
                </button>
              </div>
              <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
                <Mail className="w-6 h-6 text-yellow-400 mb-3" />
                <h3 className="font-semibold text-white mb-1">Email</h3>
                <p className="text-gray-400 text-sm mb-4">Pour les demandes complexes ou confidentielles. Réponse sous 48h.</p>
                <button className="w-full py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors">
                  support@trutube.tv
                </button>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-800/30 rounded-xl">
              <div className="flex items-start gap-4">
                <Star className="w-6 h-6 text-yellow-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Support prioritaire — Créateurs vérifiés</h3>
                  <p className="text-gray-400 text-sm">
                    Les créateurs avec un compte vérifié (badge ✓) bénéficient d'un support prioritaire :
                    réponse chat garantie sous 2h, ticket traité sous 8h ouvrées, ligne directe pour les urgences
                    liées à la monétisation.
                  </p>
                  <button
                    onClick={() => onNavigate('creator-setup')}
                    className="mt-3 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Obtenir la vérification
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
