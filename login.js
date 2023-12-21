// login.js
document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Предполага се, че сървърът слуша на порт 3000
        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })
        .then(response => {
            if (response.status === 401) {
                throw new Error('Wrong name or password.');
            }
            if (!response.ok) {
                throw new Error('An error occurred: ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            alert('Login successful');
            //sessionStprage
            sessionStorage.setItem('user', email);
            //console.log(sessionStorage.getItem('user'));
            window.location.href = 'homePage.html';
            // Тук може да редиректнете потребителя или да обновите UI
        })
        .catch(error => {
            alert(error.message);
            // Обработка на грешки, например неправилно име или парола
        });
    });
});
