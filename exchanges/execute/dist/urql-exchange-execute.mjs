import { share as e, mergeMap as r, filter as t, takeUntil as n, merge as a, make as o } from "wonka";

import { subscribe as i, execute as l } from "graphql";

import { getOperationName as u, makeResult as v, makeErrorResult as s, mergeResultPatch as c } from "@urql/core";

var f = "undefined" != typeof Symbol ? Symbol.asyncIterator : null;

var executeExchange = ({schema: d, rootValue: m, context: b, fieldResolver: p, typeResolver: y, subscribeFieldResolver: x}) => ({forward: h}) => k => {
  var R = e(k);
  var V = r((e => {
    var {key: r} = e;
    var a = t((e => "teardown" === e.kind && e.key === r))(R);
    var h = "function" == typeof b ? b(e) : b;
    var k = Object.create(null);
    if (e.variables) {
      for (var V in e.variables) {
        if (void 0 !== e.variables[V]) {
          k[V] = e.variables[V];
        }
      }
    }
    return n(a)(((e, r) => o((t => {
      var n;
      var a = !1;
      Promise.resolve().then((async () => ({
        ...r,
        contextValue: await r.contextValue
      }))).then((r => {
        if (a) {
          return;
        }
        if ("subscription" === e.kind) {
          return i(r);
        }
        return l(r);
      })).then((r => {
        if (a || !r) {
          return;
        } else if (!f || !r[f]) {
          t.next(v(e, r));
          return;
        }
        n = r[f]();
        var o = null;
        return n.next().then((function next({done: r, value: i}) {
          if (i) {
            t.next(o = o ? c(o, i) : v(e, i));
          }
          if (!r && !a) {
            return n.next().then(next);
          }
        }));
      })).then((() => {
        t.complete();
      })).catch((r => {
        t.next(s(e, r));
        t.complete();
      }));
      return () => {
        if (n && n.return) {
          n.return();
        }
        a = !0;
      };
    })))(e, {
      schema: d,
      document: e.query,
      rootValue: m,
      contextValue: h,
      variableValues: k,
      operationName: u(e.query),
      fieldResolver: p,
      typeResolver: y,
      subscribeFieldResolver: x
    }));
  }))(t((e => "query" === e.kind || "mutation" === e.kind || "subscription" === e.kind))(R));
  var q = h(t((e => "teardown" === e.kind))(R));
  return a([ V, q ]);
};

export { executeExchange };
//# sourceMappingURL=urql-exchange-execute.mjs.map
