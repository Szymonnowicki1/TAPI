import express from "express";
import cors from "cors";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { Name } from './nameScalar.js';

const app = express();
const port = 4000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Name,
    ...resolvers
  },
  formatError: (error) => {
    console.error('GraphQL Error:', error);
    return {
      message: error.message,
      code: error.extensions?.code || 'INTERNAL_SERVER_ERROR',
      path: error.path
    };
  },
});

await apolloServer.start();

app.use(cors());
app.use(express.json());

app.use(
  "/graphql",
  expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      return {
        token: req.headers.authorization,
      };
    },
  })
);

app.listen(port, () => {
  console.log(`GraphQL  running on http://localhost:${port}/graphql`);
});
