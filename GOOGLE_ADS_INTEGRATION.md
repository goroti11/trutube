# Guide d'Intégration Google Ads pour Goroti

## Vue d'ensemble

Ce guide explique comment intégrer Google AdSense et le système de campagnes publicitaires dans Goroti.

## 🎯 Fonctionnalités

### 1. **Publicités pour comptes gratuits**
- Les utilisateurs gratuits voient des publicités Google AdSense
- Les publicités sont affichées stratégiquement sur les pages clés

### 2. **Sans publicité pour comptes premium**
- Les utilisateurs premium ne voient aucune publicité
- Vérification automatique du statut premium
- Mise en cache du statut pour optimiser les performances

### 3. **Campagnes publicitaires pour créateurs**
- Les créateurs peuvent promouvoir leurs vidéos/chaînes
- Budget personnalisable (total et journalier)
- Tableau de bord analytique complet
- Suivi des impressions, clics et conversions

---

## 📋 Prérequis

### Compte Google AdSense

1. Créez un compte sur [Google AdSense](https://www.google.com/adsense)
2. Vérifiez votre site web
3. Attendez l'approbation (généralement 24-48h)

### Client ID AdSense

Une fois approuvé, récupérez votre **Publisher ID** (format: `ca-pub-XXXXXXXXXXXXXXXX`)

---

## ⚙️ Configuration

### Étape 1 : Variables d'environnement

Ajoutez votre Publisher ID dans le fichier `.env` :

```env
VITE_GOOGLE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

**Important :** Remplacez `XXXXXXXXXXXXXXXX` par votre vrai Publisher ID.

### Étape 2 : Créer les slots publicitaires

1. Connectez-vous à [Google AdSense](https://www.google.com/adsense)
2. Allez dans **Ads** > **By ad unit**
3. Créez 3 unités publicitaires :

#### Slot 1 : Bannière horizontale (HomePage)
- **Type** : Display ad
- **Format** : Horizontal (728x90 ou responsive)
- **Nom** : Goroti - Home Banner
- Copiez le **Ad slot ID** (format: `1234567890`)

#### Slot 2 : Bannière vidéo (VideoPlayerPage)
- **Type** : Display ad
- **Format** : Horizontal (728x90 ou responsive)
- **Nom** : Goroti - Video Banner
- Copiez le **Ad slot ID**

#### Slot 3 : Rectangle (Comments section)
- **Type** : Display ad
- **Format** : Rectangle (300x250 ou responsive)
- **Nom** : Goroti - Comments Rectangle
- Copiez le **Ad slot ID**

### Étape 3 : Mettre à jour les composants

Ouvrez les fichiers suivants et remplacez les IDs de slots :

#### `src/pages/HomePage.tsx`

```tsx
<AdUnit
  slot="VOTRE_SLOT_ID_ICI"  // Remplacez par l'ID du Slot 1
  format="horizontal"
  className="max-w-4xl w-full"
/>
```

#### `src/pages/VideoPlayerPage.tsx`

Bannière au-dessus du player :
```tsx
<AdUnit
  slot="VOTRE_SLOT_ID_ICI"  // Remplacez par l'ID du Slot 2
  format="horizontal"
  responsive={true}
/>
```

Rectangle dans les commentaires :
```tsx
<AdUnit
  slot="VOTRE_SLOT_ID_ICI"  // Remplacez par l'ID du Slot 3
  format="rectangle"
  responsive={true}
/>
```

---

## 🚀 Utilisation

### Pour les utilisateurs

#### Compte gratuit
- Voit les publicités sur les pages principales
- Peut passer à Premium pour supprimer les publicités

#### Compte Premium
- Aucune publicité
- Expérience sans interruption
- Plusieurs tiers disponibles (Basic, Pro, Elite)

### Pour les créateurs

#### Accéder aux campagnes

1. Connectez-vous à votre compte créateur
2. Allez dans le menu utilisateur
3. Cliquez sur "Campagnes publicitaires"

#### Créer une campagne

1. Cliquez sur "Créer une campagne"
2. Remplissez le formulaire :
   - **Nom** : Nom descriptif de la campagne
   - **Vidéo à promouvoir** : Sélectionnez parmi vos vidéos
   - **Budget total** : Montant total à dépenser (min. $10)
   - **Budget journalier** : Limite par jour
   - **Dates** : Début et fin (optionnelle)

3. Cliquez sur "Créer la campagne"
4. La campagne est créée en mode "draft"
5. Activez-la pour commencer à diffuser

#### Gérer les campagnes

Actions disponibles :
- **▶️ Reprendre** : Activer une campagne en pause
- **⏸️ Pause** : Mettre en pause temporairement
- **✏️ Modifier** : Éditer les paramètres
- **🗑️ Supprimer** : Supprimer définitivement

#### Statistiques

Métriques disponibles :
- **Impressions** : Nombre de fois affichée
- **Clics** : Nombre de clics reçus
- **CTR** : Taux de clic (%)
- **Conversions** : Actions complétées
- **Budget dépensé** : Montant utilisé
- **Budget restant** : Montant disponible

---

## 💰 Tarification

### Abonnement Premium (sans pub)

| Tier | Prix/mois | Avantages |
|------|-----------|-----------|
| **Basic** | $9.99 | Sans publicité |
| **Pro** | $19.99 | Sans pub + outils créateur avancés |
| **Elite** | $49.99 | Sans pub + tout débloquer |

### Campagnes publicitaires

**Coûts par défaut :**
- **CPC (Cost Per Click)** : $0.50
- **CPM (Cost Per 1000 impressions)** : $10.00

**Budget minimum :**
- Budget total : $10
- Budget journalier : $1

---

## 🏗️ Architecture Technique

### Tables de base de données

#### `premium_subscriptions`
Gère les abonnements premium (sans publicité)
```sql
- user_id (uuid)
- tier (basic/pro/elite)
- status (active/cancelled/expired)
- started_at, expires_at
```

#### `ad_campaigns`
Campagnes publicitaires des créateurs
```sql
- creator_id (uuid)
- campaign_name (text)
- budget_total, budget_spent (numeric)
- total_impressions, total_clicks (integer)
- status (draft/active/paused/completed)
```

#### `ad_impressions`
Suivi détaillé des impressions
```sql
- campaign_id (uuid)
- viewer_id (uuid)
- clicked (boolean)
- impression_time, click_time (timestamptz)
```

### Composants React

#### `AdUnit.tsx`
Composant intelligent qui :
- Vérifie le statut premium
- Charge Google AdSense si nécessaire
- Affiche l'unité publicitaire
- Enregistre les impressions

#### `AdCampaignPage.tsx`
Interface complète de gestion des campagnes :
- Tableau de bord analytique
- Liste des campagnes
- Création/édition/suppression
- Statistiques en temps réel

### Services

#### `adCampaignService.ts`
API complète pour :
- CRUD des campagnes
- Gestion du statut premium
- Enregistrement des impressions/clics
- Récupération des statistiques

### Fonctions RPC Supabase

#### `check_user_premium(p_user_id)`
Vérifie et met en cache le statut premium d'un utilisateur

#### `record_ad_impression(...)`
Enregistre une impression publicitaire et met à jour les stats de la campagne

#### `record_ad_click(p_impression_id)`
Enregistre un clic et calcule le CTR

#### `get_active_campaigns_for_universe(...)`
Récupère les campagnes actives ciblant un univers spécifique

---

## 🔒 Sécurité et Conformité

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS strictes :

**premium_subscriptions**
- Les utilisateurs ne peuvent voir que leur propre abonnement
- Pas d'accès aux abonnements des autres

**ad_campaigns**
- Les créateurs ne peuvent gérer que leurs propres campagnes
- Pas d'accès aux campagnes des autres créateurs

**ad_impressions**
- Lecture limitée aux propriétaires de campagnes
- Écriture publique (pour tracking)

### GDPR / CCPA

Pour la conformité :

1. **Consentement des cookies**
   - Ajoutez un bandeau de consentement
   - Utilisez une bibliothèque comme `react-cookie-consent`

2. **Politique de confidentialité**
   - Mentionnez l'utilisation de Google AdSense
   - Expliquez le tracking des publicités
   - Déjà inclus dans `/privacy`

3. **Opt-out**
   - Les utilisateurs premium sont automatiquement opt-out
   - Option de désactivation du tracking dans les paramètres

---

## 📊 Optimisation

### Performance

1. **Cache du statut premium**
   - Le statut est mis en cache dans le profil
   - Vérification périodique (toutes les heures)
   - Réduit les requêtes à la base de données

2. **Chargement asynchrone**
   - Le script AdSense est chargé de manière asynchrone
   - N'impacte pas le temps de chargement initial
   - Progressive enhancement

3. **Indexes optimisés**
   - Indexes sur les tables de campagnes
   - Requêtes rapides même avec beaucoup de données

### Stratégie d'affichage

**Placement des publicités :**
- ✅ HomePage : Entre le contenu (non intrusif)
- ✅ VideoPlayerPage : Au-dessus du player et dans les commentaires
- ❌ Pas de popups ou interstitiels (mauvaise UX)

**Densité publicitaire :**
- Maximum 3 unités par page
- Espacement visuel suffisant
- Respect des guidelines AdSense

---

## 🧪 Tests

### Tester les publicités

#### Mode Test AdSense

Google AdSense a un mode test automatique pour les nouveaux sites. Les vraies publicités n'apparaîtront qu'après approbation.

#### Tester le statut premium

1. Créez un utilisateur de test
2. Insérez un abonnement premium dans la base de données :

```sql
INSERT INTO premium_subscriptions (user_id, tier, status, started_at, expires_at)
VALUES (
  'USER_ID_ICI',
  'basic',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days'
);
```

3. Rafraîchissez la page
4. Les publicités ne doivent pas apparaître

#### Tester une campagne

1. Créez un compte créateur
2. Uploadez une vidéo
3. Créez une campagne avec un budget de $10
4. Activez la campagne
5. Vérifiez dans `ad_impressions` que les impressions sont enregistrées

---

## 🐛 Dépannage

### Les publicités ne s'affichent pas

**Solutions :**

1. Vérifiez que `VITE_GOOGLE_ADSENSE_CLIENT` est défini
2. Vérifiez que les slot IDs sont corrects
3. Attendez l'approbation AdSense
4. Vérifiez la console du navigateur pour les erreurs
5. Désactivez les bloqueurs de publicité

### Erreur "RLS policy violation"

**Solutions :**

1. Vérifiez que toutes les migrations sont appliquées
2. Vérifiez que l'utilisateur est authentifié
3. Consultez les logs Supabase

### Campagne ne diffuse pas

**Vérifications :**

1. Statut de la campagne : doit être "active"
2. Budget restant : doit être > 0
3. Dates : `start_date` ≤ maintenant ≤ `end_date`
4. Budget journalier : non épuisé

---

## 📚 Ressources

### Documentation officielle

- [Google AdSense Help](https://support.google.com/adsense)
- [AdSense Policies](https://support.google.com/adsense/answer/48182)
- [Supabase RLS](https://supabase.com/docs/guides/auth/row-level-security)

### Support Goroti

- Email : support@goroti.com
- Page support : `/support` dans l'application

---

## 🎉 Félicitations !

Vous avez maintenant un système complet de publicités avec :

- ✅ Google AdSense intégré
- ✅ Comptes premium sans pub
- ✅ Campagnes publicitaires pour créateurs
- ✅ Système de tracking et analytics
- ✅ Sécurité et conformité

**Prochaines étapes :**

1. Finalisez votre compte AdSense
2. Configurez vos unités publicitaires
3. Testez le système
4. Lancez votre première campagne !

---

*Dernière mise à jour : Février 2026*
