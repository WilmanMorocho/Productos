document.addEventListener('DOMContentLoaded', function() {
    // Mostrar el nombre del cliente en el panel
    const clientName = document.getElementById('client-name');
    if (clientName) {
        const username = localStorage.getItem('username');
        clientName.textContent = username || 'Cliente';
    }
    
    // Manejar la eliminación de cuenta
    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', function() {
            if (confirm('¿Estás seguro de eliminar tu cuenta? Esta acción no se puede deshacer.')) {
                const username = localStorage.getItem('username');
                
                // Obtener usuarios
                let users = JSON.parse(localStorage.getItem('users') || '[]');
                
                // Filtrar para eliminar la cuenta actual
                users = users.filter(user => user.username !== username);
                
                // Guardar usuarios actualizados
                localStorage.setItem('users', JSON.stringify(users));
                
                // Cerrar sesión
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userRole');
                localStorage.removeItem('username');
                
                alert('Tu cuenta ha sido eliminada.');
                window.location.href = 'home.html';
            }
        });
    }
});