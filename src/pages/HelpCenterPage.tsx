import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronDown, ChevronUp, MessageCircle, Mail, Phone, BookOpen, Video, Shield, Wallet, Users, Settings } from 'lucide-react';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface HelpCenterPageProps {
  onNavigate: (page: string) => void;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface HelpCategory {
  title: string;
  icon: React.ReactNode;
  faqs: FAQItem[];
}

export function HelpCenterPage({ onNavigate }: HelpCenterPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('general');

  const categories: Record<string, HelpCategory> = {
    general: {
      title: 'Questions générales',
      icon: <BookOpen className="w-6 h-6 text-cyan-400" />,
      faqs: [
        {
          question: "Qu'est-ce que Goroti ?",
          answer: "Goroti est une plateforme de partage de vidéos révolutionnaire qui utilise un système d'univers thématiques pour organiser le contenu. Notre mission est de créer une communauté authentique où les créateurs peuvent prospérer."
        },
        {
          question: "Comment fonctionne la période d'essai gratuite ?",
          answer: "Vous bénéficiez de 15 jours d'accès gratuit à toutes les fonctionnalités premium de Goroti. Après cette période, vous pouvez continuer avec un compte gratuit limité ou souscrire à un abonnement premium."
        },
        {
          question: "Quelle est la différence entre gratuit et premium ?",
          answer: "Le compte gratuit permet de regarder des vidéos et d'interagir avec le contenu. Le compte premium offre l'upload illimité, les statistiques avancées, la monétisation, l'absence de publicités et des fonctionnalités exclusives."
        },
        {
          question: "Comment puis-je contacter le support ?",
          answer: "Vous pouvez nous contacter par email à support@goroti.com, via notre chat en direct, ou en utilisant le formulaire de contact disponible sur la page Support."
        }
      ]
    },
    account: {
      title: 'Compte et profil',
      icon: <Users className="w-6 h-6 text-cyan-400" />,
      faqs: [
        {
          question: "Comment créer un compte ?",
          answer: "Cliquez sur 'Connexion' dans le menu principal, puis sélectionnez 'Créer un compte'. Remplissez vos informations et vérifiez votre email pour activer votre compte."
        },
        {
          question: "Comment modifier mon profil ?",
          answer: "Accédez à votre profil, cliquez sur 'Modifier le profil' et mettez à jour vos informations. N'oubliez pas de sauvegarder vos modifications."
        },
        {
          question: "J'ai oublié mon mot de passe",
          answer: "Sur la page de connexion, cliquez sur 'Mot de passe oublié'. Entrez votre email et suivez les instructions pour réinitialiser votre mot de passe."
        },
        {
          question: "Comment supprimer mon compte ?",
          answer: "Allez dans Paramètres > Compte > Supprimer mon compte. Cette action est irréversible et supprimera toutes vos données."
        }
      ]
    },
    creator: {
      title: 'Créateurs de contenu',
      icon: <Video className="w-6 h-6 text-cyan-400" />,
      faqs: [
        {
          question: "Comment devenir créateur ?",
          answer: "Accédez à la section 'Devenir créateur' dans votre profil. Remplissez le formulaire et créez votre univers. Une fois validé, vous pourrez commencer à publier du contenu."
        },
        {
          question: "Qu'est-ce qu'un univers ?",
          answer: "Un univers est un espace thématique dédié où vous publiez votre contenu. Chaque créateur peut gérer un ou plusieurs univers selon sa niche."
        },
        {
          question: "Comment fonctionne la monétisation ?",
          answer: "Les créateurs premium peuvent gagner de l'argent via les publicités, les abonnements, les tips et le système de revenus basé sur l'engagement. Les paiements sont effectués mensuellement."
        },
        {
          question: "Quelles sont les règles de contenu ?",
          answer: "Le contenu doit respecter nos conditions d'utilisation : pas de contenu illégal, haineux ou trompeur. Les vidéos sont soumises à notre système de modération communautaire."
        }
      ]
    },
    technical: {
      title: 'Questions techniques',
      icon: <Settings className="w-6 h-6 text-cyan-400" />,
      faqs: [
        {
          question: "Quels formats vidéo sont acceptés ?",
          answer: "Nous acceptons MP4, MOV, AVI et WebM. Résolution maximale : 4K. Taille maximale : 10 GB pour les comptes premium, 2 GB pour les comptes gratuits."
        },
        {
          question: "Pourquoi ma vidéo ne se charge pas ?",
          answer: "Vérifiez votre connexion internet, essayez de vider le cache de votre navigateur, ou utilisez un navigateur différent. Si le problème persiste, contactez le support."
        },
        {
          question: "L'application mobile est-elle disponible ?",
          answer: "Oui, Goroti est optimisé pour mobile via notre interface web responsive. Des applications natives iOS et Android seront bientôt disponibles."
        },
        {
          question: "Comment améliorer la qualité de lecture ?",
          answer: "Ajustez la qualité vidéo dans les paramètres du lecteur. Pour une meilleure expérience, utilisez une connexion stable et fermez les autres onglets."
        }
      ]
    },
    payment: {
      title: 'Paiements et abonnements',
      icon: <Wallet className="w-6 h-6 text-cyan-400" />,
      faqs: [
        {
          question: "Quels sont les moyens de paiement acceptés ?",
          answer: "Nous acceptons les cartes bancaires (Visa, Mastercard, American Express), PayPal et les virements SEPA pour les abonnements annuels."
        },
        {
          question: "Comment annuler mon abonnement ?",
          answer: "Allez dans Paramètres > Abonnement > Gérer l'abonnement. Vous pouvez annuler à tout moment. Votre accès premium reste actif jusqu'à la fin de la période payée."
        },
        {
          question: "Puis-je obtenir un remboursement ?",
          answer: "Les remboursements sont possibles dans les 14 jours suivant l'achat si vous n'avez pas utilisé les fonctionnalités premium. Contactez le support pour toute demande."
        },
        {
          question: "Comment fonctionnent les tips ?",
          answer: "Les tips permettent de soutenir directement vos créateurs préférés. Goroti prend une commission de 5% sur chaque tip. Les créateurs reçoivent 95% du montant."
        }
      ]
    }
  };

  const toggleFAQ = (question: string) => {
    setExpandedFAQ(expandedFAQ === question ? null : question);
  };

  const filteredFAQs = Object.entries(categories).map(([key, category]) => ({
    key,
    ...category,
    faqs: category.faqs.filter(
      faq =>
        searchQuery === '' ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-gray-950">
      <Header onNavigate={onNavigate} showNavigation={true} />

      <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-gray-950 border-b border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-5">
            Centre d'aide Goroti
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Trouvez rapidement des réponses à vos questions
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher dans l'aide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-5 gap-3 mb-8">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`p-4 rounded-xl text-center transition-all ${
                selectedCategory === key
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
              }`}
            >
              <div className="mb-2 flex justify-center">{category.icon}</div>
              <div className="text-sm font-medium">{category.title}</div>
            </button>
          ))}
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {(searchQuery ? filteredFAQs : [{ key: selectedCategory, ...categories[selectedCategory] }]).map((category) => (
            <div key={category.key}>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3">
                {category.icon}
                {category.title}
              </h2>
              <div className="space-y-3">
                {category.faqs.map((faq) => (
                  <div
                    key={faq.question}
                    className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800"
                  >
                    <button
                      onClick={() => toggleFAQ(faq.question)}
                      className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors"
                    >
                      <span className="font-medium text-left">{faq.question}</span>
                      {expandedFAQ === faq.question ? (
                        <ChevronUp size={20} className="text-cyan-400 flex-shrink-0" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === faq.question && (
                      <div className="px-6 pb-4 text-gray-300 leading-relaxed animate-fade-in">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-4xl mx-auto mt-12 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-xl p-8 border border-cyan-500/30">
          <h3 className="text-2xl font-bold mb-4">Besoin d'aide supplémentaire ?</h3>
          <p className="text-gray-300 mb-6">
            Notre équipe de support est disponible 7j/7 pour répondre à toutes vos questions.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate('support')}
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors border border-gray-800"
            >
              <MessageCircle className="text-cyan-400" size={24} />
              <div className="text-left">
                <div className="font-medium">Chat en direct</div>
                <div className="text-sm text-gray-400">Réponse immédiate</div>
              </div>
            </button>
            <a
              href="mailto:support@goroti.com"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors border border-gray-800"
            >
              <Mail className="text-cyan-400" size={24} />
              <div className="text-left">
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-400">support@goroti.com</div>
              </div>
            </a>
            <a
              href="tel:+33123456789"
              className="flex items-center gap-3 p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors border border-gray-800"
            >
              <Phone className="text-cyan-400" size={24} />
              <div className="text-left">
                <div className="font-medium">Téléphone</div>
                <div className="text-sm text-gray-400">+33 1 23 45 67 89</div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
