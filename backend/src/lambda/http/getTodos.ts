import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { createLogger } from  "../../utils/logger"

import { getUserId } from '../utils'
import { getAllTodos } from '../../businessLogic/todos'

const logger = createLogger('getTodos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // TODO: Get all TODO items for a current user
  logger.info("backend/src/lambda/http/getTodos ", { event })  
  
  const userId: string  = getUserId(event)
  logger.info("backend/src/lambda/http/getTodos ", { userId })

  const todos = await getAllTodos(userId)
  logger.info("backend/src/lambda/http/getTodos ", { todos })  

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
