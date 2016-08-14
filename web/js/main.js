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
    this.scale_ = 1;
    this.x_ = 0;
    this.y_ = 0;
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
    /** @type {HTMLDivElement} */
    var inner = document.createElement('div');
    inner.className = 'manga-page';
    this.elem.appendChild(inner);
    /** @type {!HTMLDivElement[]} */
    this.imageContainers = [];
    var left = 0;
    for(var i = 0; i < this.images.length; i++) {
      /** @type {HTMLDivElement} */
      var img = images[i];
      var elem = img.element;
      elem.classList.add('manga-page-wrap');
      this.imageContainers.push(elem);
      inner.appendChild(elem);
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
    },
    /**
     * @param {number} v
     */
    set scale(scale) {
      this.scale_ = scale;
      this.elem.style.transform = 'scale('+scale+','+scale+')';
    },
    /**
     * @return {number} scale
     */
    get scale() {
      return this.scale_;
    },
    /**
     * @param {number} x
     */
    set x(x) {
      this.x_ = x;
      this.elem.style.left = x + 'px';
    },
    /**
     * @return {number} x
     */
    get x() {
      return this.x_;
    },
    /**
     * @param {number} x
     */
    set y(y) {
      this.y_ = y;
      this.elem.style.top = y + 'px';
    },
    /**
     * @return {number} y
     */
    get y() {
      return this.y_;
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
    this.axis = this.makeHorizontalAxis(initPage);
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
        var reload = false;
        switch(event.keyCode) {
        case 38: //up - previous
          reload = this.axis.onUp();
          break;
        case 40: //down - next
          reload = this.axis.onDown();
          break;
        case 37:// left - next
          reload = this.axis.onLeft();
          break;
        case 39: //right - previous
          reload = this.axis.onRight();
          break;
        }
        if(reload) {
          this.render();
        }
      }.bind(this));
    },
    render: function() {
      this.axis.render(this);
    },
    /**
     * @param {Minobi.Page} page
     * @return {boolean} r
     */
    renderPage: function(page, deltaX, deltaY) {
      var scale = this.axis.calcScale(this.container_, page);
      var w = page.width * scale;
      var h = page.height * scale;
      var offX = (this.container_.clientWidth - w) / 2;
      var offY = (this.container_.clientHeight - h) / 2;
      page.scale = scale;
      page.x = offX + deltaX;
      page.y = offY + deltaY;
      var out =
        page.x + w <= 0 || page.x >= this.container_.clientWidth ||
        page.y + h <= 0 || page.y >= this.container_.clientHeight;
      if(!out) {
        page.attach(this.container_);
      }
      this.cache_.enqueue(page);
      return !out;
    },
    /**
     * @param {number} pageNum
     */
    makeHorizontalAxis: function(pageNum) {
      return new Minobi.HorizontalAxis(this.chapter, this.chapter.pages[pageNum]);
    },
    /**
     * @param {number} pageNum
     */
    makeVertivalAxis: function(pageNum) {
      return new Minobi.VerticalAxis(this.chapter, this.chapter.pages[pageNum]);
    }
  };

  /**
   * @param {Minobi.Chapter} chapter
   * @param {Minobi.Page} page
   * @constructor
   */
  Minobi.Axis = function(chapter, page) {
    this.chapter = chapter;
    /** @type {Minobi.Page} */
    this.current = page;
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
     * @param {HTMLDivElement} container
     * @param {Minobi.Page} page
     */
    calcScale: function(container, page) {
      throw new Error("Please implement Minobi.Axis.calcScale");
    },
    /**
     * @param {!Minobi.Page} page
     */
    set: function(page){
      this.current = page;
      this.reset();
    },
    /**
     * @param {Minobi.Viewer} viewer
     */
    render: function(viewer) {
      throw new Error("Please implement Minobi.Axis.render");
    },
    /**
     * @param {Minobi.Viewer} viewer
     * @return {boolean} reload
     */
    onUp: function(viewer) {
      return false;
    },
    /**
     * @return {boolean} reload
     */
    onDown: function(viewer) {
    },
    /**
     * @return {boolean} reload
     */
    onLeft: function(viewer) {
    },
    /**
     * @return {boolean} reload
     */
    onRight: function(viewer) {
    }
  };

  /**
   * @param {Minobi.Chapter} chapter
   * @param {Minobi.Page} page
   * @extends {Minobi.Axis}
   * @constructor
   */
  Minobi.HorizontalAxis = function(chapter, page) {
    Minobi.Axis.call(this, chapter, page);
  };

  Minobi.HorizontalAxis.prototype = Object.create(Minobi.Axis.prototype, {
    calcScale: {
      /**
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       */
      value: function(container, page) {
        return Math.min(container.clientWidth / page.width, container.clientHeight / page.height);
      }
    },
    render: {
      /**
       * @param {Minobi.Viewer} viewer
       */
      value: function(viewer) {
        var dx = this.pos;
        viewer.renderPage(this.current, dx, 0);
        var offX = dx - (this.current.width * this.current.scale);
        for(var page = this.current.next; !!page; page = page.next) {
          if(!viewer.renderPage(page, offX, 0)) {
            break;
          }
          offX += -(page.width * page.scale);
        }
        offX = dx + (this.current.width * this.current.scale);
        for(var page = this.current.prev; !!page; page = page.prev) {
          if(!viewer.renderPage(page, offX, 0)) {
            break;
          }
          offX += (page.width * page.scale);
        }
      }
    },
    onLeft: {
      /**
       * @return {boolean} reload
       */
      value: function() {
        if(this.current.next) {
          this.set(this.current.next);
          return true;
        } else {
          return false;
        }
      }
    },
    onRight: {
      /**
       * @return {boolean} reload
       */
      value: function() {
        if(this.current.prev) {
          this.set(this.current.prev);
          return true;
        } else {
          return false;
        }
      }
    }
  });

  /**
   * @param {Minobi.Chapter} chapter
   * @param {Minobi.Page} page
   * @extends {Minobi.Axis}
   * @constructor
   */
  Minobi.VerticalAxis = function(chapter, page) {
    Minobi.Axis.call(this, chapter, page);
  };
  Minobi.VerticalAxis.prototype = Object.create(Minobi.Axis.prototype, {
    calcScale: {
      /**
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       */
        value: function(container, page) {
        return container.clientWidth / page.width;
      }
    },
    render: {
      /**
       * @param {Minobi.Viewer} viewer
       */
      value: function(viewer) {
        //TODO: implement vertical.
        //基本的にはページの頭がブラウザ上でも頭に来るようにレンダリングすればOK
        viewer.renderPage(this.current, 0, 0);
      }
    },
    onDown: {
      /**
       * @return {boolean} reload
       */
      value: function() {
        if(this.current.next) {
          this.set(this.current.next);
          return true;
        } else {
          return false;
        }
      }
    },
    onUp: {
      /**
       * @return {boolean} reload
       */
      value: function() {
        if(this.current.prev) {
          this.set(this.current.prev);
          return true;
        } else {
          return false;
        }
      }
    }
  });

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
    Minobi.Potential.call(this);
  };
  Minobi.StaticPotential.prototype = Object.create(Minobi.Potential.prototype, {
    feedback: {
      value: function() {
        // Do not move at all.
      }
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
