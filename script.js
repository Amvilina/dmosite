document.addEventListener('DOMContentLoaded', function() {
    
    const navLinks = document.querySelectorAll('.main-nav__link[data-section]');
    const heroTitle = document.getElementById('hero-title');
    const sectionTitle = document.getElementById('section-title');
    const priceSubtitle = document.getElementById('price-subtitle');
    const priceTableWrappers = document.querySelectorAll('.price-table__wrapper');
    
    
    const sectionData = {
        disinfection: {
            heroTitle: 'Профессиональная дезинфекция помещений в Мособласти',
            sectionTitle: 'Прайс бытовые насекомые/дезинсекция',
            subtitle: 'комплексная обработка'
        },
        rodents: {
            heroTitle: 'Профессиональная дератизация от грызунов в Мособласти',
            sectionTitle: 'Прайс грызуны/дератизация - раскладка отравы-приманки',
            subtitle: 'уничтожение грызунов'
        },
        country: {
            heroTitle: 'Профессиональная обработка дачных участков в Мособласти',
            sectionTitle: 'Прайс дачные вредители',
            subtitle: 'комплексная защита от садовых вредителей'
        },
        mold: {
            heroTitle: 'Устранение плесени и грибка в Мособласти',
            sectionTitle: 'Прайс плесень',
            subtitle: 'обработка от плесени и грибка'
        },
        smells: {
            heroTitle: 'Устранение неприятных запахов в Мособласти',
            sectionTitle: 'Прайс запахи',
            subtitle: 'профессиональная обработка'
        },
        'all-services': {
            heroTitle: 'Полный прайс-лист на все услуги в Мособласти',
            sectionTitle: 'Все услуги и цены компании',
            subtitle: 'выберите подходящую услугу'
        }
    };

    
    
    
    function _0xDecrypt(_0xParts) {
        
        let _0xCombined = _0xParts.join('');
        
        
        let _0xDecoded = atob(_0xCombined);
        
        
        let _0xResult = '';
        for (let i = 0; i < _0xDecoded.length; i++) {
            const key = (i % 10) + 112;
            _0xResult += String.fromCharCode(_0xDecoded.charCodeAt(i) ^ key);
        }
        
        return _0xResult;
    }
    
    
    const _0xTokenData = {
        "botId": ["SEVARk", "ZMR0NA", "Sg=="],
        "botKey": ["MTA6Mh1CICgMPj8/", "HBQ1RD4jCzg+GCcU", "DBwyOU8JJUcZPTk="]
    };
    
    const _0xChatData = [""];
    
    
    const _0xBotId = _0xDecrypt(_0xTokenData.botId);
    const _0xBotKey = _0xDecrypt(_0xTokenData.botKey);
    const _0xChatId = _0xDecrypt(_0xChatData);
    
    
    const TELEGRAM_BOT_TOKEN = _0xBotId + ':' + _0xBotKey;
    const TELEGRAM_CHAT_ID = _0xChatId;

    
    async function sendToTelegram(phone, formName) {
        const time = new Date().toLocaleString('ru-RU');
        
        
        let currentSection = 'Главная страница';
        const activeWrapper = document.querySelector('.price-table__wrapper.active');
        if (activeWrapper) {
            const section = activeWrapper.dataset.section;
            const sectionNames = {
                'disinfection': 'Дезинфекция',
                'rodents': 'Грызуны', 
                'country': 'Дачные вредители',
                'mold': 'Плесень',
                'smells': 'Запахи',
                'all-services': 'Все услуги'
            };
            currentSection = sectionNames[section] || 'Неизвестный раздел';
        }
        
        
        const siteName = window.location.hostname || 'областная-дезинфекция.рф';
        
        const message = `🔔 <b>Новая заявка с сайта!</b>

📱 Телефон: <code>${phone}</code>
📄 Форма: ${formName}
📍 Раздел: ${currentSection}
🌐 Сайт: ${siteName}
🕐 Время: ${time}

💬 Перезвоните клиенту как можно скорее!`;

        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: 'HTML'
                })
            });
            
            const result = await response.json();
            return result.ok;
        } catch (error) {
            console.error('Ошибка отправки:', error);
            return false;
        }
    }

    
    function validatePhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10;
    }

    
    function formatPhone(phone) {
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length >= 10) {
            const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/);
            if (match) {
                return `+7 (${match[2]}) ${match[3]}-${match[4]}-${match[5]}`;
            }
        }
        return phone;
    }

    
    function showNotification(message, isSuccess = true) {
        const oldNotifications = document.querySelectorAll('.notification');
        oldNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `notification ${isSuccess ? 'notification--success' : 'notification--error'}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('notification--show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('notification--show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    
    async function handleFormSubmit(form, formName) {
        const phoneInput = form.querySelector('input[type="tel"]');
        const phone = phoneInput.value;
        
        if (!validatePhone(phone)) {
            showNotification('Пожалуйста, введите корректный номер телефона', false);
            phoneInput.focus();
            return;
        }
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';
        
        const formattedPhone = formatPhone(phone);
        const success = await sendToTelegram(formattedPhone, formName);
        
        if (success) {
            showNotification('Спасибо! Мы свяжемся с вами в ближайшее время');
            phoneInput.value = '';
        } else {
            showNotification('Произошла ошибка. Попробуйте позвонить нам напрямую', false);
        }
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }

    

    function initFAQ() {
        const faqItems = document.querySelectorAll('.faq__item');
        
        faqItems.forEach(item => {
            const question = item.querySelector('.faq__question');
            const answer = item.querySelector('.faq__answer');
            
            answer.removeAttribute('hidden');
            
            question.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const isExpanded = question.getAttribute('aria-expanded') === 'true';
                
                const column = item.parentElement;
                column.querySelectorAll('.faq__item').forEach(otherItem => {
                    const otherQuestion = otherItem.querySelector('.faq__question');
                    const otherAnswer = otherItem.querySelector('.faq__answer');
                    
                    if (otherItem !== item) {
                        otherQuestion.setAttribute('aria-expanded', 'false');
                        otherAnswer.classList.remove('active');
                    }
                });
                
                if (!isExpanded) {
                    question.setAttribute('aria-expanded', 'true');
                    answer.classList.add('active');
                } else {
                    question.setAttribute('aria-expanded', 'false');
                    answer.classList.remove('active');
                }
            });
        });
    }

    initFAQ();

    function initReviewsSlider() {
        const slider = document.getElementById('reviews-slider');
        if (!slider) return;
        
        const slides = slider.querySelector('.reviews__slides');
        const slideElements = slider.querySelectorAll('.reviews__slide');
        const prevBtn = document.querySelector('.reviews__arrow--prev');
        const nextBtn = document.querySelector('.reviews__arrow--next');
        const dots = document.querySelectorAll('.reviews__dot');
        
        let currentSlide = 0;
        const totalSlides = slideElements.length;
        
        function updateSlider() {
            slides.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            slideElements.forEach((slide, index) => {
                slide.classList.toggle('reviews__slide--active', index === currentSlide);
            });
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('reviews__dot--active', index === currentSlide);
            });
        }
        
        function nextSlide() {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateSlider();
        }
        
        function prevSlide() {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateSlider();
        }
        
        nextBtn?.addEventListener('click', nextSlide);
        prevBtn?.addEventListener('click', prevSlide);
        
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                currentSlide = index;
                updateSlider();
            });
        });
        
        setInterval(nextSlide, 5000);
    }

    initReviewsSlider();

    
    function initDiscountTimer() {
        const timerElement = document.getElementById('discount-timer');
        if (!timerElement) return;
        
        const now = new Date();
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);
        
        function updateTimer() {
            const now = new Date();
            const timeLeft = endOfDay - now;
            
            if (timeLeft <= 0) {
                endOfDay.setDate(endOfDay.getDate() + 1);
                return;
            }
            
            const hours = Math.floor(timeLeft / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
            
            const formattedTime = 
                String(hours).padStart(2, '0') + ' : ' +
                String(minutes).padStart(2, '0') + ' : ' +
                String(seconds).padStart(2, '0');
            
            timerElement.textContent = formattedTime;
        }
        
        updateTimer();
        setInterval(updateTimer, 1000);
    }

    initDiscountTimer();

    
    function addCallbackForms() {
        const formTemplate = document.querySelector('.callback-form-template');
        if (!formTemplate) return;
        
        document.querySelectorAll('.callback-form').forEach(form => {
            if (!form.parentElement.classList.contains('callback-form-template')) {
                form.remove();
            }
        });
        
        priceTableWrappers.forEach(wrapper => {
            if (wrapper.classList.contains('active')) {
                const formClone = formTemplate.querySelector('.callback-form').cloneNode(true);
                wrapper.appendChild(formClone);
            }
        });
    }
    
    
    function switchSection(section) {
        navLinks.forEach(link => {
            link.classList.remove('main-nav__link--active');
            if (link.dataset.section === section) {
                link.classList.add('main-nav__link--active');
            }
        });
        
        if (sectionData[section]) {
            heroTitle.textContent = sectionData[section].heroTitle;
            sectionTitle.textContent = sectionData[section].sectionTitle;
            priceSubtitle.textContent = sectionData[section].subtitle;
        }
        
        priceTableWrappers.forEach(wrapper => {
            if (wrapper.dataset.section === section) {
                wrapper.classList.add('active');
            } else {
                wrapper.classList.remove('active');
            }
        });
        
        setTimeout(addCallbackForms, 10);
    }
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            if (section) {
                switchSection(section);
            }
        });
    });
    
    
    const methodTabs = document.querySelectorAll('.methods__tab');
    const methodContents = document.querySelectorAll('.methods__item');
    
    methodTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.dataset.tab;
            
            methodTabs.forEach(t => t.classList.remove('methods__tab--active'));
            this.classList.add('methods__tab--active');
            
            methodContents.forEach(content => {
                if (content.classList.contains('methods__item--active')) {
                    content.classList.add('methods__item--hiding');
                    setTimeout(() => {
                        content.classList.remove('methods__item--active', 'methods__item--hiding');
                    }, 300);
                }
            });
            
            setTimeout(() => {
                methodContents.forEach(content => {
                    if (content.dataset.content === targetTab) {
                        content.classList.add('methods__item--active');
                    }
                });
            }, 300);
        });
    });
    
    switchSection('disinfection');

    
    function initScrollTop() {
        const scrollBtn = document.querySelector('.scroll-top');
        if (!scrollBtn) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        });
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    initScrollTop();

    
    
    
    const heroForm = document.querySelector('.hero__form');
    if (heroForm) {
        heroForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleFormSubmit(this, 'Главная форма (шапка сайта)');
        });
    }
    
    
    const discountForm = document.querySelector('.discount__form');
    if (discountForm) {
        discountForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            await handleFormSubmit(this, 'Форма со скидкой 25%');
        });
    }
    
    
    document.addEventListener('submit', async function(e) {
        if (e.target.classList.contains('callback-form__form')) {
            e.preventDefault();
            
            const activeSection = document.querySelector('.price-table__wrapper.active');
            let sectionName = 'Неизвестный раздел';
            
            if (activeSection) {
                const section = activeSection.dataset.section;
                const sectionNames = {
                    'disinfection': 'Дезинфекция',
                    'rodents': 'Грызуны',
                    'country': 'Дачные вредители',
                    'mold': 'Плесень',
                    'smells': 'Запахи',
                    'all-services': 'Все услуги'
                };
                sectionName = sectionNames[section] || section;
            }
            
            await handleFormSubmit(e.target, `Форма обратной связи (${sectionName})`);
        }
    });
    
    
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.slice(1);
                }
                let formatted = '+7';
                if (value.length > 1) {
                    formatted += ' (' + value.slice(1, 4);
                }
                if (value.length >= 4) {
                    formatted += ') ' + value.slice(4, 7);
                }
                if (value.length >= 7) {
                    formatted += '-' + value.slice(7, 9);
                }
                if (value.length >= 9) {
                    formatted += '-' + value.slice(9, 11);
                }
                e.target.value = formatted;
            }
        });
    });
});