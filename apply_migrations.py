#!/usr/bin/env python3
"""
Script to apply all pending Supabase migrations
"""
import os
import sys
import json
import subprocess
from pathlib import Path

# List of already applied migrations from the API
APPLIED_MIGRATIONS = [
    "20260209115532_create_trutube_schema_v2.sql",
    "20260209120240_add_sub_universes_system.sql",
    "20260209120836_add_anti_fake_views_and_moderation.sql",
    "20260213134936_create_user_profiles.sql",
    "20260213193907_fix_security_performance_issues.sql",
    "20260213194121_add_settings_and_support_tables.sql",
    "20260213195949_add_helper_functions.sql",
    "20260213201858_add_google_ads_system.sql",
    "20260213225415_enhance_payments_and_tips_system.sql",
    "20260213235951_add_video_enhanced_features.sql",
    "20260214132004_update_premium_tiers_system.sql",
    "20260214133129_add_profile_reviews_and_social_links.sql",
    "20260214134114_add_creator_support_system.sql",
    "20260214135346_add_video_upload_system.sql",
    "20260216084816_add_creator_monetization_channels.sql",
    "20260216092011_add_monetization_system_v2.sql",
    "20260216093157_add_partner_program_legal_terms.sql",
    "20260216094702_create_community_base_tables.sql",
    "20260216094733_create_community_advanced_features.sql",
    "20260216102950_add_annual_premium_plans.sql",
    "20260216104203_seed_default_communities.sql",
    "20260216150957_fix_user_profile_trigger.sql",
    "20260216151748_fix_community_access_and_premium.sql",
    "20260216211241_setup_storage_and_premium_v2.sql",
]

def get_all_migrations():
    """Get all migration files sorted by timestamp"""
    migrations_dir = Path("supabase/migrations")
    migrations = sorted([f.name for f in migrations_dir.glob("*.sql")])
    return migrations

def get_pending_migrations():
    """Get migrations that haven't been applied yet"""
    all_migrations = get_all_migrations()
    pending = [m for m in all_migrations if m not in APPLIED_MIGRATIONS]
    return pending

def main():
    pending = get_pending_migrations()
    print(f"Found {len(pending)} pending migrations to apply")

    if not pending:
        print("No pending migrations!")
        return 0

    # Print list of pending migrations
    print("\nPending migrations:")
    for i, migration in enumerate(pending[:10], 1):
        print(f"  {i}. {migration}")
    if len(pending) > 10:
        print(f"  ... and {len(pending) - 10} more")

    return 0

if __name__ == "__main__":
    sys.exit(main())
