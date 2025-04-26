// Verificar si el usuario ya está autenticado
document.addEventListener('DOMContentLoaded', function() {
    // Manejo de la visualización de botones de autenticación en home.html
    const authButtons = document.querySelector('.auth-buttons');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('userRole');
    
    if (authButtons && isLoggedIn) {
        // Usuario logueado, mostrar nombre y botón de dashboard
        authButtons.innerHTML = `
            <span class="user-welcome">Hola, ${localStorage.getItem('username') || 'Usuario'}</span>
            <a href="${userRole === 'admin' ? 'admin.html' : 'cliente.html'}" class="auth-btn login">Mi Cuenta</a>
            <a href="#" id="nav-logout" class="auth-btn register">Cerrar Sesión</a>
        `;
        
        // Agregar evento al botón de logout en la navegación
        document.getElementById('nav-logout')?.addEventListener('click', function(e) {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            window.location.href = 'home.html';
        });
    }
    
    // Si estamos en una página protegida (admin.html o cliente.html)
    const isProtectedPage = window.location.href.includes('admin.html') || 
                           window.location.href.includes('cliente.html');
    
    if (isProtectedPage) {
        if (!isLoggedIn) {
            // No está logueado, redirigir a login
            window.location.href = 'login.html';
        } else if (window.location.href.includes('admin.html') && userRole !== 'admin') {
            // No es admin, redirigir a la página de cliente
            window.location.href = 'cliente.html';
        }
    }
    
    // Si estamos en la página de login y ya está autenticado, redirigir según rol
    if (window.location.href.includes('login.html')) {
        if (isLoggedIn) {
            window.location.href = userRole === 'admin' ? 'admin.html' : 'cliente.html';
        }
    }
    
    // Si hay un botón de logout, añadir evento
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            window.location.href = 'home.html';
        });
    }
    
    // Formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Verificación de usuarios hardcodeados primero
            if (username === 'admin' && password === 'admin') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', 'admin');
                localStorage.setItem('username', username);
                window.location.href = 'admin.html';
                return;
            }
            
            // Verificar en usuarios registrados (simulación)
            const registeredUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const user = registeredUsers.find(u => u.username === username && u.password === password);
            
            if (user) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userRole', user.role);
                localStorage.setItem('username', user.username);
                window.location.href = user.role === 'admin' ? 'admin.html' : 'cliente.html';
            } else {
                errorMessage.textContent = 'Usuario o contraseña incorrectos';
            }
        });
    }
    
    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('email').value;
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm-password').value;
            const errorMessage = document.getElementById('error-message');
            
            // Validaciones básicas
            if (password !== confirmPassword) {
                errorMessage.textContent = 'Las contraseñas no coinciden';
                return;
            }
            
            // Verificar si el usuario ya existe
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            if (existingUsers.some(u => u.username === username)) {
                errorMessage.textContent = 'Este nombre de usuario ya existe';
                return;
            }
            
            if (existingUsers.some(u => u.email === email)) {
                errorMessage.textContent = 'Este correo electrónico ya está registrado';
                return;
            }
            
            // Crear nuevo usuario
            const newUser = {
                fullname,
                email,
                username,
                password,
                role: 'cliente'  // Todo nuevo registro es cliente
            };
            
            // Guardar en "base de datos" local
            existingUsers.push(newUser);
            localStorage.setItem('users', JSON.stringify(existingUsers));
            
            // Iniciar sesión automáticamente
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', 'cliente');
            localStorage.setItem('username', username);
            
            alert('¡Registro exitoso! Bienvenido a Café Aroma.');
            window.location.href = 'cliente.html';
        });
    }
});