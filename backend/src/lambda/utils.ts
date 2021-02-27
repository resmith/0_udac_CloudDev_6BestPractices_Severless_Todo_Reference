import { APIGatewayProxyEvent } from "aws-lambda";
import { parseUserId } from "../auth/utils";
import { createLogger } from  "../utils/logger"

const logger = createLogger('todo-access')

/**
 * Get a user id from an API Gateway event
 * @param event an event from API Gateway
 *
 * @returns a user id from a JWT token
 */
export function getUserId(event: APIGatewayProxyEvent): string {
  const authorization = event.headers.Authorization
  logger.info("backend/src/lambda/utils/getUserId ", { authorization }) 

  const split = authorization.split(' ')
  const jwtToken = split[1]
  logger.info("backend/src/lambda/utils/getUserId ", { jwtToken }) 

  return parseUserId(jwtToken)
}