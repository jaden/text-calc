function startsWithMathOperator(originalExpression) {
  const operators = ['+', '-', '*', '/', '^', '!'];
  const expression = originalExpression.trim();

  if (expression === '') {
    return false;
  }

  return operators.includes(expression[0]);
}

function isValidAnswer(ans) {
  if (typeof(ans) === 'undefined' || ans === '') {
    return false;
  }

  return true;
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
    document.getElementById('expression').focus();

    historyLog = document.getElementById('historyLog');
    lastHistoryLogScrollHeight = historyLog.scrollHeight;
  },

  methods: {
    addToHistory: function () {
      if (this.expressionHasError || this.expression === '') {
        return;
      }

      this.resultHistory.push({ expression: this.expression, answer: this.result });
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

        if (startsWithMathOperator(this.expression) && isValidAnswer(this.ans)) {
          this.expression = `${this.ans} ${this.expression}`;
        }

        const answer = math.evaluate(this.expression);

        if (answer !== undefined) {
          this.expressionHasError = false;
          return answer;
        }

        return '';
      } catch (err) {
        this.expressionHasError = true;
      }
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
