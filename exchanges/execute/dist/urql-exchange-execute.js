Object.defineProperty(exports, '__esModule', {
  value: true
});

var wonka = require('wonka');

var graphql = require('graphql');

var core = require('@urql/core');

var asyncIterator = typeof Symbol !== 'undefined' ? Symbol.asyncIterator : null;

var makeExecuteSource = (operation, _args) => {
  return wonka.make(observer => {
    var iterator;
    var ended = false;
    Promise.resolve().then(async () => ({ ..._args,
      contextValue: await _args.contextValue
    })).then(args => {
      if (ended) return;

      if (operation.kind === 'subscription') {
        return graphql.subscribe(args);
      }

      return graphql.execute(args);
    }).then(result => {
      if (ended || !result) {
        return;
      } else if (!asyncIterator || !result[asyncIterator]) {
        observer.next(core.makeResult(operation, result));
        return;
      }

      iterator = result[asyncIterator]();
      var prevResult = null;

      function next({
        done,
        value
      }) {
        if (value) {
          observer.next(prevResult = prevResult ? core.mergeResultPatch(prevResult, value) : core.makeResult(operation, value));
        }

        if (!done && !ended) {
          return iterator.next().then(next);
        }
      }

      return iterator.next().then(next);
    }).then(() => {
      observer.complete();
    }).catch(error => {
      observer.next(core.makeErrorResult(operation, error));
      observer.complete();
    });
    return () => {
      if (iterator && iterator.return) iterator.return();
      ended = true;
    };
  });
};
/** Exchange for executing queries locally on a schema using graphql-js. */


var executeExchange = ({
  schema,
  rootValue,
  context,
  fieldResolver,
  typeResolver,
  subscribeFieldResolver
}) => ({
  forward
}) => {
  return ops$ => {
    var sharedOps$ = wonka.share(ops$);
    var executedOps$ = wonka.mergeMap(operation => {
      var {
        key
      } = operation;
      var teardown$ = wonka.filter(op => op.kind === 'teardown' && op.key === key)(sharedOps$);
      var contextValue = typeof context === 'function' ? context(operation) : context; // Filter undefined values from variables before calling execute()
      // to support default values within directives.

      var variableValues = Object.create(null);

      if (operation.variables) {
        for (var _key in operation.variables) {
          if (operation.variables[_key] !== undefined) {
            variableValues[_key] = operation.variables[_key];
          }
        }
      }

      return wonka.takeUntil(teardown$)(makeExecuteSource(operation, {
        schema,
        document: operation.query,
        rootValue,
        contextValue,
        variableValues,
        operationName: core.getOperationName(operation.query),
        fieldResolver,
        typeResolver,
        subscribeFieldResolver
      }));
    })(wonka.filter(operation => {
      return operation.kind === 'query' || operation.kind === 'mutation' || operation.kind === 'subscription';
    })(sharedOps$));
    var forwardedOps$ = forward(wonka.filter(operation => operation.kind === 'teardown')(sharedOps$));
    return wonka.merge([executedOps$, forwardedOps$]);
  };
};

exports.executeExchange = executeExchange;
//# sourceMappingURL=urql-exchange-execute.js.map
