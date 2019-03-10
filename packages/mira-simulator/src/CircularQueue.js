const shiftLeft = array => {
  array.push(array.shift());
  return array;
};

const shiftRight = array => {
  array.unshift(array.pop());
  return array;
};

// simple manager class to manipulate arrays as a circular queue
class CircularQueue {
  constructor(...args) {
    this.array = new Array(...args);
  }

  static from(...args) {
    return new CircularQueue(...Array.from(...args));
  }

  get head() {
    return this.array[0];
  }

  get next() {
    shiftLeft(this.array);
    return this.head;
  }

  get prev() {
    shiftRight(this.array);
    return this.head;
  }

  get values() {
    return this.array;
  }
}

export default CircularQueue;
