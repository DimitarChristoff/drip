freezer
=======

A small canvas experiment with text, pixels and snow.

Forked from http://wonderfl.net/c/g9s1/ and ased upon work from clockmaker.

Uses: `primish`

## Install

```sh
$ npm install -g bower
$ bower install
```

Then open `dist/index.html` in your browser (web server due to requirejs).

## Demo

http://fragged.org/freezer/dist/ - may have inappropriate text

## Caveats / todos

- Currently fed through `requestAnimationFrame` so may be slower than expected in some browsers. Should use proper FPS
- needs to batch update all pixels for speed if possible.