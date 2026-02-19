#!/bin/bash

# Script de correction automatique des erreurs TypeScript

echo "🔧 Correction des imports inutilisés..."

# Supprimer les imports React inutiles dans les fichiers
files_to_fix=(
  "src/components/FreeTrialBanner.tsx"
  "src/components/mobile/CommentsPreview.tsx"
  "src/components/mobile/MobileChannelPage.tsx"
  "src/components/mobile/QualitySpeedSheet.tsx"
  "src/components/mobile/VideoOptionsSheet.tsx"
)

for file in "${files_to_fix[@]}"; do
  if [ -f "$file" ]; then
    # Supprimer la ligne "import React from 'react';"
    grep -v "^import React from 'react';$" "$file" > "${file}.tmp" && mv "${file}.tmp" "$file"
    echo "✓ $file"
  fi
done

echo "✅ Corrections des imports terminées"
