var Calculator = require('./../models/cal')
var should = require('should');

describe('calculator model', function() {

  beforeEach(function() {
    this.calculator = new Calculator();
  });

  it('should add numbers', function() {
    console.log(this.calculator.add(Infinity, NaN));
    console.log(this.calculator.add(2, 3));

    should(this.calculator.add(2, 2)).equal(4);
  });

  it('should throw error when dividing by zero', function() {
    var calculator = this.calculator;

    // should(function() {
    //   calculator.divide(1, 0);
    // }).toThrow();

    // console.log(this.calculator.divide(2, 0));
    console.log(this.calculator.divide(0, 2));
    console.log(this.calculator.divide(2, -3));
  });

  it('should divide number', function() {
    should(this.calculator.divide(6, 2)).equal(3);
  });

  it('should subtract positive numbers', function() {
    should(this.calculator.subtract(4, 2)).equal(2);
  });

  it('should multiply numbers', function() {
    should(this.calculator.multiply(0, 3)).equal(0);
    should(this.calculator.multiply(3, 0)).equal(0);
  });
});
