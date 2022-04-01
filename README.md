# Minobi(蓑火) - A HTML5 Book Player

 Minobi is a HTML5 book player.

# Sample

Here: https://ledyba.github.io/Minobi/

[![screenshot](sample.jpg)](https://ledyba.github.io/Minobi/)

All artworks come from [妖精⊸ロケット(fairy⊸rocket)](https://hexe.net/), painted by [@ledyba](https://github.com/ledyba) and [@momiji-san](https://github.com/momiji-san). Licensed under [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/deed).

# Requirement

## Supported browsers
 - iOS8 or later.
 - Latest Chrome.

## Dependencies

### For client
 Minobi does not depend on any external libraries or frameworks.

### For development

 Minobi uses npm, babel, webpack to transpile from es6 to es4.

 To install,

```sh
npm install --save-dev webpack babel-loader babel-preset-es2015
# or
make inst
```

# How to use

## Compile

 If you modify sources, you need to recompile sources for browsers.

 To recompile,

```
`npm bin`/webpack
# or, just
make
```

## Load a book

Please see [example](https://github.com/ledyba/Minobi/blob/master/index.html). In a nutshell, you need to prepare "chapter" object that contains information about the book.

## Event handling

### Viewer

#### pageenter / finish

This event will be fired when a user enters pages or finishes reading book. The 'pages' argument is a list of page numbers, and it may consist of more than one page numbers, since Minobi displays more than one pages in the screen if applicable.

```js
var chapter = {/* page catalog in json */}/
Minobi.init(document.getElementById("minobi"), chapter, function(viewer) {
      //...

      /**
       * @param {[number]} pages
       * @param {string} cause
       */
      var pageenterHandler = function(pages, cause) {
        // ...
        // cause := 'swipe' | 'touch' | 'mouse' | 'keyboard' | 'init' | 'resize' | 'reload' | '?';
      };
      viewer.addEventListener('pageenter', pageenterHandler);
      viewer.removeEventListener('pageenter', pageenterHandler);

      /**
       * @param {string} cause
       */
      var finishHandler = function(pages, cause) {
        // ...
        // cause is the same as pageenter
      };
      viewer.addEventListener('finish', finishHandler);
      viewer.removeEventListener('finish', finishHandler);
    });
```

### Seekbar

#### activated/deactivated

This event will be fired when a seekbar is activated or deactivated.

```js
var seekbar = new Minobi.Seekbar(/* ... */);

seekbar.addEventListener('activated', function(cause) {
  console.log("seekbar activated, by ", cause);
  //cause := 'mouse' | 'touch' | '?'
});
seekbar.addEventListener('deactivated', function(cause) {
  console.log("seekbar deactivated, by " cause);
  //cause := 'mouse' | 'touch' | '?'
});
```

## Customizing behaviour

### Viewer

#### transitionAreaRatio

```js
/** @type {Minobi.Viewer} */
var viewer;
/**
 * @type {number} transitionAreaRatioForTouch
 * [non-dimension] MUST BE IN [0, 0.5]
 * Tap actions will be treated as page transition actions
 * when the user released their finger in this range from left/right.
 */
viewer.transitionAreaRatioForTouch = 0.35;

/**
 * @type {number} transitionAreaRatioForTouch
 * [non-dimension] MUST BE IN [0, 0.5]
 * Click actions will be treated as page transition actions
 * when the user released their cursor in this range from left/right.
 */
viewer.transitionAreaRatioForMouse = 0.35;

```


### Seekbar

#### activationPeriod

A seekbar will automatically disappear after this period.

When set to 0, the seekbar won't automatically disappear at all.

```js
var seekbar = new Minobi.Seekbar(/* ... */);
seekbar.activePeriod = 1000;
```

# License

AGPLv3 or later.

# What 'Minobi' means?

Minobi is a Japanese creature.
