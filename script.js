// Estado global da aplicação
const AppState = {
    selectedPaymentMethod: null,
    isProcessing: false
};

// Elementos DOM
const Elements = {
    paymentOptions: null,
    confirmButton: null,
    modal: null,
    init() {
        this.paymentOptions = document.querySelectorAll('.payment-option');
        this.confirmButton = document.getElementById('confirmBtn');
        this.modal = document.getElementById('paymentModal');
    }
};

// Utilitários
const Utils = {
    // Função para copiar texto para clipboard
    copyToClipboard(elementId) {
        const element = document.getElementById(elementId);
        const text = element.textContent;
        
        // Método moderno (Clipboard API)
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                this.showCopySuccess(element);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                this.fallbackCopy(text, element);
            });
        } else {
            // Fallback para navegadores mais antigos
            this.fallbackCopy(text, element);
        }
    },

    // Método fallback para copiar
    fallbackCopy(text, element) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showCopySuccess(element);
        } catch (err) {
            console.error('Erro ao copiar:', err);
            this.showCopyError();
        } finally {
            document.body.removeChild(textArea);
        }
    },

    // Mostrar feedback de sucesso ao copiar
    showCopySuccess(element) {
        const copyBtn = element.parentElement.querySelector('.copy-btn');
        const originalText = copyBtn.textContent;
        const originalClass = copyBtn.className;
        
        copyBtn.textContent = '✓ Copiado';
        copyBtn.classList.add('copy-success');
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.className = originalClass;
        }, 2000);
        
        // Adicionar animação de sucesso ao elemento copiado
        element.classList.add('success-animation');
        setTimeout(() => {
            element.classList.remove('success-animation');
        }, 600);
    },

    // Mostrar erro ao copiar
    showCopyError() {
        this.showNotification('Erro ao copiar. Tente selecionar e copiar manualmente.', 'error');
    },

    // Sistema de notificações
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Adicionar estilos da notificação
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'error' ? '#dc3545' : '#17a2b8',
            color: 'white',
            padding: '12px 16px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: '500',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: '1001',
            animation: 'slideInRight 0.3s ease'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    },

    // Validar seleção de método de pagamento
    validatePaymentSelection() {
        return AppState.selectedPaymentMethod !== null;
    },

    // Atualizar estado do botão de confirmação
    updateConfirmButton() {
        const button = Elements.confirmButton;
        
        if (this.validatePaymentSelection() && !AppState.isProcessing) {
            button.disabled = false;
            button.innerHTML = `
                <i class="fas fa-check-circle"></i>
                Confirmar Saque
            `;
            button.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        } else if (AppState.isProcessing) {
            button.disabled = true;
            button.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                Processando...
            `;
        } else {
            button.disabled = true;
            button.innerHTML = `
                <i class="fas fa-lock"></i>
                Selecione um método de pagamento
            `;
        }
    },

    // Adicionar animação de loading
    addLoadingAnimation(element) {
        element.classList.add('loading');
    },

    // Remover animação de loading
    removeLoadingAnimation(element) {
        element.classList.remove('loading');
    }
};

// Gerenciamento de métodos de pagamento
const PaymentManager = {
    // Selecionar método de pagamento
    selectPaymentMethod(methodElement) {
        // Remover seleção anterior
        Elements.paymentOptions.forEach(option => {
            option.classList.remove('active');
        });
        
        // Adicionar seleção atual
        methodElement.classList.add('active');
        
        // Atualizar estado global
        AppState.selectedPaymentMethod = methodElement.dataset.method;
        
        // Atualizar botão de confirmação
        Utils.updateConfirmButton();
        
        // Scroll suave para os detalhes do pagamento
        setTimeout(() => {
            const paymentDetails = methodElement.querySelector('.payment-details');
            if (paymentDetails) {
                paymentDetails.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }
        }, 300);
    },

    // Inicializar eventos dos métodos de pagamento
    initPaymentEvents() {
        Elements.paymentOptions.forEach(option => {
            const header = option.querySelector('.payment-header');
            
            header.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectPaymentMethod(option);
            });
            
            // Adicionar efeito hover melhorado
            option.addEventListener('mouseenter', () => {
                if (!option.classList.contains('active')) {
                    option.style.transform = 'translateY(-2px)';
                }
            });
            
            option.addEventListener('mouseleave', () => {
                if (!option.classList.contains('active')) {
                    option.style.transform = 'translateY(0)';
                }
            });
        });
    }
};

// Gerenciamento do modal
const ModalManager = {
    // Mostrar modal
    show() {
        Elements.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Foco no modal para acessibilidade
        Elements.modal.focus();
    },

    // Fechar modal
    hide() {
        Elements.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        AppState.isProcessing = false;
        Utils.updateConfirmButton();
    },

    // Inicializar eventos do modal
    initModalEvents() {
        // Fechar modal ao clicar no fundo
        Elements.modal.addEventListener('click', (e) => {
            if (e.target === Elements.modal) {
                this.hide();
            }
        });

        // Fechar modal com tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && Elements.modal.style.display === 'block') {
                this.hide();
            }
        });
    }
};

// Gerenciamento do processo de confirmação
const ConfirmationManager = {
    // Processar confirmação do saque
    async processConfirmation() {
        if (!Utils.validatePaymentSelection()) {
            Utils.showNotification('Selecione um método de pagamento primeiro.', 'error');
            return;
        }

        // Iniciar processo
        AppState.isProcessing = true;
        Utils.updateConfirmButton();

        try {
            // Simular processamento (aqui você integraria com sua API)
            await this.simulateProcessing();
            
            // Mostrar modal de confirmação
            ModalManager.show();
            
            // Tracking do modal
            Analytics.trackModalShown(AppState.selectedPaymentMethod);
            
        } catch (error) {
            console.error('Erro no processamento:', error);
            Utils.showNotification('Erro ao processar solicitação. Tente novamente.', 'error');
            AppState.isProcessing = false;
            Utils.updateConfirmButton();
        }
    },

    // Simular processamento (substituir pela integração real)
    simulateProcessing() {
        return new Promise((resolve) => {
            setTimeout(resolve, 2000);
        });
    },

    // Inicializar eventos de confirmação
    initConfirmationEvents() {
        Elements.confirmButton.addEventListener('click', (e) => {
            e.preventDefault();
            this.processConfirmation();
        });
    }
};

// Sistema de analytics e tracking
const Analytics = {
    // Rastrear eventos
    track(eventName, data = {}) {
        const event = {
            name: eventName,
            timestamp: new Date().toISOString(),
            data: data,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        console.log('Analytics Event:', event);
        
        // Aqui você pode integrar com Google Analytics, Mixpanel, etc.
        // gtag('event', eventName, data);
    },

    // Rastrear seleção de método de pagamento com Facebook Pixel
    trackPaymentMethodSelection(method) {
        this.track('payment_method_selected', {
            method: method,
            timestamp: Date.now()
        });

        // Facebook Pixel - Tracking de seleção de método de pagamento
        if (typeof fbq !== 'undefined') {
            fbq('track', 'AddPaymentInfo', {
                payment_method: method,
                content_name: `Pagamento via ${method.toUpperCase()}`,
                content_category: 'payment_method_selection',
                value: 300,
                currency: 'MZN'
            });
            
            // Evento customizado adicional
            fbq('trackCustom', 'PaymentMethodSelected', {
                method: method,
                institution: 'Fundação Green World',
                campaign: 'Ajuda às Vítimas'
            });
        }
    },

    // Rastrear tentativa de confirmação com Facebook Pixel
    trackConfirmationAttempt(method) {
        this.track('confirmation_attempted', {
            method: method,
            timestamp: Date.now()
        });

        // Facebook Pixel - Tracking de tentativa de compra
        if (typeof fbq !== 'undefined') {
            fbq('track', 'InitiateCheckout', {
                payment_method: method,
                content_name: 'Confirmação de Saque',
                content_category: 'checkout_attempt',
                value: 5000,
                currency: 'MZN',
                num_items: 1
            });
            
            // Evento customizado para confirmação
            fbq('trackCustom', 'SaqueConfirmationAttempt', {
                method: method,
                amount: 5000,
                fee: 300,
                institution: 'Fundação Green World'
            });
        }
    },

    // Tracking para quando o modal é mostrado
    trackModalShown(method) {
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'PaymentPendingModalShown', {
                method: method,
                stage: 'awaiting_payment'
            });
        }
    },

    // Tracking para página carregada
    trackPageLoaded() {
        this.track('page_loaded');
        
        if (typeof fbq !== 'undefined') {
            fbq('trackCustom', 'CheckoutPageLoaded', {
                page_type: 'checkout',
                institution: 'Fundação Green World',
                campaign: 'Ajuda às Vítimas'
            });
        }
    }
};

// Inicialização da aplicação
const App = {
    // Inicializar aplicação
    init() {
        // Verificar se DOM está carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    },

    // Iniciar aplicação
    start() {
        try {
            // Inicializar elementos DOM
            Elements.init();
            
            // Verificar se elementos essenciais existem
            if (!Elements.paymentOptions.length || !Elements.confirmButton || !Elements.modal) {
                throw new Error('Elementos DOM essenciais não encontrados');
            }
            
            // Inicializar gerenciadores
            PaymentManager.initPaymentEvents();
            ModalManager.initModalEvents();
            ConfirmationManager.initConfirmationEvents();
            
            // Inicializar estado do botão
            Utils.updateConfirmButton();
            
            // Adicionar listeners globais
            this.initGlobalListeners();
            
            // Analytics inicial
            Analytics.trackPageLoaded();
            
            console.log('Aplicação inicializada com sucesso');
            
        } catch (error) {
            console.error('Erro ao inicializar aplicação:', error);
            Utils.showNotification('Erro ao carregar a página. Recarregue e tente novamente.', 'error');
        }
    },

    // Listeners globais
    initGlobalListeners() {
        // Prevenir zoom em inputs no iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.addEventListener('touchstart', () => {}, { passive: true });
        }
        
        // Otimização de performance para scroll
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        
        // Listener para mudanças de orientação
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.handleOrientationChange();
            }, 100);
        });
        
        // Listener para mudanças de visibilidade da página
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                Analytics.track('page_hidden');
            } else {
                Analytics.track('page_visible');
            }
        });
    },

    // Handler para scroll
    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Adicionar classe para header fixo se necessário
        if (scrollTop > 50) {
            document.querySelector('.header').classList.add('scrolled');
        } else {
            document.querySelector('.header').classList.remove('scrolled');
        }
    },

    // Handler para mudança de orientação
    handleOrientationChange() {
        // Forçar recálculo de altura em dispositivos móveis
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
};

// Funções globais (para manter compatibilidade com HTML inline)
window.copyToClipboard = (elementId) => {
    Utils.copyToClipboard(elementId);
};

window.closeModal = () => {
    ModalManager.hide();
};

// Event listeners para analytics
document.addEventListener('click', (e) => {
    // Rastrear cliques em métodos de pagamento
    if (e.target.closest('.payment-option')) {
        const method = e.target.closest('.payment-option').dataset.method;
        Analytics.trackPaymentMethodSelection(method);
    }
    
    // Rastrear cliques no botão de confirmação
    if (e.target.closest('#confirmBtn')) {
        Analytics.trackConfirmationAttempt(AppState.selectedPaymentMethod);
    }
});

// Adicionar estilos CSS dinâmicos
const DynamicStyles = {
    init() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
            
            .header.scrolled {
                box-shadow: 0 2px 20px rgba(0,0,0,0.15);
            }
            
            /* Melhorias para dispositivos touch */
            @media (hover: none) and (pointer: coarse) {
                .payment-option:hover {
                    transform: none;
                }
                
                .confirm-button:hover:not(:disabled) {
                    transform: none;
                }
            }
        `;
        document.head.appendChild(style);
    }
};

// Inicializar estilos dinâmicos
DynamicStyles.init();

// Inicializar aplicação
App.init();