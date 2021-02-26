import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { DeleteTodoRequest } from '../requests/DeleteTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getAllTodos(userId): Promise<TodoItem[]> {
  return todoAccess.getAllTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

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

  const userId: string = parseUserId(jwtToken)

  // TODO: Get the userid from the record then check
  if (updateTodoRequest.userId !== userId)
     return;

  return await todoAccess.updateTodo(updateTodoRequest)
}

export async function deleteTodo(
  deleteTodoRequest: DeleteTodoRequest,
  jwtToken: string
): Promise<DeleteTodoRequest> {

  const todoId = deleteTodoRequest.todoId
  const userId = parseUserId(jwtToken)

  return await todoAccess.deleteTodo({
    todoId: todoId,
    userId: userId
  })
}

