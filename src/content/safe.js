// Security rules appended to every prompt that builds something.
export const SAFE = `

Security rules (always follow these):
- Never put secret keys in front-end code. Secrets go in .env.local, and .env.local must be in .gitignore.
- Check every input from users on the server before using it.
- Before reading or changing data, check the user is allowed to.
- Use parameterized queries. Never build SQL by gluing strings together.
- Show users friendly errors. Never show them stack traces or raw error messages.
When you are done, tell me in plain words what you changed and anything I need to do.`;
