# Système d'Abonnements Premium TruTube

## Vue d'ensemble

TruTube propose trois niveaux d'abonnements premium pour offrir une expérience améliorée aux utilisateurs :

### 🌟 Premium - 9.99€/mois
Niveau d'entrée pour une expérience sans publicité et des fonctionnalités essentielles.

**Avantages :**
- Vidéos sans publicité
- Accès aux contenus exclusifs
- Téléchargement de vidéos en qualité HD
- Badge Premium sur votre profil
- Support prioritaire
- Accès anticipé aux nouvelles fonctionnalités

### 💎 Platine - 19.99€/mois
Niveau intermédiaire avec des fonctionnalités avancées et des avantages premium complets.

**Avantages :**
- Tous les avantages Premium
- Téléchargement en qualité 4K
- Accès illimité à tous les univers
- Badge Platine unique et animé
- Création de playlists personnalisées
- Statistiques avancées de visionnage
- Accès aux événements en direct exclusifs
- Stockage cloud pour vos favoris

### 👑 Gold - 29.99€/mois
Niveau ultime avec accès VIP et fonctionnalités exclusives.

**Avantages :**
- Tous les avantages Platine
- Badge Gold prestigieux et animé
- Accès VIP aux créateurs
- Téléchargements illimités
- Mode hors ligne avancé
- Suggestions personnalisées par IA
- Invitation aux événements exclusifs
- Accès aux coulisses des créateurs
- Support dédié 24/7
- Participation aux décisions de la plateforme

## Architecture Technique

### Base de données

La table `premium_subscriptions` gère tous les abonnements :

```sql
CREATE TABLE premium_subscriptions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  tier text CHECK (tier IN ('premium', 'platine', 'gold')),
  price numeric,
  status text CHECK (status IN ('active', 'cancelled', 'expired', 'paused')),
  started_at timestamptz,
  expires_at timestamptz,
  auto_renew boolean,
  stripe_subscription_id text,
  ...
);
```

### Fonctions utilitaires

#### Vérifier l'accès aux fonctionnalités
```sql
SELECT user_has_premium_feature(user_id, 'no_ads');
SELECT user_has_premium_feature(user_id, '4k_download');
SELECT user_has_premium_feature(user_id, 'vip_access');
```

#### Obtenir les avantages d'un tier
```sql
SELECT get_tier_benefits('premium');
SELECT get_tier_benefits('platine');
SELECT get_tier_benefits('gold');
```

### Service PaymentService

Le service `paymentService` expose les méthodes suivantes :

```typescript
// S'abonner à un tier
await paymentService.subscribeToPremium(userId, 'premium');

// Obtenir l'abonnement actuel
const subscription = await paymentService.getPremiumSubscription(userId);

// Changer de tier
await paymentService.upgradePremiumTier(userId, 'gold');

// Annuler l'abonnement
await paymentService.cancelPremiumSubscription(userId);

// Vérifier le statut premium
const isPremium = await paymentService.checkPremiumStatus(userId);
```

## Interface Utilisateur

### Page d'abonnement

La page `/subscriptions` affiche les trois options d'abonnement côte à côte avec :
- Présentation visuelle de chaque tier avec gradient unique
- Liste complète des avantages
- Indication de l'abonnement actuel
- Possibilité de changer de tier
- Bouton d'annulation pour les abonnés actifs

### Badges Premium

Les utilisateurs premium disposent de badges visuels distinctifs :

```tsx
import PremiumBadge from './components/PremiumBadge';

<PremiumBadge tier="premium" size="md" animated={true} />
<PremiumBadge tier="platine" size="md" animated={true} />
<PremiumBadge tier="gold" size="md" animated={true} />
```

## Gestion des Abonnements

### Cycle de vie

1. **Création** : L'utilisateur choisit un tier et s'abonne
2. **Actif** : L'abonnement est valide jusqu'à la date d'expiration
3. **Renouvellement** : Si `auto_renew = true`, l'abonnement se renouvelle automatiquement
4. **Annulation** : L'utilisateur peut annuler mais conserve l'accès jusqu'à expiration
5. **Expiration** : L'abonnement expire et le statut passe à 'expired'

### Changement de tier

Les utilisateurs peuvent upgrader ou downgrader leur abonnement à tout moment :
- **Upgrade** : Paiement immédiat de la différence
- **Downgrade** : Le changement prend effet au prochain cycle de facturation

### Paiements

Les paiements sont gérés via Stripe :
- Carte bancaire
- Renouvellement automatique
- Historique des transactions dans la table `transactions`

## Sécurité

### RLS Policies

```sql
-- Les utilisateurs peuvent voir leur propre abonnement
CREATE POLICY "Users can view own subscription"
  ON premium_subscriptions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Les utilisateurs peuvent mettre à jour leur propre abonnement
CREATE POLICY "Users can update own subscription"
  ON premium_subscriptions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);
```

### Vérification de statut

Le statut premium est vérifié à chaque action critique :
- Accès aux contenus premium
- Téléchargements
- Fonctionnalités avancées

## Statistiques

### Vue des statistiques
```sql
SELECT * FROM premium_subscription_stats;
```

Retourne :
- Nombre total d'abonnements par tier
- Abonnements actifs, annulés, expirés
- Revenu mensuel par tier
- Prix moyen par tier

## Intégration dans l'application

### Vérifier le statut premium d'un utilisateur

```typescript
import { useAuth } from './contexts/AuthContext';

const { user } = useAuth();

// Dans le profil
if (user?.is_premium) {
  // Afficher le badge premium
}
```

### Restreindre l'accès aux fonctionnalités

```typescript
const isPremium = await paymentService.checkPremiumStatus(userId);

if (!isPremium) {
  // Afficher modal pour s'abonner
  return;
}

// Autoriser l'accès
```

## Support et Maintenance

### Tâches automatiques recommandées

1. Vérifier quotidiennement les abonnements expirés
2. Envoyer des rappels avant expiration
3. Traiter les renouvellements automatiques
4. Gérer les échecs de paiement

### Monitoring

Surveiller :
- Taux de conversion par tier
- Taux de rétention
- Taux d'annulation
- Revenu mensuel récurrent (MRR)
- Valeur vie client (LTV)
