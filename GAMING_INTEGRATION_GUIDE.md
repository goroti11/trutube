# GOROTI Gaming Integration Guide

Guide complet pour intégrer le module Gaming dans GOROTI.

## 1. Installation et Configuration

### Prérequis

```bash
# Les dépendances sont déjà incluses dans le projet
npm install @supabase/supabase-js lucide-react
```

### Migrations Base de Données

Les migrations suivantes doivent être appliquées dans l'ordre:

1. `create_gaming_division_core_tables.sql`
2. `create_gaming_tournaments_and_matches.sql`
3. `create_gaming_leaderboards_and_arena_fund.sql`
4. `create_gaming_rpc_functions.sql`
5. `seed_gaming_data_production.sql`

## 2. Intégration dans App.tsx

### Imports

```typescript
// Dans App.tsx, ajouter:
import {
  GamingHubPage,
  GamingTournamentsPage,
  GamingTeamsPage,
  GamingLeaderboardsPage,
  GamingSeasonsPage,
  GamingArenaFundPage
} from './modules/gaming';
```

### Types de Page

```typescript
type Page =
  | 'home'
  | 'gaming-hub'
  | 'gaming-tournaments'
  | 'gaming-teams'
  | 'gaming-leaderboards'
  | 'gaming-seasons'
  | 'gaming-arena-fund'
  | 'gaming-tournament-detail'
  | 'gaming-team-detail'
  // ... autres pages existantes
```

### State Management

```typescript
const [gamingData, setGamingData] = useState<{
  tournamentId?: string;
  teamId?: string;
  gameId?: string;
}>({});
```

### Rendering

```typescript
// Dans la fonction de render:

{currentPage === 'gaming-hub' && (
  <GamingHubPage
    onNavigate={(page, data) => {
      if (data) {
        setGamingData(data);
      }
      setCurrentPage(page as Page);
    }}
  />
)}

{currentPage === 'gaming-tournaments' && (
  <GamingTournamentsPage
    onNavigate={(page, data) => {
      if (data) setGamingData(data);
      setCurrentPage(page as Page);
    }}
  />
)}

{currentPage === 'gaming-teams' && (
  <GamingTeamsPage
    onNavigate={(page, data) => {
      if (data) setGamingData(data);
      setCurrentPage(page as Page);
    }}
  />
)}

{currentPage === 'gaming-leaderboards' && (
  <GamingLeaderboardsPage
    onNavigate={(page, data) => {
      if (data) setGamingData(data);
      setCurrentPage(page as Page);
    }}
  />
)}

{currentPage === 'gaming-seasons' && (
  <GamingSeasonsPage
    onNavigate={(page, data) => {
      if (data) setGamingData(data);
      setCurrentPage(page as Page);
    }}
  />
)}

{currentPage === 'gaming-arena-fund' && (
  <GamingArenaFundPage
    onNavigate={(page, data) => {
      if (data) setGamingData(data);
      setCurrentPage(page as Page);
    }}
  />
)}
```

## 3. Navigation dans Header.tsx

Ajouter un bouton Gaming dans le header principal:

```typescript
import { Gamepad2 } from 'lucide-react';

// Dans le header:
<button
  onClick={() => onNavigate('gaming-hub')}
  className="flex items-center gap-2 px-3 py-2 text-purple-400 hover:text-white hover:bg-purple-900/30 rounded-lg transition-colors"
  title="GOROTI Gaming"
>
  <Gamepad2 className="w-5 h-5" />
  <span className="hidden lg:inline">Gaming</span>
</button>
```

## 4. Intégration avec TruCoins Wallet

Le module Gaming utilise automatiquement le wallet existant. Aucune modification nécessaire.

### Vérification du Solde

Avant d'entrer dans un tournoi, le système vérifie automatiquement:

```typescript
// Déjà géré dans rpc_enter_tournament
// Le solde est vérifié et déduit atomiquement
```

### Transactions Gaming

Toutes les transactions gaming utilisent les mêmes tables:
- `trucoin_wallets` - Soldes
- `trucoin_transactions` - Historique

Types de transactions ajoutés:
- `tournament_entry` - Entrée de tournoi
- `tournament_prize` - Prix gagné
- `gaming_boost` - Boost pendant live gaming

## 5. Intégration Notifications

### Ajouter Types de Notifications

Dans votre système de notifications existant, ajouter:

```typescript
type NotificationType =
  | 'tournament_starting'
  | 'tournament_registration'
  | 'match_scheduled'
  | 'match_result'
  | 'team_invitation'
  | 'team_accepted'
  | 'prize_won'
  | 'season_ending'
  | 'ranking_updated'
  // ... types existants
```

### Créer Notifications Gaming

```typescript
// Exemple: Notification quand un tournoi commence
await createNotification({
  user_id: userId,
  type: 'tournament_starting',
  title: 'Tournament Starting Soon',
  message: `${tournamentName} begins in 1 hour!`,
  reference_type: 'tournament',
  reference_id: tournamentId
});
```

## 6. Intégration Live Studio

### Extension du Studio Existant

Dans `LiveStudioPage.tsx`, ajouter les options gaming:

```typescript
const [gamingMode, setGamingMode] = useState<'casual' | 'competitive' | 'tournament'>('casual');
const [selectedTournament, setSelectedTournament] = useState<string | null>(null);
const [enableLeaderboard, setEnableLeaderboard] = useState(false);
const [antiCheatMode, setAntiCheatMode] = useState(false);

// Dans le formulaire de création de live:
<div className="space-y-4">
  <h3 className="font-semibold">Gaming Mode</h3>

  <div className="flex gap-2">
    <button
      onClick={() => setGamingMode('casual')}
      className={gamingMode === 'casual' ? 'active' : ''}
    >
      Casual
    </button>
    <button
      onClick={() => setGamingMode('competitive')}
      className={gamingMode === 'competitive' ? 'active' : ''}
    >
      Competitive
    </button>
    <button
      onClick={() => setGamingMode('tournament')}
      className={gamingMode === 'tournament' ? 'active' : ''}
    >
      Tournament
    </button>
  </div>

  {gamingMode === 'tournament' && (
    <TournamentSelector
      onSelect={setSelectedTournament}
    />
  )}

  <label>
    <input
      type="checkbox"
      checked={enableLeaderboard}
      onChange={(e) => setEnableLeaderboard(e.target.checked)}
    />
    Enable Leaderboard Tracking
  </label>

  <label>
    <input
      type="checkbox"
      checked={antiCheatMode}
      onChange={(e) => setAntiCheatMode(e.target.checked)}
    />
    Anti-Cheat Monitoring
  </label>
</div>
```

### Créer Session Gaming

Quand un live gaming démarre:

```typescript
import { gamingService } from '@/modules/gaming';

// Après création du live_stream
const { data: session, error } = await supabase
  .from('gaming_live_sessions')
  .insert({
    stream_id: liveStreamId,
    game_id: selectedGameId,
    streamer_id: userId,
    mode: gamingMode,
    tournament_id: selectedTournament,
    season_id: currentSeasonId,
    enable_leaderboard: enableLeaderboard,
    enable_trucoins_boost: true,
    anti_cheat_reported: false
  })
  .select()
  .single();
```

## 7. Compliance Layer

### Vérifier Acceptation des Règles

Avant d'afficher le Gaming Hub:

```typescript
import { gamingService } from '@/modules/gaming';

const checkGamingAccess = async (userId: string) => {
  const rulesAccepted = await gamingService.checkRulesAcceptance(userId);

  const allAccepted =
    rulesAccepted.anti_cheat &&
    rulesAccepted.fair_play &&
    rulesAccepted.prize_transparency &&
    rulesAccepted.license_compliance;

  if (!allAccepted) {
    // Afficher modal d'acceptation des règles
    showRulesModal();
    return false;
  }

  return true;
};
```

### Modal d'Acceptation

```typescript
const RulesAcceptanceModal = () => {
  const rules = [
    {
      type: 'anti_cheat',
      title: 'Anti-Cheat Policy',
      description: 'I commit to fair play and will not use any cheating tools.'
    },
    {
      type: 'fair_play',
      title: 'Fair Play Charter',
      description: 'I will respect other players and maintain good sportsmanship.'
    },
    {
      type: 'prize_transparency',
      title: 'Prize Pool Transparency',
      description: 'I understand how prize pools are calculated and distributed.'
    },
    {
      type: 'license_compliance',
      title: 'License Compliance',
      description: 'I own legitimate copies of games I compete in.'
    }
  ];

  const [accepted, setAccepted] = useState<Record<string, boolean>>({});

  const acceptAll = async () => {
    for (const rule of rules) {
      await gamingService.acceptRule(rule.type as any, '1.0');
    }
    closeModal();
  };

  return (
    <div className="modal">
      <h2>GOROTI Gaming Rules</h2>
      <p>You must accept all rules to access Gaming features.</p>

      {rules.map(rule => (
        <div key={rule.type}>
          <h3>{rule.title}</h3>
          <p>{rule.description}</p>
          <label>
            <input
              type="checkbox"
              checked={accepted[rule.type] || false}
              onChange={(e) => setAccepted({
                ...accepted,
                [rule.type]: e.target.checked
              })}
            />
            I accept
          </label>
        </div>
      ))}

      <button
        disabled={Object.keys(accepted).length !== 4}
        onClick={acceptAll}
      >
        Accept All & Continue
      </button>
    </div>
  );
};
```

## 8. Permissions et Sécurité

### RLS Policies

Les policies sont déjà configurées. Vérifier:

```sql
-- Vérifier que les policies existent
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
AND tablename LIKE 'gaming%';
```

### Admin Roles

Créer un rôle admin pour la gestion des tournois:

```sql
-- Ajouter colonne admin si elle n'existe pas
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_gaming_admin boolean DEFAULT false;

-- Assigner des admins
UPDATE profiles
SET is_gaming_admin = true
WHERE id IN ('admin-user-id-1', 'admin-user-id-2');
```

### Rate Limiting

Implémenter dans votre middleware:

```typescript
// Rate limit: 1 tournament entry par 10 secondes
const rateLimitKey = `tournament:entry:${userId}`;
const recentEntry = await redis.get(rateLimitKey);

if (recentEntry) {
  return { error: 'Please wait before entering another tournament' };
}

await redis.setex(rateLimitKey, 10, '1');
```

## 9. Monitoring et Alertes

### Métriques à Surveiller

```typescript
// Créer des métriques dans votre système de monitoring
const metrics = {
  'gaming.tournaments.active': async () => {
    const { count } = await supabase
      .from('gaming_tournaments')
      .select('id', { count: 'exact' })
      .eq('status', 'ongoing');
    return count;
  },

  'gaming.arena_fund.balance': async () => {
    const { data } = await supabase
      .from('arena_fund')
      .select('current_balance')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    return data?.current_balance || 0;
  },

  'gaming.active_sessions': async () => {
    const { count } = await supabase
      .from('gaming_live_sessions')
      .select('id', { count: 'exact' })
      .is('ended_at', null);
    return count;
  }
};
```

### Alertes

Configurer des alertes pour:
- Arena Fund < 0 (anomalie)
- Tournament prize_pool mismatch
- Suspicious activity (many failed entries)
- RPC function errors

## 10. Testing

### Tests de Base

```typescript
describe('Gaming Module', () => {
  it('should enter tournament with valid balance', async () => {
    const result = await gamingService.enterTournament(tournamentId);
    expect(result.success).toBe(true);
  });

  it('should reject entry with insufficient balance', async () => {
    // Reduce user balance to below entry fee
    const result = await gamingService.enterTournament(tournamentId);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Insufficient balance');
  });

  it('should create team and add captain', async () => {
    const result = await gamingService.createTeam({
      name: 'Test Team',
      slug: 'test-team',
      tag: 'TEST'
    });
    expect(result.success).toBe(true);
  });
});
```

## 11. Déploiement

### Checklist Pré-Déploiement

- [ ] Migrations appliquées sur staging
- [ ] Tests de régression passés
- [ ] Vérification des policies RLS
- [ ] Indexes créés et testés
- [ ] Arena Fund initialisé
- [ ] Saison active créée
- [ ] Jeux compétitifs configurés
- [ ] Règles gaming publiées
- [ ] Monitoring configuré
- [ ] Alertes configurées
- [ ] Documentation équipe complétée

### Déploiement Production

```bash
# 1. Backup base de données
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > backup_pre_gaming.sql

# 2. Appliquer migrations
supabase db push

# 3. Vérifier
npm run test:gaming

# 4. Déployer frontend
npm run build
npm run deploy

# 5. Vérifier santé
curl https://api.goroti.com/health/gaming
```

## 12. Post-Déploiement

### Monitorer les Premières 48h

- Vérifier les transactions TruCoins
- Surveiller les inscriptions tournois
- Checker les erreurs RPC
- Valider les leaderboards
- Contrôler l'Arena Fund

### Support Utilisateurs

Préparer la FAQ:
- Comment entrer dans un tournoi?
- Comment créer une équipe?
- Que sont les TruCoins?
- Comment fonctionne l'Arena Fund?
- Que faire en cas de problème?

## Support

Pour questions d'intégration:
- Tech Lead Gaming: gaming-tech@goroti.com
- Architecture: architecture@goroti.com
- DevOps: devops@goroti.com
