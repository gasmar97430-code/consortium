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

        if (this.state.currentPage === 'projects') {
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

    renderProjects() {
        const projects = [
            { name: 'DOC_JUCE', progress: 65 },
            { name: 'FICHIER POUR APP', progress: 40 },
            { name: 'Projets', progress: 20 },
            { name: 'taches_journaliere', progress: 95 },
            { name: 'MES IDS', progress: 10 },
            { name: 'IMAG_ICON', progress: 80 }
        ];

        projects.forEach(p => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-header">
                    <strong>${p.name}</strong>
                    <span>${p.progress}%</span>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${p.progress}%"></div>
                </div>
            `;
            this.blocksContainer.appendChild(card);
        });
    }

    renderChat() {
        const page = this.state.pages.chat;
        const chatContainer = document.createElement('div');
        chatContainer.className = 'flex flex-col gap-4';
        
        page.messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'self-end bg-accent text-white' : 'self-start bg-white/5 border border-white/10'}`;
            div.innerText = msg.text;
            chatContainer.appendChild(div);
        });

        const inputArea = document.createElement('div');
        inputArea.className = 'mt-8 sticky bottom-0 bg-dark/80 glass-blur pt-4';
        const input = document.createElement('input');
        input.className = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm outline-none focus:border-accent transition-all';
        input.placeholder = 'Message à Antigravity...';

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value) {
                const userText = input.value;
                page.messages.push({role: 'user', text: userText});
                input.value = '';
                
                // Simulate Antigravity response
                setTimeout(() => {
                    page.messages.push({role: 'bot', text: `J'ai bien reçu votre message concernant "${userText}". Je surveille l'avancement de vos projets dans le Lab.`});
                    this.render();
                    this.saveToStorage();
                }, 1000);

                this.render();
                this.saveToStorage();
            }
        });

        this.blocksContainer.appendChild(chatContainer);
        this.blocksContainer.appendChild(inputArea);
        inputArea.appendChild(input);
    }

    createBlockElement(block, index) {
        const div = document.createElement('div');
        div.className = `group relative p-2 rounded-lg transition-all hover:bg-white/5`;
        
        if (block.type === 'todo') {
            div.innerHTML = `
                <div class="flex items-start gap-3">
                    <input type="checkbox" ${block.checked ? 'checked' : ''} class="mt-1 w-5 h-5 accent-accent cursor-pointer">
                    <div class="flex-1">
                        <div contenteditable="true" class="todo-text outline-none ${block.checked ? 'line-through text-gray-500' : ''}">${block.content}</div>
                        <button class="toggle-notes text-[11px] text-accent/70 mt-1 hover:text-accent uppercase tracking-widest font-bold flex items-center gap-1">
                            <span>📝</span> Notes
                        </button>
                        <div class="notes-container ${block.notes ? '' : 'hidden'} mt-2">
                            <textarea class="w-full bg-black/20 border border-white/5 rounded-lg p-2 text-sm text-gray-400 outline-none focus:border-accent/30" placeholder="Notes riches...">${block.notes || ''}</textarea>
                        </div>
                    </div>
                </div>
            `;

            const checkbox = div.querySelector('input');
            const text = div.querySelector('.todo-text');
            const toggle = div.querySelector('.toggle-notes');
            const notesArea = div.querySelector('textarea');
            const notesContainer = div.querySelector('.notes-container');

            checkbox.addEventListener('change', () => {
                block.checked = checkbox.checked;
                text.classList.toggle('line-through', block.checked);
                text.classList.toggle('text-gray-500', block.checked);
                this.saveToStorage();
            });

            text.addEventListener('input', () => {
                block.content = text.innerText;
                this.saveToStorage();
            });

            toggle.addEventListener('click', () => notesContainer.classList.toggle('hidden'));
            
            notesArea.addEventListener('input', () => {
                block.notes = notesArea.value;
                this.saveToStorage();
            });

        } else if (block.type === 'table') {
            const table = document.createElement('table');
            table.className = 'w-full border-collapse border border-white/10 text-sm mt-4 rounded-xl overflow-hidden';
            
            block.content.forEach((row, rIdx) => {
                const tr = document.createElement('tr');
                row.forEach((cell, cIdx) => {
                    const el = rIdx === 0 ? document.createElement('th') : document.createElement('td');
                    el.className = `border border-white/10 p-3 text-left ${rIdx === 0 ? 'bg-white/5 text-gray-400 uppercase text-[10px] tracking-widest' : ''}`;
                    el.contentEditable = true;
                    el.innerText = cell;
                    el.addEventListener('input', () => {
                        block.content[rIdx][cIdx] = el.innerText;
                        this.saveToStorage();
                    });
                    tr.appendChild(el);
                });
                table.appendChild(tr);
            });
            div.appendChild(table);
        } else if (block.type === 'header') {
            div.innerHTML = `<div contenteditable="true" class="text-2xl font-bold mt-6 mb-2 outline-none">${block.content}</div>`;
            div.querySelector('div').addEventListener('input', (e) => {
                block.content = e.target.innerText;
                this.saveToStorage();
            });
        } else {
            div.innerHTML = `<div contenteditable="true" class="outline-none text-gray-300 leading-relaxed">${block.content}</div>`;
            div.querySelector('div').addEventListener('input', (e) => {
                block.content = e.target.innerText;
                this.saveToStorage();
            });
        }

        // Handle
        const handle = document.createElement('div');
        handle.className = 'absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 cursor-grab text-gray-600 text-xs';
        handle.innerText = '⋮⋮';
        div.appendChild(handle);

        return div;
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
