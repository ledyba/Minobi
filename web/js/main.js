(function(){
  var Minobi = {};

  /**
   * @param {TouchList} touchList
   * @param {number} identifier
   * @returns {Touch} touch
   */
  Minobi.findTouchEvent = function(touchList, identifier){
    // https://www.w3.org/TR/touch-events/
    for(var i = 0; i < touchList.length; i++) {
      if(touchList[i].identifier == identifier) {
        return touchList[i];
      }
    }
    return null;
  };

  /*** Data Model ***/

  window.Minobi = Minobi;

  /**
   * @param {string} url
   * @param {number} width
   * @param {number} height
   * @param {Uint8Array} key
   * @constructor
   */
  Minobi.Image = function(url, width, height, key) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.key = key || null;
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
   * @param {number} idx
   * @param {[Minobi.Image]} images
   * @param {number} width
   * @param {number} height
   * @constructor
   */
  Minobi.Page = function(idx, images, width, height) {
    this.idx = idx;
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
    this.elem.style.width = this.width+'px';
    this.elem.style.height = this.height+'px';
    this.elem.style.left = '0px';
    this.elem.style.top = '0px';
    this.elem.style.transformOrigin = '0% 0%';
    this.elem.style['-webkit-transformOrigin'] = '0% 0%';
    /** @type {!HTMLDivElement[]} */
    this.imageContainers = [];
    var left = 0;
    for(var i = 0; i < this.images.length; i++) {
      /** @type {HTMLImageElement} */
      var img = images[i];
      var elem = img.element;
      elem.classList.add('manga-image');
      this.imageContainers.push(elem);
      this.elem.appendChild(elem);
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
    transform: function(scale, dx, dy) {
      this.scale_ = scale;
      this.x_ = dx;
      this.y_ = dy;
      var trans = 'scale('+scale+') translate('+dx+'px, '+dy+'px)';
      this.elem.style.transform = trans;
      this.elem.style['-webkit-transform'] = trans;
    },
    /** @return {number} scale */
    get scale() {
      return this.scale_;
    },
    /** @return {number} x */
    get x() {
      return this.x_;
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
     this.elem_ = document.createElement('div');
     this.elem_.className = 'manga-face';
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
     this.y_ = 0;
   };
   Minobi.Face.prototype = {
     get attached() {
       return !this.elem_ || !!this.elem_.parentElement;
     },
     /**
      * @param {HTMLDivElement} container
      */
     attach: function attach(container) {
       if(container === this.elem_.parentElement) {
         console.warn("already attached");
         return;
       }
       container.appendChild(this.elem_);
       for(var i = 0; i < this.pages.length; i++) {
         var page = this.pages[i];
         page.attach(this.elem_);
       }
     },
     /**
      * @param {HTMLDivElement} container
      */
     detach: function detach(container) {
       if(container !== this.elem_.parentElement) {
         console.warn("already detached");
         return;
       }
       container.removeChild(this.elem_);
       for(var i = 0; i < this.pages.length; i++) {
         var page = this.pages[i];
         page.detach(this.elem_);
       }
     },
     /** @param {number} opacity */
     set opacity(opacity) {
       this.elem_.style.opacity = opacity;
     },
     /** @param {number} index */
     set zIndex(index) {
       this.elem_.style.zIndex = index;
     },
     transform: function(scale, dx, dy) {
       this.scale_ = scale;
       this.x_ = dx;
       this.y_ = dy;
       var trans = 'scale('+scale+') translate('+dx+'px, '+dy+'px)';
       this.elem_.style.transform = trans;
       this.elem_.style['-webkit-transform'] = trans;
     },
     /** @return {number} scale */
     get scale() {
       return this.scale_;
     },
     /** @return {number} x */
     get x() {
       return this.x_;
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
       this.height = container.clientHeight_;
       var offX  = (container.clientWidth_ - w) / 2;
       for(var i = this.pages.length-1; i >= 0; i--) {
         var page = this.pages[i];
         page.transform(page.scale, offX / page.scale, (container.clientHeight_ - page.scaledHeight) / 2);
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
    /** @type {Object.<string, boolean>} this.xhr_ */
    this.enqueued_ = {};
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
          if(!!this.enqueued_[img.url]) {
            console.warn("Already enqueued: ", img.url);
            continue;
          }
          this.enqueued_[img.url] = true;
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
      delete this.enqueued_[img.url];
      img.element.src = entity.url;
      img.entity = entity;
      this.cacheList_.push(img);
      // Remove the least recent used image.
      if(this.cacheList_.length > Minobi.ImageCache.MAX_IMAGE) {
        var removedImage = this.cacheList_.shift();
        removedImage.clear();
      }
    },
    /**
     * @param {Minobi.Image} img
     */
    onAborted: function(img) {
      delete this.enqueued_[img.url];
    },
    /**
     * @param {Minobi.Image} img
     */
    onError: function(img) {
      delete this.enqueued_[img.url];
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
        console.warn("Request aborted: ", this.xhr_.img.url);
        this.xhr_.onreadystatechange = null;
        this.xhr_.abort();
        this.cache_.onAborted(this.xhr_.img);
      }
      var xhr = new XMLHttpRequest();
      xhr.img = img;
      xhr.responseType = "arraybuffer";
      xhr.onreadystatechange = function onReadyStateChange() {
        if (xhr.readyState == 4) {
          self.xhr_ = null;
          if(xhr.status == 200) {
            var dat = new Uint8Array(xhr.response);
            if(img.key) {
              var n = img.key.length;
              for(var i = 0; i < dat.length; i++) {
                dat[i] ^= img.key[i % n];
              }
            }
            self.cache_.onLoaded(img, new Minobi.ImageEntity(dat));
          }else{
            console.error("We can't load file: ", img.url, xhr);
            self.cache_.onError(img);
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

    /** @type {SeekBar} seekbar_ */
    this.seekbar_ = null;

    /** @type {number} maxTapDistance_ */
    this.maxTapDistance_ = 0;
    /** @type {number} emInPx_ */
    this.emInPx_ = 0;

    /** @type {Object.<string, [function()]>} */
    this.listeners_ = {};
    this.listeners_['pageenter'] = [];
  };

  Minobi.Viewer.prototype = {
    /**
     * @param {function(Minobi.Viewer)} clbk
     */
    init: function(clbk) {
      var self = this;
      var clicked = false;

      // Mouse
      var firstMouseX = 0;
      var firstMouseY = 0;
      var lastMouseX = 0;
      var lastMouseY = 0;
      var mouseStart = 0;
      var mouseUp = function(event) {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mouseleave', mouseUp);
        if(clicked) {
          event.preventDefault();
          clicked = false;
          var dx = event.clientX - firstMouseX;
          var dy = event.clientY - firstMouseY;
          var duration = ((event.timeStamp - mouseStart) / 1000);
          var vx = (dx / self.emInPx_) / duration;
          var vy = (dy / self.emInPx_) / duration;
          var isTap = Math.max(Math.abs(dx), Math.abs(dy)) < self.maxTapDistance_;
          self.axis.onMoveEnd(self, isTap,
            (event.clientX - self.container_.boundingLeft_) / self.container_.clientWidth_,
            (event.clientY - self.container_.boundingTop_) / self.container_.clientHeight_,
            duration,
            vx,
            vy);
        }
      };
      var mouseMove = function(event) {
        if(clicked) {
          event.preventDefault();
          self.axis.onMove(self, event.clientX - lastMouseX, event.clientY - lastMouseY);
          lastMouseX = event.clientX;
          lastMouseY = event.clientY;
        }
      };
      var mouseDown = function(event) {
        if(event.buttons != 0 && !clicked) {
          event.preventDefault();
          clicked = true;
          self.axis.onMoveStart(self);
          firstMouseX = lastMouseX = event.clientX;
          firstMouseY = lastMouseY = event.clientY;
          mouseStart = event.timeStamp;
          window.addEventListener('mousemove', mouseMove);
          window.addEventListener('mouseup', mouseUp);
          window.addEventListener('mouseleave', mouseUp);
        }
      };
      this.container_.addEventListener('mousedown', mouseDown);

      // Touch
      var touch = null;
      var touchStart = 0;
      var firstTouchX = 0;
      var firstTouchY = 0;
      var lastTouchX = 0;
      var lastTouchY = 0;
      var touchStart = function(event) {
        if(!clicked && !!event.targetTouches[0]) {
          event.preventDefault();
          clicked = true;
          self.axis.onMoveStart(self);
          window.addEventListener('touchmove', touchMove, {passive: true});
          window.addEventListener('touchend', touchEnd, false);
          window.addEventListener('touchleave', touchEnd, false);
          window.addEventListener('touchcancel', touchEnd, false);
          touch = event.targetTouches[0];
          firstTouchX = lastTouchX = touch.clientX;
          firstTouchY = lastTouchY = touch.clientY;
          touchStart = event.timeStamp;
        }
      };
      var touchEnd = function(event) {
        window.removeEventListener('touchmove', touchMove);
        window.removeEventListener('touchend', touchEnd);
        window.removeEventListener('touchleave', touchEnd);
        window.removeEventListener('touchcancel', touchEnd);
        if(clicked) {
          event.preventDefault();
          lastTouchX = touch.clientX;
          lastTouchY = touch.clientY;
          self.axis.onMoveEnd(self);
          var dx = lastTouchX - firstTouchX;
          var dy = lastTouchY - firstTouchY;
          var isTap = Math.max(Math.abs(dx), Math.abs(dy)) < self.maxTapDistance_;
          var duration = (event.timeStamp - touchStart) / 1000;
          var vx = (dx / self.emInPx_) / duration;
          var vy = (dy / self.emInPx_) / duration;
          self.axis.onMoveEnd(self, isTap,
            (lastTouchX - self.container_.boundingLeft_) / self.container_.clientWidth_,
            (lastTouchY - self.container_.boundingTop_) / self.container_.clientHeight_,
            duration,
            vx,
            vy);
        }
        clicked = false;
        touch = null;
        firstTouchX = lastTouchX = 0;
        firstTouchY = lastTouchY = 0;
        touchStart = 0;
      };
      lastMoved = new Date().getTime();
      var touchMove = function(event) {
        if(!clicked) {
          return;
        }
        var now = new Date().getTime();
        if(now - lastMoved < 10) {
          return;
        }
        lastMoved = now;
        var ntouch = Minobi.findTouchEvent(event.touches, touch.identifier);
        if(!ntouch) {
          return;
        }
        touch = ntouch;
        self.axis.onMove(self, touch.clientX - lastTouchX, touch.clientY - lastTouchY);
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
      };
      this.container_.addEventListener('touchstart', touchStart, false);

      // keyboard
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
      var onDomContentLoaded = function(){
        window.removeEventListener('DOMContentLoaded', onDomContentLoaded);
        self.container_.clientWidth_ = self.container_.clientWidth;
        self.container_.clientHeight_ = self.container_.clientHeight;
        var rect = self.container_.getBoundingClientRect();
        self.container_.boundingLeft_ = rect.left;
        self.container_.boundingTop_ = rect.top;
        self.seek(self.chapter.pages[0]);
        self.render();
        window.addEventListener('resize', function() {
          self.container_.clientWidth_ = self.container_.clientWidth;
          self.container_.clientHeight_ = self.container_.clientHeight;
          var rect = self.container_.getBoundingClientRect();
          self.container_.boundingLeft_ = rect.left;
          self.container_.boundingTop_ = rect.top;
          self.seek(self.axis.currentPages[0]);
          self.render();
        });
      };
      var onLoad = function() {
        window.removeEventListener('load', onLoad);
        self.emInPx_ = parseFloat(getComputedStyle(window.document.body).fontSize);
        self.maxTapDistance_ = self.emInPx_ * 3;
        self.container_.focus();
      };
      window.addEventListener('DOMContentLoaded', onDomContentLoaded);
      window.addEventListener('load', onLoad);
      if(clbk) {
        clbk(this);
      }
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
    /** @param {SeekBar} seekbar*/
    set seekbar(seekbar) {
      var self = this;
      /** @param {number} value */
      seekbar.onChanged = function(value) {
        self.seek(self.chapter.pages[value]);
        self.render();
      };
      this.seekbar_ = seekbar;
    },
    /**
     * @param {string} name
     * @param {function} clbk
     */
    addEventListener: function(name, clbk) {
      /** @type {[function]} list */
      var list = this.listeners_[name];
      if(!list){
        throw new Error("Unknown event name: " + name);
      }
      if(list.indexOf(clbk) >= 0) {
        console.warn("The given listener was already registered.");
        return;
      }
      list.push(clbk);
    },
    /**
     * @param {string} name
     * @param {function} clbk
     */
    removeEventListener: function(name, clbk) {
      /** @type {[function]} list */
      var list = this.listeners_[name];
      if(!list){
        throw new Error("Unknown event name: " + name);
      }
      var idx = list.indexOf(clbk);
      if(idx < 0) {
        console.warn("The given listener was not registered.");
        return;
      }
      list.splice(idx, 1);
    },
    /**
     * @param {[number]} pages
     * @protected
     */
    onPageEnter_: function(pages) {
      if(pages.length > 0) {
        /** @type {[function()]} listeners */
        var listeners = this.listeners_['pageenter'];
        for(var i = 0; i < listeners.length; i++) {
          listeners[i](pages);
        }
        this.seekbar.move(pages[0]);
      }
    },
    get seekbar() {
      return this.seekbar_;
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
      var axis = new Minobi.HorizontalAxis(this.chapter);
      axis.addEventListener('pageenter', this.onPageEnter_.bind(this));
      return axis;
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

    /** @type {Object.<string, [function()]>} */
    this.listeners_ = {};
    this.listeners_['pageenter'] = [];
  };

  Minobi.Axis.prototype = {
    /**
     * @param {Minobi.ImageCache} cache
     * @param {HTMLDivElement} container
     * @param {Minobi.Page} page
     */
    seek: function(cache, container, page) {
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
    },
    /**
     * @param {Minobi.Viewer} viewer
     * @param {boolean} isTap
     * @param {number} lastRelX
     * @param {number} lastRelY
     * @param {number} duration
     * @param {number} speedXinEm
     * @param {number} speedYinEm
     */
    onMoveEnd: function(viewer, isTap, lastRelX, lastRelY, duration, speedXinEm, speedYinEm) {
      return false;
    },
     /**
      * @param {Minobi.Viewer} viewer
      */
    onMoveStart: function(viewer) {
      return false;
    },
    /**
     * @param {string} name
     * @param {function} clbk
     */
    addEventListener: function(name, clbk) {
      /** @type {[function]} list */
      var list = this.listeners_[name];
      if(!list){
        throw new Error("Unknown event name: " + name);
      }
      if(list.indexOf(clbk) >= 0) {
        console.warn("The given listener was already registered.");
        return;
      }
      list.push(clbk);
    },
    /**
     * @param {string} name
     * @param {function} clbk
     */
    removeEventListener: function(name, clbk) {
      /** @type {[function]} list */
      var list = this.listeners_[name];
      if(!list){
        throw new Error("Unknown event name: " + name);
      }
      var idx = list.indexOf(clbk);
      if(idx < 0) {
        console.warn("The given listener was not registered.");
        return;
      }
      list.splice(idx, 1);
    },
    /**
     * @param {string} name
     * @protected
     */
    dispatchEvent_: function(name) {
      /** @type {[function]} list */
      var list = this.listeners_[name];
      if(!list){
        throw new Error("Unknown event name: " + name);
      }
      var args = [];
      Array.prototype.push.apply(args, arguments);
      args.shift();
      for(var i = 0; i < list.length; i++) {
        list[i].apply(null, args);
      }
    },
    /**
     * @returns {Minobi.Page[]} pages
     */
    get currentPages() {
      return [];
    },
    /**
     * @returns {number[]} pages
     */
    get currentPageNumbers() {
      return [];
    }
  };

  /**
   * @param {Minobi.Chapter} chapter
   * @extends {Minobi.Axis}
   * @constructor
   */
  Minobi.HorizontalAxis = function(chapter) {
    Minobi.Axis.call(this, chapter);
    /** @type {Minobi.Face} */
    this.current_ = null;
    /** @type {number} */
    this.pos_ = 0;
    /** @type {number} */
    this.speed_ = 0;
    /** @type {number} */
    this.timer = 0;
    /** @type {[Minobi.Face]} */
    this.attachQueue_ = [];
    /** @type {[Minobi.Face]} */
    this.detachQueue_ = [];
  };

  Minobi.HorizontalAxis.prototype = Object.create(Minobi.Axis.prototype, {
    seek: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       * @override
       */
      value: function seek(cache, container, page) {
        //
        if(this.current_) {
          this.current_.detach(container);
          if(this.current_.prev) {
            this.current_.prev.detach(container);
          }
          if(this.current_.next) {
            this.current_.next.detach(container);
          }
        }
        //
        this.current_ = this.makeFace_(container, page);
        this.current_.attach(container);
        if(this.current_.nextPage) {
          this.current_.linkNext(this.makeFace_(container, this.current_.nextPage));
          this.current_.next.attach(container);
        }
        if(this.current_.prevPage) {
          this.current_.linkPrev(this.makePrevFace_(container, this.current_.prevPage));
          this.current_.prev.attach(container);
        }
        this.pos_ = 0;
        this.speed_ = 0;
        if(this.timer) {
          window.clearInterval(this.timer);
          this.timer = 0;
        }
        this.dispatchPageEnterEvent();
      }
    },
    seekPrev: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       * @override
       */
      value: function seekPrev(cache, container, page) {
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
          this.current_.prev.attach(container);
        }
        this.pos_ = 0;
        this.speed_ = 0;
        this.dispatchPageEnterEvent();
      }
    },
    makeFace_: {
      /**
       * @param {HTMLDivElement} container
       * @param {Minobi.Page} page
       */
      value: function makeFace_(container, page) {
        page.transform(this.calcScale_(container, page), 0, 0);
        var next = page.next;
        if(next) {
          next.transform(this.calcScale_(container, next), 0, 0);
          if(next.scaledWidth + page.scaledWidth <= container.clientWidth_) {
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
      value: function makePrevFace_(container, page) {
        page.transform(this.calcScale_(container, page), 0, 0);
        var prev = page.prev;
        if(prev) {
          prev.transform(this.calcScale_(container, prev), 0, 0);
          if(prev.scaledWidth + page.scaledWidth <= container.clientWidth_) {
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
      value: function calcScale_(container, page) {
        return Math.min(container.clientWidth_ / page.width, container.clientHeight_ / page.height);
      }
    },
    dispatchPageEnterEvent: {
      /**
       *
       */
      value: function() {
        this.dispatchEvent_('pageenter', this.currentPageNumbers);
      }
    },
    currentPages: {
      configurable: false,
      /**
       * @returns {[number]}
       */
      get: function() {
        return this.current_.pages;
      },
    },
    currentPageNumbers: {
      configurable: false,
      /**
       * @returns {[number]}
       */
      get: function() {
        var pages = [];
        for(var i = 0; i < this.current_.pages.length; i++) {
          pages.push(this.current_.pages[i].idx);
        }
        return pages;
      },
    },
    /**
     * @param {Minobi.Face} face
     * @protected
     */
    addAttachQueue: {
      value: function addAttachQueue(face) {
        this.attachQueue_.push(face);
      }
    },
    /**
     * @param {Minobi.Face} face
     */
    addDetachQueue: {
      value: function addDetachQueue(face) {
        this.detachQueue_.push(face);
      }
    },
    layoutFaces_: {
      /**
       * @param {HTMLDivElement} container
       * @protected
       */
      value: function layoutFaces_(container) {
        while(this.attachQueue_.length > 0) {
          var face = this.attachQueue_.shift();
          face.attach(container);
        }
        while(this.detachQueue_.length > 0) {
          var face = this.detachQueue_.shift();
          face.detach(container);
        }
      }
    },
    render: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       * @override
       */
      value: function render(cache, container) {
        // update faces pagination.
        if(this.pos_ >= 1) {
          if(this.current_.nextPage) {
            this.pos_ -= 1.0;
            if(this.current_.prev) {
              this.addDetachQueue(this.current_.prev);
              this.current_.unlinkPrev();
            }
            this.current_ = this.current_.next;
            this.current_.zIndex = 1;
            this.current_.prev.zIndex = 0;
            if(this.current_.nextPage) {
              this.current_.linkNext(this.makeFace_(container, this.current_.nextPage));
              this.addAttachQueue(this.current_.next);
              this.current_.next.zIndex = 2;
            }
            this.dispatchPageEnterEvent();
          } else {
            this.pos_ = 1.0;
          }
        } else if(this.pos_ < 0) {
          if(this.current_.prevPage) {
            this.pos_ += 1.0;
            if(this.current_.next) {
              this.addDetachQueue(this.current_.next);
              this.current_.unlinkNext();
            }
            this.current_ = this.current_.prev;
            this.current_.zIndex = 1;
            this.current_.next.zIndex = 2;
            if(this.current_.prevPage) {
              this.current_.linkPrev(this.makePrevFace_(container, this.current_.prevPage));
              this.addAttachQueue(this.current_.prev);
              this.current_.prev.zIndex = 0;
            }
            this.dispatchPageEnterEvent();
          } else {
            this.pos_ = 0.0;
          }
        }
        if(!this.current_.attached) {
          this.current_.attach(container);
        }
        if(this.current_.next && !this.current_.next.attached) {
          this.current_.next.attach(container);
        }

        // set opacity and scale for animation, then render faces.
        this.current_.opacity = 1 - this.pos_;
        this.current_.transform((1 - this.pos_) * 0.25 + 0.75, 0, 0);
        this.current_.render(cache, container);
        if(this.current_.next) {
          this.current_.next.opacity = 1;
          this.current_.next.transform(1, (this.pos_ - 1) * container.clientWidth_, 0);
          this.current_.next.render(cache, container);
        }
        if(this.current_.prev) {
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
      value: function onLeft(viewer) {
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
      value: function onRight(viewer) {
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
        var deltaX = dx / this.current_.width;
        this.pos_ += deltaX;
        this.render(cache, container);
        return true;
      }
    },
    onMoveStart: {
      /**
       * @param {Minobi.Viewer} viewer
       * @override
       */
      value: function onMoveEnd(viewer) {
        if(this.timer) {
          window.clearInterval(this.timer);
          this.timer = 0;
        }
      }
    },
    onMoveEnd: {
      /**
       * @param {Minobi.Viewer} viewer
       * @param {boolean} isTap
       * @param {number} lastRelX
       * @param {number} lastRelY
       * @param {number} duration
       * @param {number} speedXinEm
       * @param {number} speedYinEm
       */
      value: function onMoveEnd(viewer, isTap, lastRelX, lastRelY, duration, speedXinEm, speedYinEm) {
        var cache = viewer.cache;
        var container = viewer.container;
        if(isTap) {
          if(lastRelX < 0.4 && this.current_.nextPage) {
            this.seek(cache, container, this.current_.nextPage);
            viewer.render();
            return;
          } else if(lastRelX > 0.6 && this.current_.prevPage) {
            this.seekPrev(cache, container, this.current_.prevPage);
            viewer.render();
            return;
          } else {
            viewer.seekbar.activate(1000);
          }
        }
        this.speed_ = 0;
        if(this.timer) {
          window.clearInterval(this.timer);
          this.layoutFaces_(container);
        }
        if(duration <= 0.3 && Math.abs(speedXinEm) >= 20.0 && (speedXinEm > 0 && this.current_.nextPage || speedXinEm < 0)) {
          this.timer = window.setInterval(this.anim_.bind(this, speedXinEm > 0, cache, container), 20);
        } else {
          this.timer = window.setInterval(this.move_.bind(this, cache, container), 20);
        }
      }
    },
    move_: {
      /**
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       */
      value: function move_(cache, container) {
        if(this.current_.next) {
          if(this.pos_ < 0.5) {
            this.speed_ -= 0.025;
            this.pos_ += this.speed_;
          }else if(this.pos_ >= 0.5){
            this.speed_ += 0.025;
            this.pos_ += this.speed_;
          }
        } else {
          this.speed_ -= 0.025;
          this.pos_ += this.speed_;
        }
        var layout = false;
        if(this.pos_ <= 0) {
          this.pos_ = 0;
          this.speed_ = 0;
          layout = true;
          window.clearInterval(this.timer);
          this.timer = 0;
        }
        if(this.pos_ >= 1) {
          this.pos_ = 1;
          this.speed_ = 0;
          layout = true;
          window.clearInterval(this.timer);
          this.timer = 0;
        }
        this.render(cache, container);
        if(layout) {
          this.layoutFaces_(container);
        }
      }
    },
    anim_: {
      /**
       * @param {boolean} next
       * @param {Minobi.ImageCache} cache
       * @param {HTMLDivElement} container
       */
      value: function move_(next, cache, container) {
        if(next) {
          this.speed_ += 0.025;
          this.pos_ += this.speed_;
        }else{
          this.speed_ -= 0.025;
          this.pos_ += this.speed_;
        }
        var layout = false;
        if(this.pos_ <= 0) {
          this.pos_ = 0;
          this.speed_ = 0;
          layout = true;
          window.clearInterval(this.timer);
          this.timer = 0;
        }
        if(this.pos_ >= 1) {
          this.pos_ = 1;
          this.speed_ = 0;
          layout = true;
          window.clearInterval(this.timer);
          this.timer = 0;
        }
        this.render(cache, container);
        if(layout) {
          this.layoutFaces_(container);
        }
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
   * @param {[{images: [{path: string, width: number, height:number, key: (undefined|string)}], width: number, height:number}]} chapterDef
   * @param {function(Minobi.Viewer)} clbk
   */
  Minobi.init = function(container, chapterDef, clbk) {
    /** @type {[Minobi.Page]} */
    var pages = [];
    for(var i=0;i < chapterDef.length; i++) {
      var pageDef = chapterDef[i];
      /** @type {[Minobi.Image]} */
      var images = [];
      for(var j = 0; j < pageDef.images.length; j++) {
        var imgDef = pageDef.images[j];
        var key = null;
        if(imgDef.key) {
          key = Minobi.decodeBase64(imgDef.key);
        }
        imgDef.key
        var image = new Minobi.Image(imgDef.path, imgDef.width, imgDef.height, key);
        images.push(image);
      }
      var page = new Minobi.Page(i, images, pageDef.width, pageDef.height);
      pages.push(page);
      if(i > 0) {
        pages[i-1].next = page;
        page.prev = pages[i-1];
      }
    }
    var viewer = new Minobi.Viewer(container, new Minobi.Chapter(pages));
    viewer.init(clbk);
  };
  /**
   * @param {string} str
   * @returns {Uint8Array} array
   */
  Minobi.decodeBase64 = function(str) {
    var raw = window.atob(str);
    var rawLength = raw.length;
    var array = new Uint8Array(new ArrayBuffer(rawLength));
    for(i = 0; i < rawLength; i++) {
      array[i] = raw.charCodeAt(i);
    }
    return array;
  };
})();
