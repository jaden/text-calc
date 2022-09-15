function containsOnlyAMathOperator(originalExpression) {
  const operators = ['+', '-', '*', '/', '^', '!'];
  const expression = originalExpression.trim();

  if (expression === '') {
    return false;
  }

  return operators.includes(expression);
}

function isValidAnswer(ans) {
  if (typeof(ans) === 'undefined' || ans === '') {
    return false;
  }

  return true;
}

function getExpressionToEvaluate(expression, answer) {
  let results = { expressionToEvaluate: expression, expression };

  if (!isValidAnswer(answer)) {
    return results;
  }

  if (containsOnlyAMathOperator(expression)) {
    results.expression = `ans ${expression}`;
  }

  if (expression.indexOf('ans') !== -1) {
    results.expressionToEvaluate = expression.replace('ans', answer);
  }

  return results;
}

function addCommasToNumber(n) {
  if (typeof(n) === 'undefined' || n === '') {
    return '';
  }

  let parts = n.toString().split('.');
  // \B - not a word boundary
  // ?= - positive lookahead
  // ?! - negative lookahead
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
}

let historyLog;
let lastHistoryLogScrollHeight;

new Vue({
  el: '#app',
  data: {
    expression: '',
    expressionHistory: [],
    expressionHistoryIndex: null,
    ans: '',
    resultHistory: [],
    expressionHasError: false,
  },

  mounted: function () {
    if (document.location.search.startsWith('?e=')) {
      this.expression = decodeURIComponent(document.location.search.substring(3));
    }

    document.getElementById('expression').focus();

    historyLog = document.getElementById('historyLog');
    lastHistoryLogScrollHeight = historyLog.scrollHeight;
  },

  methods: {
    addToHistory: function () {
      if (this.expressionHasError || this.expression === '') {
        return;
      }

      this.resultHistory.push({ expression: this.expression, answer: this.resultWithCommas });
      this.expressionHistory.push(this.expression);
      this.ans = this.result;
      this.clearExpression(); // only clear after ans is set, because this.result will return blank otherwise
    },

    showPreviousExpression: function () {
      if (this.expressionHistory.length === 0) {
        return;
      }

      // Initialize the history index to point to the most recent item.
      if (this.expressionHistoryIndex === null) {
        this.expressionHistoryIndex = this.expressionHistory.length;
      }

      // Only decrement if we're not already at the oldest item.
      if (this.expressionHistoryIndex > 0) {
        this.expressionHistoryIndex--;
      }

      this.expression = this.expressionHistory[this.expressionHistoryIndex];
    },

    showNextExpression: function () {
      if (this.expressionHistory.length === 0 || this.expressionHistoryIndex === null) {
        return;
      }

      // Clear the expression when we're already at the most recent expression
      if (this.expressionHistoryIndex === this.expressionHistory.length - 1) {
        this.clearExpression();
        return;
      }

      // Only move the index if we're not already at the end of the history
      if (this.expressionHistoryIndex < this.expressionHistory.length - 1) {
        this.expressionHistoryIndex++;
      }

      this.expression = this.expressionHistory[this.expressionHistoryIndex];
    },

    clearExpression: function () {
      this.expression = '';
      this.expressionHistoryIndex = null;
    },

    clearAll: function () {
      this.clearExpression();
      this.resultHistory = [];
      this.expressionHistory = [];
      this.ans = '';

      document.getElementById('expression').focus();
    },
  },

  computed: {
    result: function () {
      try {
        if (this.expression === '') {
          return '';
        }

        // Remove commas (math library can't calculate with them)
        this.expression = this.expression.replaceAll(',', '');

        const expressionResults = getExpressionToEvaluate(this.expression, this.ans);

        this.expression = expressionResults.expression;

        const originalAnswer = math.evaluate(expressionResults.expressionToEvaluate);
        const answer = math.format(originalAnswer, {
          precision: 13, // Prevent round-off errors in output
          upperExp: 12, // Exponent at which to start using scientific notation
        });

        if (answer !== undefined && typeof(answer) !== 'function') {
          this.expressionHasError = false;
          return answer;
        }
      } catch (err) {
        this.expressionHasError = true;
      }

      return '';
    },

    resultWithCommas: function () {
      return addCommasToNumber(this.result);
    },
  },

  updated: function () {
    this.$nextTick(function () {
      if (historyLog.scrollHeight > lastHistoryLogScrollHeight) {
        historyLog.scrollTop = historyLog.scrollHeight;
        lastHistoryLogScrollHeight = historyLog.scrollHeight;
      }
    });
  },
});
