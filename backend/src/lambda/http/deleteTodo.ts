import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { DeleteTodoRequest } from '../../requests/DeleteTodoRequest'
import { deleteTodo } from '../../businessLogic/todos'

import { createLogger } from '../../utils/logger'

const logger = createLogger('http/deleteTodo')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info('handler: ', event)  

  const deleteRequest: DeleteTodoRequest = { todoId: event.pathParameters.todoId}
  logger.info('handler', deleteRequest)  

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]  
  logger.info('handler', jwtToken)  

  const deletedItem = deleteTodo(deleteRequest, jwtToken)

  // TODO: Remove a TODO item by id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      deletedItem
    })
  }

}
