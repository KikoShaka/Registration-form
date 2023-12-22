document.addEventListener('DOMContentLoaded', function () {
    const registrationForm = document.querySelector('.container form');

    registrationForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Check the format of the email and the length of the password
        const email = document.getElementById('email').value;
        const name = document.getElementById('name').value;
        const password = document.getElementById('password').value;
        let isValid = true;

        // Validate the email
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            isValid = false;
        }

        // Validate the password
        if (password.length < 6) {
            alert('Password should be at least 6 characters long.');
            isValid = false;
        }
        
        if (!/(?=.*[A-Z])(?=.*[!@#$%^&*])/.test(password)) {
            alert('Password should contain at least one uppercase letter and one special character.');
            isValid = false;
        }
        // Submit the form if validation is successful
        if (isValid) {
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
