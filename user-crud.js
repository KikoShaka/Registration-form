document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('userForm');
    const usersTableBody = document.getElementById('usersTable').querySelector('tbody');

    // Зареждане на потребителите при стартиране
    fetchUsers();

    userForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const userId = document.getElementById('userId').value;
        const userName = document.getElementById('userName').value;
        const userEmail = document.getElementById('userEmail').value;

        const userData = {
            name: userName,
            email: userEmail
        };

        if (userId) {
            // Обновяване на потребител
            updateUserData(userId, userData);
        } else {
            // Създаване на нов потребител
            createNewUser(userData);
        }
    });

    function fetchUsers() {
        // TODO: Извикване на сървъра за получаване на потребителите
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                data.forEach(user => addUserRow(user));
            })
            .catch(error => console.error('Error:', error));
    }

    function createNewUser(userData) {
        // TODO: Изпращане на данни до сървъра за създаване на нов потребител
        fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.text())
        .then(() => {
            addUserRow(userData);
            userForm.reset();
        })
        .catch(error => console.error('Error:', error));
    }

    function updateUserData(userId, userData) {
        // TODO: Изпращане на данни до сървъра за обновяване на потребител
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.text())
        .then(() => {
            // Обновяване на потребителя в таблицата или презареждане на потребителите
            fetchUsers();
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteUser(userId) {
        // TODO: Изпращане на заявка за изтриване на потребител
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => response.text())
        .then(() => {
            // Премахване на потребителя от таблицата или презареждане на потребителите
            fetchUsers();
        })
        .catch(error => console.error('Error:', error));
        
    }

    // Функции за визуализация на потребителите в таблицата
    function addUserRow(userData) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${userData.name}</td>
            <td>${userData.email}</td>
            <td>
                <button onclick="editUser('${userData.id}')">Edit</button>
                <button onclick="deleteUser('${userData.id}')">Delete</button>
            </td>
        `;
        usersTableBody.appendChild(row);
    }

    window.editUser = function(userId) {
        // TODO: Зареждане на данните на потребител във формата за редактиране
        fetch(`http://localhost:3000/users/${userId}`)
            .then(response => response.json())
            .then(userData => {
                document.getElementById('userId').value = userData.id;
                document.getElementById('userName').value = userData.name;
                document.getElementById('userEmail').value = userData.email;
            })
            .catch(error => console.error('Error:', error));
        
    }
});