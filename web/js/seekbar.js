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
  };
  SeekBar.prototype = {
    /** @param {number} v */
    init: function(v) {
      var self = this;

      /** @type {number} value */
      this.value = v;

      /* mouse events */
      var pushed = false;
      var calcPos = function(event) {
        return (event.clientX - self.container_.getBoundingClientRect().left) /
              (self.container_.clientWidth - self.button_.clientWidth);
      }
      this.button_.addEventListener('mousedown', function(event) {
        if(!pushed) {
          pushed = true;
          event.preventDefault();
        }
      });
      var mouseUp = function(event) {
        if(pushed) {
          var v = (self.orientation_ > 0 ? calcPos(event) : (1-calcPos(event))) * (self.max_ - self.min_) + self.min_;
          self.value = v;
          console.log(v);
          pushed = false;
          event.preventDefault();
        }
      };
      this.button_.addEventListener('mouseup', mouseUp);
      this.container_.addEventListener('mouseup', mouseUp);
      this.container_.addEventListener('mouseleave', mouseUp);
      var mouseMove = function(event){
        if(event.buttons != 0 && pushed) {
          var v = (self.orientation_ > 0 ? calcPos(event) : (1-calcPos(event))) * (self.max_ - self.min_) + self.min_;
          self.value = v;
          event.preventDefault();
        }
      };
      this.container_.addEventListener('mousemove', mouseMove);
      this.button_.addEventListener('mousemove', mouseMove);
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
    }
  };
  window.SeekBar = SeekBar;
})();
