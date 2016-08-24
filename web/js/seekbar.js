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
  var SeekBar = function(container, button, min, max, step, orientation, hideDelay) {
    /** @type {HTMLDivElement} container_ */
    this.container_ = container;
    /** @type {HTMLDivElement} button_ */
    this.button_ = button;

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
  };
  SeekBar.prototype = {
    /** @param {number} v */
    init: function(v) {
      var self = this;

      /** @type {number} value */
      this.value = v;

      /* hide seekbar after 1000 ms */
      var hideBar = this.deactivate.bind(this);
      var showBar = this.activate.bind(this);
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
        if(!clicked) {
          clicked = true;
          event.preventDefault();
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
          var v = (self.orientation_ > 0 ? calcPos(event) : (1-calcPos(event))) * (self.max_ - self.min_) + self.min_;
          self.value = v;
          clicked = false;
          event.preventDefault();
        }
      };
      var mouseMove = function(event){
        if(event.buttons != 0 && clicked) {
          resetBar();
          var v = (self.orientation_ > 0 ? calcPos(event) : (1-calcPos(event))) * (self.max_ - self.min_) + self.min_;
          self.value = v;
          event.preventDefault();
        }
      };
      this.button_.addEventListener('mousedown', mouseDown);
    },
    /** @returns {number} value */
    get value() {
      return this.value_;
    },
    /** @param {number} v */
    set value(v) {
      v = Math.round(v / this.step_) * this.step_;
      v = Math.min(this.max_, Math.max(this.min_, v));
      if(v === this.value_) {
        return;
      }
      this.value_ = v;
      var total = this.container_.clientWidth - this.button_.clientWidth;
      if(this.orientation_ > 0) {
        var off = total * v / (this.max_ - this.min_);
        this.button_.style.left = off + 'px';
      } else {
        var off = total * (1 - (v / (this.max_ - this.min_)));
        this.button_.style.left = off + 'px';
      }
      this.onChanged(v);
    },
    activate: function() {
      if(this.hideTimer_) {
        window.clearTimeout(this.hideTimer_);
        this.hideTimer_ = 0;
      }
      this.container_.classList.remove('hidden');
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
