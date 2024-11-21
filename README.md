# Express TypeScript Boilerplate

A modern, robust Express.js boilerplate with TypeScript, featuring comprehensive tooling, security best practices, and a well-organized project structure.

## Features

### Core
- 🚀 [Express.js](https://expressjs.com/) with [TypeScript](https://www.typescriptlang.org/)
- 📁 Modular project structure
- ⚡️ Path aliases for clean imports
- 🔄 Hot reload with [Nodemon](https://nodemon.io/)

### Documentation
- 📚 OpenAPI/Swagger documentation
- 🎯 Clear API route examples
- 🔍 Detailed type definitions

### Security
- 🔒 Built-in security with [Helmet](https://helmetjs.github.io/)
- 🚫 Rate limiting
- 🌐 CORS configuration
- 🗜️ Request compression

### Development Tools
- 🎨 ESLint + Prettier integration
- 🧹 Pre-commit hooks with Husky
- 📝 Consistent code style enforcement
- 🐛 Debugging configuration
- 📊 Winston logger setup

## Project Structure

```
src/
  ├── config/         # Configuration files
  ├── controllers/    # Route controllers
  ├── middlewares/    # Express middlewares
  ├── routes/         # API routes
  ├── utils/          # Utility functions
  └── index.ts        # Application entry point
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd express-ts-boilerplate
```

2. Install dependencies
```bash
npm install
```

3. Create your environment file
```bash
cp .env.example .env.development
```

4. Start development server
```bash
npm run dev
```

The server will start on the configured PORT (default: 3000)

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check for format error with Prettier
- `npm run prepare` - Setup the Husky script

## API Documentation

Once the server is running (in dev mode only), you can access the Swagger documentation at:
```
http://localhost:3000/api-docs
```

## Development Guidelines

### Path Aliases
The project uses path aliases for cleaner imports. Available aliases:
- `@/*` - src directory
- `@controllers/*` - controllers directory
- `@middlewares/*` - middlewares directory
- `@routes/*` - routes directory
- `@utils/*` - utils directory
- `@config/*` - config directory

Example:
```typescript
import { errorHandler } from '@middlewares/errorHandler';
```

### Code Style

The project uses ESLint and Prettier for code formatting. Configuration files:
- `.eslintrc.js` - ESLint configuration
- `.prettierrc` - Prettier configuration

Pre-commit hooks will automatically:
- Fix ESLint errors
- Format code with Prettier
- Run tests (if configured)

### Adding New Routes

1. Create a controller in `src/controllers`
2. Create a route file in `src/routes`
3. Add route to `src/index.ts`
4. Add Swagger documentation

Example route:
```typescript
import { Router } from 'express';
import { YourController } from '@controllers/yourController';

const router = Router();
const controller = new YourController();

router.get('/', controller.getAll);

export default router;
```

## Environment Variables

Configure the following in your `.env.X` file:

```env
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=url1,url2,url3,... (Production mode only)
```

## VSCode Configuration

Recommended VSCode settings are provided in `.vscode/settings.json`:
- Format on save
- ESLint auto-fix on save
- TypeScript path alias support

## Production Deployment

1. Build the project
```bash
npm run build
```

2. Set environment variables or create a .env.production file
```bash
NODE_ENV=production
```

3. Start the server
```bash
npm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
