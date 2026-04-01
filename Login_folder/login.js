const API_URL = 'https://jsonplaceholder.typicode.com/posts';
const STORAGE_KEY = 'chingzing_user';

const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const messageBox = document.getElementById('message');
const registerLink = document.querySelector('.register span');

function setMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.style.color = type === 'error' ? '#d53941' : type === 'success' ? '#1c7c1a' : '#555';
}

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch (err) {
    return null;
  }
}

function saveUserLocally(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  console.log('User saved to localStorage:', user);
}

function saveUserToApi(user) {
  return fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: user.username,
      password: user.password,
      type: 'login',
      created: new Date().toISOString(),
    }),
  }).then((r) => r.json());
}

function init() {
  const storedUser = getStoredUser();
  if (storedUser) {
    usernameInput.value = storedUser.username;
    setMessage('User loaded from local storage, please login with your password.', 'info');
  }
}

function goToHomePage() {
  const homeUrl = new URL('../Home_Page/home.html', window.location.href).href;
  console.log('Redirecting to home page URL:', homeUrl);
  window.location.href = homeUrl;
}

function showRedirectAnimation() {
  const overlay = document.getElementById('redirect-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
}

function hideRedirectAnimation() {
  const overlay = document.getElementById('redirect-overlay');
  if (!overlay) return;
  overlay.classList.remove('active');
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    setMessage('Please enter both username and password.', 'error');
    return;
  }

  const storedUser = getStoredUser();

  console.log('Login attempt:', { username, hasStoredUser: !!storedUser });

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    setMessage('Login successful! Redirecting...', 'success');
    saveUserLocally({ username, password });
    console.log('Existing user login successful.');
    try {
      await saveUserToApi({ username, password });
      console.log('Logged in request stored via API');
    } catch (err) {
      console.warn('API save failed, but local login succeeded', err);
    }

    showRedirectAnimation();
    setTimeout(goToHomePage, 800);
    return;
  }

  if (storedUser && storedUser.username !== username) {
    setMessage('Username mismatch. If you want to register a new user, click Register Now.', 'error');
    return;
  }

  if (storedUser && storedUser.username === username && storedUser.password !== password) {
    setMessage('Password incorrect for registered user.', 'error');
    return;
  }

  // No user in local storage => register new user
  const newUser = { username, password };
  saveUserLocally(newUser);
  setMessage('Registration successful! Redirecting...', 'success');
  console.log('New user registered, saving and redirecting...');

  try {
    await saveUserToApi(newUser);
    console.log('Registration request saved via API');
  } catch (err) {
    console.warn('Could not save to API, local storage still works', err);
  }

  showRedirectAnimation();

  setTimeout(goToHomePage, 800);
});

registerLink.addEventListener('click', (e) => {
  e.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;
  if (!username || !password) {
    setMessage('Enter username and password first to register.', 'error');
    return;
  }
  saveUserLocally({ username, password });
  setMessage('Registered and saved locally. Please use the same credentials next time.', 'success');
});

window.addEventListener('DOMContentLoaded', () => {
  console.log('Login page loaded');
  init();
});
