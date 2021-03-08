import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
// import { cors } from 'middy/middlewares'
// import * as AWSXRay from 'aws-xray-sdk'
const AWSXRay = require('aws-xray-sdk')
import { createLogger } from  "../../utils/logger"

const XAWS = AWSXRay.captureAWS(AWS)

const docClient = new XAWS.DynamoDB.DocumentClient()
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})
const imagesTable = process.env.IMAGES_TABLE
const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

const logger = createLogger('lambda/http/generateUploadUrl')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("handler event:", event)

  const imageId = uuid.v4()
  logger.info(`handler imageId: ${imageId} `)

  const newItem = await createImage(imageId, event)
  logger.info("handler newItem: ", newItem)

  const url = getUploadUrl(imageId)
  logger.info("handler url:", url)
  
  // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },    
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
}

// handler.use(
//   cors({
//     credentials: true
//   })
// )

async function createImage(imageId: string, event: any) {
  logger.info(`createImage imageId: ${imageId} `)
  logger.info("createImage event:", event)

  const timestamp = new Date().toISOString()
  logger.info(`createImage timestamp: ${timestamp} `)  

  // const newImage = JSON.parse(event.body)
  const todoId: string = event.pathParameters.todoId
  logger.info("createImage todoId:", todoId)  

  // const newItem = {
  //   timestamp,
  //   imageId,
  //   todoId,
  //   ...newImage,
  //   imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  // }

  const newItem = {
    timestamp,
    imageId,
    todoId,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  }
  logger.info("createImage newItem:", newItem)    

  await docClient
    .put({
      TableName: imagesTable,
      Item: newItem
    })
    .promise()

  return newItem
}

function getUploadUrl(imageId: string) {
  logger.info("getUploadUrl imageId:", imageId)   

  const urlExpirationNumber : number = Number(urlExpiration);
  logger.info("getUploadUrl urlExpirationNumber:", urlExpirationNumber)    

  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpirationNumber
  })
}

