import { FileText, Shield, AlertCircle, Users, Globe } from 'lucide-react';
import Header from '../components/Header';

interface TermsPageProps {
  onNavigate: (page: string) => void;
}

export const TermsPage = ({ onNavigate }: TermsPageProps) => {
  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Conditions Générales d'Utilisation</h1>
            <p className="text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">1. Présentation du service</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  TruTube est une plateforme de partage de vidéos décentralisée basée sur le concept d'univers thématiques.
                  Notre mission est de créer un écosystème transparent et équitable pour les créateurs de contenu et leur audience.
                </p>
                <p>
                  En utilisant TruTube, vous acceptez les présentes conditions générales d'utilisation. Si vous n'acceptez pas
                  ces conditions, veuillez ne pas utiliser le service.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Users className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">2. Compte utilisateur</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-white">2.1 Création de compte</p>
                <p>
                  Pour accéder à certaines fonctionnalités, vous devez créer un compte. Vous êtes responsable de la
                  confidentialité de vos identifiants et de toutes les activités effectuées sur votre compte.
                </p>
                <p className="font-medium text-white">2.2 Informations exactes</p>
                <p>
                  Vous vous engagez à fournir des informations exactes, complètes et à jour lors de votre inscription.
                  Vous devez mettre à jour vos informations en cas de changement.
                </p>
                <p className="font-medium text-white">2.3 Âge minimum</p>
                <p>
                  Vous devez avoir au moins 13 ans pour utiliser TruTube. Si vous avez entre 13 et 18 ans, vous devez avoir
                  l'autorisation d'un parent ou tuteur légal.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">3. Contenu et modération</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-white">3.1 Système anti-fausses vues</p>
                <p>
                  TruTube utilise un système avancé de détection des fausses vues et des comportements frauduleux. Les contenus
                  et comptes qui tentent de manipuler les statistiques seront pénalisés ou supprimés.
                </p>
                <p className="font-medium text-white">3.2 Modération communautaire</p>
                <p>
                  Notre plateforme utilise un système de modération décentralisé où les utilisateurs peuvent signaler du contenu
                  inapproprié. Les décisions de modération sont prises collectivement selon des règles transparentes.
                </p>
                <p className="font-medium text-white">3.3 Contenu interdit</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Violence extrême ou contenu choquant</li>
                  <li>Harcèlement, intimidation ou incitation à la haine</li>
                  <li>Contenu à caractère sexuel impliquant des mineurs</li>
                  <li>Violation de droits d'auteur ou de propriété intellectuelle</li>
                  <li>Désinformation grave et contenu trompeur</li>
                  <li>Spam et contenu publicitaire excessif</li>
                </ul>
                <p className="font-medium text-white">3.4 Propriété intellectuelle</p>
                <p>
                  Vous conservez tous les droits sur le contenu que vous publiez. En publiant sur TruTube, vous accordez à la
                  plateforme une licence non exclusive pour héberger, distribuer et afficher votre contenu.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">4. Univers et sous-univers</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-white">4.1 Système d'univers</p>
                <p>
                  Les créateurs peuvent organiser leur contenu en univers thématiques. Chaque univers fonctionne comme un espace
                  dédié avec ses propres règles et sa propre communauté.
                </p>
                <p className="font-medium text-white">4.2 Gestion des univers</p>
                <p>
                  Les créateurs d'univers ont la responsabilité de modérer leur espace selon les règles générales de TruTube.
                  Un univers peut être suspendu en cas de violation répétée des règles.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">5. Responsabilités et limitations</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-white">5.1 Disponibilité du service</p>
                <p>
                  TruTube s'efforce de maintenir le service disponible 24/7, mais ne garantit pas une disponibilité ininterrompue.
                  Des interruptions peuvent survenir pour maintenance ou raisons techniques.
                </p>
                <p className="font-medium text-white">5.2 Limitation de responsabilité</p>
                <p>
                  TruTube ne peut être tenu responsable des dommages directs ou indirects résultant de l'utilisation ou de
                  l'impossibilité d'utiliser le service.
                </p>
                <p className="font-medium text-white">5.3 Modifications du service</p>
                <p>
                  TruTube se réserve le droit de modifier, suspendre ou interrompre tout ou partie du service à tout moment,
                  avec ou sans préavis.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">6. Monétisation et transactions</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-white">6.1 Système de support</p>
                <p>
                  Les utilisateurs peuvent soutenir financièrement les créateurs via le système de tips et d'abonnements.
                  TruTube prélève une commission transparente sur chaque transaction.
                </p>
                <p className="font-medium text-white">6.2 Remboursements</p>
                <p>
                  Les paiements sont généralement non remboursables, sauf en cas d'erreur technique ou de fraude avérée.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">7. Confidentialité</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  L'utilisation de vos données personnelles est régie par notre Politique de Confidentialité. En utilisant
                  TruTube, vous acceptez également cette politique.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">8. Droit applicable</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  Les présentes CGU sont régies par le droit français. Tout litige relatif à leur interprétation ou exécution
                  relève de la compétence des tribunaux français.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">9. Contact</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  Pour toute question concernant ces conditions générales d'utilisation, vous pouvez nous contacter via la
                  <button
                    onClick={() => onNavigate('support')}
                    className="text-cyan-400 hover:text-cyan-300 underline ml-1"
                  >
                    page de support
                  </button>
                  .
                </p>
              </div>
            </section>
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => onNavigate('home')}
              className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
