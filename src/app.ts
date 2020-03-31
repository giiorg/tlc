import 'reflect-metadata';
import { ApolloServer } from 'apollo-server';
import { buildSchema } from 'type-graphql';
import { Container } from 'typedi';
import dotenv from 'dotenv';

dotenv.config();

import logger from './core/logger';
import { authChecker } from './modules/auth/auth-checker';
import { getContext } from './modules/auth/get-context';
import { formatError } from './core/format-error';
import createTables from './create-tables';

const PORT = process.env.APP_PORT || 8001;

async function go() {
  await createTables();

  const schema = await buildSchema({
    resolvers: [__dirname + '/**/*.resolver.{ts,js}'],
    authChecker,
    container: Container,
  });

  const server = new ApolloServer({
    schema,
    playground: true,
    formatError,
    context: getContext,
  });

  const { url } = await server.listen(PORT);
  logger.info(`Server is running, GraphQL Playground available at ${url}`);
}

go();
