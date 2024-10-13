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

3. Start the development server:

```
npm run dev  (OR)
npm start
```

The server will start on port `8000` by default. You can access the application routes in your browser.


## Changelog

### v0.0.1

- Added Delete Controller.