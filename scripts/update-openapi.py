#!/usr/bin/env python3
"""
Download the latest Meilisearch OpenAPI spec and fix validation errors.

This script:
1. Fetches the latest Meilisearch release version from GitHub
2. Downloads the OpenAPI spec from the release assets
3. Fixes known validation issues (null descriptions in externalDocs)
4. Saves the fixed spec to reference/openapi.json
"""

import json
import urllib.request
from pathlib import Path

GITHUB_API_URL = "https://api.github.com/repos/meilisearch/meilisearch/releases/latest"
OPENAPI_URL_TEMPLATE = "https://github.com/meilisearch/meilisearch/releases/download/{version}/meilisearch-openapi.json"
SCRIPT_DIR = Path(__file__).parent
OUTPUT_PATH = SCRIPT_DIR.parent / "reference" / "openapi.json"


def get_latest_version():
    """Fetch the latest Meilisearch release version from GitHub."""
    print(f"Fetching latest release from GitHub...")
    request = urllib.request.Request(
        GITHUB_API_URL,
        headers={"Accept": "application/vnd.github.v3+json", "User-Agent": "Meilisearch-Docs"}
    )
    with urllib.request.urlopen(request) as response:
        data = json.loads(response.read().decode("utf-8"))
        version = data["tag_name"]
        print(f"Latest version: {version}")
        return version


def download_openapi(version):
    """Download the OpenAPI spec from the release assets."""
    url = OPENAPI_URL_TEMPLATE.format(version=version)
    print(f"Downloading OpenAPI spec from {url}...")
    with urllib.request.urlopen(url) as response:
        return json.loads(response.read().decode("utf-8"))


def fix_openapi(spec):
    """Fix known validation issues in the OpenAPI spec."""
    fixes_applied = 0

    # Fix 1: Remove null descriptions in externalDocs
    if "tags" in spec:
        for tag in spec["tags"]:
            if "externalDocs" in tag:
                if tag["externalDocs"].get("description") is None:
                    del tag["externalDocs"]["description"]
                    fixes_applied += 1
                    print(f"  Fixed: Removed null description from tag '{tag.get('name', 'unknown')}'")

    # Fix 2: Check paths for null externalDocs descriptions
    if "paths" in spec:
        for path, methods in spec["paths"].items():
            for method, operation in methods.items():
                if isinstance(operation, dict) and "externalDocs" in operation:
                    if operation["externalDocs"].get("description") is None:
                        del operation["externalDocs"]["description"]
                        fixes_applied += 1
                        print(f"  Fixed: Removed null description from {method.upper()} {path}")

    return spec, fixes_applied


def save_openapi(spec, output_path):
    """Save the fixed OpenAPI spec to disk."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, "w") as f:
        json.dump(spec, f, indent=2)
    print(f"Saved fixed OpenAPI spec to {output_path}")


def main():
    print("=" * 60)
    print("Meilisearch OpenAPI Spec Updater")
    print("=" * 60)

    # Get latest version
    version = get_latest_version()

    # Download
    spec = download_openapi(version)
    spec_version = spec.get('info', {}).get('version', 'unknown')
    print(f"OpenAPI spec version: {spec_version}")

    # Fix
    print("\nApplying fixes...")
    spec, fixes_applied = fix_openapi(spec)
    print(f"Total fixes applied: {fixes_applied}")

    # Save
    print()
    save_openapi(spec, OUTPUT_PATH)

    print("\nDone!")
    print(f"You can now use this spec in docs.json:")
    print(f'  "openapi": "reference/openapi.json"')


if __name__ == "__main__":
    main()
