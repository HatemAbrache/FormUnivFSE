document.addEventListener('DOMContentLoaded', function () {
    emailjs.init("SlDrDa8BAVH89J26e");
    console.log("EmailJS initialisé");
    
    const loadingScreen = document.getElementById('loadingScreen');
    loadingScreen.classList.remove('active');
    console.log('Spinner masqué au démarrage');

    const menuToggle = document.querySelector('.menu-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');

    menuToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden'); // Basculer l'affichage du menu
    });

    document.getElementById('contactForm').addEventListener('submit', function (e) {
        e.preventDefault();

        console.log('Formulaire soumis, récupération des données...');
        const topic = document.getElementById('topic').value.trim();
        const firstname = document.getElementById('firstname').value.trim();
        const lastname = document.getElementById('lastname').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        console.log('Données récupérées :', { topic, firstname, lastname, email, message });

        if (!topic || !firstname || !lastname || !email || !message) {
            alert("Veuillez remplir tous les champs avant de soumettre.");
            console.log('Échec : tous les champs ne sont pas remplis.');
            return;
        }

        const recaptchaResponse = grecaptcha.getResponse();
        if (!recaptchaResponse) {
            alert("Veuillez vérifier le reCAPTCHA.");
            console.log('Échec : reCAPTCHA non validé.');
            return;
        }

        console.log('Tous les champs sont remplis. Préparation de l\'envoi...');
        loadingScreen.classList.add('active');
        console.log('Spinner affiché');

        emailjs.send("service_clzqwmb", "template_s7d6ueh", {
            from_name: `${firstname} ${lastname}`,
            topic: topic,
            reply_to: email,
            message: message,
            "g-recaptcha-response": recaptchaResponse,
        }).then(
            function (response) {
                loadingScreen.classList.remove('active');
                console.log('E-mail envoyé avec succès :', response);

                const confirmationMessage = document.getElementById('confirmationMessage');
                confirmationMessage.textContent = 'Votre proposition a bien été soumise. Merci ^^ !';
                confirmationMessage.classList.remove('hidden');
                document.getElementById('contactForm').reset();
                grecaptcha.reset();
            },
            function (error) {
                loadingScreen.classList.remove('active');
                console.error('Erreur lors de l’envoi :', error);
                alert("Une erreur est survenue. Veuillez réessayer.");
            }
        );
    });
});
