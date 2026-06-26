# AGENTS.md

## Development Workflow
- **Development Server:** Use `composer dev` to run the full stack (Laravel, queue, Vite).
- **Testing:** Run tests with `composer test` (wraps `php artisan test`). Uses Pest.
- **Code Style:** Use `vendor/bin/pint` for PHP code formatting.

## Architecture & Conventions
- **Framework:** Laravel 12.
- **Frontend:** Inertia.js with React.
- **Testing:** Pest.
- **Database:** SQLite is often used for development (see `composer.json` post-create-project-cmd).
- **Tooling:** Laravel Sail is available as a dev dependency.

## Key Gotchas
- Always ensure `.env` exists (copied from `.env.example`).
- `composer dev` runs multiple services in parallel using `concurrently`. Use `Ctrl+C` to terminate the group.
