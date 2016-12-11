class Watch {
  constructor(queue) {
    this._queue = Array.isArray(queue) ? queue.slice() : [];
  }

  add(element) {
    this._queue.push(element);
  }

  remove(element) {
    this._queue = this._queue.filter((item) => {
      return item !== element;
    });
  }
}

export {
  Watch
};
