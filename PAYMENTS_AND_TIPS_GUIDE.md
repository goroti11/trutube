# Guide des Paiements et Tips - TruTube

## Vue d'ensemble

Ce guide explique le système complet de paiements et de tips (pourboires) implémenté dans TruTube, permettant aux utilisateurs de supporter financièrement les créateurs et de souscrire aux abonnements premium.

---

## 🎯 Fonctionnalités

### 1. Système de Tips

Les utilisateurs peuvent envoyer des pourboires aux créateurs pour montrer leur soutien :

- **Montants flexibles** : Montants prédéfinis ($1, $5, $10, $20, $50, $100) ou personnalisés
- **Messages personnalisés** : Ajouter un message avec le tip
- **Options de confidentialité** :
  - Anonyme : Le créateur ne voit pas qui a envoyé le tip
  - Public : Le tip apparaît publiquement (par défaut)
- **Tips par vidéo** : Envoyer un tip sur une vidéo spécifique
- **Historique complet** : Voir tous les tips envoyés et reçus

### 2. Portefeuille Créateur

Chaque créateur dispose d'un portefeuille pour gérer ses revenus :

- **Balance disponible** : Montant retirable immédiatement
- **Balance en attente** : Montant en cours de traitement (15 jours)
- **Revenus totaux** : Historique complet des gains
- **Retraits** : Demander un retrait vers un compte bancaire

### 3. Système de Paiement

Infrastructure complète pour gérer tous les paiements :

- **Méthodes de paiement** : Cartes bancaires, comptes bancaires
- **Transactions** : Historique complet avec statuts
- **Stripe Integration** : Processeur de paiement sécurisé
- **Webhooks** : Synchronisation automatique des paiements

---

## 📦 Architecture

### Tables de Base de Données

#### `tips`
Stocke tous les tips envoyés aux créateurs

```sql
- id (uuid)
- from_user_id (uuid) → profiles
- to_creator_id (uuid) → profiles
- video_id (uuid) → videos (optional)
- amount (numeric)
- currency (text, default: 'USD')
- message (text)
- is_anonymous (boolean)
- is_public (boolean)
- status (pending | completed | failed | refunded)
- transaction_id (uuid) → transactions
- stripe_payment_intent_id (text)
- created_at, updated_at (timestamptz)
```

#### `creator_wallets`
Portefeuilles des créateurs

```sql
- id (uuid)
- creator_id (uuid) → profiles (unique)
- balance (numeric) - Montant retirable
- total_earned (numeric) - Total gagné
- total_withdrawn (numeric) - Total retiré
- pending_balance (numeric) - En attente
- stripe_account_id (text)
- currency (text, default: 'USD')
- last_payout_date (timestamptz)
- created_at, updated_at (timestamptz)
```

#### `transactions`
Historique de toutes les transactions

```sql
- id (uuid)
- user_id (uuid) → profiles
- transaction_type (subscription | tip | campaign | withdrawal | refund)
- amount (numeric)
- currency (text)
- status (pending | completed | failed | refunded | cancelled)
- stripe_payment_intent_id (text)
- stripe_charge_id (text)
- description (text)
- metadata (jsonb)
- related_id (uuid) - ID de l'objet lié
- created_at, updated_at (timestamptz)
```

#### `payment_methods`
Méthodes de paiement des utilisateurs

```sql
- id (uuid)
- user_id (uuid) → profiles
- stripe_payment_method_id (text)
- payment_type (card | bank_account | paypal)
- card_brand (text)
- card_last4 (text)
- is_default (boolean)
- billing_details (jsonb)
- created_at, updated_at (timestamptz)
```

#### `withdrawal_requests`
Demandes de retrait des créateurs

```sql
- id (uuid)
- creator_id (uuid) → profiles
- amount (numeric)
- currency (text)
- status (pending | processing | completed | failed | cancelled)
- stripe_transfer_id (text)
- payment_method (text)
- destination_details (jsonb)
- notes (text)
- requested_at, processed_at (timestamptz)
- created_at, updated_at (timestamptz)
```

### Fonctions RPC Supabase

#### `get_or_create_creator_wallet(p_creator_id)`
Récupère ou crée le portefeuille d'un créateur

#### `process_tip_payment(p_tip_id, p_transaction_id)`
Traite un tip et met à jour le portefeuille du créateur
- Prend 85% pour le créateur
- Met 15% en balance en attente

#### `get_creator_earnings_breakdown(p_creator_id)`
Retourne la répartition détaillée des revenus d'un créateur

#### `request_withdrawal(p_creator_id, p_amount, p_payment_method, p_destination_details)`
Crée une demande de retrait pour un créateur

#### `get_top_tippers(p_creator_id, p_limit)`
Retourne les top donateurs d'un créateur

---

## 💻 API Frontend

### Service: `paymentService`

#### Envoyer un Tip

```typescript
await paymentService.sendTip(
  fromUserId: string,
  toCreatorId: string,
  amount: number,
  message: string = '',
  videoId?: string,
  isAnonymous: boolean = false,
  isPublic: boolean = true
): Promise<Tip | null>
```

**Exemple :**
```typescript
const tip = await paymentService.sendTip(
  currentUser.id,
  creator.id,
  10,
  'Great content!',
  video.id,
  false,
  true
);
```

#### Récupérer les Tips

```typescript
// Tips reçus par un créateur
const tips = await paymentService.getTipsByCreator(creatorId);

// Tips envoyés par un utilisateur
const sentTips = await paymentService.getTipsByUser(userId);

// Tips sur une vidéo
const videoTips = await paymentService.getTipsByVideo(videoId);

// Top donateurs
const topTippers = await paymentService.getTopTippers(creatorId, 10);
```

#### Portefeuille Créateur

```typescript
// Récupérer le portefeuille
const wallet = await paymentService.getCreatorWallet(creatorId);

// Répartition des revenus
const earnings = await paymentService.getEarningsBreakdown(creatorId);

// Demander un retrait
const requestId = await paymentService.requestWithdrawal(
  creatorId,
  100,
  'bank_transfer',
  { account: '1234' }
);

// Voir les demandes de retrait
const requests = await paymentService.getWithdrawalRequests(creatorId);
```

#### Transactions

```typescript
// Créer une transaction
const transaction = await paymentService.createTransaction({
  user_id: userId,
  transaction_type: 'tip',
  amount: 10,
  status: 'pending',
  description: 'Tip to creator'
});

// Voir l'historique
const transactions = await paymentService.getTransactions(userId);
```

#### Méthodes de Paiement

```typescript
// Ajouter une méthode de paiement
const paymentMethod = await paymentService.addPaymentMethod(
  userId,
  'pm_1234567890',
  'card',
  'Visa',
  '4242',
  true,
  { name: 'John Doe' }
);

// Récupérer les méthodes
const methods = await paymentService.getPaymentMethods(userId);

// Définir par défaut
await paymentService.setDefaultPaymentMethod(userId, methodId);

// Supprimer une méthode
await paymentService.deletePaymentMethod(userId, methodId);
```

---

## 🎨 Composants UI

### TipModal

Modal pour envoyer un tip à un créateur.

**Props:**
```typescript
interface TipModalProps {
  creator: User;
  videoId?: string;
  onClose: () => void;
  onSuccess?: () => void;
}
```

**Usage:**
```tsx
import TipModal from '../components/TipModal';

<TipModal
  creator={creator}
  videoId={video?.id}
  onClose={() => setShowTipModal(false)}
  onSuccess={() => {
    loadWalletData();
    showSuccessNotification('Tip sent!');
  }}
/>
```

**Fonctionnalités:**
- Montants prédéfinis et personnalisés
- Message optionnel
- Options anonyme et public
- Validation des montants
- Feedback de succès/erreur

---

## 💳 Intégration Stripe

### Configuration

Pour activer les paiements avec Stripe, vous devez :

1. **Créer un compte Stripe**
   - Visitez [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   - Complétez les informations de votre entreprise

2. **Obtenir les clés API**
   - Allez dans Developers > API keys
   - Copiez la clé publique et la clé secrète

3. **Configurer les variables d'environnement**

Ajoutez dans `.env` :

```env
# Stripe API Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51...
STRIPE_SECRET_KEY=sk_test_51...

# Stripe Webhook Secret
STRIPE_WEBHOOK_SECRET=whsec_...
```

**IMPORTANT** : Ne committez jamais votre `.env` avec de vraies clés !

### Webhooks Stripe

Les webhooks permettent à Stripe de notifier votre application des événements de paiement.

#### Événements à écouter :

- `payment_intent.succeeded` - Paiement réussi
- `payment_intent.payment_failed` - Paiement échoué
- `charge.refunded` - Remboursement
- `customer.subscription.created` - Abonnement créé
- `customer.subscription.deleted` - Abonnement annulé

#### Configuration :

1. Dans le Dashboard Stripe, allez dans Developers > Webhooks
2. Cliquez "Add endpoint"
3. URL : `https://votre-domaine.com/api/webhooks/stripe`
4. Sélectionnez les événements ci-dessus
5. Copiez le "Signing secret" dans `STRIPE_WEBHOOK_SECRET`

---

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS strictes :

#### Tips
- ✅ Les utilisateurs voient les tips qu'ils ont envoyés
- ✅ Les créateurs voient les tips qu'ils ont reçus
- ✅ Les tips publics sont visibles par tous
- ❌ Pas d'accès aux tips privés d'autres utilisateurs

#### Creator Wallets
- ✅ Les créateurs voient uniquement leur propre portefeuille
- ❌ Les autres utilisateurs ne peuvent pas voir les portefeuilles

#### Transactions
- ✅ Les utilisateurs voient uniquement leurs propres transactions
- ❌ Pas d'accès aux transactions d'autres utilisateurs

#### Payment Methods
- ✅ Les utilisateurs gèrent uniquement leurs propres méthodes
- ❌ Total isolation entre utilisateurs

### Protection des Données

- **Aucune donnée de carte** stockée dans la base de données
- **IDs Stripe uniquement** - toutes les données sensibles chez Stripe
- **Tokens temporaires** pour les paiements
- **Chiffrement HTTPS** pour toutes les communications
- **Webhooks signés** pour vérifier l'authenticité

---

## 💰 Modèle de Revenus

### Répartition des Tips

Quand un utilisateur envoie un tip :

| Partie | Pourcentage | Description |
|--------|-------------|-------------|
| Créateur (disponible) | 85% | Ajouté au balance retirable immédiatement |
| Créateur (en attente) | 15% | Mis en attente 15 jours (sécurité anti-fraude) |

**Exemple :**
- Tip de $100
- Créateur reçoit $85 immédiatement retirab le
- $15 mis en attente pendant 15 jours

### Frais de Retrait

| Montant | Frais |
|---------|-------|
| $10 - $99 | $1.00 |
| $100 - $499 | $2.50 |
| $500+ | $5.00 |

**Minimum de retrait :** $10

### Délais

- **Tips** : Instantané
- **Retraits** : 2-5 jours ouvrables
- **Remboursements** : 5-10 jours ouvrables

---

## 📊 Dashboard Créateur

Les créateurs ont accès à un dashboard complet pour gérer leurs revenus.

### Métriques Affichées

```typescript
interface EarningsBreakdown {
  total_tips: number;
  total_subscriptions: number;
  total_ad_revenue: number;
  total_earnings: number;
  available_balance: number;
  pending_balance: number;
}
```

### Sections

1. **Vue d'ensemble**
   - Balance disponible
   - Balance en attente
   - Revenus totaux

2. **Historique des Tips**
   - Liste des tips reçus
   - Filtres par date/vidéo
   - Montant total

3. **Top Donateurs**
   - Liste des plus généreux supporters
   - Montant total par donateur
   - Nombre de tips

4. **Retraits**
   - Demander un retrait
   - Historique des retraits
   - Statuts en temps réel

---

## 🧪 Tests

### Tester les Tips

Pour tester en développement :

```typescript
// 1. Envoyer un tip de test
const tip = await paymentService.sendTip(
  testUserId,
  testCreatorId,
  10,
  'Test tip'
);

console.log('Tip sent:', tip);

// 2. Vérifier le portefeuille
const wallet = await paymentService.getCreatorWallet(testCreatorId);

console.log('Wallet balance:', wallet?.balance); // Devrait être $8.50 (85% de $10)
console.log('Pending balance:', wallet?.pending_balance); // Devrait être $1.50 (15% de $10)

// 3. Vérifier l'historique
const tips = await paymentService.getTipsByCreator(testCreatorId);
console.log('Tips received:', tips.length);
```

### Tester les Retraits

```typescript
// 1. Vérifier la balance
const wallet = await paymentService.getCreatorWallet(creatorId);

if (wallet && wallet.balance >= 10) {
  // 2. Demander un retrait
  const requestId = await paymentService.requestWithdrawal(
    creatorId,
    10,
    'bank_transfer'
  );

  console.log('Withdrawal requested:', requestId);

  // 3. Vérifier les demandes
  const requests = await paymentService.getWithdrawalRequests(creatorId);
  console.log('Pending requests:', requests);
}
```

---

## 🐛 Résolution de Problèmes

### Erreur : "Insufficient balance"

**Cause :** Le créateur n'a pas assez dans sa balance disponible.

**Solution :**
```typescript
const wallet = await paymentService.getCreatorWallet(creatorId);
console.log('Available:', wallet?.balance);
console.log('Pending:', wallet?.pending_balance);
```

### Erreur : "Minimum withdrawal amount is $10"

**Cause :** Montant de retrait inférieur au minimum.

**Solution :** Assurez-vous que le montant est ≥ $10.

### Tips n'apparaissent pas dans le portefeuille

**Vérifications :**

1. Vérifier le statut du tip :
```typescript
const tip = await supabase
  .from('tips')
  .select('*')
  .eq('id', tipId)
  .single();

console.log('Tip status:', tip.data.status);
```

2. Vérifier la transaction associée :
```typescript
const transaction = await supabase
  .from('transactions')
  .select('*')
  .eq('id', tip.data.transaction_id)
  .single();

console.log('Transaction status:', transaction.data.status);
```

3. Forcer le traitement :
```typescript
await supabase.rpc('process_tip_payment', {
  p_tip_id: tipId,
  p_transaction_id: transactionId
});
```

---

## 📚 Ressources

### Documentation Externe

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

### Cartes de Test Stripe

Pour tester en mode développement :

| Numéro | Description |
|--------|-------------|
| 4242 4242 4242 4242 | Succès |
| 4000 0000 0000 0002 | Échec (carte refusée) |
| 4000 0000 0000 9995 | Échec (fonds insuffisants) |

**Expiration :** N'importe quelle date future
**CVC :** N'importe quel 3 chiffres
**ZIP :** N'importe quel 5 chiffres

---

## 🎉 Résumé

### Ce qui a été implémenté :

✅ Migration complète de base de données (5 tables + 5 fonctions RPC)
✅ Service de paiement complet (`paymentService`)
✅ Composant TipModal amélioré
✅ Système de portefeuille créateur
✅ Gestion des transactions
✅ Système de retraits
✅ RLS stricte sur toutes les tables
✅ Documentation complète

### Prochaines étapes :

1. **Configurer Stripe** avec vos clés API
2. **Créer un webhook endpoint** pour synchroniser les paiements
3. **Tester le système** en développement
4. **Intégrer dans les pages** (VideoPlayerPage, ProfilePage, etc.)
5. **Créer le CreatorDashboard** pour gérer les revenus

---

**Questions ? Besoin d'aide ? Consultez la documentation complète ou contactez support@trutube.com**

*Dernière mise à jour : Février 2026*
