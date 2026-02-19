import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Building2, Globe, Shield, TrendingUp, Users, Code2,
  Lock, FileText, Award, ChevronDown, ChevronUp,
  Coins, BarChart3, Fingerprint, Scale, Newspaper,
  Handshake, LineChart, Eye, Zap, CheckCircle, ExternalLink
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section className="py-16 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
          {subtitle && <p className="text-gray-400">{subtitle}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
      <div className="text-3xl font-bold text-cyan-400 mb-1">{value}</div>
      <div className="text-gray-400 text-sm">{label}</div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color = 'text-cyan-400' }: {
  icon: React.ElementType; title: string; description: string; color?: string;
}) {
  return (
    <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors">
      <div className={`p-3 rounded-lg w-fit mb-4 bg-gray-800`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
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
        <span className="font-medium text-white">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
          {children}
        </div>
      )}
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
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm mb-6">
              <Building2 className="w-4 h-4" />
              TruTube — Société
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
              La plateforme creator-first<br />
              <span className="text-cyan-400">pour l'économie créative</span>
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              TruTube construit une infrastructure juste pour les créateurs de contenu : revenus directs,
              droits protégés, transparence totale sur chaque centime généré.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('pricing')}
                className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
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
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard value="Creator-first" label="Philosophie fondatrice" />
          <StatCard value="85%" label="Revenus reversés aux créateurs" />
          <StatCard value="RGPD" label="Conformité européenne" />
          <StatCard value="0 pub forcée" label="Aucune pub non consentie" />
        </div>
      </div>

      {/* À propos */}
      <Section title="À propos de TruTube" subtitle="Histoire, mission et positionnement">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Notre mission</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              TruTube est né d'un constat simple : les créateurs méritent mieux qu'un modèle publicitaire
              opaque qui les place en simples vecteurs de trafic. Nous construisons une plateforme où
              <span className="text-white"> chaque euro vient directement de la valeur créée</span>, pas
              d'algorithmes publicitaires.
            </p>
            <p className="text-gray-400 leading-relaxed">
              Notre vision est celle d'un internet créatif durable : artistes, musiciens, vidéastes et
              éducateurs peuvent vivre de leur travail sans dépendre de la publicité.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-3">Ce qui nous différencie</h3>
            <div className="space-y-3">
              {[
                ['Revenus directs', 'Abonnements, ventes, tips — sans publicité imposée'],
                ['Transparence totale', 'Commissions publiques, calculs explicites'],
                ['Protection des droits', 'Anti-piratage natif, DRM, gestion royalties'],
                ['Communauté intégrée', 'Forums, espaces fans, messagerie directe'],
              ].map(([title, desc]) => (
                <div key={title} className="flex gap-3">
                  <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-white font-medium">{title}</span>
                    <span className="text-gray-400"> — {desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Technologie */}
      <Section title="Infrastructure & Sécurité" subtitle="Architecture conçue pour la performance et la confiance">
        <div className="grid md:grid-cols-3 gap-5">
          <FeatureCard
            icon={Code2}
            title="Architecture cloud-native"
            description="Infrastructure distribuée avec CDN mondial, streaming adaptatif HLS/DASH et encodage multi-résolution automatique."
            color="text-blue-400"
          />
          <FeatureCard
            icon={Lock}
            title="Chiffrement bout en bout"
            description="Contenu premium protégé par DRM, HTTPS obligatoire, tokens signés pour chaque session de lecture."
            color="text-green-400"
          />
          <FeatureCard
            icon={Shield}
            title="Détection de fraude"
            description="Analyse comportementale en temps réel, validation des vues, protection anti-bots sur les métriques."
            color="text-red-400"
          />
          <FeatureCard
            icon={Zap}
            title="Faible latence"
            description="Diffusion live avec moins de 3 secondes de latence, edge nodes optimisés par région géographique."
            color="text-yellow-400"
          />
          <FeatureCard
            icon={BarChart3}
            title="Analytics en temps réel"
            description="Tableaux de bord analytiques pour les créateurs avec métriques d'audience, revenus et engagement."
            color="text-cyan-400"
          />
          <FeatureCard
            icon={Fingerprint}
            title="KYC & conformité"
            description="Vérification d'identité pour les créateurs monétisés, conformité FATF, reporting fiscal automatisé."
            color="text-orange-400"
          />
        </div>
      </Section>

      {/* Économie */}
      <Section title="Modèle économique" subtitle="Comment TruTube génère et redistribue de la valeur">
        <div className="grid md:grid-cols-3 gap-5 mb-8">
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Coins className="w-6 h-6 text-yellow-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Revenus créateurs</h3>
            <p className="text-gray-400 text-sm mb-3">Abonnements, ventes de contenu, tips, merchandising, cours, services.</p>
            <div className="text-2xl font-bold text-yellow-400">85%</div>
            <div className="text-gray-500 text-xs">reversé aux créateurs</div>
          </div>
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <TrendingUp className="w-6 h-6 text-green-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Revenus plateforme</h3>
            <p className="text-gray-400 text-sm mb-3">Commissions transactions, abonnements Premium spectateurs, partenariats B2B.</p>
            <div className="text-2xl font-bold text-green-400">15%</div>
            <div className="text-gray-500 text-xs">commission maximale</div>
          </div>
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Globe className="w-6 h-6 text-blue-400 mb-4" />
            <h3 className="font-semibold text-white mb-2">Sponsoring natif</h3>
            <p className="text-gray-400 text-sm mb-3">Marques en contact direct avec les créateurs. Pas d'intermédiaire opaque.</p>
            <div className="text-2xl font-bold text-blue-400">Direct</div>
            <div className="text-gray-500 text-xs">créateur ↔ marque</div>
          </div>
        </div>

        <div className="p-6 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 border border-cyan-800/30 rounded-xl">
          <div className="flex items-start gap-4">
            <Eye className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-white mb-1">Transparence financière publique</h3>
              <p className="text-gray-400 text-sm">
                Toutes les commissions sont fixes, publiques et auditables. Les créateurs voient exactement
                combien TruTube prend sur chaque transaction. Aucun changement silencieux de politique de
                rémunération — tout changement est annoncé 30 jours à l'avance.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Protection droits */}
      <Section title="Protection des droits" subtitle="Infrastructure anti-piratage et gestion des royalties">
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              icon: Shield,
              title: 'Détection d\'empreinte digitale',
              desc: 'Identification automatique du contenu dupliqué par analyse d\'empreinte audio et vidéo.'
            },
            {
              icon: FileText,
              title: 'Gestion des royalties',
              desc: 'Splits configurables entre artistes, labels, producteurs. Paiements automatiques selon les contrats.'
            },
            {
              icon: Scale,
              title: 'Procédure DMCA/contestation',
              desc: 'Système de contestation transparent avec délais légaux respectés et médiation disponible.'
            },
            {
              icon: Lock,
              title: 'DRM multi-niveau',
              desc: 'Protection du contenu premium avec Widevine, PlayReady et FairPlay selon la plateforme.'
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <div className="p-2 bg-red-500/10 rounded-lg h-fit">
                <Icon className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-medium text-white mb-1">{title}</h3>
                <p className="text-gray-400 text-sm">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Conformité légale */}
      <Section title="Conformité légale" subtitle="RGPD, KYC et cadre réglementaire européen">
        <div className="space-y-3">
          <AccordionItem title="Conformité RGPD">
            <p>
              TruTube traite les données personnelles conformément au Règlement Général sur la Protection
              des Données (RGPD, UE 2016/679). Droit d'accès, de rectification, de portabilité et
              d'effacement garantis. DPO désigné, registre de traitement maintenu, sous-traitants
              contractualisés. Base légale explicite pour chaque traitement.
            </p>
          </AccordionItem>
          <AccordionItem title="Vérification d'identité (KYC)">
            <p>
              Les créateurs souhaitant recevoir des paiements passent par une procédure KYC conforme
              aux réglementations anti-blanchiment (FATF/GAFI). Documents d'identité, vérification
              d'adresse et, pour les montants importants, justificatif de source de fonds.
            </p>
          </AccordionItem>
          <AccordionItem title="Protection copyright & territoires">
            <p>
              Le contenu est soumis aux lois de droit d'auteur de chaque territoire. TruTube applique
              les directives DSA (Digital Services Act) pour l'UE, et coopère avec les détenteurs de
              droits pour les retraits légaux. Gestion des licences territoriales disponible pour les labels.
            </p>
          </AccordionItem>
          <AccordionItem title="Lutte contre la fraude">
            <p>
              Système de scoring comportemental pour détecter les vues frauduleuses, achats suspects
              et manipulations de métriques. Toute activité suspecte est signalée et les revenus
              associés mis en quarantaine en attente de vérification manuelle.
            </p>
          </AccordionItem>
        </div>
      </Section>

      {/* Presse & Partenaires */}
      <Section title="Presse & Partenaires">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Newspaper className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-white">Kit presse</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Logos, visuels, communiqués de presse et biographies disponibles pour les journalistes
              et blogueurs. Contact presse direct pour interviews et demandes médias.
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                <ExternalLink className="w-4 h-4" />
                Télécharger le kit
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                Contact presse
              </button>
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Handshake className="w-5 h-5 text-gray-400" />
              <h3 className="font-semibold text-white">Partenariats</h3>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              Intégrations labels indépendants, distributeurs musicaux, agences créatives et marques
              souhaitant opérer sur TruTube. Programme API disponible pour les partenaires techniques.
            </p>
            <button
              onClick={() => onNavigate('partner-program')}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors"
            >
              Programme partenaire
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Section>

      {/* Investisseurs */}
      <Section title="Investisseurs" subtitle="Informations financières et vision à long terme">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <LineChart className="w-6 h-6 text-green-400 mb-4" />
            <h3 className="font-semibold text-white mb-3">Croissance & métriques</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              TruTube opère sur un marché en forte croissance — l'économie des créateurs représente
              plus de 100 Md€ mondialement. Notre modèle sans publicité génère un LTV créateur
              structurellement supérieur aux plateformes ad-based.
            </p>
          </div>
          <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <Award className="w-6 h-6 text-yellow-400 mb-4" />
            <h3 className="font-semibold text-white mb-3">Contact investisseurs</h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Pour toute demande d'information financière, deck investisseur, ou prise de contact
              formelle, adressez-vous directement à notre équipe corporate.
            </p>
            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
              investors@trutube.tv
            </button>
          </div>
        </div>
      </Section>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
