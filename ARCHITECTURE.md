# 🏛️ ARCHITECTURE DU CONSORTIUM (v11.9)

Ce document détaille la conception logicielle du système "Tâches Journalières".

## 🧠 LE MOTEUR NOTION (BLOCK-ENGINE)
L'application repose sur une architecture par blocs éditables au lieu d'une structure HTML statique.

### 1. Structure des Blocs
Chaque bloc est un objet JSON stocké dans le `state` :
- `type` : header, text, todo, table, callout, divider, gallery.
- `content` : Le texte ou les données du bloc.
- `checked` : (Pour les todos) État de validation.

### 2. Système de Commande Slash (`/`)
Un écouteur `oninput` détecte le caractère `/` dans les blocs de texte. Il déclenche l'affichage d'un menu contextuel (`block-menu`) positionné dynamiquement selon les coordonnées du curseur.

### 3. Persistance (LocalStorage)
Toutes les modifications sont capturées via l'événement `onblur` (perte de focus) et sauvegardées immédiatement dans la clé `consortium_data`.

## 🛰️ PROTOCOLE DE SYNCHRONISATION (PC-LINK)
La synchronisation entre le PC local et le cloud (Vercel) est assurée par deux composants :
- **`SYNC.bat`** : Un script Windows qui tourne en boucle, effectuant des `git push` automatiques toutes les 60 secondes.
- **Service Worker (`sw.js`)** : Version v11.5 avec stratégie "Network-First", garantissant que les mises à jour de code sont appliquées instantanément sur mobile sans cache périmé.

## 🎨 DESIGN SYSTEM (MASTERWORK)
- **Glassmorphism** : Utilisation intensive de `backdrop-blur` et d'opacité `bg-white/5`.
- **Aesthetics** : Animations d'entrée en cascade et lueurs dynamiques au survol.
- **Réactivité** : Grid dynamique (1 à 3 colonnes) s'adaptant de l'iPhone au moniteur Ultra-Wide.

---
*Certifié par Antigravity sous Directives Suprêmes.*
