import { getData, setData } from '@/lib/storage';

/**
 * Local auth adapter — a localStorage-backed "database" so the demo runs
 * without an external Supabase project. Implements the same interface as
 * SupabaseAdapter.
 *
 * NOTE: passwords are stored in plain text in localStorage. This is a
 * development-only convenience for browsing the demo, NOT production auth.
 */

const APP = import.meta.env.VITE_APP_NAME || 'metronic-tailwind-react';
const USERS_KEY = `${APP}-local-users`;
const SESSION_KEY = `${APP}-local-session`;

const DEMO_USER = {
  id: 'demo-user',
  email: 'demo@kt.com',
  password: 'demo123',
  email_verified: true,
  username: 'demo',
  first_name: 'Demo',
  last_name: 'User',
  fullname: 'Demo User',
  occupation: 'Product Designer',
  company_name: 'KeenThemes',
  phone: '+1 (555) 000-0000',
  roles: ['Admin'],
  pic: '',
  language: 'en',
  is_admin: true,
};

function getUsers() {
  const users = getData(USERS_KEY);
  if (!users) {
    const seeded = [DEMO_USER];
    setData(USERS_KEY, seeded);
    return seeded;
  }
  return users;
}

function saveUsers(users) {
  setData(USERS_KEY, users);
}

function getSession() {
  return getData(SESSION_KEY);
}

function setSession(session) {
  setData(SESSION_KEY, session);
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Local adapter: clear session error', error);
  }
}

function toProfile(user) {
  // Strip the password before exposing the profile to the app.
  const { password, ...profile } = user;
  return profile;
}

function makeTokens(userId) {
  return {
    access_token: `local-access-${userId}-${Date.now()}`,
    refresh_token: `local-refresh-${userId}-${Date.now()}`,
  };
}

export const LocalAdapter = {
  async login(email, password) {
    const users = getUsers();
    const user = users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase(),
    );

    if (!user || user.password !== password) {
      throw new Error('Invalid login credentials');
    }

    const tokens = makeTokens(user.id);
    setSession({ ...tokens, userId: user.id });
    return tokens;
  },

  async signInWithOAuth(provider) {
    throw new Error(
      `OAuth sign-in (${provider}) is not available in local mode. Use email and password.`,
    );
  },

  async register(email, password, password_confirmation, firstName, lastName) {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }

    const users = getUsers();
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('User already registered');
    }

    const user = {
      ...DEMO_USER,
      id: `user-${Date.now()}`,
      email,
      password,
      email_verified: true,
      username: email.split('@')[0],
      first_name: firstName || '',
      last_name: lastName || '',
      fullname: `${firstName || ''} ${lastName || ''}`.trim(),
      is_admin: false,
      roles: [],
    };

    users.push(user);
    saveUsers(users);

    const tokens = makeTokens(user.id);
    setSession({ ...tokens, userId: user.id });
    return tokens;
  },

  async requestPasswordReset(email) {
    const users = getUsers();
    if (!users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
      throw new Error('User not found');
    }
    // No email transport in local mode — no-op.
  },

  async resetPassword(password, password_confirmation) {
    if (password !== password_confirmation) {
      throw new Error('Passwords do not match');
    }
    const session = getSession();
    if (!session) throw new Error('No active session');

    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) throw new Error('User not found');

    user.password = password;
    saveUsers(users);
  },

  async resendVerificationEmail() {
    // No email transport in local mode — no-op.
  },

  async getCurrentUser() {
    const session = getSession();
    if (!session) return null;
    return this.getUserProfile();
  },

  async getUserProfile() {
    const session = getSession();
    if (!session) throw new Error('User not found');

    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) throw new Error('User not found');

    return toProfile(user);
  },

  async updateUserProfile(userData) {
    const session = getSession();
    if (!session) throw new Error('No active session');

    const users = getUsers();
    const user = users.find((u) => u.id === session.userId);
    if (!user) throw new Error('User not found');

    Object.assign(user, {
      username: userData.username,
      first_name: userData.first_name,
      last_name: userData.last_name,
      fullname:
        userData.fullname ||
        `${userData.first_name || ''} ${userData.last_name || ''}`.trim(),
      occupation: userData.occupation,
      company_name: userData.company_name || userData.companyName,
      phone: userData.phone,
      roles: userData.roles,
      pic: userData.pic,
      language: userData.language,
      is_admin: userData.is_admin,
      updated_at: new Date().toISOString(),
    });

    saveUsers(users);
    return this.getCurrentUser();
  },

  async logout() {
    clearSession();
  },
};
