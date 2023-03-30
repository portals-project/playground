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
* Replace the `main.js` file with the new runtime after minifying and obfuscating it.

Todos:
* Throttle the speed of the output.
* Make the output appear incrementally.
* Display errors from running the code.
* Add comment toggle feature.

Note: 
* The assets are placed in `assets-playground` to avoid any name conflicts with the main site. If there are name conflicts, then the wrong files may be loaded, for example the wrong style sheets. 