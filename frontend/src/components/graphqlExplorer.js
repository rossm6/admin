import { useQuery } from '@apollo/client';
import {
  buildClientSchema, getIntrospectionQuery, parse, validate,
} from 'graphql';

function GraphqlExplorer() {
  // getIntrospectionQuery gives us the query as a string
  // parse converts
  const { data: schemaQueryResult } = useQuery(parse(getIntrospectionQuery()));

  let schema;

  if (schemaQueryResult) {
    schema = buildClientSchema(schemaQueryResult);
  }

  if (schema) {
    const query = parse('query A { dougnuts { id } }');
    const result = validate(schema, query);
    console.log(result);
  }

  return <div>GraphqlExplorer</div>;
}

export default GraphqlExplorer;
