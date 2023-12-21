function logout() {
    try {
        sessionStorage.clear();
        // Тук можете да добавите логика за изчистване на потребителските данни от сесията или локалното съхранение

        alert('Logout successful!');
        // Пренасочване към страницата за вход
        window.location.href = 'login.html';
    } catch (error) {
        // Обработка на възможни грешки при изхода
        alert('Logout failed: ' + error.message);
    }
}
