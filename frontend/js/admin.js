document.addEventListener('DOMContentLoaded', function() {
    // Modal para crear nuevo administrador
    const modal = document.getElementById('admin-modal');
    const newAdminBtn = document.getElementById('new-admin-btn');
    const closeBtn = document.getElementsByClassName('close')[0];
    const newAdminForm = document.getElementById('new-admin-form');
    
    // Abrir modal
    if (newAdminBtn) {
        newAdminBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
    }
    
    // Cerrar modal con X
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    // Formulario para crear nuevo admin
    if (newAdminForm) {
        newAdminForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('new-username').value;
            const password = document.getElementById('new-password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorEl = document.getElementById('admin-error');
            
            if (password !== confirmPassword) {
                errorEl.textContent = 'Las contraseñas no coinciden';
                return;
            }
            
            // En un sistema real, enviaríamos esto al backend
            // Por ahora, solo mostramos un mensaje de éxito
            alert(`Administrador ${username} creado con éxito`);
            modal.style.display = 'none';
            newAdminForm.reset();
        });
    }
});