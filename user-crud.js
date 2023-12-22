document.addEventListener('DOMContentLoaded', function () {
    const userForm = document.getElementById('userForm');
    const usersTableBody = document.getElementById('usersTable').querySelector('tbody');

    // load users
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
            updateUserData(userId, userData);
        } else {
            createNewUser(userData);
        }
    });

    function fetchUsers() {
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                data.forEach(user => addUserRow(user));
            })
            .catch(error => console.error('Error:', error));
    }

    function createNewUser(userData) {
        // send data to server to create mew user
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
        //send data to server to update
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.text())
        .then(() => {
            fetchUsers();
        })
        .catch(error => console.error('Error:', error));
    }

    function deleteUser(userId) {
        fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => response.text())
        .then(() => {
            fetchUsers();
        })
        .catch(error => console.error('Error:', error));
        
    }
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
