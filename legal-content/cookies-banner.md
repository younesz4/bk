# Cookies Banner - Text Content

## Texte principal

Nous utilisons des cookies pour améliorer votre expérience de navigation et analyser le trafic de notre site. En continuant à utiliser ce site, vous acceptez notre utilisation des cookies.

## Boutons

### Accepter
**Texte** : "Accepter"

### Continuer sans accepter
**Texte** : "Continuer sans accepter"

## Section personnalisation (optionnelle)

### Titre
"Personnaliser mes préférences"

### Options
- **Cookies essentiels** : Nécessaires au fonctionnement du site (toujours actifs)
- **Cookies analytiques** : Nous aident à comprendre comment vous utilisez le site
- **Cookies marketing** : Utilisés pour vous proposer des contenus personnalisés

### Bouton de sauvegarde
**Texte** : "Enregistrer mes préférences"

## Lien vers la politique

"En savoir plus sur notre utilisation des cookies"

(Lien vers une page dédiée ou section dans la politique de confidentialité)

---

## Structure JSON pour le consentement

```json
{
  "consentDate": "2024-01-15T10:30:00Z",
  "essential": true,
  "analytics": false,
  "marketing": false,
  "version": "1.0"
}
```

## Logique requise

1. **Affichage** : Le banner s'affiche si aucun consentement n'est enregistré
2. **Accepter** : Enregistre le consentement pour tous les cookies (essential: true, analytics: true, marketing: true)
3. **Continuer sans accepter** : Enregistre uniquement les cookies essentiels (essential: true, analytics: false, marketing: false)
4. **Personnaliser** : Ouvre une section permettant de choisir chaque catégorie individuellement
5. **Stockage** : Le consentement est stocké dans localStorage avec une durée de validité (ex: 12 mois)
6. **Vérification** : À chaque visite, vérifier si le consentement existe et est toujours valide

## Notes importantes

- Le banner doit être visible mais non intrusif
- Les cookies essentiels ne nécessitent pas de consentement (fonctionnement du site)
- Le consentement doit pouvoir être modifié à tout moment
- Un lien vers la politique de confidentialité doit être accessible

