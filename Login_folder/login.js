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

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  if (!username || !password) {
    setMessage('Please enter both username and password.', 'error');
    return;
  }

  const storedUser = getStoredUser();

  if (storedUser && storedUser.username === username && storedUser.password === password) {
    setMessage('Login successful! Redirecting...', 'success');
    try {
      await saveUserToApi({ username, password });
      console.log('Logged in request stored via API');
    } catch (err) {
      console.warn('API save failed, but local login succeeded', err);
    }
    // Redirect to home page after 1 second
    setTimeout(() => {
      window.location.href = '../Home_Page/home.html';
    }, 1000);
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

  try {
    await saveUserToApi(newUser);
    console.log('Registration request saved via API');
  } catch (err) {
    console.warn('Could not save to API, local storage still works', err);
  }
  
  // Redirect to home page after 1 second
  setTimeout(() => {
    window.location.href = '../Home_Page/home.html';
  }, 1000);
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

init();
