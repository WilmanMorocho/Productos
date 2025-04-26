// Elementos del DOM
const productForm = document.getElementById('product-form');
const productsList = document.getElementById('products-list');
const productIdInput = document.getElementById('product-id');
const nameInput = document.getElementById('name');
const descriptionInput = document.getElementById('description');
const priceInput = document.getElementById('price');
const stockInput = document.getElementById('stock');
const cancelBtn = document.getElementById('cancel-btn');

// Cargar productos al iniciar la página
document.addEventListener('DOMContentLoaded', loadProducts);

// Event listeners
productForm.addEventListener('submit', saveProduct);
cancelBtn.addEventListener('click', resetForm);

// Cargar productos desde la API
async function loadProducts() {
    const products = await ProductService.getProducts();
    displayProducts(products);
}

// Mostrar productos en la tabla
function displayProducts(products) {
    productsList.innerHTML = '';
    
    if (products.length === 0) {
        productsList.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay productos registrados</td></tr>';
        return;
    }
    
    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.name}</td>
            <td>${product.description}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>
                <button class="action-btn edit-btn" data-id="${product._id}">Editar</button>
                <button class="action-btn delete-btn" data-id="${product._id}">Eliminar</button>
            </td>
        `;
        
        // Agregar event listeners a los botones
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        editBtn.addEventListener('click', () => editProduct(product._id));
        deleteBtn.addEventListener('click', () => deleteProduct(product._id));
        
        productsList.appendChild(row);
    });
}

// Guardar o actualizar un producto
async function saveProduct(e) {
    e.preventDefault();
    
    const product = {
        name: nameInput.value,
        description: descriptionInput.value,
        price: parseFloat(priceInput.value),
        stock: parseInt(stockInput.value)
    };
    
    let result;
    
    if (productIdInput.value) {
        // Actualizar producto existente
        result = await ProductService.updateProduct(productIdInput.value, product);
    } else {
        // Crear nuevo producto
        result = await ProductService.createProduct(product);
    }
    
    if (result) {
        resetForm();
        loadProducts();
    }
}

// Editar un producto
async function editProduct(id) {
    const product = await ProductService.getProduct(id);
    
    if (product) {
        productIdInput.value = product._id;
        nameInput.value = product.name;
        descriptionInput.value = product.description;
        priceInput.value = product.price;
        stockInput.value = product.stock;
        
        cancelBtn.style.display = 'inline-block';
        document.querySelector('button[type="submit"]').textContent = 'Actualizar';
    }
}

// Eliminar un producto
async function deleteProduct(id) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        const result = await ProductService.deleteProduct(id);
        
        if (result) {
            loadProducts();
        }
    }
}

// Resetear el formulario
function resetForm() {
    productForm.reset();
    productIdInput.value = '';
    cancelBtn.style.display = 'none';
    document.querySelector('button[type="submit"]').textContent = 'Guardar';
}