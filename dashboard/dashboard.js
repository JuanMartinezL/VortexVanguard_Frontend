// Definir la URL base de la API (ajusta según tu servidor)
const API_URL = 'https://vortexvanguard-backend.onrender.com/api/cart';

document.addEventListener("DOMContentLoaded", async function () {
    const token = localStorage.getItem('token'); 
    const csrfToken = localStorage.getItem('csrfToken');
    if (!token) {
        console.log('No se encontró el token, redirigiendo al inicio de sesión');
        window.location.href = "/users/inicioSesion.html"; 
        return;
    }

    try {
        // Obtener datos del usuario
        const response = await fetch('https://vortexvanguard-backend.onrender.com/api/auth/profile', { 
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'x-csrf-token': csrfToken
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos del usuario');
        }

        const usuario = await response.json();
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Mostrar barra de usuario
        const userInfo = document.createElement('div');
        userInfo.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            display: flex;
            align-items: center;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            border-radius: 8px;
            gap: 10px;
            font-family: 'Arial', sans-serif;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
        `;

        const userImage = document.createElement('img');
        userImage.src = usuario.fotoPerfil || 'https://via.placeholder.com/50';
        userImage.alt = 'Foto de perfil';
        userImage.style.cssText = 'width: 50px; height: 50px; border-radius: 50%;';

        const userName = document.createElement('span');
        userName.textContent = usuario.name || 'Usuario';
        userName.style.cssText = `font-size: 16px;`;
        userInfo.appendChild(userImage);
        userInfo.appendChild(userName);

        document.body.appendChild(userInfo);

        // Obtener lista de productos
        const productsResponse = await fetch('https://vortexvanguard-backend.onrender.com/api/products/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!productsResponse.ok) {
            throw new Error('Error al obtener los productos');
        }

        const products = await productsResponse.json();
        const productList = document.getElementById('product-list');
        productList.innerHTML = '';

        // Renderizar productos
        products.forEach(product => {
            const imageUrl = product.images[0] || 'https://via.placeholder.com/150';
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');
            productDiv.style.cssText = `
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 10px;
                margin: 10px;
                text-align: center;
                width: 200px;
                background-color: #f9f9f9;
            `;

            productDiv.innerHTML = `
                <img src="${imageUrl}" alt="${product.name}" style="width: 100%; height: auto; border-radius: 8px;">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <strong>$${product.price.toFixed(2)}</strong>
                <button class="add-to-cart-btn" style="padding: 8px 16px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;" data-product-id="${product._id}">Agregar al carrito</button>
            `;

            productList.appendChild(productDiv);
        });

        // Manejar evento "Agregar al carrito"
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', async function () {
                const productId = this.getAttribute('data-product-id');
                const product = products.find(p => p._id === productId);

                try {
                    const response = await fetch(`${API_URL}/add`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        body: JSON.stringify({ productId, quantity: 1 }),
                    });

                    if (!response.ok) {
                        throw new Error('Error al agregar el producto al carrito');
                    }

                    alert(`¡${product?.name || "Producto"} ha sido agregado al carrito!`);
                } catch (error) {
                    console.error('Error al agregar al carrito:', error.message);
                    alert('Hubo un problema al agregar el producto al carrito.');
                }
            });
        });
    } catch (error) {
        console.error('Error:', error.message);
        window.location.href = "/users/inicioSesion.html";
    }
});
