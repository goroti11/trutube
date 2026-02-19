#!/usr/bin/env python3
import re
import sys

# Mapping des fichiers et des imports à supprimer
fixes = {
    "src/components/mobile/MobileChannelPage.tsx": ["ChevronRight"],
    "src/components/mobile/MobileLayout.tsx": ["useState"],
    "src/components/mobile/MobileVideoPlayer.tsx": ["title", "onSpeedClick"],
    "src/components/mobile/VideoActions.tsx": ["ALL"],  # Supprimer toute l'import
    "src/components/mobile/VideoOptionsSheet.tsx": ["Moon"],
    "src/components/monetization/CreatorShopSection.tsx": ["Star"],
    "src/components/music/RoyaltySplitManager.tsx": ["RoyaltySplit"],
    "src/components/profile/ProfileReviewsSection.tsx": ["MoreVertical", "Edit2"],
    "src/components/profile/ShareProfileModal.tsx": ["Link2"],
    "src/components/resources/FeedbackCard.tsx": ["MessageCircle"],
    "src/components/studio/ContentGuidePanel.tsx": ["Target"],
    "src/components/studio/MonetizationDashboard.tsx": ["Eye"],
    "src/components/upload/UniverseDetailsPanel.tsx": ["Target"],
    "src/components/video/EnhancedVideoPlayer.tsx": ["useState"],
    "src/pages/AboutPage.tsx": ["TrendingDown"],
    "src/pages/AlbumSalePage.tsx": ["Download"],
    "src/pages/ResourcesPage.tsx": ["CreditCard", "MessageCircle"],
    "src/pages/RevenueModelPage.tsx": ["DollarSign", "EyeOff", "Package"],
    "src/pages/SecurityDashboardPage.tsx": ["TrendingUp", "Users"],
    "src/pages/ShortsSystemPage.tsx": ["Repeat"],
    "src/pages/StatusPage.tsx": ["Globe"],
    "src/pages/SubscriptionPage.tsx": ["Award", "TrendingUp"],
    "src/pages/WatchHistoryPage.tsx": ["Filter"],
}

def remove_from_import(line, items_to_remove):
    """Supprime des items spécifiques d'une ligne d'import"""
    if "ALL" in items_to_remove:
        return None  # Supprimer toute la ligne

    for item in items_to_remove:
        # Pattern pour supprimer l'item avec sa virgule
        patterns = [
            rf',\s*{item}\s*,',  # Au milieu
            rf',\s*{item}\s*\}}',  # À la fin
            rf'{{\s*{item}\s*,',  # Au début
            rf'{{\s*{item}\s*\}}',  # Seul
        ]

        for pattern in patterns:
            if re.search(pattern, line):
                line = re.sub(pattern, lambda m: m.group(0).replace(item, '').replace(',,', ',').replace('{ ,', '{').replace(', }', '}').strip(), line)
                break

    return line

def fix_file(filepath, items_to_remove):
    """Corrige un fichier en supprimant les imports inutilisés"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lines = f.readlines()

        new_lines = []
        for line in lines:
            if any(f"import " in line and "from 'lucide-react'" in line for _ in [1]):
                new_line = remove_from_import(line, items_to_remove)
                if new_line:
                    new_lines.append(new_line)
            else:
                new_lines.append(line)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(new_lines)

        print(f"✓ {filepath}")
        return True
    except Exception as e:
        print(f"✗ {filepath}: {e}")
        return False

print("🔧 Correction des imports inutilisés...")
success_count = 0

for filepath, items in fixes.items():
    if fix_file(filepath, items):
        success_count += 1

print(f"\n✅ {success_count}/{len(fixes)} fichiers corrigés")
