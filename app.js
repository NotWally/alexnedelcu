document.addEventListener("DOMContentLoaded", function () {
    const languageBtn = document.getElementById("language-btn");

    // Object containing translations for all text elements
    const translations = {
        en: {
            contact: "Contact",
            skills: "Skills",
            experience: "Experience",
            applications: "Applications",
            notice: "Click on each card to go to the app!",
            password_generator: "P@ssw*rd Gen3rat0r",
            api_system: "API Authentication System",
            xando: "Naughts & Crosses",
            location: "London, England",
            work_experience: "Work Experience",
            description: `I'm a <span class="highlight">full-stack</span> software 
                engineer who designs and builds applications that are intuitive to use. 
                I focus on writing clean and maintainable code, ensuring everything 
                remains efficient under the hood. My goal is to create systems that run 
                smoothly from start to finish.`,
            visa_experience: `Built secure tokenization solutions using 
                <span class="highlight">Java</span>, 
                <span class="highlight">Spring Boot</span>, and 
                <span class="highlight">microservices</span>. 
                Ensured security compliance, optimized performance, 
                and deployed on <span class="highlight">AWS</span>, 
                enhancing payment security at Visa.`,
            renaissance_experience: `Delivered <span class="highlight">proactive</span> 
                technical support, troubleshot IT issues, and 
                <span class="highlight">streamlined user management</span>, 
                driving <span class="highlight">operational efficiency</span>.`,
            app1_description: `The P@ssw*rd Gen3rat0r is a sleek and powerful web application 
                designed to help users create strong and secure passwords effortlessly. 
                Built with a focus on simplicity and security, this app generates passwords 
                locally within the user's browser, ensuring that sensitive data never 
                leaves their device.`,
            app2_description: `This is a secure, fully-featured authentication system 
                with registration, login, password reset, and OAuth support. 
                Built with <span class="highlight">Node.js</span>, 
                <span class="highlight">Express.js</span>, and a 
                <span class="highlight">MongoDB</span> backend, 
                it ensures seamless user authentication and security.`,
            app3_description: `A fun and interactive Tic-Tac-Toe game 
                built with <span class="highlight">HTML</span>, <span class="highlight">css</span>, and <span class="highlight">Javascript</span>. 
                This game features a responsive design, 
                local score tracking, and a smooth user experience. 
                Implemented with a dynamic board, 
                turn-based gameplay, and victory detection logic. 
                Includes a light/dark theme switch and 
                stylish alerts using SweetAlert.`,
        },
        es: {
            skills: "Habilidades",
            experience: "Experiencia",
            applications: "Aplicaciones",
            notice: "¡Haz clic en cada tarjeta para ir a la aplicación!",
            password_generator: "Generador de Contraseñas",
            api_system: "Sistema de Autenticación API",
            xando: "Tres en Raya",
            location: "Londres, Inglaterra",
            work_experience: "Experiencia Laboral",
            description: `Soy un <span class="highlight">desarrollador full-stack</span> 
                que diseña y construye aplicaciones intuitivas. 
                Me enfoco en escribir código limpio y mantenible, 
                asegurando que todo funcione de manera eficiente en segundo plano. 
                Mi objetivo es crear sistemas que operen sin problemas de principio a fin.`,
            visa_experience: `Desarrollé soluciones de tokenización seguras utilizando 
                <span class="highlight">Java</span>, 
                <span class="highlight">Spring Boot</span> y 
                <span class="highlight">microservicios</span>. 
                Aseguré el cumplimiento de seguridad, optimicé el rendimiento 
                y realicé implementaciones en <span class="highlight">AWS</span>, 
                mejorando la seguridad de pagos en Visa.`,
            renaissance_experience: `Brindé soporte técnico 
                <span class="highlight">proactivo</span>, resolví problemas de TI y 
                <span class="highlight">optimicé la gestión de usuarios</span>, 
                impulsando la <span class="highlight">eficiencia operativa</span>.`,
            app1_description: `El Generador de Contraseñas es una aplicación web potente y elegante 
                diseñada para ayudar a los usuarios a crear contraseñas seguras de manera sencilla. 
                Desarrollada con un enfoque en la simplicidad y seguridad, esta aplicación genera 
                contraseñas localmente en el navegador del usuario, garantizando que los datos 
                sensibles nunca salgan de su dispositivo.`,
            app2_description: `Este es un sistema de autenticación seguro y completo, 
                con funciones de registro, inicio de sesión, restablecimiento de contraseña 
                y soporte para OAuth. 
                Construido con <span class="highlight">Node.js</span>, 
                <span class="highlight">Express.js</span> y un backend en 
                <span class="highlight">MongoDB</span>, 
                garantiza una autenticación de usuario fluida y segura.`,
            app3_description: `Un divertido e interactivo juego de Tres en Raya 
                desarrollado con <span class="highlight">HTML</span>, <span class="highlight">css</span>, y <span class="highlight">Javascript</span>. 
                Este juego cuenta con un diseño responsivo, 
                seguimiento de puntuación local y una 
                experiencia de usuario fluida. 
                Implementado con un tablero dinámico, 
                jugabilidad por turnos y lógica de detección de victorias. 
                Incluye un cambio de tema claro/oscuro y 
                alertas estilizadas con SweetAlert.`,
        },
        ro: {
            skills: "Competențe",
            experience: "Experiență",
            applications: "Aplicații",
            notice: "Fă clic pe fiecare card pentru a accesa aplicația!",
            password_generator: "Generator de Parole",
            api_system: "Sistem de Autentificare API",
            xando: "X și 0",
            location: "Londra, Anglia",
            work_experience: "Experiență Profesională",
            description: `Sunt un <span class="highlight">dezvoltator full-stack</span> 
                care proiectează și construiește aplicații intuitive. 
                Mă concentrez pe scrierea unui cod curat și ușor de întreținut, 
                asigurându-mă că totul funcționează eficient în fundal. 
                Obiectivul meu este să creez sisteme care rulează fluent 
                de la început până la sfârșit.`,
            visa_experience: `Am dezvoltat soluții sigure de tokenizare folosind 
                <span class="highlight">Java</span>, 
                <span class="highlight">Spring Boot</span> și 
                <span class="highlight">microservicii</span>. 
                Am asigurat conformitatea cu standardele de securitate, am optimizat performanța 
                și am implementat pe <span class="highlight">AWS</span>, 
                îmbunătățind securitatea plăților la Visa.`,
            renaissance_experience: `Am oferit suport tehnic 
                <span class="highlight">proactiv</span>, am rezolvat probleme IT și 
                am <span class="highlight">optimizat gestionarea utilizatorilor</span>, 
                îmbunătățind <span class="highlight">eficiența operațională</span>.`,
            app1_description: `Generatorul de Parole este o aplicație web elegantă și puternică, 
                concepută pentru a ajuta utilizatorii să creeze parole sigure cu ușurință. 
                Dezvoltată cu accent pe simplitate și securitate, această aplicație generează parole 
                local în browserul utilizatorului, garantând că datele sensibile 
                nu părăsesc niciodată dispozitivul.`,
            app2_description: `Acesta este un sistem de autentificare complet și securizat, 
                care include înregistrare, autentificare, resetare a parolei și suport pentru OAuth. 
                Construit cu <span class="highlight">Node.js</span>, 
                <span class="highlight">Express.js</span> și un backend 
                <span class="highlight">MongoDB</span>, 
                asigură o autentificare fluentă și sigură a utilizatorilor.`,
            app3_description: `Un joc distractiv și interactiv de X și 0 
                construit cu <span class="highlight">HTML</span>, <span class="highlight">css</span>, și <span class="highlight">Javascript</span>. 
                Acest joc oferă un design responsiv, 
                urmărirea scorului local și o 
                experiență de utilizare fluidă. 
                Implementat cu un tablou dinamic, 
                mecanism de joc pe ture și 
                logică de detectare a victoriei. 
                Include un comutator de temă deschis/întunecat și 
                alerte stilizate cu SweetAlert.`,
        },
    };

    let currentLang = "en"; // Default language

    function switchLanguage() {
        // Rotate between English → Spanish → Romanian
        currentLang =
            currentLang === "en" ? "es" : currentLang === "es" ? "ro" : "en";

        // Update profile section
        document.querySelector(
            ".location"
        ).innerHTML = `<i class="fa-solid fa-location-dot"></i> ${translations[currentLang].location}`;
        document.querySelector(".profile-card .description").innerHTML =
            translations[currentLang].description;

        // Update experience section
        document.querySelector(".experience h2").textContent =
            translations[currentLang].experience;
        document.querySelectorAll(".company .duration").forEach((element) => {
            element.textContent = translations[currentLang].work_experience;
        });

        document.querySelectorAll(
            ".experience-card .experience-description"
        )[0].innerHTML = translations[currentLang].visa_experience;
        document.querySelectorAll(
            ".experience-card .experience-description"
        )[1].innerHTML = translations[currentLang].renaissance_experience;

        // Update applications section
        document.querySelector(".notice").textContent =
            translations[currentLang].notice;
        document.querySelectorAll(".app-card h3")[0].textContent =
            translations[currentLang].password_generator;
        document.querySelectorAll(".app-card h3")[1].textContent =
            translations[currentLang].api_system;
        document.querySelectorAll(".app-card p.app-description")[0].innerHTML =
            translations[currentLang].app1_description;
        document.querySelectorAll(".app-card p.app-description")[1].innerHTML =
            translations[currentLang].app2_description;
        document.querySelectorAll(".app-card p.app-description")[2].innerHTML =
            translations[currentLang].app3_description;
    }

    languageBtn.addEventListener("click", switchLanguage);

    document
        .getElementById("copyEmail")
        .addEventListener("click", function (event) {
            event.preventDefault();

            const email = this.getAttribute("data-email");

            navigator.clipboard
                .writeText(email)
                .then(() => {
                    Swal.fire({
                        title: "E-mail copied!",
                        text: "You can now paste it anywhere.",
                        icon: "success",
                        confirmButtonText: "OK",
                        customClass: {
                            popup: "custom-swal-popup",
                            title: "custom-swal-title",
                            confirmButton: "custom-swal-button",
                        },
                    });
                })
                .catch(() => {
                    Swal.fire({
                        title: "Oops!",
                        text: "Failed to copy email.",
                        icon: "error",
                        confirmButtonText: "Try Again",
                        customClass: {
                            popup: "custom-swal-popup",
                            title: "custom-swal-title",
                            confirmButton: "custom-swal-button",
                        },
                    });
                });
        });
});
