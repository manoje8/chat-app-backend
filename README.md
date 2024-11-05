# Chat Application Backend

This is the backend for a real-time chat application built using **Node.js**, **Express**, **MongoDB**, and **Socket.io**. It handles user management, real-time messaging, typing indicators, and online user tracking.

## Tech Stack 

- **Node.js**: JavaScript runtime for building server-side applications. 
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for storing user and message data. 
- **Socket.io**: Real-time, bidirectional communication for chat and typing indicators.

### Socket Events

- `connection`: Triggered when a user connects.
- `addUser`: Adds the user to the online users list.
- `typing`: Emits the typing event to the message receiver.
- `stopTyping`: Emits the stop typing event to the receiver.
- `disconnect`: Removes the user from the online users list.
- `messageSent`: Handle message sent by sender
- `messageSeen`: Listen for message seen/read by recipient
- `messageStatusUpdate`: Update the message status to "delivered" if the receiver is online

### Installation and Setup

**Prerequisites:**

- Node.js
- NPM (Node Package Manager)

**Instructions:**

1. Clone the repository:

```
git clone https://github.com/manoje8/chat-app-backend.git
```

2. Install dependencies:

```
npm install
```
3. `.env` config
 
```
MONGODB_URI = your-mongodb-uri
PORT = server-port
DATABASE_NAME = your-database-name
CLIENT_URL = client-url
FIREBASE_type = type
FIREBASE_project_id = your-project-id
FIREBASE_private_key_id = private-key-id
FIREBASE_private_key = private-key
FIREBASE_client_email = client-mail-id
FIREBASE_client_id = client-id
FIREBASE_auth_uri = auth-uri
FIREBASE_token_uri = token-uri
FIREBASE_auth_provider_x509_cert_url = your-auth-provider-cert
FIREBASE_client_x509_cert_url = your-client-cert
FIREBASE_universe_domain = your-domain
```

4. Start the development server:

```
npm run dev  (OR)
npm start
```

The server will start on port `8000` by default. You can access the application routes in your browser.