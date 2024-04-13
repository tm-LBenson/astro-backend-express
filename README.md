# astro-backend-express

## About the App

This Express app is designed to handle the traffic for several applications in a scaled deployment environment. It uses Mongoose to connect to a MongoDB database and has endpoints for updating and retrieving traffic data, as well as user authentication. The app also includes error handling middleware for 404 and 500 errors. Its flexibility and scalability make it ideal for handling large amounts of traffic across multiple applications.

## Endpoints

### `/`

The root endpoint is used to check the proof of life of the server. When the server is running, navigating to `http://localhost:3000/` will return a "Proof of life" message indicating that the server is running.

### `/contact`

The `/contact` endpoint is used to send an email with SendGrid API when a user sends a message from the frontend. To use this endpoint, send a `POST` request to `http://localhost:3000/contact` with the following parameters in the request body:

- `name`: the name of the user sending the message
- `email`: the email address of the user sending the message
- `message`: the message content

### `/traffic-data`

The `/traffic-data` endpoint is used to update traffic data and retrieve traffic data. To update traffic data, send a POST request to `http://localhost:3002/traffic-data` with the following parameters in the request body:

- `clientId`: the ID of the client
- `siteId`: the ID of the site
- `date`: the date of the traffic data
- `traffic`: the traffic data for the site and date

To retrieve traffic data, send a `GET` request to `http://localhost:3002/traffic-data` with a valid JSON Web Token (JWT) in the authorization header.

### `/user-sites`

The `/user-sites` endpoint is used to retrieve a list of sites for a user. To use this endpoint, send a `GET` request to `http://localhost:3002/user-sites` with a valid JSON Web Token (JWT) in the authorization header.

### `/login`

The /login endpoint is used to log in a user. To use this endpoint, send a `POST` request to `http://localhost:3002/login` with the following parameters in the request body:

- `email`: the email address of the user
- `password`: the password of the user

The endpoint will return a JWT that can be used to access protected endpoints.

### `/signup`

The `/signup` endpoint is used to create a new user account. To use this endpoint, send a `POST` request to `http://localhost:3002/signup` with the following parameters in the request body:

- `name`: the name of the user
- `email`: the email address of the user
- `password`: the password of the user

## Add support for certain discord bots

## Environment Variables

This app requires the following environment variables to be set:

- `SENDGRID_API_KEY`: The API key for your SendGrid account.
- `PORT`: The port number for the server to listen on. By default, this is set to 3002.
- `DB_URL`: The URL for the MongoDB database to connect to.
- `JWT_SECRET`: A strong and long secret for signing JWTs.

## Running the App

To run the app, make sure the required environment variables are set in your `.env` file, and then run the following command:

`npm start`  
To set these environment variables, you can create a `.env` file in the root directory of the app with the following content:

The app will then be accessible at `http://localhost:<port-number>/`.
