# Phonebook Frontend

A modern, full-stack contact management application built with **Nuxt 4** and **Vue 3**. Users can create accounts, securely log in, and manage their personal contacts with full CRUD operations, search, and pagination.

> **Backend Repository:** [phonebook-backend](https://github.com/otutukingsley/phonebook-backend)
> **Frontend Repository:** [phonebook-frontend](https://github.com/otutukingsley/phonebook-frontend)

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **User Authentication** — Registration, login, and logout with session-based auth
- **Password Recovery** — Forgot password flow using security questions
- **Contact Management** — Create, read, update, and delete contacts
- **Search** — Live search with debounced filtering
- **Pagination** — Cursor-based "Load More" pagination
- **Profile Management** — View and edit user profile
- **Responsive UI** — Tailwind CSS with Nuxt UI component library
- **API Proxy** — Server-side proxy to the backend, keeping API URLs private
- **Serverless Deployment** — Deployed to AWS Lambda via Serverless Framework

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Nuxt 4 (Vue 3) |
| Language | TypeScript 5.9 |
| Styling | Tailwind CSS 4 + Nuxt UI 3 |
| Components | Headless UI + Heroicons |
| Auth | nuxt-auth-utils (session-based) |
| Deployment | AWS Lambda + Serverless Framework 3 |
| Runtime | Node.js 20.x |

---

## Project Structure

```text
phonebook-frontend/
├── app/                                # Application source code
│   ├── pages/                          # Route pages (file-based routing)
│   │   ├── index.vue                   # Dashboard — contact list (protected)
│   │   ├── login.vue                   # Login page
│   │   ├── register.vue                # Registration page
│   │   ├── landing.vue                 # Public landing page
│   │   ├── forgot-password.vue         # Password reset flow
│   │   └── components.vue              # Component showcase
│   │
│   ├── components/                     # Vue components
│   │   ├── ui/                         # Reusable UI primitives
│   │   │   ├── Button.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   ├── Spinner.vue
│   │   │   ├── Link.vue
│   │   │   ├── Label.vue
│   │   │   ├── Badge.vue
│   │   │   ├── Checkbox.vue
│   │   │   ├── Radio.vue
│   │   │   ├── Select.vue
│   │   │   └── Textarea.vue
│   │   ├── NavBar.vue                  # Top navigation bar
│   │   ├── AuthForm.vue                # Shared login/register form
│   │   ├── ContactForm.vue             # Add/edit contact modal form
│   │   ├── ContactCard.vue             # Individual contact card
│   │   ├── ContactList.vue             # Contact grid container
│   │   ├── ViewContactModal.vue        # Contact detail modal
│   │   ├── DeleteConfirmModal.vue      # Delete confirmation dialog
│   │   ├── ViewProfileModal.vue        # User profile viewer
│   │   └── EditProfileModal.vue        # Profile editor modal
│   │
│   ├── composables/                    # Vue 3 composition functions
│   │   ├── useAuth.ts                  # Auth state & login/logout/register
│   │   ├── useContacts.ts              # Contact CRUD, search, pagination
│   │   ├── useApi.ts                   # HTTP client wrapper
│   │   ├── useForm.ts                  # Form validation & submission
│   │   └── useModal.ts                 # Modal visibility management
│   │
│   ├── middleware/                      # Route middleware
│   │   ├── auth.ts                     # Redirects unauthenticated users
│   │   └── guest.ts                    # Redirects authenticated users
│   │
│   ├── plugins/
│   │   └── auth.ts                     # Auth initialization on app load
│   │
│   ├── types/
│   │   └── auth.d.ts                   # TypeScript type definitions
│   │
│   ├── constants/
│   │   └── securityQuestions.ts         # Security question options
│   │
│   ├── layouts/
│   │   └── default.vue                 # Default layout with NavBar
│   │
│   ├── assets/css/
│   │   └── main.css                    # Tailwind CSS imports
│   │
│   └── app.vue                         # Root application component
│
├── server/                             # Nitro server-side code
│   └── api/
│       ├── [...].ts                    # Catch-all API proxy to backend
│       └── _auth/
│           └── set-session.post.ts     # Session cookie management
│
├── public/                             # Static assets
│   ├── favicon.ico
│   └── robots.txt
│
├── nuxt.config.ts                      # Nuxt configuration
├── serverless.yml                      # AWS Lambda deployment config
├── tsconfig.json                       # TypeScript configuration
├── package.json                        # Dependencies & scripts
└── .env                                # Environment variables (not committed)
```

---

## How It Works

### Authentication Flow

1. **Landing Page** — Unauthenticated visitors see a public welcome page at `/landing`
2. **Registration** — Users sign up with name, email, a strong password, and a security question. The app calls `POST /api/users` on the backend, then automatically logs the user in
3. **Login** — Users authenticate with email and password via `POST /api/auth`. A session cookie is set server-side using `nuxt-auth-utils`
4. **Password Recovery** — A two-step flow: the user enters their email to retrieve their security question, then answers it and sets a new password
5. **Route Protection** — The `auth` middleware redirects unauthenticated users to `/landing`. The `guest` middleware redirects authenticated users away from login/register pages

### Contact Management

The main dashboard (`/`) is a protected page where authenticated users can:

- **View contacts** in a responsive card grid
- **Create** a new contact via a modal form (name, email, phone, address, type, notes)
- **Edit** an existing contact inline
- **Delete** a contact with a confirmation dialog
- **Search** contacts with a debounced search input (300ms delay)
- **Paginate** using cursor-based "Load More" — the backend returns a `lastKey` for the next page

### API Proxy

The frontend never calls the backend directly from the browser. Instead, a Nitro server route (`server/api/[...].ts`) acts as a catch-all proxy:

```text
Browser  →  Nuxt Server (/api/*)  →  Backend API (NUXT_API_BASE_URL)
```

This keeps the backend URL private and allows the server to attach session cookies and headers transparently.

### State Management

The app uses Vue 3 composables instead of a global store:

| Composable       | Responsibility                              |
|------------------|---------------------------------------------|
| `useAuth()`      | Login, logout, register, session state      |
| `useContacts()`  | CRUD operations, search, pagination         |
| `useApi()`       | HTTP client with credentials forwarding     |
| `useForm()`      | Form validation and submission handling     |
| `useModal()`     | Modal open/close state per unique ID        |

---

## Getting Started

### Prerequisites

- **Node.js** >= 20.x
- **npm** (or pnpm / yarn / bun)
- The [phonebook-backend](https://github.com/otutukingsley/phonebook-backend) running locally or deployed

### Installation

```bash
# Clone the repository
git clone https://github.com/otutukingsley/phonebook-frontend.git
cd phonebook-frontend

# Install dependencies
npm install
```

### Development

```bash
# Start the dev server at http://localhost:3000
npm run dev
```

### Production Build

```bash
# Build for production
npm run build

# Preview the production build locally
npm run preview
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Base URL of the backend API (include the /api path)
NUXT_API_BASE_URL=http://localhost:5500/api

# Session encryption password (minimum 32 characters)
NUXT_SESSION_PASSWORD=your-secure-random-string-at-least-32-chars
```

| Variable | Description | Required |
| --- | --- | --- |
| `NUXT_API_BASE_URL` | Backend API base URL | Yes |
| `NUXT_SESSION_PASSWORD` | Secret key for encrypting session cookies | Yes |

---

## Deployment

The project is configured for **AWS Lambda** deployment using the **Serverless Framework**.

### Configuration

The `serverless.yml` defines:

- **Runtime:** Node.js 20.x
- **Region:** us-east-1
- **Memory:** 512 MB
- **Timeout:** 15 seconds
- **Entry point:** `.output/server/index.handler`

### Deploy

```bash
# Build the Nuxt app first
npm run build

# Deploy to AWS (requires AWS CLI credentials configured)
npx serverless deploy
```

The Serverless Framework packages the `.output/` directory and deploys it as a Lambda function behind an HTTP API Gateway. All routes (including static assets) are served through the Lambda function.

### Architecture

```text
Client  →  API Gateway (HTTPS/HTTP2)  →  AWS Lambda (Nuxt/Nitro)  →  Backend API
```

---

## Contributing

Contributions are welcome! This project is open source and we appreciate help from the community.

### How to Contribute

1. **Fork the repository** — Click the "Fork" button on [phonebook-frontend](https://github.com/otutukingsley/phonebook-frontend) or [phonebook-backend](https://github.com/otutukingsley/phonebook-backend)

2. **Clone your fork**

   ```bash
   git clone https://github.com/<your-username>/phonebook-frontend.git
   cd phonebook-frontend
   ```

3. **Create a feature branch**

   ```bash
   git checkout -b feat/your-feature-name
   ```

4. **Make your changes** — Follow the existing code style and conventions:
   - Use TypeScript for all new code
   - Follow the existing component and composable patterns
   - Use Tailwind CSS utility classes for styling
   - Place new components in the appropriate directory under `app/components/`
   - Place new composables under `app/composables/`

5. **Test locally**

   ```bash
   npm run dev
   ```

6. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: brief description of the change"
   ```

   Follow [Conventional Commits](https://www.conventionalcommits.org/) for commit messages:

   - `feat:` — New feature
   - `fix:` — Bug fix
   - `docs:` — Documentation changes
   - `refactor:` — Code refactoring
   - `style:` — Formatting changes
   - `chore:` — Build/tooling changes

7. **Push and open a Pull Request**

   ```bash
   git push origin feat/your-feature-name
   ```

   Then open a PR against the `main` branch with a clear description of your changes.

### Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/otutukingsley/phonebook-frontend/issues) with:

- A clear title and description
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Screenshots if applicable

### Code of Conduct

Be respectful and constructive. We're all here to build something great together.

---

## License

This project is open source. See the repository for license details.
