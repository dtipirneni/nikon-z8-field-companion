# Tanzania Companion

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


## Version 16

Fixes countdown and local persistence initialization, adds consistent in-page navigation on every page, adds a persistent Tanzania shopping checklist to More, and corrects multi-page offline caching.


## Version 18

Renames the PWA to Tanzania Companion, adds verified Leopard Tours and Shazmin Giga contact cards with one-tap WhatsApp/call/email actions, preserves the Tanzania shopping checklist, makes iPhone submenus static and scrollable, collapses all details by default, hardens local persistence, and refreshes the offline cache.
