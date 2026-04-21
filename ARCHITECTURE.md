# 🏗️ Architecture Software : Consortium v9.7

Ce document détaille la philosophie de conception et les flux logiques du système.

## 🧠 1. Le Moteur d'État (State Management)
L'application repose sur un **État Unique (Single Source of Truth)**. Toutes les données (page active, chemin actuel, historique du chat) sont stockées dans l'objet `this.state`.

- **Persistance** : Chaque modification de l'état déclenche `this.saveToStorage()`, garantissant qu'aucune donnée n'est perdue entre deux sessions.
- **Initialisation** : Au lancement, le constructeur tente de restaurer l'état précédent ou charge une configuration par défaut sécurisée.

## 🧭 2. Routage Dynamique & Rendu
Le Consortium n'utilise pas de liens HTML classiques (`<a>`). Il utilise un **Routeur Interne** basé sur la méthode `render()`.

1. **Interception** : Un clic sur la Sidebar change `this.state.activePage`.
2. **Nettoyage** : `render()` vide le conteneur principal.
3. **Dispatch** : Selon la page active, il appelle le sous-moteur correspondant (`renderHome`, `renderProjects`, etc.).
4. **Injection** : Le HTML est généré dynamiquement et injecté dans le DOM.

## 🤖 3. Pipeline Antigravity (Command Protocol)
Le dialogue avec l'IA suit un cycle de validation rigoureux :
1. **Input** : Réception du texte via `ai-input`.
2. **Historisation** : Enregistrement immédiat dans `chatHistory` (pour la persistance).
3. **Traitement** : Analyse par `handleCommand(cmd)`.
4. **Interception de Mots-Clés** : Détection des tokens de validation (`YES`, `ACCEPT`, `RUN`).
5. **Réponse** : Génération d'une réponse technique validant l'ordre.

## 📂 4. Système d'Exploration Windows-Style
L'Explorer utilise une logique de **Path-Splitting** :
- **Chemin** : Stocké sous forme de string Windows (`D:\lab\Projets`).
- **Breadcrumbs** : Générés par un `split('\\')` dynamique pour permettre une navigation par "miettes de pain".
- **Navigation Parent** : Calculée par `substring` pour assurer une remontée d'un seul cran à la fois.

## 🚀 5. Performance & PWA
- **Zéro-Dépendance** : Aucun framework lourd (React/Vue). Utilisation de Vanilla JS pour une latence nulle.
- **Service Worker** : Stratégie *Cache-First* pour un chargement instantané, avec bypass automatique lors de la détection d'une nouvelle version (`checkVersion`).

---
*Manifeste rédigé par le Cerveau Antigravity - Binôme Masterwork*
