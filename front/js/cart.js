// Lors du chargement de page---------------------
// Créer objet panier pour stocker les articles
let cart = {
    items: [],
};


// Charger le contenu du localstorage
const storedItems = JSON.parse(localStorage.getItem('cart'));

if(storedItems) {
    cart = storedItems;

    
    if( document.getElementById("cart__items") ) {
        displayCart(cart);
    }
    
    renderCartCount();
}





//Fontions --------------------------------

// Fonction pour ajouter un produit au panier
function addToCart(item) {
    let item_exist = false;

    // Modifier la quantité de l'article similaire ou ajouter un nouveau
    if (cart) {
        cart.items.forEach((ligne, index) => {
        if (item.id == ligne.id && item.color == ligne.color) {
            cart.items[index].quantity = parseInt(item.quantity) + parseInt(ligne.quantity);
            item_exist = true;
        }
        });
    }

    if (!item_exist) {
        cart.items.push(item);  // Ajouter le produit au tableau des éléments
        alert(`${item.name} ajouté !`);  // Afficher un message à l'utilisateur indiquant que le produit a été ajouté au panier
    } else {
        alert(`${item.name} modifié !`);
    }

    //Enregistrez le panier dans le stockage local
    saveCart();
    renderCartCount();
}

// Fonction pour enregistrer le panier dans le stockage local
function saveCart() {
    const cartJson = JSON.stringify(cart);// Convertir l'objet panier en chaîne JSON
    localStorage.setItem('cart', cartJson); // Save the cart to local storage
}

// Fonction pour rendre le panier à la page
function renderCartCount() {
    let total_quantity = 0;
    cart.items.forEach((item) => {
        total_quantity = total_quantity + parseInt(item.quantity);
    });

    document.getElementById('cart_count').innerHTML = total_quantity;
}

// Fonction pour afficher les articles du panier dans cart.html
async function displayCart(cart) {
    await fetchProducts(cart);    
}


async function fetchProducts(cart) {
    let cartItemsData = [];

    Promise.all(
        cart.items.map(async item => {
            try {
                let response = await fetch(`http://localhost:3000/api/products/${item.id}`);
                let data = await response.json();
                
                data.color = item.color;
                data.quantity = item.quantity;

                cartItemsData.push(data);
            } catch (error) {
                console.log(error);
            }
        })
    ).then(() => {
        // Update the UI with the cartItemsData array
        updateUI(cartItemsData);
    });
}

function updateUI(products) {
    let html = "";
    let totalQuantity = 0;
    let totalPrice = 0;

    products.forEach(product => {
        totalQuantity += parseInt(product.quantity);
        totalPrice += parseInt(product.price) * product.quantity;

        html += `
            <article class="cart__item" data-id="${product._id}" data-color="${product.color}">
              <div class="cart__item__img">
                <img src="${product.imageUrl}" alt="${product.altTxt}">
              </div>
              <div class="cart__item__content">
                <div class="cart__item__content__description">
                  <h2>>${product.name}</h2>
                  <p>>${product.color}</p>
                  <p>>${product.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                  </div>
                  <div class="cart__item__content__settings__delete">
                    <button class="deleteItem" onclick="remove('${product._id}', '${product.color}')">Supprimer</button>
                  </div>
                </div>
              </div>
            </article>`;
    });

    document.getElementById("cart__items").innerHTML = html;     
    document.getElementById("totalQuantity").innerHTML = totalQuantity;  
    document.getElementById("totalPrice").innerHTML = totalPrice;  
}



  // Fonction pour retirer un produit du panier
  function remove(itemId, itemColor) {
    let storedCart = JSON.parse(localStorage.getItem('cart'));
    // Retrouver l'element
    let itemIndex = storedCart.items.findIndex(item => item._id === itemId && item.color === itemColor);
    // Retirer l'element du panier
    storedCart.items.splice(itemIndex, 1);

    // Retirer l'element visuellement
    displayCart(storedCart);

    // Mettre a jour le local storage
    localStorage.setItem('cart', JSON.stringify(storedCart));
  }