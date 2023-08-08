# Github Pages

Install:


Run locally:
```
bundle exec jekyll serve --incremental
```

Clean:
```
bundle exec jekyll clean
```

Update with the latest PortalsJS runtime:
* Replace the `portals-portalsjs-opt.js` file with the new runtime.

Note: 
* The assets are placed in `assets-playground` to avoid any name conflicts with the main site. If there are name conflicts, then the wrong files may be loaded, for example the wrong style sheets. 
