/**
 * Consortium Workspace Engine
 * Handles blocks, persistence, and Omnibox search.
 */

class ConsortiumApp {
    constructor() {
        this.blocksContainer = document.getElementById('blocks-container');
        this.omnibox = document.getElementById('omnibox');
        this.addBlockBtn = document.getElementById('add-block-btn');
        this.blockMenu = document.getElementById('block-menu');
        this.pageTitle = document.getElementById('page-title');
        this.sidebar = document.getElementById('sidebar');
        this.menuToggle = document.getElementById('menu-toggle');
        this.closeSidebar = document.getElementById('close-sidebar');
        this.installBtn = document.getElementById('install-btn');
        this.deferredPrompt = null;
        
        this.state = {
            currentPage: 'home',
            pages: {
                home: {
                    title: 'Bienvenue dans le Consortium',
                    blocks: [
                        { type: 'header', content: 'Prise en main' },
                        { type: 'text', content: 'Ceci est votre nouvel espace de travail partagé.' },
                        { type: 'todo', content: 'Explorer les fonctionnalités', checked: false }
                    ]
                },
                tasks: { title: 'Mes Tâches', blocks: [] },
                projects: { title: 'Projets (Lab)', blocks: [], localProjects: [] },
                chat: { title: 'Chat avec Antigravity', blocks: [], messages: [{role: 'bot', text: 'Bonjour ! Comment puis-je vous aider aujourd\'hui dans votre Consortium ?'}] },
                archive: { title: 'Archive', blocks: [] }
            }
        };

        this.init();
    }

    init() {
        console.log('Consortium Engine v2.1 - Loading...');
        this.loadFromStorage();
        this.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Omnibox
        this.omnibox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const query = this.omnibox.value.trim();
                if (query.startsWith('http') || query.includes('.')) {
                    window.open(query.startsWith('http') ? query : `https://${query}`, '_blank');
                } else if (query) {
                    window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
                }
                this.omnibox.value = '';
            }
        });

        // Add Block Menu
        this.addBlockBtn.addEventListener('click', (e) => {
            const rect = this.addBlockBtn.getBoundingClientRect();
            this.blockMenu.style.left = `${rect.left}px`;
            this.blockMenu.style.top = `${rect.top - this.blockMenu.offsetHeight - 10}px`;
            this.blockMenu.classList.toggle('hidden');
        });

        // Menu Items
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const type = item.dataset.type;
                this.addBlock(type);
                this.blockMenu.classList.add('hidden');
            });
        });

        // Sidebar Navigation
        document.querySelectorAll('.sidebar-nav li').forEach(li => {
            li.addEventListener('click', () => {
                const pageId = li.dataset.page;
                this.switchPage(pageId);
                
                document.querySelectorAll('.sidebar-nav li').forEach(l => l.classList.remove('active'));
                li.classList.add('active');
                this.sidebar.classList.remove('open');
            });
        });

        // Mobile Toggles
        this.menuToggle.addEventListener('click', () => this.sidebar.classList.add('open'));
        this.closeSidebar.addEventListener('click', () => this.sidebar.classList.remove('open'));

        // PWA Install logic
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            this.deferredPrompt = e;
            this.installBtn.classList.remove('hidden');
        });

        this.installBtn.addEventListener('click', async () => {
            if (this.deferredPrompt) {
                this.deferredPrompt.prompt();
                const { outcome } = await this.deferredPrompt.userChoice;
                if (outcome === 'accepted') {
                    this.installBtn.classList.add('hidden');
                }
                this.deferredPrompt = null;
            }
        });

        window.addEventListener('appinstalled', () => {
            this.installBtn.classList.add('hidden');
            console.log('PWA installed');
        });

        // Bottom Nav (Mobile)
        document.querySelectorAll('#bottom-nav button').forEach(btn => {
            btn.addEventListener('click', () => {
                const pageId = btn.dataset.page;
                this.switchPage(pageId);
                
                // Update icons colors
                document.querySelectorAll('#bottom-nav button').forEach(b => {
                    b.classList.remove('text-accent');
                    b.classList.add('text-gray-500');
                });
                btn.classList.add('text-accent');
                btn.classList.remove('text-gray-500');
            });
        });

        // Auto-save on any change
        this.blocksContainer.addEventListener('input', () => this.saveToStorage());
        this.pageTitle.addEventListener('input', () => {
            this.state.pages[this.state.currentPage].title = this.pageTitle.innerText;
            this.saveToStorage();
        });

        // Close menu on click outside
        window.addEventListener('click', (e) => {
            if (!this.addBlockBtn.contains(e.target) && !this.blockMenu.contains(e.target)) {
                this.blockMenu.classList.add('hidden');
            }
        });
    }

    switchPage(pageId) {
        this.state.currentPage = pageId;
        this.render();
    }

    addBlock(type, content = '') {
        const page = this.state.pages[this.state.currentPage];
        let newBlock = { type, content: content || this.getDefaultContent(type) };
        if (type === 'todo') newBlock.checked = false;
        
        page.blocks.push(newBlock);
        this.render();
        this.saveToStorage();
    }

    getDefaultContent(type) {
        switch(type) {
            case 'header': return 'Nouveau Titre';
            case 'todo': return 'Nouvelle tâche';
            case 'table': return [['Col 1', 'Col 2'], ['', '']];
            default: return 'Commencez à écrire...';
        }
    }

    render() {
        const page = this.state.pages[this.state.currentPage];
        this.pageTitle.innerText = page.title;
        this.blocksContainer.innerHTML = '';

        if (this.state.currentPage === 'home') {
            this.renderDashboard();
        } else if (this.state.currentPage === 'projects') {
            this.renderProjects();
        } else if (this.state.currentPage === 'chat') {
            this.renderChat();
        } else {
            page.blocks.forEach((block, index) => {
                const blockEl = this.createBlockElement(block, index);
                this.blocksContainer.appendChild(blockEl);
            });
        }
    }

    renderDashboard() {
        // To-do List Card
        const todoCard = this.createCard('To-do List', '📝');
        const todoList = document.createElement('div');
        todoList.className = 'space-y-4';
        const tasks = [
            { text: 'Collater une commentiale', checked: true, tag: '🚩' },
            { text: 'Eviter des missions', checked: false, tag: '4 mon', tagColor: 'text-pink-500' },
            { text: 'Resquer les doaveloppnoets', checked: false, tag: '🕒 12 mar', tagColor: 'text-gray-500' },
            { text: 'Contir la scontent', checked: false, tag: '🕒 23 mas', tagColor: 'text-gray-500' },
            { text: 'Deliter les profiction', checked: false, tag: '🕒 30 min', tagColor: 'text-gray-500' },
            { text: 'Activer un fection', checked: false, tag: '🚩' }
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
        footerInput.innerHTML = `<span class="text-xs">Actions de mtrts...</span> <span class="text-sm">→</span>`;
        
        todoCard.querySelector('.card-content').appendChild(todoList);
        todoCard.querySelector('.card-content').appendChild(footerInput);
        this.blocksContainer.appendChild(todoCard);

        // Project Progress Card
        const progressCard = this.createCard('Project Progress', '📊');
        const progressList = document.createElement('div');
        progressList.className = 'space-y-8';
        const projects = [
            { name: 'Current project', progress: 80 },
            { name: 'Project progress', progress: 20 },
            { name: 'Dainert project', progress: 75 }
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
        actionBtn.className = 'mt-10 w-fit px-6 py-3 bg-accent/20 border border-accent/20 text-accent rounded-2xl text-xs font-bold flex items-center gap-3 hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/10';
        actionBtn.innerHTML = `<span class="text-lg">+</span> Recuperer`;
        
        progressCard.querySelector('.card-content').appendChild(progressList);
        progressCard.querySelector('.card-content').appendChild(actionBtn);
        this.blocksContainer.appendChild(progressCard);
    }

    renderProjects() {
        const projectsCard = this.createCard('All Projects', '📁');
        const list = document.createElement('div');
        list.className = 'grid grid-cols-1 md:grid-cols-2 gap-4';
        
        const projects = [
            { name: 'DOC_JUCE', progress: 65, status: 'Active' },
            { name: 'FICHIER APP', progress: 40, status: 'Pending' },
            { name: 'Studio Mobile', progress: 95, status: 'Review' },
            { name: 'Consortium', progress: 80, status: 'Live' }
        ];

        projects.forEach(p => {
            const item = document.createElement('div');
            item.className = 'p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/30 transition-all';
            item.innerHTML = `
                <div class="flex justify-between items-center mb-3">
                    <span class="font-bold text-sm">${p.name}</span>
                    <span class="text-[10px] px-2 py-0.5 rounded-full bg-accent/10 text-accent uppercase font-bold">${p.status}</span>
                </div>
                <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <div class="h-full bg-accent shadow-[0_0_10px_rgba(125,95,255,0.5)]" style="width: ${p.progress}%"></div>
                </div>
            `;
            list.appendChild(item);
        });
        projectsCard.querySelector('.card-content').appendChild(list);
        this.blocksContainer.appendChild(projectsCard);
    }

    renderChat() {
        const page = this.state.pages.chat;
        const chatCard = this.createCard('AI Assistant', '🤖');
        chatCard.className += ' lg:col-span-2'; // Chat takes full width
        
        const container = document.createElement('div');
        container.className = 'flex flex-col gap-6 h-[400px] overflow-y-auto no-scrollbar mb-6 p-2';
        
        page.messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'self-end bg-accent text-white shadow-lg shadow-accent/20' : 'self-start bg-white/5 border border-white/10 text-gray-300'}`;
            div.innerText = msg.text;
            container.appendChild(div);
        });

        const inputWrapper = document.createElement('div');
        inputWrapper.className = 'relative flex items-center';
        const input = document.createElement('input');
        input.className = 'w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-accent/50 transition-all pr-12';
        input.placeholder = 'Type a message...';
        
        const sendBtn = document.createElement('button');
        sendBtn.className = 'absolute right-4 text-accent hover:scale-110 transition-transform';
        sendBtn.innerHTML = '➤';

        const sendMessage = () => {
            if (!input.value.trim()) return;
            const text = input.value;
            page.messages.push({role: 'user', text});
            input.value = '';
            this.render();
            
            setTimeout(() => {
                page.messages.push({role: 'bot', text: "Analyzing your request... Everything is synced in the Consortium."});
                this.render();
                this.saveToStorage();
            }, 800);
            this.saveToStorage();
        };

        input.addEventListener('keydown', (e) => e.key === 'Enter' && sendMessage());
        sendBtn.addEventListener('click', sendMessage);

        chatCard.querySelector('.card-content').appendChild(container);
        chatCard.querySelector('.card-content').appendChild(inputWrapper);
        inputWrapper.appendChild(input);
        inputWrapper.appendChild(sendBtn);
        
        this.blocksContainer.appendChild(chatCard);
    }

    createCard(title, icon) {
        const div = document.createElement('div');
        div.className = 'card-glass p-8 flex flex-col gap-6 group relative overflow-hidden';
        div.innerHTML = `
            <div class="flex items-center justify-between relative z-10">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl shadow-inner border border-white/5">${icon}</div>
                    <h3 class="font-bold text-xl tracking-tight text-white/90">${title}</h3>
                </div>
                <button class="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center text-gray-500 hover:text-white transition-all">•••</button>
            </div>
            <div class="card-content relative z-10"></div>
            <!-- Background Decoration -->
            <div class="absolute -top-10 -right-10 w-32 h-32 bg-accent/5 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
        `;
        return div;
    }

    createBlockElement(block, index) {
        const card = this.createCard(block.type.toUpperCase(), '📄');
        const content = card.querySelector('.card-content');
        
        const editor = document.createElement('div');
        editor.contentEditable = true;
        editor.className = 'outline-none text-gray-300 min-h-[100px]';
        editor.innerText = block.content;
        editor.addEventListener('input', () => {
            block.content = editor.innerText;
            this.saveToStorage();
        });
        
        content.appendChild(editor);
        return card;
    }

    saveToStorage() {
        localStorage.setItem('consortium_data', JSON.stringify(this.state));
    }

    loadFromStorage() {
        const data = localStorage.getItem('consortium_data');
        if (data) {
            const savedState = JSON.parse(data);
            // Merge saved pages with default pages to ensure new features appear
            this.state.pages = { ...this.state.pages, ...savedState.pages };
            this.state.currentPage = savedState.currentPage || 'home';
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    window.app = new ConsortiumApp();
});
