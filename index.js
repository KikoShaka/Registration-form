document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.querySelector('.container form');

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Проверка за формат на електронната поща и дължина на паролата
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        let isValid = true;

        // Валидация на електронната поща
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            isValid = false;
        }

        // Валидация на паролата
        if (password.length < 6) {
            alert('Password should be at least 6 characters long.');
            isValid = false;
        }
        
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
            alert('Password should contain at least one uppercase letter and one special character.');
            isValid = false;
        }
        // Изпращане на формуляра, ако валидацията е успешна
        if (isValid) {
            //registrationForm.submit();
            fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                   'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name, password })
            })
            .then(response => {
                if (response.status === 409) {
                    throw new Error('A user with the provided email or name already exists.');
                }
               if (!response.ok) {
                   throw new Error('An error occurred: ' + response.status);
                }
                return response.text();
            })
            .then(data => {
                console.log(data);
                alert('Registration successful!');
                window.location.href = 'homePage.html';
            })
            .catch(error => {
                console.error('Error:', error);
                alert(error.message);
            });
        
        }
    });
    function validateEmail(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
});
