function logout() {
    try {
        sessionStorage.clear();
        alert('Logout successful!');
        window.location.href = 'login.html';
    } catch (error) {
        alert('Logout failed: ' + error.message);
    }
}
