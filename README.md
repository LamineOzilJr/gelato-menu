# Aroma Gelato — la carte digitale

Carte interactive d’Aroma Gelato (Dakar) : rubriques, recherche, français / anglais, adresses avec appel direct.

**En ligne :** https://aroma-gelato-dakar.vercel.app

## Modifier un prix ou un plat

1. Ouvrir `index.html`.
2. Chercher la section `CARTE` (tout en haut du script) : chaque plat tient sur une ligne.

   ```js
   { n: 'Tagliatelle Pesto', d: d('Tagliatelle, poulet…', 'Tagliatelle, chicken…'), p: 4500 },
   ```

   - `n` : nom du plat (ou `d('Nom FR', 'Name EN')` s’il change selon la langue)
   - `d` : description en français puis en anglais
   - `p` : prix en FCFA ; pour deux tailles, `p: [4500, 5500]`
3. Enregistrer, puis publier (voir ci-dessous).

## Publier

- Si le dépôt GitHub est relié au projet Vercel : un simple `git push` met le site à jour.
- Sinon, depuis ce dossier : `npx vercel --prod`.

Les clients qui ont déjà ouvert la carte voient s’afficher « La carte a été mise à jour — Actualiser » à leur visite suivante.

## Pourquoi la carte est si rapide

- Une seule page légère (≈ 15 Ko compressés) qui s’affiche sans attendre le reste.
- Polices hébergées sur le site, allégées et préchargées (aucun appel à Google).
- Illustrations vectorielles chargées seulement quand on ouvre la rubrique concernée.
- Polices et illustrations mises en cache un an par le navigateur (noms de fichiers versionnés).
- Un service worker (`sw.js`) garde la carte sur le téléphone : dès la deuxième visite, elle s’ouvre instantanément, même sans connexion, et se met à jour en arrière-plan.

## Structure

```
index.html            la carte (styles, données et script)
sw.js                 affichage instantané et hors connexion
art/                  illustrations dorées (extraites du menu PDF)
fonts/                Playfair Display et Poppins (sous-ensemble latin)
og-image.png          aperçu affiché lors d’un partage (WhatsApp, Facebook…)
apple-touch-icon.png  icône sur l’écran d’accueil iPhone
vercel.json           en-têtes de cache
```

Si vous remplacez une illustration ou une police, donnez-lui un nouveau nom de fichier (les anciens restent en cache un an).

## Crédits

- Polices : Playfair Display (Claus Eggers Sørensen) et Poppins (Indian Type Foundry), sous licence SIL Open Font License 1.1.
- Illustrations : menu Aroma Gelato.
