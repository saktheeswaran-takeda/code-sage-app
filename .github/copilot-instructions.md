# Copilot Coding Standards

## Security

- **No hardcoded secrets**: Never embed API keys, tokens, passwords, or connection strings in source code. Always use environment variables or a secret manager (e.g., `process.env.API_KEY`).
- **Input validation**: Validate and sanitize all user inputs at system boundaries. Never trust `req.query`, `req.params`, or `req.body` directly.
- **Parameterized queries**: Use parameterized queries or ORM methods to prevent SQL/NoSQL injection. Never concatenate user input into query strings or URLs.
- **Dependency security**: Avoid packages with known vulnerabilities. Run `npm audit` regularly.
- **Least privilege**: Grant only the minimum permissions needed for each service or user.

## Async & Error Handling

- **Use async/await**: Prefer `async/await` over callbacks or raw Promises for readability and proper error propagation.
- **Try/catch in async routes**: Wrap `async` route handlers in `try/catch` blocks. Return appropriate HTTP status codes (400 for bad input, 500 for server errors) with meaningful error messages.
- **No silent failures**: Never swallow errors. Always log or propagate them.
- **Centralized error handler**: Use Express error-handling middleware (`app.use((err, req, res, next) => {...})`) as a catch-all for unhandled errors.

## Naming Conventions

- **Variables & functions**: Use `camelCase` (e.g., `userId`, `processPayment`).
- **Constants**: Use `UPPER_SNAKE_CASE` for true constants (e.g., `MAX_RETRIES`).
- **Files**: Use `kebab-case` for filenames (e.g., `payment-service.js`).
- **Descriptive names**: Names should convey purpose. Avoid single-letter variables outside short loop bodies.

## Performance

- **Avoid nested loops on large datasets**: Replace O(n²) patterns with Maps, Sets, or indexed lookups for O(n) performance.
- **Limit response payloads**: Use pagination or field selection instead of returning entire collections.
- **Cache when appropriate**: Cache expensive or repeated computations/external calls where data freshness allows.

## Code Structure

- **Early returns**: Use guard clauses and return early for invalid inputs instead of deeply nesting `if/else`.
- **Single responsibility**: Each function/module should do one thing well. Extract reusable logic into separate utility functions.
- **HTTP status codes**: Use correct status codes — `200` for success, `400` for bad requests, `404` for not found, `500` for server errors. Do not send `200` for error responses.
- **Environment configuration**: Use a `.env` file with `dotenv` for local development. Never commit `.env` files to version control.

## API Design

- **RESTful conventions**: Use proper HTTP methods — `GET` for reads, `POST` for creates, `PUT`/`PATCH` for updates, `DELETE` for removals.
- **Consistent response format**: Return JSON responses with a consistent shape (e.g., `{ "success": true, "data": ... }` or `{ "success": false, "error": "..." }`).
- **Validate required parameters**: Check for required fields and return `400 Bad Request` with a clear message when they are missing.

## Logging & Observability

- **Structured logging**: Use a logging library (e.g., `winston`, `pino`) instead of `console.log` in production code.
- **Log context**: Include request IDs, user IDs, and timestamps in log entries for traceability.