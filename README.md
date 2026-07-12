# Nikon Z8 Field Companion — Version 15 Update

This update adds:

- A horizontal on-page navigation menu at the top of every page.
- A complete Tanzania gemstone and souvenir shopping checklist at the top of the More page.
- Local persistence for every shopping checkbox.
- The Version 14 startup guard so countdown and local-storage handlers initialize.
- Correct multi-page offline caching with a new Version 15 service-worker cache.

## Mac installation

1. Download your GitHub repository as a ZIP and unzip it.
2. Double-click `apply-v15.command`.
3. Drag the unzipped project folder into the Terminal window and press Return.
4. Upload the updated files to the repository's `main` branch.
5. Open the web app in Safari, refresh it, close and reopen the Home Screen app.

## Terminal alternative

```bash
python3 apply-v15.py /path/to/nikon-z8-field-companion
```

The updater does not delete existing localStorage keys. Existing checklist, private-field and to-do data remain intact for the same site origin.
