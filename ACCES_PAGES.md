# Guide d'Accès aux Pages Goroti

Ce guide vous montre comment accéder à TOUTES les pages de la plateforme Goroti.

## Navigation principale

### Depuis le Header (en haut)

Le menu "..." (3 points verticaux) en haut à droite contient:
- À propos
- Ressources
- **Carrières** → Page des offres d'emploi
- **Entreprise** → Page entreprise avec solutions B2B
- Centre d'aide
- Support

### Depuis le Footer (en bas)

Le footer contient 4 colonnes:

**Colonne 1: Plateforme**
- Accueil
- Explorer les univers
- Devenir créateur
- Préférences de feed

**Colonne 2: Ressources**
- À propos
- Centre d'aide
- Support
- **Carrières** → Page des offres d'emploi
- **Entreprise** → Page entreprise
- Ressources
- Conditions d'utilisation
- Politique de confidentialité
- Mentions légales

**Colonne 3: Contact**
- support@goroti.com
- creators@goroti.com
- Newsletter

---

## Accès direct via URL

Vous pouvez accéder directement à n'importe quelle page en ajoutant `#nom-page` dans l'URL:

### Pages principales

```
https://localhost:5173/#home                  → Accueil
https://localhost:5173/#enterprise            → Page Entreprise
https://localhost:5173/#careers               → Page Carrières
https://localhost:5173/#about                 → À propos
https://localhost:5173/#help                  → Centre d'aide
https://localhost:5173/#support               → Support
https://localhost:5173/#resources             → Ressources
https://localhost:5173/#pricing               → Tarifs
```

### Pages utilisateur

```
https://localhost:5173/#auth                  → Connexion/Inscription
https://localhost:5173/#my-profile            → Mon profil
https://localhost:5173/#settings              → Paramètres
https://localhost:5173/#watch-history         → Historique
https://localhost:5173/#saved-videos          → Vidéos sauvegardées
https://localhost:5173/#subscribers           → Abonnés
```

### Pages créateur

```
https://localhost:5173/#creator-setup         → Devenir créateur
https://localhost:5173/#studio                → Studio créateur
https://localhost:5173/#dashboard             → Tableau de bord
https://localhost:5173/#upload                → Upload vidéo
https://localhost:5173/#my-channels           → Mes chaînes
https://localhost:5173/#live-streaming        → Live streaming
```

### Pages monétisation

```
https://localhost:5173/#premium               → Abonnement Premium
https://localhost:5173/#trucoin-wallet        → Portefeuille TruCoin
https://localhost:5173/#partner-program       → Programme partenaire
https://localhost:5173/#referral              → Parrainage
https://localhost:5173/#ad-campaign           → Campagnes publicitaires
```

### Pages communauté

```
https://localhost:5173/#community             → Liste des communautés
https://localhost:5173/#community/goroti      → Communauté Goroti
https://localhost:5173/#create-community      → Créer une communauté
https://localhost:5173/#official-community    → Communauté officielle
```

### Pages contenu

```
https://localhost:5173/#universes             → Explorer univers
https://localhost:5173/#preferences           → Préférences feed
https://localhost:5173/#marketplace           → Marketplace musique
https://localhost:5173/#album-sale            → Vente d'albums
```

### Pages légales

```
https://localhost:5173/#terms                 → CGU
https://localhost:5173/#privacy               → Confidentialité
https://localhost:5173/#legal                 → Mentions légales
https://localhost:5173/#copyright-policy      → Politique droits d'auteur
https://localhost:5173/#financial-terms       → Conditions financières
https://localhost:5173/#legal-profile         → Profil légal créateur
```

### Pages système

```
https://localhost:5173/#status                → Status des services
https://localhost:5173/#security-dashboard    → Tableau de bord sécurité
https://localhost:5173/#appearance-settings   → Apparence
```

---

## Navigation programmatique

Si vous voulez tester la navigation dans la console du navigateur (F12):

```javascript
// Ouvrir la page entreprise
window.location.hash = 'enterprise';

// Ouvrir la page carrières
window.location.hash = 'careers';

// Ouvrir n'importe quelle page
window.location.hash = 'nom-de-la-page';
```

---

## Liste complète des pages disponibles

Voici TOUTES les pages accessibles dans Goroti:

### Navigation & Découverte (7 pages)
1. `home` - Accueil
2. `universes` - Explorer les univers
3. `universe/{id}` - Voir un univers spécifique
4. `watch/{id}` - Regarder une vidéo
5. `preferences` - Préférences de feed
6. `profile/{username}` - Profil public utilisateur
7. `my-profile` - Mon profil

### Authentification (1 page)
8. `auth` - Connexion / Inscription

### Créateur (12 pages)
9. `creator-setup` - Devenir créateur
10. `studio` - Studio créateur v3
11. `dashboard` - Tableau de bord créateur
12. `upload` - Upload de vidéo
13. `my-channels` - Gérer mes chaînes
14. `channel-edit/{id}` - Éditer une chaîne
15. `channel-team/{id}` - Équipe d'une chaîne
16. `channel-analytics/{id}` - Analytics chaîne
17. `live-streaming` - Streaming en direct
18. `enhanced-profile` - Profil créateur enrichi
19. `subscribers` - Liste des abonnés
20. `watch-history` - Historique de visionnage

### Monétisation (11 pages)
21. `premium` - Abonnement Premium
22. `premium-offers` - Offres Premium
23. `trucoin-wallet` - Portefeuille TruCoin
24. `partner-program` - Programme partenaire
25. `referral` - Parrainage
26. `ad-campaign` - Campagnes publicitaires
27. `marketplace` - Marketplace musique
28. `album-sale` - Vente d'albums
29. `create-release` - Créer une sortie musicale
30. `revenue-model` - Modèle de revenus
31. `native-sponsoring` - Sponsoring natif

### Communauté (6 pages)
32. `community` - Liste des communautés
33. `community/{slug}` - Page communauté
34. `create-community` - Créer communauté
35. `create-post/{slug}` - Créer un post
36. `community-settings/{slug}` - Paramètres communauté
37. `official-community` - Communauté officielle
38. `community-premium-pricing` - Tarifs premium communauté

### Paramètres (4 pages)
39. `settings` - Paramètres généraux
40. `appearance-settings` - Apparence
41. `security-dashboard` - Sécurité
42. `saved-videos` - Vidéos sauvegardées

### Entreprise & Carrière (4 pages)
43. `enterprise` - **Solutions entreprise** ✨
44. `careers` - **Offres d'emploi** ✨
45. `pricing` - Tarifs
46. `resources` - Ressources

### Support & Aide (4 pages)
47. `help` - Centre d'aide
48. `support` - Support technique
49. `about` - À propos
50. `status` - Status des services

### Légal (6 pages)
51. `terms` - Conditions d'utilisation
52. `privacy` - Politique de confidentialité
53. `legal` - Mentions légales
54. `copyright-policy` - Politique droits d'auteur
55. `financial-terms` - Conditions financières
56. `legal-profile` - Profil légal créateur

### Autres (3 pages)
57. `shorts-system` - Système de Shorts
58. `subscription` - Abonnement créateur
59. `profile-test` - Test de profil

---

## Vérification rapide

Pour vérifier que tout fonctionne:

1. **Ouvrez votre navigateur** à `https://localhost:5173`
2. **Scrollez tout en bas** de la page
3. **Dans le Footer**, section "Ressources", vous devriez voir:
   - Support
   - **Carrières** ← Cliquez ici pour voir les offres d'emploi
   - **Entreprise** ← Cliquez ici pour voir la page entreprise
   - Ressources

4. **Ou utilisez le menu Header** (les 3 points en haut à droite):
   - Cliquez sur "..." (MoreVertical icon)
   - Vous verrez apparaître:
     - À propos
     - Ressources
     - **Carrières**
     - **Entreprise**
     - Centre d'aide
     - Support

---

## Raccourcis clavier (à tester dans la console)

Copiez-collez ces commandes dans la console (F12):

```javascript
// Page entreprise
window.location.hash = 'enterprise';

// Page carrières
window.location.hash = 'careers';

// Page à propos enrichie
window.location.hash = 'about';

// Retour accueil
window.location.hash = 'home';
```

---

## Problème d'accès?

Si vous ne voyez toujours pas les pages:

1. **Rechargez la page**: `Ctrl+Shift+R` (ou `Cmd+Shift+R` sur Mac)
2. **Videz le cache**: F12 > Application > Clear storage > Clear site data
3. **Vérifiez l'URL**: doit commencer par `https://localhost:5173`
4. **Vérifiez la console**: F12 > Console - pas d'erreurs rouges?

### Test ultime

Tapez directement dans la barre d'adresse:
```
https://localhost:5173/#enterprise
```

Appuyez sur Entrée. Vous devriez voir la page Entreprise avec:
- Solutions B2B
- Partenariats
- API Enterprise
- Infrastructure dédiée
- etc.

---

**Toutes les pages fonctionnent maintenant!**

Si vous avez encore un problème, regardez la console navigateur (F12) et dites-moi quelle erreur s'affiche.
