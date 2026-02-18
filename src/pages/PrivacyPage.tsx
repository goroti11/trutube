import { Shield, Eye, Lock, Database, UserCheck, Globe } from 'lucide-react';
import Header from '../components/Header';

interface PrivacyPageProps {
  onNavigate: (page: string) => void;
}

export const PrivacyPage = ({ onNavigate }: PrivacyPageProps) => {
  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Politique de Confidentialité</h1>
            <p className="text-gray-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>

          <div className="space-y-8">
            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">1. Introduction</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  Chez TruTube, la protection de votre vie privée est une priorité absolue. Cette politique de
                  confidentialité explique comment nous collectons, utilisons, protégeons et partageons vos données
                  personnelles.
                </p>
                <p>
                  Nous nous engageons à être transparents sur nos pratiques et à vous donner le contrôle sur vos
                  informations personnelles.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">2. Données collectées</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-white">2.1 Informations que vous nous fournissez</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Nom d'utilisateur et informations de profil</li>
                  <li>Adresse email</li>
                  <li>Mot de passe (chiffré)</li>
                  <li>Contenu que vous publiez (vidéos, commentaires, etc.)</li>
                  <li>Informations de paiement (gérées par des processeurs tiers sécurisés)</li>
                </ul>

                <p className="font-medium text-white mt-4">2.2 Données collectées automatiquement</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Adresse IP et localisation approximative</li>
                  <li>Type d'appareil et système d'exploitation</li>
                  <li>Navigateur web utilisé</li>
                  <li>Historique de navigation sur TruTube</li>
                  <li>Données d'interaction (vues, likes, durée de visionnage)</li>
                  <li>Cookies et technologies similaires</li>
                </ul>

                <p className="font-medium text-white mt-4">2.3 Données pour la détection de fraude</p>
                <p>
                  Pour maintenir l'intégrité de notre système anti-fausses vues, nous collectons des métriques
                  comportementales anonymisées qui nous aident à détecter les activités suspectes.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">3. Utilisation des données</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>Nous utilisons vos données pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Fournir et améliorer nos services</li>
                  <li>Personnaliser votre expérience et vos recommandations</li>
                  <li>Détecter et prévenir les fraudes et abus</li>
                  <li>Communiquer avec vous (notifications, support)</li>
                  <li>Analyser les tendances et l'utilisation de la plateforme</li>
                  <li>Respecter nos obligations légales</li>
                  <li>Traiter les paiements et monétiser le contenu</li>
                </ul>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">4. Partage des données</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p className="font-medium text-white">Nous NE vendons JAMAIS vos données personnelles.</p>
                <p>Nous pouvons partager vos données dans les cas suivants :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Avec votre consentement explicite</li>
                  <li>Avec des fournisseurs de services tiers (hébergement, paiement, analytique)</li>
                  <li>Pour se conformer à des obligations légales</li>
                  <li>En cas de fusion ou acquisition (avec notification préalable)</li>
                  <li>Pour protéger les droits et la sécurité de TruTube et de ses utilisateurs</li>
                </ul>
                <p className="mt-3">
                  Tous nos partenaires sont contractuellement tenus de protéger vos données et de les utiliser
                  uniquement aux fins spécifiées.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">5. Sécurité des données</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>Nous mettons en œuvre des mesures de sécurité robustes :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Chiffrement des données en transit (HTTPS/TLS)</li>
                  <li>Chiffrement des mots de passe (hashing bcrypt)</li>
                  <li>Authentification à deux facteurs disponible</li>
                  <li>Surveillance continue des menaces</li>
                  <li>Audits de sécurité réguliers</li>
                  <li>Accès limité aux données personnelles (principe du moindre privilège)</li>
                </ul>
                <p className="mt-3">
                  Cependant, aucun système n'est infaillible. En cas de violation de données, nous vous en
                  informerons rapidement conformément à la réglementation.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">6. Vos droits</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>Conformément au RGPD et autres réglementations, vous avez le droit de :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Accès :</strong> Obtenir une copie de vos données personnelles</li>
                  <li><strong>Rectification :</strong> Corriger des données inexactes</li>
                  <li><strong>Suppression :</strong> Demander la suppression de vos données (droit à l'oubli)</li>
                  <li><strong>Portabilité :</strong> Recevoir vos données dans un format structuré</li>
                  <li><strong>Opposition :</strong> Vous opposer au traitement de vos données</li>
                  <li><strong>Limitation :</strong> Limiter le traitement de vos données</li>
                  <li><strong>Retrait du consentement :</strong> Retirer votre consentement à tout moment</li>
                </ul>
                <p className="mt-3">
                  Pour exercer ces droits, contactez-nous via la page de
                  <button
                    onClick={() => onNavigate('support')}
                    className="text-cyan-400 hover:text-cyan-300 underline mx-1"
                  >
                    support
                  </button>
                  ou à privacy@trutube.com
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Database className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">7. Cookies</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>TruTube utilise des cookies pour :</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Maintenir votre session connectée</li>
                  <li>Mémoriser vos préférences</li>
                  <li>Analyser l'utilisation du site</li>
                  <li>Améliorer la sécurité</li>
                </ul>
                <p className="mt-3">
                  Vous pouvez gérer les cookies via les paramètres de votre navigateur. Notez que la désactivation
                  de certains cookies peut affecter les fonctionnalités du site.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">8. Mineurs</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  TruTube n'est pas destiné aux enfants de moins de 13 ans. Nous ne collectons pas sciemment
                  d'informations personnelles d'enfants de moins de 13 ans.
                </p>
                <p>
                  Si vous êtes un parent et découvrez que votre enfant nous a fourni des informations personnelles,
                  contactez-nous immédiatement.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Globe className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">9. Modifications de cette politique</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>
                  Nous pouvons mettre à jour cette politique de confidentialité périodiquement. Les changements
                  significatifs vous seront notifiés par email ou via une notification sur la plateforme.
                </p>
                <p>
                  La date de dernière mise à jour est indiquée en haut de cette page.
                </p>
              </div>
            </section>

            <section className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <UserCheck className="w-6 h-6 text-cyan-500" />
                <h2 className="text-2xl font-semibold text-white">10. Contact</h2>
              </div>
              <div className="space-y-3 text-gray-300">
                <p>Pour toute question concernant cette politique de confidentialité :</p>
                <ul className="list-none space-y-2 ml-4">
                  <li>Email : privacy@trutube.com</li>
                  <li>
                    Page de support :
                    <button
                      onClick={() => onNavigate('support')}
                      className="text-cyan-400 hover:text-cyan-300 underline ml-1"
                    >
                      Contactez-nous
                    </button>
                  </li>
                </ul>
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
