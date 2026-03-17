# Corrections Authentification - GOROTI

**Date:** 2026-03-17
**Statut:** ✅ Corrigé et testé

---

## Problème Identifié

La création de compte échouait silencieusement car:
1. Le trigger `handle_new_user` ne pouvait pas insérer dans `profiles` à cause des RLS policies
2. Manque de contrainte unique sur le `username`
3. Gestion d'erreur insuffisante

---

## Corrections Appliquées

### 1. ✅ Fonction trigger avec SECURITY DEFINER

**Fichier:** Migration `fix_profile_creation_trigger_security.sql`

**Changement:**
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER -- Permet de bypasser RLS pendant l'exécution
SET search_path = public
LANGUAGE plpgsql
```

**Pourquoi:** Le trigger s'exécute dans le contexte de la base de données (sans `auth.uid()`), donc il ne peut pas passer les policies RLS normales. `SECURITY DEFINER` lui permet de créer le profil avec des privilèges élevés.

### 2. ✅ Contrainte unique sur username

**Fichier:** Migration `add_unique_username_constraint.sql`

**Changement:**
```sql
ALTER TABLE profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
CREATE INDEX idx_profiles_username ON profiles(username);
```

**Pourquoi:** Évite les doublons de nom d'utilisateur et améliore les performances de recherche.

### 3. ✅ Meilleure gestion d'erreur

**Fichier:** `src/pages/AuthPage.tsx`

**Changements:**
- Ajout de console.log pour déboguer
- Messages d'erreur en français plus clairs
- Vérification de `data.user` avant redirection
- Gestion des erreurs de contrainte unique

---

## Comment Tester

### Test 1: Création de compte avec email/mot de passe

1. Allez sur `#auth`
2. Cliquez sur "Pas encore de compte ? S'inscrire"
3. Remplissez:
   - **Nom d'utilisateur:** test_user_123
   - **Email:** test@example.com
   - **Mot de passe:** password123
4. Cliquez sur "Créer un compte"

**Résultat attendu:**
```
✅ Message: "Compte créé avec succès! Redirection en cours..."
✅ Console: "✅ Compte créé avec succès: [user-id]"
✅ Redirection vers la page d'accueil après 1.5s
```

### Test 2: Email déjà utilisé

1. Essayez de créer un compte avec le même email
2. **Résultat attendu:** "Cet email est déjà utilisé"

### Test 3: Username déjà pris

1. Créez un premier compte: user123
2. Créez un second compte avec un autre email mais username "user123"
3. **Résultat attendu:** "Ce nom d'utilisateur est déjà pris"

### Test 4: Mot de passe trop court

1. Entrez un mot de passe de 5 caractères
2. **Résultat attendu:** "Le mot de passe doit contenir au moins 6 caractères"

### Test 5: Connexion

1. Utilisez l'email et mot de passe d'un compte existant
2. **Résultat attendu:** Connexion réussie et redirection

---

## Logs de Débogage

Ouvrez la console (F12) et vous verrez:

### Lors de la création:
```
📝 Tentative de création de compte...
✅ Compte créé avec succès: abc-123-def
```

### En cas d'erreur:
```
❌ Erreur création compte: {message: "...", ...}
```

---

## Vérification Base de Données

### Vérifier qu'un profil a été créé:
```sql
-- Après création d'un compte
SELECT
  p.id,
  p.username,
  p.display_name,
  p.user_status,
  p.trust_score
FROM profiles p
JOIN auth.users u ON u.id = p.id
WHERE u.email = 'test@example.com';
```

**Résultat attendu:**
| id | username | display_name | user_status | trust_score |
|----|----------|--------------|-------------|-------------|
| abc-123 | test_user_123 | test_user_123 | viewer | 0.5 |

### Vérifier le trust score:
```sql
SELECT * FROM user_trust_scores
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'test@example.com'
);
```

---

## Architecture du Flux d'Inscription

```
┌─────────────────────────────────────────────┐
│  1. Utilisateur remplit le formulaire       │
│     - Username, Email, Password             │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│  2. Frontend: supabase.auth.signUp()        │
│     - Envoie les données à Supabase Auth    │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│  3. Supabase Auth crée l'utilisateur        │
│     - Insère dans auth.users                │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│  4. TRIGGER on_auth_user_created activé     │
│     - Exécute handle_new_user()             │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│  5. handle_new_user() (SECURITY DEFINER)    │
│     - Extrait username/display_name         │
│     - Insère dans profiles (bypass RLS)     │
│     - Insère dans user_trust_scores         │
└─────────────────┬───────────────────────────┘
                  ▼
┌─────────────────────────────────────────────┐
│  6. Retour au Frontend                      │
│     - Message de succès                     │
│     - Redirection vers /                    │
└─────────────────────────────────────────────┘
```

---

## Sécurité

### RLS Policies Maintenues

Les policies RLS sont toujours actives:

1. **profiles (SELECT):** `true` - Tout le monde peut voir les profils
2. **profiles (INSERT):** `auth.uid() = id` - Seulement via le trigger
3. **profiles (UPDATE):** `auth.uid() = id` - Seulement son propre profil

### SECURITY DEFINER

La fonction `handle_new_user()` utilise `SECURITY DEFINER` **uniquement** pour:
- Créer le profil initial lors de l'inscription
- Créer le trust score initial

Elle **ne peut pas** être appelée directement par les utilisateurs (c'est un trigger).

---

## Messages d'Erreur

| Code Erreur | Message Français |
|-------------|------------------|
| Invalid login credentials | Email ou mot de passe incorrect |
| User already registered | Cet email est déjà utilisé |
| Password should be at least 6 characters | Le mot de passe doit contenir au moins 6 caractères |
| duplicate key value violates unique constraint | Ce nom d'utilisateur est déjà pris |
| Invalid email | Email invalide |

---

## Fichiers Modifiés

1. **Migration:** `fix_profile_creation_trigger_security.sql`
   - Ajout de `SECURITY DEFINER` à `handle_new_user()`

2. **Migration:** `add_unique_username_constraint.sql`
   - Contrainte unique sur `username`
   - Index pour performance

3. **Frontend:** `src/pages/AuthPage.tsx`
   - Logs de débogage
   - Messages d'erreur améliorés
   - Vérification de `data.user`

---

## Prochaines Étapes (Optionnel)

### Confirmation Email (Désactivé par défaut)

Actuellement, la confirmation d'email est **désactivée** pour faciliter les tests.

Pour l'activer en production:
1. Allez dans le dashboard Supabase
2. Authentication → Settings
3. Activez "Enable email confirmations"
4. Configurez les templates d'email

### OAuth Providers

Les boutons Google, Facebook, Apple sont présents mais nécessitent:
1. Configuration dans le dashboard Supabase
2. Création d'apps OAuth chez chaque provider
3. Ajout des credentials dans Supabase

---

## Statut Final

✅ **Création de compte fonctionnelle**
✅ **Trigger de profil corrigé**
✅ **Contrainte unique sur username**
✅ **Gestion d'erreur améliorée**
✅ **Logs de débogage ajoutés**
✅ **Build réussi**

**La création de compte fonctionne maintenant correctement!**

---

**Date de correction:** 2026-03-17
**Version:** 2.0.1
**Testé:** ✅ OUI
