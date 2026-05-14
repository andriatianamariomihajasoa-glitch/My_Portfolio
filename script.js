const EMAILJS_CONFIG = {
    PUBLIC_KEY: "jlOlDTt2YefoJ9-ay",
    SERVICE_ID: "service_uq8g7wr",
    TEMPLATE_ID: "template_zd6lolv"
};

// Initialiser EmailJS
emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);

const CV_URL = "./files/CV_Mihajasoa_Mario.pdf";

document.addEventListener('DOMContentLoaded', function() {

    // ========== MODAL CV ==========
    const cvModal = document.getElementById('cvModal');
    const confirmDownload = document.getElementById('confirmDownload');
    const cancelDownload = document.getElementById('cancelDownload');
    const closeModal = document.querySelector('.close-modal');
    const cvBtns = document.querySelectorAll('.cv-btn');

    function openModal() {
        cvModal.classList.add('active');
    }

    function closeModalFunc() {
        cvModal.classList.remove('active');
    }

    function downloadCV() {
        const link = document.createElement('a');
        link.href = CV_URL;
        link.download = 'CV_Mihajasoa_Mario.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        showFormMessage('📄 Téléchargement du CV commencé !', 'success');
        closeModalFunc();
    }

    if (cvBtns.length > 0) {
        cvBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                openModal();
            });
        });
    }

    if (confirmDownload) confirmDownload.addEventListener('click', downloadCV);
    if (cancelDownload) cancelDownload.addEventListener('click', closeModalFunc);
    if (closeModal) closeModal.addEventListener('click', closeModalFunc);

    window.addEventListener('click', function(e) {
        if (e.target === cvModal) closeModalFunc();
    });


    // ========== MENU BURGER ==========
    const burgerBtn = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    const menuOverlay = document.querySelector('.menu-overlay');
    const closeMenuBtn = document.querySelector('.close-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    if (burgerBtn && mobileMenu && menuOverlay) {
        function openMenu() {
            mobileMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeMenu() {
            mobileMenu.classList.remove('active');
            menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        burgerBtn.addEventListener('click', openMenu);

        if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);

        menuOverlay.addEventListener('click', closeMenu);

        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    closeMenu();
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth' });
                    }, 300);
                }
            });
        });
    }


    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('nav a, .contact-btn, .footer a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) target.scrollIntoView({ behavior: 'smooth' });
            } else if (this.classList.contains('contact-btn')) {
                e.preventDefault();
                const contactSection = document.querySelector('#contact');
                if (contactSection) contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });


    // ========== FORMULAIRE CONTACT ==========
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const nom = document.getElementById('nom').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Validation
            if (!nom || !email || !message) {
                showFormMessage('Veuillez remplir tous les champs', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showFormMessage('Veuillez entrer une adresse email valide', 'error');
                return;
            }

            // Bouton en état de chargement
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Envoi en cours...';
            submitBtn.disabled = true;

            // Paramètres envoyés au template EmailJS
            const templateParams = {
                from_name: nom,
                from_email: email,
                message: message,
                title: 'Portfolio Contact',
                to_email: 'andriatianamariomihajasoa@gmail.com'
            };

            // Envoi via EmailJS
            emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams)
                .then(function(response) {
                    console.log('Succès!', response.status, response.text);
                    showFormMessage('✅ Message envoyé avec succès ! Je vous répondrai dans les plus brefs délais.', 'success');
                    contactForm.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                })
                .catch(function(error) {
                    console.error('Erreur EmailJS:', error);
                    showFormMessage('⚠️ Erreur lors de l\'envoi. Contactez-moi directement à andriatianamariomihajasoa@gmail.com', 'error');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                });
        });
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showFormMessage(msg, type) {
        if (formMessage) {
            formMessage.textContent = msg;
            formMessage.className = `mt-4 text-center p-3 rounded-lg ${type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'} block`;

            setTimeout(() => {
                formMessage.classList.add('hidden');
                setTimeout(() => {
                    formMessage.className = 'mt-4 text-center hidden';
                }, 300);
            }, 5000);
        }
    }


    // ========== RESPONSIVE ==========
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768 && mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            if (menuOverlay) menuOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });


    // ========== ANIMATIONS SCROLL ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('#apropos > div, #projets article, #formations > div, #competences > div, #contact > div > div').forEach(el => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        }
    });

});