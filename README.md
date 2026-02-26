# Syntax Directed Translation with Jison

Jison is a tool that receives as input a Syntax Directed Translation and produces as output a JavaScript parser  that executes
the semantic actions in a bottom up ortraversing of the parse tree.
 

## Compile the grammar to a parser

See file [grammar.jison](./src/grammar.jison) for the grammar specification. To compile it to a parser, run the following command in the terminal:
``` 
➜  jison git:(main) ✗ npx jison grammar.jison -o parser.js
```

## Use the parser

After compiling the grammar to a parser, you can use it in your JavaScript code. For example, you can run the following code in a Node.js environment:

```
➜  jison git:(main) ✗ node                                
Welcome to Node.js v25.6.0.
Type ".help" for more information.
> p = require("./parser.js")
{
  parser: { yy: {} },
  Parser: [Function: Parser],
  parse: [Function (anonymous)],
  main: [Function: commonjsMain]
}
> p.parse("2*3")
6
```
---

## Objetivo

El objetivo de esta práctica es implementar una calculadora aritmética mediante una
Traducción Dirigida por la Sintaxis (TDS) usando Jison. Se parte de una gramática
independiente del contexto que representa expresiones aritméticas y se define una SDD
que calcula el valor de cada expresión reconocida.

## Contexto

Una **Definición Dirigida por la Sintaxis (SDD)** asocia atributos a los símbolos
gramaticales y reglas semánticas a las producciones. En este caso, el atributo `value`
almacena el resultado numérico de evaluar la expresión aritmética.

La gramática utilizada es:
```
L → E
E → E op T | T
T → number
```

Donde `number` y `op` son tokens definidos mediante expresiones regulares:
```
digit   [0-9]
number  digit+
op      + | - | * | / | **
```

**Jison** es una herramienta que recibe como entrada una SDD y produce como salida un
parser en JavaScript que ejecuta las acciones semánticas durante un recorrido
bottom-up del árbol sintáctico.

## Metodología

El desarrollo sigue el flujo de trabajo estándar de la asignatura:

- Gestión de tareas mediante **issues** en GitHub
- Ramas separadas para desarrollo (`dev`) y documentación (`doc`)
- Pull Requests hacia `main` al completar cada tarea
- Tests automatizados con **Jest**

