'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SwipeDetector = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _events = require('events');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var SwipeDetector = exports.SwipeDetector = function () {
  function SwipeDetector(element) {
    _classCallCheck(this, SwipeDetector);

    this.element = element;
    this.swipe = null;

    this._eventEmitter = new _events.EventEmitter();

    this.element.addEventListener('touchstart', this._begin.bind(this));
    this.element.addEventListener('touchmove', this._move.bind(this));
    this.element.addEventListener('touchend', this._end.bind(this));

    this.element.addEventListener('mousedown', this._begin.bind(this));
    this.element.addEventListener('mousemove', this._move.bind(this));
    this.element.addEventListener('mouseup', this._end.bind(this));
  }

  _createClass(SwipeDetector, [{
    key: '_coords',
    value: function _coords(event) {
      if (event.changedTouches) {
        return {
          x: event.changedTouches[0].clientX,
          y: event.changedTouches[0].clientY
        };
      } else {
        return {
          x: event.clientX,
          y: event.clientY
        };
      }
    }
  }, {
    key: '_begin',
    value: function _begin(event) {
      this.swipe = { coords: this._coords(event), time: Date.now() };
    }
  }, {
    key: '_move',
    value: function _move(event) {
      if (!this.swipe) return;
      this._eventEmitter.emit('change', this._coords(event).x - this.swipe.coords.x);
    }
  }, {
    key: '_end',
    value: function _end(event) {
      if (!this.swipe) return;

      var coords = this._coords(event),
          dx = coords.x - this.swipe.coords.x,
          dy = coords.y - this.swipe.coords.y,
          horizontal = Math.abs(dx) > Math.abs(dy),
          distance = Math.abs(horizontal ? dx : dy);

      if (Date.now() - this.swipe.time > 1000) return;
      if (distance < 40) return;

      if (horizontal) {
        this._eventEmitter.emit(dx < 0 ? 'left' : 'right');
      } else {
        this._eventEmitter.emit(dy < 0 ? 'up' : 'down');
      }
    }
  }, {
    key: 'emitter',
    get: function get() {
      return this._eventEmitter;
    }
  }]);

  return SwipeDetector;
}();