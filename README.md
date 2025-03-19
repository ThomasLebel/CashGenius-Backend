
# 🧞 Cash Genius - Programme Paris Sportifs - Backend

**Cash Genius** est un site qui présente un programme d'optimisation des offres de bienvenue des sites de paris sportifs en France. Le site est totalement **responsive** et possède **un comparateur de bonus, des vidéos tuto et un système de parrainage** .

## 🚀 Démo en ligne
🔗 Site déployé : [cash-genius.vercel.app](https://cash-genius.vercel.app/)\
📹 Vidéo démo : [voir la vidéo démo](https://vimeo.com/1057419477/b7ab82236b)\
🛠️ Repo Frontend : [Accéder au repo frontend](https://github.com/ThomasLebel/CashGenius-Frontend)

## 🧱 Stack technique

| Frontend  | Backend | Base de données | Autres services |
| -------- |-------| ---------------| ---------------|
|Next.js 12|Node.js|MongoDB (Utilisateurs & annonces)| Nodemailer (Envoi d'email)|
|React 18|Express.js|| Vercel (Déploiement)|


## ⚙️ Fonctionnalités techniques

### API & Base de données
- **Express.js** : API REST pour gérer les utilisateurs, inscriptions, emails, etc.
- **MongoDB + Mongoose** : base de données NoSQL avec schémas, validations et requêtes optimisées.

### Authentification & Sécurité
- **Hash des mots de passe** avec `bcrypt` pour sécuriser les données sensibles.
- **Token d’identification** généré via `uid2` pour authentifier les utilisateurs.
- **Cookies sécurisés** gérés avec `cookie-parser`.
- **CORS** configuré avec `cors` pour contrôler les accès au serveur.
- **Variables d’environnement** via `dotenv` pour protéger les données sensibles (API keys, config).

### Emails & Notifications
- **Envoi d’emails** via `nodemailer` (ex : confirmation d’inscription, récupération de compte, etc.).

### Développement & Tests
- **Logs HTTP** avec `morgan` pour surveiller les requêtes entrantes.
- **Tests automatisés** avec `jest` + `supertest` pour valider les routes et les fonctionnalités.
- **Rechargement auto en développement** via `nodemon`.

## ⚡ API Endpoints

### 🙋‍♂️ Routes Users
|Méthode|Route|Fonction|
|-------|-----|--------|
|`POST`|`/users/signup`|Inscription d'un utilisateur au programme d'affiliation : génération d'un token + hashage du mot de passe.|
|`POST`|`/users/signin`|Connexion d'un utilisateur via pseudo ou email + mot de passe.|
|`PUT`|`/users/changeReferralCode`|Modification du code de parrainage|
|`POST`|`/users/addClick`|Incrémentation du nombre de clic lors de la visiste du lien de parrainage|
|`GET`|`/users/:userToken`|Récupération de l'ensemble des infos de l'affilié|
---
### 🤝 Routes Applicants
|Méthode|Route|Fonction|
|-------|-----|--------|
|`POST`|`/applicants/signup`| - Inscription d'un utilisateur au coaching <br/> - Vérification présence code de parrainage <br/> - Envoi d'un mail de confirmation d'inscription à l'utilisateur  <br/> - Envoi d'un mail de notification au coach|


## 👨‍💻 Auteur
Thomas Lebel\
🔗 [Linkedin](https://www.linkedin.com/in/thomas-lebel-6047ba129/)\
📫Contact : thomas.lebel38@gmail.com


