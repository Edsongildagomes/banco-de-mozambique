/**
 * Moçambique 50 Anos - Sistema de Coleta de Dados
 * vsl.js - Arquivo JavaScript Completo
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos do formulário
    const form = document.getElementById('coletaForm');
    const submitBtn = document.getElementById('submitBtn');
    const currentYearElement = document.getElementById('currentYear');
    
    // Distritos por província - TODOS OS DISTRITOS DE MOÇAMBIQUE
    const distritosPorProvincia = {
        "Maputo Cidade": [
            "KaMpfumo",
            "Nlhamankulu",
            "KaMaxakeni",
            "KaMavota",
            "KaMubukwana",
            "KaTembe",
            "KaNyaka"
        ],
        "Maputo Província": [
            "Boane",
            "Magude",
            "Manhiça",
            "Marracuene",
            "Matola",
            "Matutuíne",
            "Moamba",
            "Namaacha"
        ],
        "Gaza": [
            "Bilene",
            "Chibuto",
            "Chicualacuala",
            "Chigubo",
            "Chókwè",
            "Guijá",
            "Limpopo",
            "Mabalane",
            "Manjacaze",
            "Mapai",
            "Massangena",
            "Massingir",
            "Xai-Xai"
        ],
        "Inhambane": [
            "Funhalouro",
            "Govuro",
            "Homoine",
            "Inhambane",
            "Inharrime",
            "Inhassoro",
            "Jangamo",
            "Mabote",
            "Massinga",
            "Morrumbene",
            "Panda",
            "Vilankulo",
            "Zavala"
        ],
        "Sofala": [
            "Búzi",
            "Caia",
            "Chemba",
            "Cheringoma",
            "Chibabava",
            "Dondo",
            "Gorongosa",
            "Machanga",
            "Maríngue",
            "Marromeu",
            "Muanza",
            "Nhamatanda"
        ],
        "Manica": [
            "Báruè",
            "Gondola",
            "Guro",
            "Macate",
            "Machaze",
            "Macossa",
            "Manica",
            "Mossurize",
            "Sussundenga",
            "Tambara",
            "Vanduzi"
        ],
        "Tete": [
            "Angónia",
            "Cahora-Bassa",
            "Changara",
            "Chifunde",
            "Chiuta",
            "Dôa",
            "Macanga",
            "Magoé",
            "Marara",
            "Marávia",
            "Moatize",
            "Mutarara",
            "Tsangano",
            "Zumbo"
        ],
        "Zambézia": [
            "Alto Molócuè",
            "Chinde",
            "Derre",
            "Gilé",
            "Gurué",
            "Ile",
            "Inhassunge",
            "Lugela",
            "Maganja da Costa",
            "Milange",
            "Mocuba",
            "Mopeia",
            "Morrumbala",
            "Namacurra",
            "Namarroi",
            "Nicoadala",
            "Pebane",
            "Quelimane"
        ],
        "Nampula": [
            "Angoche",
            "Eráti",
            "Ilha de Moçambique",
            "Lalaua",
            "Larde",
            "Liúpo",
            "Malema",
            "Meconta",
            "Mecubúri",
            "Memba",
            "Mogincual",
            "Mogovolas",
            "Moma",
            "Monapo",
            "Mossuril",
            "Muecate",
            "Murrupula",
            "Nacala-a-Velha",
            "Nacala Porto",
            "Nacarôa",
            "Nampula",
            "Rapale",
            "Ribaué"
        ],
        "Cabo Delgado": [
            "Ancuabe",
            "Balama",
            "Chiúre",
            "Ibo",
            "Macomia",
            "Mecúfi",
            "Meluco",
            "Metuge",
            "Mocímboa da Praia",
            "Montepuez",
            "Mueda",
            "Muidumbe",
            "Namuno",
            "Nangade",
            "Palma",
            "Pemba",
            "Quissanga"
        ],
        "Niassa": [
            "Cuamba",
            "Lago",
            "Lichinga",
            "Majune",
            "Mandimba",
            "Marrupa",
            "Maúa",
            "Mavago",
            "Mecanhelas",
            "Mecula",
            "Metarica",
            "Muembe",
            "N'gauma",
            "Nipepe",
            "Sanga"
        ]
    };
    
    // Campos obrigatórios
    const camposObrigatorios = [
        'nome', 'bi', 'dataNascimento', 'provincia', 'distrito',
        'telefone', 'contaMpesa', 'rendaFamiliar', 'fonteRenda',
        'usoDinheiro', 'dependentes'
    ];
    
    // Configurar ano atual no rodapé
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }
    
    // URL para onde redirecionar após envio
    const URL_DESTINO = 'vsl.html'; // ⚠️ ALTERE ESTA URL
    
    // Atualizar distritos quando província muda
    const provincia = document.getElementById('provincia');
    const distrito = document.getElementById('distrito');
    
    if (provincia && distrito) {
        provincia.addEventListener('change', function() {
            const provinciaSelecionada = this.value;
            distrito.innerHTML = '<option value="">Selecione o distrito</option>';
            
            if (provinciaSelecionada && distritosPorProvincia[provinciaSelecionada]) {
                distritosPorProvincia[provinciaSelecionada].forEach(dist => {
                    const option = document.createElement('option');
                    option.value = dist;
                    option.textContent = dist;
                    distrito.appendChild(option);
                });
            }
            
            verificarCampos();
        });
    }
    
    // Mostrar/Ocultar campos condicionais
    const fonteRenda = document.getElementById('fonteRenda');
    const fonteRendaOutroGroup = document.getElementById('fonteRendaOutroGroup');
    
    if (fonteRenda) {
        fonteRenda.addEventListener('change', function() {
            if (this.value === 'Outro') {
                fonteRendaOutroGroup.style.display = 'block';
            } else {
                fonteRendaOutroGroup.style.display = 'none';
            }
            verificarCampos();
        });
    }
    
    const usoDinheiro = document.getElementById('usoDinheiro');
    const usoDinheiroOutroGroup = document.getElementById('usoDinheiroOutroGroup');
    
    if (usoDinheiro) {
        usoDinheiro.addEventListener('change', function() {
            if (this.value === 'Outro') {
                usoDinheiroOutroGroup.style.display = 'block';
            } else {
                usoDinheiroOutroGroup.style.display = 'none';
            }
            verificarCampos();
        });
    }
    
    // Validar idade mínima (18 anos)
    const dataNascimento = document.getElementById('dataNascimento');
    if (dataNascimento) {
        dataNascimento.addEventListener('change', function() {
            const hoje = new Date();
            const nascimento = new Date(this.value);
            let idade = hoje.getFullYear() - nascimento.getFullYear();
            const mes = hoje.getMonth() - nascimento.getMonth();
            
            if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
                idade--;
            }
            
            if (idade < 18) {
                alert('Você deve ter pelo menos 18 anos para se cadastrar.');
                this.value = '';
            }
            verificarCampos();
        });
    }
    
    // Validar formato do BI
    const bi = document.getElementById('bi');
    if (bi) {
        bi.addEventListener('input', function() {
            this.value = this.value.toUpperCase();
            verificarCampos();
        });
    }
    
    // Verificar se todos os campos obrigatórios estão preenchidos
    function verificarCampos() {
        let todosPreenchidos = true;
        
        for (let campo of camposObrigatorios) {
            const elemento = document.getElementById(campo);
            if (elemento && elemento.value.trim() === '') {
                todosPreenchidos = false;
                break;
            }
        }
        
        // Verificar campos condicionais
        if (fonteRenda && fonteRenda.value === 'Outro') {
            const fonteRendaOutro = document.getElementById('fonteRendaOutro');
            if (fonteRendaOutro && fonteRendaOutro.value.trim() === '') {
                todosPreenchidos = false;
            }
        }
        
        if (usoDinheiro && usoDinheiro.value === 'Outro') {
            const usoDinheiroOutro = document.getElementById('usoDinheiroOutro');
            if (usoDinheiroOutro && usoDinheiroOutro.value.trim() === '') {
                todosPreenchidos = false;
            }
        }
        
        submitBtn.disabled = !todosPreenchidos;
    }
    
    // Adicionar eventos a todos os campos obrigatórios
    camposObrigatorios.forEach(campo => {
        const elemento = document.getElementById(campo);
        if (elemento) {
            elemento.addEventListener('input', verificarCampos);
            elemento.addEventListener('change', verificarCampos);
        }
    });
    
    // Adicionar eventos aos campos condicionais
    const fonteRendaOutro = document.getElementById('fonteRendaOutro');
    if (fonteRendaOutro) {
        fonteRendaOutro.addEventListener('input', verificarCampos);
    }
    
    const usoDinheiroOutro = document.getElementById('usoDinheiroOutro');
    if (usoDinheiroOutro) {
        usoDinheiroOutro.addEventListener('input', verificarCampos);
    }
    
    // Enviar formulário
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Coletar todos os dados
            const dados = {
                // Dados Pessoais
                nome: document.getElementById('nome').value.trim(),
                bi: document.getElementById('bi').value.trim(),
                dataNascimento: document.getElementById('dataNascimento').value,
                provincia: document.getElementById('provincia').value,
                distrito: document.getElementById('distrito').value,
                telefone: document.getElementById('telefone').value.trim(),
                contaMpesa: document.getElementById('contaMpesa').value.trim(),
                
                // Dados Socioeconômicos
                rendaFamiliar: document.getElementById('rendaFamiliar').value,
                fonteRenda: document.getElementById('fonteRenda').value,
                fonteRendaOutro: fonteRenda.value === 'Outro' ? document.getElementById('fonteRendaOutro').value.trim() : null,
                usoDinheiro: document.getElementById('usoDinheiro').value,
                usoDinheiroOutro: usoDinheiro.value === 'Outro' ? document.getElementById('usoDinheiroOutro').value.trim() : null,
                dependentes: document.getElementById('dependentes').value,
                
                // Metadados
                dataEnvio: new Date().toISOString()
            };
            
            // Salvar no localStorage
            localStorage.setItem('dadosUsuario', JSON.stringify(dados));
            
            // Log para debug (pode remover em produção)
            console.log('Dados coletados:', dados);
            
            // OPCIONAL: Enviar para um servidor antes de redirecionar
            // Descomente o código abaixo se quiser enviar para um servidor
            /*
            fetch('URL_DO_SEU_SERVIDOR', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            })
            .then(response => response.json())
            .then(data => {
                console.log('Sucesso:', data);
                window.location.href = URL_DESTINO;
            })
            .catch((error) => {
                console.error('Erro:', error);
                alert('Erro ao enviar dados. Tente novamente.');
            });
            */
            
            // Redirecionar para o outro site
            window.location.href = URL_DESTINO;
        });
    }
});