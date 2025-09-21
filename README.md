# Windfall - Next.js Project

A professional Next.js application built with TypeScript and modern development tools.

## 🚀 Tech Stack

- **Framework**: Next.js 15.5.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Development**: Turbopack for fast builds
- **Code Quality**: ESLint + Prettier
- **Testing**: Jest + React Testing Library
- **Git Hooks**: Husky + lint-staged
- **Package Manager**: npm

## 📦 Project Structure

```
├── src/
│   ├── app/              # App Router pages and layouts
│   │   ├── page.tsx      # Home page
│   │   ├── layout.tsx    # Root layout
│   │   └── globals.css   # Global styles
├── __tests__/            # Test files
├── .vscode/              # VS Code settings
├── .husky/               # Git hooks
└── ...config files
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd windfall

# Install dependencies
npm install

# Create environment file (optional)
cp .env.example .env.local
```

### Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint issues
npm run format          # Format code with Prettier
npm run format:check    # Check formatting

# Testing
npm test                # Run tests
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage

# Type Checking
npm run type-check      # Run TypeScript compiler check
```

## 🧪 Testing

This project uses Jest and React Testing Library for testing. Tests are located in the `__tests__` directory.

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🎨 Code Style

This project uses ESLint and Prettier for consistent code formatting:

- **ESLint**: Configured with Next.js and TypeScript rules
- **Prettier**: Opinionated code formatter
- **Husky**: Git hooks for pre-commit linting
- **lint-staged**: Run linters on staged files

Code is automatically formatted on save (if VS Code is configured properly) and before each commit.

## 🔧 VS Code Integration

Recommended VS Code extensions are listed in `.vscode/extensions.json`:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Importer

Settings are configured in `.vscode/settings.json` for optimal development experience.

## 🚢 Deployment

### Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/windfall)

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 📝 Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
# Database
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3000"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
