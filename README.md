# Todo Application

A modern, secure Todo application built with Express.js and a clean, responsive UI.

## Features

- User authentication with JWT
- Secure API endpoints with input validation
- Modern UI with Tailwind CSS
- Real-time updates
- Todo management (create, read, update, delete)
- User-specific todos
- Responsive design for mobile and desktop

## Project Structure

```
├── config/             # Configuration files
├── controllers/        # Request handlers
├── middleware/         # Custom middleware
├── models/            # Data models
├── public/            # Static files
│   └── styles/        # CSS files
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
└── views/             # Frontend views
```

## Security Features

- JWT authentication
- Input validation and sanitization
- Rate limiting
- Security headers with Helmet
- CORS protection
- Error handling middleware

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Todos
- `GET /api/todos` - Get all todos
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`
4. Start the server:
   ```bash
   npm start
   ```
   For development:
   ```bash
   npm run dev
   ```

## Environment Variables

- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRATION` - Token expiration time
- `NODE_ENV` - Environment (development/production)

## Technologies Used

- Express.js - Backend framework
- JWT - Authentication
- Winston - Logging
- Express Validator - Input validation
- Helmet - Security headers
- Tailwind CSS - Styling
- Font Awesome - Icons

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
