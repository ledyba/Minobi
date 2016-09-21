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
  };
  SeekBar.prototype = {
    /** @param {number} v */
    init: function(v) {
      var self = this;

      /** @type {number} value */
      this.value = v;

      /* hide seekbar after 1000 ms */
      var hideBar = this.deactivate.bind(this);
      var showBar = this.activate.bind(this, 0);
      self.deactivateAfter(1000);
      this.container_.addEventListener('mouseenter', showBar);
      this.container_.addEventListener('mouseleave', self.deactivateAfter.bind(this, 1000));

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
          self.value = v;
          clicked = false;
        }
      };
      var mouseMove = function(event){
        if(clicked) {
          event.preventDefault();
          var v = (self.orientation_ > 0 ? calcPos(event) : (1-calcPos(event))) * (self.max_ - self.min_) + self.min_;
          self.value = v;
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
          self.value = v;
          clicked = false;
          self.deactivateAfter(1000);
        }
        touch = null;
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

        var v = (self.orientation_ > 0 ? calcPos(touch) : (1 - calcPos(touch))) * (self.max_ - self.min_) + self.min_;
        self.value = v;
      };
      this.button_.addEventListener('touchstart', touchStart, false);
    },
    /** @returns {number} value */
    get value() {
      return this.value_;
    },
    changedTimer_: 0,
    /** @param {number} v */
    set value(v) {
      this.move(v, 100);
    },
    /** @param {[number]} v */
    set seekablePages(v) {
      this.seekablePages_ = v;
      if(v && v.length > 0) {
        this.move(this.value_, 30);
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
    toSeekableValue: function(v) {
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
    move: function(v, delay, reload) {
      this.move_(this.toSeekableValue(v), delay, reload);
    },
    /**
     * @param {number} v
     * @param {number} delay
     * @param {boolean} reload
     */
    move_: function(v, delay, reload) {
      if(delay === undefined || delay === null) delay = -1;
      if(!this.updateValue(v) && !reload) {
        return;
      }
      this.moveSeekbar_(v);
      if(delay > 0) {
        var self = this;
        if(this.changedTimer_) {
          window.clearTimeout(this.changedTimer_);
        }
        this.changedTimer_ = window.setTimeout(function(){
          self.onChanged(v);
          self.changedTimer_ = 0;
        }, delay);
      }
    },
    /** @param {number} v */
    moveSeekbar_: function(v) {
      var total = this.container_.clientWidth - this.button_.clientWidth;
      if(this.orientation_ > 0) {
        var off = total * (v - this.min_) / (this.max_ - this.min_);
        this.button_.style.left = off + 'px';
      } else {
        var off = total * (1 - ((v - this.min_) / (this.max_ - this.min_)));
        this.button_.style.left = off + 'px';
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
    },
    deactivate: function() {
      if(this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.container_.classList.add('hidden');
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
