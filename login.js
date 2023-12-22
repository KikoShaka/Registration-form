document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

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
            sessionStorage.setItem('user', email);
            window.location.href = 'homePage.html';
        })
        .catch(error => {
            alert(error.message);
        });
    });
});
