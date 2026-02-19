import { Book, Video, FileText, Users, TrendingUp, Shield } from 'lucide-react';

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Ressources</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ResourceCard
            icon={<Book className="w-8 h-8" />}
            title="Guide du créateur"
            description="Apprenez à créer du contenu de qualité"
          />
          <ResourceCard
            icon={<Video className="w-8 h-8" />}
            title="Tutoriels vidéo"
            description="Découvrez toutes les fonctionnalités"
          />
          <ResourceCard
            icon={<FileText className="w-8 h-8" />}
            title="Documentation"
            description="Documentation complète de la plateforme"
          />
          <ResourceCard
            icon={<Users className="w-8 h-8" />}
            title="Communauté"
            description="Rejoignez la communauté GOROTI"
          />
          <ResourceCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Monétisation"
            description="Gagnez de l'argent avec votre contenu"
          />
          <ResourceCard
            icon={<Shield className="w-8 h-8" />}
            title="Sécurité"
            description="Protégez votre compte et vos données"
          />
        </div>
      </div>
    </div>
  );
}

function ResourceCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 hover:bg-gray-800 transition-colors cursor-pointer">
      <div className="text-red-500 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}
