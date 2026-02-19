import { useState } from 'react';
import {
  Shield, Eye, Lock, Database, UserCheck, Globe, Server, Bell, Trash2,
  ChevronDown, ChevronRight, ExternalLink, ArrowLeft, CheckCircle, FileText
} from 'lucide-react';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

const LAST_UPDATED = '18 février 2026';
const VERSION = '2.1';
const DPO_EMAIL = 'privacy@goroti.com';

function Section({
  icon: Icon,
  title,
  children,
  accent = 'text-sky-400',
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  accent?: string;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden bg-[#111116]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${accent}`}>
            <Icon className="w-4 h-4" />
          </div>
          <h2 className="text-white font-bold text-lg">{title}</h2>
        </div>
        {open
          ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
          : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-6 pb-6 space-y-4 text-gray-300 text-sm leading-relaxed border-t border-white/5">
          <div className="pt-4">{children}</div>
        </div>
      )}
    </div>
  );
}

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <p className="font-semibold text-white">{title}</p>
      <div className="text-gray-400 space-y-2">{children}</div>
    </div>
  );
}

function Ul({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 ml-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-gray-400">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 flex-shrink-0 mt-1.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function RightCard({ icon: Icon, right, desc }: { icon: React.ComponentType<{ className?: string }>; right: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/6">
      <div className="w-8 h-8 rounded-lg bg-sky-950/50 border border-sky-800/30 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-sky-400" />
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{right}</p>
        <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

export const PrivacyPage = ({ onNavigate }: PrivacyPageProps) => {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <header className="sticky top-0 z-30 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-white/6">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center gap-4">
          <button
            onClick={() => onNavigate('home')}
            className="p-2 rounded-xl hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold truncate">Politique de Confidentialité</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">v{VERSION}</span>
            <span className="text-xs text-gray-500">{LAST_UPDATED}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-emerald-400 text-xs font-semibold mb-6">
            <Shield className="w-3.5 h-3.5" />
            Conforme RGPD — Version {VERSION} du {LAST_UPDATED}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Politique de<br />Confidentialité
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            GOROTI s'engage à protéger votre vie privée. Ce document explique comment vos données personnelles
            sont collectées, utilisées et protégées.
          </p>

          <div className="mt-8 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-800/30">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-white font-semibold text-sm">Notre engagement fondamental</p>
                <p className="text-gray-400 text-sm mt-1">
                  GOROTI ne vend jamais vos données personnelles à des tiers. Vos données ne sont utilisées
                  que pour améliorer votre expérience et faire fonctionner nos services.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <Section icon={Shield} title="1. Identité du responsable de traitement">
            <Sub title="1.1 Responsable du traitement">
              <p>
                Le responsable du traitement de vos données personnelles est :
              </p>
              <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/6 space-y-1.5 text-sm">
                <p><span className="text-white font-medium">Société :</span> GOROTI SAS</p>
                <p><span className="text-white font-medium">Siège social :</span> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                <p><span className="text-white font-medium">RCS :</span> Paris B 123 456 789</p>
                <p><span className="text-white font-medium">Email DPO :</span> <a href={`mailto:${DPO_EMAIL}`} className="text-sky-400 hover:text-sky-300">{DPO_EMAIL}</a></p>
              </div>
            </Sub>
            <Sub title="1.2 Délégué à la Protection des Données (DPO)">
              <p>
                GOROTI a désigné un Délégué à la Protection des Données (DPO) joignable à l'adresse
                <a href={`mailto:${DPO_EMAIL}`} className="text-sky-400 hover:text-sky-300 mx-1">{DPO_EMAIL}</a>
                pour toute question relative au traitement de vos données personnelles.
              </p>
            </Sub>
          </Section>

          <Section icon={Database} title="2. Données collectées et bases légales" accent="text-blue-400">
            <Sub title="2.1 Données fournies lors de l'inscription">
              <Ul items={[
                'Adresse email (base légale : exécution du contrat)',
                'Nom d\'utilisateur et pseudonyme (base légale : exécution du contrat)',
                'Mot de passe — stocké sous forme hachée avec bcrypt, jamais en clair (base légale : exécution du contrat)',
                'Date de naissance pour vérification de l\'âge (base légale : obligation légale)',
                'Photo de profil et informations de présentation — optionnelles (base légale : consentement)',
              ]} />
            </Sub>
            <Sub title="2.2 Données collectées automatiquement">
              <Ul items={[
                'Adresse IP et localisation géographique approximative (pays, région) — pour la sécurité et la conformité légale',
                'Identifiant de l\'appareil, type de navigateur et système d\'exploitation — pour la compatibilité technique',
                'Données de navigation : pages visitées, durée de visionnage, interactions (vues, likes, commentaires)',
                'Journaux de connexion et données de session — conservés 12 mois maximum',
                'Cookies et technologies similaires — voir section 7',
              ]} />
            </Sub>
            <Sub title="2.3 Données de créateur (si applicable)">
              <Ul items={[
                'Informations d\'identité légale (pièce d\'identité) — pour la vérification KYC et conformité financière',
                'Coordonnées bancaires (IBAN) — pour le versement des revenus, transmises chiffrées',
                'Numéro de TVA ou SIRET — pour les obligations fiscales',
                'Contenus publiés (vidéos, métadonnées, descriptions)',
              ]} />
            </Sub>
            <Sub title="2.4 Données pour la détection de fraude">
              <p>
                Pour l'intégrité du système anti-fausses vues, nous collectons des empreintes comportementales
                anonymisées (hash de l'IP, fingerprint d'appareil) qui nous permettent de détecter les activités
                artificielles. Ces données sont conservées 6 mois et ne sont pas liées à votre identité réelle.
              </p>
            </Sub>
          </Section>

          <Section icon={Eye} title="3. Finalités et durées de conservation">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 pr-4 text-white font-semibold">Finalité</th>
                    <th className="text-left py-3 pr-4 text-white font-semibold">Base légale</th>
                    <th className="text-left py-3 text-white font-semibold">Conservation</th>
                  </tr>
                </thead>
                <tbody className="text-gray-400">
                  {[
                    ['Gestion de compte et authentification', 'Exécution du contrat', 'Durée du compte + 30 jours'],
                    ['Fourniture et amélioration du service', 'Exécution du contrat', 'Durée du compte'],
                    ['Personnalisation des recommandations', 'Intérêt légitime', 'Durée du compte'],
                    ['Détection de fraude et sécurité', 'Intérêt légitime / Obligation légale', '6 à 12 mois'],
                    ['Traitement des paiements', 'Exécution du contrat', '10 ans (obligations comptables)'],
                    ['Communication marketing', 'Consentement', 'Jusqu\'au retrait du consentement'],
                    ['Obligations légales et judiciaires', 'Obligation légale', 'Délais légaux en vigueur'],
                    ['Analyses statistiques (données agrégées)', 'Intérêt légitime', 'Indéfiniment (anonymisées)'],
                  ].map(([fin, base, dur], i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 pr-4">{fin}</td>
                      <td className="py-3 pr-4 text-xs">{base}</td>
                      <td className="py-3 text-xs text-gray-500">{dur}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          <Section icon={Globe} title="4. Partage et transfert des données" accent="text-amber-400">
            <Sub title="4.1 Principe de non-vente">
              <p className="font-semibold text-emerald-400">
                GOROTI ne vend, ne loue et ne cède jamais vos données personnelles à des tiers à des fins commerciales.
              </p>
            </Sub>
            <Sub title="4.2 Sous-traitants autorisés">
              <p>Nous faisons appel à des sous-traitants techniques, tous encadrés par des contrats de traitement de données :</p>
              <div className="mt-3 space-y-2">
                {[
                  { name: 'Supabase Inc.', role: 'Hébergement et base de données', loc: 'UE (Frankfurt)' },
                  { name: 'Stripe Inc.', role: 'Traitement des paiements', loc: 'UE (Dublin)' },
                  { name: 'Cloudflare', role: 'CDN et protection DDoS', loc: 'Mondial (SCCs)' },
                  { name: 'Brevo (ex-Sendinblue)', role: 'Emails transactionnels', loc: 'France' },
                ].map(({ name, role, loc }) => (
                  <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5 text-xs">
                    <span className="text-white font-medium">{name}</span>
                    <span className="text-gray-400">{role}</span>
                    <span className="text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">{loc}</span>
                  </div>
                ))}
              </div>
            </Sub>
            <Sub title="4.3 Transferts hors UE">
              <p>
                Certains sous-traitants sont établis hors de l'Union Européenne. Dans ce cas, le transfert est
                encadré par des Clauses Contractuelles Types (CCT) approuvées par la Commission Européenne,
                garantissant un niveau de protection équivalent à celui du RGPD.
              </p>
            </Sub>
            <Sub title="4.4 Divulgations légales">
              <p>
                Nous pouvons divulguer vos données aux autorités compétentes sur réquisition judiciaire valide,
                ou pour protéger les droits, la propriété ou la sécurité de GOROTI, de ses utilisateurs ou du public.
                Nous vous informerons de toute demande légale sauf interdiction expresse.
              </p>
            </Sub>
          </Section>

          <Section icon={Lock} title="5. Sécurité des données" accent="text-emerald-400">
            <Sub title="5.1 Mesures techniques">
              <Ul items={[
                'Chiffrement des données en transit : TLS 1.3 sur toutes les connexions',
                'Chiffrement des mots de passe : algorithme bcrypt avec salt aléatoire',
                'Chiffrement des données sensibles au repos (AES-256)',
                'Architecture Zero Trust avec authentification par JWT à durée limitée',
                'Row Level Security (RLS) sur toutes les tables de la base de données',
                'Surveillance automatisée des accès suspects (SIEM)',
              ]} />
            </Sub>
            <Sub title="5.2 Mesures organisationnelles">
              <Ul items={[
                'Accès aux données limité au strict nécessaire (principe du moindre privilège)',
                'Formation régulière des équipes aux bonnes pratiques de sécurité',
                'Audits de sécurité annuels par des prestataires indépendants',
                'Politique de gestion des incidents et plan de réponse',
                'Programme de bug bounty pour la détection de vulnérabilités',
              ]} />
            </Sub>
            <Sub title="5.3 Notification en cas de violation">
              <p>
                En cas de violation de données susceptible d'engendrer un risque pour vos droits et libertés,
                GOROTI s'engage à en notifier la CNIL dans les 72 heures et à vous informer dans les meilleurs
                délais si la violation présente un risque élevé pour vous.
              </p>
            </Sub>
          </Section>

          <Section icon={UserCheck} title="6. Vos droits">
            <p className="text-gray-400 mb-4">
              Conformément au RGPD (articles 15 à 22), vous disposez des droits suivants sur vos données personnelles :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <RightCard icon={Eye} right="Droit d'accès" desc="Obtenir une copie de toutes vos données personnelles que nous détenons." />
              <RightCard icon={FileText} right="Droit de rectification" desc="Corriger des données inexactes ou incomplètes vous concernant." />
              <RightCard icon={Trash2} right="Droit à l'effacement" desc="Demander la suppression de vos données (droit à l'oubli), sous conditions légales." />
              <RightCard icon={Database} right="Droit à la portabilité" desc="Recevoir vos données dans un format structuré et lisible par machine." />
              <RightCard icon={Shield} right="Droit d'opposition" desc="Vous opposer au traitement de vos données basé sur l'intérêt légitime." />
              <RightCard icon={Lock} right="Droit de limitation" desc="Demander la suspension du traitement dans certaines circonstances." />
              <RightCard icon={Bell} right="Retrait du consentement" desc="Retirer votre consentement à tout moment, sans effet rétroactif." />
              <RightCard icon={UserCheck} right="Profilage" desc="Ne pas faire l'objet d'une décision entièrement automatisée vous affectant significativement." />
            </div>
            <Sub title="Comment exercer vos droits">
              <p>
                Vous pouvez exercer ces droits directement depuis les <strong className="text-white">Paramètres → Données personnelles</strong> de votre compte,
                ou en envoyant une demande à <a href={`mailto:${DPO_EMAIL}`} className="text-sky-400 hover:text-sky-300">{DPO_EMAIL}</a>.
                Nous répondrons dans un délai d'un mois (prolongeable à 3 mois pour les demandes complexes).
              </p>
              <p className="mt-2">
                Si vous estimez que le traitement de vos données viole le RGPD, vous pouvez introduire une
                réclamation auprès de la CNIL (Commission Nationale de l'Informatique et des Libertés) :
                <a href="https://www.cnil.fr" className="text-sky-400 hover:text-sky-300 ml-1">www.cnil.fr</a>
              </p>
            </Sub>
          </Section>

          <Section icon={Server} title="7. Cookies et technologies similaires">
            <Sub title="7.1 Types de cookies utilisés">
              <div className="space-y-3">
                {[
                  {
                    type: 'Essentiels',
                    color: 'text-emerald-400',
                    bg: 'bg-emerald-950/30 border-emerald-800/30',
                    desc: 'Nécessaires au fonctionnement du site. Ne peuvent pas être désactivés.',
                    examples: 'Session d\'authentification, préférences de sécurité, panier TruCoins'
                  },
                  {
                    type: 'Analytiques',
                    color: 'text-blue-400',
                    bg: 'bg-blue-950/30 border-blue-800/30',
                    desc: 'Nous aident à comprendre comment les utilisateurs interagissent avec le service.',
                    examples: 'Statistiques de visionnage agrégées, performance des pages'
                  },
                  {
                    type: 'Fonctionnels',
                    color: 'text-amber-400',
                    bg: 'bg-amber-950/30 border-amber-800/30',
                    desc: 'Mémorisent vos préférences pour améliorer votre expérience.',
                    examples: 'Langue, qualité vidéo préférée, thème de l\'interface'
                  },
                ].map(({ type, color, bg, desc, examples }) => (
                  <div key={type} className={`p-4 rounded-xl border ${bg}`}>
                    <p className={`font-semibold text-sm ${color} mb-1`}>{type}</p>
                    <p className="text-gray-400 text-xs">{desc}</p>
                    <p className="text-gray-600 text-xs mt-1">Exemples : {examples}</p>
                  </div>
                ))}
              </div>
            </Sub>
            <Sub title="7.2 Durée de conservation des cookies">
              <Ul items={[
                'Cookies de session : supprimés à la fermeture du navigateur',
                'Cookies de préférences : conservés 1 an',
                'Cookies analytiques : conservés 13 mois maximum (conformité CNIL)',
              ]} />
            </Sub>
            <Sub title="7.3 Gestion des cookies">
              <p>
                Vous pouvez gérer vos préférences de cookies via notre bandeau de consentement accessible
                depuis le lien en bas de page, ou via les paramètres de votre navigateur. La désactivation
                des cookies essentiels peut empêcher l'utilisation du service.
              </p>
            </Sub>
          </Section>

          <Section icon={Bell} title="8. Communications et marketing">
            <Sub title="8.1 Emails transactionnels">
              <p>
                Nous vous envoyons des emails transactionnels indispensables au fonctionnement du service
                (confirmation d'inscription, notifications de sécurité, récapitulatifs de paiements).
                Ces emails ne nécessitent pas de consentement.
              </p>
            </Sub>
            <Sub title="8.2 Communications marketing">
              <p>
                Les newsletters et communications marketing ne vous sont envoyées qu'avec votre consentement
                explicite. Vous pouvez vous désabonner à tout moment via le lien présent dans chaque email
                ou depuis les paramètres de votre compte. Le désabonnement est effectif dans les 48 heures.
              </p>
            </Sub>
            <Sub title="8.3 Notifications push">
              <p>
                Les notifications push nécessitent votre autorisation explicite dans votre navigateur.
                Vous pouvez les désactiver à tout moment depuis les paramètres de votre navigateur ou
                de votre compte GOROTI.
              </p>
            </Sub>
          </Section>

          <Section icon={Globe} title="9. Dispositions spécifiques" accent="text-rose-400">
            <Sub title="9.1 Mineurs">
              <p>
                GOROTI n'est pas destiné aux enfants de moins de 13 ans et ne collecte pas sciemment de données
                les concernant. Si vous êtes parent et découvrez que votre enfant nous a fourni des données,
                contactez-nous immédiatement à <a href={`mailto:${DPO_EMAIL}`} className="text-sky-400 hover:text-sky-300">{DPO_EMAIL}</a> pour suppression.
              </p>
            </Sub>
            <Sub title="9.2 Données publiques">
              <p>
                Certaines informations de votre profil (nom d'utilisateur, photo, biographie, contenus publiés)
                sont publiques par défaut. Vous pouvez les rendre privées depuis les paramètres de confidentialité
                de votre compte, sauf pour les contenus déjà diffusés publiquement.
              </p>
            </Sub>
            <Sub title="9.3 Réseaux sociaux tiers">
              <p>
                Si vous connectez un réseau social tiers, nous accédons uniquement aux informations nécessaires
                (nom, email) avec votre consentement explicite. GOROTI n'est pas responsable des pratiques
                de confidentialité de ces tiers.
              </p>
            </Sub>
            <Sub title="9.4 Modifications de la présente politique">
              <p>
                Nous pouvons mettre à jour cette politique périodiquement. Les modifications significatives
                vous seront notifiées par email et via une notification sur la plateforme au moins 30 jours
                avant leur entrée en vigueur. La version en vigueur est toujours accessible sur cette page.
              </p>
            </Sub>
          </Section>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-white font-semibold">Exercer vos droits ou poser une question</p>
              <p className="text-gray-400 text-sm mt-1">Notre DPO traite toutes les demandes dans un délai d'un mois.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => onNavigate('support')}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Paramètres de données
              </button>
              <a
                href={`mailto:${DPO_EMAIL}`}
                className="flex items-center gap-1.5 px-5 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
              >
                {DPO_EMAIL}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('terms')} className="hover:text-gray-300 transition-colors">CGU</button>
            <button onClick={() => onNavigate('legal')} className="hover:text-gray-300 transition-colors">Mentions légales</button>
            <a href="https://www.cnil.fr" className="hover:text-gray-300 transition-colors flex items-center gap-1">
              CNIL <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <span>© 2026 GOROTI SAS — Tous droits réservés</span>
        </div>
      </div>
    </div>
  );
};
