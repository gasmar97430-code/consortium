# Guide de Déploiement Gratuit (Vercel / Netlify)

Ce guide vous explique comment mettre votre Consortium en ligne gratuitement pour pouvoir l'installer sur votre téléphone.

## Étape 1 : Mettre le code sur GitHub

1.  Créez un compte sur [GitHub](https://github.com/) si ce n'est pas déjà fait.
2.  Créez un nouveau dépôt (repository) nommé `consortium`.
3.  Dans votre dossier local `d:\lab\taches_journaliere`, initialisez git :
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    ```
4.  Liez votre dépôt local à GitHub (remplacez `USER` par votre nom d'utilisateur) :
    ```bash
    git remote add origin https://github.com/USER/consortium.git
    git push -u origin main
    ```

## Étape 2 : Déployer sur Vercel (Gratuit & Ultra Rapide)

1.  Connectez-vous sur [Vercel.com](https://vercel.com/) avec votre compte GitHub.
2.  Cliquez sur **"Add New"** > **"Project"**.
3.  Vercel va lister vos dépôts GitHub. Cliquez sur **"Import"** à côté de votre dépôt `consortium`.
4.  Dans l'écran de configuration, **ne changez rien**. Vercel détectera automatiquement qu'il s'agit d'un projet HTML statique.
5.  Cliquez sur **"Deploy"**.
6.  En moins d'une minute, votre application sera en ligne à une adresse du type `https://consortium-votre-nom.vercel.app`.

> [!TIP]
> Chaque fois que vous ferez un `git push` sur GitHub, Vercel mettra à jour votre application automatiquement en quelques secondes !

## Étape 3 : Installer sur votre téléphone

1.  Ouvrez l'URL de votre site sur votre smartphone (Chrome sur Android ou Safari sur iPhone).
2.  **Sur Android (Chrome) :** Cliquez sur les trois petits points en haut à droite et choisissez **"Installer l'application"** ou **"Ajouter à l'écran d'accueil"**.
3.  **Sur iPhone (Safari) :** Cliquez sur l'icône de partage (le carré avec une flèche vers le haut) et choisissez **"Sur l'écran d'accueil"**.

## Étape 4 : Forcer la mise à jour sur Mobile

Si vous ne voyez pas les dernières modifications (le design ne change pas), c'est que le cache du Service Worker est bloqué.

1.  **Méthode Rapide** : Rafraîchissez la page en glissant vers le bas.
2.  **Méthode Radicale** : 
    - Fermez complètement l'application.
    - Videz l'onglet Chrome/Safari ou désinstallez/réinstallez l'icône de l'écran d'accueil.
3.  **Note technique** : Antigravity incrémente automatiquement la version dans `sw.js` pour forcer cette mise à jour.

L'application apparaîtra maintenant comme une icône sur votre téléphone, fonctionnera en plein écran et pourra même être utilisée hors ligne grâce au Service Worker !
