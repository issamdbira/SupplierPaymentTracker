# Plan de réorganisation des modules achat et vente

## Contexte
Le projet SupplierPaymentTracker doit être réorganisé pour séparer clairement les flux d'achat et de vente, tout en préparant l'intégration future avec un module de gestion de stock.

## Structure actuelle
- **Factures** : Gestion unifiée des factures sans distinction claire entre achat et vente
- **Décaissements** : Gestion des paiements aux fournisseurs
- **Situation Financière** : Vue globale des flux financiers sans filtrage par type

## Nouvelle structure à implémenter
1. **Factures**
   - Côté gauche : Factures d'achat (fournisseurs)
   - Côté droit : Factures de vente (clients)
   - Distinction claire entre les deux types de factures

2. **Flux financiers**
   - Décaissements : Paiements aux fournisseurs (existant)
   - Encaissements : Paiements reçus des clients (à créer)

3. **Situation Financière**
   - Vue globale des flux
   - Filtrage par type (encaissements/décaissements)

4. **Préparation pour le stock**
   - Achat → entrées en stock
   - Vente → sorties de stock

## Modifications techniques nécessaires

### 1. Schéma de données
- Ajouter un champ `type` aux factures pour distinguer "achat" et "vente"
- Adapter le schéma des encaissements (similaire aux décaissements)

### 2. API Backend
- Créer les endpoints pour les encaissements
- Adapter les endpoints existants pour filtrer par type

### 3. Interface utilisateur
- Réorganiser la page Factures en deux colonnes
- Créer le module Encaissements
- Adapter la Situation Financière pour le filtrage

### 4. Préparation pour le stock
- Ajouter des champs et relations pour les futures fonctionnalités stock

## Dépendances et ordre d'implémentation
1. Modification du schéma de données
2. Adaptation des API backend
3. Création des composants UI
4. Tests et validation
