import { ApiVersion, GraphQLError } from "@shopify/ui-extensions/build/ts/shared";

type Query = <Data = unknown, Variables = { [key: string]: unknown; }>(
  query: string, 
  options?: { 
    variables?: Variables; 
    version?: Omit<ApiVersion, "2023-04">; 
  }) => Promise<{ 
    data?: Data; 
    errors?: GraphQLError[];
  }>

export class AdminAPI {
  query: Query; // to access query in other methods
  constructor(query: Query) {
    this.query = query;
  }
}