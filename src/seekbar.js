import {Viewer, Tracker} from './minobi';
import {findTouchEvent} from './util';

export class SeekBar {
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
  constructor(viewer, container, button, pagecounter, tracker, min, max, step, orientation) {
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
      viewer.addEventListener("pageenter", function (pages, cause) {
        this.move(pages[0] + 1);
      }.bind(this));
    }
    this.changedTimer_ = 0;
  }

  /** @param {number} v */
  init(v) {
    /* global Minobi */
    var self = this;

    this.initPage_ = v;

    /* hide seekbar after [this.activePeriod] */
    var hideBar = this.deactivate.bind(this, 'mouse');
    var showBar = this.activate.bind(this, 0, 'mouse');
    this.deactivateAfter(this.activePeriod, 'mouse');
    this.container_.addEventListener('mouseenter', showBar);
    this.container_.addEventListener('mouseleave', self.deactivateAfter.bind(this, this.activePeriod, 'mouse'));

    /* slide event(mouse) */
    var clicked = false;
    var calcPos = function (event) {
      return (event.clientX - self.container_.getBoundingClientRect().left) /
        (self.container_.clientWidth - self.button_.clientWidth);
    };
    var orig = -1;
    var mouseDown = function (event) {
      if (event.buttons != 0 && !clicked) {
        event.preventDefault();
        clicked = true;
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mouseup', mouseUp);
        window.addEventListener('mouseleave', mouseUp);
        orig = self.value_;
      }
    };
    var mouseUp = function (event) {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
      window.removeEventListener('mouseleave', mouseUp);
      if (clicked) {
        event.preventDefault();
        var v = (self.orientation_ > 0 ? calcPos(event) : (1 - calcPos(event))) * (self.max_ - self.min_) + self.min_;
        self.seek(v, 100);
        clicked = false;
        self.tracker_.event('SeekBar', 'SeekByMouse', self.value_ === orig ? 'Same' : self.value_ > orig ? 'Forward' : 'Backward', this.value_);
      }
    };
    var mouseMove = function (event) {
      if (clicked) {
        event.preventDefault();
        var v = (self.orientation_ > 0 ? calcPos(event) : (1 - calcPos(event))) * (self.max_ - self.min_) + self.min_;
        self.seek(v, 100);
      }
    };
    this.button_.addEventListener('mousedown', mouseDown);

    // Touch
    var touch = null;
    var touchStart = function (event) {
      if (!clicked && !!event.targetTouches[0]) {
        event.preventDefault();
        self.activate('touch');
        clicked = true;
        window.addEventListener('touchmove', touchMove, { passive: true });
        window.addEventListener('touchend', touchEnd, false);
        window.addEventListener('touchleave', touchEnd, false);
        window.addEventListener('touchcancel', touchEnd, false);
        touch = event.targetTouches[0];
        orig = self.value_;
      }
    };
    var touchEnd = function (event) {
      window.removeEventListener('touchmove', touchMove);
      window.removeEventListener('touchend', touchEnd);
      window.removeEventListener('touchleave', touchEnd);
      window.removeEventListener('touchcancel', touchEnd);
      if (clicked) {
        var v = (self.orientation_ > 0 ? calcPos(touch) : (1 - calcPos(touch))) * (self.max_ - self.min_) + self.min_;
        self.seek(v, 100);
        clicked = false;
        self.deactivateAfter(this.activePeriod, 'touch');
        self.tracker_.event('SeekBar', 'SeekByTouch', self.value_ === orig ? 'Same' : self.value_ > orig ? 'Forward' : 'Backward', this.value_);
      }
      touch = null;
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

      var v = (self.orientation_ > 0 ? calcPos(touch) : (1 - calcPos(touch))) * (self.max_ - self.min_) + self.min_;
      self.seek(v, 100);
    };
    self.button_.addEventListener('touchstart', touchStart, false);
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
  /** @param {[number]} v */
  set seekablePages(v) {
    this.seekablePages_ = v;
    if (v && v.length > 0) {
      this.seek(this.value_, 30);
    }
  }
  /** @type {[number]} seekablePages */
  get seekablePages() {
    return this.seekablePages_;
  }
  /**
    * @param {number} v
    * @returns {number}
    * @private
    */
  toSeekableValue_(v) {
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
  seek(v, delay, reload) {
    this.seek_(this.toSeekableValue_(v), delay, reload);
  }
  /**
   * @param {number} v
   * @param {number} delay
   * @param {boolean} reload
   * @private
   */
  seek_(v, delay, reload) {
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
  move(v) {
    if (this.updateValue(v)) {
      this.moveUI(v);
    }
  }
  /** @param {number} v */
  moveUI(v) {
    var total = this.container_.clientWidth - this.button_.clientWidth;
    if (this.orientation_ > 0) {
      var off = total * (v - this.min_) / (this.max_ - this.min_);
      this.button_.style.left = off + 'px';
    } else {
      var off = total * (1 - ((v - this.min_) / (this.max_ - this.min_)));
      this.button_.style.left = off + 'px';
    }
  }
  /** @param {number} v */
  updateValue(v) {
    if (v === this.value_) {
      return false;
    }
    this.value_ = v;
    this.pagecounter_.innerText = v + ' / ' + this.max_;
    return true;
  }
  /**
   * @param {number} deactivateAfter
   * @param {string} cause
   */
  activate(deactivateAfter, cause) {
    cause = cause || '?';
    if (this.hideTimer_) {
      window.clearTimeout(this.hideTimer_);
      this.hideTimer_ = 0;
    }
    this.container_.classList.remove('hidden');
    if (deactivateAfter) {
      this.deactivateAfter(deactivateAfter, cause);
    }
    this.dispatchEvent_('activated', cause);
  }
  /**
   * @param {string} cause
   */
  deactivate(cause) {
    cause = cause || '?';
    if (this.hideTimer_) {
      window.clearTimeout(this.hideTimer_);
      this.hideTimer_ = 0;
    }
    this.container_.classList.add('hidden');
    this.dispatchEvent_('deactivated', cause);
  }
  /**
   * @param {number} delayMs
   * @param {string} cause
   */
  deactivateAfter(delayMs, cause) {
    if (this.hideTimer_) {
      window.clearTimeout(this.hideTimer_);
      this.hideTimer_ = 0;
    }
    this.hideTimer_ = window.setTimeout(this.deactivate.bind(this, cause), delayMs);
  }
  onReady_() {
    this.seek_(this.initPage_, 0, true);
  }
  onResize_() {
    this.seek_(this.value_, 30, true);
  }
}
