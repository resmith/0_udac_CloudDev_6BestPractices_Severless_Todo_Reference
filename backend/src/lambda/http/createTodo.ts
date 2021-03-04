import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { createTodo } from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger'

const logger = createLogger('http/createTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   logger.info('handler event', event)  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  const authorization = event.headers.Authorization
  logger.info('handler', newTodo)  

  const split = authorization.split(' ')
  const jwtToken = split[1]
  logger.info('handler', jwtToken)  


  const newItem = await createTodo(newTodo, jwtToken)


  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
