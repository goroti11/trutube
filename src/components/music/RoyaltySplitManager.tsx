import { useState } from 'react';
import { Plus, Trash2, AlertCircle, Check, Users, Percent } from 'lucide-react';
import { RoyaltySplit, RoyaltyRole } from '../../services/musicSalesService';

const ROLE_LABELS: Record<RoyaltyRole, string> = {
  main_artist: 'Artiste principal',
  featured_artist: 'Featuring',
  producer: 'Producteur',
  author: 'Auteur / Parolier',
  composer: 'Compositeur',
  label: 'Label',
  other: 'Autre',
};

interface SplitEntry {
  recipient_name: string;
  recipient_email: string;
  role: RoyaltyRole;
  percentage: number;
}

interface RoyaltySplitManagerProps {
  splits: SplitEntry[];
  onChange: (splits: SplitEntry[]) => void;
}

export default function RoyaltySplitManager({ splits, onChange }: RoyaltySplitManagerProps) {
  const [error, setError] = useState('');

  const totalPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
  const isValid = Math.abs(totalPercentage - 100) < 0.01;

  function addSplit() {
    onChange([
      ...splits,
      { recipient_name: '', recipient_email: '', role: 'featured_artist', percentage: 0 },
    ]);
  }

  function removeSplit(index: number) {
    onChange(splits.filter((_, i) => i !== index));
  }

  function updateSplit(index: number, field: keyof SplitEntry, value: string | number) {
    const updated = splits.map((s, i) => i === index ? { ...s, [field]: value } : s);
    onChange(updated);
    if (field === 'percentage') {
      const total = updated.reduce((sum, s) => sum + Number(s.percentage), 0);
      if (total > 100) {
        setError('Le total des pourcentages dépasse 100%');
      } else {
        setError('');
      }
    }
  }

  function distributeEvenly() {
    if (splits.length === 0) return;
    const each = Math.floor((100 / splits.length) * 100) / 100;
    const updated = splits.map((s, i) => ({
      ...s,
      percentage: i === splits.length - 1 ? 100 - each * (splits.length - 1) : each,
    }));
    onChange(updated);
    setError('');
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Répartition des royalties</span>
        </div>
        <div className="flex items-center gap-2">
          {splits.length > 1 && (
            <button
              type="button"
              onClick={distributeEvenly}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              Répartir équitablement
            </button>
          )}
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${isValid ? 'text-emerald-400' : totalPercentage > 100 ? 'text-rose-400' : 'text-amber-400'}`}>
            <Percent className="w-3.5 h-3.5" />
            {totalPercentage.toFixed(1)}% / 100%
          </div>
        </div>
      </div>

      <div className="bg-gray-900 rounded-xl overflow-hidden">
        <div className="p-3 border-b border-gray-800 grid grid-cols-12 gap-2 text-xs text-gray-500 font-medium uppercase tracking-wider">
          <div className="col-span-3">Nom</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-3">Rôle</div>
          <div className="col-span-2 text-center">%</div>
          <div className="col-span-1" />
        </div>

        {splits.length === 0 ? (
          <div className="p-6 text-center text-sm text-gray-500">
            Ajoutez des co-artistes, producteurs ou auteurs pour répartir les revenus automatiquement.
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {splits.map((split, index) => (
              <div key={index} className="p-3 grid grid-cols-12 gap-2 items-center">
                <div className="col-span-3">
                  <input
                    type="text"
                    value={split.recipient_name}
                    onChange={e => updateSplit(index, 'recipient_name', e.target.value)}
                    placeholder="Nom"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="col-span-3">
                  <input
                    type="email"
                    value={split.recipient_email}
                    onChange={e => updateSplit(index, 'recipient_email', e.target.value)}
                    placeholder="Email"
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-red-500"
                  />
                </div>
                <div className="col-span-3">
                  <select
                    value={split.role}
                    onChange={e => updateSplit(index, 'role', e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm focus:outline-none focus:border-red-500"
                  >
                    {(Object.keys(ROLE_LABELS) as RoyaltyRole[]).map(r => (
                      <option key={r} value={r}>{ROLE_LABELS[r]}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={split.percentage}
                      onChange={e => updateSplit(index, 'percentage', Number(e.target.value))}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-2.5 py-1.5 text-sm text-center focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>
                <div className="col-span-1 flex justify-center">
                  <button
                    type="button"
                    onClick={() => removeSplit(index)}
                    className="w-7 h-7 rounded-full hover:bg-rose-950/40 text-gray-600 hover:text-rose-400 transition-colors flex items-center justify-center"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={addSplit}
        className="w-full flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white border border-dashed border-gray-700 hover:border-gray-600 py-2.5 rounded-xl transition-colors"
      >
        <Plus className="w-4 h-4" />
        Ajouter un collaborateur
      </button>

      {error && (
        <div className="flex items-center gap-2 text-rose-400 text-sm bg-rose-950/30 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {splits.length > 0 && isValid && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-950/30 p-3 rounded-lg">
          <Check className="w-4 h-4" />
          La répartition est valide. Les paiements seront automatiquement distribués.
        </div>
      )}

      {splits.length > 0 && !isValid && !error && (
        <div className="flex items-center gap-2 text-amber-400 text-sm bg-amber-950/30 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          Le total doit être égal à 100% (actuellement {totalPercentage.toFixed(1)}%)
        </div>
      )}

      <div className="bg-gray-900/60 rounded-xl p-4 text-xs text-gray-500 space-y-1">
        <p className="font-medium text-gray-400">Comment ça marche ?</p>
        <p>La plateforme prélève 15% sur chaque vente. Le reste (85%) est réparti selon les pourcentages définis ici.</p>
        <p className="font-medium text-gray-400 mt-2">Exemple avec 10€ de vente :</p>
        {splits.slice(0, 3).map((s, i) => (
          <p key={i}>{s.recipient_name || 'Collaborateur'} ({s.role ? ROLE_LABELS[s.role as RoyaltyRole] : ''}) : {((10 * 0.85 * s.percentage) / 100).toFixed(2)}€</p>
        ))}
        <p>GOROTI (15%) : 1,50€</p>
      </div>
    </div>
  );
}
