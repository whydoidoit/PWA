[![Build Status](https://travis-ci.org/TehShrike/page-path-builder.svg)](https://travis-ci.org/TehShrike/page-path-builder)

For those times when you want to programmatically generate a link to a [page.js](https://github.com/visionmedia/page.js) route.

Usage
=======

```js
var buildPath = require('./')

buildPath('/wat/:huh/yeah', { huh: 'go figure' }) // => '/wat/go%20figure/yeah'
```

Or parse a path once for more efficient url construction later:

```js
var parsedPath = buildPath('/page/:id')

buildPath(parsedPath, { id: 13 }) // => '/page/13'

buildPath(parsedPath, { id: 1337 }) // => '/page/1337'
```
