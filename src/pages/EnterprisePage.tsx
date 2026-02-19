import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Building2, Globe, Shield, TrendingUp, Users, Code2,
  Lock, FileText, Award, ChevronDown, ChevronUp,
  Coins, BarChart3, Fingerprint, Scale, Newspaper,
  Handshake, LineChart, Eye, Zap, CheckCircle, ExternalLink,
  Layers, CreditCard, Server, Radio, Cpu, AlertTriangle,
  Tag, Package, Music, Video, Map, Clock, Database,
  BookOpen, Gavel, UserCheck, ArrowRight
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

function SectionBlock({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="py-14 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function FeatureCard({ icon: Icon, title, description, color = 'text-red-400' }: {
  icon: React.ElementType; title: string; description: string; color?: string;
}) {
  return (
    <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
      <div className="p-2.5 bg-gray-800 rounded-lg w-fit mb-4">
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="font-semibold text-white mb-2 text-sm">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-900/50 transition-colors"
      >
        <span className="font-medium text-white text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function TableRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

export default function EnterprisePage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-6">
              <Building2 className="w-4 h-4" />
              GOROTI — Infrastructure créative
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              La plateforme creator-first<br />
              <span className="text-red-400">pour l'économie créative mondiale</span>
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              GOROTI construit une infrastructure juste pour les créateurs de contenu :
              revenus directs, droits protégés, transparence totale sur chaque centime généré.
              Une alternative structurelle à la publicité comme seule source de revenus.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('pricing')}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Voir la tarification
              </button>
              <button
                onClick={() => onNavigate('partner-program')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                Programme partenaire
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { value: '85%', label: 'Revenus reversés aux créateurs' },
            { value: 'RGPD', label: 'Conformité européenne native' },
            { value: '0 pub forcée', label: 'Sans publicité non consentie' },
            { value: 'Multi-univers', label: 'Vidéo, musique, live, marketplace' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="text-2xl font-bold text-red-400 mb-1">{value}</div>
              <div className="text-gray-500 text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 1. Présentation générale */}
      <SectionBlock title="Présentation générale" subtitle="Mission, différences et vision long terme">
        <div className="grid md:grid-cols-2 gap-10 mb-8">
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Notre mission</h3>
            <p className="text-gray-400 leading-relaxed mb-4 text-sm">
              GOROTI est né d'un constat simple : les créateurs méritent mieux qu'un modèle publicitaire
              opaque qui les place en simples vecteurs de trafic. Notre mission est de
              <span className="text-white"> donner aux créateurs un revenu direct indépendant de la publicité</span>,
              en construisant une plateforme où chaque euro vient directement de la valeur créée.
            </p>
            <p className="text-gray-400 leading-relaxed text-sm">
              Vision long terme : bâtir l'infrastructure financière de l'économie créative — un système
              où artistes, musiciens, vidéastes et éducateurs peuvent vivre de leur travail de façon
              durable, sans dépendre d'algorithmes publicitaires qui changent sans préavis.
            </p>
          </div>
          <div>
            <h3 className="text-base font-semibold text-white mb-3">Ce qui nous différencie</h3>
            <div className="space-y-3">
              {[
                ['Économie interne complète', 'Wallet, TruCoin, escrow marketplace, abonnements, tips'],
                ['Streaming premium intégré', 'DRM multi-niveau, HLS adaptatif, watermark invisible'],
                ['Royalties automatiques', 'Splits configurables, paiement immédiat, gestion collective'],
                ['Transparence totale', 'Commissions fixes et publiques, rapports fiscaux générés'],
                ['Protection des droits native', 'Fingerprinting, DMCA interne, preuves horodatées'],
              ].map(([title, desc]) => (
                <div key={title as string} className="flex gap-3">
                  <CheckCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <span className="text-white font-medium">{title}</span>
                    <span className="text-gray-500"> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-r from-red-900/20 to-blue-900/10 border border-red-800/30 rounded-xl">
          <div className="flex gap-3">
            <Eye className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <p className="text-gray-400 text-sm leading-relaxed">
              <span className="text-white font-medium">Problème résolu :</span> Sur les plateformes existantes,
              90% des créateurs gagnent moins de 100€/mois. Sur GOROTI, le modèle de revenus directs
              permet à des créateurs avec une audience modeste de générer un revenu significatif,
              car chaque achat ou abonnement va directement à eux — pas à un intermédiaire publicitaire.
            </p>
          </div>
        </div>
      </SectionBlock>

      {/* 2. Technologie */}
      <SectionBlock title="Technologie" subtitle="Infrastructure vidéo, paiement et sécurité">
        <div className="space-y-8">

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Video className="w-4 h-4 text-blue-400" />
              <h3 className="font-semibold text-white text-sm">Infrastructure vidéo</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard icon={Radio} title="Streaming adaptatif" description="Distribution HLS/DASH avec sélection automatique de qualité selon la bande passante (144p à 4K)." color="text-blue-400" />
              <FeatureCard icon={Lock} title="DRM multi-niveau" description="Widevine L1, PlayReady et FairPlay selon la plateforme. Protection du contenu premium contre la redistribution." color="text-blue-400" />
              <FeatureCard icon={Eye} title="Anti-capture" description="Détection de screen recording sur les contenus DRM. Flux tokenisés et expirables par session." color="text-blue-400" />
              <FeatureCard icon={Fingerprint} title="Watermark invisible" description="Marquage stéganographique de chaque flux pour identifier la source en cas de fuite ou de piratage." color="text-blue-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-4 h-4 text-green-400" />
              <h3 className="font-semibold text-white text-sm">Infrastructure paiement</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard icon={Coins} title="Wallet interne" description="Chaque utilisateur dispose d'un wallet multi-devises. Soldes créateurs séparés des soldes spectateurs." color="text-green-400" />
              <FeatureCard icon={Shield} title="Escrow marketplace" description="Les fonds des commandes marketplace sont consignés jusqu'à validation de la livraison par le client." color="text-green-400" />
              <FeatureCard icon={ArrowRight} title="Conversion TruCoin" description="Taux fixe 1 TruCoin = 0,01€. Conversion automatique disponible avec frais minimal transparent." color="text-green-400" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-red-400" />
              <h3 className="font-semibold text-white text-sm">Sécurité & protection</h3>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FeatureCard icon={UserCheck} title="KYC créateurs" description="Vérification d'identité obligatoire pour tout retrait. Document officiel + selfie en temps réel." color="text-red-400" />
              <FeatureCard icon={AlertTriangle} title="Anti-fraude transactions" description="Scoring comportemental sur chaque transaction. Quarantaine automatique des montants suspects." color="text-red-400" />
              <FeatureCard icon={BarChart3} title="Détection bots" description="Analyse multi-signaux pour identifier les vues et engagements artificiels. Invalidation en temps réel." color="text-red-400" />
              <FeatureCard icon={Lock} title="Protection piratage" description="Watermark, fingerprint audio/vidéo et DMCA automatisé pour détecter et retirer les copies non autorisées." color="text-red-400" />
            </div>
          </div>
        </div>
      </SectionBlock>

      {/* 3. Modèle économique */}
      <SectionBlock title="Modèle économique" subtitle="Comment GOROTI génère et redistribue de la valeur — sans dépendance à la publicité">
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Coins, color: 'text-yellow-400', label: 'Commission ventes', desc: 'Contenus premium (vidéos, albums, cours)', value: '15%' },
            { icon: Package, color: 'text-red-400', label: 'Marketplace', desc: 'Services entre créateurs', value: '10%' },
            { icon: Globe, color: 'text-blue-400', label: 'Distribution DSP', desc: 'Export musique vers services tiers', value: '5%' },
            { icon: Handshake, color: 'text-orange-400', label: 'Partenariats', desc: 'Sponsoring natif & campagnes marques', value: 'Variable' },
          ].map(({ icon: Icon, color, label, desc, value }) => (
            <div key={label} className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <div className="text-xl font-bold text-white mb-0.5">{value}</div>
              <div className="text-sm font-medium text-gray-300 mb-1">{label}</div>
              <div className="text-gray-500 text-xs">{desc}</div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl mb-4">
          <h3 className="font-semibold text-white mb-4">Répartition des revenus</h3>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-4 bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-red-600 to-green-500 rounded-full" style={{ width: '85%' }} />
            </div>
            <span className="text-white font-bold text-sm w-12 shrink-0">85%</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Reversé aux créateurs</span>
            <span>15% commission GOROTI (frais bancaires inclus)</span>
          </div>
        </div>

        <div className="p-5 bg-gradient-to-r from-red-900/20 to-blue-900/10 border border-red-800/30 rounded-xl">
          <Eye className="w-5 h-5 text-red-400 mb-2" />
          <h3 className="font-semibold text-white mb-1">Transparence financière totale</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            Toutes les commissions sont fixes, publiques et auditables. Les créateurs voient exactement
            combien GOROTI prend sur chaque transaction. Aucun changement silencieux — tout changement
            de politique est annoncé 30 jours à l'avance avec notification directe.
          </p>
        </div>
      </SectionBlock>

      {/* 4. Protection des droits */}
      <SectionBlock title="Protection des droits" subtitle="Procédures de signalement, contestation et retrait de contenu">
        <div className="grid md:grid-cols-2 gap-5 mb-6">
          {[
            {
              icon: FileText,
              color: 'text-red-400',
              title: 'Procédure DMCA interne',
              desc: 'Signalement en un clic depuis chaque contenu. Formulaire structuré avec champs copyright, preuve de propriété et lien original. Traitement sous 24h ouvrées.',
            },
            {
              icon: Scale,
              color: 'text-yellow-400',
              title: 'Contestation (counter-notice)',
              desc: 'Le créateur peut contester tout retrait dans les 14 jours avec justification légale. Notre équipe juridique réexamine sous 72h. Médiation externe disponible.',
            },
            {
              icon: AlertTriangle,
              color: 'text-orange-400',
              title: 'Suspension progressive',
              desc: 'Système d\'avertissements graduels (warning → restriction → suspension) avant désactivation du compte. Chaque étape est documentée et contestable.',
            },
            {
              icon: Map,
              color: 'text-blue-400',
              title: 'Blocage territorial',
              desc: 'Restriction d\'accès par pays disponible pour les détenteurs de droits ayant des licences limitées géographiquement. Applicable à la vidéo, musique et live.',
            },
            {
              icon: Clock,
              color: 'text-red-400',
              title: 'Preuves horodatées',
              desc: 'Chaque publication est enregistrée avec hash, timestamp et métadonnées cryptographiques. Preuve d\'antériorité disponible en format légal sur demande.',
            },
            {
              icon: Fingerprint,
              color: 'text-green-400',
              title: 'Fingerprinting continu',
              desc: 'Analyse audio et vidéo de chaque upload pour détecter automatiquement les copies de contenus déjà protégés dans notre base de références.',
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className={`p-2 bg-gray-800 rounded-lg h-fit shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <h3 className="font-medium text-white mb-1 text-sm">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <button
            onClick={() => onNavigate('terms')}
            className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 text-sm transition-colors"
          >
            Lire la politique copyright complète
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </SectionBlock>

      {/* 5. Conformité */}
      <SectionBlock title="Conformité légale & réglementaire" subtitle="RGPD, KYC, fiscalité et cadre réglementaire européen">
        <div className="space-y-3">
          <AccordionItem title="Conformité RGPD (Règlement UE 2016/679)">
            <p>
              GOROTI traite les données personnelles conformément au RGPD. Droit d'accès, de rectification,
              de portabilité et d'effacement garantis pour tous les utilisateurs européens.
            </p>
            <ul className="space-y-1 mt-2">
              {['DPO désigné et coordonnées publiques', 'Registre de traitement maintenu à jour', 'Sous-traitants contractualisés (DPA)', 'Base légale explicite pour chaque traitement', 'Consentement granulaire via cookie manager'].map(item => (
                <li key={item} className="flex gap-2 text-xs">
                  <CheckCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </AccordionItem>
          <AccordionItem title="Conservation des données">
            <p>
              Les données sont conservées selon les durées légales applicables :
            </p>
            <div className="mt-2 space-y-1">
              {[
                ['Données de compte actif', 'Durée de vie du compte'],
                ['Données de transaction', '10 ans (obligation légale comptable)'],
                ['Logs de sécurité', '13 mois glissants'],
                ['Données supprimées', '30 jours (récupération) puis purge'],
                ['Données de modération', '5 ans'],
              ].map(([type, duration]) => (
                <div key={type as string} className="flex justify-between text-xs border-b border-gray-800 pb-1">
                  <span className="text-gray-400">{type}</span>
                  <span className="text-white">{duration}</span>
                </div>
              ))}
            </div>
          </AccordionItem>
          <AccordionItem title="KYC obligatoire & conformité AML">
            <p>
              Les créateurs souhaitant recevoir des paiements passent par une procédure KYC conforme
              aux réglementations anti-blanchiment (FATF/GAFI, Directive UE AML).
            </p>
            <p>
              Procédure : document d'identité officiel en cours de validité + selfie dynamique.
              Pour les montants dépassant 2 000€/mois, justificatif de source de fonds requis.
            </p>
          </AccordionItem>
          <AccordionItem title="Fiscalité des payouts">
            <p>
              GOROTI fournit à chaque créateur un relevé fiscal annuel (document 1099-équivalent pour les
              US, déclaration UE pour les résidents européens). Les TVA et retenues à la source sont
              gérées automatiquement selon la juridiction.
            </p>
            <p className="mt-2">
              Les créateurs hors UE peuvent être soumis à retenue à la source selon les conventions fiscales.
              Attestation de résidence fiscale requise pour les montants importants.
            </p>
          </AccordionItem>
          <AccordionItem title="Digital Services Act (DSA) — Conformité UE">
            <p>
              GOROTI se conforme au Règlement (UE) 2022/2065 sur les services numériques. Rapport de
              transparence annuel publié, mécanisme de signalement accessible, système de réclamation
              interne opérationnel et coopération avec les organismes de règlement des litiges (ORL).
            </p>
          </AccordionItem>
        </div>
      </SectionBlock>

      {/* 6. Presse & Médias */}
      <SectionBlock title="Presse & Médias" subtitle="Kit presse, charte graphique et contact journalistes">
        <div className="grid md:grid-cols-3 gap-6 mb-6">
          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Newspaper className="w-5 h-5 text-gray-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Kit presse</h3>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">
              Logos vectoriels (SVG/PNG), captures officielles UI, biographies équipe fondatrice,
              charte couleurs et typographie.
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs transition-colors w-full justify-center">
              <ExternalLink className="w-3.5 h-3.5" />
              Télécharger le kit presse
            </button>
          </div>
          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
            <FileText className="w-5 h-5 text-gray-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Communiqués de presse</h3>
            <p className="text-gray-500 text-xs mb-4 leading-relaxed">
              Derniers communiqués officiels : lancement fonctionnalités, partenariats, résultats.
              Archive disponible en téléchargement.
            </p>
            <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xs transition-colors w-full justify-center">
              Voir les communiqués
            </button>
          </div>
          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Users className="w-5 h-5 text-gray-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Contact médias</h3>
            <p className="text-gray-500 text-xs mb-3 leading-relaxed">
              Demandes d'interview, d'accréditation ou d'information.
            </p>
            <a href="mailto:press@goroti.tv" className="block text-red-400 text-sm hover:text-red-300 transition-colors">
              press@goroti.tv
            </a>
            <p className="text-gray-600 text-xs mt-1">Réponse sous 24h ouvrées</p>
          </div>
        </div>

        <div className="p-5 bg-gray-900/30 border border-gray-800 rounded-xl">
          <h3 className="font-semibold text-white mb-3 text-sm">Charte d'utilisation des éléments de marque</h3>
          <div className="grid md:grid-cols-2 gap-2">
            {[
              ['Logo officiel', 'Utiliser uniquement les fichiers du kit presse'],
              ['Couleurs', '#00C4CC (cyan) — couleur principale officielle'],
              ['Nom commercial', 'Toujours écrit "GOROTI" (T majuscule, T majuscule)'],
              ['Captures d\'écran', 'Utiliser les captures officielles fournies'],
            ].map(([rule, detail]) => (
              <div key={rule as string} className="flex gap-2 text-xs">
                <CheckCircle className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span><span className="text-gray-300 font-medium">{rule} :</span><span className="text-gray-500"> {detail}</span></span>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      {/* 7. Partenaires */}
      <SectionBlock title="Partenaires" subtitle="Labels, marques, distributeurs et prestataires techniques">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { icon: Music, color: 'text-red-400', label: 'Labels indépendants', desc: 'Distribution directe, gestion royalties multi-artistes, contrats de licence' },
            { icon: Tag, color: 'text-yellow-400', label: 'Marques & annonceurs', desc: 'Sponsoring natif, campagnes créateurs, placement contextuel' },
            { icon: Globe, color: 'text-blue-400', label: 'Distributeurs musicaux', desc: 'Intégration DistroKid, TuneCore, Believe pour distribution multi-DSP' },
            { icon: Code2, color: 'text-green-400', label: 'Prestataires techniques', desc: 'API partenaires pour outils créateurs, analytics tiers, services B2B' },
          ].map(({ icon: Icon, color, label, desc }) => (
            <div key={label} className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <Icon className={`w-5 h-5 ${color} mb-3`} />
              <h3 className="font-semibold text-white mb-1 text-sm">{label}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => onNavigate('partner-program')}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Programme partenaire
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="mailto:partnerships@goroti.tv"
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          >
            partnerships@goroti.tv
          </a>
        </div>
      </SectionBlock>

      {/* 8. Investisseurs */}
      <SectionBlock title="Investisseurs" subtitle="Roadmap, croissance et chiffres clés">
        <div className="grid md:grid-cols-3 gap-5 mb-6">
          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
            <LineChart className="w-5 h-5 text-green-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Opportunité marché</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              L'économie des créateurs représente +100 Md€ mondialement avec une croissance de 20%/an.
              Le segment "direct-to-fan" est le plus rapide — et le moins servi par les infrastructures existantes.
            </p>
          </div>
          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
            <TrendingUp className="w-5 h-5 text-red-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Avantages structurels</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              LTV créateur supérieur aux plateformes ad-based. Rétention élevée grâce aux revenus directs.
              Modèle économique sans dépendance aux cookies tiers ou aux marchés publicitaires volatils.
            </p>
          </div>
          <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Award className="w-5 h-5 text-yellow-400 mb-3" />
            <h3 className="font-semibold text-white mb-2">Contact investisseurs</h3>
            <p className="text-gray-400 text-sm mb-3">
              Deck complet, métriques et roadmap disponibles sous NDA.
            </p>
            <a
              href="mailto:investors@goroti.tv"
              className="text-red-400 hover:text-red-300 text-sm transition-colors"
            >
              investors@goroti.tv
            </a>
          </div>
        </div>

        <div className="border border-gray-800 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-800">
            <h3 className="font-semibold text-white text-sm">Roadmap publique — priorités</h3>
          </div>
          <div className="divide-y divide-gray-800">
            {[
              { phase: 'Actuel', items: 'Vidéo, musique, marketplace, live, communautés, wallet complet' },
              { phase: 'Q2 2026', items: 'Distribution DSP automatisée, app mobile native iOS/Android' },
              { phase: 'Q3 2026', items: 'API publique créateurs, programme ambassadeurs, expansion EU' },
              { phase: 'Q4 2026', items: 'GOROTI Premium B2B, analytics avancés, partenariats label' },
            ].map(({ phase, items }) => (
              <div key={phase} className="flex gap-5 px-5 py-3 text-sm">
                <span className="text-red-400 font-medium w-20 shrink-0">{phase}</span>
                <span className="text-gray-400">{items}</span>
              </div>
            ))}
          </div>
        </div>
      </SectionBlock>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
