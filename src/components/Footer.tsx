import { Play, Facebook, Twitter, Instagram, Youtube, Mail } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer = ({ onNavigate }: FooterProps) => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 p-2 rounded-lg">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="text-xl font-bold text-white">TruTube</span>
            </div>
            <p className="text-gray-400 text-sm mb-4">
              La plateforme de partage vidéo qui valorise l'authenticité et récompense les vrais créateurs.
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Facebook className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Twitter className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Instagram className="w-5 h-5 text-gray-400" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Youtube className="w-5 h-5 text-gray-400" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Plateforme</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Accueil
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('universes')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Explorer les univers
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('creator-setup')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Devenir créateur
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('preferences')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Préférences de feed
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  À propos
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('help')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Centre d'aide
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('support')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('terms')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Conditions d'utilisation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('privacy')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Politique de confidentialité
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('legal')}
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors"
                >
                  Mentions légales
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="mailto:support@trutube.com"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  support@trutube.com
                </a>
              </li>
              <li>
                <a
                  href="mailto:creators@trutube.com"
                  className="text-gray-400 hover:text-cyan-400 text-sm transition-colors flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  creators@trutube.com
                </a>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-white font-semibold mb-2 text-sm">Newsletter</h4>
              <p className="text-gray-400 text-xs mb-2">
                Restez informé des nouveautés
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Votre email"
                  className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-sm transition-colors">
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} TruTube. Tous droits réservés.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <button
                onClick={() => onNavigate('terms')}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                CGU
              </button>
              <button
                onClick={() => onNavigate('privacy')}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Confidentialité
              </button>
              <button
                onClick={() => onNavigate('legal')}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Mentions légales
              </button>
              <button
                onClick={() => onNavigate('help')}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Aide
              </button>
              <button
                onClick={() => onNavigate('support')}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
