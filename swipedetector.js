import {EventEmitter} from 'events';

export class SwipeDetector {
  constructor(element) {
    this.element = element;
    this.swipe = null;

    this._eventEmitter = new EventEmitter();

    this.element.addEventListener('touchstart', this._begin.bind(this));
    this.element.addEventListener('touchmove', this._move.bind(this));
    this.element.addEventListener('touchend', this._end.bind(this));

    this.element.addEventListener('mousedown', this._begin.bind(this));
    this.element.addEventListener('mousemove', this._move.bind(this));
    this.element.addEventListener('mouseup', this._end.bind(this));
  }

  _coords(event) {
    if (event.changedTouches) {
      return {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      };
    } else {
      return {
        x: event.clientX,
        y: event.clientY,
      };
    }
  }

  _begin(event) {
    this.swipe = {coords: this._coords(event), time: Date.now()};
  }

  _move(event) {
    if (!this.swipe) return;
    this._eventEmitter.emit('change', this._coords(event).x - this.swipe.coords.x);
  }

  _end(event) {
    if (!this.swipe) return;

    let coords = this._coords(event),
      dx = coords.x - this.swipe.coords.x,
      dy = coords.y - this.swipe.coords.y,
      horizontal = (Math.abs(dx) > Math.abs(dy)),
      distance = Math.abs(horizontal ? dx : dy);

    if ((Date.now() - this.swipe.time) > 1000) return;
    if (distance < 40) return;

    if (horizontal) {
      this._eventEmitter.emit(dx < 0 ? 'left' : 'right');
    } else {
      this._eventEmitter.emit(dy < 0 ? 'up' : 'down');
    }
  }

  get emitter() {
    return this._eventEmitter;
  }
}
