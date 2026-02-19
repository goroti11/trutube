import { useState } from 'react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';
import {
  Shield, FileText, AlertTriangle, Scale, Clock, Globe,
  ChevronDown, ChevronUp, CheckCircle, ArrowRight, Fingerprint,
  Music, Video, Image, ExternalLink, Mail
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

export default function CopyrightPolicyPage({ onNavigate }: Props) {
  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-sm mb-5">
            <Shield className="w-4 h-4" />
            Politique de droits d'auteur
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Droits d'auteur & Copyright Goroti
          </h1>
          <p className="text-gray-400 mb-4">
            Cette politique décrit comment Goroti protège les droits d'auteur, traite les signalements
            et gère les procédures de retrait et de contestation.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Version 2.0</span>
            <span>•</span>
            <span>Dernière mise à jour : 19 février 2026</span>
            <span>•</span>
            <span>Conforme DMCA, DSA et Directive UE 2019/790</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-16">

        {/* Ce qui est protégé */}
        <Section icon={FileText} color="text-cyan-400" title="Contenus protégés — Vos obligations">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Tout contenu publié sur Goroti doit respecter les droits de propriété intellectuelle.
            Vous devez posséder ou avoir obtenu les droits nécessaires sur <strong className="text-white">tout</strong> contenu publié.
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-5">
            {[
              {
                icon: Video,
                color: 'text-blue-400',
                label: 'Vidéo & images',
                items: ['Droits d\'auteur sur les images', 'Droits sur les séquences vidéo', 'Droit à l\'image des personnes', 'Fonds musicaux des vidéos'],
              },
              {
                icon: Music,
                color: 'text-green-400',
                label: 'Musique & audio',
                items: ['Droits d\'auteur compositeurs', 'Droits voisins (interprètes, labels)', 'Licence mécanique pour covers', 'Synchronisation musique/vidéo'],
              },
              {
                icon: Image,
                color: 'text-yellow-400',
                label: 'Textes & marques',
                items: ['Textes originaux et traductions', 'Logiciels et code source', 'Marques déposées', 'Noms de domaine et identités'],
              },
            ].map(({ icon: Icon, color, label, items }) => (
              <div key={label} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <Icon className={`w-4 h-4 ${color} mb-2`} />
                <h3 className="font-medium text-white text-xs mb-2">{label}</h3>
                <ul className="space-y-1">
                  {items.map(item => (
                    <li key={item} className="text-xs text-gray-500 flex gap-1.5">
                      <span className="text-gray-700 shrink-0">•</span>{item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="p-4 bg-yellow-900/10 border border-yellow-800/30 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-yellow-400 inline mr-1.5 -mt-0.5" />
            <span className="text-yellow-300 text-xs font-medium">Règle fondamentale :</span>
            <p className="text-gray-400 text-xs mt-1">
              En cas de doute sur vos droits, ne publiez pas. Il est toujours préférable de vérifier avant
              de publier plutôt que de subir un retrait ou une suspension de compte.
            </p>
          </div>
        </Section>

        {/* Signalement */}
        <Section icon={AlertTriangle} color="text-red-400" title="Signalement d'une violation">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Si vous estimez que votre contenu est reproduit sur Goroti sans autorisation,
            vous pouvez soumettre un signalement via notre procédure officielle.
          </p>

          <div className="space-y-3 mb-6">
            {[
              {
                step: '1',
                title: 'Localiser le contenu',
                desc: 'Identifiez l\'URL exacte du contenu violant vos droits sur Goroti.',
              },
              {
                step: '2',
                title: 'Utiliser le formulaire de signalement',
                desc: 'Cliquez sur "..." sur la vidéo ou la page concernée > "Signaler une violation de droits". Choisissez la catégorie "Copyright / Propriété intellectuelle".',
              },
              {
                step: '3',
                title: 'Fournir les informations requises',
                desc: 'Lien vers l\'original, description de l\'œuvre protégée, preuve de propriété, déclaration sous serment de bonne foi.',
              },
              {
                step: '4',
                title: 'Traitement et décision',
                desc: 'Notre équipe examine sous 24 à 72h ouvrées. Si la violation est avérée, le contenu est retiré et le créateur notifié. Vous recevez confirmation par email.',
              },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4 p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="w-7 h-7 rounded-full bg-red-500/10 text-red-400 text-xs font-bold flex items-center justify-center shrink-0">
                  {step}
                </div>
                <div>
                  <div className="font-medium text-white text-sm mb-0.5">{title}</div>
                  <div className="text-gray-400 text-xs leading-relaxed">{desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-gray-900/30 border border-gray-800 rounded-xl">
            <h3 className="font-semibold text-white text-sm mb-2">Contact direct équipe droits</h3>
            <p className="text-gray-400 text-xs mb-2">Pour les signalements urgents ou les demandes de labels/éditeurs :</p>
            <a href="mailto:copyright@trutube.tv" className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
              copyright@trutube.tv
            </a>
          </div>
        </Section>

        {/* Contre-notification */}
        <Section icon={Scale} color="text-yellow-400" title="Contre-notification (contestation)">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Si votre contenu a été retiré suite à un signalement que vous estimez incorrect ou abusif,
            vous disposez du droit de contester cette décision.
          </p>

          <div className="space-y-3 mb-5">
            <AccordionItem title="Délais de contestation">
              <p>Vous disposez de <strong className="text-white">14 jours calendaires</strong> à compter de la notification de retrait pour soumettre une contre-notification. Passé ce délai, le retrait est définitif.</p>
            </AccordionItem>
            <AccordionItem title="Comment soumettre une contre-notification">
              <p>Créateur Studio &gt; Violations &gt; "Contester". Vous devrez :</p>
              <ul className="mt-2 space-y-1">
                {[
                  'Identifier précisément le contenu retiré',
                  'Expliquer pourquoi vous êtes autorisé à publier ce contenu',
                  'Joindre les justificatifs : contrats de licence, attestations, preuves d\'achat de droits',
                  'Signer une déclaration sous serment de bonne foi',
                  'Accepter la compétence juridique applicable',
                ].map(item => (
                  <li key={item} className="flex gap-2 text-xs">
                    <CheckCircle className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Processus d'examen">
              <p>Notre équipe juridique examine la contre-notification sous <strong className="text-white">72h ouvrées</strong>. Le plaignant original est notifié et dispose de 10 jours pour saisir la justice. Si aucune action judiciaire n'est engagée dans ce délai, le contenu peut être rétabli.</p>
            </AccordionItem>
            <AccordionItem title="Médiation externe">
              <p>Si la décision de Goroti ne vous satisfait pas, vous pouvez faire appel à un organisme de résolution des litiges externe. Goroti coopère avec les ORL accrédités sous le Digital Services Act (DSA). Contact : <span className="text-cyan-400">mediation@trutube.tv</span></p>
            </AccordionItem>
          </div>

          <div className="p-4 bg-red-900/10 border border-red-800/30 rounded-xl">
            <AlertTriangle className="w-4 h-4 text-red-400 inline mr-1.5 -mt-0.5" />
            <span className="text-red-300 text-xs font-medium">Abus de signalement :</span>
            <p className="text-gray-400 text-xs mt-1">
              Les signalements manifestement abusifs ou les fausses déclarations sous serment peuvent entraîner
              la suspension définitive du compte à l'origine du signalement et des poursuites judiciaires.
            </p>
          </div>
        </Section>

        {/* Suspension */}
        <Section icon={AlertTriangle} color="text-orange-400" title="Système d'avertissements & suspension">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Goroti applique un système progressif de sanctions en cas de violations répétées.
          </p>
          <div className="border border-gray-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 px-5 py-3 bg-gray-900/50 text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-800">
              <span>Étape</span>
              <span>Conséquence</span>
              <span>Durée</span>
            </div>
            {[
              { step: '1er avertissement', consequence: 'Notification + retrait du contenu', duration: 'Permanente dans le dossier' },
              { step: '2e avertissement', consequence: 'Restriction monétisation', duration: '30 jours' },
              { step: '3e avertissement', consequence: 'Suspension partielle (publication désactivée)', duration: '90 jours' },
              { step: '4e violation ou fraude', consequence: 'Suspension définitive du compte', duration: 'Permanente' },
            ].map(({ step, consequence, duration }, i) => (
              <div key={step} className={`grid grid-cols-3 px-5 py-3 text-sm ${i < 3 ? 'border-b border-gray-800' : ''}`}>
                <span className="text-gray-300 font-medium">{step}</span>
                <span className="text-gray-400">{consequence}</span>
                <span className="text-gray-500 text-xs">{duration}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-600 text-xs mt-3">
            Chaque avertissement peut être contesté dans un délai de 14 jours. Les violations résolues peuvent être retirées du dossier après 12 mois sans nouvelle violation.
          </p>
        </Section>

        {/* Blocage territorial */}
        <Section icon={Globe} color="text-blue-400" title="Blocage territorial">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Les détenteurs de droits ayant des licences limitées géographiquement peuvent demander
            un blocage territorial de leur contenu sur Goroti.
          </p>
          <div className="space-y-3">
            <AccordionItem title="Qui peut demander un blocage territorial ?">
              <p>Labels musicaux, studios de cinéma, distributeurs et tout détenteur de droits disposant d'une licence territoriale limitée. La demande doit être accompagnée d'une preuve documentaire de la restriction territoriale (contrat de licence, accord de distribution).</p>
            </AccordionItem>
            <AccordionItem title="Comment faire une demande ?">
              <p>Contacter <span className="text-cyan-400">rights@trutube.tv</span> avec :</p>
              <ul className="mt-2 space-y-1">
                {['URL du contenu concerné', 'Pays à bloquer (liste ISO 3166)', 'Preuve de la restriction territoriale', 'Coordonnées du détenteur de droits'].map(item => (
                  <li key={item} className="flex gap-2 text-xs">
                    <span className="text-gray-700">•</span>{item}
                  </li>
                ))}
              </ul>
            </AccordionItem>
            <AccordionItem title="Délais d'application">
              <p>Les blocages territoriaux validés sont appliqués sous <strong className="text-white">48h ouvrées</strong>. Pour les demandes urgentes (ex : contenu diffusé avant sortie officielle), un traitement prioritaire est disponible via <span className="text-cyan-400">urgent-rights@trutube.tv</span>.</p>
            </AccordionItem>
          </div>
        </Section>

        {/* Preuves horodatées */}
        <Section icon={Clock} color="text-cyan-400" title="Preuves horodatées & antériorité">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Goroti génère automatiquement des preuves d'antériorité pour chaque contenu publié.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
              <Fingerprint className="w-4 h-4 text-cyan-400 mb-2" />
              <h3 className="font-medium text-white text-sm mb-2">Ce qui est enregistré</h3>
              <ul className="space-y-1">
                {[
                  'Hash SHA-256 du fichier original',
                  'Timestamp UNIX de la première publication',
                  'Métadonnées EXIF/ID3 du fichier source',
                  'Signature cryptographique de l\'upload',
                  'Hash des modifications ultérieures',
                ].map(item => (
                  <li key={item} className="text-xs text-gray-400 flex gap-1.5">
                    <CheckCircle className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />{item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
              <Clock className="w-4 h-4 text-cyan-400 mb-2" />
              <h3 className="font-medium text-white text-sm mb-2">Comment obtenir votre certificat</h3>
              <p className="text-gray-400 text-xs leading-relaxed mb-3">
                Le certificat d'antériorité peut être téléchargé depuis Créateur Studio &gt;
                Contenu &gt; [Votre contenu] &gt; "Certificat de propriété".
              </p>
              <p className="text-gray-400 text-xs">
                Format disponible : PDF signé numériquement, valable comme preuve devant les juridictions françaises et européennes.
              </p>
            </div>
          </div>
        </Section>

        {/* Fingerprinting */}
        <Section icon={Fingerprint} color="text-green-400" title="Fingerprinting & détection automatique">
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Goroti analyse chaque upload pour détecter les contenus protégés existants.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Analyse audio', desc: 'Identification des enregistrements musicaux par empreinte acoustique. Base de données synchronisée avec les principaux agrégateurs de droits.' },
              { label: 'Analyse vidéo', desc: 'Détection de séquences visuelles protégées par comparaison d\'images clés. Fonctionne même sur les contenus réduits ou altérés.' },
              { label: 'Correspondances', desc: 'En cas de correspondance, le contenu est signalé avant publication pour vérification. Le créateur est invité à justifier ses droits.' },
            ].map(({ label, desc }) => (
              <div key={label} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <div className="font-medium text-white text-sm mb-2">{label}</div>
                <p className="text-gray-400 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* Contact */}
        <section className="py-10 border-t border-gray-800">
          <h2 className="text-xl font-bold text-white mb-5">Contacts droits d'auteur</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { label: 'Signalements copyright', email: 'copyright@trutube.tv', desc: 'Violations de droits d\'auteur' },
              { label: 'Blocage territorial', email: 'rights@trutube.tv', desc: 'Restrictions géographiques' },
              { label: 'Médiation & litiges', email: 'mediation@trutube.tv', desc: 'Contestations et arbitrage' },
            ].map(({ label, email, desc }) => (
              <div key={label} className="p-4 bg-gray-900/50 border border-gray-800 rounded-xl">
                <Mail className="w-4 h-4 text-gray-500 mb-2" />
                <div className="font-medium text-white text-sm mb-0.5">{label}</div>
                <div className="text-gray-600 text-xs mb-2">{desc}</div>
                <a href={`mailto:${email}`} className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors">{email}</a>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
