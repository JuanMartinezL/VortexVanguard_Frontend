// API URL (ajusta a tu servidor)
const API_URL = 'https://vortexvanguard-backend.onrender.com/api/cart';

// Cargar carrito al cargar la página
window.addEventListener('load', loadCart);

async function loadCart() {
    const token = localStorage.getItem('token'); // Obtener el token almacenado
    if (!token) {
        console.error('No se encontró un token. Asegúrate de estar autenticado.');
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`, // Añadir el token al header
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error(`Error al cargar el carrito. Código de estado: ${response.status}`);
            return;
        }

        const cart = await response.json();
        console.log(cart);

        renderCart(cart);
    } catch (error) {
        console.error('Error al cargar el carrito:', error);
    }
}

function renderCart(cart) {
    const cartContainer = document.querySelector('.cart-container');
    const cartTotal = document.querySelector('.cart-total p');
    let total = 0;

    cartContainer.innerHTML = ''; // Limpia contenido previo

    if (!cart || !cart.products || cart.products.length === 0) {
       // cartContainer.innerHTML = <p>'El carrito está vacío.'</p>;
        cartTotal.textContent = 'Total: $0.00';
        return;
    }

    cart.products.forEach(item => {
        const { product, quantity } = item;

        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');

        itemElement.innerHTML = `
            <img src="${product.image || ''}" alt="${product.name}">
            <div class="cart-item-details">
                <h3>${product.name}</h3>
                <p>${product._id}</p>
                <p>${product.description || 'Sin descripción disponible'}</p>
                <p>Precio: $${product.price.toFixed(2)}</p>
                <div class="cart-item-actions">
                    <button onclick="updateQuantity('${product._id}', -1)">-</button>
                    <span>${quantity}</span>
                    <button onclick="updateQuantity('${product._id}', 1)">+</button>
                    <button onclick="removeItem('${product._id}')">Eliminar</button>
                </div>
            </div>
        `;

        cartContainer.appendChild(itemElement);
        total += product.price * quantity;
    });

    cartTotal.textContent = `Total: $${total.toFixed(2)}`;
}

// Actualizar cantidad de un producto
async function updateQuantity(itemId, change) {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        await fetch(`${API_URL}/update/${itemId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ change }),
        });
        loadCart();
    } catch (error) {
        console.error('Error al actualizar la cantidad:', error);
    }
}

// Eliminar producto del carrito
async function removeItem(productId) {
    try {
        const response = await fetch(`${API_URL}/remove`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ productId })
        });

        if (!response.ok) {
            throw new Error('Error al eliminar el producto del carrito');
        }

        const updatedCart = await response.json();
        renderCart(updatedCart); // Actualiza la vista del carrito
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
}

// Vaciar carrito
async function clearCart() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        await fetch(`${API_URL}/clear`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        loadCart();
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
    }
}
