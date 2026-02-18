import React from 'react';
import { ArrowLeft, Building2, Scale, Shield, FileText } from 'lucide-react';

interface LegalPageProps {
  onNavigate: (page: string) => void;
}

export function LegalPage({ onNavigate }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#0B0B0D] text-white">
      <header className="bg-[#1A1A1A] border-b border-gray-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-2xl font-bold">Mentions légales</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Informations sur l'éditeur</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800">
              <div className="space-y-3 text-gray-300">
                <p><strong className="text-white">Raison sociale :</strong> TruTube SAS</p>
                <p><strong className="text-white">Forme juridique :</strong> Société par Actions Simplifiée</p>
                <p><strong className="text-white">Capital social :</strong> 100 000 €</p>
                <p><strong className="text-white">Siège social :</strong> 123 Avenue des Champs-Élysées, 75008 Paris, France</p>
                <p><strong className="text-white">RCS :</strong> Paris B 123 456 789</p>
                <p><strong className="text-white">SIRET :</strong> 123 456 789 00012</p>
                <p><strong className="text-white">TVA intracommunautaire :</strong> FR12 123456789</p>
                <p><strong className="text-white">Directeur de la publication :</strong> Jean Dupont</p>
                <p><strong className="text-white">Email :</strong> legal@trutube.com</p>
                <p><strong className="text-white">Téléphone :</strong> +33 1 23 45 67 89</p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Hébergement</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800">
              <div className="space-y-3 text-gray-300">
                <p><strong className="text-white">Hébergeur :</strong> Supabase Inc.</p>
                <p><strong className="text-white">Adresse :</strong> 970 Toa Payoh North, #07-04, Singapore 318992</p>
                <p><strong className="text-white">Site web :</strong> <a href="https://supabase.com" className="text-[#D8A0B6] hover:underline">supabase.com</a></p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Propriété intellectuelle</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 space-y-4 text-gray-300">
              <p>
                L'ensemble du contenu présent sur le site TruTube (textes, images, vidéos, logos, icônes, sons, logiciels) est la propriété exclusive de TruTube SAS ou de ses partenaires et est protégé par les lois françaises et internationales relatives à la propriété intellectuelle.
              </p>
              <p>
                Toute reproduction, représentation, modification, publication, transmission, dénaturation, totale ou partielle du site ou de son contenu, par quelque procédé que ce soit, et sur quelque support que ce soit est interdite sans l'autorisation écrite préalable de TruTube SAS.
              </p>
              <p>
                Les marques et logos TruTube sont des marques déposées. Toute reproduction totale ou partielle de ces marques ou de ces logos sans l'autorisation préalable et écrite de TruTube SAS est prohibée.
              </p>
              <p>
                Les utilisateurs conservent l'intégralité de leurs droits de propriété intellectuelle sur le contenu qu'ils publient sur TruTube. En publiant du contenu, ils accordent à TruTube une licence mondiale, non exclusive, libre de redevances pour héberger, afficher et distribuer ce contenu.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Données personnelles</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 space-y-4 text-gray-300">
              <p>
                Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
              </p>
              <p>
                Pour exercer ces droits, vous pouvez nous contacter à l'adresse : privacy@trutube.com ou par courrier à l'adresse du siège social.
              </p>
              <p>
                Les données collectées sont destinées à l'usage exclusif de TruTube et ne seront en aucun cas cédées ou vendues à des tiers. Pour plus d'informations, consultez notre <button onClick={() => onNavigate('privacy')} className="text-[#D8A0B6] hover:underline">Politique de confidentialité</button>.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Conditions d'utilisation</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 space-y-4 text-gray-300">
              <p>
                L'utilisation du site TruTube implique l'acceptation pleine et entière des conditions générales d'utilisation décrites dans nos <button onClick={() => onNavigate('terms')} className="text-[#D8A0B6] hover:underline">Conditions d'utilisation</button>.
              </p>
              <p>
                TruTube se réserve le droit de modifier à tout moment ces mentions légales. Les utilisateurs sont donc invités à les consulter régulièrement.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Limitation de responsabilité</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 space-y-4 text-gray-300">
              <p>
                TruTube s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Toutefois, TruTube ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition sur ce site.
              </p>
              <p>
                TruTube ne pourra être tenue responsable des dommages directs et indirects causés au matériel de l'utilisateur, lors de l'accès au site TruTube, et résultant soit de l'utilisation d'un matériel ne répondant pas aux spécifications indiquées, soit de l'apparition d'un bug ou d'une incompatibilité.
              </p>
              <p>
                TruTube ne pourra également être tenue responsable des dommages indirects consécutifs à l'utilisation du site. Des espaces interactifs (possibilité de poser des questions, commentaires) sont à la disposition des utilisateurs. TruTube se réserve le droit de supprimer, sans mise en demeure préalable, tout contenu déposé dans cet espace qui contreviendrait à la législation applicable en France.
              </p>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Cookies</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 space-y-4 text-gray-300">
              <p>
                Le site TruTube utilise des cookies pour améliorer l'expérience utilisateur et réaliser des statistiques de visites. Les cookies sont de petits fichiers texte stockés sur votre appareil lors de la visite d'un site web.
              </p>
              <p>
                Vous pouvez désactiver les cookies dans les paramètres de votre navigateur. Cependant, certaines fonctionnalités du site pourraient ne pas fonctionner correctement.
              </p>
              <p>
                Types de cookies utilisés :
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Cookies strictement nécessaires au fonctionnement du site</li>
                <li>Cookies de performance et d'analyse</li>
                <li>Cookies de préférences utilisateur</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Scale className="text-[#D8A0B6]" size={32} />
              <h2 className="text-3xl font-bold">Droit applicable et juridiction</h2>
            </div>
            <div className="bg-[#1A1A1A] rounded-xl p-6 border border-gray-800 space-y-4 text-gray-300">
              <p>
                Les présentes mentions légales sont régies par le droit français. En cas de litige et à défaut d'accord amiable, le litige sera porté devant les tribunaux français conformément aux règles de compétence en vigueur.
              </p>
            </div>
          </section>

          <div className="bg-gradient-to-r from-[#D8A0B6]/20 to-purple-500/20 rounded-xl p-6 border border-[#D8A0B6]/30">
            <p className="text-center text-gray-300">
              Dernière mise à jour : 14 février 2026
            </p>
            <p className="text-center text-gray-400 mt-2 text-sm">
              Pour toute question concernant ces mentions légales, contactez-nous à <a href="mailto:legal@trutube.com" className="text-[#D8A0B6] hover:underline">legal@trutube.com</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
