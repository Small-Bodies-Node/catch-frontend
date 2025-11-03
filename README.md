# Ng20-Cognito Boilerplate

Admin-managed users with AWS Cognito, Angular v20 (SSR + prerender) and an Express API.

This repo is configured so that only an administrator can create and manage users. There is no public signup. End users can log in and reset their password; administrators can add/remove users or reset their passwords via the AWS Cognito console (preferred) or via the provided admin API endpoints.

## Overview

- UI: Angular v20, SSR + prerender, SCSS, Angular Material.
- API: Express under `src/server/` using AWS SDK v3 for Cognito.
- Auth: Cognito User Pool using the Hosted user management features (no Hosted UI). Tokens validated by the API middleware.
- Admin flow: Admin creates users in the Cognito console or through admin API; users sign in and, if created with a temporary password, complete the NEW_PASSWORD_REQUIRED step.
- User flow: Login, Forgot Password (request a code), Reset Password (confirm with code). No signup.

## Prerequisites

- Node 20+
- An AWS account with permission to manage Cognito User Pools
- For admin API calls: AWS credentials available to the Express server with `cognito-idp:*` permissions listed below (see IAM policy example)

## Quick start (development)

1. Copy `.env-template` to `.env` and fill in values:

```
COGNITO_REGION=us-east-1
COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
# Optional if using a confidential app client
# COGNITO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Dev API server port (Angular dev server proxies /api -> this port)
PORT=3000
```

2. Provide AWS credentials for admin endpoints (only needed if you plan to use API admin routes instead of the Console):

- Recommended: set up an IAM user/role and export standard AWS env vars before starting the dev API, or use your AWS profile:

```
export AWS_ACCESS_KEY_ID=...
export AWS_SECRET_ACCESS_KEY=...
# Optional if using session tokens
export AWS_SESSION_TOKEN=...
export AWS_REGION=us-east-1
```

3. Run the servers during development:

```
npm install
npm run dev:api     # starts the express API at http://localhost:3000
npm run dev:ng      # starts the Angular dev server at http://localhost:4200 (proxies /api)
```

4. Production build:

```
npm run build
```

Output is in `dist/catch-frontend-ng20`. Provide the environment variables above to your server process at runtime.

## Docker (production)

- Update `.env` with the `PORT` you want the container to listen on and any other runtime variables (for production deployments, supply real secrets via your orchestrator rather than baking them into the image).
- Build the container image locally: `docker compose build`.
- Run it in the background: `docker compose up -d`.
- The container exposes port `${PORT}` (default `4000`) and starts the SSR server via `node dist/catch-frontend-ng20/server/server.mjs`. An Apache or ALB reverse proxy can forward traffic to this port.
- Check health locally with `curl http://localhost:${PORT}`; the compose healthcheck uses the same endpoint.
- When ready for AWS, tag the image (e.g., `docker tag catch-frontend-ng20:latest <account>.dkr.ecr.<region>.amazonaws.com/catch-frontend-ng20:<tag>`) and push it to ECR for use in ECS/Fargate task definitions.

## AWS Cognito: Setup from scratch (Console)

1. Create a User Pool

- AWS Console -> Cognito -> Create user pool
- Application type: Traditional web application (preset).
- On the first screen ("Tell us about your application") do this exactly (matches your screenshot):
  - Options for sign-in identifiers: check ONLY `Email`. Leave `Phone number` and `Username` unchecked.
  - Required attributes for sign-up: select `email`.
  - Add a return URL: leave blank (not used by this project).
- After the pool is created, open the new User Pool and configure:
  - Authentication -> Sign-up -> Self-service sign-up: OFF (admin invites only). Click "Save changes".
  - Attributes: ensure `email` remains required.
  - Admin-created users and emails:
    - Console: User management -> Users -> Create user -> check "Mark email as verified" to avoid verification emails and fit the admin-invite model.
    - API (this codebase): `POST /api/auth/admin/users` with JSON `{ username, email, temporaryPassword?, suppressEmail? }`.
      - The server calls Cognito `AdminCreateUser` with `UserAttributes` including `{ email, email_verified: 'true' }`.
      - If you pass `suppressEmail: true`, the server sets `MessageAction: 'SUPPRESS'` so Cognito sends no email; you notify the user yourself.
  - Security requirements:
    - Password policy: set min length and character requirements to mirror the UI policy in `src/app/auth/password-policy.ts`.
    - MFA/Recovery: optional; configure SMS/Authenticator as desired.
- App integration (Hosted UI):
  - This project does not use the Hosted UI. You can skip callback URLs and OAuth flows during creation. We will create a minimal App client in the next step.

2. Create an App client

- App integration -> App clients -> Create app client
- Client type: Public client (no client secret).
- Authentication flow settings (align with `src/server/routes/auth.route.ts`):
  - Enable Username and password (USER_PASSWORD_AUTH)
  - Enable Refresh token (REFRESH_TOKEN_AUTH)
  - Optional: SRP (USER_SRP_AUTH) can remain disabled; this project does not use SRP.
  - Disable Custom authentication unless you have a specific need.
- OAuth 2.0 / Hosted UI: OFF
  - Do not enable Authorization code or Implicit flows.
  - Do not configure a Hosted UI domain; leave callback and sign-out URLs blank.
- Token settings (suggested starting values):
  - Access token: 1 hour
  - ID token: 1 hour
  - Refresh token: 30 days (adjust for your security posture)
- Save the client and copy:
  - Client ID -> `COGNITO_CLIENT_ID`

3. (Optional) Configure email settings

- By default, Cognito can send emails from `no-reply@verificationemail.com` or you can integrate SES for custom sender

4. Create an Admin group

- User groups -> Create group `admin`

5. Create users (admin-managed)

- Users -> Create user
- Username: your choice (email is fine)
- Email: set the user’s email; mark as verified if you trust it
- Temporary password: set one; the user will be forced to change it on first sign in (NEW_PASSWORD_REQUIRED)
- Add the user to groups as needed (e.g., `admin` for administrators)

6. Notes on user notifications

- Cognito will email the user depending on the delivery options (temporary password and/or verification). If you prefer to notify users manually, you can suppress emails when creating users via API and send your own message.

## App configuration

Set the following environment variables for the API server process:

- `COGNITO_REGION`: e.g., `us-east-1`
- `COGNITO_USER_POOL_ID`: e.g., `us-east-1_AbCdEfGHi`
- `COGNITO_CLIENT_ID`: App client ID
- `COGNITO_CLIENT_SECRET` (optional): only if using a confidential app client

For admin API endpoints, the process running `src/server` must have AWS credentials with these permissions:

```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminDeleteUser",
        "cognito-idp:AdminResetUserPassword",
        "cognito-idp:AdminSetUserPassword"
      ],
      "Resource": "arn:aws:cognito-idp:<REGION>:<ACCOUNT_ID>:userpool/<USER_POOL_ID>"
    }
  ]
}
```

## User flows in this project

- Login: `/login`
  - If a user was created with a temporary password, Cognito returns `NEW_PASSWORD_REQUIRED` and the app redirects to `/new-password` to set a permanent password.
- Forgot Password: `/forgot` -> sends a verification code to the user’s email
- Reset Password: `/reset` -> user provides code + new password
- Profile: `/profile` -> authenticated user can change their current password

There is no public signup route. Any previous signup/confirm/resend UI has been removed or disabled.

## API Endpoints (Express -> Cognito)

Base path: `/api/auth`

- `POST /login` { email, password } -> tokens or `NEW_PASSWORD_REQUIRED` challenge
- `POST /complete-new-password` { email, newPassword, session } -> tokens
- `POST /forgot` { email } -> sends code
- `POST /confirm-forgot` { email, code, password } -> ok
- `POST /refresh` { refreshToken, email? } -> tokens
- `POST /logout` { accessToken } -> ok
- `GET /me` (Bearer token) -> { sub, email, groups }
- `POST /change-password` (Bearer token) { previousPassword, proposedPassword } -> ok

Admin (requires `admin` group via ID token):

- `POST /admin/users` { username, email, temporaryPassword?, suppressEmail? } -> create user
- `DELETE /admin/users/:username` -> delete user
- `POST /admin/users/:username/reset` -> trigger reset email
- `POST /admin/users/:username/set-password` { password, permanent } -> set a password

## Customizing the password policy UI

- `src/app/auth/password-policy.ts`: Adjust `DEFAULT_PASSWORD_POLICY` to mirror your Cognito policy (min length, character requirements, disallow email local-part, etc.)
- `src/app/components/password-fields/*`: Reusable component used by reset/new-password and profile security section

## Notes

- This project performs token validation in the API middleware using the ID token (preferred for groups) and falls back to the access token if needed.
- If you enable a client secret, some API calls require the email to compute `SECRET_HASH` (see comments in `.env-template`).
- For production, ensure HTTPS, secure cookie storage if you adapt the token storage strategy, and appropriate CORS/CSRF measures.

# Ng20-Cognito Boilerplate

[]
