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
        this.element_ = document.createElement("img");
        this.element_.onload = function() {
        };
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
    this.cluster_ = new Minobi.PageCluster(this);
  };
  Minobi.Viewer.prototype = {
    /**
     * @param {number|undefined} initPage
     */
    init: function(initPage) {
      /** @type {number} */
      this.pageIndex_ = initPage || 0;
      /** @type {number} */
      this.x_ = 0;
      /** @type {number} */
      this.y_ = 0;
    }
  };

  /**
   * @constructor
   */
  Minobi.Cursor = function() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.xy = 0;
  };

  /**
   * @param {Minobi.Viewer} viewer
   * @constructor
   */
  Minobi.PageCluster = function(viewer) {
    this.viewer_ = viewer;
    /** @type {Minobi.PagePosition[]} */
    this.pages_ = [];

    for(var i=0;i < viewer.chapter.pages.length; i++) {
      var pos = new Minobi.PagePosition(this, this.viewer_.chapter.pages[i]);
      this.pages_.push(pos);
    }
    var prev = null;
    for(var i=0;i < this.pages_.length; i++) {
      var next = i < this.pages_.length-1 ? this.pages_[i+1] : null;
      this.pages_[i].init(prev, next);
      prev = this.pages_[i];
    }
  };

  /**
  * @param {Minobi.PageCluster} cluster
  * @param {Minobi.Page} page
   * @constructor
   */
  Minobi.PagePosition = function(cluster, page) {
    this.cluster_ = cluster;
    this.page_ = page;
    /** @type {Minobi.PagePosition} */
    this.prev = null;
    /** @type {Minobi.PagePosition} */
    this.next = null;
    this.bottom_ = 0;
    this.left_ = 0;
  };
  Minobi.PagePosition.prototype = {
    /**
     * @param {Minobi.PagePosition} prev
     * @param {Minobi.PagePosition} next
     */
    init: function(prev, next) {
      this.prev_ = prev;
      this.next_ = next;
      if(prev) {
        this.bottom_ = prev.bottom_ - this.page_.height;
        this.left_   = prev.left_   - this.page_.width;
      } else {
        this.bottom_ = -this.page_.height;
        this.left_   = -this.page_.width;
      }
    },
    /**
     * @param {Minobi.Cursor} cursor
     */
    feedback: function(curcor) {
      var x = cursor.x - this.left_;
      var y = cursor.y - this.bottom_;
      if(x < 0 || x > this.page_.width) {
        console.warn("X-axis out of range");
        return;
      }
      if(y < 0 || y > this.page_.height) {
        console.warn("Y-axis out of range");
        return;
      }
      var deltaX = x - this.page_.width/2;
      var deltaY = y - this.page_.height/2;

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
      var page = new Minobi.Page(chapter[i].path, chapter[i].width, chapter[i].height);
      pages.push(page);
    }
    var viewer = new Minobi.Viewer(container, new Minobi.Chapter(pages));
    viewer.init();
  };
})();
