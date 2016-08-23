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
    /** @type {Minobi.ImageEntity} */
    this.entity = null;

    /** @type {HTMLImageElement} element */
    this.element = document.createElement('img');
  };
  Minobi.Image.prototype = {
    clear: function() {
      if(this.entity) {
        this.entity.delete();
        this.entity = null;
        this.element.src = "";
      }
    }
  };

  /**
   * @param {[Minobi.Image]} images
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
    get attached() {
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
    /** @param {number} v */
    set scale(scale) {
      this.scale_ = scale;
      this.elem.style.transform = 'scale('+scale+','+scale+')';
    },
    /** @return {number} scale */
    get scale() {
      return this.scale_;
    },
    /** @param {number} x */
    set x(x) {
      this.x_ = x;
      this.elem.style.left = x + 'px';
    },
    /** @return {number} x */
    get x() {
      return this.x_;
    },
    /** @param {number} x */
    set y(y) {
      this.y_ = y;
      this.elem.style.top = y + 'px';
    },
    /** @return {number} y */
    get y() {
      return this.y_;
    },
    /** @return {number} scaledWidth */
    get scaledWidth() {
      return this.scale_ * this.width;
    },
    /** @return {number} scaledHeight */
    get scaledHeight() {
      return this.scale_ * this.height;
    }
  };

  /**
   * @param {Minobi.Page[]} pages
   * @constructor
   */
   Minobi.Face = function(pages) {
     /** @type {Minobi.Page[]} pages */
     this.pages = pages;
     /** @type {number} */
     this.scale_ = 1.0;
     /** @type {HTMLDivElement} */
     this.outer_ = document.createElement('div');
     this.outer_.className = 'manga-face';
     /** @type {HTMLDivElement} */
     this.inner = document.createElement('div');
     this.inner.className = 'manga-face-inner';
     this.outer_.appendChild(this.inner);
     /** @type {Minobi.Page} */
     this.prevPage = pages[0].prev;
     /** @type {Minobi.Page} */
     this.nextPage = pages[pages.length-1].next;

     /** @type {Minobi.Face} */
     this.next = null;
     /** @type {Minobi.Face} */
     this.prev = null;

     this.width = 0;
     this.height = 0;

     this.x_ = 0;
   };
   Minobi.Face.prototype = {
     /**
      * @param {HTMLDivElement} container
      */
     attach: function(container) {
       if(container === this.outer_.parentElement) {
         console.warn("already attached");
         return;
       }
       container.appendChild(this.outer_);
       for(var i = 0; i < this.pages.length; i++) {
         var page = this.pages[i];
         page.attach(this.inner);
       }
     },
     /**
      * @param {HTMLDivElement} container
      */
     detach: function(container) {
       if(container !== this.outer_.parentElement) {
         console.warn("already detached");
         return;
       }
       container.removeChild(this.outer_);
       for(var i = 0; i < this.pages.length; i++) {
         var page = this.pages[i];
         page.detach(this.inner);
       }
     },
     /** @param {number} scale */
     set scale(scale) {
       this.scale_ = scale;
       this.inner.style.transform = 'scale('+scale+','+scale+')';
     },
     /** @return {number} scale */
     get scale() {
       return this.scale_;
     },
     /** @param {number} opacity */
     set opacity(opacity) {
       this.outer_.style.opacity = opacity;
     },
     /** @param {number} index */
     set zIndex(index) {
       this.outer_.style.zIndex = index;
     },
     /** @param {number} x */
     set x(x) {
       this.x_ = x;
       this.outer_.style.left = x + 'px';
     },
     /** @return {number} x */
     get x() {
       return this.x_;
     },
     /** @param {number} x */
     set y(y) {
       this.y_ = y;
       this.outer_.style.top = y + 'px';
     },
     /** @return {number} y */
     get y() {
       return this.y_;
     },
     /** @type {Minobi.Face} next */
     linkNext: function(next) {
       this.next = next;
       this.next.prev = this;
     },
     /** @type {Minobi.Face} prev */
     linkPrev: function(prev) {
       this.prev = prev;
       this.prev.next = this;
     },
     unlinkNext: function() {
       this.next.prev = null;
       this.next = null;
     },
     unlinkPrev: function() {
       this.prev.next = null;
       this.prev = null;
     },
     /**
      * @param {HTMLDivElement} container
      */
     layout: function(container) {
       /* Layout pages */
       var w = 0;
       for(var i = 0; i < this.pages.length; i++) {
         var page = this.pages[i];
         w += page.scaledWidth;
       }
       this.width = w;
       this.height = container.clientHeight;
       var offX  = (container.clientWidth - w) / 2;
       for(var i = this.pages.length-1; i >= 0; i--) {
         var page = this.pages[i];
         page.x = offX;
         page.y = (container.clientHeight - page.scaledHeight) / 2;
         offX += page.scaledWidth;
       }
     },
     /**
      * @param {Minobi.ImageCache} cache
      * @param {HTMLDivElement} container
      */
     render: function(cache, container) {
       /* Layout pages */
       for(var i = 0; i < this.pages.length; i++) {
         var page = this.pages[i];
         cache.enqueue(page);
       }
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
    /** @type {[Image]} */
    this.cacheList_ = [];
    /** @type {[Minobi.ImageLoader]} */
    this.workers_ = [];
    this.workerIdx_ = 0;
    for(var i = 0; i < Minobi.ImageCache.MAX_WORKER; i++) {
      this.workers_.push(new Minobi.ImageLoader(this));
    }
  };
  Minobi.ImageCache.MAX_IMAGE = 10;
  Minobi.ImageCache.MAX_WORKER = 5;

  Minobi.ImageCache.prototype = {
    /**
     * @param {Minobi.Page} page
     */
    enqueue: function(page) {
      for(var i=0; i < page.images.length; i++) {
        var img = page.images[i];
        if(img.entity) {
          // already loaded. push to the front of the list.
          var idx = this.cacheList_.indexOf(img);
          this.cacheList_.splice(idx, 1);
          this.cacheList_.push(img);
        } else {
          // Tell a worker to load the image with Ajax.
          this.workers_[this.workerIdx_].load(img);
          this.workerIdx_ = (this.workerIdx_ + 1) % Minobi.ImageCache.MAX_WORKER;
        }
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
    },
    /**
     * @param {Minobi.Image} img
     * @param {Minobi.ImageEntity} entity
     */
    onLoaded: function(img, entity) {
      img.element.src = entity.url;
      img.entity = entity;
      this.cacheList_.push(img);
      // Remove the least recent used image.
      if(this.cacheList_.length > Minobi.ImageCache.MAX_IMAGE) {
        var removedImage = this.cacheList_.shift();
        removedImage.clear();
      }
    }
  };

  /**
   * @param {Minobi.ImageCache} cache
   * @constructor
   */
  Minobi.ImageLoader = function(cache) {
    /** @type {XMLHttpRequest} this.xhr_ */
    this.xhr_ = null;
    this.cache_ = cache;
  };
  Minobi.ImageLoader.prototype = {
    /**
     * @param {Minobi.Image} img
     */
    load: function(img) {
      var self = this;
      if(this.xhr_) {
        this.xhr_.abort();
      }
      var xhr = new XMLHttpRequest();
      xhr.responseType = "arraybuffer";
      xhr.onreadystatechange = function onReadyStateChange() {
        if (xhr.readyState == 4) {
          self.xhr_ = null;
          if(xhr.status == 200) {
            self.cache_.onLoaded(img, new Minobi.ImageEntity(new Uint8Array(xhr.response)));
          }else{
            console.error("We can't load file: ", img.url, xhr);
          }
        }
      };
      xhr.open('GET', img.url, true);
      xhr.send(null);
      this.xhr_ = xhr;
    }
  };
  /**
   * @param {Uint8Array} data
   * @constructor
   */
  Minobi.ImageEntity = function(data) {
    /** @type {string} */
    this.url = URL.createObjectURL(new Blob([data], {type: 'image/webp'}));
  };
  Minobi.ImageEntity.prototype = {
    delete: function() {
      URL.revokeObjectURL(this.url);
      this.url = null;
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
    this.cache_.enqueue(chapter.pages[initPage]);

    //
    this.container_.classList.add('minobi');
    this.container_.addEventListener('load', function() {
      this.render();
    }.bind(this));
    //window.addEventListener('resize', function() {
    //  this.render();
    //}.bind(this));
  };

  Minobi.Viewer.prototype = {
    /**
     */
    init: function() {
      var self = this;
      this.seek(this.chapter.pages[0]);
      this.render();
      this.container_.addEventListener('mousemove', function(event) {
        if(event.buttons != 0) {
          self.axis.onMove(self, event.movementX, event.movementY);
          event.preventDefault();
        }
      });
      this.container_.addEventListener('keyup', function(event) {
        var reload = false;
        switch(event.keyCode) {
        case 38: //up - previous
          reload = this.axis.onUp(self);
          break;
        case 40: //down - next
          reload = this.axis.onDown(self);
          break;
        case 37:// left - next
          reload = this.axis.onLeft(self);
          break;
        case 39: //right - previous
          reload = this.axis.onRight(self);
          break;
        }
        if(reload) {
          this.render();
        }
      }.bind(this));
      this.container_.focus();
    },
    render: function() {
      this.axis.render(this.cache_, this.container_);
    },
    /**
     * @param {Minobi.Page} page
     */
    seek: function(page) {
      this.axis.seek(this.cache_, this.container_, page);
    },
    /** @returns {HTMLDivElement} container */
    get container() {
      return this.container_;
    },
    /** @returns {Minobi.ImageCache} cache */
    get cache() {
      return this.cache_;
    },
    makeHorizontalAxis: function() {
      return new Minobi.HorizontalAxis(this.chapter);
    },
    makeVertivalAxis: function() {
      return new Minobi.VerticalAxis(this.chapter);
    }
  };

  /**
   * @param {Minobi.Chapter} chapter
   * @constructor
   */
  Minobi.Axis = function(chapter) {
    this.chapter_ = chapter;
  };

  Minobi.Axis.prototype = {
    /**
     * @param {Minobi.ImageCache} cache
     * @param {HTMLDivElement} container
     * @param {Minobi.Page} page
     */
    seek: function(cache, container, page){
      throw new Error("Please implement Minobi.Axis.seek");
    },
    /**
     * @param {Minobi.ImageCache} cache
     * @param {HTMLDivElement} container
     */
    render: function(cache, container) {
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
     * @param {Minobi.Viewer} viewer
     * @return {boolean} reload
     */
    onDown: function(viewer) {
      return false;
    },
    /**
     * @param {Minobi.Viewer} viewer
     * @return {boolean} reload
     */
    onLeft: function(viewer) {
      return false;
    },
    /**
     * @param {Minobi.Viewer} viewer
     * @return {boolean} reload
     */
    onRight: function(viewer) {
      return false;
    },
    /**
     * @param {Minobi.Viewer} viewer
     * @param {number} dx
     * @param {number} dy
     * @return {boolean} reload
     */
    onMove: function(viewer, dx, dy) {
      return false;
    }
  };

  /**
   * @param {Minobi.Chapter} chapter
   * @extends {Minobi.Axis}
   * @constructor
   */
  Minobi.HorizontalAxis = function(chapter) {
    Minobi.Axis.call(chapter);
    /** @type {Minobi.Face} */
    this.current_ = null;
    /** @type {number} */
    this.pos_ = 0;
    /** @type {number} */
    this.speed_ = 0;
  };

  Minobi.HorizontalAxis.prototype = Object.create(Minobi.Axis.prototype, {
    seek: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       * @override
       */
      value: function(cache, container, page) {
        this.current_ = this.makeFace_(container, page);
        this.current_.attach(container);
        if(this.current_.nextPage) {
          this.current_.linkNext(this.makeFace_(container, this.current_.nextPage));
          this.current_.next.attach(container);
        }
        if(this.current_.prevPage) {
          this.current_.linkPrev(this.makePrevFace_(container, this.current_.prevPage));
        }
        this.pos_ = 0;
        this.speed_ = 0;
      }
    },
    seekPrev: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       * @override
       */
      value: function(cache, container, page) {
        this.current_.detach(container);
        if(this.current_.prev) {
          this.current_.prev.detach(container);
        }
        if(this.current_.next) {
          this.current_.next.detach(container);
        }
        this.current_ = this.makePrevFace_(container, page);
        this.current_.attach(container);
        if(this.current_.nextPage) {
          this.current_.linkNext(this.makeFace_(container, this.current_.nextPage));
          this.current_.next.attach(container);
        }
        if(this.current_.prevPage) {
          this.current_.linkPrev(this.makePrevFace_(container, this.current_.prevPage));
        }
        this.pos_ = 0;
        this.speed_ = 0;
      }
    },
    makeFace_: {
      /**
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       */
      value: function(container, page) {
        page.scale = this.calcScale_(container, page);
        var next = page.next;
        if(next) {
          next.scale = this.calcScale_(container, next);
          if(next.scaledWidth + page.scaledWidth <= container.clientWidth) {
            // make a face with 2 pages.
            var face = new Minobi.Face([page, next]);
            face.layout(container);
            return face;
          }
        }
        // make a face with a single page.
        var face = new Minobi.Face([page]);
        face.layout(container);
        return face;
      }
    },
    makePrevFace_: {
      /**
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       */
      value: function(container, page) {
        page.scale = this.calcScale_(container, page);
        var prev = page.prev;
        if(prev) {
          prev.scale = this.calcScale_(container, prev);
          if(prev.scaledWidth + page.scaledWidth <= container.clientWidth) {
            // make a face with 2 pages.
            var face = new Minobi.Face([prev, page]);
            face.layout(container);
            return face;
          }
        }
        // make a face with a single page.
        var face = new Minobi.Face([page]);
        face.layout(container);
        return face;
      }
    },
    calcScale_: {
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
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @override
       */
      value: function(cache, container) {
        // update faces pagination.
        if(this.pos_ > 1) {
          if(this.current_.nextPage) {
            this.pos_ -= 1.0;
            this.current_.detach(container);
            if(this.current_.prev) {
              this.current_.unlinkPrev();
            }
            this.current_ = this.current_.next;
            if(this.current_.nextPage) {
              this.current_.linkNext(this.makeFace_(container, this.current_.nextPage));
              this.current_.next.attach(container);
            }
          } else {
            this.pos_ = 1.0;
          }
        } else if(this.pos_ < 0) {
          if(this.current_.prevPage) {
            this.pos_ += 1.0;
            this.current_.next.detach(container);
            if(this.current_.next) {
              this.current_.unlinkNext();
            }
            this.current_ = this.current_.prev;
            this.current_.attach(container);
            if(this.current_.prevPage) {
              this.current_.linkPrev(this.makePrevFace_(container, this.current_.prevPage));
            }
          } else {
            this.pos_ = 0.0;
          }
        }

        // set opacity and scale for animation, then render faces.
        this.current_.scale = (1 - this.pos_)*0.25 + 0.75;
        this.current_.opacity = 1 - this.pos_;
        this.current_.render(cache, container);
        this.current_.zIndex = 1;
        if(this.current_.next) {
          this.current_.next.x = (this.pos_ - 1) * container.clientWidth;
          this.current_.next.opacity = 1;
          this.current_.next.zIndex = 2;
          this.current_.next.render(cache, container);
        }
        if(this.current_.prev) {
          this.current_.prev.zIndex = 0;
          this.current_.prev.opacity = 0;
          this.current_.prev.render(cache, container);
        }
      }
    },
    onLeft: {
      /**
       * @param {Minobi.Viewer} viewer
       * @return {boolean} reload
       * @override
       */
      value: function(viewer) {
        var cache = viewer.cache;
        var container = viewer.container;
        if(this.current_.nextPage) {
          this.seek(cache, container, this.current_.nextPage);
          return true;
        } else {
          return false;
        }
      }
    },
    onRight: {
      /**
       * @param {Minobi.Viewer} viewer
       * @return {boolean} reload
       * @override
       */
      value: function(viewer) {
        var cache = viewer.cache;
        var container = viewer.container;
        if(this.current_.prev) {
          this.seekPrev(cache, container, this.current_.prevPage);
          return true;
        } else {
          return false;
        }
      }
    },
    onMove: {
      /**
       * @param {Minobi.Viewer} viewer
       * @param {number} dx
       * @param {number} dy
       * @return {boolean} reload
       * @override
       */
      value: function onMove(viewer, dx, dy) {
        var cache = viewer.cache;
        var container = viewer.container;
        var deltaX = dx / container.clientWidth;
        this.pos_ += deltaX;
        this.render(cache, container);
        return true;
      }
    }
  });

  /**
   * @param {Minobi.Chapter} chapter
   * @param {Minobi.Page} page
   * @extends {Minobi.Axis}
   * @constructor
   * // TODO: 縦の実装
   */
  Minobi.VerticalAxis = function(chapter, page) {
    Minobi.Axis.call(this, chapter, page);
  };
  Minobi.VerticalAxis.prototype = Object.create(Minobi.Axis.prototype, {
    seek: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       * @override
       */
      value: function(cache, container, page) {
      }
    },
    render: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @override
       */
      value: function(cache, container) {
      }
    },
    onDown: {
      /**
       * @param {Minobi.Viewer} viewer
       * @return {boolean} reload
       */
      value: function(viewer) {
        if(this.current_.next) {
          this.seek(this.current_.next);
          return true;
        } else {
          return false;
        }
      }
    },
    onUp: {
      /**
       * @param {Minobi.Viewer} viewer
       * @return {boolean} reload
       */
      value: function(viewer) {
        if(this.current_.prev) {
          this.seek(this.current_.prev);
          return true;
        } else {
          return false;
        }
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
