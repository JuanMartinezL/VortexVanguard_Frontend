document.addEventListener("DOMContentLoaded", () => {
    const resetPasswordForm = document.getElementById("resetPasswordForm");

    resetPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtener los valores de los inputs
        const password = document.getElementById("password").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        // Validar contraseñas
        if (!password || !confirmPassword) {
            alert("Por favor, completa ambos campos de contraseña.");
            return;
        }

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }

        // Validar longitud mínima de la contraseña
        if (password.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }

        // Obtener el token de la URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");

        if (!token) {
            alert("Token no válido o ha expirado.");
            return;
        }

        try {
            // Enviar solicitud de restablecimiento al backend
            const response = await fetch(`https://vortexvanguard-backend.onrender.com/api/auth/reset-password/${token}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const result = await response.json();

            if (response.ok) {
                // Restablecimiento exitoso
                alert("Contraseña restablecida con éxito. Ahora puedes iniciar sesión con tu nueva contraseña.");
                window.location.href = "/users/inicioSesion.html"; // Redirigir al inicio de sesión
            } else {
                // Mostrar mensaje de error desde el backend
                alert(result.message || "Error al restablecer la contraseña.");
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Error al conectar con el servidor. Inténtalo más tarde.");
        }
    });
});
