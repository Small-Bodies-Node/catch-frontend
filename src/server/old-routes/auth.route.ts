import { Router } from 'express';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  GlobalSignOutCommand,
  ChangePasswordCommand,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  RespondToAuthChallengeCommand,
  AdminCreateUserCommand,
  AdminDeleteUserCommand,
  AdminResetUserPasswordCommand,
  AdminSetUserPasswordCommand
} from '@aws-sdk/client-cognito-identity-provider';

import crypto from 'crypto';
import { requireAuth, requireRole } from '../middleware/auth';

const REGION = process.env['COGNITO_REGION'] as string;
const CLIENT_ID = process.env['COGNITO_CLIENT_ID'] as string;
const USER_POOL_ID = process.env['COGNITO_USER_POOL_ID'] as string;
const CLIENT_SECRET = process.env['COGNITO_CLIENT_SECRET'];

function secretHash(username: string): string | undefined {
  if (!CLIENT_SECRET) return undefined;
  const hmac = crypto.createHmac('sha256', CLIENT_SECRET);
  hmac.update(username + CLIENT_ID);
  return hmac.digest('base64');
}

const client = new CognitoIdentityProviderClient({ region: REGION });
const r = Router();

// === Forgot password (user-initiated) ===
r.post('/forgot', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'email is required' });
  try {
    const cmd = new ForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: email,
      SecretHash: secretHash(email)
    });
    const out = await client.send(cmd);
    return res.json({ ok: true, codeDelivery: out.CodeDeliveryDetails });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'ForgotPasswordError', message: err.message });
  }
});

r.post('/confirm-forgot', async (req, res) => {
  const { email, code, password } = req.body || {};
  if (!email || !code || !password) return res.status(400).json({ error: 'email, code and password are required' });
  try {
    const cmd = new ConfirmForgotPasswordCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: password,
      SecretHash: secretHash(email)
    });
    await client.send(cmd);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'ConfirmForgotPasswordError', message: err.message });
  }
});

// === Complete NEW_PASSWORD_REQUIRED challenge ===
r.post('/complete-new-password', async (req, res) => {
  const { email, newPassword, session } = req.body || {};
  if (!email || !newPassword || !session) return res.status(400).json({ error: 'email, newPassword and session are required' });
  try {
    const cmd = new RespondToAuthChallengeCommand({
      ClientId: CLIENT_ID,
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      Session: session,
      ChallengeResponses: {
        USERNAME: email,
        NEW_PASSWORD: newPassword,
        ...(CLIENT_SECRET ? { SECRET_HASH: secretHash(email)! } : {})
      }
    });
    const out = await client.send(cmd);
    const a = out.AuthenticationResult;
    if (!a?.IdToken || !a.AccessToken) return res.status(400).json({ error: 'AuthFailed' });
    return res.json({ idToken: a.IdToken, accessToken: a.AccessToken, refreshToken: a.RefreshToken, expiresIn: a.ExpiresIn });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'CompleteNewPasswordError', message: err.message });
  }
});

// === Admin user management (requires admin role) ===
r.post('/admin/users', requireAuth, requireRole('admin'), async (req, res) => {
  const { username, email, temporaryPassword, suppressEmail } = req.body || {};
  if (!username || !email) return res.status(400).json({ error: 'username and email are required' });
  try {
    const cmd = new AdminCreateUserCommand({
      UserPoolId: USER_POOL_ID,
      Username: username,
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'email_verified', Value: 'true' }
      ],
      ...(suppressEmail ? { MessageAction: 'SUPPRESS' } : {}),
      DesiredDeliveryMediums: suppressEmail ? undefined : ['EMAIL']
    });
    const out = await client.send(cmd);
    return res.json({ ok: true, user: out.User });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'AdminCreateUserError', message: err.message });
  }
});

r.delete('/admin/users/:username', requireAuth, requireRole('admin'), async (req, res) => {
  const username = req.params['username'];
  if (!username) return res.status(400).json({ error: 'username is required' });
  try {
    const cmd = new AdminDeleteUserCommand({ UserPoolId: USER_POOL_ID, Username: username });
    await client.send(cmd);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'AdminDeleteUserError', message: err.message });
  }
});

r.post('/admin/users/:username/reset', requireAuth, requireRole('admin'), async (req, res) => {
  const username = req.params['username'];
  try {
    const cmd = new AdminResetUserPasswordCommand({ UserPoolId: USER_POOL_ID, Username: username });
    await client.send(cmd);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'AdminResetUserPasswordError', message: err.message });
  }
});

r.post('/admin/users/:username/set-password', requireAuth, requireRole('admin'), async (req, res) => {
  const username = req.params['username'];
  const { password, permanent } = req.body || {};
  if (!password) return res.status(400).json({ error: 'password is required' });
  try {
    const cmd = new AdminSetUserPasswordCommand({ UserPoolId: USER_POOL_ID, Username: username, Password: password, Permanent: !!permanent });
    await client.send(cmd);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'AdminSetUserPasswordError', message: err.message });
  }
});

 


r.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'email and password are required' });
  try {
    const cmd = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password,
        ...(CLIENT_SECRET ? { SECRET_HASH: secretHash(email)! } : {})
      }
    });
    const out = await client.send(cmd);
    if (out.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
      return res.json({ challenge: 'NEW_PASSWORD_REQUIRED', session: out.Session, username: email });
    }
    const a = out.AuthenticationResult;
    if (!a?.IdToken || !a.AccessToken) return res.status(400).json({ error: 'AuthFailed' });
    return res.json({
      idToken: a.IdToken,
      accessToken: a.AccessToken,
      refreshToken: a.RefreshToken,
      expiresIn: a.ExpiresIn
    });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'LoginError', message: err.message });
  }
});

r.post('/refresh', async (req, res) => {
  const { refreshToken, email } = req.body || {};
  if (!refreshToken) return res.status(400).json({ error: 'refreshToken is required' });
  try {
    const cmd = new InitiateAuthCommand({
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
        ...(CLIENT_SECRET && email ? { SECRET_HASH: secretHash(email)! } : {})
      }
    });
    const out = await client.send(cmd);
    const a = out.AuthenticationResult;
    if (!a?.IdToken || !a.AccessToken) return res.status(400).json({ error: 'RefreshFailed' });
    return res.json({ idToken: a.IdToken, accessToken: a.AccessToken, expiresIn: a.ExpiresIn });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'RefreshError', message: err.message });
  }
});

r.post('/logout', async (req, res) => {
  const { accessToken } = req.body || {};
  if (!accessToken) return res.status(400).json({ error: 'accessToken is required' });
  try {
    const cmd = new GlobalSignOutCommand({ AccessToken: accessToken });
    await client.send(cmd);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'LogoutError', message: err.message });
  }
});

// current user info using ID/Access token in Authorization header
r.get('/me', requireAuth, (req, res) => {
  const u = req.user!;
  const tokenUse = (u.raw?.['token_use'] as string) || 'unknown';
  return res.json({ sub: u.sub, email: u.email, groups: u.groups, tokenUse });
});

// Change password for the currently authenticated user.
// Requires AccessToken (provided by authInterceptor for /api/auth/* endpoints except /me)
r.post('/change-password', requireAuth, async (req, res) => {
  const { previousPassword, proposedPassword } = req.body || {};
  if (!previousPassword || !proposedPassword) {
    return res.status(400).json({ error: 'previousPassword and proposedPassword are required' });
  }
  try {
    const token = req.token as string | undefined;
    if (!token) return res.status(401).json({ error: 'Missing access token' });
    const cmd = new ChangePasswordCommand({
      AccessToken: token,
      PreviousPassword: previousPassword,
      ProposedPassword: proposedPassword
    });
    await client.send(cmd);
    return res.json({ ok: true });
  } catch (err: any) {
    return res.status(400).json({ error: err.name || 'ChangePasswordError', message: err.message });
  }
});

export default r;
