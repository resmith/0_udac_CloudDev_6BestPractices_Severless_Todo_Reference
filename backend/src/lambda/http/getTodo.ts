import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from  "../../utils/logger"

import { getUserId } from '../utils'
import { getTodo } from '../../businessLogic/todos'

const logger = createLogger('backend/src/lambda/http/getTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info("handler event:", { event })  
  
  const userId: string  = getUserId(event)
  logger.info("handler userId:", { userId })

  const todos = await getTodo(userId)
  logger.info("handler todos:", { todos })  

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      todos
    })
  }

}
