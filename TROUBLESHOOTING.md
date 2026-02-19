# Guide de Dépannage Goroti

Ce guide vous aide à résoudre les problèmes courants rencontrés sur la plateforme Goroti.

## Problèmes résolus

### 1. Erreur Google AdSense (RÉSOLU)

**Symptôme**: Erreur console `adsbygoogle.push() error: Ad client is missing from the slot`

**Cause**: Le composant AdUnit tente de charger Google Ads sans configuration valide dans `.env`

**Solution appliquée**:
- Le composant AdUnit vérifie maintenant si `VITE_GOOGLE_ADSENSE_CLIENT` est configuré
- Si non configuré ou vide, les publicités ne s'affichent pas (sans erreur)
- Pour activer les publicités, ajoutez dans `.env`:
  ```
  VITE_GOOGLE_ADSENSE_CLIENT=ca-pub-VOTRE-ID-ICI
  ```

---

## Configuration requise

### Variables d'environnement essentielles

Créez un fichier `.env` à la racine du projet avec:

```env
# Supabase (OBLIGATOIRE)
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_clé_anon_ici

# Google AdSense (OPTIONNEL - pour monétisation)
VITE_GOOGLE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
```

### Installation et démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Vérifier que .env existe et est configuré
cat .env

# 3. Démarrer le serveur de développement
npm run dev

# 4. Build pour production (test)
npm run build
```

---

## Problèmes courants

### La page ne se charge pas

**Vérifications**:
1. Le serveur dev tourne-t-il? → `npm run dev`
2. Le port 5173 est-il disponible?
3. Erreurs dans la console navigateur? (F12)

**Solution**:
```bash
# Arrêter tous les process Node
pkill -f vite

# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Erreurs Supabase / Base de données

**Symptôme**:
- Connexion échoue
- "Failed to fetch"
- Erreurs 401/403

**Vérifications**:
1. `.env` contient les bonnes clés Supabase
2. Le projet Supabase existe et est actif
3. Les migrations sont appliquées

**Solution**:
```bash
# Vérifier la connexion
curl https://votre-projet.supabase.co/rest/v1/

# Ré-appliquer les migrations (si nécessaire)
# Via Supabase Dashboard > SQL Editor
# Exécuter les fichiers dans supabase/migrations/ dans l'ordre
```

### Pages vides ou erreur 404

**Cause**: Navigation interne non configurée

**Vérification**: Regardez `src/App.tsx` - toutes les routes sont définies?

**Solution**:
- Utiliser `onNavigate('nom-page')` au lieu de liens directs
- Ne pas utiliser `<a href="">` mais `<button onClick={() => onNavigate('page')}>`

### Erreurs de build

**Symptôme**: `npm run build` échoue

**Solutions communes**:

```bash
# Vérifier les erreurs TypeScript
npm run typecheck

# Si erreurs de dépendances
npm install --legacy-peer-deps

# Si erreurs de cache
rm -rf node_modules/.vite
npm run build
```

### Images ne se chargent pas

**Cause**: Chemins incorrects vers `/public`

**Solution**:
- Les images dans `/public` sont accessibles via `/image.png`
- Utiliser toujours des chemins absolus: `/logo.png` pas `./logo.png`

### Composants ne s'affichent pas

**Vérifications**:
1. Import correct? `import Component from './Component'`
2. Export correct? `export default function Component()`
3. Props passés correctement?

**Debug**:
```tsx
// Ajouter des logs
console.log('Component props:', props);

// Vérifier le rendu conditionnel
if (!data) {
  console.log('No data - not rendering');
  return null;
}
```

---

## Commandes utiles

### Développement

```bash
npm run dev          # Démarrer serveur dev
npm run build        # Build production
npm run preview      # Preview build local
npm run typecheck    # Vérifier TypeScript
npm run lint         # Linter
```

### Debug

```bash
# Logs détaillés Vite
DEBUG=vite:* npm run dev

# Vérifier les ports utilisés
lsof -i :5173

# Nettoyer complètement
rm -rf node_modules dist .vite package-lock.json
npm install
```

### Base de données

```bash
# Tester la connexion Supabase (via curl)
curl https://VOTRE-PROJET.supabase.co/rest/v1/user_profiles \
  -H "apikey: VOTRE-ANON-KEY"

# Devrait retourner un JSON (même vide)
```

---

## Performance

### Build trop gros

**Warning**: `Some chunks are larger than 500 kB`

**Solutions**:
1. **Code splitting**: Importer dynamiquement les grosses pages
   ```tsx
   const HeavyPage = lazy(() => import('./pages/HeavyPage'));
   ```

2. **Supprimer les dépendances inutilisées**
   ```bash
   npm uninstall package-non-utilisé
   ```

3. **Analyzer le bundle**
   ```bash
   npm run build -- --analyze
   ```

### Page lente à charger

**Optimisations**:
1. Lazy load des images: `loading="lazy"`
2. Code splitting sur les routes
3. Minimiser les re-renders inutiles avec `memo()`
4. Utiliser `useCallback` et `useMemo` pour les calculs lourds

---

## Besoin d'aide?

### Documentation officielle

- **Goroti Docs**: Consultez les fichiers `.md` à la racine:
  - `GUIDE_COMPLET_STUDIO_LIVE_V7.3.md`
  - `QUICK_START.md`
  - `DEPLOYMENT_CHECKLIST.md`

- **Supabase**: https://supabase.com/docs
- **Vite**: https://vitejs.dev/guide/
- **React**: https://react.dev/

### Support

Si le problème persiste:

1. **Vérifier les erreurs console** (F12 dans le navigateur)
2. **Lire les logs du terminal** où tourne `npm run dev`
3. **Tester en mode incognito** (pour éliminer cache/extensions)
4. **Vérifier que toutes les dépendances sont installées**: `npm install`

### Logs importants à partager

Quand vous demandez de l'aide, incluez:

```bash
# Version Node
node --version

# Erreurs console navigateur (F12 > Console)
# Copier toutes les erreurs en rouge

# Erreurs terminal
# Copier les logs de npm run dev ou npm run build

# Configuration
cat .env.example  # Ne JAMAIS partager .env réel!
```

---

## Checklist de fonctionnement

Avant de démarrer, vérifier:

- [ ] Node.js installé (v18+)
- [ ] `.env` créé et configuré
- [ ] `npm install` exécuté sans erreur
- [ ] Supabase configuré et accessible
- [ ] `npm run dev` démarre sans erreur
- [ ] `npm run build` réussit
- [ ] Aucune erreur rouge dans la console navigateur

Si tout est coché, la plateforme devrait fonctionner parfaitement!

---

## Mises à jour

### Dernière mise à jour: 19 février 2026

**Correctifs appliqués**:
- ✅ Fix AdUnit Google Adsense (ne crash plus si non configuré)
- ✅ Enrichissement AboutPage (histoire, chiffres clés, équipe, investisseurs)
- ✅ Amélioration HelpCenterPage (design Goroti cohérent)
- ✅ Page Carrière complète avec 7 postes détaillés
- ✅ Build production réussi
