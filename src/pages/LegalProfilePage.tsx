import { useEffect, useState } from 'react';
import {
  Shield, User, MapPin, CreditCard, FileText, CheckCircle,
  AlertCircle, Clock, Lock, ChevronRight, Save, Eye, EyeOff,
  Building, Globe, Phone, Mail, ArrowLeft
} from 'lucide-react';
import { channelService, LegalProfile, KycStatus } from '../services/channelService';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import { Footer } from '../components/Footer';

interface Props {
  onNavigate: (page: string) => void;
}

type Section = 'identity' | 'address' | 'fiscal' | 'payout' | 'kyc';

const KYC_STEPS: { status: KycStatus; label: string; desc: string }[] = [
  { status: 'not_submitted', label: 'Étape 1 — Informations légales', desc: 'Remplissez vos données personnelles ou d\'entreprise' },
  { status: 'pending', label: 'Étape 2 — Vérification en cours', desc: 'Notre équipe examine vos documents sous 24-48h' },
  { status: 'verified', label: 'Étape 3 — Compte vérifié', desc: 'Vous pouvez recevoir des paiements sans limite' },
];

export default function LegalProfilePage({ onNavigate }: Props) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<LegalProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('identity');
  const [showIban, setShowIban] = useState(false);

  const [form, setForm] = useState({
    legal_entity_type: 'individual' as LegalProfile['legal_entity_type'],
    legal_name: '',
    business_name: '',
    phone: '',
    address_street: '',
    address_city: '',
    address_postal_code: '',
    address_state: '',
    address_country: '',
    tax_country: '',
    tax_id: '',
    bank_account_holder: '',
    iban_last4: '',
    tos_accepted: false,
  });

  useEffect(() => {
    if (!user) {
      onNavigate('auth');
      return;
    }
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await channelService.getLegalProfile(user.id);
      if (data) {
        setProfile(data);
        setForm({
          legal_entity_type: data.legal_entity_type || 'individual',
          legal_name: data.legal_name || '',
          business_name: data.business_name || '',
          phone: data.phone || '',
          address_street: data.address_street || '',
          address_city: data.address_city || '',
          address_postal_code: data.address_postal_code || '',
          address_state: data.address_state || '',
          address_country: data.address_country || '',
          tax_country: data.tax_country || '',
          tax_id: data.tax_id || '',
          bank_account_holder: data.bank_account_holder || '',
          iban_last4: data.iban_last4 || '',
          tos_accepted: data.tos_accepted || false,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    try {
      const updated = await channelService.upsertLegalProfile(user.id, form);
      if (updated) {
        setProfile(updated);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  const kyc: KycStatus = profile?.kyc_status ?? 'not_submitted';

  const kycBanner = {
    not_submitted: { bg: 'bg-gray-800 border-gray-700', icon: <AlertCircle className="w-5 h-5 text-gray-400" />, text: 'Complétez votre profil légal pour activer les paiements', sub: 'Requis avant tout retrait de revenus', color: 'text-gray-300' },
    pending: { bg: 'bg-amber-900/20 border-amber-800', icon: <Clock className="w-5 h-5 text-amber-400" />, text: 'Vérification KYC en cours', sub: 'Délai habituel : 24 à 48h ouvrées', color: 'text-amber-300' },
    verified: { bg: 'bg-green-900/20 border-green-800', icon: <CheckCircle className="w-5 h-5 text-green-400" />, text: 'Profil légal vérifié', sub: 'Vous pouvez recevoir et retirer vos revenus', color: 'text-green-300' },
    rejected: { bg: 'bg-red-900/20 border-red-800', icon: <AlertCircle className="w-5 h-5 text-red-400" />, text: 'Vérification refusée', sub: 'Contactez le support pour plus d\'informations', color: 'text-red-300' },
  }[kyc];

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'identity', label: 'Identité', icon: <User className="w-4 h-4" /> },
    { id: 'address', label: 'Adresse', icon: <MapPin className="w-4 h-4" /> },
    { id: 'fiscal', label: 'Fiscalité', icon: <Globe className="w-4 h-4" /> },
    { id: 'payout', label: 'Paiement', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'kyc', label: 'Vérification', icon: <Shield className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Header />
        <div className="flex justify-center items-center py-32 mt-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-8 mt-16">

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => onNavigate('settings')} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-400" /> Profil Légal
            </h1>
            <p className="text-sm text-gray-400">Information strictement privée — jamais visible publiquement</p>
          </div>
        </div>

        <div className={`flex items-start gap-3 p-4 rounded-xl border mb-6 ${kycBanner.bg}`}>
          {kycBanner.icon}
          <div>
            <p className={`font-medium text-sm ${kycBanner.color}`}>{kycBanner.text}</p>
            <p className="text-xs text-gray-500 mt-0.5">{kycBanner.sub}</p>
          </div>
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
          {sections.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                activeSection === s.id
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-900 text-gray-400 hover:text-gray-200 border border-gray-800'
              }`}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6">

          {activeSection === 'identity' && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" /> Identité juridique
              </h2>

              <div>
                <label className="block text-xs text-gray-400 mb-2">Type d'entité</label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {[
                    { value: 'individual', label: 'Particulier' },
                    { value: 'auto_entrepreneur', label: 'Auto-entrepreneur' },
                    { value: 'company', label: 'Société' },
                    { value: 'association', label: 'Association' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setForm(f => ({ ...f, legal_entity_type: opt.value as LegalProfile['legal_entity_type'] }))}
                      className={`py-2.5 px-3 rounded-xl text-sm border transition-all ${
                        form.legal_entity_type === opt.value
                          ? 'bg-red-600/20 border-red-500 text-red-300'
                          : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Nom légal complet *</label>
                  <input
                    value={form.legal_name}
                    onChange={e => setForm(f => ({ ...f, legal_name: e.target.value }))}
                    placeholder="Prénom Nom / Raison sociale"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                {(form.legal_entity_type === 'company' || form.legal_entity_type === 'association') && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-2">Nom commercial</label>
                    <input
                      value={form.business_name}
                      onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
                      placeholder="Nom de la structure"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 w-4 h-4 text-gray-500" />
                    <input
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+33 6 00 00 00 00"
                      className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-xl p-4 flex items-start gap-3">
                <Lock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400">Ces informations sont confidentielles et utilisées uniquement pour la vérification d'identité et la gestion des paiements. Elles ne sont jamais affichées sur votre profil public.</p>
              </div>
            </div>
          )}

          {activeSection === 'address' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" /> Adresse complète
              </h2>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Rue</label>
                <input
                  value={form.address_street}
                  onChange={e => setForm(f => ({ ...f, address_street: e.target.value }))}
                  placeholder="Numéro et nom de rue"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Code postal</label>
                  <input
                    value={form.address_postal_code}
                    onChange={e => setForm(f => ({ ...f, address_postal_code: e.target.value }))}
                    placeholder="75001"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Ville</label>
                  <input
                    value={form.address_city}
                    onChange={e => setForm(f => ({ ...f, address_city: e.target.value }))}
                    placeholder="Paris"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Région / État</label>
                  <input
                    value={form.address_state}
                    onChange={e => setForm(f => ({ ...f, address_state: e.target.value }))}
                    placeholder="Île-de-France"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Pays *</label>
                  <input
                    value={form.address_country}
                    onChange={e => setForm(f => ({ ...f, address_country: e.target.value }))}
                    placeholder="France"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'fiscal' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-400" /> Informations fiscales
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Pays fiscal *</label>
                  <input
                    value={form.tax_country}
                    onChange={e => setForm(f => ({ ...f, tax_country: e.target.value }))}
                    placeholder="France"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2">Numéro fiscal / SIRET</label>
                  <input
                    value={form.tax_id}
                    onChange={e => setForm(f => ({ ...f, tax_id: e.target.value }))}
                    placeholder="N° SIRET ou identifiant fiscal"
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-xs text-gray-400">
                  Requis pour les artistes dépassant les seuils légaux de revenus. Ces informations permettent à TruTube de générer les attestations fiscales annuelles.
                </p>
              </div>
            </div>
          )}

          {activeSection === 'payout' && (
            <div className="space-y-4">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-gray-400" /> Coordonnées bancaires
              </h2>
              <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-4 flex items-start gap-3 mb-4">
                <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">Vos coordonnées bancaires sont chiffrées et stockées de façon sécurisée. Seuls les 4 derniers chiffres de l'IBAN sont affichés pour confirmation.</p>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">Titulaire du compte</label>
                <input
                  value={form.bank_account_holder}
                  onChange={e => setForm(f => ({ ...f, bank_account_holder: e.target.value }))}
                  placeholder="Nom du titulaire (identique au profil légal)"
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2">4 derniers chiffres IBAN</label>
                <div className="relative">
                  <input
                    type={showIban ? 'text' : 'password'}
                    value={form.iban_last4}
                    onChange={e => setForm(f => ({ ...f, iban_last4: e.target.value.slice(0, 4) }))}
                    placeholder="ex: 1234"
                    maxLength={4}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowIban(v => !v)}
                    className="absolute right-3 top-3 text-gray-500 hover:text-gray-300"
                  >
                    {showIban ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">L'IBAN complet est saisi lors du processus KYC sécurisé.</p>
              </div>

              <div className="bg-gray-800 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-2">Statut paiement :</p>
                <div className="flex items-center gap-2">
                  {profile?.payment_method_verified ? (
                    <><CheckCircle className="w-4 h-4 text-green-400" /><span className="text-sm text-green-400 font-medium">Compte bancaire vérifié</span></>
                  ) : (
                    <><AlertCircle className="w-4 h-4 text-gray-500" /><span className="text-sm text-gray-400">En attente de vérification</span></>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'kyc' && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" /> Vérification d'identité (KYC)
              </h2>

              <div className="relative">
                {KYC_STEPS.map((step, i) => {
                  const isActive = step.status === kyc;
                  const isPast = KYC_STEPS.findIndex(s => s.status === kyc) > i;
                  return (
                    <div key={step.status} className="flex items-start gap-4 pb-6 last:pb-0">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                          isPast ? 'bg-green-600 text-white' :
                          isActive ? 'bg-red-600 text-white' :
                          'bg-gray-800 text-gray-500 border border-gray-700'
                        }`}>
                          {isPast ? <CheckCircle className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < KYC_STEPS.length - 1 && (
                          <div className={`w-px h-8 mt-1 ${isPast ? 'bg-green-600' : 'bg-gray-700'}`} />
                        )}
                      </div>
                      <div className="pt-1">
                        <p className={`text-sm font-medium ${isActive ? 'text-white' : isPast ? 'text-green-400' : 'text-gray-500'}`}>{step.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {kyc === 'not_submitted' && (
                <div className="border border-gray-700 rounded-xl p-5 space-y-4">
                  <p className="text-sm text-gray-300">Documents requis :</p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {['Pièce d\'identité recto-verso (CNI, passeport)', 'Selfie avec la pièce d\'identité', 'Justificatif de domicile (moins de 3 mois)', 'RIB / IBAN'].map(doc => (
                      <li key={doc} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3 text-gray-600 flex-shrink-0" />
                        {doc}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-start gap-3 pt-2">
                    <input
                      type="checkbox"
                      id="tos"
                      checked={form.tos_accepted}
                      onChange={e => setForm(f => ({ ...f, tos_accepted: e.target.checked }))}
                      className="mt-1 accent-red-500"
                    />
                    <label htmlFor="tos" className="text-xs text-gray-400 cursor-pointer">
                      J'accepte les <span className="text-red-400 underline">Conditions Générales d'Utilisation</span> et confirme que les informations fournies sont exactes et me concernent personnellement.
                    </label>
                  </div>
                  <button
                    disabled={!form.tos_accepted || !form.legal_name}
                    className="w-full bg-red-600 hover:bg-red-500 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
                  >
                    Démarrer la vérification KYC
                  </button>
                </div>
              )}

              {kyc === 'pending' && (
                <div className="bg-amber-900/20 border border-amber-800 rounded-xl p-5 text-center">
                  <Clock className="w-10 h-10 text-amber-400 mx-auto mb-3" />
                  <p className="text-amber-300 font-medium text-sm">Vérification en cours</p>
                  <p className="text-gray-400 text-xs mt-1">Soumis le {profile?.kyc_submitted_at ? new Date(profile.kyc_submitted_at).toLocaleDateString('fr-FR') : '—'}</p>
                  <p className="text-gray-500 text-xs mt-3">Vous recevrez une notification par email une fois la vérification terminée.</p>
                </div>
              )}

              {kyc === 'verified' && (
                <div className="bg-green-900/20 border border-green-800 rounded-xl p-5 text-center">
                  <CheckCircle className="w-10 h-10 text-green-400 mx-auto mb-3" />
                  <p className="text-green-300 font-medium text-sm">Identité vérifiée</p>
                  <p className="text-gray-400 text-xs mt-1">Vérifié le {profile?.kyc_approved_at ? new Date(profile.kyc_approved_at).toLocaleDateString('fr-FR') : '—'}</p>
                  <p className="text-gray-500 text-xs mt-3">Vous pouvez recevoir et retirer vos revenus sans limitation.</p>
                </div>
              )}
            </div>
          )}

        </div>

        {activeSection !== 'kyc' && (
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 flex items-center gap-1.5">
              <Lock className="w-3 h-3" /> Données chiffrées — jamais visibles publiquement
            </p>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors"
            >
              {saved ? <><CheckCircle className="w-4 h-4" /> Sauvegardé</> : saving ? 'Sauvegarde...' : <><Save className="w-4 h-4" /> Sauvegarder</>}
            </button>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
