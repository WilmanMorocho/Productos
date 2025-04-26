document.addEventListener('DOMContentLoaded', function() {
    // Verificar autenticación
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = 'login.html';
        return;
    }
    
    const username = localStorage.getItem('username');
    
    // Mostrar mensaje de "sin historial" por ahora
    document.getElementById('purchase-history').style.display = 'none';
    document.getElementById('no-history-message').style.display = 'block';
    
    // Simulación: Historial de compras de ejemplo
    /*
    const mockHistory = [
        { id: '10001', date: '2023-03-10', total: 42.75, items: 4, status: 'Entregado' },
        { id: '10002', date: '2023-02-22', total: 18.50, items: 2, status: 'Entregado' }
    ];
    
    if (mockHistory.length > 0) {
        const historyHTML = mockHistory.map(purchase => `
            <div class="history-card">
                <div class="history-header">
                    <h3>Compra #${purchase.id}</h3>
                    <span class="history-date">${purchase.date}</span>
                </div>
                <div class="history-details">
                    <p>Productos: ${purchase.items}</p>
                    <p>Total: $${purchase.total.toFixed(2)}</p>
                    <p>Estado: ${purchase.status}</p>
                </div>
                <a href="#" class="client-btn">Ver Detalles</a>
            </div>
        `).join('');
        
        document.getElementById('purchase-history').innerHTML = historyHTML;
        document.getElementById('purchase-history').style.display = 'block';
        document.getElementById('no-history-message').style.display = 'none';
    }
    */
});