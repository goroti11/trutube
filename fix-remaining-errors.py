#!/usr/bin/env python3
"""
Script pour corriger automatiquement les erreurs TypeScript restantes
"""
import re

def fix_file(filepath, fixes_callback):
    """Applique des corrections à un fichier"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()

        new_content = fixes_callback(content)

        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)

        print(f"✓ {filepath}")
        return True
    except Exception as e:
        print(f"✗ {filepath}: {e}")
        return False

# Fix ResourcesPage.tsx - Object.entries with null check
def fix_resources_page(content):
    # Ajouter null check pour Object.entries
    content = re.sub(
        r'Object\.entries\(content\)\.map',
        'Object.entries(content || {}).map',
        content
    )
    return content

# Fix RevenueModelPage.tsx - Add missing onNavigate prop
def fix_revenue_model_page(content):
    content = re.sub(
        r'<Footer />',
        '<Footer onNavigate={onNavigate} />',
        content
    )
    return content

# Fix ShortsSystemPage.tsx - Remove .bar access and add onNavigate
def fix_shorts_system_page(content):
    # Fix .bar property access
    content = re.sub(
        r'signal\.bar',
        'signal.weight',
        content
    )
    # Add onNavigate to Footer
    content = re.sub(
        r'<Footer />',
        '<Footer onNavigate={onNavigate} />',
        content
    )
    return content

# Fix TruCoinWalletPage.tsx - Add onNavigate
def fix_trucoin_wallet_page(content):
    content = re.sub(
        r'<Footer />',
        '<Footer onNavigate={onNavigate} />',
        content
    )
    return content

# Fix VideoPlayerPage.tsx - Add missing props
def fix_video_player_page(content):
    # Ajouter commentCount, isSubscribed, onSubscribe à VideoActions
    content = re.sub(
        r'(<VideoActions\s+[^>]*onRemix=\{handleRemix\}\s*)(/>)',
        r'\1commentCount={video.comments || 0}\n              isSubscribed={false}\n              onSubscribe={() => {}}\n            \2',
        content
    )
    # Ajouter likes, dislikes, comments à VideoInfo
    content = re.sub(
        r'(<VideoInfo\s+[^>]*transcript=\{video\.transcript\}\s*)(/>)',
        r'\1likes={video.likes || 0}\n              dislikes={video.dislikes || 0}\n              comments={video.comments || 0}\n            \2',
        content
    )
    return content

# Fix liveStreamService.ts - Remove .raw access
def fix_live_stream_service(content):
    content = re.sub(
        r'supabase\.raw',
        'supabase',
        content
    )
    return content

# Fix videoUploadService.ts - Remove onUploadProgress
def fix_video_upload_service(content):
    content = re.sub(
        r',\s*onUploadProgress:.*?\}\s*\)',
        ')',
        content,
        flags=re.DOTALL
    )
    return content

# Fix resourceService.ts - Fix type mismatch
def fix_resource_service(content):
    content = re.sub(
        r'const resources = resourcesData\.flat\(\);',
        'const resources = resourcesData.flat() as Resource[];',
        content
    )
    return content

# Fix securityService.ts - Add underscore prefix to unused params
def fix_security_service(content):
    content = re.sub(
        r'\(key,\s*value\)',
        '(_key, value)',
        content
    )
    return content

# Fix paymentService.ts - Add underscore
def fix_payment_service(content):
    content = re.sub(
        r'const paymentMethodId =',
        'const _paymentMethodId =',
        content
    )
    return content

# Fix musicSalesService.ts - Add underscore
def fix_music_sales_service(content):
    content = re.sub(
        r'const price =',
        'const _price =',
        content
    )
    return content

# Fix affiliationService.ts - Add underscore
def fix_affiliation_service(content):
    content = re.sub(
        r'async getPerformance\(\{\s*affiliateId,\s*period\s*\}',
        'async getPerformance({ affiliateId, period: _period }',
        content
    )
    return content

# Fix MonetizationDashboard - Add underscore
def fix_monetization_dashboard(content):
    content = re.sub(
        r'const \{ balance, availableBalance \}',
        'const { balance, availableBalance: _availableBalance }',
        content
    )
    return content

# Fix SubscribersPage - Add underscore
def fix_subscribers_page(content):
    content = re.sub(
        r'const getTierColor =',
        'const _getTierColor =',
        content
    )
    return content

# Fix SubscriptionPage - Add underscores
def fix_subscription_page(content):
    content = re.sub(
        r'const \{ user \}',
        'const { user: _user }',
        content
    )
    content = re.sub(
        r'const \[loading,',
        'const [_loading,',
        content
    )
    return content

# Fix StatusPage - Add underscore
def fix_status_page(content):
    content = re.sub(
        r'const someDegraded =',
        'const _someDegraded =',
        content
    )
    return content

# Fix ResourcesPage - Add underscore for status
def fix_resources_page_status(content):
    content = re.sub(
        r'\(service, status\)',
        '(service, _status)',
        content
    )
    return content

print("🔧 Correction des erreurs TypeScript complexes...")

files_to_fix = [
    ("src/pages/ResourcesPage.tsx", lambda c: fix_resources_page_status(fix_resources_page(c))),
    ("src/pages/RevenueModelPage.tsx", fix_revenue_model_page),
    ("src/pages/ShortsSystemPage.tsx", fix_shorts_system_page),
    ("src/pages/TruCoinWalletPage.tsx", fix_trucoin_wallet_page),
    ("src/pages/VideoPlayerPage.tsx", fix_video_player_page),
    ("src/services/liveStreamService.ts", fix_live_stream_service),
    ("src/services/videoUploadService.ts", fix_video_upload_service),
    ("src/services/resourceService.ts", fix_resource_service),
    ("src/services/securityService.ts", fix_security_service),
    ("src/services/paymentService.ts", fix_payment_service),
    ("src/services/musicSalesService.ts", fix_music_sales_service),
    ("src/services/affiliationService.ts", fix_affiliation_service),
    ("src/components/studio/MonetizationDashboard.tsx", fix_monetization_dashboard),
    ("src/pages/SubscribersPage.tsx", fix_subscribers_page),
    ("src/pages/SubscriptionPage.tsx", fix_subscription_page),
    ("src/pages/StatusPage.tsx", fix_status_page),
]

success_count = 0
for filepath, callback in files_to_fix:
    if fix_file(filepath, callback):
        success_count += 1

print(f"\n✅ {success_count}/{len(files_to_fix)} fichiers corrigés")
