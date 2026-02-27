/**
 * Jest tests for the Jison parser
 * 
 */
const parse = require("../src/parser.js").parse;

describe('Parser Tests', () => {
  describe('Basic number parsing', () => {
    test('should parse single numbers', () => {
      expect(parse("42")).toBe(42);
      expect(parse("0")).toBe(0);
      expect(parse("123")).toBe(123);
    });
  });

  describe('Basic arithmetic operations', () => {
    test('should handle addition', () => {
      expect(parse("3 + 5")).toBe(8);
      expect(parse("10 + 20")).toBe(30);
      expect(parse("0 + 1")).toBe(1);
    });

    test('should handle subtraction', () => {
      expect(parse("10 - 3")).toBe(7);
      expect(parse("1 - 2")).toBe(-1);
      expect(parse("0 - 5")).toBe(-5);
    });

    test('should handle multiplication', () => {
      expect(parse("3 * 4")).toBe(12);
      expect(parse("7 * 8")).toBe(56);
      expect(parse("0 * 10")).toBe(0);
    });

    test('should handle division', () => {
      expect(parse("15 / 3")).toBe(5);
      expect(parse("20 / 4")).toBe(5);
      expect(parse("1 / 2")).toBe(0.5);
    });

    test('should handle exponentiation', () => {
      expect(parse("2 ** 3")).toBe(8);
      expect(parse("3 ** 2")).toBe(9);
      expect(parse("5 ** 0")).toBe(1);
      expect(parse("10 ** 1")).toBe(10);
    });
  });

  describe('Operator precedence and associativity', () => {
    test('should handle left associativity for same precedence operations', () => {
      expect(parse("10 - 4 - 3")).toBe(3); // (10 - 4) - 3 = 3
      expect(parse("7 - 5 - 1")).toBe(1);  // (7 - 5) - 1 = 1
      expect(parse("20 / 4 / 2")).toBe(2.5); // (20 / 4) / 2 = 2.5
      expect(parse("8 / 2 / 2")).toBe(2);   // (8 / 2) / 2 = 2
    });
  });

  describe('Complex expressions', () => {
    test('should handle multiple operations of same precedence', () => {
      expect(parse("1 + 2 + 3 + 4")).toBe(10);    // ((1 + 2) + 3) + 4 = 10
      expect(parse("2 * 3 * 4")).toBe(24);        // (2 * 3) * 4 = 24
      expect(parse("100 - 20 - 10 - 5")).toBe(65); // ((100 - 20) - 10) - 5 = 65
    });
  });

  describe('Edge cases', () => {
    test('should handle expressions with extra whitespace', () => {
      expect(parse("  3   +   5  ")).toBe(8);
      expect(parse("\t2\t*\t4\t")).toBe(8);
      expect(parse("1+2")).toBe(3);  // no spaces
    });

    test('should handle zero in operations', () => {
      expect(parse("0 + 0")).toBe(0);
      expect(parse("0 - 0")).toBe(0);
      expect(parse("0 * 100")).toBe(0);
      expect(parse("5 + 0")).toBe(5);
      expect(parse("10 - 0")).toBe(10);
    });

    test('should handle division by zero', () => {
      expect(parse("5 / 0")).toBe(Infinity);
      expect(parse("0 / 0")).toBe(NaN);
    });

    test('should handle negative results', () => {
      expect(parse("3 - 5")).toBe(-2);
      expect(parse("0 - 10")).toBe(-10);
      expect(parse("2 * 3 - 10")).toBe(-4);  // (2 * 3) - 10 = -4
    });

    test('should handle decimal results', () => {
      expect(parse("5 / 2")).toBe(2.5);
      expect(parse("7 / 4")).toBe(1.75);
      expect(parse("1 / 3")).toBeCloseTo(0.3333333333333333);
    });

    test('should handle large numbers', () => {
      expect(parse("999 + 1")).toBe(1000);
      expect(parse("1000000 / 1000")).toBe(1000);
      expect(parse("99 ** 2")).toBe(9801);
    });
  });

  describe('Input validation and error cases', () => {
    test('should handle invalid input gracefully', () => {
      // These should throw errors or be handled by the parser
      expect(() => parse("")).toThrow();
      expect(() => parse("abc")).toThrow();
      expect(() => parse("3 +")).toThrow();
      expect(() => parse("+ 3")).toThrow();
      expect(() => parse("3 + + 4")).toThrow();
      // expect(() => parse("3.5")).toThrow(); // Only integers are supported
    });

    test('should handle incomplete expressions', () => {
      expect(() => parse("3 +")).toThrow();
      expect(() => parse("* 5")).toThrow();
      expect(() => parse("3 4")).toThrow(); // Missing operator
    });
  });

  describe('Regression tests', () => {
    test('should match examples from index.js', () => {
      expect(parse("1 - 2")).toBe(-1);
      expect(parse("10 - 4 - 3")).toBe(3);
      expect(parse("7 - 5 - 1")).toBe(1);
    });
  });

// NUEVOS TEST LINEA DE COMENTRAIOS
  describe('Line comments', () => {
    test('should skip a single-line comment before expression', () => {
      expect(parse("// comentario\n42")).toBe(42);
      expect(parse("// comentario\n3 + 5")).toBe(8);
    });

    test('should skip an inline comment after expression', () => {
      expect(parse("3 + 5 // suma")).toBe(8);
      expect(parse("10 - 3 // resta")).toBe(7);
    });

    test('should skip multiple consecutive comments', () => {
      expect(parse("// primer comentario\n// segundo comentario\n2 * 4")).toBe(8);
    });

    test('should skip an empty comment', () => {
      expect(parse("//\n42")).toBe(42);
    });

    test('should skip comments with special characters', () => {
      expect(parse("// @#$%^&*\n10")).toBe(10);
      expect(parse("// 3 + 5\n2 + 2")).toBe(4);
    });
  });

// NUEVOS TEST NUMERO FLOTANTES
  describe('Floating point numbers', () => {
    test('should parse simple decimal numbers', () => {
      expect(parse("2.35")).toBeCloseTo(2.35);
      expect(parse("0.5")).toBeCloseTo(0.5);
      expect(parse("0.001")).toBeCloseTo(0.001);
      expect(parse("1.0")).toBeCloseTo(1.0);
    });

    test('should parse scientific notation with lowercase e', () => {
      expect(parse("2.35e3")).toBeCloseTo(2350);
      expect(parse("2.35e+3")).toBeCloseTo(2350);
      expect(parse("2.35e-3")).toBeCloseTo(0.00235);
      expect(parse("5e2")).toBeCloseTo(500);
    });

    test('should parse scientific notation with uppercase E', () => {
      expect(parse("2.35E3")).toBeCloseTo(2350);
      expect(parse("2.35E+3")).toBeCloseTo(2350);
      expect(parse("2.35E-3")).toBeCloseTo(0.00235);
      expect(parse("1.2E+2")).toBeCloseTo(120);
    });

    test('should still parse integers correctly', () => {
      expect(parse("23")).toBe(23);
      expect(parse("100")).toBe(100);
    });

    test('should handle arithmetic with decimal numbers', () => {
      expect(parse("1.5 + 1.5")).toBeCloseTo(3.0);
      expect(parse("10.5 * 2")).toBeCloseTo(21);
      expect(parse("2.5 - 1.0")).toBeCloseTo(1.5);
      expect(parse("5.0 / 2")).toBeCloseTo(2.5);
    });

    test('should handle arithmetic with scientific notation', () => {
      expect(parse("1.5e2 + 0.5e2")).toBeCloseTo(200);
      expect(parse("1.5e2 / 2")).toBeCloseTo(75);
      expect(parse("2e3 * 2")).toBeCloseTo(4000);
    });

    test('should handle floats with comments', () => {
      expect(parse("2.35e-3 + 1 // suma con float")).toBeCloseTo(1.00235);
      expect(parse("// operacion\n1.5 * 2")).toBeCloseTo(3.0);
    });
  });
  
});
