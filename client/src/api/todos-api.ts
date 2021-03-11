import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

export async function getTodos(idToken: string): Promise<Todo[]> {
  console.log('todos-api getTodos Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('todos-api getTodos response.data:', response.data)
  return response.data.todos
}

export async function createTodo(
  idToken: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  let response: any;
  console.log('createTodo apiEndpoint:', apiEndpoint)
  console.log('createTodo newTodo:', newTodo)
  try {    
    response = await Axios.post(`${apiEndpoint}/todos`,  JSON.stringify(newTodo), {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${idToken}`
      }
    })
  } catch (err) {
    console.log('createTodo err:', err)     
  } finally {
    console.log('createTodo response:', response)  
  }

  return response.data.newItem
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  console.log("api/todos-api/getUploadUrl idToken: ", idToken)
  console.log("api/todos-api/getUploadUrl todoId: ", todoId)
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  console.log("api/todos-api/getUploadUrl response.data.uploadUrl: ", response.data.uploadUrl)
  console.log("api/todos-api/getUploadUrl response: ", response)
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  console.log("api/todos-api/getUploadUrl uploadUrl: ", uploadUrl)
  console.log("api/todos-api/getUploadUrl file: ", file)    
  await Axios.put(uploadUrl, file)
}
