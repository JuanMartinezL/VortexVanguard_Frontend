const API_URL = 'https://vortexvanguard-backend.onrender.com/api/auth/login'; 

document.getElementById('Form').addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene el recargado de la página

    // Obtener los valores de los campos
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
        // Enviar los datos al backend
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Guardar el token (o cualquier dato relevante)
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');

            // Redireccionar a la página principal
            window.location.href = '/dashboard/dashboard.html';
        } else {
            // Mostrar error al usuario
            alert(data.message || 'Error al iniciar sesión');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('No se pudo conectar con el servidor');
    }
});
