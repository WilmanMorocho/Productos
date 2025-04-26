// Configuración de la API
const API_URL = 'http://localhost:5000/api/products';

// Clase para manejar las operaciones con productos
class ProductService {
    // Obtener todos los productos
    static async getProducts() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Error al obtener productos');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    }

    // Obtener un producto por ID
    static async getProduct(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`);
            if (!response.ok) {
                throw new Error('Error al obtener producto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // Crear un nuevo producto
    static async createProduct(product) {
        try {
            const product = await Product.create(req.body);
              
            // También guardar en localStorage para acceso sin conexión
            const products = JSON.parse(localStorage.getItem('products') || '[]');
            products.push(product);
            localStorage.setItem('products', JSON.stringify(products));
            
            res.status(201).json(product);
        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }

    // Actualizar un producto
    static async updateProduct(id, product) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(product)
            });
            if (!response.ok) {
                throw new Error('Error al actualizar producto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // Eliminar un producto
    static async deleteProduct(id) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Error al eliminar producto');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }
}