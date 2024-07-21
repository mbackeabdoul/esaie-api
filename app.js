// Fonction pour créer un nouvel élément HTML
function createNode(element) {
    return document.createElement(element);
}

// Fonction pour ajouter un élément enfant à un élément parent
function append(parent, el) {
    return parent.appendChild(el);
}

// Fonction pour créer une carte de pays
function createCard(nations) {
    let col = createNode('div');
    col.classList.add('col-md-4', 'mb-4'); // Ajouter les classes de colonne Bootstrap
    let card = createNode('div');
    card.classList.add('card', 'h-100'); // Ajouter les classes de carte Bootstrap
    card.innerHTML = `
        <img src="${nations.flags.png}" class="card-img-top" alt="Drapeau de ${nations.name.common}" style="height: 150px; object-fit: cover;">
        <div class="card-body">
            <h5 class="card-title">${nations.name.common}</h5>
            <button class="btn btn-primary" onclick="showDetails('${nations.cca3}')">Détails</button> <!-- Bouton pour afficher les détails -->
        </div>
    `;
    append(col, card); // Ajouter la carte à la colonne
    return col;
}

// Fonction pour afficher les détails du pays
function showDetails(cca3) {
    fetch('https://restcountries.com/v3.1/all')
        .then((resp) => resp.json())
        .then(function(data) {
            const country = data.find(nations => nations.cca3 === cca3);
            if (country) {
                // Masquer les titres et les listes de pays
                document.getElementById('independentTitle').style.display = 'none';
                document.getElementById('nonIndependentTitle').style.display = 'none';
                document.getElementById('PaysIndependent').style.display = 'none';
                document.getElementById('PaysNonIndependent').style.display = 'none';
                
                // Afficher la section des détails
                document.getElementById('countryDetails').style.display = 'block';
                
                // Mettre à jour le contenu de la carte des détails
                document.getElementById('detailsContainer').innerHTML = `
                    <img src="${country.flags.png}" class="card-img-top" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <h5 class="card-title">${country.name.common}</h5>
                        <p>Capitale: ${country.capital ? country.capital[0] : 'N/A'}</p>
                        <p>Population: ${country.population.toLocaleString()}</p>
                        <p>Région: ${country.region}</p>
                        <p>Langues: ${country.languages ? Object.values(country.languages).join(', ') : 'N/A'}</p>
                    </div>
                `;
            } else {
                document.getElementById('detailsContainer').innerHTML = 'Détails non disponibles';
            }
        })
        .catch(function(error) {
            console.log(error);
        });
}

// Fonction pour revenir à la liste des pays
function goBack() {
    document.getElementById('independentTitle').style.display = 'block';
    document.getElementById('nonIndependentTitle').style.display = 'block';
    document.getElementById('PaysIndependent').style.display = 'block';
    document.getElementById('PaysNonIndependent').style.display = 'block';
    document.getElementById('countryDetails').style.display = 'none';

    // Réinitialiser les styles pour s'assurer que les cartes sont en grille
    document.getElementById('PaysIndependent').classList.add('row');
    document.getElementById('PaysNonIndependent').classList.add('row');
    
    // Réinitialiser le défilement des listes pour éviter les problèmes d'alignement
    document.getElementById('PaysIndependent').scrollTop = 0;
    document.getElementById('PaysNonIndependent').scrollTop = 0;
}

// Charger les listes de pays
function loadCountries() {
    const url = 'https://restcountries.com/v3.1/all';

    fetch(url)
        .then((resp) => resp.json())
        .then(function(data) {
            // Filtrer les pays indépendants et non indépendants
            const paysIndependent = data.filter(nations => nations.independent === true);
            const paysNonIndependent = data.filter(nations => nations.independent === false);
            
            // Ajouter les pays indépendants
            paysIndependent.forEach(function(nations) {
                append(document.getElementById('PaysIndependent'), createCard(nations));
            });

            // Ajouter les pays non indépendants
            paysNonIndependent.forEach(function(nations) {
                append(document.getElementById('PaysNonIndependent'), createCard(nations));
            });
        })
        .catch(function(error) {
            console.log(error);
        });
}

// Initialiser la page
loadCountries();
