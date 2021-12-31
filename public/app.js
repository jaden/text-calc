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
    lastExpression: '',
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
      this.lastExpression = this.expression;
      this.ans = this.result;
      this.expression = '';
    },

    showLastExpression: function () {
      if (this.lastExpression === '') {
        return;
      }

      this.expression = this.lastExpression;
    },

    clearExpression: function () {
      this.expression = '';
    },

    clearAll: function () {
      this.expression = '';
      this.resultHistory = [];
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

        const expressionResults = getExpressionToEvaluate(this.expression, this.ans);

        this.expression = expressionResults.expression;

        const answer = math.evaluate(expressionResults.expressionToEvaluate);

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
