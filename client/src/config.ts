// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'sg17v5bkd5'
export const apiEndpoint = `https://${apiId}.execute-api.us-west-2.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-52n9d49z.us.auth0.com',            // Auth0 domain
  clientId: 'THaX2JkO4FMHa9SsfpDHCLgPGOv4MNNq',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
