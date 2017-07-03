/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VerticalAxis = exports.HorizontalAxis = exports.Axis = exports.Viewer = exports.ImageEntity = exports.ImageLoader = exports.ImageCache = exports.Chapter = exports.Face = exports.HTMLPage = exports.ImagePage = exports.Page = exports.Image = exports.Tracker = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.init = init;

var _util = __webpack_require__(2);

var _seekbar = __webpack_require__(1);

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tracker = exports.Tracker = function () {
  /**
   * @param {string} id
   */
  function Tracker(id) {
    _classCallCheck(this, Tracker);

    this.id_ = id;
    this.name_ = 'Minobi_' + Math.random().toString(36).slice(-8);
    this.cmd_ = this.name_ + '.' + 'send';
    window.ga('create', id, 'auto', this.name_);
  }

  _createClass(Tracker, [{
    key: 'send',
    value: function send() {
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

  }, {
    key: 'pageview',
    value: function pageview(pages) {
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

  }, {
    key: 'event',
    value: function event(category, action, label, value) {
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

  }, {
    key: 'timing',
    value: function timing(category, var_, value, label) {
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

  }, {
    key: 'exception',
    value: function exception(desc, fatal) {
      fatal = fatal || false;
      this.send({
        hitType: 'exception',
        exDescription: desc,
        exFatal: fatal
      });
    }
  }]);

  return Tracker;
}();

var Image = exports.Image = function () {
  /**
   * @param {string} url
   * @param {number} width
   * @param {number} height
   * @param {Uint8Array} key
   */
  function Image(url, width, height, key) {
    _classCallCheck(this, Image);

    this.url = url;
    this.width = width;
    this.height = height;
    this.key = key || null;
    /** @type {ImageEntity} */
    this.entity = null;

    /** @type {HTMLImageElement} element */
    this.element = document.createElement('img');
  }

  _createClass(Image, [{
    key: 'clear',
    value: function clear() {
      if (this.entity) {
        this.entity.delete();
        this.entity = null;
        this.element.src = "";
      }
    }
  }]);

  return Image;
}();

/**
 * @abstract
 */


var Page = exports.Page = function () {
  /**
   * @param {number} idx
   * @param {number} width
   * @param {number} height
   * @param {[Image]} images
   */
  function Page(idx, width, height, images) {
    _classCallCheck(this, Page);

    this.idx = idx;
    this.width = width;
    this.height = height;
    /** @type {Page} */
    this.prev = null;
    /** @type {Page} */
    this.next = null;
    /** @private */
    this.scale_ = 1;
    /** @private */
    this.x_ = 0;
    /** @private */
    this.y_ = 0;
  }
  /**
   * @type {HTMLDivElement}
   * @abstract
   */


  _createClass(Page, [{
    key: 'attach',

    /**
     * @param {HTMLDivElement} container
     */
    value: function attach(container) {
      var e = this.elem;
      if (!e) {
        console.error("Null elem.");
        return;
      } else if (container === e.parentElement) {
        console.warn("already attached");
        return;
      }
      container.appendChild(e);
    }
    /**
     * @param {HTMLDivElement} container
     */

  }, {
    key: 'detach',
    value: function detach(container) {
      var e = this.elem;
      if (!e) {
        console.error("Null elem.");
        return;
      } else if (container !== e.parentElement) {
        console.warn("already detached");
        return;
      }
      container.removeChild(e);
    }
  }, {
    key: 'transform',
    value: function transform(scale, dx, dy) {
      var e = this.elem;
      this.scale_ = scale;
      this.x_ = dx;
      this.y_ = dy;
      var trans = 'scale(' + scale + ') translate(' + dx + 'px, ' + dy + 'px)';
      e.style.transform = trans;
      e.style['-webkit-transform'] = trans;
    }
    /** @return {number} scale */

  }, {
    key: 'elem',
    get: function get() {
      throw new Error("Please implement");
    }
    /**
     * @type {[Image]}
     */

  }, {
    key: 'images',
    get: function get() {
      return null;
    }
  }, {
    key: 'attached',
    get: function get() {
      var e = this.elem;
      return !e || !!e.parentElement;
    }
  }, {
    key: 'scale',
    get: function get() {
      return this.scale_;
    }
    /** @return {number} x */

  }, {
    key: 'x',
    get: function get() {
      return this.x_;
    }
    /** @return {number} y */

  }, {
    key: 'y',
    get: function get() {
      return this.y_;
    }
    /** @return {number} scaledWidth */

  }, {
    key: 'scaledWidth',
    get: function get() {
      return this.scale_ * this.width;
    }
    /** @return {number} scaledHeight */

  }, {
    key: 'scaledHeight',
    get: function get() {
      return this.scale_ * this.height;
    }
  }]);

  return Page;
}();

var ImagePage = exports.ImagePage = function (_Page) {
  _inherits(ImagePage, _Page);

  /**
   * @param {number} idx
   * @param {number} width
   * @param {number} height
   * @param {[Image]} images
   */
  function ImagePage(idx, width, height, images) {
    _classCallCheck(this, ImagePage);

    var _this = _possibleConstructorReturn(this, (ImagePage.__proto__ || Object.getPrototypeOf(ImagePage)).call(this, idx, width, height));

    _this.images_ = images;
    /** @type {HTMLDivElement} */
    var elem = document.createElement('div');
    _this.elem_ = elem;
    elem.className = 'manga-page';
    elem.style.width = _this.width + 'px';
    elem.style.height = _this.height + 'px';
    elem.style.left = '0px';
    elem.style.top = '0px';
    elem.style.transformOrigin = '0% 0%';
    elem.style['-webkit-transformOrigin'] = '0% 0%';
    var left = 0;
    for (var i = 0; i < images.length; i++) {
      /** @type {HTMLImageElement} */
      var img = images[i];
      var ielm = img.element;
      ielm.classList.add('manga-image');
      elem.appendChild(ielm);
      ielm.style.left = left + 'px';
      left += img.width;
    }
    return _this;
  }
  /**
   * @override
   */


  _createClass(ImagePage, [{
    key: 'elem',
    get: function get() {
      return this.elem_;
    }
    /**
     * @override
     */

  }, {
    key: 'images',
    get: function get() {
      return this.images_;
    }
  }]);

  return ImagePage;
}(Page);

var HTMLPage = exports.HTMLPage = function (_Page2) {
  _inherits(HTMLPage, _Page2);

  /**
   * @param {number} idx
   * @param {number} width
   * @param {number} height
   * @param {string} src
   */
  function HTMLPage(idx, width, height, src) {
    _classCallCheck(this, HTMLPage);

    var _this2 = _possibleConstructorReturn(this, (HTMLPage.__proto__ || Object.getPrototypeOf(HTMLPage)).call(this, idx, width, height));

    _this2.src_ = src;
    /** @type {HTMLDivElement} */
    var elem = document.createElement('div');
    _this2.elem_ = elem;
    elem.className = 'manga-page';
    elem.style.width = _this2.width + 'px';
    elem.style.height = _this2.height + 'px';
    elem.style.left = '0px';
    elem.style.top = '0px';
    elem.style.transformOrigin = '0% 0%';
    elem.style['-webkit-transformOrigin'] = '0% 0%';
    elem.innerHTML = src;
    return _this2;
  }
  /**
   * @override
   */


  _createClass(HTMLPage, [{
    key: 'elem',
    get: function get() {
      return this.elem_;
    }
    /**
     * @override
     */

  }, {
    key: 'images',
    get: function get() {
      return [];
    }
  }]);

  return HTMLPage;
}(Page);

var Face = exports.Face = function () {
  /**
   * @param {[Page]} pages
   */
  function Face(pages) {
    _classCallCheck(this, Face);

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

  _createClass(Face, [{
    key: 'attach',

    /**
     * @param {HTMLDivElement} container
     */
    value: function attach(container) {
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

  }, {
    key: 'detach',
    value: function detach(container) {
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

  }, {
    key: 'transform',

    /**
     * @param {number} scale
     * @param {number} dx
     * @param {number} dy
     */
    value: function transform(scale, dx, dy) {
      this.scale_ = scale;
      this.x_ = dx;
      this.y_ = dy;
      var trans = 'scale(' + scale + ') translate(' + dx + 'px, ' + dy + 'px)';
      this.elem_.style.transform = trans;
      this.elem_.style['-webkit-transform'] = trans;
    }
    /** @return {number} scale */

  }, {
    key: 'linkNext',

    /** @type {Face} next */
    value: function linkNext(next) {
      this.next = next;
      this.next.prev = this;
    }
    /** @type {Face} prev */

  }, {
    key: 'linkPrev',
    value: function linkPrev(prev) {
      this.prev = prev;
      this.prev.next = this;
    }
  }, {
    key: 'unlinkNext',
    value: function unlinkNext() {
      this.next.prev = null;
      this.next = null;
    }
  }, {
    key: 'unlinkPrev',
    value: function unlinkPrev() {
      this.prev.next = null;
      this.prev = null;
    }
    /**
     * @param {HTMLDivElement} container
     */

  }, {
    key: 'layout',
    value: function layout(container) {
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

  }, {
    key: 'render',
    value: function render(cache, container) {
      /* Layout pages */
      for (var i = 0; i < this.pages.length; i++) {
        var page = this.pages[i];
        cache.enqueue(page);
      }
    }
  }, {
    key: 'attached',
    get: function get() {
      return !this.elem_ || !!this.elem_.parentElement;
    }
  }, {
    key: 'opacity',
    set: function set(opacity) {
      this.elem_.style.opacity = opacity;
    }
    /** @param {number} index */

  }, {
    key: 'zIndex',
    set: function set(index) {
      if (index === this.zIndex_) {
        return;
      }
      this.zIndex_ = index;
      this.elem_.style.zIndex = index;
    }
    /** @param {boolean} v */

  }, {
    key: 'active',
    set: function set(v) {
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
  }, {
    key: 'scale',
    get: function get() {
      return this.scale_;
    }
    /** @return {number} x */

  }, {
    key: 'x',
    get: function get() {
      return this.x_;
    }
    /** @return {number} y */

  }, {
    key: 'y',
    get: function get() {
      return this.y_;
    }
  }]);

  return Face;
}();

var Chapter =
/**
 * @param {Page[]} pages
 */
exports.Chapter = function Chapter(pages) {
  _classCallCheck(this, Chapter);

  this.pages = pages;
};

var ImageCache = exports.ImageCache = function () {
  _createClass(ImageCache, null, [{
    key: 'MAX_IMAGE',
    get: function get() {
      return 20;
    }
    // We need more than or equal to 6 workers
    // because we need 6 images at once.
    // 3 faces (Prev/Current/Next) * 2 images(for each pages)

  }, {
    key: 'MAX_WORKER',
    get: function get() {
      return 6;
    }
    /**
     * @param {Viewer} viewer
     * @param {Chapter} chapter
     */

  }]);

  function ImageCache(viewer, chapter) {
    _classCallCheck(this, ImageCache);

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


  _createClass(ImageCache, [{
    key: 'enqueue',
    value: function enqueue(page) {
      /** @type {[Image]} */
      var images = page.images;
      if (!images || images.length <= 0) {
        return;
      }
      for (var i = 0; i < images.length; i++) {
        var img = images[i];
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

  }, {
    key: 'clear',
    value: function clear(img) {
      if (img.element) {
        img.element.src = "";
        img.element = null;
      }
    }
    /**
     * @param {Image} img
     * @param {ImageEntity} entity
     */

  }, {
    key: 'onLoaded',
    value: function onLoaded(img, entity) {
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

  }, {
    key: 'onAborted',
    value: function onAborted(img) {
      this.tracker_.event('ImageCache', 'LoadAborted', img.url);
      delete this.enqueued_[img.url];
    }
    /**
     * @param {Image} img
     */

  }, {
    key: 'onError',
    value: function onError(img) {
      this.tracker_.event('ImageCache', 'LoadFailed', img.url);
      delete this.enqueued_[img.url];
    }
  }]);

  return ImageCache;
}();

var ImageLoader = exports.ImageLoader = function () {
  /**
   * @param {ImageCache} cache
   * @param {Tracker} tracker
   */
  function ImageLoader(cache, tracker) {
    _classCallCheck(this, ImageLoader);

    /** @type {XMLHttpRequest} this.xhr_ */
    this.xhr_ = null;
    this.cache_ = cache;
    this.tracker_ = tracker;
  }
  /**
   * @param {Image} img
   */


  _createClass(ImageLoader, [{
    key: 'load',
    value: function load(img) {
      var start = new Date().getTime();
      var self = this;
      var decode = function decode(dat) {
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
        var dat = (0, _util.decodeBase64)(arr[1]);
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
  }]);

  return ImageLoader;
}();

var ImageEntity = exports.ImageEntity = function () {
  /**
  * @param {Uint8Array} data
  * @param {string} type
  */
  function ImageEntity(data, type) {
    _classCallCheck(this, ImageEntity);

    /* global URL Blob */
    /** @type {string} */
    this.url = URL.createObjectURL(new Blob([data], { type: type }));
  }

  _createClass(ImageEntity, [{
    key: 'delete',
    value: function _delete() {
      /* global URL */
      URL.revokeObjectURL(this.url);
      this.url = null;
    }
  }]);

  return ImageEntity;
}();

var Viewer = exports.Viewer = function () {
  /**
   * @param {HTMLDivElement} container
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   */
  function Viewer(container, tracker, chapter) {
    _classCallCheck(this, Viewer);

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


  _createClass(Viewer, [{
    key: 'init',
    value: function init(clbk) {
      var self = this;
      var tracker = self.tracker;
      var clicked = false;

      // Mouse
      var firstMouseX = 0;
      var firstMouseY = 0;
      var lastMouseX = 0;
      var lastMouseY = 0;
      var mouseStart = 0;
      var mouseUp = function mouseUp(event) {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mouseleave', mouseUp);
        if (clicked) {
          event.preventDefault();
          clicked = false;
          var dx = event.clientX - firstMouseX;
          var dy = event.clientY - firstMouseY;
          var duration = (event.timeStamp - mouseStart) / 1000;
          var vx = dx / self.emInPx_ / duration;
          var vy = dy / self.emInPx_ / duration;
          var isTap = Math.max(Math.abs(dx), Math.abs(dy)) < self.maxTapDistance_;
          self.axis.onMoveEnd(self, 'Mouse', isTap, self.transitionAreaRatioForMouse, (event.clientX - self.container_.boundingLeft_) / self.container_.clientWidth_, (event.clientY - self.container_.boundingTop_) / self.container_.clientHeight_, duration, vx, vy);
          tracker.event('Viewer', 'MouseUp');
        }
      };
      var mouseMove = function mouseMove(event) {
        if (clicked) {
          event.preventDefault();
          self.axis.onMove(self, event.clientX - lastMouseX, event.clientY - lastMouseY);
          lastMouseX = event.clientX;
          lastMouseY = event.clientY;
        }
      };
      var mouseDown = function mouseDown(event) {
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
      var touchStart = function touchStart(event) {
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
      var touchEnd = function touchEnd(event) {
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
          var vx = dx / self.emInPx_ / duration;
          var vy = dy / self.emInPx_ / duration;
          self.axis.onMoveEnd(self, 'Touch', isTap, self.transitionAreaRatioForTouch, (lastTouchX - self.container_.boundingLeft_) / self.container_.clientWidth_, (lastTouchY - self.container_.boundingTop_) / self.container_.clientHeight_, duration, vx, vy);
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
      var touchMove = function touchMove(event) {
        if (!clicked) {
          return;
        }
        var now = new Date().getTime();
        if (now - lastMoved < 10) {
          return;
        }
        lastMoved = now;
        var ntouch = (0, _util.findTouchEvent)(event.touches, touch.identifier);
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
          case 38:
            //up - previous
            reload = this.axis.onUp(self);
            break;
          case 40:
            //down - next
            reload = this.axis.onDown(self);
            break;
          case 37:
            // left - next
            reload = this.axis.onLeft(self);
            break;
          case 39:
            //right - previous
            reload = this.axis.onRight(self);
            break;
        }
        if (reload) {
          this.render();
        }
      }.bind(this));
      var setupSize = function setupSize() {
        self.container_.clientWidth_ = self.container_.clientWidth;
        self.container_.clientHeight_ = self.container_.clientHeight;
        var rect = self.container_.getBoundingClientRect();
        self.container_.boundingLeft_ = rect.left;
        self.container_.boundingTop_ = rect.top;
        self.axis.onResize(self, self.container_);
      };
      var onDomContentLoaded = function onDomContentLoaded() {
        window.removeEventListener('DOMContentLoaded', onDomContentLoaded);
        window.addEventListener('resize', function () {
          setupSize();
          self.dispatchEvent_("resize");
        });
        setupSize();
        self.dispatchEvent_("ready");
      };
      var onLoad = function onLoad() {
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
  }, {
    key: 'render',
    value: function render() {
      this.axis.render(this.cache_, this.container_);
    }
    /**
     * @param {Page} page
     * @private
     */

  }, {
    key: 'seek_',
    value: function seek_(page) {
      this.axis.seek(this.cache_, this.container_, page);
    }
    /** @param {SeekBar} seekbar*/

  }, {
    key: 'addEventListener',

    /**
     * @param {string} name
     * @param {function} clbk
     */
    value: function addEventListener(name, clbk) {
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

  }, {
    key: 'removeEventListener',
    value: function removeEventListener(name, clbk) {
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

  }, {
    key: 'dispatchEvent_',
    value: function dispatchEvent_(name) {
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

  }, {
    key: 'onPageEnter_',
    value: function onPageEnter_(pages) {
      if (pages.length > 0) {
        this.dispatchEvent_('pageenter', pages);
      }
    }
  }, {
    key: 'makeHorizontalAxis',
    value: function makeHorizontalAxis() {
      var axis = new HorizontalAxis(this.tracker, this.chapter);
      axis.addEventListener('pageenter', this.onPageEnter_.bind(this));
      return axis;
    }
  }, {
    key: 'makeVertivalAxis',
    value: function makeVertivalAxis() {
      return new VerticalAxis(this.chapter);
    }
  }, {
    key: 'seekbar',
    set: function set(seekbar) {
      var self = this;
      this.seekbar_ = seekbar;
      /** @param {number} value */
      seekbar.addEventListener('changed', function (value) {
        self.seek_(self.chapter.pages[value - 1]);
        self.render();
      });
    },
    get: function get() {
      return this.seekbar_;
    }
    /** @returns {HTMLDivElement} container */

  }, {
    key: 'container',
    get: function get() {
      return this.container_;
    }
    /** @returns {ImageCache} cache */

  }, {
    key: 'cache',
    get: function get() {
      return this.cache_;
    }
  }]);

  return Viewer;
}();

/**
 * @interface
 */


var Axis = exports.Axis = function () {
  /**
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   * @constructor
   */
  function Axis(tracker, chapter) {
    _classCallCheck(this, Axis);

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


  _createClass(Axis, [{
    key: 'seek',
    value: function seek(cache, container, page) {
      throw new Error("Please implement Axis.seek");
    }
    /**
     * @param {ImageCache} cache
     * @param {HTMLDivElement} container
     * @abstract
     */

  }, {
    key: 'render',
    value: function render(cache, container) {
      throw new Error("Please implement Axis.render");
    }
    /**
     * @param {Viewer} viewer
     * @return {boolean} reload
     */

  }, {
    key: 'onUp',
    value: function onUp(viewer) {
      return false;
    }
    /**
     * @param {Viewer} viewer
     * @return {boolean} reload
     */

  }, {
    key: 'onDown',
    value: function onDown(viewer) {
      return false;
    }
    /**
     * @param {Viewer} viewer
     * @return {boolean} reload
     */

  }, {
    key: 'onLeft',
    value: function onLeft(viewer) {
      return false;
    }
    /**
     * @param {Viewer} viewer
     * @return {boolean} reload
     */

  }, {
    key: 'onRight',
    value: function onRight(viewer) {
      return false;
    }
    /**
     * @param {Viewer} viewer
     * @param {number} dx
     * @param {number} dy
     * @return {boolean} reload
     */

  }, {
    key: 'onMove',
    value: function onMove(viewer, dx, dy) {
      return false;
    }
    /**
     * @param {Viewer} viewer
     * @param {HTMLDivElement} container
     */

  }, {
    key: 'onResize',
    value: function onResize(viewer, container) {}
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

  }, {
    key: 'onMoveEnd',
    value: function onMoveEnd(viewer, device, isTap, transitionArea, lastRelX, lastRelY, duration, speedXinEm, speedYinEm) {
      return false;
    }
    /**
     * @param {Viewer} viewer
     */

  }, {
    key: 'onMoveStart',
    value: function onMoveStart(viewer) {
      return false;
    }
    /**
     * @param {string} name
     * @param {function} clbk
     */

  }, {
    key: 'addEventListener',
    value: function addEventListener(name, clbk) {
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

  }, {
    key: 'removeEventListener',
    value: function removeEventListener(name, clbk) {
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

  }, {
    key: 'dispatchEvent_',
    value: function dispatchEvent_(name) {
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

  }, {
    key: 'currentPages',
    get: function get() {
      return [];
    }
    /**
     * @returns {number[]} pages
     */

  }, {
    key: 'currentPageNumbers',
    get: function get() {
      return [];
    }
  }]);

  return Axis;
}();

var HorizontalAxis = exports.HorizontalAxis = function (_Axis) {
  _inherits(HorizontalAxis, _Axis);

  /**
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   */
  function HorizontalAxis(tracker, chapter) {
    _classCallCheck(this, HorizontalAxis);

    /** @type {Face} */
    var _this3 = _possibleConstructorReturn(this, (HorizontalAxis.__proto__ || Object.getPrototypeOf(HorizontalAxis)).call(this, tracker, chapter));

    _this3.current_ = null;
    /** @type {number} */
    _this3.pos_ = 0;
    /** @type {number} */
    _this3.speed_ = 0;
    /** @type {number} */
    _this3.timer = 0;
    /** @type {[Face]} */
    _this3.attachQueue_ = [];
    /** @type {[Face]} */
    _this3.detachQueue_ = [];
    return _this3;
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


  _createClass(HorizontalAxis, [{
    key: 'seekInternal_',
    value: function seekInternal_(cache, container, page, makeCurrentFace) {
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
      var reuseFaceIfNecessary = function reuseFaceIfNecessary(face) {
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

  }, {
    key: 'seek',
    value: function seek(cache, container, page) {
      this.seekInternal_(cache, container, page, this.makeFace_.bind(this, container));
    }
    /**
     * @param {ImageCache} cache
     * @param {HTMLDivElement} container
     * @param {Page} page
     * @override
     */

  }, {
    key: 'seekPrev',
    value: function seekPrev(cache, container, page) {
      this.seekInternal_(cache, container, page, this.makePrevFace_.bind(this, container));
    }

    /**
     * @param {HTMLDivElement} container
     * @param {Page} page
     */

  }, {
    key: 'makeFace_',
    value: function makeFace_(container, page) {
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

  }, {
    key: 'makePrevFace_',
    value: function makePrevFace_(container, page) {
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

  }, {
    key: 'calcScale_',
    value: function calcScale_(container, page) {
      return Math.min(container.clientWidth_ / page.width, container.clientHeight_ / page.height);
    }
  }, {
    key: 'dispatchPageEnterEvent',
    value: function dispatchPageEnterEvent() {
      this.dispatchEvent_('pageenter', this.currentPageNumbers);
    }
    /**
     * @returns {[number]}
     */

  }, {
    key: 'addAttachQueue',

    /**
     * @param {Face} face
     * @protected
     */
    value: function addAttachQueue(face) {
      this.attachQueue_.push(face);
    }
    /**
     * @param {Face} face
     */

  }, {
    key: 'addDetachQueue',
    value: function addDetachQueue(face) {
      this.detachQueue_.push(face);
    }
    /**
     * @param {HTMLDivElement} container
     * @protected
     */

  }, {
    key: 'layoutFaces_',
    value: function layoutFaces_(container) {
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

  }, {
    key: 'render',
    value: function render(cache, container) {
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

  }, {
    key: 'onResize',
    value: function onResize(viewer, container) {
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

  }, {
    key: 'onLeft',
    value: function onLeft(viewer) {
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

  }, {
    key: 'onRight',
    value: function onRight(viewer) {
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

  }, {
    key: 'onMove',
    value: function onMove(viewer, dx, dy) {
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

  }, {
    key: 'onMoveStart',
    value: function onMoveStart(viewer) {
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

  }, {
    key: 'onMoveEnd',
    value: function onMoveEnd(viewer, device, isTap, transitionArea, lastRelX, lastRelY, duration, speedXinEm, speedYinEm) {
      var cache = viewer.cache;
      var container = viewer.container;
      var tracker = viewer.tracker;
      if (isTap) {
        if (lastRelX < transitionArea && this.current_.nextPage) {
          this.seek(cache, container, this.current_.nextPage);
          viewer.render();
          tracker.event('Viewer', 'SeekBy' + device, 'Forward', this.current_.pages[0].idx);
          return;
        } else if (lastRelX > 1 - transitionArea && this.current_.prevPage) {
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

  }, {
    key: 'move_',
    value: function move_(cache, container) {
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

  }, {
    key: 'anim_',
    value: function anim_(next, cache, container) {
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
  }, {
    key: 'currentPages',
    get: function get() {
      return this.current_.pages;
    }
    /**
     * @returns {[number]}
     */

  }, {
    key: 'currentPageNumbers',
    get: function get() {
      var pages = [];
      for (var i = 0; i < this.current_.pages.length; i++) {
        pages.push(this.current_.pages[i].idx);
      }
      return pages;
    }
  }]);

  return HorizontalAxis;
}(Axis);

// TODO: 縦の実装


var VerticalAxis = exports.VerticalAxis = function (_Axis2) {
  _inherits(VerticalAxis, _Axis2);

  /**
   * @param {Tracker} tracker
   * @param {Chapter} chapter
   */
  function VerticalAxis(tracker, chapter) {
    _classCallCheck(this, VerticalAxis);

    return _possibleConstructorReturn(this, (VerticalAxis.__proto__ || Object.getPrototypeOf(VerticalAxis)).call(this, tracker, chapter));
  }

  /**
   * @param {ImageCache} cache
   * @param {HTMLDivElement} container
   * @param {Page} page
   * @override
   */


  _createClass(VerticalAxis, [{
    key: 'seek',
    value: function seek(cache, container, page) {}
    /**
     * @param {ImageCache} cache
     * @param {HTMLDivElement} container
     * @override
     */

  }, {
    key: 'render',
    value: function render(cache, container) {}
    /**
     * @param {Viewer} viewer
     * @return {boolean} reload
     * @override
     */

  }, {
    key: 'onDown',
    value: function onDown(viewer) {
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

  }, {
    key: 'onUp',
    value: function onUp(viewer) {
      if (this.current_.prev) {
        this.seek(this.current_.prev);
        return true;
      } else {
        return false;
      }
    }
  }]);

  return VerticalAxis;
}(Axis);

// - ENTRY POINT -

/**
 * @param {HTMLDivElement} container
 * @param {string} trackID
 * @param {[{images: [{path: string, width: number, height:number, key: (undefined|string)}], width: number, height:number}]} chapterDef
 * @param {function(Viewer)} clbk
 */


function init(container, trackID, chapterDef, clbk) {
  var tracker = new Tracker(trackID);
  var startInit = new Date().getTime();
  var pages = loadChapter(tracker, chapterDef);
  var viewer = new Viewer(container, tracker, new Chapter(pages));
  viewer.init(clbk);
  tracker.pageview();
  var time = new Date().getTime() - startInit;
  tracker.timing('Init', 'Setup Viewer', time);
}

/**
 * @param {Tracker} tracker
 * @param {[{images: [{path: string, width: number, height:number, key: (undefined|string)}], src: string, width: number, height:number}]} chapterDef
 * @returns {Page[]} pages
 */
function loadChapter(tracker, chapterDef) {
  /** @type {[Page]} */
  var pages = [];
  for (var i = 0; i < chapterDef.length; i++) {
    var pageDef = chapterDef[i];
    /** @type {Page} page  */
    var page;
    if (pageDef.images) {
      /** @type {[Image]} */
      var images = [];
      for (var j = 0; j < pageDef.images.length; j++) {
        var imgDef = pageDef.images[j];
        var key = null;
        if (imgDef.key) {
          key = (0, _util.decodeBase64)(imgDef.key);
        }
        var image = new Image(imgDef.path, imgDef.width, imgDef.height, key);
        images.push(image);
      }
      page = new ImagePage(i, pageDef.width, pageDef.height, images);
    } else if (pageDef.src) {
      page = new HTMLPage(i, pageDef.width, pageDef.height, pageDef.src);
    } else {
      comsole.error("Invalid page definition: ", pageDef);
    }
    pages.push(page);
    if (i > 0) {
      pages[i - 1].next = page;
      page.prev = pages[i - 1];
    }
  }
  return pages;
}

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SeekBar = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _minobi = __webpack_require__(0);

var _util = __webpack_require__(2);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SeekBar = exports.SeekBar = function () {
  /**
   * @param {Viewer} viewer
   * @param {HTMLDivElement} container
   * @param {HTMLDivElement} button
   * @param {HTMLDivElement} pagecounter
   * @param {Tracker} tracker
   * @param {number} min
   * @param {number} max
   * @param {number} step
   * @constructor
   */
  function SeekBar(viewer, container, button, pagecounter, tracker, min, max, step, orientation) {
    _classCallCheck(this, SeekBar);

    /** @type {HTMLDivElement} container_ */
    this.container_ = container;
    /** @type {HTMLDivElement} button_ */
    this.button_ = button;
    /** @type {HTMLDivElement} pagecounter_ */
    this.pagecounter_ = pagecounter;

    /** @type {Tracker} tracker_ */
    this.tracker_ = tracker;

    /** @type {number} min_ */
    this.min_ = min;
    /** @type {number} max_ */
    this.max_ = max;
    /** @type {number} step_ */
    this.step_ = step;

    /** @type {number} orientation_ */
    this.orientation_ = orientation;
    /** @type {number} value_ */
    this.value_ = NaN;

    /** @type {number} disableTimer_ */
    this.hideTimer_ = 0;

    /** @type {[number]} seekablePages */
    this.seekablePages_ = null;

    /** @type {Object.<string, [function()]>} */
    this.listeners_ = {};
    this.listeners_['activated'] = [];
    this.listeners_['deactivated'] = [];
    this.listeners_['changed'] = [];

    /**
     * @type {number} activePeriod
     * [ms]. Seekbar will be deactivated after this period. If you set this to 0,
     * seekbar won't be deactivated.
     * @public
     */
    this.activePeriod = 1000;

    /** @type {number} */
    this.initPage_ = 0;

    if (viewer) {
      viewer.seekbar = this;
      viewer.addEventListener("ready", this.onReady_.bind(this));
      viewer.addEventListener("resize", this.onResize_.bind(this));
      viewer.addEventListener("pageenter", function (pages) {
        this.move(pages[0] + 1);
      }.bind(this));
    }
    this.changedTimer_ = 0;
  }

  /** @param {number} v */


  _createClass(SeekBar, [{
    key: 'init',
    value: function init(v) {
      /* global Minobi */
      var self = this;

      this.initPage_ = v;

      /* hide seekbar after [this.activePeriod] */
      var hideBar = this.deactivate.bind(this);
      var showBar = this.activate.bind(this, 0);
      this.deactivateAfter(this.activePeriod);
      this.container_.addEventListener('mouseenter', showBar);
      this.container_.addEventListener('mouseleave', self.deactivateAfter.bind(this, this.activePeriod));

      /* slide event(mouse) */
      var clicked = false;
      var calcPos = function calcPos(event) {
        return (event.clientX - self.container_.getBoundingClientRect().left) / (self.container_.clientWidth - self.button_.clientWidth);
      };
      var orig = -1;
      var mouseDown = function mouseDown(event) {
        if (event.buttons != 0 && !clicked) {
          event.preventDefault();
          clicked = true;
          window.addEventListener('mousemove', mouseMove);
          window.addEventListener('mouseup', mouseUp);
          window.addEventListener('mouseleave', mouseUp);
          orig = self.value_;
        }
      };
      var mouseUp = function mouseUp(event) {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mouseleave', mouseUp);
        if (clicked) {
          event.preventDefault();
          var v = (self.orientation_ > 0 ? calcPos(event) : 1 - calcPos(event)) * (self.max_ - self.min_) + self.min_;
          self.seek(v, 100);
          clicked = false;
          self.tracker_.event('SeekBar', 'SeekByMouse', self.value_ === orig ? 'Same' : self.value_ > orig ? 'Forward' : 'Backward', this.value_);
        }
      };
      var mouseMove = function mouseMove(event) {
        if (clicked) {
          event.preventDefault();
          var v = (self.orientation_ > 0 ? calcPos(event) : 1 - calcPos(event)) * (self.max_ - self.min_) + self.min_;
          self.seek(v, 100);
        }
      };
      this.button_.addEventListener('mousedown', mouseDown);

      // Touch
      var touch = null;
      var touchStart = function touchStart(event) {
        if (!clicked && !!event.targetTouches[0]) {
          event.preventDefault();
          self.activate();
          clicked = true;
          window.addEventListener('touchmove', touchMove, { passive: true });
          window.addEventListener('touchend', touchEnd, false);
          window.addEventListener('touchleave', touchEnd, false);
          window.addEventListener('touchcancel', touchEnd, false);
          touch = event.targetTouches[0];
          orig = self.value_;
        }
      };
      var touchEnd = function touchEnd(event) {
        window.removeEventListener('touchmove', touchMove);
        window.removeEventListener('touchend', touchEnd);
        window.removeEventListener('touchleave', touchEnd);
        window.removeEventListener('touchcancel', touchEnd);
        if (clicked) {
          var v = (self.orientation_ > 0 ? calcPos(touch) : 1 - calcPos(touch)) * (self.max_ - self.min_) + self.min_;
          self.seek(v, 100);
          clicked = false;
          self.deactivateAfter(this.activePeriod);
          self.tracker_.event('SeekBar', 'SeekByTouch', self.value_ === orig ? 'Same' : self.value_ > orig ? 'Forward' : 'Backward', this.value_);
        }
        touch = null;
      };

      var lastMoved = new Date().getTime();
      var touchMove = function touchMove(event) {
        if (!clicked) {
          return;
        }
        var now = new Date().getTime();
        if (now - lastMoved < 10) {
          return;
        }
        lastMoved = now;
        var ntouch = (0, _util.findTouchEvent)(event.touches, touch.identifier);
        if (!ntouch) {
          return;
        }
        touch = ntouch;

        var v = (self.orientation_ > 0 ? calcPos(touch) : 1 - calcPos(touch)) * (self.max_ - self.min_) + self.min_;
        self.seek(v, 100);
      };
      self.button_.addEventListener('touchstart', touchStart, false);
    }
    /**
     * @param {string} name
     * @param {function} clbk
     */

  }, {
    key: 'addEventListener',
    value: function addEventListener(name, clbk) {
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

  }, {
    key: 'removeEventListener',
    value: function removeEventListener(name, clbk) {
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

  }, {
    key: 'dispatchEvent_',
    value: function dispatchEvent_(name) {
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
    /** @param {[number]} v */

  }, {
    key: 'toSeekableValue_',

    /**
      * @param {number} v
      * @returns {number}
      * @private
      */
    value: function toSeekableValue_(v) {
      v = Math.round(v / this.step_) * this.step_;
      v = Math.min(this.max_, Math.max(this.min_, v));
      if (!this.seekablePages_ || this.seekablePages.length === 0) {
        return v;
      }
      var w = this.seekablePages[0];
      for (var i = 1; i < this.seekablePages_.length; i++) {
        if (this.seekablePages[i] > v) {
          break;
        }
        w = this.seekablePages[i];
      }
      return w;
    }
    /**
     * @param {number} v
     * @param {number} delay
     * @param {boolean} reload
     */

  }, {
    key: 'seek',
    value: function seek(v, delay, reload) {
      this.seek_(this.toSeekableValue_(v), delay, reload);
    }
    /**
     * @param {number} v
     * @param {number} delay
     * @param {boolean} reload
     * @private
     */

  }, {
    key: 'seek_',
    value: function seek_(v, delay, reload) {
      if (delay === undefined || delay === null) delay = -1;
      if (!this.updateValue(v) && !reload) {
        return;
      }
      this.moveUI(v);
      var self = this;
      if (delay > 0) {
        if (this.changedTimer_) {
          window.clearTimeout(this.changedTimer_);
        }
        this.changedTimer_ = window.setTimeout(function () {
          self.dispatchEvent_('changed', v);
          self.changedTimer_ = 0;
        }, delay);
      } else if (delay >= 0) {
        if (this.changedTimer_) {
          window.clearTimeout(this.changedTimer_);
        }
        self.dispatchEvent_('changed', v);
      }
    }
    /** @param {number} v */

  }, {
    key: 'move',
    value: function move(v) {
      if (this.updateValue(v)) {
        this.moveUI(v);
      }
    }
    /** @param {number} v */

  }, {
    key: 'moveUI',
    value: function moveUI(v) {
      var total = this.container_.clientWidth - this.button_.clientWidth;
      if (this.orientation_ > 0) {
        var off = total * (v - this.min_) / (this.max_ - this.min_);
        this.button_.style.left = off + 'px';
      } else {
        var off = total * (1 - (v - this.min_) / (this.max_ - this.min_));
        this.button_.style.left = off + 'px';
      }
    }
    /** @param {number} v */

  }, {
    key: 'updateValue',
    value: function updateValue(v) {
      if (v === this.value_) {
        return false;
      }
      this.value_ = v;
      this.pagecounter_.innerText = v + ' / ' + this.max_;
      return true;
    }
    /** @param {number} deactivateAfter */

  }, {
    key: 'activate',
    value: function activate(deactivateAfter) {
      if (this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.container_.classList.remove('hidden');
      if (deactivateAfter) {
        this.deactivateAfter(deactivateAfter);
      }
      this.dispatchEvent_('activated', this);
    }
  }, {
    key: 'deactivate',
    value: function deactivate() {
      if (this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.container_.classList.add('hidden');
      this.dispatchEvent_('deactivated', this);
    }
    /** @param {number} delayMs */

  }, {
    key: 'deactivateAfter',
    value: function deactivateAfter(delayMs) {
      if (this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.hideTimer_ = window.setTimeout(this.deactivate.bind(this), delayMs);
    }
  }, {
    key: 'onReady_',
    value: function onReady_() {
      this.seek_(this.initPage_, 0, true);
    }
  }, {
    key: 'onResize_',
    value: function onResize_() {
      this.seek_(this.value_, 30, true);
    }
  }, {
    key: 'seekablePages',
    set: function set(v) {
      this.seekablePages_ = v;
      if (v && v.length > 0) {
        this.seek(this.value_, 30);
      }
    }
    /** @type {[number]} seekablePages */
    ,
    get: function get() {
      return this.seekablePages_;
    }
  }]);

  return SeekBar;
}();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findTouchEvent = findTouchEvent;
exports.decodeBase64 = decodeBase64;
/**
 * @param {TouchList} touchList
 * @param {number} identifier
 * @returns {Touch} touch
 */
function findTouchEvent(touchList, identifier) {
  // https://www.w3.org/TR/touch-events/
  for (var i = 0; i < touchList.length; i++) {
    if (touchList[i].identifier === identifier) {
      return touchList[i];
    }
  }
  return null;
}

/**
 * @param {string} str
 * @returns {Uint8Array} array
 */
function decodeBase64(str) {
  var raw = window.atob(str);
  var rawLength = raw.length;
  var array = new Uint8Array(new ArrayBuffer(rawLength));
  for (var i = 0; i < rawLength; i++) {
    array[i] = raw.charCodeAt(i);
  }
  return array;
}

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _minobi = __webpack_require__(0);

var _seekbar = __webpack_require__(1);

window.Minobi = {
  init: _minobi.init,
  SeekBar: _seekbar.SeekBar
};

/***/ })
/******/ ]);