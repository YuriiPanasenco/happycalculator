if ( typeof module === "object" && module && typeof module.exports === "object" ) {
  var expect = require('chai').expect;
  var happycalculator = require('../index');
}



describe('calculator', function () {
  'use strict';

  describe('fixBracketsPre', function () {
    it("(20) should return (, 20)", function () {
      var test_data = '(20)';
      expect(happycalculator.fixBracketsPre(test_data)).to.deep.equal(['(', '20)']);
    });
  });

  describe('fixBracketsPost', function () {
    it("(20) should return (20)", function () {
      var test_data = '(20)';
      expect(happycalculator.fixBracketsPost(test_data)).to.deep.equal(['(20)']);
    });
    it("20) should return 20, )", function () {
      var test_data = '20)';
      expect(happycalculator.fixBracketsPost(test_data)).to.deep.equal(['20', ')']);
    });

    it("20)) should return 20, ), )", function () {
      var test_data = '20))';
      expect(happycalculator.fixBracketsPost(test_data)).to.deep.equal(['20', ')', ')']);
    });
  });


  describe('fixBrackets', function () {
    it("(20) should return 20", function () {
      var test_data = '(20)';
      expect(happycalculator.fixBrackets(test_data)).to.deep.equal(['20']);
    });
  });



  describe('fixFormulas', function() {


    afterEach(function() {
      happycalculator.removeFormulas();
    });


    it("sqrt__custom(20) should return ['(', '20', '*', '20', ')']", function() {
      var test_data = 'sqrt__custom(20)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '20', '*', '20', ')']);
    });

    it("sqrt__custom(20 + 20) should return ['(', '20', '*', '20', ')']", function() {
      var test_data = 'sqrt__custom(20+20)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')']);

    });

    it("sqrt__custom(sqrt__custom(20)) should return ['(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']", function() {
      var test_data = 'sqrt__custom(sqrt__custom(20))';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']);

    });

    it("sqrt__custom(20) should return ['(', '20', '+', '20', ')']", function() {
      happycalculator.addFormulas({
        'sqrt__custom': '$1 + $1'
      });
      var test_data = 'sqrt__custom(20)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '20', '+', '20', ')']);

    });

    it("custom(20, 10) should return ['(', '20', '+', '10', ')']", function() {
      happycalculator.addFormulas({
        'custom': '$1 + $2'
      });
      var test_data = 'custom(20, 10)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '20', '+', '10', ')']);

    });

    it("when add 'happy cal' : $1 + $2 shoud return [happy_cal]", function() {
      happycalculator.addFormulas({
        'happy cal': '$1 + $2'
      });
      var test_data = 'happy_cal(20, 10)';
      expect(happycalculator.fixFormulas(test_data)).to.deep.equal(['(', '20', '+', '10', ')']);
    });


  });

  describe('fixFormulasLoop', function() {
    it("[ 'sqrt__custom(sqrt__custom(2', ')', ')' ] should return ['sqrt__custom(sqrt__custom(2))']", function() {
      var test_data = [ 'sqrt__custom(sqrt__custom(2', ')', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt__custom(sqrt__custom(2))']);

    });
    it("[ 'sqrt__custom(2', '+', '2', ')' ] should return ['sqrt__custom(2+2)']", function() {
      var test_data = [ 'sqrt__custom(2', '+', '2', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt__custom(2+2)']);

    });
    it("[ 'sqrt__custom(sqrt__custom(2', '+', '2', ')', ')' ] should return ['sqrt__custom(sqrt__custom(2+2))']", function() {
      var test_data = [ 'sqrt__custom(sqrt__custom(2', '+', '2', ')', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt__custom(sqrt__custom(2+2))']);
    });

    it("[ 'sqrt__custom(sqrt__custom(2', '+', '2', ')', ')' ] should return ['sqrt__custom(sqrt__custom(sqrt__custom(2+2)))']", function() {
      var test_data = [ 'sqrt__custom(sqrt__custom(sqrt__custom(2', '+', '2', ')', ')', ')' ];
      expect(happycalculator.fixFormulasLoop(test_data)).to.deep.equal(['sqrt__custom(sqrt__custom(sqrt__custom(2+2)))']);
    });
  });


  describe('convert', function () {

    it('20.1% * 20 should return [0.201, *, 20]', function() {
      var test_data = '20.1% * 20';
      expect(happycalculator.convert(test_data)).to.deep.equal(['0.201', '*', '20']);
    });

    it("20 * ( 10 + 20 ) / 20 should return ['20', '*', '(', '10', '+', '20', ')', '/', '20']", function () {
      var test_data = '20 * ( 10 + 20 ) / 20';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '20']);

    });

    it("20 * ( 10 + 20 ) / sqrt__custom(20) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '20', '*', '20', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt__custom(20)';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '(', '20', '*', '20', ')']);

    });


    it("20 * ( 10 + 20 ) / sqrt__custom(20 + 20) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt__custom(20 + 20)';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')']);

    });


    it("20 * ( 10 + 20 ) / sqrt__custom(sqrt__custom(20)) should return ['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']", function() {
      var test_data = '20 * ( 10 + 20 ) / sqrt__custom(sqrt__custom(20))';
      expect(happycalculator.convert(test_data)).to.deep.equal(['20', '*', '(', '10', '+', '20', ')', '/', '(', '(', '20', '*', '20', ')', '*', '(', '20', '*', '20', ')', ')']);

    });

    it("sqrt__custom(sqrt__custom(20+20)) should return right", function() {
      var test_data = 'sqrt__custom(sqrt__custom(20+20))';
      expect(happycalculator.convert(test_data)).to.deep.equal(['(', '(', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')', ')', '*', '(', '(', '(', '20', '+', '20', ')', '*', '(', '20', '+', '20', ')', ')', ')', ')']);

      //((((20+20)*(20+20)))*(((20+20)*(20+20))))
    });
  });

  describe('shunt', function() {

    it("20 * ( 10 + 20 ) / 20 should return [ '20', '10', '20', '+', '*', '20', '/' ]", function() {
      var test_data = '20 * ( 10 + 20 ) / 20';

      expect(happycalculator.shunt(test_data)).to.deep.equal([ '20', '10', '20', '+', '*', '20', '/' ]);

    });
  });

  describe('calculate', function() {
    it("20 * ( 10 + 20 ) / 20 should return 30", function() {
      var test_data = '20 * ( 10 + 20 ) / 20';
      expect(happycalculator.calculate(test_data)).to.equal(30);
    });

    it("20.1+1 should return 21.1", function() {
      var test_data = '20.1+1';
      expect(happycalculator.calculate(test_data)).to.equal(21.1);

    });

    it("20.1%+1 should return 1.201", function() {
      var test_data = '20.1%+1';
      expect(happycalculator.calculate(test_data)).to.equal(1.201);

    });

    it("sqrt__custom(sqrt__custom(20)) should return 160000", function() {
      var test_data = 'sqrt__custom(sqrt__custom(20))';
      expect(happycalculator.calculate(test_data)).to.equal(160000);
    });


    it("sqrt__custom(20+20) should return 1600", function() {
      var test_data = 'sqrt__custom(20+20)';
      expect(happycalculator.calculate(test_data)).to.equal(1600);
    });


    it("sqrt__custom(20+20) + sqrt__custom(20+20) should return 3200", function() {
      var test_data = 'sqrt__custom(20+20) + sqrt__custom(20+20)';
      expect(happycalculator.calculate(test_data)).to.equal(3200);

    });

    it("sqrt__custom(sqrt__custom(2+2)) should return 256", function() {
      var test_data = 'sqrt__custom(sqrt__custom(2+2))';
      expect(happycalculator.calculate(test_data)).to.equal(256);

    });

    it("custom(2+2) should throw error", function() {
      var test_data = 'custom(2+2)';
      expect(function(){happycalculator.calculate(test_data);}).to.throw(Error, 'unvalid string for calculate');
    });


    it("20+ should throw error", function() {
      var test_data = '20+';
      expect(function(){happycalculator.calculate(test_data);}).to.throw(Error, 'error formula to convert please!');
    });


    it("0.1+0.2 should return 0.3", function() {
      var test_data = '0.1+0.2';
      expect(happycalculator.calculate(test_data)).to.equal(0.3);
    });


    it("sin(30) should return 0.5", function() {
      var test_data = 'sin(30)';
      expect(happycalculator.calculate(test_data)).to.equal(0.5);
    });

    it("round(30.52) should return 31", function() {
      var test_data = 'round(30.52)';
      expect(happycalculator.calculate(test_data)).to.equal(31);
    });

    it("cos(60) should return 0.5", function() {
      var test_data = 'cos(60)';
      expect(happycalculator.calculate(test_data)).to.equal(0.5);
    });

    it("2^3 should return 8", function() {
      var test_data = '2^3';
      expect(happycalculator.calculate(test_data)).to.equal(8);
    });

    it("12 mod 5 should return 2", function() {
      var test_data = '12 mod 5';
      expect(happycalculator.calculate(test_data)).to.equal(2);
    });

    it("Min(12, 4) should return 4", function() {
      var test_data = 'Min(12, 4)';
      expect(happycalculator.calculate(test_data)).to.equal(4);
    });

    it("Max(12, 4) should return 12", function() {
      var test_data = 'Max(12, 4)';
      expect(happycalculator.calculate(test_data)).to.equal(12);
    });

    it("Max(12+3, 100/4) should return 12", function() {
      var test_data = 'Max(12+3, 100/4)';
      expect(happycalculator.calculate(test_data)).to.equal(25);
    });

    it("cos(60+30) should return 0", function() {
      var test_data = 'cos(90+cos(90))';
      expect(happycalculator.calculate(test_data)).to.equal(0);
    });


    it("sqrt(0.0009) should return 0.03", function() {
      var test_data = 'sqrt(0.09)';
      expect(happycalculator.calculate(test_data)).to.equal(0.3);
    });


  });


  describe('parse', function() {

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab should return ['(3+4)*3']", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab';
      expect(happycalculator.parse(test_data)).to.deep.equal(['(3+4)*3']);

    });

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab should return ['(3+4)*3', '4+4']", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab';
      expect(happycalculator.parse(test_data)).to.deep.equal(['(3+4)*3', '4+4']);

    });

  });


  describe('calculateCode', function() {

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab should return [21]", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab';
      expect(happycalculator.calculateCode(test_data)).to.deep.equal([21]);
    });

    it("a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab should return [21, 8]", function() {
      var test_data = 'a=$1 + $2; ab = 3; abc = 4; a(ab,abc)*ab; ab = 4; ab+ab';
      expect(happycalculator.calculateCode(test_data)).to.deep.equal([21, 8]);
    });

    it("a=$1 + $2; a(a(5,6), a(5,6)) should return [22]", function() {
      var test_data = 'a=$1 + $2; a(a(5,6), a(5,6))';
      expect(happycalculator.calculateCode(test_data)).to.deep.equal([22]);
    });

  });

});