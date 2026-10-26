# Security policy

TinyAppCode (tinyappcode.com) takes security seriously, and this repository is public on purpose so learners can see how a real app is built.

## Reporting a vulnerability

Please **do not open a public issue** for security problems.

Report privately through GitHub: **Security → Report a vulnerability** on this repository. Include what you found, steps to reproduce, and the impact. We aim to reply within 3 business days and to fix confirmed issues quickly. Please give us reasonable time to fix an issue before sharing it publicly.

Good-faith research that avoids privacy violations, data destruction and service disruption is welcome. Do not access other people's accounts or data, and do not run automated scans that degrade the site.

## How the site is protected (summary)

- Secrets live only in Vercel environment variables (Sensitive); none are in this repository. Secret scanning with push protection is on.
- Passwords are hashed with scrypt. New devices need an emailed code (two-step sign-in). Repeated wrong passwords lock the account for 15 minutes.
- Sessions, codes and trusted-device tokens are stored only as hashes.
- Admin access requires a password and an emailed code every time.
- Payment notifications are verified with HMAC signatures; card data never touches our servers.
- Dependencies are monitored by Dependabot; the main branch is protected from force-pushes and deletion.
