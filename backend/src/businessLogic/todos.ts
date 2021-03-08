import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { DeleteTodoRequest } from '../requests/DeleteTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

import { createLogger } from '../utils/logger'

const logger = createLogger('businessLogic/todos')

const todoAccess = new TodoAccess()

export async function getAllTodos(userId): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

export async function getTodo(todoItem): Promise<TodoItem> {
  return todoAccess.getTodo(todoItem)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)
  logger.info('createTodo', userId)  

  return await todoAccess.createTodo({
    userId: userId,
    todoId: itemId,
    name: createTodoRequest.name,
    createdAt: new Date().toISOString(),
    dueDate: '',
    done: false ,

  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  jwtToken: string
): Promise<UpdateTodoRequest> {
  logger.info('updateTodo updateTodoRequest: ', { updateTodoRequest} )  

  const userId: string = parseUserId(jwtToken)
  logger.info('updateTodo userId:', {userId: userId} )  
  
  const updatedTodoRequest = {
    ...updateTodoRequest,
    userId,
    updatedAt: new Date().toISOString(),
  }
  logger.info('updateTodo updatedTodoRequest:', updatedTodoRequest)  

  return await todoAccess.updateTodo(updatedTodoRequest)
}

export async function deleteTodo(
  deleteTodoRequest: DeleteTodoRequest,
  jwtToken: string
): Promise<DeleteTodoRequest> {
  logger.info('deleteTodo', deleteTodoRequest) 

  const todoId = deleteTodoRequest.todoId
  const userId = parseUserId(jwtToken)
  logger.info('deleteTodo', userId) 

  return await todoAccess.deleteTodo({
    todoId: todoId,
    userId: userId
  })
}

