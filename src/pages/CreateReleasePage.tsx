import { useState } from 'react';
import {
  Music, ChevronRight, ChevronLeft, Check, AlertCircle, Lock, Calendar,
  Tag, Globe, Users, Award, Zap, Package, Clock, Info, Eye, EyeOff
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { musicSalesService, CreateReleaseInput, ReleaseType, SaleType } from '../services/musicSalesService';
import RoyaltySplitManager from '../components/music/RoyaltySplitManager';

interface CreateReleasePageProps {
  onNavigate?: (page: string) => void;
}

interface SplitEntry {
  recipient_name: string;
  recipient_email: string;
  role: 'main_artist' | 'featured_artist' | 'producer' | 'author' | 'composer' | 'label' | 'other';
  percentage: number;
}

const STEPS = [
  { id: 1, label: 'Infos Release', icon: Music },
  { id: 2, label: 'Droits & Légal', icon: Lock },
  { id: 3, label: 'Prix & Vente', icon: Tag },
  { id: 4, label: 'Phases', icon: Calendar },
  { id: 5, label: 'Royalties', icon: Users },
  { id: 6, label: 'Publication', icon: Zap },
];

export default function CreateReleasePage({ onNavigate }: CreateReleasePageProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [form, setForm] = useState<CreateReleaseInput & { distribution_level: 'independent' | 'label' }>({
    title: '',
    artist_name: '',
    label_name: '',
    isrc: '',
    release_type: 'single',
    genre: '',
    cover_art_url: '',
    description: '',
    rights_owned: false,
    territories_allowed: ['worldwide'],
    credits: [],
    price_standard: 4.99,
    price_promo: undefined,
    promo_ends_at: undefined,
    currency: 'EUR',
    sale_type: 'lifetime',
    access_duration_days: undefined,
    is_bundle: false,
    bundle_items: [],
    exclusive_starts_at: undefined,
    exclusive_ends_at: undefined,
    public_release_at: undefined,
    preorder_enabled: false,
    preorder_price: undefined,
    preorder_starts_at: undefined,
    preorder_ends_at: undefined,
    is_limited_edition: false,
    limited_edition_total: undefined,
    video_id: undefined,
    preview_url: '',
    distribution_level: 'independent',
  });

  const [splits, setSplits] = useState<SplitEntry[]>([]);
  const [addPromo, setAddPromo] = useState(false);

  function update<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm(f => ({ ...f, [key]: value }));
    setErrors(e => ({ ...e, [key]: '' }));
  }

  function validateStep(s: number): boolean {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (!form.title.trim()) newErrors.title = 'Le titre est requis';
      if (!form.artist_name.trim()) newErrors.artist_name = 'Le nom d\'artiste est requis';
    }
    if (s === 2) {
      if (!form.rights_owned) newErrors.rights_owned = 'Vous devez confirmer détenir les droits';
    }
    if (s === 3) {
      if (form.price_standard <= 0) newErrors.price_standard = 'Le prix doit être supérieur à 0';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function nextStep() {
    if (validateStep(step)) setStep(s => Math.min(s + 1, STEPS.length));
  }

  function prevStep() {
    setStep(s => Math.max(s - 1, 1));
  }

  async function handleSubmit() {
    if (!user) return;
    setSubmitting(true);

    const releaseData = { ...form };
    if (!addPromo) {
      releaseData.price_promo = undefined;
      releaseData.promo_ends_at = undefined;
    }

    const release = await musicSalesService.createRelease(user.id, releaseData);

    if (release && splits.length > 0) {
      const totalSplits = splits.reduce((sum, s) => sum + s.percentage, 0);
      if (Math.abs(totalSplits - 100) < 0.01) {
        await musicSalesService.setRoyaltySplits(release.id, splits);
      }
    }

    setSubmitting(false);
    if (release) {
      setSuccess(true);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
          <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Release créée !</h2>
          <p className="text-gray-400 mb-2">
            "{form.title}" a été enregistrée en brouillon.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Vous pouvez maintenant la prévisualiser et la publier depuis votre Studio.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate?.('studio')}
              className="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-colors"
            >
              Aller au Studio
            </button>
            <button
              onClick={() => { setSuccess(false); setStep(1); setForm(f => ({ ...f, title: '', artist_name: '' })); }}
              className="w-full bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium py-3 rounded-xl transition-colors text-sm"
            >
              Créer une autre release
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="border-b border-gray-800 bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 bg-red-950/40 rounded-lg flex items-center justify-center">
              <Music className="w-4 h-4 text-red-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold">Nouvelle Release Premium</h1>
              <p className="text-xs text-gray-400">Single, Album, EP ou Bundle</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone = step > s.id;
              return (
                <div key={s.id} className="flex items-center flex-1">
                  <button
                    onClick={() => isDone && setStep(s.id)}
                    className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-all w-full justify-center ${
                      isActive ? 'bg-red-950/50 text-red-300 border border-red-800/60' :
                      isDone ? 'text-emerald-400 cursor-pointer hover:bg-gray-800' :
                      'text-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isDone ? 'bg-emerald-500/20' : isActive ? 'bg-red-500/20' : 'bg-gray-800'
                    }`}>
                      {isDone ? <Check className="w-3 h-3" /> : <Icon className="w-3 h-3" />}
                    </div>
                    <span className="hidden md:block">{s.label}</span>
                  </button>
                  {i < STEPS.length - 1 && <div className={`w-px h-4 mx-1 ${isDone ? 'bg-emerald-700' : 'bg-gray-800'}`} />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {step === 1 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Informations de la release</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Titre officiel *" error={errors.title}>
                <input
                  value={form.title}
                  onChange={e => update('title', e.target.value)}
                  placeholder="Ex: Lumières de Minuit"
                  className={inputClass(errors.title)}
                />
              </Field>
              <Field label="Nom artiste *" error={errors.artist_name}>
                <input
                  value={form.artist_name}
                  onChange={e => update('artist_name', e.target.value)}
                  placeholder="Nom de scène"
                  className={inputClass(errors.artist_name)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <Field label="Type de release">
                <select value={form.release_type} onChange={e => update('release_type', e.target.value as ReleaseType)} className={inputClass()}>
                  <option value="single">Single</option>
                  <option value="ep">EP</option>
                  <option value="album">Album</option>
                  <option value="bundle">Bundle</option>
                </select>
              </Field>
              <Field label="Genre musical">
                <input value={form.genre} onChange={e => update('genre', e.target.value)} placeholder="Ex: R&B, Pop, Rap..." className={inputClass()} />
              </Field>
              <Field label="Label (optionnel)">
                <input value={form.label_name} onChange={e => update('label_name', e.target.value)} placeholder="Nom du label" className={inputClass()} />
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={e => update('description', e.target.value)}
                placeholder="Décrivez votre release..."
                rows={3}
                className={inputClass() + ' resize-none'}
              />
            </Field>

            <Field label="URL Cover Art">
              <input value={form.cover_art_url} onChange={e => update('cover_art_url', e.target.value)} placeholder="https://..." className={inputClass()} />
            </Field>

            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300">Niveau de distribution</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'independent', label: 'Artiste Indépendant', desc: 'Interface simplifiée, KYC basique' },
                  { id: 'label', label: 'Label / Société', desc: 'Fonctionnalités avancées, catalogue complet' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => update('distribution_level', opt.id as 'independent' | 'label')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      form.distribution_level === opt.id
                        ? 'border-red-600 bg-red-950/20'
                        : 'border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    <p className="text-sm font-medium">{opt.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Droits & Informations légales</h2>

            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4 text-sm text-amber-300">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Goroti vérifie la conformité des droits avant publication. Toute déclaration frauduleuse entraîne des pénalités.</p>
              </div>
            </div>

            <div className={`border rounded-xl p-4 transition-all ${form.rights_owned ? 'border-emerald-600 bg-emerald-950/20' : errors.rights_owned ? 'border-rose-600 bg-rose-950/20' : 'border-gray-700'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <div
                  onClick={() => update('rights_owned', !form.rights_owned)}
                  className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-colors cursor-pointer ${form.rights_owned ? 'bg-emerald-600 border-emerald-600' : 'border-gray-600'}`}
                >
                  {form.rights_owned && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="font-medium text-sm">Je confirme détenir tous les droits nécessaires sur ce contenu</p>
                  <p className="text-xs text-gray-400 mt-1">
                    En cochant cette case, je déclare sur l'honneur être titulaire ou ayant-droit de l'ensemble des droits d'auteur, droits voisins, droits de marque et tout autre droit relatif à ce contenu. Je m'engage à indemniser Goroti en cas de réclamation de tiers.
                  </p>
                </div>
              </label>
              {errors.rights_owned && <p className="text-xs text-rose-400 mt-2 ml-8">{errors.rights_owned}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="ISRC (si disponible)">
                <input
                  value={form.isrc}
                  onChange={e => update('isrc', e.target.value)}
                  placeholder="Ex: FR-ABC-24-00001"
                  className={inputClass() + ' font-mono'}
                />
              </Field>
              <Field label="Territoires autorisés">
                <select
                  value={form.territories_allowed?.[0] || 'worldwide'}
                  onChange={e => update('territories_allowed', [e.target.value])}
                  className={inputClass()}
                >
                  <option value="worldwide">Monde entier</option>
                  <option value="FR">France uniquement</option>
                  <option value="EU">Europe</option>
                  <option value="FR,BE,CH">Francophonie</option>
                </select>
              </Field>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium">Crédits</span>
                <span className="text-xs text-gray-500">Optionnel mais recommandé</span>
              </div>
              <div className="space-y-2">
                {(form.credits || []).map((c, i) => (
                  <div key={i} className="grid grid-cols-2 gap-2">
                    <input
                      value={c.name}
                      onChange={e => {
                        const credits = [...(form.credits || [])];
                        credits[i] = { ...credits[i], name: e.target.value };
                        update('credits', credits);
                      }}
                      placeholder="Nom"
                      className={inputClass() + ' text-sm py-2'}
                    />
                    <input
                      value={c.role}
                      onChange={e => {
                        const credits = [...(form.credits || [])];
                        credits[i] = { ...credits[i], role: e.target.value };
                        update('credits', credits);
                      }}
                      placeholder="Rôle"
                      className={inputClass() + ' text-sm py-2'}
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => update('credits', [...(form.credits || []), { name: '', role: '' }])}
                  className="text-xs text-red-400 hover:text-red-300 transition-colors"
                >
                  + Ajouter un crédit
                </button>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Prix & Type de vente</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { val: 'lifetime', label: 'Achat définitif', desc: 'Accès à vie', icon: <Eye className="w-4 h-4" /> },
                { val: 'limited_access', label: 'Accès limité', desc: 'Ex: 6 mois', icon: <Clock className="w-4 h-4" /> },
                { val: 'rental_48h', label: 'Location 48h', desc: 'Streaming temporaire', icon: <EyeOff className="w-4 h-4" /> },
                { val: 'rental_72h', label: 'Location 72h', desc: 'Streaming temporaire', icon: <EyeOff className="w-4 h-4" /> },
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => update('sale_type', opt.val as SaleType)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    form.sale_type === opt.val ? 'border-red-600 bg-red-950/20' : 'border-gray-700 hover:border-gray-600'
                  }`}
                >
                  <div className={`mb-1.5 ${form.sale_type === opt.val ? 'text-red-400' : 'text-gray-500'}`}>{opt.icon}</div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-gray-500">{opt.desc}</p>
                </button>
              ))}
            </div>

            {form.sale_type === 'limited_access' && (
              <Field label="Durée d'accès (jours)">
                <input
                  type="number"
                  min={1}
                  value={form.access_duration_days || ''}
                  onChange={e => update('access_duration_days', Number(e.target.value))}
                  placeholder="Ex: 180"
                  className={inputClass()}
                />
              </Field>
            )}

            <div className="grid grid-cols-2 gap-5">
              <Field label="Prix standard (€) *" error={errors.price_standard}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                  <input
                    type="number"
                    min={0.99}
                    step={0.01}
                    value={form.price_standard}
                    onChange={e => update('price_standard', Number(e.target.value))}
                    className={inputClass(errors.price_standard) + ' pl-7'}
                  />
                </div>
              </Field>
              <Field label="Devise">
                <select value={form.currency} onChange={e => update('currency', e.target.value)} className={inputClass()}>
                  <option value="EUR">EUR (€)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </Field>
            </div>

            <div className="bg-gray-900 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ajouter une promotion</span>
                <button type="button" onClick={() => setAddPromo(!addPromo)} className={`w-10 h-5 rounded-full transition-colors ${addPromo ? 'bg-red-600' : 'bg-gray-700'}`}>
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${addPromo ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {addPromo && (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <Field label="Prix promo (€)">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                      <input
                        type="number"
                        min={0}
                        step={0.01}
                        value={form.price_promo || ''}
                        onChange={e => update('price_promo', Number(e.target.value))}
                        className={inputClass() + ' pl-7'}
                      />
                    </div>
                  </Field>
                  <Field label="Fin de promo">
                    <input
                      type="datetime-local"
                      value={form.promo_ends_at ? form.promo_ends_at.slice(0, 16) : ''}
                      onChange={e => update('promo_ends_at', new Date(e.target.value).toISOString())}
                      className={inputClass()}
                    />
                  </Field>
                </div>
              )}
            </div>

            <div className="bg-gray-800 rounded-xl p-4">
              <p className="text-xs text-gray-400 font-medium mb-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Répartition des revenus
              </p>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400" style={{ width: '85%' }} />
                </div>
                <div className="text-right text-xs whitespace-nowrap">
                  <span className="text-emerald-400 font-bold">85%</span>
                  <span className="text-gray-500"> vous</span>
                  <span className="text-gray-600 mx-2">·</span>
                  <span className="text-gray-400">15%</span>
                  <span className="text-gray-500"> Goroti</span>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-1">Sur {form.price_standard}€ : vous recevez {(form.price_standard * 0.85).toFixed(2)}€</p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Phases de publication</h2>

            <div className="space-y-3">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-rose-950/40 rounded-full flex items-center justify-center">
                    <Lock className="w-4 h-4 text-rose-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phase 1 – Exclusivité payante</p>
                    <p className="text-xs text-gray-500">L'album est verrouillé, accès après paiement uniquement</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Début exclusivité">
                    <input
                      type="datetime-local"
                      value={form.exclusive_starts_at ? form.exclusive_starts_at.slice(0, 16) : ''}
                      onChange={e => update('exclusive_starts_at', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                      className={inputClass()}
                    />
                  </Field>
                  <Field label="Fin exclusivité">
                    <input
                      type="datetime-local"
                      value={form.exclusive_ends_at ? form.exclusive_ends_at.slice(0, 16) : ''}
                      onChange={e => update('exclusive_ends_at', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                      className={inputClass()}
                    />
                  </Field>
                </div>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-blue-950/40 rounded-full flex items-center justify-center">
                    <Globe className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Phase 2 – Passage en public</p>
                    <p className="text-xs text-gray-500">L'album devient gratuit, monétisation pub activée</p>
                  </div>
                </div>
                <Field label="Date de passage en public">
                  <input
                    type="datetime-local"
                    value={form.public_release_at ? form.public_release_at.slice(0, 16) : ''}
                    onChange={e => update('public_release_at', e.target.value ? new Date(e.target.value).toISOString() : undefined)}
                    className={inputClass()}
                  />
                </Field>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-950/40 rounded-full flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Précommande</p>
                    <p className="text-xs text-gray-500">Compteur visible + badge Early Supporter</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update('preorder_enabled', !form.preorder_enabled)}
                  className={`w-10 h-5 rounded-full transition-colors ${form.preorder_enabled ? 'bg-amber-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${form.preorder_enabled ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {form.preorder_enabled && (
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <Field label="Prix précommande">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">€</span>
                      <input type="number" min={0} step={0.01} value={form.preorder_price || ''} onChange={e => update('preorder_price', Number(e.target.value))} className={inputClass() + ' pl-7'} />
                    </div>
                  </Field>
                  <Field label="Début précommande">
                    <input type="datetime-local" value={form.preorder_starts_at ? form.preorder_starts_at.slice(0, 16) : ''} onChange={e => update('preorder_starts_at', e.target.value ? new Date(e.target.value).toISOString() : undefined)} className={inputClass()} />
                  </Field>
                  <Field label="Fin précommande">
                    <input type="datetime-local" value={form.preorder_ends_at ? form.preorder_ends_at.slice(0, 16) : ''} onChange={e => update('preorder_ends_at', e.target.value ? new Date(e.target.value).toISOString() : undefined)} className={inputClass()} />
                  </Field>
                </div>
              )}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-amber-950/40 rounded-full flex items-center justify-center">
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Édition Numérotée Limitée</p>
                    <p className="text-xs text-gray-500">Ex: 1000 copies #numérotées avec certificat</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => update('is_limited_edition', !form.is_limited_edition)}
                  className={`w-10 h-5 rounded-full transition-colors ${form.is_limited_edition ? 'bg-amber-600' : 'bg-gray-700'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full transition-transform mx-0.5 ${form.is_limited_edition ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
              {form.is_limited_edition && (
                <Field label="Nombre d'exemplaires">
                  <input
                    type="number"
                    min={10}
                    value={form.limited_edition_total || ''}
                    onChange={e => update('limited_edition_total', Number(e.target.value))}
                    placeholder="Ex: 1000"
                    className={inputClass()}
                  />
                </Field>
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold mb-1">Répartition des royalties</h2>
              <p className="text-sm text-gray-400">Déclarez les co-artistes, producteurs et auteurs. Les paiements seront automatiquement distribués à chaque vente.</p>
            </div>
            <RoyaltySplitManager splits={splits} onChange={setSplits} />
          </div>
        )}

        {step === 6 && (
          <div className="space-y-5">
            <h2 className="text-xl font-bold">Récapitulatif & Publication</h2>

            <div className="bg-gray-900 rounded-2xl p-5 space-y-4">
              <SummaryRow label="Titre" value={form.title || '—'} />
              <SummaryRow label="Artiste" value={form.artist_name || '—'} />
              <SummaryRow label="Type" value={form.release_type} />
              <SummaryRow label="Prix" value={`${form.price_standard}€ ${form.currency}`} />
              <SummaryRow label="Type de vente" value={{ lifetime: 'Achat définitif', limited_access: 'Accès limité', rental_48h: 'Location 48h', rental_72h: 'Location 72h' }[form.sale_type]} />
              {form.exclusive_ends_at && <SummaryRow label="Fin exclusivité" value={new Date(form.exclusive_ends_at).toLocaleDateString('fr-FR')} />}
              {form.public_release_at && <SummaryRow label="Passage public" value={new Date(form.public_release_at).toLocaleDateString('fr-FR')} />}
              <SummaryRow label="Précommande" value={form.preorder_enabled ? 'Activée' : 'Non'} />
              <SummaryRow label="Édition limitée" value={form.is_limited_edition ? `Oui – ${form.limited_edition_total} copies` : 'Non'} />
              <SummaryRow label="Royalties" value={splits.length > 0 ? `${splits.length} collaborateur(s)` : 'Non défini'} />
              <SummaryRow label="Droits" value={form.rights_owned ? 'Confirmés' : 'Non confirmés'} highlight={!form.rights_owned} />
            </div>

            <div className="bg-amber-950/30 border border-amber-700/40 rounded-xl p-4 text-sm text-amber-300">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>La release sera créée en brouillon. Vous pourrez la prévisualiser et la publier depuis votre Studio.</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-800">
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="flex items-center gap-2 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            Étape {step} / {STEPS.length}
          </div>
          {step < STEPS.length ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Continuer
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.rights_owned}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              {submitting ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Package className="w-4 h-4" />}
              Créer la release
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium text-gray-400 block mb-1.5">{label}</label>
      {children}
      {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
    </div>
  );
}

function inputClass(error?: string) {
  return `w-full bg-gray-800 border ${error ? 'border-rose-600' : 'border-gray-700'} rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors`;
}

function SummaryRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={highlight ? 'text-rose-400' : 'text-white font-medium'}>{value}</span>
    </div>
  );
}
