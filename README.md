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

## Desarrollo

#### 2.1 Diferencia entre skip whitespace y devolver un token

La diferencia fundamental reside en la interacción entre el analizador léxico (lexer)
y el analizador sintáctico (parser). Cuando el lexer identifica un patrón que coincide
con `\s+`, ejecuta el bloque asociado que contiene únicamente el comentario
`/* skip whitespace */`. Al no existir una instrucción `return`, el lexer consume esos
caracteres y continúa con la búsqueda del siguiente patrón de forma interna, por lo
que el parser nunca recibe notificación de estos caracteres y resultan totalmente
transparentes para la gramática.

Por el contrario, cuando el lexer reconoce un patrón como `NUMBER` o `OP`, utiliza
`return` para detener su ejecución y entregar dicho token al parser. En ese momento,
el parser evalúa si el token es coherente con las reglas gramaticales y determina si
la estructura de la expresión es válida. En conclusión, ignorar sirve para limpiar la
entrada de elementos de formato sin significado, mientras que devolver un token
proporciona los componentes esenciales con los que el parser construye la traducción
dirigida por la sintaxis.

#### 2.2 Secuencia de tokens para `123**45+@`

| Lexema | Token   |
|--------|---------|
| `123`  | NUMBER  |
| `**`   | OP      |
| `45`   | NUMBER  |
| `+`    | OP      |
| `@`    | INVALID |
|        | EOF     |

La secuencia completa es: `NUMBER` → `OP` → `NUMBER` → `OP` → `INVALID` → `EOF`.

#### 2.3 Por qué `**` debe aparecer antes que `[-+*/]`

El hecho de que `**` deba aparecer antes que `[-+*/]` se debe al principio de
prioridad por orden de aparición que aplica el analizador léxico. Cuando el lexer lee
la entrada, intenta hacer coincidir la cadena con las expresiones regulares en el
orden en que están definidas en el bloque `%lex`.

Si `[-+*/]` se definiera primero, al encontrar la secuencia `**`, el lexer
identificaría el primer `*` como un operador individual de multiplicación y devolvería
un token `OP`, y acto seguido haría lo mismo con el segundo `*`. Al colocar `**`
primero, el lexer identifica la secuencia completa como el operador de potencia antes
de evaluar las reglas individuales, permitiendo que se reconozca como un único token.

#### 2.4 Cuándo se devuelve EOF

El token `EOF` se devuelve cuando el analizador léxico detecta que ha alcanzado el
final de la cadena de entrada y no hay más caracteres por procesar. Su función
principal es notificar al parser que la lectura ha terminado, permitiéndole validar
si la estructura reconocida hasta ese momento está completa y es correcta, y proceder
al cálculo final del valor de la expresión mediante la regla semántica `L → E`.