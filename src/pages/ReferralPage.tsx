import { useState, useEffect } from 'react';
import { Users, Copy, CheckCircle, Gift, TrendingUp, Share2, ArrowLeft, Link2, Clock, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { referralService, UserReferralCode, Referral } from '../services/referralService';

interface ReferralPageProps {
  onNavigate: (page: string) => void;
}

const PLATFORMS = [
  { id: 'whatsapp', label: 'WhatsApp', color: 'bg-green-600 hover:bg-green-700', icon: '💬' },
  { id: 'facebook', label: 'Facebook', color: 'bg-blue-700 hover:bg-blue-800', icon: '👤' },
  { id: 'twitter', label: 'X / Twitter', color: 'bg-gray-700 hover:bg-gray-600', icon: '🐦' },
  { id: 'telegram', label: 'Telegram', color: 'bg-sky-600 hover:bg-sky-700', icon: '✈️' },
];

function shareOnPlatform(platform: string, link: string, code: string) {
  const text = `Rejoins-moi sur GOROTI avec mon code de parrainage ${code} et reçois des TruCoins en bonus ! 🎉`;
  const urls: Record<string, string> = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(text)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
  };
  const url = urls[platform];
  if (url) window.open(url, '_blank', 'noopener,noreferrer');
}

export default function ReferralPage({ onNavigate }: ReferralPageProps) {
  const { user } = useAuth();
  const [refCode, setRefCode] = useState<UserReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, rewards: 0 });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<'code' | 'link' | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    Promise.all([
      referralService.getOrCreateReferralCode(user.id),
      referralService.getReferralStats(user.id),
      referralService.getReferralList(user.id)
    ]).then(([code, s, list]) => {
      setRefCode(code);
      setStats(s);
      setReferrals(list);
      setLoading(false);
    });
  }, [user]);

  const copy = async (type: 'code' | 'link') => {
    if (!refCode) return;
    const text = type === 'code' ? refCode.code : referralService.getReferralLink(refCode.code);
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2500);
  };

  const referralLink = refCode ? referralService.getReferralLink(refCode.code) : '';

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Connexion requise</h2>
          <p className="text-gray-400 mb-6">Connectez-vous pour accéder au programme de parrainage.</p>
          <button onClick={() => onNavigate('auth')} className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold transition-colors">
            Se connecter
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="sticky top-0 z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <button onClick={() => onNavigate('home')} className="w-10 h-10 hover:bg-gray-800 rounded-full flex items-center justify-center transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-600/20 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-red-400" />
            </div>
            <h1 className="font-bold text-lg">Programme de parrainage</h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="relative overflow-hidden bg-gradient-to-br from-red-900/40 via-gray-900 to-gray-900 rounded-3xl border border-red-800/30 p-8 text-center">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-red-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-red-500/8 rounded-full blur-2xl" />
          <Gift className="w-12 h-12 text-red-400 mx-auto mb-4 relative" />
          <h2 className="text-2xl font-bold mb-2 relative">Parrainez vos amis</h2>
          <p className="text-gray-300 max-w-md mx-auto mb-2 relative">
            Invitez vos amis sur GOROTI et gagnez <span className="text-yellow-400 font-bold">{referralService.REWARD_PER_REFERRAL} TruCoins</span> pour chaque parrainage réussi.
          </p>
          <p className="text-sm text-gray-500 relative">Votre ami reçoit aussi un bonus de bienvenue !</p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Parrainés', value: stats.total, icon: Users, color: 'text-red-400' },
            { label: 'Complétés', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
            { label: 'TruCoins gagnés', value: stats.rewards, icon: Star, color: 'text-yellow-400' },
          ].map((s, i) => (
            <div key={i} className="bg-gray-900 rounded-2xl border border-gray-800 p-4 text-center">
              <s.icon className={`w-6 h-6 ${s.color} mx-auto mb-2`} />
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2].map(i => <div key={i} className="h-16 bg-gray-800/50 rounded-2xl animate-pulse" />)}
          </div>
        ) : refCode && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6 space-y-4">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Link2 className="w-5 h-5 text-red-400" />
              Votre code de parrainage
            </h3>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-800 rounded-xl px-4 py-3 font-mono text-xl font-bold text-center tracking-widest text-red-400 border border-gray-700">
                {refCode.code}
              </div>
              <button
                onClick={() => copy('code')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all ${
                  copied === 'code' ? 'bg-green-600 text-white' : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                }`}
              >
                {copied === 'code' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied === 'code' ? 'Copié!' : 'Copier'}
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-gray-400 font-medium">Lien de parrainage</p>
              <div className="flex items-center gap-2 bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-700">
                <span className="flex-1 text-xs text-gray-400 truncate font-mono">{referralLink}</span>
                <button
                  onClick={() => copy('link')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shrink-0 ${
                    copied === 'link' ? 'bg-green-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
                  }`}
                >
                  {copied === 'link' ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied === 'link' ? 'Copié!' : 'Copier'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
              {PLATFORMS.map(p => (
                <button
                  key={p.id}
                  onClick={() => shareOnPlatform(p.id, referralLink, refCode.code)}
                  className={`${p.color} text-white rounded-xl py-2.5 text-sm font-semibold transition-colors flex items-center justify-center gap-2`}
                >
                  <span>{p.icon}</span>
                  <span className="hidden sm:inline">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="font-bold text-lg mb-2 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-red-400" />
            Comment ça marche ?
          </h3>
          <div className="space-y-4 mt-4">
            {[
              { step: '1', title: 'Partagez votre lien', desc: 'Envoyez votre lien de parrainage unique à vos amis.' },
              { step: '2', title: "Votre ami s'inscrit", desc: "Votre ami crée un compte GOROTI avec votre lien ou code." },
              { step: '3', title: 'Gagnez des TruCoins', desc: `Vous recevez automatiquement ${referralService.REWARD_PER_REFERRAL} TruCoins dès que votre ami s'inscrit.` },
            ].map(s => (
              <div key={s.step} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-red-600/20 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-red-400">{s.step}</span>
                </div>
                <div>
                  <p className="font-semibold text-white">{s.title}</p>
                  <p className="text-sm text-gray-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {referrals.length > 0 && (
          <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-red-400" />
              Mes parrainages ({referrals.length})
            </h3>
            <div className="space-y-3">
              {referrals.slice(0, 10).map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">Ami parrainé</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        {new Date(r.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      r.status === 'rewarded' ? 'bg-yellow-900/40 text-yellow-400' :
                      r.status === 'completed' ? 'bg-green-900/40 text-green-400' :
                      'bg-gray-800 text-gray-400'
                    }`}>
                      {r.status === 'rewarded' ? 'Récompensé' :
                       r.status === 'completed' ? 'Complété' : 'En attente'}
                    </span>
                    {r.reward_trucoin > 0 && (
                      <span className="text-sm font-bold text-yellow-400">+{r.reward_trucoin}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-red-400" />
            Utiliser un code de parrainage
          </h3>
          <ReferralCodeInput />
        </div>
      </div>
    </div>
  );
}

function ReferralCodeInput() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [msg, setMsg] = useState('');

  const submit = async () => {
    if (!user || !code.trim()) return;
    setStatus('loading');
    const ok = await referralService.useReferralCode(code.trim(), user.id);
    if (ok) {
      setStatus('success');
      setMsg(`Code appliqué ! Vous avez reçu un bonus de bienvenue.`);
    } else {
      setStatus('error');
      setMsg('Code invalide ou déjà utilisé.');
    }
  };

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-400">Vous avez été parrainé ? Entrez le code de votre parrain pour activer votre bonus.</p>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ex: GRTAB12"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase())}
          maxLength={10}
          className="flex-1 px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white font-mono tracking-widest placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 uppercase"
        />
        <button
          onClick={submit}
          disabled={status === 'loading' || status === 'success' || !code.trim()}
          className="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
        >
          {status === 'loading' ? '...' : 'Valider'}
        </button>
      </div>
      {msg && (
        <p className={`text-sm font-medium ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>{msg}</p>
      )}
    </div>
  );
}
