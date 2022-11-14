import { GraphQLSchema, GraphQLFieldResolver, GraphQLTypeResolver } from 'graphql';
import { Exchange, Operation } from '@urql/core';
export interface ExecuteExchangeArgs {
    schema: GraphQLSchema;
    rootValue?: any;
    context?: ((op: Operation) => any) | any;
    fieldResolver?: GraphQLFieldResolver<any, any>;
    typeResolver?: GraphQLTypeResolver<any, any>;
    subscribeFieldResolver?: GraphQLFieldResolver<any, any>;
}
/** Exchange for executing queries locally on a schema using graphql-js. */
export declare const executeExchange: ({ schema, rootValue, context, fieldResolver, typeResolver, subscribeFieldResolver, }: ExecuteExchangeArgs) => Exchange;
