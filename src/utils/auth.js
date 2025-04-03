export const handleAuthError = (error, history) => {
  if (error.status === 401) {
    // Store the current path to redirect back after login
    localStorage.setItem('redirectPath', window.location.pathname);
    // Clear the token
    localStorage.removeItem('token');
    // Redirect to login
    history.push('/signin');
  }
};

export const handleSuccessfulLogin = (history) => {
  // Get the stored redirect path
  const redirectPath = localStorage.getItem('redirectPath');
  // Clear the stored path
  localStorage.removeItem('redirectPath');
  // Redirect back to the original page or dashboard
  history.push(redirectPath || '/dashboard');
}; 