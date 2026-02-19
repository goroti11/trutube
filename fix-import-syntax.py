#!/usr/bin/env python3
"""Corriger les erreurs de syntaxe dans les imports"""
import re

def clean_import(content):
    """Nettoie les imports avec des virgules orphelines"""
    # Pattern pour trouver les imports de lucide-react avec virgules problématiques
    pattern = r"import\s*\{([^}]*)\}\s*from\s*'lucide-react';"

    def fix_import_list(match):
        items = match.group(1)
        # Supprimer les virgules multiples et espaces
        items = re.sub(r',\s*,+', ',', items)
        items = re.sub(r',\s*\}', '}', items)
        items = re.sub(r'\{\s*,', '{', items)
        items = re.sub(r'^\s*,|,\s*$', '', items.strip())
        # Supprimer items vides
        items_list = [item.strip() for item in items.split(',') if item.strip()]
        if not items_list:
            return ''  # Supprimer l'import entier
        return f"import {{ {', '.join(items_list)} }} from 'lucide-react';"

    # Appliquer le fix
    content = re.sub(pattern, fix_import_list, content)
    # Supprimer les lignes vides doubles
    content = re.sub(r'\n\n\n+', '\n\n', content)
    return content

files = [
    "src/components/mobile/VideoOptionsSheet.tsx",
    "src/components/profile/ProfileReviewsSection.tsx",
    "src/components/profile/ShareProfileModal.tsx",
    "src/components/resources/FeedbackCard.tsx",
    "src/components/studio/ContentGuidePanel.tsx",
    "src/components/upload/UniverseDetailsPanel.tsx",
    "src/pages/SecurityDashboardPage.tsx",
    "src/pages/SubscriptionPage.tsx",
    "src/pages/WatchHistoryPage.tsx",
]

print("🔧 Correction de la syntaxe des imports...")

for filepath in files:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = clean_import(content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"✓ {filepath}")
    except Exception as e:
        print(f"✗ {filepath}: {e}")

print("✅ Corrections terminées")
