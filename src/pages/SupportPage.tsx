import { useState } from 'react';
import {
  MessageCircle, Mail, HelpCircle, Book, AlertCircle, Check, Loader2, Send
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';

interface SupportPageProps {
  onNavigate: (page: string) => void;
}

const FAQ_ITEMS = [
  {
    question: 'Comment fonctionne le système anti-fausses vues?',
    answer: 'Goroti utilise un algorithme sophistiqué qui analyse le comportement des utilisateurs, la durée de visionnage, les interactions et d\'autres métriques pour détecter les fausses vues. Les contenus avec des vues artificiellement gonflées sont pénalisés dans les recommandations.',
  },
  {
    question: 'Comment créer mon propre univers?',
    answer: 'Pour créer un univers, accédez à votre tableau de bord créateur et cliquez sur "Créer un univers". Vous devrez définir un nom, une description, et les règles de votre univers. Une fois validé, votre univers sera accessible à tous.',
  },
  {
    question: 'Comment puis-je gagner de l\'argent sur Goroti?',
    answer: 'Goroti offre plusieurs moyens de monétisation: les tips directs de votre audience, les abonnements mensuels, et le partage des revenus publicitaires basé sur l\'engagement réel (pas seulement les vues).',
  },
  {
    question: 'Quelle est la différence entre univers et sous-univers?',
    answer: 'Un univers est un espace thématique principal (ex: "Gaming"). Les sous-univers sont des catégories plus spécifiques au sein d\'un univers (ex: "FPS", "RPG"). Cela permet une organisation plus fine du contenu.',
  },
  {
    question: 'Que faire si mon contenu est copié?',
    answer: 'Utilisez le système de signalement pour rapporter la violation. Notre équipe examinera le cas et prendra les mesures appropriées. Vous pouvez également nous contacter directement via ce formulaire de support.',
  },
  {
    question: 'Comment fonctionne la modération communautaire?',
    answer: 'Les utilisateurs avec un bon historique peuvent voter sur les signalements. Un contenu signalé est examiné par plusieurs modérateurs communautaires. Si un consensus est atteint, des actions sont prises automatiquement.',
  },
];

export const SupportPage = ({ onNavigate }: SupportPageProps) => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    if (!subject.trim() || !message.trim() || !selectedCategory) {
      setError('Veuillez remplir tous les champs');
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.from('support_tickets').insert({
        user_id: user?.id || null,
        email: user?.email || 'anonymous',
        category: selectedCategory,
        subject: subject.trim(),
        message: message.trim(),
        status: 'open',
      });

      if (error) throw error;

      setSuccess(true);
      setSubject('');
      setMessage('');
      setSelectedCategory('');

      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header onNavigate={onNavigate} showNavigation={true} />
      <div className="min-h-screen bg-gray-950 py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-white mb-4">Centre d'aide et support</h1>
            <p className="text-gray-400 text-lg">
              Trouvez des réponses à vos questions ou contactez notre équipe
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <HelpCircle className="w-6 h-6 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">FAQ</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Consultez les questions fréquemment posées par notre communauté
              </p>
              <p className="text-cyan-400 font-medium">Plus de 50 articles disponibles</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8 hover:border-cyan-500/50 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-lg">
                  <Book className="w-6 h-6 text-cyan-500" />
                </div>
                <h2 className="text-2xl font-semibold text-white">Documentation</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Guides détaillés pour créateurs et utilisateurs
              </p>
              <p className="text-cyan-400 font-medium">Tutoriels vidéo et articles</p>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Questions fréquentes</h2>
            <div className="space-y-4">
              {FAQ_ITEMS.map((item, index) => (
                <details
                  key={index}
                  className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden group"
                >
                  <summary className="px-6 py-4 cursor-pointer hover:bg-gray-800/50 transition-colors flex items-center justify-between">
                    <span className="text-white font-medium">{item.question}</span>
                    <HelpCircle className="w-5 h-5 text-gray-400 group-open:text-cyan-500 transition-colors" />
                  </summary>
                  <div className="px-6 pb-4 text-gray-300">
                    {item.answer}
                  </div>
                </details>
              ))}
            </div>
          </div>

          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <MessageCircle className="w-6 h-6 text-cyan-500" />
              <h2 className="text-2xl font-semibold text-white">Contactez-nous</h2>
            </div>

            {success && (
              <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>Votre message a été envoyé avec succès! Notre équipe vous répondra dans les 24-48h.</span>
              </div>
            )}

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 flex items-start gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {!user && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg text-blue-400 text-sm">
                  <p>
                    Vous n'êtes pas connecté. Vous pouvez toujours envoyer un message, mais connectez-vous pour un meilleur suivi.
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Catégorie
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="account">Problème de compte</option>
                  <option value="content">Contenu et modération</option>
                  <option value="monetization">Monétisation</option>
                  <option value="technical">Problème technique</option>
                  <option value="report">Signaler un abus</option>
                  <option value="other">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sujet
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
                  placeholder="Résumez votre demande en quelques mots"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  rows={8}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50 resize-none"
                  placeholder="Décrivez votre problème ou votre question en détail..."
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  disabled={loading}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Envoyer le message
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-gray-800">
              <div className="flex items-start gap-4">
                <Mail className="w-5 h-5 text-cyan-500 mt-1" />
                <div>
                  <h3 className="text-white font-medium mb-1">Email de support</h3>
                  <p className="text-gray-400 text-sm">
                    Pour les demandes urgentes: <span className="text-cyan-400">support@trutube.com</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
