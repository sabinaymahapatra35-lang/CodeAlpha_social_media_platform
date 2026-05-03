// ============================================
// API UTILITY — Centralized API calls
// ============================================

const API_BASE = 'http://localhost:5000/api';

// Get JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Generic fetch wrapper with auth header
const api = async (endpoint, options = {}) => {
  const token = getToken();
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  // Don't set Content-Type for FormData (let browser set it with boundary)
  if (options.body instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  const response = await fetch(`${API_BASE}${endpoint}`, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
};

// ── Auth ─────────────────────────────────────
const Auth = {
  register: (data) => api('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => api('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => api('/auth/me'),
};

// ── Users ────────────────────────────────────
const Users = {
  getById: (id) => api(`/users/${id}`),
  getByUsername: (username) => api(`/users/username/${username}`),
  updateProfile: (formData) => api('/users/profile', { method: 'PUT', body: formData }),
  follow: (id) => api(`/users/${id}/follow`, { method: 'POST' }),
  search: (q) => api(`/users/search?q=${encodeURIComponent(q)}`),
  getNotifications: () => api('/users/notifications'),
  getUnreadCount: () => api('/users/notifications/count'),
};

// ── Posts ────────────────────────────────────
const Posts = {
  getFeed: (page = 1) => api(`/posts/feed?page=${page}`),
  getExplore: (page = 1) => api(`/posts/explore?page=${page}`),
  getUserPosts: (userId, page = 1) => api(`/posts/user/${userId}?page=${page}`),
  getById: (id) => api(`/posts/${id}`),
  create: (formData) => api('/posts', { method: 'POST', body: formData }),
  update: (id, formData) => api(`/posts/${id}`, { method: 'PUT', body: formData }),
  delete: (id) => api(`/posts/${id}`, { method: 'DELETE' }),
  like: (id) => api(`/posts/${id}/like`, { method: 'POST' }),
};

// ── Comments ─────────────────────────────────
const Comments = {
  getAll: (postId) => api(`/comments/${postId}`),
  add: (postId, text) => api(`/comments/${postId}`, { method: 'POST', body: JSON.stringify({ text }) }),
  delete: (id) => api(`/comments/${id}`, { method: 'DELETE' }),
};

// ── Session helpers ──────────────────────────
const Session = {
  save: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('currentUser', JSON.stringify(user));
  },
  getUser: () => {
    const u = localStorage.getItem('currentUser');
    return u ? JSON.parse(u) : null;
  },
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
  },
  isLoggedIn: () => !!localStorage.getItem('token')
};

// ── Avatar helper ─────────────────────────────
const getAvatar = (user) => {
  if (user?.profilePic) return `http://localhost:5000${user.profilePic}`;
  const name = encodeURIComponent(user?.name || 'User');
  return `https://ui-avatars.com/api/?name=${name}&background=6366f1&color=fff&bold=true&size=128`;
};

// ── Relative time ─────────────────────────────
const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  const intervals = [
    [Math.floor(seconds / 31536000), 'y'],
    [Math.floor(seconds / 2592000), 'mo'],
    [Math.floor(seconds / 86400), 'd'],
    [Math.floor(seconds / 3600), 'h'],
    [Math.floor(seconds / 60), 'm']
  ];
  for (const [val, unit] of intervals) {
    if (val >= 1) return `${val}${unit}`;
  }
  return 'just now';
};

// ── Toast notifications ──────────────────────
const toast = {
  show: (message, type = 'info') => {
    const existing = document.querySelector('.toast');
    if (existing) existing.remove();

    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `
      <span class="toast-icon">${type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(el);

    setTimeout(() => el.classList.add('toast--visible'), 10);
    setTimeout(() => {
      el.classList.remove('toast--visible');
      setTimeout(() => el.remove(), 300);
    }, 3000);
  },
  success: (msg) => toast.show(msg, 'success'),
  error: (msg) => toast.show(msg, 'error'),
  info: (msg) => toast.show(msg, 'info')
};
