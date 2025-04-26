document.addEventListener('DOMContentLoaded', function() {
    // Verificar que el usuario sea admin
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar usuarios
    loadUsers();
    
    function loadUsers() {
        const usersList = document.getElementById('users-list');
        const noUsersMessage = document.getElementById('no-users-message');
        
        // Obtener usuarios del localStorage
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Añadir usuario admin si no está en la lista
        if (!users.some(u => u.username === 'admin')) {
            users.unshift({
                fullname: 'Administrador',
                username: 'admin',
                email: 'admin@cafearoma.com',
                role: 'admin'
            });
        }
        
        if (users.length === 0) {
            usersList.innerHTML = '';
            noUsersMessage.style.display = 'block';
            return;
        }
        
        noUsersMessage.style.display = 'none';
        usersList.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            
            // El administrador principal no se puede eliminar
            const isMainAdmin = user.username === 'admin';
            
            row.innerHTML = `
                <td>${user.fullname || '-'}</td>
                <td>${user.username}</td>
                <td>${user.email || '-'}</td>
                <td>${user.role}</td>
                <td>
                    ${isMainAdmin ? 
                      '<span class="disabled-btn">No eliminable</span>' : 
                      '<button class="action-btn delete-btn" data-username="' + user.username + '">Eliminar</button>'}
                </td>
            `;
            
            usersList.appendChild(row);
        });
        
        // Añadir eventos a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const username = this.getAttribute('data-username');
                deleteUser(username);
            });
        });
    }
    
    function deleteUser(username) {
        if (confirm(`¿Estás seguro de eliminar al usuario "${username}"?`)) {
            // Obtener usuarios del localStorage
            let users = JSON.parse(localStorage.getItem('users') || '[]');
            
            // Filtrar el usuario a eliminar
            users = users.filter(user => user.username !== username);
            
            // Guardar los usuarios actualizados
            localStorage.setItem('users', JSON.stringify(users));
            
            // Recargar la lista
            loadUsers();
        }
    }
});