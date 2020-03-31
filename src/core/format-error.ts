import { GraphQLFormattedError, GraphQLError } from 'graphql';
import logger from './logger';

export function formatError(
  error: GraphQLError,
): GraphQLFormattedError<Record<string, any>> {
  logger.error(error.message, {
    locations: error.locations,
    path: error.path,
    extensions: error.extensions,
  });

  if (error?.extensions?.exception?.validationErrors) {
    error.extensions.code = 'ARGUMENT_VALIDATION_ERROR';

    const validationErrors: any[] = error.extensions.exception.validationErrors;

    const formattedValidationErrors = validationErrors.map(validationError => {
      return {
        [validationError.property]: Object.values(validationError.constraints),
      };
    });

    error.extensions.exception.validationErrors = formattedValidationErrors;
  }

  return error;
}
