import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify, decode } from 'jsonwebtoken'
// import { jwksClient } from 'jwks-rsa';
import { createLogger } from '../../utils/logger'
// import Axios from 'axios'
import { Jwt } from '../../auth/Jwt'
import { JwtPayload } from '../../auth/JwtPayload'

const jwksClient = require('jwks-rsa');
const logger = createLogger('auth')

// JWT token signature from Auth0 page -> Endpoints -> JSON Web Key Set
const jwksUrl = 'https://dev-52n9d49z.us.auth0.com/.well-known/jwks.json'

export const handler = async (
  event: CustomAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', event.authorizationToken)
  try {
    const jwtToken = await verifyToken(event.authorizationToken,jwksUrl )
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

async function verifyToken(authHeader: string, jwksUrl: string): Promise<JwtPayload> {
  logger.info("verifyToken", { authHeader } );
  const token = getToken(authHeader)
  logger.info("verifyToken", { token });

  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  logger.info("decoded token", { jwt } );

  if (jwt.header.alg !== 'RS256') {
    throw new Error('header.alg not RS256')
  }

  const jwtHeaderKid = jwt.header.kid
  logger.info("JWT kid", {jwtHeaderKid})

  const signingKey: string = getSigningKey(jwksUrl, jwtHeaderKid)

  const jwtPayload: JwtPayload = verify(token, signingKey) as JwtPayload;

  return jwtPayload    

}

function getToken(authHeader: string): string {
  if (!authHeader) {
    logger.info("No authentication header ", {authHeader})
    throw new Error('No authentication header')
  }

  if (!authHeader.toLowerCase().startsWith('bearer ')){ 
    logger.info("invalid autheader in bearer ", {authHeader})
    throw new Error('Invalid authentication header')
  }

  const split = authHeader.split(' ')
  const token = split[1]

  return token
}


function getSigningKey(jwksUri: string, kid: string): string {
  let signingKey: string;

  const client = jwksClient({
    jwksUri: jwksUri,
    requestHeaders: {}, // Optional
    requestAgentOptions: {}, // Optional
    timeout: 30000 // Defaults to 30s
  });
  
  try {
    signingKey = client.getSigningKeyAsync(kid);
  } catch (err)  {
    logger.info("error getting signingKey: ", err)
  }
 

  return signingKey
}
