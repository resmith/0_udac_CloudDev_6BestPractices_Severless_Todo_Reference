import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {createLogger} from '../utils/logger'

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'
import { TodoDelete } from '../models/TodoDelete'


const logger = createLogger('datalayer/todosAccess')

export class TodoAccess {

  constructor(
    // private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
    private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'}),
    // private readonly dbclient = new AWS.DynamoDB({ region: "us-west-2" }),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosUserIdIndex = process.env.TODOS_USER_ID_INDEX
  ) {}

  async getAllTodos(userId: string): Promise<TodoItem[]> {
    logger.info('getAllTodos', { todosTable: this.todosTable})


    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosUserIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      } 
    }).promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async getTodo(todoItem: TodoItem): Promise<TodoItem> {
    logger.info('getTodo todoItem: ', todoItem)

    const param = {
      TableName: this.todosTable,
      Key: { 
        userId: todoItem.userId, 
        todoId: todoItem.todoId 
      }
    }
    logger.info('getTodo param: ', param)

    const result = await this.docClient.get(param).promise();
    logger.info('getTodo result: ', result)

    return result as unknown as TodoItem
  }

  async createTodo(todoItem: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todoItem
    }).promise()        

    return todoItem
  }

  async updateTodo(todoItem: TodoUpdate): Promise<TodoUpdate> {
    logger.info('updateTodo todoItem:', { todoItem}) 
    
    const params = {
      TableName: this.todosTable,
      Key: { 
        userId: todoItem.userId, 
        todoId: todoItem.todoId 
      },      
      UpdateExpression: 'set #name = :name, #dueDate = :dueDate, #done = :done',
      ExpressionAttributeValues: {
          ':name': todoItem.name,
          ':dueDate': todoItem.dueDate,
          ':done': todoItem.done
      },
      ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
      },
      ReturnValues: "UPDATED_NEW"      
    }

    logger.info('updateTodo update: ', { params}) 
    const result = await this.docClient.update(params).promise()        

    return result as unknown as TodoUpdate
  }

  // async deleteTodo(todoItem: TodoDelete): Promise<TodoDelete> {
  //   let result: any
  //   logger.info('deleteTodo', { todoItem})

  //   const params = {
  //     TableName: this.todosTable,
  //     Key: { 
  //       userId: { S: todoItem.userId } , 
  //       todoId: { S: todoItem.todoId }
  //     },
  //     ReturnValues: "ALL_OLD"  
  //   }
  //   logger.info('deleteTodo params',  { params } )

  //   try {
  //     result = await this.dbclient.deleteItem(params)
  //     logger.info('deleteTodo result: ',result)  
  //   } catch (err) {
  //     console.error(err)
  //   }          
  //     // try {
  //   //   logger.info('deleteTodo about to execute')      
  //   //   result = await this.docClient.delete(params).promise();
  //   //   // result = await this.docClient.delete(params);      
  //   //   logger.info('deleteTodo result: ',result)        
  //   // } catch(err) {
  //   //   logger.error('deleteTodo Unable to delete item. Error JSON:',err)
  //   //   console.error("deleteTodo Unable to delete item. Error JSON:", err);
  //   // }

  //   return result as unknown as TodoDelete
  // }


async deleteTodo(todoItem: TodoDelete): Promise<TodoDelete> {
  logger.info('deleteTodo', { todoItem})

  const params = {
    TableName: this.todosTable,
    Key: { 
      userId: todoItem.userId , 
      todoId: todoItem.todoId 
    },
    ReturnValues: "ALL_OLD"  
  }
  logger.info('deleteTodo params',  { params } )

  const result = await this.docClient.delete(params).promise()
  logger.info('deleteTodo result: ',result)        
  // try {
  //   logger.info('deleteTodo about to execute')      
  //   result = await this.docClient.delete(params).promise();
  //   // result = await this.docClient.delete(params);      
  //   logger.info('deleteTodo result: ',result)        
  // } catch(err) {
  //   logger.error('deleteTodo Unable to delete item. Error JSON:',err)
  //   console.error("deleteTodo Unable to delete item. Error JSON:", err);
  // }

  return result as unknown as TodoDelete
}


}
