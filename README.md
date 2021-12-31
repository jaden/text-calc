# Text-based calculator with history

A simple, text-based calculator to do quick arithmetic. Aims to be a simplified, online version of [SpeedCrunch](https://speedcrunch.org/) or PowerToys PowerCalc.

Try it out at [calc.danhersam.com](https://calc.danhersam.com/)

![](text-calculator-thumbnail.png)

## Usage

* Enter an expression and see the results as you type.
* In the expression field:
    * Hit Enter to store the expression and result to the history.
    * Type the up arrow to show the most recent expression.
    * Type the down arrow or Esc to clear the current expression.
    * Type an operator to use the previous answer (e.g. +2 will add 2 to the previous answer).
    * Use `ans` to refer to the previous answer anywhere in an expression.
    * Hit the Clear button to clear all fields.
    * Auto-load an expression in the URL, for example: `?e=1+2`
    * Use [functions](https://mathjs.org/docs/reference/functions.html) like `sqrt` or `cube`

## Credits

* Built with [Math.js](https://mathjs.org/), [Vue.js](https://vuejs.org/) and [Bulma](https://bulma.io/)
* Favicon from [Icons8](https://icons8.com/icon/23154/calculator)

## Updating dependencies

* Vue - Download the [latest production version](https://vuejs.org/js/vue.min.js) and rename it with the version.
* Math.js - Download the [latest version](https://unpkg.com/mathjs@latest/lib/browser/math.js) and rename it with the version.
