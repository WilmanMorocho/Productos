document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    const username = localStorage.getItem('username');
    
    // Cargar datos del usuario
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const currentUser = users.find(u => u.username === username);
    
    if (!currentUser) {
        // Manejar caso donde no se encuentra el usuario
        document.getElementById('error-message').textContent = 'Error al cargar datos del usuario';
        return;
    }
    
    // Llenar el formulario con datos del usuario
    document.getElementById('fullname').value = currentUser.fullname || '';
    document.getElementById('email').value = currentUser.email || '';
    document.getElementById('username').value = currentUser.username;
    
    // Manejar envío del formulario
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const fullname = document.getElementById('fullname').value;
        const email = document.getElementById('email').value;
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        const errorMessage = document.getElementById('error-message');
        const profileMessage = document.getElementById('profile-message');
        
        // Validar email (simple)
        if (!email.includes('@')) {
            errorMessage.textContent = 'Correo electrónico inválido';
            return;
        }
        
        // Actualizar información básica
        currentUser.fullname = fullname;
        currentUser.email = email;
        
        // Si el usuario quiere cambiar la contraseña
        if (currentPassword || newPassword || confirmPassword) {
            // Validar la contraseña actual
            if (currentPassword !== currentUser.password) {
                errorMessage.textContent = 'La contraseña actual es incorrecta';
                return;
            }
            
            // Validar que las nuevas contraseñas coincidan
            if (newPassword !== confirmPassword) {
                errorMessage.textContent = 'Las nuevas contraseñas no coinciden';
                return;
            }
            
            // Actualizar contraseña
            currentUser.password = newPassword;
        }
        
        // Actualizar el usuario en localStorage
        const updatedUsers = users.map(u => u.username === username ? currentUser : u);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        // Mostrar mensaje de éxito
        errorMessage.textContent = '';
        profileMessage.textContent = 'Perfil actualizado correctamente';
        profileMessage.style.display = 'block';
        
        // Limpiar campos de contraseña
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
            profileMessage.style.display = 'none';
        }, 3000);
    });
});