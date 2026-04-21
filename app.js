class ConsortiumApp {
    constructor() {
        this.state = JSON.parse(localStorage.getItem('consortium_data')) || {
            activePage: 'home',
            currentPath: 'D:\\lab\\Projets',
            pages: {
                home: { title: 'Dashboard', icon: '🏠' },
                projects: { title: 'Projects', icon: '📂' },
                tasks: { title: 'Tasks', icon: '✅' },
                ai: { title: 'Antigravity Assistant', icon: '🤖' },
                calendar: { title: 'Calendar', icon: '📅' },
                settings: { title: 'Settings', icon: '⚙️' }
            }
        };
        
        this.init();
    }

    init() {
        this.sidebar = document.getElementById('sidebar');
        this.pageTitle = document.getElementById('page-title');
        this.blocksContainer = document.getElementById('blocks-container');
        this.pageList = document.querySelectorAll('#page-list li');
        this.bottomNav = document.querySelectorAll('#bottom-nav button');
        
        // AI Quick Toggle
        const aiToggle = document.getElementById('ai-quick-toggle');
        if (aiToggle) aiToggle.onclick = () => { 
            this.state.activePage = 'ai'; 
            this.render(); 
            this.saveToStorage();
        };

        this.setupNavigation();
        this.render();
        
        // Mobile menu toggle
        const menuToggle = document.getElementById('menu-toggle');
        const closeSidebar = document.getElementById('close-sidebar');
        if (menuToggle) menuToggle.onclick = () => this.sidebar.classList.remove('-translate-x-full');
        if (closeSidebar) closeSidebar.onclick = () => this.sidebar.classList.add('-translate-x-full');
    }

    setupNavigation() {
        const handleNav = (el) => {
            const pageId = el.getAttribute('data-page');
            this.state.activePage = pageId;
            this.sidebar.classList.add('-translate-x-full'); // Close mobile menu
            this.render();
            this.saveToStorage();
        };

        this.pageList.forEach(li => li.onclick = () => handleNav(li));
        this.bottomNav.forEach(btn => btn.onclick = () => handleNav(btn));
    }

    render() {
        const pageId = this.state.activePage;
        
        // Update active states
        [...this.pageList, ...this.bottomNav].forEach(el => {
            const active = el.getAttribute('data-page') === pageId;
            el.classList.toggle('active', active);
            el.classList.toggle('text-accent', active);
        });

        // Specialized rendering
        switch(pageId) {
            case 'home': this.renderHome(); break;
            case 'projects': this.renderProjects(this.state.currentPath); break;
            case 'tasks': this.renderTasks(); break;
            case 'ai': this.renderAI(); break;
            default: this.renderAI();
        }
    }

    renderHome() {
        this.pageTitle.innerText = "Bienvenue dans le Consortium";
        this.blocksContainer.innerHTML = '';
        
        // To-do List Card
        const todoCard = this.createCard('To-do List', '📝');
        const todoList = document.createElement('div');
        todoList.className = 'space-y-4';
        const tasks = [
            { text: 'Finaliser la structure de données', checked: true, tag: '🚩' },
            { text: 'Optimisation du moteur de rendu', checked: false, tag: 'En cours', tagColor: 'text-pink-500' },
            { text: 'Audit de sécurité des modules', checked: false, tag: '🕒 12 Avr', tagColor: 'text-gray-500' },
            { text: 'Déploiement de la version Pro', checked: false, tag: '🕒 23 Avr', tagColor: 'text-gray-500' },
            { text: 'Mise à jour de la documentation', checked: false, tag: '🕒 30 min', tagColor: 'text-gray-500' },
            { text: 'Validation des tests unitaires', checked: false, tag: '🚩' }
        ];
        tasks.forEach(t => {
            const item = document.createElement('div');
            item.className = 'flex items-center justify-between p-1 rounded-xl transition-all';
            item.innerHTML = `
                <div class="flex items-center gap-4">
                    <input type="checkbox" ${t.checked ? 'checked' : ''} class="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-accent accent-accent focus:ring-0">
                    <span class="text-sm font-medium ${t.checked ? 'line-through text-gray-600' : 'text-gray-300'}">${t.text}</span>
                </div>
                <span class="text-[11px] font-bold ${t.tagColor || 'text-red-500'}">${t.tag}</span>
            `;
            todoList.appendChild(item);
        });
        
        const footerInput = document.createElement('div');
        footerInput.className = 'mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-gray-600';
        footerInput.innerHTML = `<span class="text-xs italic">Ajouter une action rapide...</span> <span class="text-sm">→</span>`;
        
        todoCard.querySelector('.card-content').appendChild(todoList);
        todoCard.querySelector('.card-content').appendChild(footerInput);
        this.blocksContainer.appendChild(todoCard);

        // Antigravity Launch Card
        const aiLaunchCard = this.createCard('Antigravity Command', '🤖');
        aiLaunchCard.querySelector('.card-content').innerHTML = `
            <div class="flex flex-col gap-6 py-2">
                <div class="flex items-center gap-4 p-4 bg-accent/5 border border-accent/10 rounded-2xl">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    <span class="text-xs font-bold tracking-widest text-accent uppercase">Prêt pour vos ordres</span>
                </div>
                <p class="text-xs text-gray-500 leading-relaxed italic">"Je suis votre binôme. Je peux lancer vos projets et explorer vos dossiers d:\\lab à distance."</p>
                <button id="main-ai-launch" class="w-full py-4 bg-accent text-white rounded-2xl font-bold text-sm shadow-xl shadow-accent/20 hover:scale-[1.02] active:scale-95 transition-all">
                    🤖 LANCER L'ASSISTANT
                </button>
            </div>
        `;
        this.blocksContainer.appendChild(aiLaunchCard);
        const mainAiBtn = aiLaunchCard.querySelector('#main-ai-launch');
        if (mainAiBtn) mainAiBtn.onclick = () => { this.state.activePage = 'ai'; this.render(); this.saveToStorage(); };

        // Project Progress Card
        const progressCard = this.createCard('Project Progress', '📊');
        const progressList = document.createElement('div');
        progressList.className = 'space-y-8';
        const projects = [
            { name: "Neural_DAW", progress: 85, tag: "NÉON" },
            { name: "deep_verdict", progress: 40, tag: "CRITIQUE" },
            { name: "vocal_studio", progress: 60, tag: "AUDIO" }
        ];
        projects.forEach(p => {
            const item = document.createElement('div');
            item.innerHTML = `
                <div class="flex justify-between text-xs mb-3">
                    <span class="text-gray-400 font-medium">${p.name}</span>
                    <span class="text-gray-200">${p.progress}%</span>
                </div>
                <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-accent neon-bar" style="width: ${p.progress}%"></div>
                </div>
            `;
            progressList.appendChild(item);
        });
        
        const actionBtn = document.createElement('button');
        actionBtn.className = 'mt-10 w-fit px-6 py-3 bg-accent/20 border border-accent/30 text-accent rounded-2xl text-xs font-bold flex items-center gap-3 hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/10';
        actionBtn.innerHTML = `<span class="text-lg">🚀</span> LANCER LE LAB`;
        actionBtn.onclick = () => { this.state.activePage = 'projects'; this.render(); };
        
        progressCard.querySelector('.card-content').appendChild(progressList);
        progressCard.querySelector('.card-content').appendChild(actionBtn);
        this.blocksContainer.appendChild(progressCard);
    }

    renderProjects(path) {
        if (path) this.state.currentPath = path;
        this.saveToStorage();
        
        this.pageTitle.innerText = "Explorateur Universel";
        this.blocksContainer.innerHTML = '';
        
        // Windows Explorer Style Header with Drives
        const explorerHeader = document.createElement('div');
        explorerHeader.className = 'lg:col-span-2 flex flex-col gap-4 mb-4';
        explorerHeader.innerHTML = `
            <div class="flex gap-2 mb-2">
                <button onclick="window.app.renderProjects('C:\\\\')" class="px-4 py-2 bg-white/5 border border-white/5 text-gray-400 rounded-xl text-xs font-bold hover:border-accent hover:text-white transition-all">Disque Local (C:)</button>
                <button onclick="window.app.renderProjects('D:\\\\')" class="px-4 py-2 bg-white/5 border border-white/5 text-gray-400 rounded-xl text-xs font-bold hover:border-accent hover:text-white transition-all">Données (D:)</button>
                <button onclick="window.app.renderProjects('D:\\\\lab')" class="px-4 py-2 bg-accent/10 border border-accent/20 text-accent rounded-xl text-xs font-bold shadow-lg">Lab (D:\\lab)</button>
            </div>
            <div class="bg-[#1a1f26] border border-white/5 rounded-2xl p-4 flex items-center gap-4">
                <div class="flex gap-2">
                    <button class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">←</button>
                    <button class="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-gray-400">↑</button>
                </div>
                <div class="flex-1 bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs text-gray-300 font-mono flex items-center gap-2">
                    <span class="text-accent">📁</span> <input type="text" value="${path || 'D:\\lab\\Projets'}" class="bg-transparent border-none outline-none w-full text-gray-200">
                </div>
                <div class="max-w-[150px] w-full bg-black/20 border border-white/5 rounded-xl px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
                    🔍 Rechercher...
                </div>
            </div>
        `;
        this.blocksContainer.appendChild(explorerHeader);

        const currentFolders = path === 'C:\\' ? ["Windows", "Program Files", "Users"] : [
            "Neural_DAW", "audio-coach", "deep_verdict", "lutherie_app", 
            "vocal_studio", "dj_hybride", "bleachbit-dashboard", "cam_spy",
            "BACKUP", "MES IDS", "DOC_JUCE", "Projets"
        ];
        
        currentFolders.forEach(name => {
            const card = this.createCard(name, '📁');
            card.onclick = () => this.renderProjects(path + '\\' + name);
            const content = card.querySelector('.card-content');
            content.innerHTML = `
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-2">
                        <span class="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-500 font-mono">FOLDER</span>
                        <span class="text-[10px] text-gray-600 italic">Modifié : Aujourd'hui</span>
                    </div>
                    <div class="flex gap-2">
                        <button class="flex-1 py-3 bg-accent/20 border border-accent/30 text-accent rounded-xl text-xs font-bold hover:bg-accent hover:text-white transition-all">🚀 LANCER PROJET</button>
                        <button class="px-4 py-3 bg-white/5 border border-white/10 text-gray-400 rounded-xl hover:text-white transition-all" title="Ouvrir le dossier">📂</button>
                    </div>
                </div>
            `;
            this.blocksContainer.appendChild(card);
        });
    }

    renderTasks() {
        this.pageTitle.innerText = "Tasks Management";
        this.blocksContainer.innerHTML = '';
        const card = this.createCard('Journal de bord', '📋');
        card.querySelector('.card-content').innerHTML = `<p class="text-gray-500 italic">Vos tâches sont synchronisées avec Antigravity.</p>`;
        this.blocksContainer.appendChild(card);
    }

    renderAI() {
        this.pageTitle.innerText = "Antigravity Assistant";
        this.blocksContainer.innerHTML = '';
        
        const chatCard = this.createCard('Dialogue Antigravity', '🤖');
        chatCard.classList.add('lg:col-span-2');
        
        const chatContainer = document.createElement('div');
        chatContainer.className = 'flex flex-col h-[450px]';
        
        chatContainer.innerHTML = `
            <div class="flex flex-col md:flex-row items-center justify-between p-4 bg-accent/5 border border-accent/10 rounded-2xl mb-6 gap-3">
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                    <span class="text-xs font-bold tracking-widest text-accent uppercase">Antigravity Connecté</span>
                </div>
                <div class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                    <span class="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Sync Mode :</span>
                    <span class="text-[9px] text-green-400 font-bold uppercase tracking-tighter animate-pulse">PC-Link Actif</span>
                </div>
            </div>
            
            <div id="chat-messages" class="flex-1 overflow-y-auto space-y-4 pr-2 mb-6 no-scrollbar">
                <div class="flex flex-col gap-2 max-w-[85%]">
                    <div class="p-4 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none text-sm text-gray-300 leading-relaxed shadow-sm">
                        Bonjour ! Je suis Antigravity. Je suis prêt à gérer votre Lab. Dites-moi quel projet lancer ou quel dossier explorer.
                    </div>
                    <span class="text-[10px] text-gray-600 pl-2">ANTIGRAVITY • Maintenant</span>
                </div>
            </div>
            
            <div class="space-y-4 relative z-[60] bg-[#0b0e14] pb-10">
                <div class="flex flex-wrap gap-2">
                    <button onclick="window.app.handleCommand('Neural_DAW')" class="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 hover:border-accent hover:text-white transition-all">🚀 Lancer Neural_DAW</button>
                    <button onclick="window.app.handleCommand('vocal_studio')" class="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 hover:border-accent hover:text-white transition-all">🚀 Lancer vocal_studio</button>
                    <button onclick="window.app.handleCommand('lab')" class="px-4 py-2 bg-white/5 border border-white/5 rounded-xl text-[10px] font-bold text-gray-400 hover:border-accent hover:text-white transition-all">📂 Ouvrir d:\\lab</button>
                </div>
                
                <div class="relative group">
                    <input type="text" id="ai-input" placeholder="Écrivez votre commande ici..." class="w-full bg-[#1a1f26] border border-white/10 rounded-2xl px-6 py-4 pr-16 text-sm text-gray-200 outline-none focus:border-accent transition-all">
                    <button id="ai-send" class="absolute right-2 top-2 w-12 h-12 bg-accent text-white rounded-xl flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-105 active:scale-95 transition-all">
                        <span>→</span>
                    </button>
                </div>
            </div>
        `;
        
        chatCard.querySelector('.card-content').appendChild(chatContainer);
        this.blocksContainer.appendChild(chatCard);

        // Bind Chat Logic
        const input = document.getElementById('ai-input');
        const sendBtn = document.getElementById('ai-send');
        const messagesContainer = document.getElementById('chat-messages');

        const sendMessage = () => {
            if (!input.value.trim()) return;
            const text = input.value;
            
            // Add user message to UI
            const userMsg = document.createElement('div');
            userMsg.className = 'flex flex-col items-end gap-2 max-w-[85%] self-end ml-auto';
            userMsg.innerHTML = `
                <div class="p-4 bg-accent text-white rounded-2xl rounded-tr-none text-sm shadow-lg shadow-accent/20">
                    ${text}
                </div>
                <span class="text-[10px] text-gray-600 pr-2">VOUS • Maintenant</span>
            `;
            messagesContainer.appendChild(userMsg);
            
            input.value = '';
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

            // Simple Auto-Response
            setTimeout(() => {
                const botMsg = document.createElement('div');
                botMsg.className = 'flex flex-col gap-2 max-w-[85%]';
                botMsg.innerHTML = `
                    <div class="p-4 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none text-sm text-gray-300">
                        Analyse de votre commande en cours... Tout est synchronisé dans le Consortium.
                    </div>
                    <span class="text-[10px] text-gray-600 pl-2">ANTIGRAVITY • Maintenant</span>
                `;
                messagesContainer.appendChild(botMsg);
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
            }, 1000);
        };

        if (sendBtn) sendBtn.onclick = sendMessage;
        if (input) input.onkeydown = (e) => e.key === 'Enter' && sendMessage();
    }

    handleCommand(cmd) {
        if (cmd === 'lab') {
            this.state.activePage = 'projects';
        } else if (cmd === 'Neural_DAW' || cmd === 'vocal_studio') {
            this.state.activePage = 'projects';
            // On pourrait filtrer ou surligner ici
        }
        this.render();
        this.saveToStorage();
    }

    createCard(title, icon) {
        const div = document.createElement('div');
        div.className = 'card-glass p-6 md:p-8 flex flex-col gap-6 group relative overflow-hidden transition-all hover:border-white/10';
        div.innerHTML = `
            <div class="flex items-center justify-between relative z-10">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/5 group-hover:bg-accent/10 transition-colors">${icon}</div>
                    <h3 class="font-bold text-lg md:text-xl tracking-tight text-white/90">${title}</h3>
                </div>
                <button class="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">•••</button>
            </div>
            <div class="card-content relative z-10 flex-1"></div>
            <!-- Glow Effect -->
            <div class="absolute -top-24 -right-24 w-48 h-48 bg-accent/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        `;
        return div;
    }

    saveToStorage() {
        localStorage.setItem('consortium_data', JSON.stringify(this.state));
    }
}

// Lancement de l'application
window.onload = () => {
    window.app = new ConsortiumApp();
};
