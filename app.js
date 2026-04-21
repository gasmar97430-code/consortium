class ConsortiumApp {
    constructor() {
        this.version = "9.0";
        this.checkVersion();

        this.state = JSON.parse(localStorage.getItem('consortium_data')) || {
            activePage: 'home',
            currentPath: 'D:\\lab\\Projets',
            pages: {
                home: { title: 'Dashboard', icon: '🏠' },
                projects: { title: 'EXPLORER', icon: '📂' },
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
        
        // Global Search Logic
        const globalSearch = document.getElementById('global-search');
        if (globalSearch) {
            globalSearch.oninput = (e) => {
                const term = e.target.value.toLowerCase();
                if (term) {
                    this.state.activePage = 'projects';
                    this.render();
                    const rows = document.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const name = row.querySelector('td span')?.innerText.toLowerCase() || "";
                        row.style.display = name.includes(term) ? '' : 'none';
                    });
                } else {
                    this.render();
                }
            };
        }
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

        // Antigravity Direct Chat Card
        this.renderAI();

        // Masterwork Gallery
        this.renderGallery();
    }

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
        
        this.pageTitle.innerText = "Bienvenue";
        this.blocksContainer.innerHTML = '';
        this.blocksContainer.className = "lg:col-span-2 flex flex-col lg:flex-row gap-6 w-full min-h-[500px] bg-[#0b0e14] border border-white/5 rounded-3xl overflow-hidden mb-20";

        // Windows Sidebar (Quick Access)
        const sidebar = document.createElement('div');
        sidebar.className = "w-full lg:w-64 bg-black/20 border-b lg:border-b-0 lg:border-r border-white/5 p-4 flex flex-row lg:flex-col gap-4 overflow-x-auto lg:overflow-x-hidden no-scrollbar";
        sidebar.innerHTML = `
            <div class="flex-shrink-0 flex flex-col gap-2 min-w-[120px]">
                <p class="text-[9px] font-bold text-gray-600 uppercase tracking-widest pl-2 mb-1">Accès Rapide</p>
                <div onclick="window.app.renderProjects('D:\\\\lab')" class="flex items-center gap-3 p-3 ${this.state.currentPath === 'D:\\lab' ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:bg-white/5'} rounded-xl cursor-pointer transition-all text-xs">📂 Lab (D:)</div>
            </div>
            <div class="flex-shrink-0 flex flex-col gap-2 min-w-[120px]">
                <p class="text-[9px] font-bold text-gray-600 uppercase tracking-widest pl-2 mb-1">Ce PC</p>
                <div onclick="window.app.renderProjects('C:\\\\')" class="flex items-center gap-3 p-3 ${this.state.currentPath === 'C:\\' ? 'bg-accent/10 text-accent' : 'text-gray-400 hover:bg-white/5'} rounded-xl cursor-pointer transition-all text-xs">💽 System (C:)</div>
            </div>
        `;

        // Main List View
        const mainView = document.createElement('div');
        mainView.className = "flex-1 flex flex-col overflow-hidden";
        
        // Address Bar (Breadcrumbs)
        const addressBar = document.createElement('div');
        addressBar.className = "p-4 border-b border-white/5 bg-white/5 flex items-center gap-4";
        addressBar.innerHTML = `
            <div class="flex gap-2">
                <button onclick="window.app.renderProjects('D:\\\\lab')" class="w-8 h-8 rounded-lg bg-black/20 flex items-center justify-center text-gray-400 hover:text-white transition-all">↑</button>
            </div>
            <div class="flex-1 bg-black/60 rounded-lg px-4 py-2 text-[11px] font-mono text-gray-100 flex items-center gap-2 overflow-x-auto no-scrollbar whitespace-nowrap border border-white/10 shadow-inner">
                ${this.state.currentPath.split('\\').filter(x => x).map((p, i, arr) => `
                    <span class="hover:text-accent cursor-pointer transition-colors" onclick="window.app.renderProjects('${arr.slice(0, i+1).join('\\\\')}')">${p}</span>
                `).join('<span class="text-gray-500 mx-2 font-bold text-base">›</span>')}
            </div>
        `;

        // File List (Table style)
        const fileList = document.createElement('div');
        fileList.className = "flex-1 overflow-y-auto no-scrollbar pb-10";
        
        let currentFolders = [];
        const pathLower = this.state.currentPath.toLowerCase();
        
        if (pathLower === 'd:\\lab') {
            currentFolders = ["Projets"];
        } else if (pathLower.includes('projets')) {
            currentFolders = ["Neural_DAW", "lutherie_app", "vocal_studio", "dj_hybride", "bleachbit-dashboard", "cam_spy"];
        } else if (pathLower === 'c:\\') {
            currentFolders = ["Windows", "Program Files", "Users"];
        } else {
            currentFolders = ["Projets", "Apps", "Work"];
        }

        const table = document.createElement('table');
        table.className = "w-full text-left text-[11px]";
        table.innerHTML = `
            <thead class="sticky top-0 bg-[#0b0e14] text-gray-500 border-b border-white/5 z-10">
                <tr>
                    <th class="p-4 font-bold uppercase tracking-tighter">Nom</th>
                    <th class="p-4 font-bold uppercase tracking-tighter hidden md:table-cell">Type</th>
                    <th class="p-4 font-bold uppercase tracking-tighter text-right">Action</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
                ${currentFolders.map(name => `
                    <tr class="hover:bg-accent/5 transition-all group">
                        <td class="p-4 flex items-center gap-3 cursor-pointer" onclick="window.app.renderProjects('${this.state.currentPath + (this.state.currentPath.endsWith('\\') ? '' : '\\') + name}')">
                            <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl group-hover:bg-accent/20 transition-all shadow-inner">📁</div>
                            <span class="text-gray-300 font-bold group-hover:text-accent transition-colors tracking-tight">${name}</span>
                        </td>
                        <td class="p-4 text-gray-500 font-medium hidden md:table-cell uppercase text-[9px] tracking-widest">${name.toLowerCase().includes('app') ? 'System App' : 'Project Folder'}</td>
                        <td class="p-4 text-right">
                            <button class="px-6 py-2.5 bg-accent/20 border border-accent/30 text-accent rounded-xl text-[10px] font-black uppercase hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/5 hover:shadow-accent/20 active:scale-95">
                                🚀 LANCER
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        `;

        fileList.appendChild(table);
        mainView.appendChild(addressBar);
        mainView.appendChild(fileList);
        
        this.blocksContainer.appendChild(sidebar);
        this.blocksContainer.appendChild(mainView);
    }

    renderTasks() {
        this.pageTitle.innerText = "Tasks Management";
        this.blocksContainer.innerHTML = '';
        const card = this.createCard('Journal de bord', '📋');
        card.querySelector('.card-content').innerHTML = `<p class="text-gray-500 italic">Vos tâches sont synchronisées avec Antigravity.</p>`;
        this.blocksContainer.appendChild(card);
    }

    renderGallery() {
        const galleryCard = this.createCard('Visual Gallery', '🖼️');
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'grid grid-cols-2 gap-4 mt-2';
        
        const images = [
            { url: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=400', title: 'Neural Space' },
            { url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400', title: 'Lab Core' },
            { url: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=400', title: 'Vocal Studio' },
            { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=400', title: 'Design System' }
        ];

        images.forEach(img => {
            const item = document.createElement('div');
            item.className = 'relative group rounded-2xl overflow-hidden aspect-square border border-white/5 shadow-xl transition-all hover:border-accent/30';
            item.innerHTML = `
                <img src="${img.url}" class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <p class="text-[10px] font-bold text-white uppercase tracking-widest">${img.title}</p>
                </div>
            `;
            galleryGrid.appendChild(item);
        });

        galleryCard.querySelector('.card-content').appendChild(galleryGrid);
        this.blocksContainer.appendChild(galleryCard);
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

            // Use actual command handler
            setTimeout(() => {
                const response = this.handleCommand(text);
                const botMsg = document.createElement('div');
                botMsg.className = 'flex flex-col gap-2 max-w-[85%]';
                botMsg.innerHTML = `
                    <div class="p-4 bg-white/5 border border-white/5 rounded-2xl rounded-tl-none text-sm text-gray-300">
                        ${response}
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
        const cleanCmd = cmd.toUpperCase().trim();
        
        if (cleanCmd === 'YES' || cleanCmd === 'ACCEPT' || cleanCmd === 'RUN') {
            return "✅ ORDRE REÇU. Initialisation de la séquence sur le PC local... [SYNC_SUCCESS]";
        }

        if (cleanCmd === 'LAB' || cleanCmd === 'EXPLORER') {
            this.state.activePage = 'projects';
            this.render();
            return "📂 Navigation vers l'EXPLORER active.";
        }

        return "🤖 Commande reçue : " + cmd + ". Analyse en cours...";
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

    checkVersion() {
        const lastVersion = localStorage.getItem('app_version');
        const currentVersion = parseFloat(this.version);
        const storedVersion = parseFloat(lastVersion || "0");

        if (lastVersion && currentVersion > storedVersion) {
            console.log("Nouvelle version détectée : " + this.version + ". Mise à jour...");
            localStorage.setItem('app_version', this.version);
            location.reload();
        } else {
            localStorage.setItem('app_version', this.version);
        }
    }

    saveToStorage() {
        localStorage.setItem('consortium_data', JSON.stringify(this.state));
    }
}

// Lancement de l'application
window.onload = () => {
    window.app = new ConsortiumApp();
};
