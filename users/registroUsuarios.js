document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('loginForm');
    
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evitar que se recargue la página al enviar el formulario

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Validación básica del formulario
        if (!name || !email || !password) {
            alert("Por favor complete todos los campos.");
            return;
        }

        // Crear el objeto con los datos del formulario
        const userData = {
            name,
            email,
            password,
        };

        // Crear elemento toast
        const toast = document.createElement('div');
        toast.id = 'toast';
        toast.style.cssText = `
            position: fixed;
            top: 100px;
            right: -300px; /* Posición inicial fuera de la pantalla */
            min-width: 250px;
            background-color: #333;
            color: #fff;
            text-align: center;
            border-radius: 5px;
            padding: 16px;
            z-index: 1000;
            font-size: 17px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            transition: transform 0.5s ease, right 0.5s ease;
            transform: translateX(0); /* Mantener en su posición inicial */
        `;
        document.body.appendChild(toast);

        // Función para mostrar el toast con efecto slide
        function showToast(message) {
            toast.textContent = message;

            // Mostrar el toast deslizándolo hacia la izquierda
            toast.style.right = '20px';
            toast.style.transform = 'translateX(0)';

            // Ocultar el toast deslizándolo de nuevo hacia la derecha después de 3 segundos
            setTimeout(() => {
                toast.style.transform = 'translateX(100%)';
                toast.style.right = '-300px';
            }, 3000);
        }

        try {
            // Hacer la solicitud POST al servidor para registrar al usuario
            const response = await fetch("https://vortexvanguard-backend.onrender.com/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userData), // Enviar los datos del formulario
            });

            const data = await response.json();

            if (response.ok) {
                // Si la respuesta es exitosa, mostrar el token o mensaje
                console.log("Usuario registrado con éxito:", data);
                showToast(`¡Cuenta creada con éxito! Redirigiendo al inicio de sesión.`);
                
                // Asegurar que el toast termine antes de redirigir
                setTimeout(() => {
                    window.location.href = "/users/inicioSesion.html"; // Redirigir al login
                }, 3000); // Redirigir después de 3 segundos (cuando el toast se haya ocultado)
            } else {
                // Si la respuesta tiene un error, mostrar el mensaje
                console.error("Error en el registro:", data.message);
                alert(data.message || "Hubo un error al registrar el usuario.");
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            showToast(`Error en el servidor.`);
        }
    });
});
