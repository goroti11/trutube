import { Link } from 'react-router-dom';
import { Play, Twitter, Youtube, Twitch } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" fill="white" />
              </div>
              <span className="text-xl font-bold text-gradient text-gradient-primary">
                GOROTI
              </span>
            </div>
            <p className="text-neutral-400 text-sm">
              La plateforme nouvelle génération pour le streaming, le gaming et la musique.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Plateforme</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/legende" className="text-neutral-400 hover:text-white transition-colors">
                  LÉGENDE
                </Link>
              </li>
              <li>
                <Link to="/gaming" className="text-neutral-400 hover:text-white transition-colors">
                  Gaming
                </Link>
              </li>
              <li>
                <Link to="/live" className="text-neutral-400 hover:text-white transition-colors">
                  Live Streaming
                </Link>
              </li>
              <li>
                <Link to="/music" className="text-neutral-400 hover:text-white transition-colors">
                  Music
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Communauté</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-neutral-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/help" className="text-neutral-400 hover:text-white transition-colors">
                  Aide
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-neutral-400 hover:text-white transition-colors">
                  Carrières
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-neutral-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-4">Suivez-nous</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-5 h-5 text-cyan-400" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              >
                <Youtube className="w-5 h-5 text-red-500" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors"
              >
                <Twitch className="w-5 h-5" style={{ color: '#9146FF' }} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 text-sm">
            © 2024 GOROTI. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-neutral-500">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Confidentialité
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Conditions
            </Link>
            <Link to="/cookies" className="hover:text-white transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
