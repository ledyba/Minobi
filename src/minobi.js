import { findTouchEvent, decodeBase64 } from './util.js';
import { SeekBar } from './seekbar.js';

export class Tracker {
  /**
   * @param {string} id
   */
  constructor(id) {
    this.id_ = id;
    this.name_ = 'Minobi_' + Math.random().toString(36).slice(-8);
    this.cmd_ = this.name_ + '.' + 'send';
    window.ga('create', id, 'auto', this.name_);
  }
  send() {
    if (window.ga) {
      /** @type {[any]} */
      var args = Array.prototype.slice.call(arguments);
      args.unshift(this.cmd_);
      window.ga.apply(null, args);
    }
  }
  /**
   * @param {[number]} pages
   */
  pageview(pages) {
    /* global location */
    if (pages) {
      for (var i = 0; i < pages.length; i++) {
        var path = location.href + "#" + pages[i];
        this.send({
          hitType: 'pageview',
          location: path
        });
      }
    } else {
      this.send({
        hitType: 'pageview',
        location: location.href
      });
    }
  }
  /**
   * @param {string} category
   * @param {string} action
   * @param {string} label
   * @param {number} value
   */
  event(category, action, label, value) {
    this.send({
      hitType: 'event',
      eventCategory: category,
      eventAction: action,
      eventValue: value,
      eventLabel: label
    });
  }
  /**
   * @param {string} category
   * @param {string} var_
   * @param {number} value
   * @param {string} label
   */
  timing(category, var_, value, label) {
    this.send({
      hitType: 'timing',
      timingCategory: category,
      timingVar: var_,
      timingValue: value,
      timingLabel: label
    });
  }
  /**
   * @param {string} desc
   * @param {boolean} fatal
   */
  exception(desc, fatal) {
    fatal = fatal || false;
    this.send({
      hitType: 'exception',
      exDescription: desc,
      exFatal: fatal
    });
  }
}

export class Image {
  /**
   * @param {string} url
   * @param {number} width
   * @param {number} height
   * @param {Uint8Array} key
   */
  constructor(url, width, height, key) {
    this.url = url;
    this.width = width;
    this.height = height;
    this.key = key || null;
    /** @type {ImageEntity} */
    this.entity = null;

    /** @type {HTMLImageElement} element */
    this.element = document.createElement('img');
  }
  clear() {
    if (this.entity) {
      this.entity.delete();
      this.entity = null;
      this.element.src = "";
    }
  }
}

/**
 * @abstract
 */
export class Page {
  /**
   * @param {number} idx
   * @param {number} width
   * @param {number} height
   * @param {[Image]} images
   */
  constructor(idx, width, height, images) {
    this.idx = idx;
    this.scale_ = 1;
    this.x_ = 0;
    this.y_ = 0;
    this.images = images;
    this.width = width;
    this.height = height;
    /** @type {Page} */
    this.prev = null;
    /** @type {Page} */
    this.next = null;
    /** @type {HTMLDivElement} */
    this.elem = document.createElement('div');
    this.elem.className = 'manga-page';
    this.elem.style.width = this.width + 'px';
    this.elem.style.height = this.height + 'px';
    this.elem.style.left = '0px';
    this.elem.style.top = '0px';
    this.elem.style.transformOrigin = '0% 0%';
    this.elem.style['-webkit-transformOrigin'] = '0% 0%';
    /** @type {!HTMLDivElement[]} */
    this.imageContainers = [];
    var left = 0;
    for (var i = 0; i < this.images.length; i++) {
      /** @type {HTMLImageElement} */
      var img = images[i];
      var elem = img.element;
      elem.classList.add('manga-image');
      this.imageContainers.push(elem);
      this.elem.appendChild(elem);
      elem.style.left = left + 'px';
      left += img.width;
    }
  }
  get attached() {
    return !this.elem || !!this.elem.parentElement;
  }
  /**
   * @param {HTMLDivElement} container
   */
  attach(container) {
    if (!this.elem) {
      console.error("Null elem.");
      return;
    } else if (container === this.elem.parentElement) {
      console.warn("already attached");
      return;
    }
    container.appendChild(this.elem);
  }
  /**
   * @param {HTMLDivElement} container
   */
  detach(container) {
    if (!this.elem) {
      console.error("Null elem.");
      return;
    } else if (container !== this.elem.parentElement) {
      console.warn("already detached");
      return;
    }
    container.removeChild(this.elem);
  }
  transform(scale, dx, dy) {
    this.scale_ = scale;
    this.x_ = dx;
    this.y_ = dy;
    var trans = 'scale(' + scale + ') translate(' + dx + 'px, ' + dy + 'px)';
    this.elem.style.transform = trans;
    this.elem.style['-webkit-transform'] = trans;
  }
  /** @return {number} scale */
  get scale() {
    return this.scale_;
  }
  /** @return {number} x */
  get x() {
    return this.x_;
  }
  /** @return {number} y */
  get y() {
    return this.y_;
  }
  /** @return {number} scaledWidth */
  get scaledWidth() {
    return this.scale_ * this.width;
  }
  /** @return {number} scaledHeight */
  get scaledHeight() {
    return this.scale_ * this.height;
  }
}

export class Face {
  /**
   * @param {[Page]} pages
   */
  constructor(pages) {
    /** @type {[Page]} pages */
    this.pages = pages;
    /** @type {number} */
    this.scale_ = 1.0;
    /** @type {HTMLDivElement} */
    this.elem_ = document.createElement('div');
    this.elem_.className = 'manga-face';
    /** @type {Page} */
    this.prevPage = pages[0].prev;
    /** @type {Page} */
    this.nextPage = pages[pages.length - 1].next;

    /** @type {Face} */
    this.next = null;
    /** @type {Face} */
    this.prev = null;

    this.width = 0;
    this.height = 0;

    this.x_ = 0;
    this.y_ = 0;

    this.zIndex_ = 0;

    this.active_ = false;
  }
  get attached() {
    return !this.elem_ || !!this.elem_.parentElement;
  }
  /**
   * @param {HTMLDivElement} container
   */
  attach(container) {
    if (container === this.elem_.parentElement) {
      console.warn("already attached");
      return;
    }
    container.appendChild(this.elem_);
    for (var i = 0; i < this.pages.length; i++) {
      var page = this.pages[i];
      page.attach(this.elem_);
    }
  }
  /**
   * @param {HTMLDivElement} container
   */
  detach(container) {
    if (container !== this.elem_.parentElement) {
      console.warn("already detached");
      return;
    }
    container.removeChild(this.elem_);
    for (var i = 0; i < this.pages.length; i++) {
      var page = this.pages[i];
      page.detach(this.elem_);
    }
  }
  /** @param {number} opacity */
  set opacity(opacity) {
    this.elem_.style.opacity = opacity;
  }
  /** @param {number} index */
  set zIndex(index) {
    if (index === this.zIndex_) {
      return;
    }
    this.zIndex_ = index;
    this.elem_.style.zIndex = index;
  }
  /** @param {boolean} v */
  set active(v) {
    if (v === this.active_) {
      return;
    }
    this.active_ = v;
    if (v) {
      this.elem_.classList.add('active');
    } else {
      this.elem_.classList.remove('active');
    }
  }
  /**
   * @param {number} scale
   * @param {number} dx
   * @param {number} dy
   */
  transform(scale, dx, dy) {
    this.scale_ = scale;
    this.x_ = dx;
    this.y_ = dy;
    var trans = 'scale(' + scale + ') translate(' + dx + 'px, ' + dy + 'px)';
    this.elem_.style.transform = trans;
    this.elem_.style['-webkit-transform'] = trans;
  }
  /** @return {number} scale */
  get scale() {
    return this.scale_;
  }
  /** @return {number} x */
  get x() {
    return this.x_;
  }
  /** @return {number} y */
  get y() {
    return this.y_;
  }
  /** @type {Face} next */
  linkNext(next) {
    this.next = next;
    this.next.prev = this;
  }
  /** @type {Face} prev */
  linkPrev(prev) {
    this.prev = prev;
    this.prev.next = this;
  }
  unlinkNext() {
    this.next.prev = null;
    this.next = null;
  }
  unlinkPrev() {
    this.prev.next = null;
    this.prev = null;
  }
  /**
   * @param {HTMLDivElement} container
   */
  layout(container) {
    /* Layout pages */
    var w = 0;
    for (var i = 0; i < this.pages.length; i++) {
      var page = this.pages[i];
      w += page.scaledWidth;
    }
    this.width = w;
    this.height = container.clientHeight_;
    var offX = (container.clientWidth_ - w) / 2;
    for (var i = this.pages.length - 1; i >= 0; i--) {
      var page = this.pages[i];
      page.transform(page.scale, offX / page.scale, (container.clientHeight_ - page.scaledHeight) / 2);
      offX += page.scaledWidth;
    }
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   */
  render(cache, container) {
    /* Layout pages */
    for (var i = 0; i < this.pages.length; i++) {
      var page = this.pages[i];
      cache.enqueue(page);
    }
  }
}

export class Chapter {
  /**
   * @param {Page[]} pages
   */
  constructor(pages) {
    this.pages = pages
  }
}

export class ImageCache {
  static get MAX_IMAGE() {
    return 20;
  }
  // We need more than or equal to 6 workers
  // because we need 6 images at once.
  // 3 faces (Prev/Current/Next) * 2 images(for each pages)
  static get MAX_WORKER() {
    return 6;
  }
  /**
   * @param {Viewer} viewer
   * @param {Chapter} chapter
   */
  constructor(viewer, chapter) {
    this.viewer_ = viewer;
    this.tracker_ = viewer.tracker;
    this.chapter_ = chapter;
    /** @type {[Image]} */
    this.cacheList_ = [];
    /** @type {[ImageLoader]} */
    this.workers_ = [];
    this.workerIdx_ = 0;
    for (var i = 0; i < ImageCache.MAX_WORKER; i++) {
      this.workers_.push(new ImageLoader(this, this.tracker_));
    }
    /** @type {Object.<string, boolean>} this.xhr_ */
    this.enqueued_ = {};
  }
  /**
   * @param {Page} page
   */
  enqueue(page) {
    for (var i = 0; i < page.images.length; i++) {
      var img = page.images[i];
      if (img.entity) {
        this.tracker_.event('ImageCache', 'Hit', img.url);
        // already loaded. push to the front of the list.
        var idx = this.cacheList_.indexOf(img);
        this.cacheList_.splice(idx, 1);
        this.cacheList_.push(img);
      } else {
        this.tracker_.event('ImageCache', 'Miss', img.url);
        if (!!this.enqueued_[img.url]) {
          console.warn("Already enqueued: ", img.url);
          continue;
        }
        this.tracker_.event('ImageCache', 'Enqueued', img.url);
        this.enqueued_[img.url] = true;
        // Tell a worker to load the image with Ajax.
        this.workers_[this.workerIdx_].load(img);
        this.workerIdx_ = (this.workerIdx_ + 1) % ImageCache.MAX_WORKER;
      }
    }
  }
  /**
   * @param {Image} img
   */
  clear(img) {
    if (img.element) {
      img.element.src = "";
      img.element = null;
    }
  }
  /**
   * @param {Image} img
   * @param {ImageEntity} entity
   */
  onLoaded(img, entity) {
    this.tracker_.event('ImageCache', 'LoadSucceed', img.url);
    delete this.enqueued_[img.url];
    img.element.src = entity.url;
    img.entity = entity;
    this.cacheList_.push(img);
    // Remove the least recent used image.
    if (this.cacheList_.length > ImageCache.MAX_IMAGE) {
      var removedImage = this.cacheList_.shift();
      removedImage.clear();
    }
  }
  /**
   * @param {Image} img
   */
  onAborted(img) {
    this.tracker_.event('ImageCache', 'LoadAborted', img.url);
    delete this.enqueued_[img.url];
  }
  /**
   * @param {Image} img
   */
  onError(img) {
    this.tracker_.event('ImageCache', 'LoadFailed', img.url);
    delete this.enqueued_[img.url];
  }
}

export class ImageLoader {
  /**
   * @param {ImageCache} cache
   * @param {Tracker} tracker
   */
  constructor(cache, tracker) {
    /** @type {XMLHttpRequest} this.xhr_ */
    this.xhr_ = null;
    this.cache_ = cache;
    this.tracker_ = tracker;
  }
  /**
   * @param {Image} img
   */
  load(img) {
    var start = new Date().getTime();
    var self = this;
    var decode = function (dat) {
      var n = img.key.length;
      for (var i = 0; i < dat.length; i++) {
        dat[i] ^= img.key[i % n];
      }
    };
    // TODO: [workaround]
    // Data URI has the different origin from http/https scheme uri,
    // So sending xhr is prohibited in iOS Safari.
    // XXX: [workaround]
    // IE never supports String.prototype.startsWith
    // https://msdn.microsoft.com/library/mt146831(v=vs.94).aspx
    if (img.url.indexOf('data:', 0) === 0) {
      var arr = img.url.split(',');
      var meta = arr[0].match(/:([^;]*?)(?:;(.*?))?$/);
      var mime = meta[1];
      var encoding = meta[2];
      if (encoding !== 'base64') {
        console.error("Minobi do not support non-base64 data uris: ", img.url, xhr);
        self.cache_.onError(img);
        return;
      }
      var dat = decodeBase64(arr[1]);
      var type = meta[2];
      if (img.key) {
        decode(dat);
      }
      self.cache_.onLoaded(img, new ImageEntity(dat, type));
      return;
    }
    if (this.xhr_) {
      console.warn("Request aborted: ", this.xhr_.img.url);
      this.xhr_.onreadystatechange = null;
      this.xhr_.abort();
      this.tracker_.timing('ImageLoader', 'LoadingAborted', new Date().getTime() - start, img.url);
      this.cache_.onAborted(this.xhr_.img);
    }
    var xhr = new XMLHttpRequest();
    xhr.img = img;
    xhr.onreadystatechange = function onReadyStateChange() {
      if (xhr.readyState === 4) {
        self.xhr_ = null;
        if (xhr.status === 200) {
          var dat = new Uint8Array(xhr.response);
          var type = xhr.getResponseHeader("Content-Type");
          var now = new Date().getTime();
          self.tracker_.timing('ImageLoader', 'LoadingSucceed', now - start, img.url);
          if (img.key) {
            start = now;
            decode(dat);
            self.tracker_.timing('ImageLoader', 'Decoding', new Date().getTime() - start, img.url);
          }
          self.cache_.onLoaded(img, new ImageEntity(dat, type));
        } else {
          console.error("We can't load file: ", img.url, xhr);
          self.tracker_.timing('ImageLoader', 'LoadingFailed', new Date().getTime() - start, img.url);
          self.tracker_.exception(xhr.statusText, false);
          self.cache_.onError(img);
        }
      }
    };
    xhr.onerror = function (e) {
      console.error(e);
      self.tracker_.event('ImageLoader', 'UnknownError', img.url);
      self.tracker_.exception("xhr.onerror", false);
    };
    xhr.open('GET', img.url, true);
    // XXX: [workaround]
    // IE11 throws an InvalidStateError when you set responseType before open
    // https://github.com/chafey/cornerstoneWebImageLoader/issues/7
    xhr.responseType = "arraybuffer";
    xhr.send(null);
    this.xhr_ = xhr;
  }
}

export class ImageEntity {
  /**
 * @param {Uint8Array} data
 * @param {string} type
 */
  constructor(data, type) {
    /* global URL Blob */
    /** @type {string} */
    this.url = URL.createObjectURL(new Blob([data], { type: type }));
  }
  delete() {
    /* global URL */
    URL.revokeObjectURL(this.url);
    this.url = null;
  }
}

export class Viewer {
  /**
   * @param {HTMLDivElement} container
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   */
  constructor(container, tracker, chapter) {
    /** @type {HTMLDivElement} */
    this.container_ = container;
    this.tracker = tracker;
    this.chapter = chapter;
    this.cache_ = new ImageCache(this, chapter);

    // Axis
    this.axis = this.makeHorizontalAxis();

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
    this.listeners_['ready'] = [];
    this.listeners_['resize'] = [];

    /**
     * @type {number} transitionAreaRatioForTouch
     * [non-dimension] MUST BE IN [0, 0.5]
     * Tap actions will be treated as page transition actions
     * when the user released their finger in this range from left/right.
     */
    this.transitionAreaRatioForTouch = 0.35;

    /**
     * @type {number} transitionAreaRatioForTouch
     * [non-dimension] MUST BE IN [0, 0.5]
     * Click actions will be treated as page transition actions
     * when the user released their cursor in this range from left/right.
     */
    this.transitionAreaRatioForMouse = 0.35;
  }

  /**
   * @param {function(Viewer)} clbk
   */
  init(clbk) {
    var self = this;
    var tracker = self.tracker;
    var clicked = false;

    // Mouse
    var firstMouseX = 0;
    var firstMouseY = 0;
    var lastMouseX = 0;
    var lastMouseY = 0;
    var mouseStart = 0;
    var mouseUp = function (event) {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mouseleave', mouseUp);
      if (clicked) {
        event.preventDefault();
        clicked = false;
        var dx = event.clientX - firstMouseX;
        var dy = event.clientY - firstMouseY;
        var duration = ((event.timeStamp - mouseStart) / 1000);
        var vx = (dx / self.emInPx_) / duration;
        var vy = (dy / self.emInPx_) / duration;
        var isTap = Math.max(Math.abs(dx), Math.abs(dy)) < self.maxTapDistance_;
        self.axis.onMoveEnd(self,
          'Mouse',
          isTap,
          self.transitionAreaRatioForMouse,
          (event.clientX - self.container_.boundingLeft_) / self.container_.clientWidth_,
          (event.clientY - self.container_.boundingTop_) / self.container_.clientHeight_,
          duration,
          vx,
          vy);
        tracker.event('Viewer', 'MouseUp');
      }
    };
    var mouseMove = function (event) {
      if (clicked) {
        event.preventDefault();
        self.axis.onMove(self, event.clientX - lastMouseX, event.clientY - lastMouseY);
        lastMouseX = event.clientX;
        lastMouseY = event.clientY;
      }
    };
    var mouseDown = function (event) {
      if (event.timeStamp - touchEndAt < 500) {
        event.preventDefault();
        //XXX: Worst way to ignore emulated mouse event...
        // But it seems that there is no way to stop emulated events or
        // distinguish emulated events from all mouse events...
        // https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/HandlingEvents/HandlingEvents.html#//apple_ref/doc/uid/TP40006511-SW24
        console.warn("It could be emulated mouse event. Ignore.");
        return;
      }
      if (event.buttons != 0 && !clicked) {
        event.preventDefault();
        clicked = true;
        self.axis.onMoveStart(self);
        firstMouseX = lastMouseX = event.clientX;
        firstMouseY = lastMouseY = event.clientY;
        mouseStart = event.timeStamp;
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mouseleave', mouseUp);
        tracker.event('Viewer', 'MouseDown');
      }
    };
    this.container_.addEventListener('mousedown', mouseDown, false);

    // Touch
    var touch = null;
    var touchStartAt = 0;
    var touchEndAt = 0;
    var firstTouchX = 0;
    var firstTouchY = 0;
    var lastTouchX = 0;
    var lastTouchY = 0;
    var touchStart = function (event) {
      if (!clicked && !!event.targetTouches[0] && event.touches.length === 1) {
        clicked = true;
        self.axis.onMoveStart(self);
        window.addEventListener('touchmove', touchMove, { passive: true });
        window.addEventListener('touchend', touchEnd, false);
        window.addEventListener('touchleave', touchEnd, false);
        window.addEventListener('touchcancel', touchEnd, false);
        touch = event.targetTouches[0];
        firstTouchX = lastTouchX = touch.clientX;
        firstTouchY = lastTouchY = touch.clientY;
        touchStartAt = event.timeStamp;
        tracker.event('Viewer', 'TouchStart');
      } else if (event.touches.length > 1) {
        clicked = false;
      }
    };
    var touchEnd = function (event) {
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('touchleave', touchEnd);
      window.removeEventListener('touchcancel', touchEnd);
      if (clicked) {
        //event.preventDefault();
        lastTouchX = touch.clientX;
        lastTouchY = touch.clientY;
        var dx = lastTouchX - firstTouchX;
        var dy = lastTouchY - firstTouchY;
        var isTap = Math.max(Math.abs(dx), Math.abs(dy)) < self.maxTapDistance_;
        var duration = (event.timeStamp - touchStartAt) / 1000;
        var vx = (dx / self.emInPx_) / duration;
        var vy = (dy / self.emInPx_) / duration;
        self.axis.onMoveEnd(self, 'Touch', isTap,
          self.transitionAreaRatioForTouch,
          (lastTouchX - self.container_.boundingLeft_) / self.container_.clientWidth_,
          (lastTouchY - self.container_.boundingTop_) / self.container_.clientHeight_,
          duration,
          vx,
          vy);
        tracker.event('Viewer', 'TouchEnd');
        touchEndAt = event.timeStamp;
      }
      clicked = false;
      touch = null;
      firstTouchX = lastTouchX = 0;
      firstTouchY = lastTouchY = 0;
      touchStartAt = 0;
    };
    var lastMoved = new Date().getTime();
    var touchMove = function (event) {
      if (!clicked) {
        return;
      }
      var now = new Date().getTime();
      if (now - lastMoved < 10) {
        return;
      }
      lastMoved = now;
      var ntouch = findTouchEvent(event.touches, touch.identifier);
      if (!ntouch) {
        return;
      }
      touch = ntouch;
      self.axis.onMove(self, touch.clientX - lastTouchX, touch.clientY - lastTouchY);
      lastTouchX = touch.clientX;
      lastTouchY = touch.clientY;
    };
    this.container_.addEventListener('touchstart', touchStart, { passive: true });

    // keyboard
    this.container_.addEventListener('keyup', function (event) {
      var reload = false;
      switch (event.keyCode) {
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
      if (reload) {
        this.render();
      }
    }.bind(this));
    var setupSize = function () {
      self.container_.clientWidth_ = self.container_.clientWidth;
      self.container_.clientHeight_ = self.container_.clientHeight;
      var rect = self.container_.getBoundingClientRect();
      self.container_.boundingLeft_ = rect.left;
      self.container_.boundingTop_ = rect.top;
      self.axis.onResize(self, self.container_);
    };
    var onDomContentLoaded = function () {
      window.removeEventListener('DOMContentLoaded', onDomContentLoaded);
      window.addEventListener('resize', function () {
        setupSize();
        self.dispatchEvent_("resize");
      });
      setupSize();
      self.dispatchEvent_("ready");
    };
    var onLoad = function () {
      window.removeEventListener('load', onLoad);
      self.emInPx_ = parseFloat(getComputedStyle(window.document.body).fontSize);
      tracker.event('Viewer', 'EmInPx', undefined, self.emInPx_);
      self.maxTapDistance_ = self.emInPx_ * 3;
      self.container_.focus();
    };
    window.addEventListener('DOMContentLoaded', onDomContentLoaded);
    window.addEventListener('load', onLoad);
    if (clbk) {
      clbk(this);
    }

    //tracking page event
    this.addEventListener('pageenter', function (pages) {
      self.tracker.pageview(pages);
    });
  }
  render() {
    this.axis.render(this.cache_, this.container_);
  }
  /**
   * @param {Page} page
   * @private
   */
  seek_(page) {
    this.axis.seek(this.cache_, this.container_, page);
  }
  /** @param {SeekBar} seekbar*/
  set seekbar(seekbar) {
    var self = this;
    this.seekbar_ = seekbar;
    /** @param {number} value */
    seekbar.addEventListener('changed', function (value) {
      self.seek_(self.chapter.pages[value - 1]);
      self.render();
    });
  }
  /**
   * @param {string} name
   * @param {function} clbk
   */
  addEventListener(name, clbk) {
    /** @type {[function]} list */
    var list = this.listeners_[name];
    if (!list) {
      throw new Error("Unknown event name: " + name);
    }
    if (list.indexOf(clbk) >= 0) {
      console.warn("The given listener was already registered.");
      return;
    }
    list.push(clbk);
  }
  /**
   * @param {string} name
   * @param {function} clbk
   */
  removeEventListener(name, clbk) {
    /** @type {[function]} list */
    var list = this.listeners_[name];
    if (!list) {
      throw new Error("Unknown event name: " + name);
    }
    var idx = list.indexOf(clbk);
    if (idx < 0) {
      console.warn("The given listener was not registered.");
      return;
    }
    list.splice(idx, 1);
  }
  /**
   * @param {string} name
   * @protected
   */
  dispatchEvent_(name) {
    /** @type {[function]} list */
    var list = this.listeners_[name];
    if (!list) {
      throw new Error("Unknown event name: " + name);
    }
    var args = [];
    Array.prototype.push.apply(args, arguments);
    args.shift();
    for (var i = 0; i < list.length; i++) {
      list[i].apply(null, args);
    }
  }
  /**
   * @param {[number]} pages
   * @protected
   */
  onPageEnter_(pages) {
    if (pages.length > 0) {
      this.dispatchEvent_('pageenter', pages);
    }
  }
  get seekbar() {
    return this.seekbar_;
  }
  /** @returns {HTMLDivElement} container */
  get container() {
    return this.container_;
  }
  /** @returns {ImageCache} cache */
  get cache() {
    return this.cache_;
  }
  makeHorizontalAxis() {
    var axis = new HorizontalAxis(this.tracker, this.chapter);
    axis.addEventListener('pageenter', this.onPageEnter_.bind(this));
    return axis;
  }
  makeVertivalAxis() {
    return new VerticalAxis(this.chapter);
  }
}

/**
 * @interface
 */
export class Axis {
  /**
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   * @constructor
   */
  constructor(tracker, chapter) {
    this.tracker_ = tracker;
    this.chapter_ = chapter;

    /** @type {Object.<string, [function()]>} */
    this.listeners_ = {};
    this.listeners_['pageenter'] = [];
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @param {Page} page
   * @abstract
   */
  seek(cache, container, page) {
    throw new Error("Please implement Axis.seek");
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @abstract
   */
  render(cache, container) {
    throw new Error("Please implement Axis.render");
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   */
  onUp(viewer) {
    return false;
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   */
  onDown(viewer) {
    return false;
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   */
  onLeft(viewer) {
    return false;
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   */
  onRight(viewer) {
    return false;
  }
  /**
   * @param {Viewer} viewer
   * @param {number} dx
   * @param {number} dy
   * @return {boolean} reload
   */
  onMove(viewer, dx, dy) {
    return false;
  }
  /**
   * @param {Viewer} viewer
   * @param {HTMLDivElement} container
   */
  onResize(viewer, container) {
  }
  /**
   * @param {Viewer} viewer
   * @param {string} device
   * @param {boolean} isTap
   * @param {number} transitionArea
   * @param {number} lastRelX
   * @param {number} lastRelY
   * @param {number} duration
   * @param {number} speedXinEm
   * @param {number} speedYinEm
   */
  onMoveEnd(viewer, device, isTap, transitionArea, lastRelX, lastRelY, duration, speedXinEm, speedYinEm) {
    return false;
  }
  /**
   * @param {Viewer} viewer
   */
  onMoveStart(viewer) {
    return false;
  }
  /**
   * @param {string} name
   * @param {function} clbk
   */
  addEventListener(name, clbk) {
    /** @type {[function]} list */
    var list = this.listeners_[name];
    if (!list) {
      throw new Error("Unknown event name: " + name);
    }
    if (list.indexOf(clbk) >= 0) {
      console.warn("The given listener was already registered.");
      return;
    }
    list.push(clbk);
  }
  /**
   * @param {string} name
   * @param {function} clbk
   */
  removeEventListener(name, clbk) {
    /** @type {[function]} list */
    var list = this.listeners_[name];
    if (!list) {
      throw new Error("Unknown event name: " + name);
    }
    var idx = list.indexOf(clbk);
    if (idx < 0) {
      console.warn("The given listener was not registered.");
      return;
    }
    list.splice(idx, 1);
  }
  /**
   * @param {string} name
   * @protected
   */
  dispatchEvent_(name) {
    /** @type {[function]} list */
    var list = this.listeners_[name];
    if (!list) {
      throw new Error("Unknown event name: " + name);
    }
    var args = [];
    Array.prototype.push.apply(args, arguments);
    args.shift();
    for (var i = 0; i < list.length; i++) {
      list[i].apply(null, args);
    }
  }
  /**
   * @returns {Page[]} pages
   */
  get currentPages() {
    return [];
  }
  /**
   * @returns {number[]} pages
   */
  get currentPageNumbers() {
    return [];
  }
}

export class HorizontalAxis extends Axis {
  /**
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   */
  constructor(tracker, chapter) {
    super(tracker, chapter);
    /** @type {Face} */
    this.current_ = null;
    /** @type {number} */
    this.pos_ = 0;
    /** @type {number} */
    this.speed_ = 0;
    /** @type {number} */
    this.timer = 0;
    /** @type {[Face]} */
    this.attachQueue_ = [];
    /** @type {[Face]} */
    this.detachQueue_ = [];
  }
  /**
   * @name IMakeCurrentFace
   * @param {Page}
   * @return {Face}
   */
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @param {Page} page
   * @param {IMakeCurrentFace} makeCurrentFace
   * @override
   */
  seekInternal_(cache, container, page, makeCurrentFace) {
    /** @type {[Face]} */
    var current = [];
    /** @type {[Face]} */
    var updated = [];
    if (this.current_) {
      current.push(this.current_);
      this.current_.active = false;
      if (this.current_.prev) {
        current.push(this.current_.prev);
        this.current_.prev.active = false;
      }
      if (this.current_.next) {
        current.push(this.current_.next);
        this.current_.next.active = false;
      }
    }
    //
    /** @param {Face} face */
    var reuseFaceIfNecessary = function (face) {
      for (var i = 0; i < current.length; i++) {
        var cur = current[i];
        if (face.pages.length !== cur.pages.length) {
          break;
        }
        var matched = true;
        for (var j = 0; j < cur.pages.length; j++) {
          if (cur.pages[j] !== face.pages[j]) {
            matched = false;
            break;
          }
        }
        if (matched) {
          return cur;
        }
      }
      return face;
    };
    var cur, prev, next;
    cur = reuseFaceIfNecessary(makeCurrentFace(page));
    updated.push(cur);
    cur.active = true;
    if (cur.nextPage) {
      next = reuseFaceIfNecessary(this.makeFace_(container, cur.nextPage));
      updated.push(next);
    }
    if (cur.prevPage) {
      prev = reuseFaceIfNecessary(this.makePrevFace_(container, cur.prevPage));
      updated.push(prev);
    }
    var deleted;
    var inserted = [];
    for (var i = 0; i < updated.length; i++) {
      var matched = false;
      for (var j = 0; j < current.length; j++) {
        if (updated[i] === current[j]) {
          matched = true;
          current.splice(j, 1);
          break;
        }
      }
      if (!matched) {
        inserted.push(updated[i]);
      }
    }
    deleted = current;

    cur.active = true;
    if (next) {
      cur.linkNext(next);
    }
    if (prev) {
      cur.linkPrev(prev);
    }
    for (var i = 0; i < inserted.length; i++) {
      inserted[i].opacity = 0;
      inserted[i].attach(container);
    }
    for (var i = 0; i < deleted.length; i++) {
      deleted[i].detach(container);
    }

    this.current_ = cur;
    this.pos_ = 0;
    this.speed_ = 0;
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = 0;
    }
    this.dispatchPageEnterEvent();
    this.attachQueue_.splice(0, this.attachQueue_.length);
    this.detachQueue_.splice(0, this.detachQueue_.length);
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @param {Page} page
   * @override
   */
  seek(cache, container, page) {
    this.seekInternal_(cache, container, page, this.makeFace_.bind(this, container));
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @param {Page} page
   * @override
   */
  seekPrev(cache, container, page) {
    this.seekInternal_(cache, container, page, this.makePrevFace_.bind(this, container));
  }

  /**
   * @param {HTMLDivElement} container
   * @param {Page} page
   */
  makeFace_(container, page) {
    page.transform(this.calcScale_(container, page), 0, 0);
    var next = page.next;
    if (next) {
      next.transform(this.calcScale_(container, next), 0, 0);
      if (next.scaledWidth + page.scaledWidth <= container.clientWidth_) {
        // make a face with 2 pages.
        var face = new Face([page, next]);
        face.layout(container);
        this.tracker_.event('Viewer', 'MultiplePages', 'Forward', page.idx);
        return face;
      }
    }
    // make a face with a single page.
    var face = new Face([page]);
    face.layout(container);
    this.tracker_.event('Viewer', 'SinglePages', 'Forward', page.idx);
    return face;
  }
  /**
   * @param {HTMLDivElement} container
   * @param {Page} page
   */
  makePrevFace_(container, page) {
    page.transform(this.calcScale_(container, page), 0, 0);
    var prev = page.prev;
    if (prev) {
      prev.transform(this.calcScale_(container, prev), 0, 0);
      if (prev.scaledWidth + page.scaledWidth <= container.clientWidth_) {
        // make a face with 2 pages.
        var face = new Face([prev, page]);
        face.layout(container);
        this.tracker_.event('Viewer', 'MultiplePages', 'Backward', page.idx);
        return face;
      }
    }
    // make a face with a single page.
    var face = new Face([page]);
    face.layout(container);
    this.tracker_.event('Viewer', 'SinglePages', 'Backward', page.idx);
    return face;
  }
  /**
   * @param {HTMLDivElement} container
   * @param {Page} page
   */
  calcScale_(container, page) {
    return Math.min(container.clientWidth_ / page.width, container.clientHeight_ / page.height);
  }
  dispatchPageEnterEvent() {
    this.dispatchEvent_('pageenter', this.currentPageNumbers);
  }
  /**
   * @returns {[number]}
   */
  get currentPages() {
    return this.current_.pages;
  }
  /**
   * @returns {[number]}
   */
  get currentPageNumbers() {
    var pages = [];
    for (var i = 0; i < this.current_.pages.length; i++) {
      pages.push(this.current_.pages[i].idx);
    }
    return pages;
  }
  /**
   * @param {Face} face
   * @protected
   */
  addAttachQueue(face) {
    this.attachQueue_.push(face);
  }
  /**
   * @param {Face} face
   */
  addDetachQueue(face) {
    this.detachQueue_.push(face);
  }
  /**
   * @param {HTMLDivElement} container
   * @protected
   */
  layoutFaces_(container) {
    while (this.attachQueue_.length > 0) {
      var face = this.attachQueue_.shift();
      face.attach(container);
    }
    while (this.detachQueue_.length > 0) {
      var face = this.detachQueue_.shift();
      face.detach(container);
    }
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @override
   */
  render(cache, container) {
    // update faces pagination.
    if (this.pos_ >= 1) {
      if (this.current_.nextPage) {
        this.pos_ -= 1.0;
        if (this.current_.prev) {
          this.addDetachQueue(this.current_.prev);
          this.current_.unlinkPrev();
        }
        this.current_ = this.current_.next;

        this.current_.zIndex = 1;
        this.current_.active = true;

        this.current_.prev.zIndex = 0;
        this.current_.prev.active = false;

        if (this.current_.nextPage) {
          this.current_.linkNext(this.makeFace_(container, this.current_.nextPage));
          this.addAttachQueue(this.current_.next);
          this.current_.next.zIndex = 2;
        }
        this.dispatchPageEnterEvent();
      } else {
        this.pos_ = 1.0;
      }
    } else if (this.pos_ < 0) {
      if (this.current_.prevPage) {
        this.pos_ += 1.0;
        if (this.current_.next) {
          this.addDetachQueue(this.current_.next);
          this.current_.unlinkNext();
        }
        this.current_ = this.current_.prev;

        this.current_.zIndex = 1;
        this.current_.active = true;

        this.current_.next.zIndex = 2;
        this.current_.active = false;

        if (this.current_.prevPage) {
          this.current_.linkPrev(this.makePrevFace_(container, this.current_.prevPage));
          this.addAttachQueue(this.current_.prev);
          this.current_.prev.zIndex = 0;
        }
        this.dispatchPageEnterEvent();
      } else {
        this.pos_ = 0.0;
      }
    }
    if (!this.current_.attached) {
      this.current_.attach(container);
    }
    if (this.current_.next && !this.current_.next.attached) {
      this.current_.next.attach(container);
    }

    // set opacity and scale for animation, then render faces.
    this.current_.opacity = 1 - this.pos_;
    this.current_.transform((1 - this.pos_) * 0.25 + 0.75, 0, 0);
    this.current_.render(cache, container);
    this.current_.opacity = 1;
    if (this.current_.next) {
      this.current_.next.transform(1, (this.pos_ - 1) * container.clientWidth_, 0);
      this.current_.next.render(cache, container);
      this.current_.next.opacity = 1;
    }
    if (this.current_.prev) {
      this.current_.prev.opacity = 0;
      this.current_.prev.render(cache, container);
    }
  }
  /**
   * @param {Viewer} viewer
   * @param {HTMLDivElement} container
   */
  onResize(viewer, container) {
    /** @type {number} viewerWidth */
    var viewerWidth = container.clientWidth_;
    // Calculate seekable pages.
    /** @type {[number]} */
    var seekable = [];
    for (var i = 0; i < viewer.chapter.pages.length; i++) {
      var page = viewer.chapter.pages[i];
      var next = viewer.chapter.pages[i + 1];
      seekable.push(i + 1);
      if (undefined === next) {
        break;
      }
      var sp = this.calcScale_(container, page);
      var sn = this.calcScale_(container, next);
      if (sp * page.width + sn * next.width <= viewerWidth) {
        i++;
      }
    }
    viewer.seekbar.seekablePages = seekable;
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   * @override
   */
  onLeft(viewer) {
    var cache = viewer.cache;
    var container = viewer.container;
    this.tracker_.event('Viewer', 'SeekByKeyboard', 'Forward', this.current_.pages[0].idx);
    if (this.current_.nextPage) {
      this.seek(cache, container, this.current_.nextPage);
      return true;
    } else {
      return false;
    }
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   * @override
   */
  onRight(viewer) {
    var cache = viewer.cache;
    var container = viewer.container;
    this.tracker_.event('Viewer', 'SeekByKeyboard', 'Backward', this.current_.pages[0].idx);
    if (this.current_.prev) {
      this.seekPrev(cache, container, this.current_.prevPage);
      return true;
    } else {
      return false;
    }
  }
  /**
   * @param {Viewer} viewer
   * @param {number} dx
   * @param {number} dy
   * @return {boolean} reload
   * @override
   */
  onMove(viewer, dx, dy) {
    var cache = viewer.cache;
    var container = viewer.container;
    var deltaX = dx / this.current_.width;
    this.pos_ += deltaX;
    this.render(cache, container);
    return true;
  }
  /**
   * @param {Viewer} viewer
   * @override
   */
  onMoveStart(viewer) {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer = 0;
    }
  }
  /**
   * @param {Viewer} viewer
   * @param {string} device
   * @param {boolean} isTap
   * @param {number} transitionArea
   * @param {number} lastRelX
   * @param {number} lastRelY
   * @param {number} duration
   * @param {number} speedXinEm
   * @param {number} speedYinEm
   * @override
   */
  onMoveEnd(viewer, device, isTap, transitionArea, lastRelX, lastRelY, duration, speedXinEm, speedYinEm) {
    var cache = viewer.cache;
    var container = viewer.container;
    var tracker = viewer.tracker;
    if (isTap) {
      if (lastRelX < transitionArea && this.current_.nextPage) {
        this.seek(cache, container, this.current_.nextPage);
        viewer.render();
        tracker.event('Viewer', 'SeekBy' + device, 'Forward', this.current_.pages[0].idx);
        return;
      } else if (lastRelX > (1 - transitionArea) && this.current_.prevPage) {
        this.seekPrev(cache, container, this.current_.prevPage);
        viewer.render();
        tracker.event('Viewer', 'SeekBy' + device, 'Backward', this.current_.pages[0].idx);
        return;
      } else {
        if (viewer.seekbar) {
          viewer.seekbar.activate(viewer.seekbar.activePeriod);
          tracker.event('Viewer', 'ActivateSeekbar', device, lastRelX);
        }
        // do not return, since the page might be moved by fingers/mouse pointers.
      }
    }
    this.speed_ = 0;
    if (this.timer) {
      window.clearInterval(this.timer);
      this.layoutFaces_(container);
    }
    if (duration <= 0.3 && Math.abs(speedXinEm) >= 20.0 && (speedXinEm > 0 && this.current_.nextPage || speedXinEm < 0)) {
      this.timer = window.setInterval(this.anim_.bind(this, speedXinEm > 0, cache, container), 20);
    } else {
      this.timer = window.setInterval(this.move_.bind(this, cache, container), 20);
    }
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @private
   */
  move_(cache, container) {
    if (this.current_.next) {
      if (this.pos_ < 0.5) {
        this.speed_ -= 0.025;
        this.pos_ += this.speed_;
      } else if (this.pos_ >= 0.5) {
        this.speed_ += 0.025;
        this.pos_ += this.speed_;
      }
    } else {
      this.speed_ -= 0.025;
      this.pos_ += this.speed_;
    }
    var layout = false;
    if (this.pos_ <= 0) {
      this.pos_ = 0;
      this.speed_ = 0;
      layout = true;
      window.clearInterval(this.timer);
      this.timer = 0;
    }
    if (this.pos_ >= 1) {
      this.pos_ = 1;
      this.speed_ = 0;
      layout = true;
      window.clearInterval(this.timer);
      this.timer = 0;
    }
    this.render(cache, container);
    if (layout) {
      this.layoutFaces_(container);
    }
  }
  /**
   * @param {boolean} next
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   */
  anim_(next, cache, container) {
    if (next) {
      this.speed_ += 0.025;
      this.pos_ += this.speed_;
    } else {
      this.speed_ -= 0.025;
      this.pos_ += this.speed_;
    }
    var layout = false;
    if (this.pos_ <= 0) {
      this.pos_ = 0;
      this.speed_ = 0;
      layout = true;
      window.clearInterval(this.timer);
      this.timer = 0;
    }
    if (this.pos_ >= 1) {
      this.pos_ = 1;
      this.speed_ = 0;
      layout = true;
      window.clearInterval(this.timer);
      this.timer = 0;
    }
    this.render(cache, container);
    if (layout) {
      this.layoutFaces_(container);
    }
  }
}

// TODO: 縦の実装
export class VerticalAxis extends Axis {
  /**
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   */
  constructor(tracker, chapter) {
    super(tracker, chapter);
  }

  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @param {Page} page
   * @override
   */
  seek(cache, container, page) {
  }
  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @override
   */
  render(cache, container) {
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   * @override
   */
  onDown(viewer) {
    if (this.current_.next) {
      this.seek(this.current_.next);
      return true;
    } else {
      return false;
    }
  }
  /**
   * @param {Viewer} viewer
   * @return {boolean} reload
   */
  onUp(viewer) {
    if (this.current_.prev) {
      this.seek(this.current_.prev);
      return true;
    } else {
      return false;
    }
  }
}

// - ENTRY POINT -

/**
 * @param {HTMLDivElement} container
 * @param {string} trackID
 * @param {[{images: [{path: string, width: number, height:number, key: (undefined|string)}], width: number, height:number}]} chapterDef
 * @param {function(Viewer)} clbk
 */
export function init(container, trackID, chapterDef, clbk) {
  var startInit = new Date().getTime();
  /** @type {[Page]} */
  var pages = [];
  var tracker = new Tracker(trackID);
  for (var i = 0; i < chapterDef.length; i++) {
    var pageDef = chapterDef[i];
    /** @type {[Image]} */
    var images = [];
    for (var j = 0; j < pageDef.images.length; j++) {
      var imgDef = pageDef.images[j];
      var key = null;
      if (imgDef.key) {
        key = decodeBase64(imgDef.key);
      }
      var image = new Image(imgDef.path, imgDef.width, imgDef.height, key);
      images.push(image);
    }
    var page = new Page(i, pageDef.width, pageDef.height, images);
    pages.push(page);
    if (i > 0) {
      pages[i - 1].next = page;
      page.prev = pages[i - 1];
    }
  }
  var viewer = new Viewer(container, tracker, new Chapter(pages));
  viewer.init(clbk);
  tracker.pageview();
  var time = new Date().getTime() - startInit;
  tracker.timing('Init', 'Setup Viewer', time);
}
