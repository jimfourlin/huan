# GitHub Pages

The public site is deployed from the `gh-pages` branch.

Build the deployable static bundle:

```powershell
python .\scripts\build-pages.py
```

The build compresses image assets, excludes local editing tools, and replaces oversized videos with poster images so the published site stays within GitHub Pages limits.
