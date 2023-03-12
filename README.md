# astro-backend-express


## About the App

This is a simple Express app that includes two endpoints: a '/' route to check the proof of life, and a '/contact' route to send an email with SendGrid API when a user sends a message from the frontend.

## Endpoints

### `/`

The root endpoint is used to check the proof of life of the server. When the server is running, navigating to `http://localhost:3000/` will return a "Proof of life" message indicating that the server is running.

### `/contact`

The `/contact` endpoint is used to send an email with SendGrid API when a user sends a message from the frontend. To use this endpoint, send a `POST` request to `http://localhost:3000/contact` with the following parameters in the request body:  

- `name`: the name of the user sending the message  
- `email`: the email address of the user sending the message  
- `message`: the message content  

## Environment Variables

This app requires the following environment variables to be set:  

- `SENDGRID_API_KEY`: The API key for your SendGrid account.  
- `PORT`: The port number for the server to listen on. By default, this is set to `3000`.  

## Running the App  

To run the app, make sure the required environment variables are set in your `.env` file, and then run the following command:  

`npm start`  
To set these environment variables, you can create a `.env` file in the root directory of the app with the following content:  
  

The app will then be accessible at `http://localhost:<port-number>/`.  


SENDGRID_API_KEY=<your-sendgrid-api-key>
PORT=<port-number>

