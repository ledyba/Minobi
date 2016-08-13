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
      img.element.src = url;
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
   * @param {number|undefined} initPage
   * @constructor
   */
  Minobi.Viewer = function(container, chapter, initPage) {
    initPage = initPage || 0;
    /** @type {HTMLDivElement} */
    this.container_ = container;
    this.chapter = chapter;
    this.cache_ = new Minobi.ImageCache(this, chapter);

    // Axis
    this.axis = this.makeXaxis(initPage);
    this.potential = new Minobi.StaticPotential(this.axis);
    this.cache_.enqueue(chapter.pages[initPage]);

    //
    this.container_.classList.add('minobi');
    this.container_.addEventListener('load', function() {
      this.render();
    }.bind(this));
  };

  Minobi.Viewer.prototype = {
    /**
     */
    init: function() {
      this.render();
      this.container_.addEventListener('keyup', function(event) {
        switch(event.keyCode) {
        case 38: //up - previous
          break;
        case 40: //down - next
          break;
        case 37:// left - next
          break;
        case 39: //right - previous
          break;
        }sus
      });
    },
    render: function() {
      var strategy = this.axis.strategy;
      var page = this.axis.current;
      var scale = strategy(this.container_.clientWidth/page.width, this.container_.clientHeight / page.height);
      page.elem.style.transform = 'scale('+scale+','+scale+')';
      page.attach(this.container_);
    },
    /**
     * @param {number} pageNum
     */
    makeXaxis: function(pageNum) {
      return new Minobi.Axis(this.chapter, this.chapter.pages[pageNum], 'width', Math.min);
    },
    /**
     * @param {number} pageNum
     */
    makeYaxis: function(pageNum) {
      return new Minobi.Axis(this.chapter, this.chapter.pages[pageNum], 'height', Math.max);
    }
  };

  /**
   * @param {Minobi.Chapter} chapter
   * @param {Minobi.Page} page
   * @param {!string} axis
   * @param {!function(number, number)} strategy
   * @constructor
   */
  Minobi.Axis = function(chapter, page, axis, strategy) {
    this.chapter = chapter;
    this.current = page;
    this.lastMoved = -1;
    this.pos = 0
    this.speed = 0;
    this.axis = axis;
    this.strategy = strategy;
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
   * @param {Minobi.Axis} axis
   * @constructor
   */
  Minobi.Potential = function(axis) {
    this.axis = axis;
  };

  Minobi.Potential.prototype = {
    feedback: function() {
      throw new Error("Please implement Potential#feedback");
    }
  };

  /**
   * @param {Minobi.Axis} axis
   * @constructor
   */
  Minobi.StaticPotential = function(axis) {
    Minobi.Potential.apply(this);
  };
  Minobi.StaticPotential.prototype = Object.create(Minobi.Potential.prototype, {
    feedback: function() {
      // Do not move at all.
    }
  });

  /**
   * @param {HTMLDivElement} container
   * @param {[{images: [{path: string, width: number, height:number}], width: number, height:number}]} chapterDef
   */
  Minobi.init = function(container, chapterDef) {
    /** @type {[Minobi.Page]} */
    var pages = [];
    for(var i=0;i < chapterDef.length; i++) {
      var pageDef = chapterDef[i];
      /** @type {[Minobi.Image]} */
      var images = [];
      for(var j = 0; j < pageDef.images.length; j++) {
        var imgDef = pageDef.images[j];
        var image = new Minobi.Image(imgDef.path, imgDef.width, imgDef.height);
        images.push(image);
      }
      var page = new Minobi.Page(images, pageDef.width, pageDef.height);
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
