# Nouvelles Fonctionnalités Goroti

## Vue d'ensemble
Ce document décrit toutes les nouvelles fonctionnalités ajoutées à Goroti, incluant les pages de paramètres, support, CGU, et plus encore.

---

## 1. Page de Paramètres Avancés (`/settings`)

### Fonctionnalités
- **Gestion des notifications**
  - Notifications par email
  - Notifications push
  - Emails marketing

- **Paramètres de confidentialité**
  - Profil public/privé
  - Affichage de l'activité
  - Contrôle de la visibilité

- **Apparence**
  - Thème clair
  - Thème sombre
  - Mode automatique

- **Sécurité**
  - Changement de mot de passe
  - Authentification à deux facteurs (prévu)

- **Zone de danger**
  - Suppression de compte avec confirmation
  - Avertissement clair des conséquences

### Navigation
- Accessible via le menu utilisateur > "Paramètres"
- Persistance des préférences dans Supabase

---

## 2. Page Conditions Générales d'Utilisation (`/terms`)

### Contenu
1. **Présentation du service**
   - Mission de Goroti
   - Acceptation des conditions

2. **Compte utilisateur**
   - Création et sécurité
   - Âge minimum
   - Responsabilités

3. **Contenu et modération**
   - Système anti-fausses vues
   - Modération communautaire
   - Contenu interdit
   - Propriété intellectuelle

4. **Univers et sous-univers**
   - Système d'organisation
   - Responsabilités des créateurs

5. **Responsabilités et limitations**
   - Disponibilité du service
   - Limitation de responsabilité

6. **Monétisation**
   - Système de support
   - Politique de remboursement

7. **Confidentialité et droit applicable**

### Navigation
- Accessible via le footer
- Liens croisés avec la page de support

---

## 3. Page Support et Contact (`/support`)

### Fonctionnalités
- **FAQ interactive**
  - 6 questions fréquentes
  - Réponses détaillées
  - Format déroulant

- **Formulaire de contact**
  - Catégorisation des demandes
  - Support anonyme possible
  - Stockage dans Supabase
  - Confirmation d'envoi

- **Sections d'aide**
  - Documentation
  - Tutoriels vidéo
  - Guides pour créateurs

### Catégories de support
- Problème de compte
- Contenu et modération
- Monétisation
- Problème technique
- Signaler un abus
- Autre

### Navigation
- Accessible via le footer
- Lien dans le menu principal

---

## 4. Page À Propos (`/about`)

### Sections

#### Mission et Vision
- Explication du problème résolu
- Solution proposée par Goroti
- Vision pour l'avenir

#### Valeurs fondamentales
- **Transparence totale** : Algorithmes et règles documentés
- **Équité pour tous** : Même chance pour tous les créateurs
- **Pouvoir à la communauté** : Modération décentralisée
- **Sécurité et vie privée** : Protection des données

#### Innovations clés
- **Système anti-fausses vues**
  - Analyse comportementale
  - Détection de fraude
  - Pénalisation automatique

- **Univers décentralisés**
  - Espaces thématiques autonomes
  - Règles personnalisables

- **Monétisation équitable**
  - Basée sur l'engagement réel
  - Transparence des revenus

### Call-to-Action
- Rejoindre Goroti
- Devenir créateur
- Contacter le support

---

## 5. Page Politique de Confidentialité (`/privacy`)

### Contenu détaillé

#### Données collectées
- Informations fournies par l'utilisateur
- Données collectées automatiquement
- Métriques de détection de fraude

#### Utilisation des données
- Amélioration du service
- Personnalisation
- Détection de fraude
- Communication

#### Partage des données
- **Principe : Nous ne vendons JAMAIS vos données**
- Cas de partage limités
- Protection contractuelle

#### Sécurité
- Chiffrement TLS/HTTPS
- Hashing des mots de passe
- Authentification 2FA
- Audits réguliers

#### Droits des utilisateurs (RGPD)
- Droit d'accès
- Droit de rectification
- Droit à l'oubli
- Portabilité des données
- Opposition au traitement

---

## 6. Composant Footer

### Structure
Divisé en 4 colonnes :

#### Colonne 1 : Branding
- Logo Goroti
- Slogan
- Liens réseaux sociaux

#### Colonne 2 : Plateforme
- Accueil
- Explorer les univers
- Devenir créateur
- Préférences de feed

#### Colonne 3 : Ressources
- À propos
- Support & FAQ
- CGU
- Politique de confidentialité

#### Colonne 4 : Contact
- Email support
- Email créateurs
- Newsletter

### Bas de page
- Copyright
- Liens rapides
- Conformité légale

---

## 7. Améliorations de Navigation

### Menu utilisateur mis à jour
- Mon profil
- Dashboard créateur
- **Paramètres** (nouveau)
- Préférences de feed
- Se déconnecter

### Redirections intelligentes
- Navigation fluide entre toutes les pages
- État préservé lors des changements de page
- Breadcrumbs contextuels

---

## 8. Base de données

### Nouvelles tables

#### `user_settings`
```sql
- id (uuid)
- user_id (uuid, FK)
- email_notifications (boolean)
- push_notifications (boolean)
- marketing_emails (boolean)
- privacy_public_profile (boolean)
- privacy_show_activity (boolean)
- theme (text: 'light' | 'dark' | 'auto')
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### `support_tickets`
```sql
- id (uuid)
- user_id (uuid, nullable FK)
- email (text)
- category (text)
- subject (text)
- message (text)
- status (text: 'open' | 'in_progress' | 'resolved' | 'closed')
- created_at (timestamptz)
- updated_at (timestamptz)
```

### Sécurité RLS
- Politiques restrictives par défaut
- Accès utilisateur limité à ses propres données
- Support anonyme autorisé

---

## 9. Design et UX

### Cohérence visuelle
- Palette de couleurs cyan/cyan (pas de violet!)
- Dark mode par défaut
- Transitions fluides
- Feedback utilisateur constant

### Composants réutilisables
- En-têtes avec icônes
- Cartes d'information
- Formulaires stylisés
- Boutons avec états de chargement

### Accessibilité
- Contrastes WCAG conformes
- Navigation au clavier
- Feedback visuel clair
- Messages d'erreur explicites

---

## 10. Fonctionnalités futures planifiées

### Court terme
- Système de tickets avancé avec chat
- Base de connaissances complète
- Tutoriels vidéo intégrés

### Moyen terme
- Centre de notifications
- Gestion des abonnements
- Historique des transactions

### Long terme
- API publique
- Programme de partenariat
- Marketplace de plugins

---

## Navigation complète du site

### Pages publiques
- `/` - Accueil
- `/auth` - Authentification
- `/about` - À propos
- `/terms` - CGU
- `/privacy` - Confidentialité
- `/support` - Support

### Pages utilisateur authentifié
- `/my-profile` - Mon profil
- `/settings` - Paramètres
- `/preferences` - Préférences de feed
- `/dashboard` - Dashboard créateur

### Pages de contenu
- `/universes` - Explorer les univers
- `/universe/:id` - Vue d'un univers
- `/video/:id` - Lecteur vidéo
- `/profile/:id` - Profil public

---

## Résumé technique

### Technologies utilisées
- React 18
- TypeScript
- Tailwind CSS
- Supabase (Auth + Database)
- Vite

### Architecture
- Composants modulaires
- Context API pour l'authentification
- Row Level Security (RLS)
- Migrations versionnées

### Performance
- Lazy loading des pages
- Optimisation des images
- Mise en cache intelligente
- Bundle optimisé

---

## Contact et support

Pour toute question sur ces fonctionnalités :
- Page de support : `/support`
- Email : support@goroti.com
- Documentation : Section FAQ
