# Dummy Authentication System

A mock authentication system that uses localStorage to simulate backend authentication. This allows you to develop and test the UI without a real API backend.

## Features

- ✅ **Sign up** - Create new users (stored in localStorage)
- ✅ **Login** - Authenticate with email/password
- ✅ **Logout** - Clear authentication state
- ✅ **Persistent sessions** - Auth state persists across page refreshes
- ✅ **Demo user** - Pre-configured test account

## Demo Account

A default demo user is automatically created:

- **Email:** `demo@example.com`
- **Password:** `demo123`

You can use these credentials to test the login flow immediately.

## Usage

### Sign Up

1. Go to `/signup`
2. Fill in:
   - Full name (min 2 characters)
   - Email address
   - Password (min 6 characters, must contain uppercase, lowercase, and number)
   - Confirm password
3. Click "Create account"
4. You'll be redirected to the login page

### Login

1. Go to `/login`
2. Enter email and password
3. Click "Sign in"
4. You'll be redirected to the home page

### Logout

The logout functionality will clear the authentication state and redirect to the home page.

## How It Works

### Mock Auth Service (`lib/utils/mockAuth.ts`)

- Stores users in localStorage under the key `mock_users`
- Stores auth token in localStorage under the key `auth_token`
- Stores current user in localStorage under the key `current_user`
- Simulates network delay (~800ms) for realistic UX

### Auth Slice (`lib/slices/authSlice.ts`)

- Uses Redux Toolkit async thunks
- Integrates with mockAuthService
- Manages loading, error, and authentication state

### Auth Initializer (`components/auth/auth-initializer.tsx`)

- Automatically restores authentication state from localStorage on app load
- Runs once when the app mounts

## File Structure

```
lib/
  utils/
    mockAuth.ts          # Mock authentication service
  slices/
    authSlice.ts         # Redux auth slice with mock integration
components/
  auth/
    auth-initializer.tsx # Initializes auth state on app load
```

## Switching to Real API

When you're ready to connect to a real backend:

1. Update `lib/slices/authSlice.ts` to use real API calls instead of `mockAuthService`
2. Remove or comment out the `AuthInitializer` component
3. Update API endpoints in `lib/api/clients.tsx`
4. Remove `lib/utils/mockAuth.ts` if no longer needed

## Notes

- All data is stored in browser localStorage (cleared when browser data is cleared)
- Passwords are stored in plain text (NOT secure - only for development!)
- No real authentication or authorization is performed
- Suitable for UI development and testing only

