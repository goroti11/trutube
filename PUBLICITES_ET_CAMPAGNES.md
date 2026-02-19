# 🎯 Système de Publicités et Campagnes - Goroti

## ✅ Implémentation Complète

Intégration stratégique de Google Ads avec système de campagnes publicitaires pour créateurs.

---

## 🎨 Fonctionnalités Implémentées

### 1. **Publicités pour Comptes Gratuits**

Les utilisateurs gratuits voient des publicités Google AdSense placées stratégiquement :

- **Page d'accueil** : Bannière horizontale après la grille des univers
- **Page vidéo** :
  - Bannière au-dessus du player
  - Rectangle dans la section commentaires

**Caractéristiques :**
- Chargement asynchrone (n'impacte pas les performances)
- Design responsive
- Enregistrement automatique des impressions

### 2. **Sans Publicité pour Comptes Premium**

Les utilisateurs premium bénéficient d'une expérience sans publicité :

- Vérification automatique du statut premium
- Cache du statut pour optimiser les performances
- 3 tiers disponibles : Basic ($9.99), Pro ($19.99), Elite ($49.99)

### 3. **Campagnes Publicitaires pour Créateurs**

Interface complète pour gérer les campagnes de promotion :

**Tableau de bord analytique :**
- Budget total dépensé
- Impressions totales
- Clics totaux
- CTR moyen

**Gestion des campagnes :**
- Créer des campagnes avec budget personnalisé
- Mettre en pause / Reprendre
- Modifier les paramètres
- Supprimer les campagnes
- Voir les statistiques détaillées

---

## 📂 Fichiers Créés

### Base de Données

| Fichier | Description |
|---------|-------------|
| `supabase/migrations/add_google_ads_system.sql` | Migration complète pour le système de publicités |

**Tables créées :**
- `premium_subscriptions` - Abonnements premium
- `ad_campaigns` - Campagnes publicitaires
- `ad_impressions` - Suivi des impressions

**Fonctions RPC :**
- `check_user_premium()` - Vérifier le statut premium
- `record_ad_impression()` - Enregistrer une impression
- `record_ad_click()` - Enregistrer un clic
- `get_active_campaigns_for_universe()` - Récupérer les campagnes actives

### Composants React

| Fichier | Description |
|---------|-------------|
| `src/components/AdUnit.tsx` | Composant intelligent pour afficher les publicités Google Ads |

### Pages

| Fichier | Description |
|---------|-------------|
| `src/pages/AdCampaignPage.tsx` | Interface complète de gestion des campagnes publicitaires |

### Services

| Fichier | Description |
|---------|-------------|
| `src/services/adCampaignService.ts` | API complète pour gérer les campagnes et le statut premium |

### Documentation

| Fichier | Description |
|---------|-------------|
| `GOOGLE_ADS_INTEGRATION.md` | Guide complet d'intégration Google Ads |
| `PUBLICITES_ET_CAMPAGNES.md` | Ce fichier (résumé) |
| `.env.example` | Template des variables d'environnement |

### Modifications

| Fichier | Changements |
|---------|------------|
| `src/App.tsx` | Ajout de la route `/ad-campaign` |
| `src/pages/HomePage.tsx` | Intégration de l'unité publicitaire |
| `src/pages/VideoPlayerPage.tsx` | Intégration de 2 unités publicitaires |
| `.env` | Ajout de `VITE_GOOGLE_ADSENSE_CLIENT` |

---

## 🚀 Démarrage Rapide

### Étape 1 : Appliquer la Migration

Dans Supabase SQL Editor, exécutez la migration `add_google_ads_system.sql`

### Étape 2 : Configurer Google AdSense

1. Créez un compte sur [Google AdSense](https://www.google.com/adsense)
2. Obtenez votre Publisher ID (format: `ca-pub-XXXXXXXXXXXXXXXX`)
3. Créez 3 unités publicitaires et notez leurs IDs

### Étape 3 : Configurer l'Application

Éditez le fichier `.env` :

```env
VITE_GOOGLE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

### Étape 4 : Mettre à Jour les Slots

Dans les fichiers suivants, remplacez les IDs de slots par vos vrais IDs :

- `src/pages/HomePage.tsx` (ligne ~88)
- `src/pages/VideoPlayerPage.tsx` (lignes ~25 et ~77)

### Étape 5 : Redémarrer l'Application

```bash
npm run dev
```

---

## 🎯 Utilisation

### Pour les Utilisateurs

#### Compte Gratuit
1. Parcourez l'application normalement
2. Vous verrez des publicités sur les pages principales
3. Passez à Premium pour une expérience sans pub

#### Compte Premium
1. Souscrivez à un abonnement Premium
2. Les publicités disparaissent automatiquement
3. Profitez d'une expérience sans interruption

### Pour les Créateurs

#### Accéder aux Campagnes
1. Cliquez sur votre avatar (en haut à droite)
2. Sélectionnez "Campagnes publicitaires"

#### Créer une Campagne
1. Cliquez sur "Créer une campagne"
2. Remplissez le formulaire :
   - Nom de la campagne
   - Vidéo à promouvoir
   - Budget total et journalier
   - Dates de début et fin
3. Cliquez sur "Créer la campagne"
4. Activez la campagne pour commencer

#### Voir les Statistiques
- **Impressions** : Nombre de fois affichée
- **Clics** : Nombre de clics reçus
- **CTR** : Taux de clic (%)
- **Budget** : Dépensé vs Restant

---

## 💰 Modèle de Revenus

### Abonnements Premium

| Tier | Prix/mois | Caractéristiques |
|------|-----------|------------------|
| Basic | $9.99 | Sans publicité |
| Pro | $19.99 | Sans pub + outils créateur |
| Elite | $49.99 | Sans pub + tout débloquer |

### Publicités

**Google AdSense :**
- 70% des revenus vont à Goroti
- 30% vont au créateur du contenu (optionnel)

**Campagnes créateurs :**
- CPC : $0.50 par clic
- CPM : $10 pour 1000 impressions
- Budget minimum : $10

---

## 🔒 Sécurité

### Row Level Security (RLS)

Toutes les tables ont des politiques RLS strictes :

✅ **premium_subscriptions**
- Les utilisateurs voient uniquement leur abonnement
- Pas d'accès aux abonnements des autres

✅ **ad_campaigns**
- Les créateurs gèrent uniquement leurs campagnes
- Isolation complète entre créateurs

✅ **ad_impressions**
- Lecture limitée aux propriétaires de campagnes
- Écriture publique pour le tracking

### Protection des Données

- Aucune donnée sensible exposée côté client
- Service role key jamais utilisée dans le frontend
- Toutes les opérations passent par les fonctions RPC

---

## 📊 Statistiques et Analytics

### Métriques Disponibles

**Par campagne :**
- Impressions totales
- Clics totaux
- Conversions
- CTR (Click-Through Rate)
- Taux de conversion
- Budget dépensé vs restant

**Globales :**
- Total des impressions
- Total des clics
- CTR moyen
- Budget total dépensé

### Optimisation

**Performance :**
- Cache du statut premium (réduit les requêtes)
- Indexes optimisés sur toutes les tables
- Chargement asynchrone des scripts

**UX :**
- Placement non intrusif
- Design responsive
- Chargement progressif

---

## 🐛 Résolution de Problèmes

### Les publicités ne s'affichent pas

1. Vérifiez `VITE_GOOGLE_ADSENSE_CLIENT` dans `.env`
2. Vérifiez que les slot IDs sont corrects
3. Attendez l'approbation AdSense (24-48h)
4. Désactivez les bloqueurs de publicité
5. Consultez la console du navigateur

### Erreur lors de la création de campagne

1. Vérifiez que l'utilisateur est un créateur
2. Vérifiez qu'au moins une vidéo existe
3. Vérifiez le budget minimum ($10)
4. Consultez les logs Supabase

### Campagne ne diffuse pas

1. Statut doit être "active"
2. Budget restant > 0
3. Date de début ≤ maintenant ≤ date de fin
4. Budget journalier non épuisé

---

## 📚 Documentation Complète

Pour plus de détails, consultez :

- **GOOGLE_ADS_INTEGRATION.md** - Guide complet d'intégration
- **DATABASE_INTEGRATION.md** - Architecture de la base de données
- **QUICK_START.md** - Guide de démarrage rapide

---

## 🎉 Résumé

### Ce qui a été implémenté :

✅ Migration de base de données complète (3 tables + 4 fonctions RPC)
✅ Composant AdUnit intelligent et responsive
✅ Service complet de gestion des campagnes
✅ Interface utilisateur de gestion des campagnes
✅ Intégration sur HomePage et VideoPlayerPage
✅ Système de vérification du statut premium
✅ Tracking des impressions et clics
✅ Analytics en temps réel
✅ Documentation complète
✅ Build validé et fonctionnel

### Prochaines étapes :

1. Créer un compte Google AdSense
2. Configurer les unités publicitaires
3. Mettre à jour les IDs dans le code
4. Tester le système
5. Lancer la première campagne !

---

**Questions ? Consultez `GOOGLE_ADS_INTEGRATION.md` ou contactez support@goroti.com**

*Dernière mise à jour : Février 2026*
