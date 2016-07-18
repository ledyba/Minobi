(function(){
  var Minobi = {};

  /*** Data Model ***/

  window.Minobi = Minobi;

  /**
   * @param {string} url
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  Minobi.Image = function(url, width, height) {
    this.url = url;
    this.width = width;
    this.height = height;

    /** @type {!HTMLImageElement} element */
    this.element = document.createElement('img');
  };

  /**
   * @param {Minobi.Image[]} images
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  Minobi.Page = function(images, width, height) {
    this.images = images;
    this.width = width;
    this.height = height;
    /** @type {Minobi.Page} */
    this.prev = null;
    /** @type {Minobi.Page} */
    this.next = null;
    /** @type {HTMLDivElement} */
    this.elem = document.createElement('div');

    this.elem.className = 'manga-page';
    /** @type {!HTMLDivElement[]} */
    this.imageContainers = [];
    var left = 0;
    for(var i = 0; i < this.images.length; i++) {
      /** @type {HTMLDivElement} */
      var img = images[i];
      var elem = img.element;
      elem.classList.add('manga-page-wrap');
      this.imageContainers.push(elem);
      this.elem.appendChild(elem);
      elem.style.left = left + 'px';
      left += img.width;
    }
  };
  Minobi.Page.prototype = {
    attached: function() {
      return !this.elem || !!this.elem.parentElement;
    },
    /**
     * @param {HTMLDivElement} container
     */
    attach: function(container) {
      if(!this.elem) {
        console.error("Null elem.");
        return;
      } else if(container === this.elem.parentElement) {
        console.warn("already attached");
        return;
      }
      container.appendChild(this.elem);
    },
    /**
     * @param {HTMLDivElement} container
     */
    detach: function(container) {
      if(!this.elem) {
        console.error("Null elem.");
        return;
      } else if(container !== this.elem.parentElement) {
        console.warn("already detached");
        return;
      }
      container.removeChild(this.elem);
    }
  };

  /**
   * @param {Minobi.Page[]} pages
   * @constructor
   */
  Minobi.Chapter = function(pages) {
    this.pages = pages;
  };

  /*** Cache System ***/

  /**
   * @param {Minobi.Viewer} viewer
   * @param {Minobi.Chapter} chapter
   * @constructor
   */
  Minobi.ImageCache = function(viewer, chapter) {
    this.viewer_ = viewer;
    this.chapter_ = chapter;
  };

  Minobi.ImageCache.prototype = {
    /**
     * @param {Minobi.Page} page
     */
    enqueue: function(page) {
      // TODO: implement real cache.
      for(var i=0; i < page.images.length; i++) {
        this.setImage_(page.images[i], page.images[i].url);
      }
    },
    /**
     * @param {Minobi.Image} img
     * @param {string} url
     */
    setImage_: function(img, url) {
      if(!this.element_) {
        /** @type {HTMLImageElement} */
        this.element_ = document.createElement("img");
        this.element_.className = 'manga-page';
        this.element_.src = url;
      }
    },
    /**
     * @param {Minobi.Image} img
     */
    clear: function(img) {
      if(img.element){
        img.element.src = "";
        img.element = null;
      }
    }
  };

  /*** Viewer ***/

  /**
   * @param {HTMLDivElement} container
   * @param {Minobi.Chapter} chapter
   * @constructor
   */
  Minobi.Viewer = function(container, chapter) {
    /** @type {HTMLDivElement} */
    this.container_ = container;
    this.chapter = chapter;
    this.cache_ = new Minobi.ImageCache(this, chapter);

    // Axis
    this.x = new Minobi.Axis(chapter, chapter.pages[0], 'width');
    this.y = new Minobi.Axis(chapter, chapter.pages[0], 'height');

    //
    this.container_.classList.add('minobi');
    this.container_.addEventListener('load', function() {
      this.render();
    }.bind(this));
  };

  Minobi.Viewer.prototype = {
    /**
     * @param {number|undefined} initPage
     */
    init: function(initPage) {
      initPage ||= 0;
      this.x.set(this.chapter.pages[initPage]);
      this.y.set(this.chapter.pages[initPage]);
    },
    render: function() {
    }
  };

  /**
   * @param {Minobi.Chapter} chapter
   * @param {Minobi.Page} page
   * @param {!string} axis
   * @constructor
   */
  Minobi.Axis = function(chapter, page, axis) {
    this.chapter = chapter;
    this.current = page;
    this.axis = axis;
    this.lastMoved = -1;
    this.pos = 0
    this.speed = 0;
  };
  Minobi.Axis.prototype = {
    reset: function(){
      this.pos = 0;
      this.speed = 0;
    },
    /**
     * @param {!Minobi.Page} page
     */
    set: function(page){
      this.current = page;
      this.reset();
    },
    get enabled() {
      return this.pos > 1 || this.pos < -1;
    }
  };

  /**
   *
   * @constructor
   */
  Minobi.Potential = function() {

  };

  Minobi.Potential.prototype = {
    feedback: function() {

    }
  };

  /**
   * @param {HTMLDivElement} container
   * @param {[{path: string, width: number, height:number}]} chapter
   */
  Minobi.init = function(container, chapter) {
    /** @type {[Minobi.Page]} */
    var pages = [];
    for(var i=0;i < chapter.length; i++) {
      var image = new Minobi.Image(chapter[i].path, chapter[i].width, chapter[i].height);
      var page = new Minobi.Page([image], chapter[i].width, chapter[i].height);
      pages.push(page);
      if(i > 0) {
        pages[i-1].next = page;
        page.prev = pages[i-1];
      }
    }
    var viewer = new Minobi.Viewer(container, new Minobi.Chapter(pages));
    viewer.init();
  };
})();
