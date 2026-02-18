# TruTube Communauté - Système Social Structuré

## Vision

**TruTube Communauté** est un espace social structuré par univers, permettant de créer de vraies relations créateur ↔ fan et fan ↔ fan. Ce n'est pas juste des commentaires sous vidéos, c'est un véritable écosystème social intégré.

## Positionnement

- **TruTube** = Diffusion vidéo
- **TruTube Studio** = Gestion créateur
- **TruTube Communauté** = Interaction sociale structurée

C'est l'espace vivant de la plateforme.

## Architecture

### Types d'espaces communautaires

#### A) Communauté Univers
**Accessible à tous**

Contenu :
- Discussions thématiques
- Débats
- Sondages
- Recommandations

Exemple :
- **Music → Afrobeat → Communauté Afrobeat**
- **Sport → Football → Communauté Football**

#### B) Communauté Créateur
**Attachée à une chaîne**

Fonctions :
- Posts exclusifs
- Discussions directes
- Annonces
- Lives privés
- Q&A avec le créateur

#### C) Communauté Premium
**Réservée aux abonnés payants**

Avantages :
- Chat privé
- Accès anticipé aux contenus
- Votes décisionnels
- Événements exclusifs
- Badge premium visible

## Types de publications

Dans TruTube Communauté, on peut publier :

### 1. Texte
Post classique avec formatage Markdown

### 2. Image
Image + légende + discussion

### 3. Mini-vidéo
Courte vidéo (< 2min) directement dans la communauté

### 4. Sondage
Question avec options multiples
- Votes anonymes ou publics
- Date de clôture
- Résultats en temps réel

### 5. Thread
Discussion structurée en fil

### 6. Question-Réponse (Q&A)
Format question avec réponses votées
- Meilleure réponse mise en avant
- Système de vote communautaire

## Système de réputation

### Score d'engagement
Chaque membre possède un score basé sur :
- **Posts de qualité** : +5 points
- **Commentaires utiles** : +2 points
- **Réactions reçues** : +1 point par réaction
- **Marqué comme "utile"** : +10 points
- **Signalements validés contre lui** : -20 points

### Niveaux de réputation
- **Niveau 0** : Nouveau (0-99 points)
- **Niveau 1** : Actif (100-499)
- **Niveau 2** : Contributeur (500-999)
- **Niveau 3** : Expert (1000-2499)
- **Niveau 4** : Légende (2500+)

### Badges
Types de badges disponibles :

| Badge | Catégorie | Condition |
|-------|-----------|-----------|
| Fondateur | founder | Membre des premiers 1000 |
| Créateur Vérifié | creator | KYC complet + créateur actif |
| Expert Communauté | expert | Réputation 1000+ |
| Modérateur | moderator | Élu par la communauté |
| Top Contributeur | contributor | 100+ posts utiles |

### Historique comportement
- Tous les signalements visibles
- Toutes les sanctions visibles
- Transparence totale

## Système de modération intelligente

### Niveau 1 : IA préventive
Détection automatique :
- Harcèlement
- Spam
- Bots
- Discours haineux
- Liens malveillants

Action : **Masquage automatique + révision humaine**

### Niveau 2 : Score réputation
Utilisateurs avec réputation < 0 :
- Posts en attente de validation
- Limite de publications (1/jour)
- Pas de messages privés

### Niveau 3 : Modération communautaire
Utilisateurs avec réputation 500+ peuvent :
- Signaler contenu
- Voter sur signalements
- Masquer temporairement (révision obligatoire)

### Niveau 4 : Staff TruTube
Décision finale avec :
- Justification écrite obligatoire
- Preuve du contenu violé
- Droit d'appel garanti
- Historique visible

### Actions possibles
1. **Avertissement** : Notification + point de vigilance
2. **Mute temporaire** : 24h / 7j / 30j sans pouvoir poster
3. **Suppression contenu** : Post/commentaire retiré
4. **Ban temporaire** : Exclusion 7j / 30j / 90j
5. **Ban permanent** : Exclusion définitive (seulement cas extrêmes)

## TruCoin - Monnaie interne

### Fonctionnement
- **1 TruCoin = 1€** (taux fixe)
- Packs avec réduction :
  - 10 TruCoins = 10€
  - 50 TruCoins = 47.50€ (-5%)
  - 100 TruCoins = 90€ (-10%)
  - 500 TruCoins = 425€ (-15%)

### Utilisations
1. **Tips** : Envoyer directement à un créateur
2. **Abonnements communautés** : Accès premium mensuel
3. **Super Badges** : Badges payants visibles
4. **Votes premium** : Poids de vote augmenté
5. **Événements privés** : Participation à événements exclusifs
6. **Mise en avant** : Post en avant temporairement

### Gains possibles
- **Récompenses qualité** : +10 TruCoins pour post marqué "excellent"
- **Top contributeur mensuel** : +50 TruCoins
- **Modération aidante** : +5 TruCoins par signalement validé
- **Événements** : Gains lors de concours

### Sécurité
- Pas de cash-out direct (évite blanchiment)
- Valeur stockée sur compte interne
- Traçabilité complète des transactions
- Protection anti-fraude

## Système de gouvernance

### Votes communautaires
Chaque communauté peut organiser des votes sur :
- **Règles spécifiques** : Ajout/modification de règles
- **Élection modérateurs** : Vote pour désigner des modérateurs
- **Thèmes/événements** : Choix de sujets à mettre en avant
- **Fonctionnalités** : Demandes de nouvelles fonctionnalités

### Mécanisme de vote
- **Vote pondéré** : Plus de réputation = plus de poids (max x3)
- **Quorum requis** : 5% des membres minimum
- **Durée** : 7 jours par défaut
- **Transparence** : Résultats publics en temps réel

### Propositions
N'importe quel membre (réputation 100+) peut proposer :
1. Créer une proposition
2. Description détaillée
3. Options de vote
4. Durée du vote

Validation automatique si :
- Quorum atteint
- Majorité 2/3 pour changements majeurs
- Majorité simple (51%) pour changements mineurs

## Monétisation communauté

### A) Abonnements Premium
Créateurs peuvent créer communautés payantes :
- **4.99€/mois** : Silver
- **9.99€/mois** : Gold
- **19.99€/mois** : VIP

**Partage** : 80% créateur / 20% plateforme

### B) Super Badges
Badges payants visibles (5-20 TruCoins) :
- Badge "Supporter #1"
- Badge "VIP Fondateur"
- Badge personnalisé

**Partage** : 90% créateur / 10% plateforme

### C) Événements privés payants
- AMA exclusifs (10-50 TruCoins)
- Lives privés (20-100 TruCoins)
- Masterclass (50-200 TruCoins)

**Partage** : 85% créateur / 15% plateforme

### D) Sponsoring communauté
Marques peuvent sponsoriser une communauté entière :
- Bannière discrète
- Post sponsorisé mensuel (max 1)
- Mention dans description

**Objectif** : Monétisation sans envahir l'espace

### E) Marketplace intégrée
Services proposés directement dans communauté :
- Consultation 1-to-1
- Révision de contenu
- Coaching

**Partage** : 85% prestataire / 15% plateforme

## Système anti-toxicité avancé

### Détection préventive (IA)
- Analyse sentiment en temps réel
- Détection patterns toxiques
- Blocage proactif spam/bots

### Score toxicité
Chaque utilisateur a un score interne :
- **Signalements reçus** : +10 toxicité
- **Signalements validés** : +50 toxicité
- **Posts supprimés** : +20 toxicité
- **Comportement positif** : -5 toxicité/semaine

**Seuil de vigilance** : 100 points = surveillance accrue
**Seuil de ban** : 300 points = ban automatique temporaire

### Transparence sanctions
Profil utilisateur affiche :
- Nombre de signalements reçus
- Nombre de sanctions
- Type de sanctions (avec date)
- Statut actuel (bon standing, vigilance, banni)

## Expérience UX

### Page Communauté Univers

**En-tête** :
- Nom univers
- Nombre de membres
- Bouton "Rejoindre" / "Quitté"
- Badges des top contributeurs

**Onglets** :
- **Feed** : Fil d'actualité
- **Top** : Posts les plus engageants
- **Récent** : Chronologique
- **Sondages** : Sondages actifs
- **Événements** : Événements à venir

**Sous chaque post** :
- Réactions (like, love, insightful, helpful, funny)
- Commenter
- Partager
- Soutenir (TruCoin)
- Signaler

### Page Créateur

**Sections** :
- **Mur public** : Annonces visibles par tous
- **Mur membres** : Posts réservés abonnés
- **Mur premium** : Posts réservés VIP
- **Sondages** : Votes décisionnels
- **Lives** : Programmation et replays
- **Événements** : Calendrier événements

**Notifications intelligentes** :
- Seulement univers suivis
- Fréquence configurable
- Digest quotidien/hebdomadaire
- Notifications en temps réel pour mentions

## Identité numérique TruTube

### Profil structuré

Chaque utilisateur a :

1. **Identité de base**
   - Pseudo
   - Avatar
   - Bio
   - Localisation (optionnelle)

2. **Identité vérifiée** (optionnelle mais valorisée)
   - Badge "Identité vérifiée"
   - KYC complet
   - Boost de réputation de départ

3. **Univers principaux**
   - 3 univers affichés en priorité
   - Sous-univers dominants

4. **Scores visibles**
   - Réputation globale
   - Score authenticité (si créateur)
   - Niveau communauté

5. **Badges**
   - Jusqu'à 5 badges affichés
   - Tous les badges dans profil complet

6. **Historique contributions**
   - Nombre de posts
   - Nombre de commentaires
   - Réactions reçues
   - Marques "utile" reçues

### Niveaux d'identité

| Niveau | Nom | Conditions | Avantages |
|--------|-----|------------|-----------|
| 0 | Visiteur | Aucune | Lecture seule |
| 1 | Membre | Email vérifié | Peut poster (limité) |
| 2 | Vérifié | Email + téléphone | Pas de limite posts |
| 3 | Certifié | KYC complet | Badge vérifié + boost réput |
| 4 | Créateur | Chaîne active | Accès Studio + communauté |

## Programme Ambassadeurs

### Objectif
Créer un noyau solide avant expansion massive

### Cible
Premiers créateurs majeurs (500-50k abonnés ailleurs)

### Avantages ambassadeurs
1. **Badge "Fondateur"** permanent et prestigieux
2. **Partage pub amélioré** : 70% au lieu de 65% (temporaire 12 mois)
3. **Mise en avant prioritaire** : Homepage + recommandations
4. **Accès bêta** : Nouvelles fonctionnalités en avant-première
5. **Support VIP** : Ligne directe + account manager
6. **Événements exclusifs** : Rencontres TruTube team
7. **Revenue garanti** : 500€/mois garanti 6 premiers mois

### Conditions
1. **Engagement minimum** : 1 vidéo/semaine pendant 6 mois
2. **Respect strict règles** : Zéro tolérance violations
3. **Contribution croissance** : Parrainage autres créateurs
4. **Feedback actif** : Participation développement plateforme

### Sélection
- **100 ambassadeurs maximum** pour phase 1
- Sélection manuelle par TruTube team
- Diversité univers (Music, Game, Know, etc.)
- Mix tailles (500, 5k, 50k abonnés)

## Différenciation vs concurrents

### vs YouTube Comments
| Critère | YouTube | TruTube Communauté |
|---------|---------|-------------------|
| Format | Commentaires sous vidéo | Espace social structuré |
| Organisation | Chronologique/Top | Par univers/thèmes |
| Modération | Automatique opaque | Transparente multi-niveaux |
| Monétisation | Aucune pour commentaires | Tips, badges, premium |
| Gouvernance | Aucune | Vote communautaire |

### vs Reddit
| Critère | Reddit | TruTube Communauté |
|---------|--------|-------------------|
| Lien vidéo | Externe | Intégré natif |
| Créateurs | Anonymes souvent | Identité créateur forte |
| Monétisation | Awards | TruCoin + multiples |
| Modération | Bénévole complexe | IA + communautaire + staff |
| Vidéo | Pas prioritaire | Cœur de l'écosystème |

### vs Discord
| Critère | Discord | TruTube Communauté |
|---------|---------|-------------------|
| Découverte | Difficile | Algorithme natif |
| Temporalité | Temps réel uniquement | Permanent + temps réel |
| Vidéo | Externe | Intégré |
| Monétisation | Limitée | Multiple + transparente |
| Structure | Serveurs privés | Univers publics + privés |

## Stratégie de lancement

### Phase 1 : Beta Privée (3 mois)
- **100 créateurs** ambassadeurs
- **10,000 utilisateurs** invités
- **5 univers** prioritaires (Music, Game, Know, Sport, Life)
- Feedback intensif
- Itération rapide

### Phase 2 : Beta Publique (6 mois)
- **1,000 créateurs**
- **100,000 utilisateurs**
- **Tous univers** ouverts
- Monétisation activée
- Programme ambassadeurs étendu

### Phase 3 : Lancement Public
- Ouverture totale
- Marketing agressif
- Partenariats marques
- Expansion internationale

## KPIs à suivre

### Engagement
- DAU/MAU (Daily/Monthly Active Users)
- Temps passé moyen/session
- Nombre posts/jour
- Nombre commentaires/jour
- Taux de réponse créateurs

### Qualité
- Score toxicité moyen
- % posts signalés
- % signalements valides
- Taux de ban
- Satisfaction utilisateurs (NPS)

### Monétisation
- ARPU (Average Revenue Per User)
- % utilisateurs TruCoin
- Volume transactions TruCoin/mois
- % communautés premium actives
- Churn rate abonnements

### Croissance
- Nouvelles communautés/mois
- Nouveaux membres/mois
- Taux rétention M1, M3, M6
- Viralité (K-factor)

## Implémentation technique

### Stack
- **Frontend** : React + TypeScript + Tailwind
- **Backend** : Supabase (PostgreSQL + Auth + Storage)
- **Temps réel** : Supabase Realtime (WebSocket)
- **Modération IA** : OpenAI Moderation API
- **CDN** : Cloudflare

### Tables principales
1. **communities** : Communautés
2. **community_members** : Membres
3. **community_posts** : Publications
4. **post_comments** : Commentaires
5. **post_reactions** : Réactions
6. **polls** : Sondages
7. **user_reputation** : Réputation
8. **badge_types** : Types de badges
9. **user_badges** : Badges utilisateurs
10. **trucoin_wallets** : Portefeuilles
11. **trucoin_transactions** : Transactions
12. **content_reports** : Signalements
13. **moderation_actions** : Actions modération
14. **governance_proposals** : Propositions
15. **community_votes** : Votes

### Services créés
- **communityService** : Gestion communautés, posts, commentaires
- **trucoinService** : Gestion portefeuille et transactions
- **reputationService** : Gestion réputation et badges

## Roadmap fonctionnalités

### V1 (MVP) - Trimestre 1
- ✅ Communautés univers
- ✅ Posts texte/image
- ✅ Commentaires
- ✅ Réactions
- ✅ Système réputation de base
- ✅ TruCoin wallet

### V2 - Trimestre 2
- Communautés créateurs
- Sondages interactifs
- Badges et gamification
- Modération communautaire
- Messages privés

### V3 - Trimestre 3
- Communautés premium
- Événements privés
- Gouvernance votes
- Mini-vidéos natives
- Marketplace services

### V4 - Trimestre 4
- Sponsoring communauté
- Analytics créateurs avancées
- API publique
- Widgets intégrables
- App mobile native

## Conclusion

TruTube Communauté transforme TruTube d'une simple plateforme vidéo en un véritable écosystème social. Ce n'est pas un ajout, c'est un pilier fondamental qui :

1. **Fidélise** les créateurs et audiences
2. **Monétise** au-delà de la publicité
3. **Différencie** radicalement vs YouTube
4. **Crée de la valeur** pour tous les acteurs
5. **Construit une communauté** engagée long terme

**Message clé** : TruTube = Vidéo + Social + Transparence + Monétisation équitable

C'est une vision à 360° de la création de contenu moderne.
