(function(){
  /**
   * @param {HTMLDivElement} container
   * @param {HTMLDivElement} button
   * @param {number} min
   * @param {number} max
   * @param {number} step
   * @param {number} hideDelay
   * @constructor
   */
  var SeekBar = function(container, button, pagecounter, min, max, step, orientation, hideDelay) {
    /** @type {HTMLDivElement} container_ */
    this.container_ = container;
    /** @type {HTMLDivElement} button_ */
    this.button_ = button;
    /** @type {HTMLDivElement} pagecounter_ */
    this.pagecounter_ = pagecounter;

    /** @type {number} min_ */
    this.min_ = min;
    /** @type {number} max_ */
    this.max_ = max;
    /** @type {number} step_ */
    this.step_ = step;

    /** @type {number} orientation_ */
    this.orientation_ = orientation;
    /** @type {number} hideDelay_ */
    this.hideDelay_ = hideDelay;
    /** @type {number} value_ */
    this.value_ = NaN;

    /** @param {number} v */
    this.onChanged = function(v) {};

    /** @type {number} disableTimer_ */
    this.hideTimer_ = 0;

    /** @type {[number]} seekablePages */
    this.seekablePages_ = null;

    /** @type {Object.<string, [function()]>} */
    this.listeners_ = {};
    this.listeners_['activated'] = [];
    this.listeners_['deactivated'] = [];

    /**
     * @type {number} activePeriod
     * [ms]. Seekbar will be deactivated after this period. If you set this to 0,
     * seekbar won't be deactivated.
     * @public
     */
    this.activePeriod = 1000;
  };
  SeekBar.prototype = {
    /** @param {number} v */
    init: function(v) {
      /* global Minobi */
      var self = this;

      this.move(v);

      /* hide seekbar after [this.activePeriod] */
      var hideBar = this.deactivate.bind(this);
      var showBar = this.activate.bind(this, 0);
      this.deactivateAfter(this.activePeriod);
      this.container_.addEventListener('mouseenter', showBar);
      this.container_.addEventListener('mouseleave', self.deactivateAfter.bind(this, this.activePeriod));

      /* slide event(mouse) */
      var clicked = false;
      var calcPos = function(event) {
        return (event.clientX - self.container_.getBoundingClientRect().left) /
              (self.container_.clientWidth - self.button_.clientWidth);
      };
      var mouseDown = function(event) {
        if(event.buttons != 0 && !clicked) {
          event.preventDefault();
          clicked = true;
          window.addEventListener('mousemove', mouseMove);
          window.addEventListener('mouseup', mouseUp);
          window.addEventListener('mouseleave', mouseUp);
        }
      };
      var mouseUp = function(event) {
        window.removeEventListener('mousemove', mouseMove);
        window.removeEventListener('mouseup', mouseUp);
        window.removeEventListener('mouseleave', mouseUp);
        if(clicked) {
          event.preventDefault();
          var v = (self.orientation_ > 0 ? calcPos(event) : (1-calcPos(event))) * (self.max_ - self.min_) + self.min_;
          self.seek(v, 100);
          clicked = false;
        }
      };
      var mouseMove = function(event){
        if(clicked) {
          event.preventDefault();
          var v = (self.orientation_ > 0 ? calcPos(event) : (1-calcPos(event))) * (self.max_ - self.min_) + self.min_;
          self.seek(v, 100);
        }
      };
      this.button_.addEventListener('mousedown', mouseDown);

      // Touch
      var touch = null;
      var touchStart = function(event) {
        if(!clicked && !!event.targetTouches[0]) {
          event.preventDefault();
          self.activate();
          clicked = true;
          window.addEventListener('touchmove', touchMove, {passive: true});
          window.addEventListener('touchend', touchEnd, false);
          window.addEventListener('touchleave', touchEnd, false);
          window.addEventListener('touchcancel', touchEnd, false);
          touch = event.targetTouches[0];
        }
      };
      var touchEnd = function(event) {
        window.removeEventListener('touchmove', touchMove);
        window.removeEventListener('touchend', touchEnd);
        window.removeEventListener('touchleave', touchEnd);
        window.removeEventListener('touchcancel', touchEnd);
        if(clicked) {
          var v = (self.orientation_ > 0 ? calcPos(touch) : (1-calcPos(touch))) * (self.max_ - self.min_) + self.min_;
          self.seek(v, 100);
          clicked = false;
          self.deactivateAfter(this.activePeriod);
        }
        touch = null;
      };

      var lastMoved = new Date().getTime();
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

        var v = (self.orientation_ > 0 ? calcPos(touch) : (1 - calcPos(touch))) * (self.max_ - self.min_) + self.min_;
        self.seek(v, 100);
      };
      this.button_.addEventListener('touchstart', touchStart, false);
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
    changedTimer_: 0,
    /** @param {[number]} v */
    set seekablePages(v) {
      this.seekablePages_ = v;
      if(v && v.length > 0) {
        this.seek(this.value_, 30);
      }
    },
    /** @type {[number]} seekablePages */
    get seekablePages() {
      return this.seekablePages_;
    },
    /**
      * @param {number} v
      * @returns {number}
      */
    toSeekableValue_: function(v) {
      v = Math.round(v / this.step_) * this.step_;
      v = Math.min(this.max_, Math.max(this.min_, v));
      if(!this.seekablePages_ || this.seekablePages.length === 0){
        return v;
      }
      var w = this.seekablePages[0];
      for(var i = 1; i < this.seekablePages_.length; i++) {
        if(this.seekablePages[i] > v) {
          break;
        }
        w = this.seekablePages[i];
      }
      return w;
    },
    /**
     * @param {number} v
     * @param {number} delay
     * @param {boolean} reload
     */
    seek: function(v, delay, reload) {
      this.seek_(this.toSeekableValue_(v), delay, reload);
    },
    /**
     * @param {number} v
     * @param {number} delay
     * @param {boolean} reload
     */
    seek_: function(v, delay, reload) {
      if(delay === undefined || delay === null) delay = -1;
      if(!this.updateValue(v) && !reload) {
        return;
      }
      this.move(v);
      var self = this;
      if(delay > 0) {
        if(this.changedTimer_) {
          window.clearTimeout(this.changedTimer_);
        }
        this.changedTimer_ = window.setTimeout(function(){
          self.onChanged(v);
          self.changedTimer_ = 0;
        }, delay);
      } else if(delay >= 0) {
        self.onChanged(v);
      }
    },
    /** @param {number} v */
    move: function(v) {
      if(this.updateValue(v)) {
        var total = this.container_.clientWidth - this.button_.clientWidth;
        if(this.orientation_ > 0) {
          var off = total * (v - this.min_) / (this.max_ - this.min_);
          this.button_.style.left = off + 'px';
        } else {
          var off = total * (1 - ((v - this.min_) / (this.max_ - this.min_)));
          this.button_.style.left = off + 'px';
        }
      }
    },
    /** @param {number} v */
    updateValue: function(v) {
      if(v === this.value_) {
        return false;
      }
      this.value_ = v;
      this.pagecounter_.innerText = v + ' / ' + this.max_;
      return true;
    },
    /** @param {number} deactivateAfter */
    activate: function(deactivateAfter) {
      if(this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.container_.classList.remove('hidden');
      if(deactivateAfter) {
        this.deactivateAfter(deactivateAfter);
      }
      this.dispatchEvent_('activated', this);
    },
    deactivate: function() {
      if(this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.container_.classList.add('hidden');
      this.dispatchEvent_('deactivated', this);
    },
    /** @param {number} delayMs */
    deactivateAfter: function(delayMs) {
      if(this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.hideTimer_ = window.setTimeout(this.deactivate.bind(this), delayMs);
    }
  };
  window.SeekBar = SeekBar;
})();
