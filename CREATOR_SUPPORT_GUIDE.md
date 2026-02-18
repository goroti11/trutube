# Guide du Système de Support aux Créateurs TruTube

## Vue d'ensemble

Le système de support aux créateurs permet aux fans de soutenir financièrement leurs créateurs préférés via plusieurs méthodes de paiement et d'abonnement.

## Fonctionnalités Principales

### 1. Pourboires (Tips)

Les utilisateurs peuvent envoyer des pourboires ponctuels aux créateurs.

#### Caractéristiques
- **Montants préétablis** : 1€, 5€, 10€, 25€, 50€, 100€
- **Montant personnalisé** : Possibilité d'entrer un montant libre (minimum 1€)
- **Message personnel** : Jusqu'à 200 caractères
- **Visibilité** : Choix d'afficher publiquement ou anonymement
- **Confirmation instantanée** : Notification de succès

#### Utilisation
1. Visiter le profil d'un créateur
2. Cliquer sur le bouton "Soutenir" (rose/rouge avec icône coeur)
3. Sélectionner l'onglet "Pourboire"
4. Choisir un montant ou entrer un montant personnalisé
5. Ajouter un message optionnel
6. Confirmer le paiement

### 2. Abonnements Membres (Memberships)

Système d'abonnement mensuel avec différents niveaux.

#### Niveaux d'Abonnement

**Supporter (Basic) - 4.99€/mois**
- Badge exclusif
- Emojis personnalisés
- Nom dans les crédits

**Fan (Premium) - 9.99€/mois**
- Tous les avantages Supporter
- Accès anticipé aux vidéos
- Contenu exclusif mensuel
- Badge animé

**Super Fan (VIP) - 24.99€/mois**
- Tous les avantages Fan
- Chat privé mensuel avec le créateur
- Influence sur le contenu
- Badge premium animé
- Accès Discord VIP

#### Fonctionnalités
- **Renouvellement automatique** : Mensuel par défaut
- **Annulation simple** : À tout moment dans les paramètres
- **Avantages immédiats** : Dès la souscription
- **Badge visible** : Sur le profil et les commentaires

### 3. Classement des Supporters (Leaderboard)

Tableau des meilleurs supporters pour chaque créateur.

#### Affichage
- **Top 10 supporters** : Classés par montant total
- **Médailles spéciales** :
  - 1ère place : Couronne dorée
  - 2ème place : Médaille d'argent
  - 3ème place : Médaille de bronze
- **Statistiques** :
  - Montant total donné
  - Nombre de soutiens
  - Date du dernier soutien

#### Visibilité
- Public par défaut
- Option de masquer son nom du classement
- Badge spécial "Top Supporter" pour le #1

### 4. Historique des Soutiens

Liste des soutiens récents reçus par le créateur.

#### Informations Affichées
- Nom du supporter (si public)
- Montant du soutien
- Message accompagnant
- Type de soutien (tip, membership, etc.)
- Date du soutien

#### Filtres
- Par type de soutien
- Par période
- Par montant

## Architecture Technique

### Base de Données

#### Tables Créées

**creator_support**
```sql
- id: uuid (primary key)
- supporter_id: uuid (foreign key → profiles)
- creator_id: uuid (foreign key → profiles)
- amount: numeric(10,2)
- currency: text (default 'USD')
- support_type: 'tip' | 'membership' | 'superchat' | 'donation'
- message: text
- is_public: boolean
- status: 'pending' | 'completed' | 'failed' | 'refunded'
- payment_method: text
- created_at: timestamptz
```

**creator_memberships**
```sql
- id: uuid (primary key)
- user_id: uuid (foreign key → profiles)
- creator_id: uuid (foreign key → profiles)
- tier: 'basic' | 'premium' | 'vip'
- amount: numeric(10,2)
- start_date: timestamptz
- end_date: timestamptz
- is_active: boolean
- auto_renew: boolean
- created_at: timestamptz
```

**support_leaderboard**
```sql
- id: uuid (primary key)
- creator_id: uuid (foreign key → profiles)
- supporter_id: uuid (foreign key → profiles)
- total_amount: numeric(10,2)
- support_count: integer
- last_support_at: timestamptz
- is_visible: boolean
- created_at: timestamptz
```

#### Champs Ajoutés aux Profils

```sql
- support_enabled: boolean (default true)
- minimum_support_amount: numeric(10,2) (default 1.00)
- total_support_received: numeric(10,2) (default 0)
- top_supporter_id: uuid (foreign key → profiles)
- membership_tiers: jsonb (configuration des niveaux)
```

### Services

#### creatorSupportService

**Méthodes Principales**

```typescript
// Créer un soutien
createSupport(
  supporterId: string,
  creatorId: string,
  amount: number,
  supportType: 'tip' | 'membership' | 'superchat' | 'donation',
  message?: string,
  isPublic?: boolean
): Promise<CreatorSupport | null>

// Récupérer les soutiens d'un créateur
getCreatorSupports(creatorId: string, limit?: number): Promise<CreatorSupport[]>

// Créer un abonnement membre
createMembership(
  userId: string,
  creatorId: string,
  tier: 'basic' | 'premium' | 'vip',
  amount: number,
  duration?: number
): Promise<CreatorMembership | null>

// Récupérer l'abonnement actif d'un utilisateur
getUserMembership(
  userId: string,
  creatorId: string
): Promise<CreatorMembership | null>

// Annuler un abonnement
cancelMembership(membershipId: string): Promise<boolean>

// Récupérer le classement
getSupportLeaderboard(
  creatorId: string,
  limit?: number
): Promise<SupportLeaderboard[]>

// Obtenir le total reçu
getTotalSupportReceived(creatorId: string): Promise<number>

// Obtenir le top supporter
getTopSupporter(creatorId: string): Promise<any>

// Formatter un montant
formatAmount(amount: number, currency?: string): string
```

### Composants

#### SupportCreatorModal

Modal principal pour soutenir un créateur.

**Props**
```typescript
{
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  onClose: () => void;
  onSuccess?: () => void;
}
```

**Fonctionnalités**
- 2 onglets : Pourboire / Abonnement
- Sélection de montants prédéfinis
- Saisie de montant personnalisé
- Message optionnel avec compteur de caractères
- Checkbox pour visibilité publique
- Animation de succès après paiement

#### SupportLeaderboardSection

Section affichant le classement et l'historique.

**Props**
```typescript
{
  creatorId: string;
}
```

**Fonctionnalités**
- 2 onglets : Top Supporters / Récents
- Médailles pour top 3
- Statistiques détaillées
- Design dégradé pour le podium
- Animation au survol

### Sécurité

#### Row Level Security (RLS)

Toutes les tables ont des politiques RLS strictes :

**creator_support**
- Les soutiens publics sont visibles par tous
- Les utilisateurs voient leurs propres soutiens
- Les créateurs voient tous les soutiens reçus
- Seuls les supporters peuvent créer des soutiens
- Impossible de se soutenir soi-même

**creator_memberships**
- Les abonnements actifs sont visibles par le membre et le créateur
- Les utilisateurs peuvent gérer leurs propres abonnements
- Impossible de s'abonner à soi-même

**support_leaderboard**
- Les entrées visibles sont publiques
- Les créateurs voient leur leaderboard complet
- Mise à jour automatique par le système

#### Validation des Données

- Montant minimum : 1€
- Montant maximum : 10,000€
- Message : 200 caractères max
- Types de support : liste fermée
- Statuts de paiement : validés
- Devise : USD par défaut

### Triggers et Fonctions SQL

#### update_creator_support_stats()

Trigger automatique après chaque soutien :
1. Met à jour le total reçu par le créateur
2. Ajoute/met à jour l'entrée dans le leaderboard
3. Met à jour le top supporter
4. Incrémente les compteurs

#### check_membership_expiration()

Fonction à exécuter périodiquement :
- Désactive les abonnements expirés
- Ne touche pas ceux avec auto-renew
- Peut être appelée par un cron job

## Intégration Frontend

### Page de Profil Enrichie

#### Bouton "Soutenir"

```tsx
<button
  onClick={() => setShowSupportModal(true)}
  className="px-6 py-3 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-lg shadow-pink-500/20"
>
  <Heart className="w-5 h-5" />
  Soutenir
</button>
```

#### Onglet Supporters

```tsx
<button
  onClick={() => setActiveTab('supporters')}
  className={`pb-4 font-semibold transition-colors border-b-2 ${
    activeTab === 'supporters'
      ? 'border-primary-500 text-white'
      : 'border-transparent text-gray-400 hover:text-white'
  }`}
>
  Supporters
</button>
```

### Intégration Paiement

Le système est conçu pour s'intégrer avec Stripe :

```typescript
// À implémenter
const handlePayment = async (amount: number) => {
  // 1. Créer une PaymentIntent via Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100, // en centimes
    currency: 'eur',
    metadata: {
      creator_id: creatorId,
      supporter_id: supporterId
    }
  });

  // 2. Confirmer le paiement
  const { error } = await stripe.confirmCardPayment(
    paymentIntent.client_secret
  );

  // 3. Enregistrer dans la DB
  if (!error) {
    await creatorSupportService.createSupport(...);
  }
};
```

## Statistiques Créateur

### Dashboard Créateur

Affichage des métriques de support :

```typescript
const stats = {
  totalReceived: await getTotalSupportReceived(creatorId),
  topSupporter: await getTopSupporter(creatorId),
  recentSupports: await getCreatorSupports(creatorId, 10),
  activeMemberships: await getCreatorMemberships(creatorId)
};
```

### Graphiques de Revenus

```typescript
// Revenus par mois
const monthlyRevenue = await getMonthlyRevenue(creatorId);

// Revenus par type
const revenueByType = {
  tips: await getTipRevenue(creatorId),
  memberships: await getMembershipRevenue(creatorId),
  superchats: await getSuperchatRevenue(creatorId)
};
```

## Notifications

### Pour le Créateur

Notifications reçues :
- Nouveau soutien reçu
- Nouvel abonné membre
- Palier de revenu atteint
- Top supporter mis à jour

### Pour le Supporter

Notifications envoyées :
- Confirmation de soutien
- Abonnement renouvelé
- Abonnement expirant bientôt
- Avantages débloqués

## Badges et Récompenses

### Badges Automatiques

- **Supporter** : Premier soutien à un créateur
- **Généreux** : 10+ soutiens envoyés
- **Philanthrope** : 100€+ donnés au total
- **Top Fan** : #1 supporter d'un créateur
- **Membre Fondateur** : Parmi les 10 premiers abonnés

### Affichage des Badges

Les badges apparaissent :
- Sur le profil utilisateur
- À côté du nom dans les commentaires
- Dans le classement des supporters
- Dans les messages de chat

## Conformité et Légal

### Fiscalité

- Déclaration automatique des revenus
- Export pour déclaration fiscale
- Historique complet des transactions
- Conformité TVA selon pays

### Protection des Données

- Conformité RGPD
- Anonymisation possible
- Export de données
- Droit à l'oubli

### Conditions d'Utilisation

- Minimum 18 ans pour soutenir
- Vérification d'identité pour créateurs
- Politique de remboursement claire
- Interdiction du contenu illégal

## Modération

### Filtrage Automatique

- Messages inappropriés bloqués
- Montants suspects flaggés
- Fraude détectée automatiquement
- Rate limiting

### Outils Modération

Les créateurs peuvent :
- Bloquer des supporters
- Masquer des messages
- Définir un montant minimum
- Désactiver temporairement les soutiens

## Futures Améliorations

### Fonctionnalités Prévues

1. **Super Chat**
   - Messages mis en évidence durant live streams
   - Durée proportionnelle au montant
   - Animations spéciales

2. **Super Stickers**
   - Stickers animés payants
   - Collection exclusive
   - Niveaux de rareté

3. **Objectifs de Financement**
   - Objectifs communautaires
   - Barre de progression
   - Récompenses pour atteinte d'objectifs

4. **Cadeaux d'Abonnement**
   - Offrir des abonnements à d'autres
   - Cadeaux aléatoires pour la communauté
   - Événements spéciaux

5. **Analytiques Avancées**
   - Prédiction de revenus
   - Suggestions d'optimisation
   - Comparaison avec créateurs similaires

6. **Programme de Fidélité**
   - Points de fidélité
   - Récompenses exclusives
   - Niveaux VIP progressifs

## Support Technique

### Problèmes Courants

**Le paiement échoue**
- Vérifier les fonds
- Vérifier les informations carte
- Contacter la banque si besoin

**L'abonnement ne se renouvelle pas**
- Vérifier auto-renew activé
- Vérifier date d'expiration carte
- Mettre à jour le mode de paiement

**Je ne vois pas mes avantages**
- Actualiser la page
- Se déconnecter/reconnecter
- Attendre jusqu'à 24h

### Contact

Pour toute question ou problème :
- FAQ : /help/support
- Email : support@trutube.com
- Chat en direct : disponible 24/7

## Résumé

Le système de support aux créateurs TruTube offre une solution complète et sécurisée pour monétiser le contenu. Avec des pourboires instantanés, des abonnements mensuels à plusieurs niveaux, et un système de classement motivant, les créateurs peuvent générer des revenus stables tout en récompensant leurs fans les plus fidèles.
