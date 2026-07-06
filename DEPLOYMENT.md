# Guide de Déploiement - BEVULTA (Vercel & Supabase)

Ce guide décrit les étapes pour déployer la plateforme web **BEVULTA** en production, avec le frontend hébergé sur **Vercel** et la base de données relationnelle & authentification sur **Supabase**.

---

## 🛠️ Étape 1 : Configuration de Supabase (Base de données & Auth)

1. Rendez-vous sur [Supabase](https://supabase.com/) et créez un compte gratuit si ce n'est pas déjà fait.
2. Créez un **Nouveau Projet** (ex: `bevulta-platform`). Définissez un mot de passe pour la base de données et choisissez une région proche (ex: Europe West ou US East).
3. Une fois le projet provisionné, accédez à l'onglet **SQL Editor** dans le menu latéral gauche.
4. Cliquez sur **New Query**, puis ouvrez et copiez le contenu du fichier local :
   👉 [database.sql](file:///c:/Users/Admin/Downloads/bevulta/supabase/database.sql)
5. Collez le code SQL dans l'éditeur de Supabase et cliquez sur **Run**.
   *Cela va créer automatiquement toutes les tables (`profiles`, `products`, `orders`, `order_items`, `messages`, `settings`), le trigger d'authentification des profils ainsi que toutes les politiques de sécurité (RLS).*

---

## 📦 Étape 2 : Insertion des données initiales (Catalogue de Machines)

Pour insérer les 16 machines réelles de BEVULTA directement en base de données, exécutez la requête SQL d'insertion suivante dans le **SQL Editor** de Supabase :

```sql
INSERT INTO public.products (name, category, description, price_fcfa, price_eur, availability, image_url, specs)
VALUES
('Complexe de Karité', 'agro-alimentaire', 'Machine industrielle combinée intégrant un poste de concassage et un poste de broyage. Idéale pour les coopératives et usines produisant du beurre de karité de qualité supérieure.', 1600000, 2443, 'Sur commande (15-30 jours)', 'http://bevulta.com/images/stories/machines/complexe%20de%20karit.jpg', '{"Postes de travail": "Concassage + Broyage", "Motorisation": "Thermique Diesel 12 CV (SIFANG S1100GNM, 2000 trs/min)", "Système de démarrage": "Manuel ou Automatique (démarreur électrique avec batterie 12V)", "Matériau": "Acier mécano-soudé A33 renforcé", "Capacité Concassage": "500 kg / heure", "Capacité Broyage": "80 à 100 kg / heure", "Dimensions": "1.80m x 1.20m x 1.40m"}'),

('Baratteuse de Crème de Karité', 'agro-alimentaire', 'Machine spécialement conçue pour le barattage mécanique de la crème de karité. Le barattage est obtenu de façon homogène par rotation de palettes profilées à l''intérieur du cylindre.', 450000, 688, 'En stock / Sur commande', 'http://bevulta.com/images/stories/machines/barateuse.jpg', '{"Capacité de charge": "25 kg de crème par cycle", "Motorisation": "Thermique 6 CV ou Électrique 3 CV (n=1500 trs/min)", "Matériau": "Acier structural A33 alimentaire ou inoxydable (sur option)", "Principe": "Rotation de palettes de barattage axiales", "Encombrement": "1.20m x 1.00m x 1.00m"}'),

('Torréfacteur à Tambour', 'agro-alimentaire', 'Torréfacteur rotatif pour le traitement des amandes de karité, graines de soja, café, arachides, etc. Offre une cuisson uniforme et conserve les arômes grâce à sa vitesse de rotation optimisée.', 600000, 917, 'Sur commande (15 jours)', 'http://bevulta.com/images/stories/machines/torrfacteur.jpg', '{"Capacité de production": "150 à 200 kg / heure", "Motorisation": "Électrique 1.5 CV (n=1500 trs/min)", "Vitesse du tambour": "25 trs/min", "Combustible": "Bois, Charbon ou Coques recyclées", "Matériau": "Tôle d''acier thermo-résistante"}'),

('Moteur Diesel Sifang S1100GNM', 'specialites', 'Moteur diesel monocylindre à plat, réputé pour sa robustesse légendaire et sa grande efficacité énergétique. Idéal pour actionner broyeurs, moulins, alternateurs et pompes agricoles.', 600000, 916, 'En stock', 'http://bevulta.com/images/stories/machines/moteur%20diesel%20de%20puissance%2016%20cv.jpg', '{"Marque / Modèle": "SIFANG S1100GNM", "Puissance continue": "12 CV (Vitesse : 2200 trs/min)", "Carburant": "Gazole (Diesel)", "Système de démarrage": "Manuel (manivelle de sécurité) ou Démarreur automatique 12V", "Poids net": "165 kg", "Encombrement": "920mm x 500mm x 600mm", "Accessoires inclus": "Valisette comprenant un jeu de rechanges électriques (3 clés), une manivelle, trousseau d''outils et joint de culasse supplémentaire"}'),

('Extracteur de Jus de Canne à Sucre', 'agro-alimentaire', 'Presse-extracteur à haut rendement pour l''extraction à froid de jus frais de canne à sucre. Facile à nettoyer, avec protection intégrée pour les opérateurs.', 1000000, 1527, 'Sur commande (20 jours)', 'http://bevulta.com/images/stories/machines/broyeur%20de%20canne%20%20sucre.gif', '{"Capacité de pressage": "800 kg de canne à sucre / heure", "Motorisation": "Électrique 5 CV (1500 trs/min)", "Transmission": "Par engrenages robustes sous carter de sécurité", "Dimensions": "700mm x 700mm x 700mm", "Matériau galets": "Acier trempé haute dureté"}'),

('Broyeur Mélangeur de Provende', 'specialites', 'Unité complète de provenderie pour concasser et mélanger de manière homogène les grains et nutriments destinés à l''alimentation du bétail et de la volaille.', 1000000, 1527, 'Sur commande (30 jours)', 'http://bevulta.com/images/stories/machines/broyeur%20mlang%20inclin.gif', '{"Capacité de production": "1.5 Tonne de provende / heure", "Motorisation": "Deux moteurs électriques indépendants (7.5 CV pour le broyeur, 3 CV pour le mélangeur)", "Homogénéité de mélange": "Supérieure ou égale à 98%", "Grilles de calibrage": "Interchangeables fournies (6mm, 8mm, 10mm)", "Encombrement": "2450mm x 1300mm x 1800mm (hauteur)"}'),

('Moulin à Condiments Professionnel', 'agro-alimentaire', 'Moulin de broyage humide spécialement conçu pour réduire en purée fine les piments, tomates, oignons et gingembre de manière extrêmement rapide.', 125000, 192, 'En stock', 'http://bevulta.com/images/stories/machines/broyeuse%20de%20condiment%2001.jpg', '{"Débit / Rendement": "1 bassine standard en 15 minutes", "Motorisation": "Thermique 5.5 CV ou Électrique 2.5 CV (1500 trs/min) au choix", "Système de broyage": "Dents de friction en fonte d''acier (Ø 180 mm)", "Entraxe de fixation": "120 mm avec 3 points", "Encombrement": "350mm x 500mm x 600mm"}'),

('Décortiqueuse Vanneuse de Riz', 'agro-alimentaire', 'Unité combinée permettant le décorticage rapide du riz paddy et l''élimination simultanée de la balle par un système de soufflerie intégré.', 750000, 1145, 'Sur commande (15 jours)', 'http://bevulta.com/images/stories/machines/beurre%20de%20karit.jpg', '{"Capacité horaire": "300 à 400 kg / heure", "Motorisation": "Électrique 4 CV ou Thermique Diesel 6.5 CV", "Taux de brisure": "Extrêmement faible (< 5%)", "Châssis": "Acier mécano-soudé renforcé anti-vibrations"}'),

('Décortiqueuse Vanneuse d''Arachides', 'agro-alimentaire', 'Machine haute performance pour écosser les arachides sèches. Le système de vannage souffle les coques légères et trie les graines entières.', 650000, 992, 'En stock / Sur commande', 'http://bevulta.com/images/stories/machines/beurre%20de%20karit.jpg', '{"Capacité de traitement": "500 kg / heure", "Motorisation": "Thermique Essence 6.5 CV ou Électrique 3 CV", "Taux de séparation": "Supérieur à 95%", "Grilles": "Ajustables selon le calibre des arachides"}'),

('Pondeuse de Briques toutes gammes', 'btp-construction', 'Presse vibrante pour la fabrication en série de briques de ciment, parpaings et pavés autobloquants. Simple d''utilisation et extrêmement durable.', 1200000, 1832, 'Sur commande (20 jours)', 'http://bevulta.com/images/stories/machines/reservoir%20dhuile.jpg', '{"Capacité de moulage": "1200 à 1500 blocs par journée de 8h", "Motorisation": "Vibrateur électrique industriel 2 CV ou Thermique 5 CV", "Moules fournis": "Moule standard pour parpaings 15x20x40 cm (interchangeable)", "Opérateurs requis": "2 à 3 personnes", "Matériau moule": "Acier anti-abrasion traité thermiquement"}'),

('Citerne Métallique (2000 Litres)', 'btp-construction', 'Citerne de stockage cylindrique ou rectangulaire pour liquides (eau potable, gazole, huiles végétales). Traitement anticorrosion intérieur et extérieur.', 250000, 382, 'En stock', 'http://bevulta.com/images/stories/machines/reservoir%20dhuile.jpg', '{"Capacité nominale": "2000 Litres", "Épaisseur tôle": "Tôle d''acier A33 certifiée 30/10", "Dimensions": "2.00m de longueur x 1.00m de largeur x 1.00m de hauteur", "Équipements": "Trou d''homme Ø 450mm, robinet de vidange en laiton, vanne de sécurité et anneaux de levage"}'),

('Scie à Ruban Professionnelle', 'menuiserie-boulangerie', 'Scie à ruban à haut rendement pour ateliers de menuiserie bois. Structure mécano-soudée assurant une excellente rigidité pour des coupes rectilignes ou courbes parfaites.', 900000, 1375, 'Sur commande (25 jours)', 'http://bevulta.com/images/stories/machines/scie%20%20ruban.jpg', '{"Hauteur de coupe max": "400 mm", "Dimensions de la table": "1.20m x 0.75m (table inclinable en fonte)", "Motorisation": "Électrique Triphasé ou Monophasé 10 CV (1500 trs/min)", "Fréquence de service": "50 Hz", "Dimensions globales": "2.30m x 0.90m x 1.60m"}'),

('Raboteuse Simple d''Atelier', 'menuiserie-boulangerie', 'Raboteuse industrielle conçue pour dresser le bois à des épaisseurs précises avec une avance automatique régulière.', 850000, 1300, 'Sur commande (30 jours)', 'http://bevulta.com/images/stories/machines/scie%20circulaire.jpg', '{"Largeur de rabotage": "500 mm avec arbre à 3 fers", "Hauteur de rabotage max": "250 mm", "Vitesse d''avance du bois": "7.5 mètres / minute", "Dimensions de la table": "800mm x 500mm", "Motorisation principale": "Électrique 5 CV (3000 trs/min)", "Motorisation entraîneuse": "Électrique 2.5 CV (1500 trs/min)", "Diamètre rouleau d''entraînement": "Ø 50 mm"}'),

('Raboteuse Dégauchisseuse Combinée', 'menuiserie-boulangerie', 'Machine polyvalente deux-en-un pour les ateliers de menuiserie artisanale. Permet le dégauchissage (planéité) puis le rabotage (épaisseur) sur le même bâti.', 900000, 1375, 'Sur commande (30 jours)', 'http://bevulta.com/images/stories/machines/raboteuse%20-%20dgauchisseuse.jpg', '{"Hauteur max rabotage": "230 mm", "Profondeur de passe max": "4 mm", "Longueur de dégauchissage": "450 mm", "Arbre porte-outils": "Ø 90 mm", "Vitesse d''avance (débrayable)": "7.5 m/min", "Moteur de l''arbre": "Électrique 6 CV (5850 trs/min)", "Moteur d''entraînement": "Électrique 2.5 CV (1500 trs/min)", "Encombrement": "1.40m x 0.65m x 0.85m"}'),

('Vélo Tricycle Adapté', 'specialites', 'Vélo à trois roues spécialement étudié pour les personnes dont les membres inférieurs sont défaillants. Entièrement actionnable par la force des bras, confortable et sûr.', 200000, 306, 'En stock', 'http://bevulta.com/images/stories/machines/vlo%20handicap.jpg', '{"Mécanisme de propulsion": "Système de pédalage manuel (manivelles ergonomiques) avec marche avant et arrière", "Configuration": "Châssis tubulaire acier haute résistance monté sur 3 roues pneumatiques robustes", "Assise": "Siège ergonomique en mousse épaisse recouvert d''un simili-cuir imperméable de haute qualité", "Système de freinage": "Frein manuel à blocage sur les roues arrière", "Dimensions": "1500mm x 1100mm x 750mm"}'),

('Four à Gâteau Professionnel', 'menuiserie-boulangerie', 'Four professionnel conçu pour la cuisson uniforme de gâteaux, viennoiseries et pains artisanaux. Équipé d''une sole réfractaire et d''une régulation thermique optimisée.', 700000, 1068, 'Sur commande (15 jours)', 'http://bevulta.com/images/stories/machines/photo%20accueil1.gif', '{"Alimentation": "Gaz GPL (détendeur standard) ou Électricité", "Plage de température": "50°C à 350°C", "Capacité de plaques": "3 niveaux (plaques 60x40 cm)", "Porte": "Vitrage thermorésistant avec poignée athermique", "Carrosserie": "Acier inoxydable et tôle peinte au four"}');
```

---

## 🔗 Étape 3 : Récupération des clés API Supabase

Dans l'interface de votre projet Supabase :
1. Allez dans **Project Settings** (icône d'engrenage en bas à gauche) > **API**.
2. Récupérez les deux valeurs suivantes :
   - **Project URL** (ex: `https://abcd.supabase.co`)
   - **API Key** (la clé publique nommée `anon`, `public`)

---

## 🚀 Étape 4 : Déploiement du Frontend sur Vercel

1. Créez un dépôt sur votre GitHub/GitLab et poussez-y les fichiers du projet.
2. Connectez-vous sur [Vercel](https://vercel.com/) avec votre compte GitHub.
3. Cliquez sur **Add New** > **Project** et importez votre dépôt.
4. Dans l'onglet de configuration du projet Vercel :
   - **Framework Preset :** Laissez sur `Vite` (Vercel le détecte automatiquement).
   - Déroulez la section **Environment Variables** et ajoutez ces deux variables :
     - Nom : `VITE_SUPABASE_URL` | Valeur : *votre URL de projet Supabase*
     - Nom : `VITE_SUPABASE_ANON_KEY` | Valeur : *votre clé anon de projet Supabase*
5. Cliquez sur **Deploy**.

*Votre site BEVULTA est maintenant en ligne, sécurisé, connecté en temps réel à votre base PostgreSQL et prêt pour le grand public et l'administration !*
