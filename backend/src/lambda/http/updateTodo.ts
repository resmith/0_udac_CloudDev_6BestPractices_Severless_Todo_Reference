import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { updateTodo } from '../../businessLogic/todos'

import {createLogger} from '../../utils/logger'
const logger = createLogger('lambda/http/todosAccess')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const eventBody: UpdateTodoRequest = JSON.parse(event.body)
  const todoId: object = { todoId: event.pathParameters.todoId}
  const updatedTodo: UpdateTodoRequest = { ...eventBody, ...todoId}
  logger.info('handler updatedTodo',  { updatedTodo } )

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  const newItem = await updateTodo(updatedTodo, jwtToken)
  logger.info('handler newItem: ',   { newItem } )  

  // TODO: Update a TODO item with the provided id using values in the "updatedTodo" object
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
