import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  DollarSign, CreditCard, RefreshCw, AlertTriangle, Shield,
  CheckCircle, ChevronDown, ChevronUp, ArrowRight, Clock,
  Wallet, Scale, FileText, Info
} from 'lucide-react';

interface Props {
  onNavigate: (page: string) => void;
}

function Section({ icon: Icon, color, title, children }: {
  icon: React.ElementType; color: string; title: string; children: React.ReactNode;
}) {
  return (
    <section className="py-10 border-t border-gray-800">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gray-800 rounded-lg">
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-900/40 transition-colors"
      >
        <span className="font-medium text-white text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-gray-800 last:border-0 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

export default function FinancialTermsPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm mb-5">
            <DollarSign className="w-4 h-4" />
            Conditions financières
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Conditions financières GOROTI
          </h1>
          <p className="text-gray-400 mb-4">
            Termes complets régissant les paiements, commissions, retraits et remboursements
            sur la plateforme GOROTI.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Version 2.0</span>
            <span>•</span>
            <span>Dernière mise à jour : 19 février 2026</span>
            <span>•</span>
            <span>Applicable à tous les utilisateurs</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">

        {/* Paiements */}
        <Section icon={CreditCard} color="text-blue-400" title="Paiements — Règles générales">
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Moyens de paiement acceptés</h3>
              <div className="space-y-2">
                {[
                  ['Carte bancaire', 'Visa, Mastercard, Amex'],
                  ['PayPal', 'Compte personnel ou professionnel'],
                  ['TruCoin', 'Monnaie virtuelle interne'],
                  ['Virement SEPA', 'Pour les achats B2B uniquement'],
                ].map(([method, detail]) => (
                  <div key={method as string} className="flex justify-between text-xs py-1.5 border-b border-gray-800 last:border-0">
                    <span className="text-gray-300 font-medium">{method}</span>
                    <span className="text-gray-500">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Devises et conversion</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Tous les prix sont affichés et traités en euros (EUR). Les paiements dans d'autres devises
                sont automatiquement convertis au taux du marché + 1% de frais de change.
              </p>
              <p className="text-gray-400 text-xs">
                Le traitement des paiements est assuré par des prestataires PSP certifiés PCI-DSS.
                GOROTI ne stocke jamais les données bancaires brutes.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <AccordionItem title="Sécurité des transactions">
              <p>Toutes les transactions utilisent le protocole 3D Secure lorsque disponible. Les transactions inhabituelles (montant élevé, pays différent, premier achat) peuvent déclencher une vérification supplémentaire.</p>
              <p>En cas de tentative de fraude détectée, la transaction est bloquée, l'utilisateur notifié et le cas transmis à notre équipe Sécurité sous 1h.</p>
            </AccordionItem>
            <AccordionItem title="Facturation et reçus">
              <p>Un reçu électronique est automatiquement généré pour chaque transaction et envoyé à l'email associé au compte. Les reçus sont disponibles dans votre Espace &gt; Historique des achats pendant 5 ans.</p>
              <p>Pour les créateurs, des attestations de revenus mensuels et un récapitulatif fiscal annuel sont disponibles dans Créateur Studio &gt; Finances &gt; Documents fiscaux.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* Commissions */}
        <Section icon={DollarSign} color="text-yellow-400" title="Commissions — Taux et règles">
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-5">
            <h3 className="font-semibold text-white text-sm mb-4">Tableau des commissions</h3>
            <Row label="Vente de contenu (vidéos, albums, cours)" value="15%" />
            <Row label="Abonnements membres chaîne" value="15%" />
            <Row label="Tips & super chats en direct" value="10%" />
            <Row label="Commandes marketplace" value="10%" />
            <Row label="Distribution externe (DSP)" value="5%" />
            <Row label="Abonnement Premium spectateur" value="100% GOROTI" />
          </div>

          <div className="p-4 bg-green-900/10 border border-green-800/30 rounded-xl mb-5">
            <Info className="w-4 h-4 text-green-400 inline mr-1.5 -mt-0.5" />
            <span className="text-green-300 text-xs font-medium">Ces taux incluent les frais de traitement bancaire.</span>
            <p className="text-gray-400 text-xs mt-1">
              Aucun frais supplémentaire de type "frais de plateforme", "frais de service" ou "frais d'infrastructure"
              ne peut être ajouté en sus de ces taux.
            </p>
          </div>

          <div className="space-y-3">
            <AccordionItem title="Modification des taux de commission">
              <p>GOROTI s'engage à notifier tout changement de taux de commission <strong className="text-white">30 jours calendaires à l'avance</strong> par email direct aux créateurs concernés et annonce publique.</p>
              <p>Les transactions réalisées avant l'entrée en vigueur d'un nouveau taux restent soumises au taux en vigueur au moment de la transaction.</p>
            </AccordionItem>
            <AccordionItem title="Remboursements d'acheteurs et impact créateur">
              <p>En cas de remboursement accordé à un acheteur dans les 14 jours (droit de rétractation UE) pour un contenu non-consommé, la commission précédemment créditée est débitée du wallet créateur.</p>
              <p>Si le remboursement est accordé pour une raison technique imputable à GOROTI, le créateur conserve sa commission.</p>
            </AccordionItem>
            <AccordionItem title="Litiges et rétrofacturations (chargebacks)">
              <p>En cas de chargeback initié par un acheteur auprès de sa banque, les fonds concernés sont bloqués en attente d'investigation. Si le chargeback est frauduleux, GOROTI défend la transaction et les fonds sont restaurés. Si justifié, le montant (commission incluse) est déduit du wallet créateur concerné.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* Retraits */}
        <Section icon={Wallet} color="text-green-400" title="Retraits — Conditions et délais">
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Conditions de retrait</h3>
              <Row label="Seuil minimum" value="10,00€" />
              <Row label="Fréquence maximale" value="1 retrait / semaine" />
              <Row label="KYC obligatoire" value="Oui (pour tout retrait)" />
              <Row label="Frais de retrait SEPA" value="Gratuit" />
              <Row label="Frais de retrait PayPal" value="Gratuit (seuil 25€)" />
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5">
              <h3 className="font-semibold text-white text-sm mb-3">Délais par méthode</h3>
              <Row label="Virement SEPA (EU)" value="3-5 jours ouvrés" />
              <Row label="Virement international" value="5-10 jours ouvrés" />
              <Row label="PayPal" value="1-2 jours ouvrés" />
              <Row label="Traitement des demandes" value="Chaque lundi" />
            </div>
          </div>

          <div className="space-y-3">
            <AccordionItem title="Disponibilité des fonds selon la source">
              <div className="space-y-2">
                {[
                  ['Tips et super chats', 'Disponibles immédiatement après réception'],
                  ['Ventes de contenu', 'Disponibles 48h après la transaction (anti-fraude)'],
                  ['Abonnements membres', 'Disponibles le 1er du mois suivant la période facturée'],
                  ['Marketplace', 'Disponibles 48h après validation de la livraison par l\'acheteur'],
                ].map(([source, delay]) => (
                  <div key={source as string} className="flex gap-3 text-xs">
                    <Clock className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                    <span><span className="text-white font-medium">{source} :</span> <span className="text-gray-400">{delay}</span></span>
                  </div>
                ))}
              </div>
            </AccordionItem>
            <AccordionItem title="Retrait en cas de suspension de compte">
              <p>Si votre compte est suspendu pour investigation, les fonds sont mis en quarantaine pendant la durée de l'enquête. Si la suspension est levée, les fonds sont restitués intégralement. En cas de suspension définitive pour fraude avérée, les fonds peuvent être saisis conformément aux conditions d'utilisation.</p>
            </AccordionItem>
            <AccordionItem title="Fonds non retirés — expiration">
              <p>Les fonds dans votre wallet ne sont pas soumis à expiration tant que votre compte est actif. En cas d'inactivité supérieure à 3 ans sans retrait, GOROTI peut vous contacter pour vérifier votre intention de retirer. Les soldes inférieurs à 1€ peuvent être annulés après 3 ans d'inactivité.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* Remboursements */}
        <Section icon={RefreshCw} color="text-red-400" title="Remboursements — Politique complète">
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="font-semibold text-white text-sm mb-3">Acheteurs — Droits de remboursement</h3>
              <div className="space-y-2 text-xs">
                {[
                  { case: 'Contenu non-consommé', right: '14 jours, droit UE', color: 'text-green-400' },
                  { case: 'Contenu défectueux', right: '30 jours, sur preuve', color: 'text-green-400' },
                  { case: 'Abonnement en cours', right: 'Prorata du mois', color: 'text-yellow-400' },
                  { case: 'Contenu consommé', right: 'Non remboursable', color: 'text-red-400' },
                  { case: 'TruCoins achetés', right: 'Non remboursables', color: 'text-red-400' },
                ].map(({ case: c, right, color }) => (
                  <div key={c} className="flex justify-between py-1.5 border-b border-gray-800 last:border-0">
                    <span className="text-gray-400">{c}</span>
                    <span className={`font-medium ${color}`}>{right}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="font-semibold text-white text-sm mb-3">Comment demander un remboursement</h3>
              <ol className="space-y-2">
                {[
                  'Profil > Mes achats > Sélectionner l\'achat',
                  'Cliquer sur "Demander un remboursement"',
                  'Choisir la raison parmi la liste proposée',
                  'Confirmer — traitement sous 3-5 jours ouvrés',
                  'Remboursement sur le moyen de paiement original',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-400 text-xs flex items-center justify-center shrink-0 font-bold">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="space-y-3">
            <AccordionItem title="Politique de remboursement créateur personnalisée">
              <p>Les créateurs peuvent définir leur propre politique de remboursement dans Créateur Studio &gt; Paramètres &gt; Politique commerciale, à condition qu'elle soit <strong className="text-white">au moins aussi favorable</strong> que la politique minimale GOROTI. Une politique plus restrictive que le droit de rétractation légal UE n'est pas autorisée.</p>
            </AccordionItem>
            <AccordionItem title="Remboursements pour raisons techniques">
              <p>Si un problème technique imputable à GOROTI empêche l'accès à un contenu payant pendant plus de 24h consécutives, les acheteurs concernés ont droit à un remboursement prorata ou à une extension de leur accès. Ces remboursements sont pris en charge par GOROTI et ne débitent pas le wallet créateur.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* Conformité fiscale */}
        <Section icon={Scale} color="text-orange-400" title="Conformité fiscale">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            GOROTI fournit les documents nécessaires à la déclaration fiscale de vos revenus.
          </p>
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-5 mb-5">
            <h3 className="font-semibold text-white text-sm mb-3">Documents fournis automatiquement</h3>
            <Row label="Relevé mensuel des revenus" value="Téléchargeable (PDF)" />
            <Row label="Récapitulatif fiscal annuel" value="Janvier de l'année N+1" />
            <Row label="Déclaration pays de résidence" value="Sur demande (5 jours)" />
            <Row label="Attestation TVA" value="Sur demande (5 jours)" />
          </div>

          <div className="space-y-3">
            <AccordionItem title="TVA — règles applicables">
              <p>Les prix affichés aux spectateurs sont TTC. Pour les créateurs :</p>
              <ul className="mt-2 space-y-1">
                {[
                  'Auto-entrepreneurs FR sous seuil : franchise de TVA applicable',
                  'SASU / SARL / SA : facture HT + TVA à reverser à l\'État',
                  'Créateurs UE hors France : règle du pays de résidence',
                  'Créateurs hors UE : pas de TVA sur les services numériques depuis GOROTI',
                ].map(rule => (
                  <li key={rule} className="flex gap-2 text-xs text-gray-400">
                    <span className="text-gray-700">•</span>{rule}
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Retenue à la source pour créateurs non-résidents UE">
              <p>Les créateurs résidant hors de l'Union Européenne peuvent être soumis à une retenue à la source selon les conventions fiscales bilatérales. Une attestation de résidence fiscale permet de bénéficier de taux réduits. Pour obtenir ce formulaire, contactez <span className="text-red-400">tax@goroti.tv</span>.</p>
            </AccordionItem>
            <AccordionItem title="Obligations de déclaration automatique (DAC7)">
              <p>Conformément à la Directive DAC7 (UE 2021/514), GOROTI est tenu de transmettre annuellement aux autorités fiscales les informations de revenus des créateurs dépassant certains seuils (250€ ou 30 transactions). Vous serez notifié si vous êtes concerné.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* Litiges financiers */}
        <Section icon={Shield} color="text-red-400" title="Litiges financiers & réclamations">
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="font-semibold text-white text-sm mb-3">Procédure de réclamation</h3>
              <ol className="space-y-2">
                {[
                  'Contacter support@goroti.tv avec le détail du litige',
                  'Notre équipe finance examine sous 72h ouvrées',
                  'Proposition de résolution envoyée par email',
                  'Si non satisfait : médiation externe (ORL agréé)',
                  'En dernier recours : juridiction compétente',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-gray-400">
                    <span className="w-4 h-4 rounded-full bg-red-500/10 text-red-400 text-xs flex items-center justify-center shrink-0">{i + 1}</span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
            <div className="p-5 bg-gray-900/50 border border-gray-800 rounded-xl">
              <h3 className="font-semibold text-white text-sm mb-3">Contacts finance</h3>
              <div className="space-y-3">
                {[
                  { label: 'Support paiements', email: 'payments@goroti.tv' },
                  { label: 'Litiges et remboursements', email: 'refunds@goroti.tv' },
                  { label: 'Questions fiscales', email: 'tax@goroti.tv' },
                  { label: 'Fraude et sécurité', email: 'fraud@goroti.tv' },
                ].map(({ label, email }) => (
                  <div key={label} className="flex justify-between items-center text-xs">
                    <span className="text-gray-400">{label}</span>
                    <a href={`mailto:${email}`} className="text-red-400 hover:text-red-300 transition-colors">{email}</a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 bg-yellow-900/10 border border-yellow-800/30 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-yellow-400 inline mr-1.5 -mt-0.5" />
            <span className="text-yellow-300 text-xs font-medium">Droit applicable :</span>
            <p className="text-gray-400 text-xs mt-1">
              Les présentes conditions financières sont régies par le droit français. En cas de litige,
              les parties s'efforceront de résoudre le différend à l'amiable avant tout recours judiciaire.
              Juridiction compétente : Tribunaux de Paris (France).
            </p>
          </div>
        </Section>

        <div className="py-8 border-t border-gray-800 flex gap-3 flex-wrap">
          <button
            onClick={() => onNavigate('pricing')}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Voir la tarification
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate('terms')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
          >
            Conditions d'utilisation générales
          </button>
        </div>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
