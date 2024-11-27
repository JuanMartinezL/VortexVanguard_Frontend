document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");

    if (!forgotPasswordForm) {
        console.error("No se encontró el formulario de restablecimiento de contraseña.");
        return;
    }

    forgotPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Obtener el email del input
        const emailInput = document.getElementById("email");
        if (!emailInput) {
            alert("El campo de correo electrónico no se encuentra en el formulario.");
            return;
        }

        const email = emailInput.value.trim();

        if (!email) {
            alert("Por favor, introduce tu correo electrónico.");
            return;
        }

        try {
            // Mostrar mensaje de carga
            forgotPasswordForm.querySelector("button[type='submit']").disabled = true;
            alert("Enviando solicitud, por favor espera...");

            // Enviar solicitud de restablecimiento al backend
            const response = await fetch("https://vortexvanguard-backend.onrender.com/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();

            if (response.ok) {
                // Solicitud de restablecimiento exitosa
                alert("Correo de restablecimiento enviado. Por favor, revisa tu bandeja de entrada.");
                forgotPasswordForm.reset();
            } else {
                // Mostrar error recibido desde el backend
                alert(result.message || "Error al solicitar el restablecimiento de contraseña.");
            }
        } catch (error) {
            console.error("Error al enviar la solicitud:", error);
            alert("Error al conectar con el servidor. Inténtalo más tarde.");
        } finally {
            // Habilitar el botón después de completar la solicitud
            forgotPasswordForm.querySelector("button[type='submit']").disabled = false;
        }
    });
});
