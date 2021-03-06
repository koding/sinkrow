var Sequence, slice;

Sequence = (function() {
  function Sequence(fn, cb) {
    this.fn = fn;
    this.cb = cb;
    this.times = 0;
    this.args = [];
  }

  Sequence.prototype.next = function(args) {
    var nextArgs, nextFn;
    if (!(nextArgs = this.args.shift())) {
      nextFn = this.cb;
    } else {
      nextFn = this.next.bind(this, nextArgs);
    }
    if (this.times--) {
      return this.fn.apply(this, args.concat(nextFn));
    }
  };

  Sequence.prototype.add = function(args) {
    if (!this.times++) {
      return process.nextTick(this.next.bind(this, args));
    } else {
      return this.args.push(args);
    }
  };

  return Sequence;

})();

slice = [].slice;

module.exports = function(fn, cb) {
  var sequence;
  sequence = new Sequence(fn, cb);
  return function() {
    return sequence.add(slice.call(arguments));
  };
};
