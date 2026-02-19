import { useState } from 'react';
import {
  FileText, Shield, AlertCircle, Users, Globe, DollarSign, Gavel, Lock,
  ChevronDown, ChevronRight, ExternalLink, ArrowLeft
} from 'lucide-react';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

const LAST_UPDATED = '18 février 2026';
const VERSION = '2.1';

interface SectionProps {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
  accent?: string;
}

function Section({ icon: Icon, title, children, accent = 'text-sky-400' }: SectionProps) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border border-white/8 rounded-2xl overflow-hidden bg-[#111116]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${accent}`}>
            <Icon className="w-4.5 h-4.5" />
          </div>
          <h2 className="text-white font-bold text-lg">{title}</h2>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-500 flex-shrink-0" />}
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

export const TermsPage = ({ onNavigate }: TermsPageProps) => {
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
            <h1 className="text-white font-bold truncate">Conditions Générales d'Utilisation</h1>
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-full">v{VERSION}</span>
            <span className="text-xs text-gray-500">{LAST_UPDATED}</span>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-950/40 border border-sky-800/40 text-sky-400 text-xs font-semibold mb-6">
            <FileText className="w-3.5 h-3.5" />
            Version {VERSION} — Mise à jour le {LAST_UPDATED}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Conditions Générales<br />d'Utilisation
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl">
            Ces conditions régissent votre utilisation de la plateforme GOROTI. Merci de les lire
            attentivement avant d'utiliser nos services.
          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, label: 'Plateforme sécurisée', desc: 'Données chiffrées et protégées' },
              { icon: Globe, label: 'Droit français', desc: 'Conforme RGPD et DSA' },
              { icon: Users, label: 'Communauté', desc: 'Modération transparente' },
            ].map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.04] border border-white/6">
                <Icon className="w-5 h-5 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-semibold">{label}</p>
                  <p className="text-gray-500 text-xs">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Section id="1" icon={FileText} title="1. Présentation et acceptation du service">
            <Sub title="1.1 Présentation">
              <p>
                GOROTI est une plateforme de partage et de diffusion de contenu vidéo éditée par GOROTI SAS,
                société par actions simplifiée au capital de 100 000 €, immatriculée au RCS de Paris
                sous le numéro 123 456 789, dont le siège social est situé au 123 Avenue des Champs-Élysées,
                75008 Paris, France.
              </p>
              <p className="mt-2">
                La plateforme propose un système d'univers thématiques permettant aux créateurs de publier,
                diffuser et monétiser leurs contenus vidéo, audio, et écrits auprès d'une audience mondiale.
              </p>
            </Sub>
            <Sub title="1.2 Acceptation des conditions">
              <p>
                En accédant ou en utilisant GOROTI, vous déclarez avoir lu, compris et accepté sans réserve
                les présentes Conditions Générales d'Utilisation (« CGU »). Si vous n'acceptez pas ces conditions,
                vous devez cesser immédiatement toute utilisation du service.
              </p>
            </Sub>
            <Sub title="1.3 Modifications">
              <p>
                GOROTI se réserve le droit de modifier les présentes CGU à tout moment. Les modifications
                substantielles vous seront notifiées par email et/ou par une notification visible sur la plateforme
                au moins 30 jours avant leur entrée en vigueur. L'utilisation continue du service après notification
                constitue une acceptation des nouvelles conditions.
              </p>
            </Sub>
          </Section>

          <Section id="2" icon={Users} title="2. Conditions d'accès et comptes utilisateurs">
            <Sub title="2.1 Conditions d'éligibilité">
              <p>Pour utiliser GOROTI, vous devez :</p>
              <Ul items={[
                'Avoir au minimum 13 ans révolus. Entre 13 et 18 ans, l\'accord d\'un parent ou tuteur légal est requis.',
                'Disposer d\'une connexion Internet valide et d\'un navigateur compatible.',
                'Ne pas avoir fait l\'objet d\'une suspension ou exclusion préalable de la plateforme.',
                'Respecter la législation en vigueur dans votre pays de résidence.',
              ]} />
            </Sub>
            <Sub title="2.2 Création de compte">
              <p>
                L'inscription est gratuite. Vous devez fournir une adresse email valide et un mot de passe
                sécurisé. Vous êtes seul responsable de la confidentialité de vos identifiants et de l'ensemble
                des actions effectuées depuis votre compte.
              </p>
              <p className="mt-2">
                Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre
                inscription et à les maintenir à jour. GOROTI se réserve le droit de suspendre ou supprimer
                tout compte contenant des informations fausses ou trompeuses.
              </p>
            </Sub>
            <Sub title="2.3 Sécurité du compte">
              <p>
                Vous devez notifier immédiatement GOROTI de tout accès non autorisé à votre compte. GOROTI
                ne pourra être tenu responsable des dommages résultant du non-respect de cette obligation.
                L'utilisation de l'authentification à deux facteurs est fortement recommandée.
              </p>
            </Sub>
            <Sub title="2.4 Compte unique">
              <p>
                Chaque utilisateur ne peut posséder qu'un seul compte personnel. La création de comptes multiples
                dans le but de contourner des sanctions ou restrictions est strictement interdite et entraînera
                la suspension permanente de l'ensemble des comptes concernés.
              </p>
            </Sub>
          </Section>

          <Section id="3" icon={Shield} title="3. Règles de contenu et modération">
            <Sub title="3.1 Contenus strictement interdits">
              <p>Il est formellement interdit de publier, partager ou diffuser tout contenu :</p>
              <Ul items={[
                'À caractère pornographique, ou impliquant des mineurs de manière sexualisée (crime, signalement aux autorités systématique).',
                'Constituant une incitation à la haine, à la discrimination, à la violence, ou au terrorisme.',
                'Portant atteinte à la dignité humaine ou constituant du harcèlement envers toute personne.',
                'Violant des droits de propriété intellectuelle (copyright, marques déposées, brevets).',
                'Diffusant de la désinformation grave susceptible de causer un préjudice réel.',
                'Contenant des logiciels malveillants, phishing, ou code nuisible.',
                'Faisant la promotion de drogues illicites, d\'armes, ou d\'activités illégales.',
                'Portant atteinte à la vie privée d\'autrui sans consentement (revenge porn, doxxing, etc.).',
              ]} />
            </Sub>
            <Sub title="3.2 Contenus soumis à restriction d'âge">
              <p>
                Certains contenus légaux mais destinés à un public adulte (violence modérée, thèmes sensibles)
                peuvent être publiés sous réserve d'activer la restriction d'âge dans les paramètres de publication.
                Ces contenus ne sont accessibles qu'aux utilisateurs ayant déclaré être majeurs.
              </p>
            </Sub>
            <Sub title="3.3 Système de modération">
              <p>
                GOROTI applique un système de modération hybride combinant modération automatique (IA) et
                modération humaine. Les utilisateurs peuvent signaler tout contenu problématique. Les décisions
                de modération peuvent être contestées via le système de recours disponible dans votre espace
                personnel dans un délai de 30 jours.
              </p>
            </Sub>
            <Sub title="3.4 Système anti-manipulation">
              <p>
                Toute tentative de manipulation artificielle des métriques (vues, likes, abonnés) par des moyens
                automatisés, l'achat de faux engagement, ou tout comportement coordonné inauthentique est
                strictement prohibé. Les comptes et contenus impliqués feront l'objet d'une suppression immédiate
                et définitive, sans préjudice de poursuites judiciaires éventuelles.
              </p>
            </Sub>
            <Sub title="3.5 Propriété intellectuelle des créateurs">
              <p>
                Vous conservez l'intégralité de vos droits de propriété intellectuelle sur les contenus que vous
                publiez. En publiant sur GOROTI, vous accordez à la plateforme une licence mondiale, non exclusive,
                gratuite, sous-licenciable et transférable pour héberger, stocker, reproduire, modifier (uniquement
                à des fins techniques), diffuser et distribuer votre contenu dans le cadre du service.
                Cette licence prend fin dès la suppression du contenu ou du compte, dans les délais techniques habituels.
              </p>
            </Sub>
          </Section>

          <Section id="4" icon={DollarSign} title="4. Monétisation et transactions financières" accent="text-emerald-400">
            <Sub title="4.1 Conditions d'éligibilité à la monétisation">
              <p>Pour accéder aux fonctionnalités de monétisation, un créateur doit :</p>
              <Ul items={[
                'Avoir au minimum 18 ans révolus.',
                'Avoir complété et validé son profil légal (pièce d\'identité, informations bancaires).',
                'Respecter les CGU et ne pas avoir de sanction active.',
                'Avoir publié au moins 3 contenus originaux sur la plateforme.',
              ]} />
            </Sub>
            <Sub title="4.2 TruCoins et système de paiement">
              <p>
                GOROTI utilise une monnaie virtuelle interne appelée TruCoin, convertible en monnaie réelle selon
                les taux en vigueur. Les TruCoins acquis par les utilisateurs ne constituent pas une monnaie légale,
                ne génèrent pas d'intérêts, et ne peuvent pas être échangés entre utilisateurs sauf via les
                mécanismes prévus par la plateforme (tips, abonnements payants).
              </p>
            </Sub>
            <Sub title="4.3 Commission de la plateforme">
              <p>
                GOROTI prélève une commission sur les transactions de monétisation selon le barème suivant :
              </p>
              <Ul items={[
                'Tips et dons : 10% de la transaction.',
                'Abonnements créateurs : 20% du montant.',
                'Ventes de contenu numérique : 15% du prix de vente.',
                'Publicités natives : 30% des revenus publicitaires bruts.',
              ]} />
              <p className="mt-2">
                Ces taux sont susceptibles d'évoluer avec un préavis de 60 jours pour les modifications
                défavorables aux créateurs.
              </p>
            </Sub>
            <Sub title="4.4 Versements et remboursements">
              <p>
                Les versements aux créateurs sont effectués mensuellement, sous réserve d'un solde minimum de 50 €.
                Les paiements sont en principe non remboursables, sauf en cas d'erreur technique avérée ou de fraude
                caractérisée. Tout litige relatif à une transaction doit être signalé dans les 30 jours suivant
                l'opération concernée.
              </p>
            </Sub>
            <Sub title="4.5 Obligations fiscales">
              <p>
                Chaque créateur est seul responsable de la déclaration et du paiement des impôts et cotisations
                sociales relatifs aux revenus perçus via GOROTI. GOROTI émet des récapitulatifs annuels de
                revenus sur simple demande.
              </p>
            </Sub>
          </Section>

          <Section id="5" icon={Globe} title="5. Univers, communautés et contenu organisé">
            <Sub title="5.1 Système d'univers">
              <p>
                GOROTI organise son contenu en univers thématiques (Music, Game, Know, Culture, Life, Mind,
                Lean, Movie, Sport). Chaque univers dispose de sous-catégories spécifiques. Les créateurs
                sélectionnent l'univers le plus pertinent lors de la publication de leur contenu.
              </p>
            </Sub>
            <Sub title="5.2 Communautés">
              <p>
                Les utilisateurs peuvent créer et rejoindre des communautés autour de centres d'intérêt communs.
                Les administrateurs de communautés peuvent définir leurs propres règles complémentaires, sous
                réserve de conformité avec les présentes CGU. GOROTI n'est pas responsable des règles
                spécifiques édictées par les communautés.
              </p>
            </Sub>
            <Sub title="5.3 Contenus premium">
              <p>
                Certains contenus peuvent être réservés aux abonnés payants d'un créateur (contenu premium).
                L'accès à ces contenus est conditionné à une souscription active. En cas de résiliation
                d'abonnement, les contenus premium ne sont plus accessibles mais restent hébergés.
              </p>
            </Sub>
          </Section>

          <Section id="6" icon={Lock} title="6. Vie privée et données personnelles" accent="text-blue-400">
            <Sub title="6.1 Politique de confidentialité">
              <p>
                La collecte et le traitement de vos données personnelles sont régis par notre
                <button onClick={() => onNavigate('privacy')} className="text-sky-400 hover:text-sky-300 underline mx-1">
                  Politique de Confidentialité
                </button>
                qui fait partie intégrante des présentes CGU. En acceptant ces CGU, vous acceptez également
                la politique de confidentialité.
              </p>
            </Sub>
            <Sub title="6.2 Conformité RGPD">
              <p>
                GOROTI traite vos données dans le respect du Règlement Général sur la Protection des Données
                (RGPD) et de la loi Informatique et Libertés. Vous disposez d'un droit d'accès, de rectification,
                de suppression, de portabilité, et d'opposition sur vos données personnelles, exerceable via
                les paramètres de votre compte ou en contactant privacy@goroti.com.
              </p>
            </Sub>
          </Section>

          <Section id="7" icon={AlertCircle} title="7. Responsabilités et garanties" accent="text-amber-400">
            <Sub title="7.1 Responsabilité de l'utilisateur">
              <p>
                Vous êtes entièrement responsable des contenus que vous publiez et des actions effectuées
                depuis votre compte. Vous garantissez que vos contenus ne violent aucun droit de tiers ni
                aucune disposition légale ou réglementaire.
              </p>
            </Sub>
            <Sub title="7.2 Limitation de responsabilité de GOROTI">
              <p>
                Dans les limites autorisées par le droit applicable, GOROTI ne peut être tenu responsable :
              </p>
              <Ul items={[
                'Des dommages directs ou indirects résultant de l\'utilisation ou de l\'impossibilité d\'utiliser le service.',
                'Des contenus publiés par les utilisateurs (GOROTI agit en tant qu\'hébergeur au sens de la loi).',
                'Des interruptions, bugs ou indisponibilités du service, quel qu\'en soit la cause.',
                'De la perte de données en cas de force majeure ou d\'attaque informatique.',
                'Des décisions prises sur la base des informations disponibles sur la plateforme.',
              ]} />
            </Sub>
            <Sub title="7.3 Disponibilité du service">
              <p>
                GOROTI vise une disponibilité de 99,5% par mois. Des interruptions peuvent survenir pour
                maintenance planifiée (notifiée à l'avance) ou maintenance d'urgence. GOROTI ne garantit pas
                la disponibilité continue et sans interruption du service.
              </p>
            </Sub>
            <Sub title="7.4 Liens externes">
              <p>
                La plateforme peut contenir des liens vers des sites tiers. GOROTI n'exerce aucun contrôle
                sur ces sites et décline toute responsabilité quant à leur contenu ou leurs pratiques de
                confidentialité.
              </p>
            </Sub>
          </Section>

          <Section id="8" icon={Gavel} title="8. Sanctions et résiliation" accent="text-red-400">
            <Sub title="8.1 Violations et sanctions">
              <p>En cas de violation des présentes CGU, GOROTI peut, selon la gravité de l'infraction :</p>
              <Ul items={[
                'Émettre un avertissement écrit.',
                'Supprimer ou masquer le contenu en infraction.',
                'Suspendre temporairement l\'accès au compte (de 24h à 90 jours).',
                'Suspendre définitivement le compte et l\'ensemble des services associés.',
                'Retenir les revenus générés pendant la période d\'infraction.',
                'Saisir les autorités compétentes en cas d\'infraction pénale.',
              ]} />
            </Sub>
            <Sub title="8.2 Procédure de recours">
              <p>
                Toute décision de suspension ou de suppression peut être contestée dans un délai de 30 jours
                via le formulaire de recours disponible dans votre espace personnel. GOROTI s'engage à
                examiner chaque recours dans un délai de 15 jours ouvrés et à vous informer de la décision finale.
              </p>
            </Sub>
            <Sub title="8.3 Résiliation par l'utilisateur">
              <p>
                Vous pouvez supprimer votre compte à tout moment depuis les paramètres de votre compte.
                La suppression entraîne la suppression définitive de vos données personnelles dans un délai
                de 90 jours, à l'exception des données conservées pour des obligations légales (données de
                transaction conservées 10 ans).
              </p>
            </Sub>
          </Section>

          <Section id="9" icon={Scale} title="9. Droit applicable et résolution des litiges">
            <Sub title="9.1 Droit applicable">
              <p>
                Les présentes CGU sont régies par le droit français, et notamment par les dispositions
                applicables du Code civil, du Code de la consommation, de la loi n° 2004-575 du 21 juin 2004
                pour la Confiance dans l'Économie Numérique (LCEN), et du Règlement Européen sur les Services
                Numériques (DSA – Digital Services Act).
              </p>
            </Sub>
            <Sub title="9.2 Médiation et litiges">
              <p>
                En cas de litige, vous pouvez contacter notre service client en priorité. Si aucune solution
                amiable n'est trouvée dans un délai de 30 jours, vous pouvez recourir à la médiation de la
                consommation via la plateforme européenne de règlement en ligne des litiges (RLL) accessible
                à l'adresse ec.europa.eu/consumers/odr.
              </p>
            </Sub>
            <Sub title="9.3 Juridiction compétente">
              <p>
                À défaut de résolution amiable ou par médiation, tout litige relatif à l'interprétation
                ou à l'exécution des présentes CGU relève de la compétence exclusive des tribunaux de Paris,
                sauf disposition légale impérative contraire applicable aux consommateurs.
              </p>
            </Sub>
          </Section>

          <Section id="10" icon={FileText} title="10. Dispositions diverses">
            <Sub title="10.1 Intégralité de l'accord">
              <p>
                Les présentes CGU, la Politique de Confidentialité et les éventuelles conditions spécifiques
                (programme partenaire, publicités) constituent l'intégralité de l'accord entre GOROTI et
                l'utilisateur, et remplacent tous les accords antérieurs.
              </p>
            </Sub>
            <Sub title="10.2 Divisibilité">
              <p>
                Si une disposition des présentes CGU était déclarée nulle ou inapplicable par une juridiction
                compétente, cette nullité n'affecterait pas les autres dispositions qui demeureraient
                pleinement en vigueur.
              </p>
            </Sub>
            <Sub title="10.3 Non-renonciation">
              <p>
                Le fait pour GOROTI de ne pas se prévaloir à un moment donné d'une disposition des CGU
                ne saurait être interprété comme une renonciation à se prévaloir ultérieurement de ladite
                disposition.
              </p>
            </Sub>
          </Section>
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-white/[0.03] border border-white/8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div>
              <p className="text-white font-semibold">Des questions sur ces conditions ?</p>
              <p className="text-gray-400 text-sm mt-1">Notre équipe juridique est disponible pour vous répondre.</p>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => onNavigate('support')}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-colors"
              >
                Contacter le support
              </button>
              <a
                href="mailto:legal@goroti.com"
                className="flex items-center gap-1.5 px-5 py-2.5 border border-white/10 hover:border-white/20 text-gray-300 hover:text-white rounded-xl text-sm font-medium transition-colors"
              >
                legal@goroti.com
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-gray-300 transition-colors">Confidentialité</button>
            <button onClick={() => onNavigate('legal')} className="hover:text-gray-300 transition-colors">Mentions légales</button>
          </div>
          <span>© 2026 GOROTI SAS — Tous droits réservés</span>
        </div>
      </div>
    </div>
  );
};

function Scale({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v18M5 8l7-5 7 5M3 20h18M5 8v12h14V8"/>
    </svg>
  );
}
