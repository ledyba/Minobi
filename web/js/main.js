(function(){
  var Minobi = {};

  /*** Data Model ***/

  window.Minobi = Minobi;

  /**
   * @param {string} url
   * @param {number} width
   * @param {number} height
   */
  Minobi.Page = function(url, width, height) {
    /** @type {string} */
    this.url = url;
    /** @type {number} */
    this.width = width;
    /** @type {number} */
    this.height = height;
    /** @type {Minobi.Page} */
    this.prev = null;
    /** @type {Minobi.Page} */
    this.next = null;
    /** @type {HTMLImageElement} */
    this.elem = null;
  };
  Minobi.Page.prototype = {
    /**
     * @param {HTMLDivElement} container
     */
    attach: function(container) {
      if(!this.elem) {
        console.error("Null elem.");
        return;
      } else if(container === this.elem.parentElement) {
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
      } else if(container === this.elem.parentElement) {
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
    /** @type {Minobi.ImageCache.Entry[]} */
    this.entries_ = [];
    for(var i = 0;i < chapter.pages.length; i++) {
      var page = chapter.pages[i];
      var ent = new Minobi.ImageCache.Entry(page);
      this.entries_.push(ent);
    }
  };
  /**
   * @param {Minobi.Page} page
   * @constructor
   */
  Minobi.ImageCache.Entry = function(page) {
    /** @type {Minobi.Page} */
    this.page_ = page;
    /** @type {HTMLImageElement} */
    this.element_ = null;
  };
  Minobi.ImageCache.Entry.prototype = {
    load: function() {
      if(!this.element_) {
        /** @type {HTMLImageElement} */
        this.element_ = document.createElement("img");
        this.element_.className = 'manga-page';
        this.element_.src = this.page_.url;
      }
    },
    clear: function() {
      if(this.element_) {
        this.element_.src = "";
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
    /** @type {Minobi.Chapter} */
    this.chapter = chapter;
    this.cache_ = new Minobi.ImageCache(this, chapter);
    var self = this;
    this.container_.addEventListener('load', function() {
      self.render();
    });
    /** @type {Minobi.Cursor} */
    this.cursor_ = new Minobi.Cursor(this.chapter.pages[0]);
  };
  Minobi.Viewer.prototype = {
    /**
     * @param {number|undefined} initPage
     */
    init: function(initPage) {
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
    this.pos = 0;
  };
  Minobi.Axis.prototype = {
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
   * @param {Minobi.Viewer} viewer
   * @param {Minobi.Page} page
   * @constructor
   */
  Minobi.Cursor = function(viewer, page) {
    this.viewer = viewer;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.xy = 0;
    /** @type {Minobi.Page} */
    this.page = page;
    this.lastMoved = -1;
  };
  Minobi.Cursor.prototype = {
    /**
     * @param {Minobi.Cursor} cursor
     */
    feedback: function() {
      var hwidth = this.page.width/2;
      var hheight = this.page.height/2;
      var absX = Math.abs(this.x);
      var absY = Math.abs(this.y);
      if(this.lastMoved < 0) {
        this.lastMoved = new Date().getTime();
      }
      var now = new Date().getTime();
      var deltaT = (now - this.lastMoved) / 1000.0;
      this.lastMoved = now;
      if(absX > Minobi.Cursor.Epsilon){
        // Sliding on X-axis
        this.vx -= Minobi.Cursor.Spring * this.x;
        var diff = this.vx * deltaT;
        this.x += diff;
        if(this.x * (this.x - diff) < 0) {
          this.vx = 0;
          this.x = 0;
        } else if(this.x < -hwidth) {
          if(this.page.next) {
            this.page.next.detatch(this.viewer.container_);
          }
          this.page = this.page.prev;
          this.x += hwidth + (this.page.width/2);
        } else if (this.x > hwidth) {
          if(this.page.prev) {
            this.page.prev.detatch(this.viewer.container_);
          }
          this.page = this.page.next;
          this.x -= hwidth + (this.page.width/2);
        }

        // do not slide on y-axis.
        this.vy = 0;
        this.y = 0;
      } else if(absY > Minobi.Cursor.Epsilon) {
        // Sliding on X-axis
        this.vy -= Minobi.Cursor.Spring * this.y;
        var diff = this.vy * deltaT;
        this.y += diff;
        if(this.y * (this.y - diff) < 0) {
          this.vy = 0;
          this.y = 0;
        } else if(this.y < -hheight) {
          this.page = this.page.prev;
          this.y += hheight + (this.page.height/2);
        } else if (this.y > hheight) {
          this.page = this.page.next;
          this.y -= hheight + (this.page.height/2);
        }

        // do not slide on y-axis.
        this.vx = 0;
        this.x = 0;
      } else {
      }
    },
    /**
     * @param {number} dx
     * @param {number} dy
     */
    move: function(dx, dy) {
      var absX = Math.abs(this.x);
      var absY = Math.abs(this.y);
      if(absX > Minobi.Cursor.Epsilon){
        this.x += dx;
        this.vx = 0;
      } else if(absY > Minobi.Cursor.Epsilon) {
        this.y += dy;
        this.vy = 0;
      }
    }
  }
  Minobi.Cursor.Epsilon = 1;
  Minobi.Cursor.Spring = 0.1;

  /**
   * @param {HTMLDivElement} container
   * @param {[{path: string, width: number, height:number}]} chapter
   */
  Minobi.init = function(container, chapter) {
    /** @type {[Minobi.Page]} */
    var pages = [];
    for(var i=0;i < chapter.length; i++) {
      var page = new Minobi.Page(chapter[i].path, chapter[i].width, chapter[i].height);
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
