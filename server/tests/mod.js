const should = require('should');
const Promise = require('bluebird');
var Widget = require('../models/mod');
var a = Widget.a

describe('widget', function() {
  it('can foo', () => {
    const widget = new Widget();
    console.log(widget.foo())
    widget.foo().should.equal('bar')
  });

  const square = function(num){
    return Promise.resolve(num * num).delay(1000);
  };

  it('Should be ok', () =>{
    return square(2).then(result =>{
      should(result).equal(4);
    });
  });

  it('can get b', done => {
    Widget.b().then(d => {
      d.should.equal(1);
      done();
    });
  });

  it ('should add numbers', () => {
    a().should.equal(123);
  })
});
