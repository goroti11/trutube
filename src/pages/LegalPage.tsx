import { useState } from 'react';
import {
  Building2, Shield, FileText, Scale, Globe, Phone, Mail, MapPin,
  ChevronDown, ChevronRight, ExternalLink, ArrowLeft, Server, Copyright, AlertTriangle
} from 'lucide-react';

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

const LAST_UPDATED = '18 février 2026';

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

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-white/5 last:border-0">
      <span className="text-gray-500 w-48 flex-shrink-0 text-xs pt-0.5">{label}</span>
      {href ? (
        <a href={href} className="text-sky-400 hover:text-sky-300 text-sm font-medium">{value}</a>
      ) : (
        <span className="text-white text-sm font-medium">{value}</span>
      )}
    </div>
  );
}

export function LegalPage({ onNavigate }: LegalPageProps) {
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
            <h1 className="text-white font-bold truncate">Mentions légales</h1>
          </div>
          <span className="hidden sm:block text-xs text-gray-500">{LAST_UPDATED}</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-gray-400 text-xs font-semibold mb-6">
            <Scale className="w-3.5 h-3.5" />
            Conformes à la LCEN — Mise à jour le {LAST_UPDATED}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Mentions<br />Légales
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Informations légales obligatoires relatives à l'éditeur de la plateforme Goroti,
            conformément à la loi n° 2004-575 du 21 juin 2004 (LCEN).
          </p>
        </div>

        <div className="space-y-3">
          <Section icon={Building2} title="1. Éditeur de la plateforme" accent="text-sky-400">
            <div className="rounded-xl bg-white/[0.03] border border-white/6 overflow-hidden">
              <InfoRow label="Raison sociale" value="Goroti SAS" />
              <InfoRow label="Forme juridique" value="Société par Actions Simplifiée (SAS)" />
              <InfoRow label="Capital social" value="100 000 €" />
              <InfoRow label="Siège social" value="123 Avenue des Champs-Élysées, 75008 Paris, France" />
              <InfoRow label="N° RCS" value="Paris B 123 456 789" />
              <InfoRow label="N° SIRET" value="123 456 789 00012" />
              <InfoRow label="Code APE/NAF" value="6312Z — Portails Internet" />
              <InfoRow label="N° TVA intracommunautaire" value="FR12 123456789" />
              <InfoRow label="Directeur de la publication" value="Jean Dupont" />
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/6">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs">Contact général</p>
                  <a href="mailto:contact@goroti.com" className="text-white text-sm font-medium hover:text-sky-400 transition-colors">contact@goroti.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/6">
                <Mail className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs">Service juridique</p>
                  <a href="mailto:legal@goroti.com" className="text-white text-sm font-medium hover:text-sky-400 transition-colors">legal@goroti.com</a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/6">
                <Phone className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="text-gray-500 text-xs">Téléphone</p>
                  <a href="tel:+33123456789" className="text-white text-sm font-medium hover:text-sky-400 transition-colors">+33 1 23 45 67 89</a>
                </div>
              </div>
            </div>
          </Section>

          <Section icon={Server} title="2. Hébergement" accent="text-blue-400">
            <p className="text-gray-400 mb-4">
              La plateforme Goroti est hébergée par les prestataires suivants :
            </p>
            <div className="space-y-3">
              {[
                {
                  name: 'Supabase Inc.',
                  role: 'Base de données et API',
                  address: '970 Toa Payoh North, #07-04, Singapore 318992',
                  datacenter: 'Serveurs UE — Frankfurt (aws-eu-central-1)',
                  url: 'https://supabase.com',
                },
                {
                  name: 'Cloudflare Inc.',
                  role: 'CDN, DNS et protection DDoS',
                  address: '101 Townsend St, San Francisco, CA 94107, États-Unis',
                  datacenter: 'Réseau mondial — Points de présence UE',
                  url: 'https://cloudflare.com',
                },
              ].map(({ name, role, address, datacenter, url }) => (
                <div key={name} className="p-5 rounded-xl bg-white/[0.03] border border-white/6 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-white font-semibold">{name}</p>
                    <span className="text-xs text-gray-500 bg-white/5 px-3 py-1 rounded-full">{role}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-gray-500">
                    <Server className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>{datacenter}</span>
                  </div>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors">
                    {url} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Copyright} title="3. Propriété intellectuelle" accent="text-amber-400">
            <div className="space-y-4">
              <p>
                L'ensemble des éléments constituant la plateforme Goroti (structure, design, textes, logos,
                icônes, images, sons, vidéos institutionnelles, logiciels et code source) est la propriété
                exclusive de Goroti SAS ou de ses partenaires, et est protégé par le Code de la Propriété
                Intellectuelle ainsi que par les conventions internationales.
              </p>

              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-800/30 space-y-2">
                <p className="text-amber-400 font-semibold text-sm">Droits réservés de Goroti</p>
                <p className="text-gray-400 text-sm">
                  Toute reproduction, représentation, modification, publication, adaptation, transmission ou
                  distribution de tout ou partie du contenu de la plateforme, par quelque procédé que ce soit,
                  est strictement interdite sans l'autorisation écrite préalable de Goroti SAS.
                </p>
              </div>

              <p>
                Les marques «  Goroti », les logos associés et les noms des univers (MusicVerse, GameVerse, etc.)
                sont des marques déposées ou en cours de dépôt auprès de l'INPI. Toute utilisation non autorisée
                constitue une contrefaçon passible de poursuites civiles et pénales.
              </p>

              <div className="p-4 rounded-xl bg-sky-950/20 border border-sky-800/30 space-y-2">
                <p className="text-sky-400 font-semibold text-sm">Droits des créateurs</p>
                <p className="text-gray-400 text-sm">
                  Les utilisateurs conservent l'intégralité de leurs droits de propriété intellectuelle sur les
                  contenus qu'ils publient. La publication sur Goroti n'entraîne pas de transfert de propriété.
                  Une licence d'utilisation limitée est accordée à Goroti pour les seuls besoins du service
                  (voir les CGU pour les détails).
                </p>
              </div>

              <p>
                Les créateurs certifient, en publiant leur contenu, détenir tous les droits nécessaires
                (droits d'auteur, droits voisins, droits musicaux, droits à l'image) sur les éléments
                composant leur contenu. Toute réclamation de tiers relative à un contenu publié engage
                exclusivement la responsabilité du créateur.
              </p>
            </div>
          </Section>

          <Section icon={Shield} title="4. Données personnelles et RGPD" accent="text-emerald-400">
            <p>
              Goroti SAS traite des données personnelles en qualité de responsable du traitement,
              conformément au Règlement Général sur la Protection des Données (RGPD – Règlement UE 2016/679)
              et à la loi n° 78-17 du 6 janvier 1978 modifiée (loi Informatique et Libertés).
            </p>
            <div className="mt-3 p-4 rounded-xl bg-white/[0.03] border border-white/6 space-y-1.5 text-sm">
              <InfoRow label="DPO (Délégué à la Protection des Données)" value="privacy@goroti.com" href="mailto:privacy@goroti.com" />
              <InfoRow label="Finalité principale" value="Fourniture et amélioration du service de plateforme vidéo" />
              <InfoRow label="Base légale principale" value="Exécution du contrat d'utilisation" />
            </div>
            <p className="mt-3">
              Vous disposez de droits d'accès, de rectification, d'effacement, de portabilité, d'opposition
              et de limitation. Pour plus d'informations et pour exercer ces droits, consultez notre{' '}
              <button onClick={() => onNavigate('privacy')} className="text-sky-400 hover:text-sky-300 underline">
                Politique de Confidentialité
              </button>
              .
            </p>
            <p className="mt-2">
              Vous pouvez également déposer une réclamation auprès de la CNIL :{' '}
              <a href="https://www.cnil.fr" className="text-sky-400 hover:text-sky-300">www.cnil.fr</a>
            </p>
          </Section>

          <Section icon={Globe} title="5. Cookies">
            <p>
              La plateforme Goroti utilise des cookies et technologies similaires pour assurer son
              fonctionnement, mémoriser vos préférences et réaliser des statistiques d'utilisation anonymes.
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { type: 'Essentiels', color: 'emerald', desc: 'Authentification, sécurité, session' },
                { type: 'Analytiques', color: 'blue', desc: 'Statistiques anonymisées de navigation' },
                { type: 'Fonctionnels', color: 'amber', desc: 'Préférences utilisateur, qualité vidéo' },
              ].map(({ type, color, desc }) => (
                <div key={type} className={`p-4 rounded-xl bg-${color}-950/20 border border-${color}-800/30`}>
                  <p className={`text-${color}-400 font-semibold text-sm`}>{type}</p>
                  <p className="text-gray-500 text-xs mt-1">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-gray-400">
              Conformément aux recommandations de la CNIL, les cookies non essentiels nécessitent votre
              consentement. Vous pouvez gérer vos préférences à tout moment via le gestionnaire de cookies
              accessible en bas de page ou dans les paramètres de votre compte.
            </p>
          </Section>

          <Section icon={AlertTriangle} title="6. Limitation de responsabilité" accent="text-rose-400">
            <div className="space-y-3">
              <p>
                Goroti SAS agit en qualité d'hébergeur au sens de l'article 6-I-2 de la loi pour la Confiance
                dans l'Économie Numérique (LCEN) pour les contenus publiés par ses utilisateurs. À ce titre,
                Goroti ne peut voir sa responsabilité civile ou pénale engagée en raison des informations
                stockées par des utilisateurs, à condition d'avoir procédé promptement au retrait desdites
                informations dès qu'elles ont été signalées.
              </p>
              <p>
                Goroti s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées.
                Toutefois, la plateforme ne peut garantir l'exhaustivité, la précision ou la pertinence
                des informations mises à disposition, et décline toute responsabilité pour les erreurs
                ou omissions éventuelles.
              </p>
              <p>
                Goroti ne saurait être tenue responsable des dommages directs ou indirects résultant :
              </p>
              <ul className="space-y-1.5 ml-2">
                {[
                  'D\'une indisponibilité temporaire ou définitive du service',
                  'D\'une perte ou d\'une corruption de données',
                  'D\'une intrusion frauduleuse par un tiers',
                  'De l\'utilisation de liens hypertextes pointant vers des sites tiers',
                  'Du comportement ou des contenus publiés par des tiers utilisateurs',
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0 mt-1.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          <Section icon={FileText} title="7. Liens hypertextes" accent="text-gray-400">
            <p>
              La création de liens hypertextes pointant vers la plateforme Goroti est soumise à autorisation
              préalable de Goroti SAS. Pour toute demande, contactez : <a href="mailto:contact@goroti.com" className="text-sky-400 hover:text-sky-300">contact@goroti.com</a>
            </p>
            <p className="mt-2">
              Goroti décline toute responsabilité concernant le contenu des sites tiers vers lesquels
              des liens peuvent être présents sur la plateforme. Ces liens n'impliquent aucune approbation
              de notre part quant au contenu de ces sites.
            </p>
          </Section>

          <Section icon={Scale} title="8. Droit applicable et juridiction">
            <p>
              Les présentes mentions légales sont soumises au droit français.
              En cas de litige relatif à leur interprétation ou à leur application,
              les parties s'engagent à rechercher une solution amiable avant tout recours judiciaire.
            </p>
            <p className="mt-2">
              À défaut d'accord amiable, tout litige sera soumis à la compétence exclusive
              du Tribunal de Commerce de Paris, ou du Tribunal judiciaire de Paris pour les
              litiges relevant de la compétence des juridictions civiles, sauf disposition
              légale contraire applicable aux consommateurs.
            </p>
            <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/6">
              <p className="text-white text-sm font-semibold mb-2">Textes législatifs applicables</p>
              <ul className="space-y-1 text-xs text-gray-500">
                {[
                  'Loi n° 2004-575 du 21 juin 2004 pour la Confiance dans l\'Économie Numérique (LCEN)',
                  'Règlement Général sur la Protection des Données (RGPD – UE 2016/679)',
                  'Loi n° 78-17 du 6 janvier 1978 modifiée (Informatique et Libertés)',
                  'Règlement UE sur les Services Numériques (DSA – Digital Services Act)',
                  'Code de la Propriété Intellectuelle',
                  'Code de la Consommation',
                ].map((law, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1 h-1 rounded-full bg-gray-600 flex-shrink-0 mt-1.5" />
                    {law}
                  </li>
                ))}
              </ul>
            </div>
          </Section>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-white font-semibold">Contactez notre service juridique</p>
              <p className="text-gray-400 text-sm mt-1">Pour toute demande légale, signalement ou réclamation.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="mailto:legal@goroti.com"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-medium transition-colors border border-white/10"
              >
                <Mail className="w-4 h-4" />
                legal@goroti.com
              </a>
              <button
                onClick={() => onNavigate('support')}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('terms')} className="hover:text-gray-300 transition-colors">CGU</button>
            <button onClick={() => onNavigate('privacy')} className="hover:text-gray-300 transition-colors">Confidentialité</button>
          </div>
          <span>© 2026 Goroti SAS — {LAST_UPDATED}</span>
        </div>
      </div>
    </div>
  );
}
