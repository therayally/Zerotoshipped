// Security rules appended to every prompt that builds something.
export const SAFE = `

Security rules (always follow these):
- Never put secret keys in front-end code. Secrets go in .env.local, and .env.local must be in .gitignore.
- Check every input from users on the server before using it.
- Before reading or changing data, check the user is allowed to.
- Use parameterized queries. Never build SQL by gluing strings together.
- Show users friendly errors. Never show them stack traces or raw error messages.
When you are done, tell me in plain words what you changed and anything I need to do.`;

// The course's one way to hand over any secret key: a hidden terminal prompt that saves it to .env.local and Vercel.
export const addKey = (name, service) => `Help me add my ${service} key as ${name}.
Open a terminal tab with a hidden prompt (nothing shows while I paste) and wait for me to paste it there once.
After I paste, show only how many characters it got and the last 4, and test the key with ${service} if you can.
Then save it to .env.local (make sure .env.local is in .gitignore) and to my Vercel project as a Sensitive Production variable.
Never print the key, never ask me to paste it into this chat, and never put it in code.`;
