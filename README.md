# Minobi(蓑火) - A HTML5 Book Player

 Minobi is a HTML5 book player.

# Sample

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

## Load a book

Please see [example](https://github.com/ledyba/Minobi/blob/master/web/index.html). In a nutshell, you need to prepare "chapter" object that contains information about the book.

## Event handling

### Viewer

#### pageenter

This event will be fired when a user enter pages. The 'pages' argument is a list of page numbers, and it may consist of more than one page numbers, since Minobi displays more than one pages in the screen if applicable.

```js
var chapter = {/* page catalog in json */}/
Minobi.init(document.getElementById("minobi"), chapter, function(viewer) {
      //...

      /**
       * @param {[number]} pages
       */
      var handler = function(pages){
        // ...
      };
      viewer.addEventListener('pageenter', handler);
      viewer.removeEventListener('pageenter', handler);
    });
```

### Seekbar

#### activated/deactivated

This event will be fired when a seekbar is activated or deactivated.

```js
var seekbar = new Minobi.Seekbar(/* ... */);

seekbar.addEventListener('activated', function(){
  console.log("seekbar activated");
});
seekbar.addEventListener('deactivated', function(){
  console.log("seekbar deactivated");
});
```

## Customizing behaviour

### Viewer

#### transitionAreaRatio

```js
var viewer = new Minobi.Viewer(/*...*/);
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

GPLv3 or later.

# What 'Minobi' means?

Minobi is a Japanese creature.
