// Lors du chargement de page---------------------
// Créer objet panier pour stocker les articles
let cart = {
  items: [],
};


// Charger le contenu du localstorage
const storedItems = JSON.parse(localStorage.getItem('cart'));

if (storedItems) {
  cart = storedItems;

  if (document.getElementById("cart__items")) {
    displayCart(cart);
  }
}


//Fontions --------------------------------

// Fonction pour ajouter un produit au panier
function addToCart(item) {
  if ((item.quantity <= 100) && (item.quantity > 0)) {
    // Modifier la quantité de l'article similaire ou ajouter un nouveau 
    let itemIndex = cart.items.findIndex((i) => i._id === item._id && i.color === item.color);
    if (itemIndex != -1) {
      let new_quantity = parseInt(item.quantity) + parseInt(cart.items[itemIndex].quantity);
      if ((new_quantity <= 100) && (new_quantity > 0)) {
        cart.items[itemIndex].quantity = new_quantity;
      } else {
        alert("Vous ne pouvez pas depasser la limite de 100 articles par produit !");
        return;
      }
    
      
    }


    if (itemIndex == -1) {
      cart.items.push(item);  // Ajouter le produit au tableau des éléments
      alert(`${item.name} ajouté !`);  // Afficher un message à l'utilisateur indiquant que le produit a été ajouté au panier
    } else {
      alert(`${item.name} modifié !`);
    }

    //Enregistrez le panier dans le stockage local
    saveCart();
    renderCartCount();
  } else {
    alert("Vous ne pouvez pas depasser la limite de 100 articles par produit !")
  }
}

// Fonction pour enregistrer le panier dans le stockage local
function saveCart() {
  const cartJson = JSON.stringify(cart);// Convertir l'objet panier en chaîne JSON
  localStorage.setItem('cart', cartJson); // Save the cart to local storage
}

// Fonction pour rendre le panier à la page
function renderCartCount() {
  document.getElementById('cart_count').innerHTML = getArticlesCount();
}

function getArticlesCount() {
  let total_quantity = 0;
  cart.items.forEach((item) => {
    total_quantity = total_quantity + parseInt(item.quantity);
  });
  return total_quantity;
}

// Fonction pour afficher les articles du panier dans cart.html
async function displayCart(cart) {
  await fetchProducts(cart);
  renderCartCount();
}


async function fetchProducts(cart) {
  let cartItemsData = [];

  Promise.all(
    cart.items.map(async item => {
      try {
        let response = await fetch(`http://localhost:3000/api/products/${item._id}`);
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
                  <h2>${product.name}</h2>
                  <p>${product.color}</p>
                  <p>${product.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                  <div class="cart__item__content__settings__quantity">
                    <p>Qté : </p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}" onChange="updateQuantity('${product._id}', '${product.color}', this)">
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
  // Retrouver l'element
  let itemIndex = cart.items.findIndex(item => item._id === itemId && item.color === itemColor);

  // Retirer l'element du panier
  cart.items.splice(itemIndex, 1);

  // Retirer l'element visuellement
  displayCart(cart);

  // Mettre a jour le local storage
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateQuantity(itemId, itemColor, element) {
  if ((element.value > 100) || (element.value < 1)) {
    element.value = 1;
    alert("Vous devez rajouter au moins un produit avec une limite de 100 articles par produit !");    
  }

  let item = cart.items.find((i) => i._id === itemId && i.color === itemColor);
  let itemIndex = cart.items.findIndex((i) => i._id === itemId && i.color === itemColor);
  if (item) {
    cart.items[itemIndex].quantity = element.value;
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart(cart);
  }
}               

const form = document.querySelector('form');
form.addEventListener('submit', function (event) {
  event.preventDefault();

  // Constituer objet contact  firstName,lastName, address, city et email. -- Done
    
  // Créer objet contact pour stocker les informations du client
  let contact = {
    firstName: form.querySelector('input[name="firstName"]').value,
    lastName: form.querySelector('input[name="lastName"]').value,
    address: form.querySelector('input[name="address"]').value,
    city: form.querySelector('input[name="city"]').value,
    email: form.querySelector('input[name="email"]').value,
  };

  if(validate(contact)) {
    // Constituer tableau de produits [ID1 , ID2, ID3]
    let products = getProductIds();
    let body = {
      contact: contact,
      products: products
    }
    sendOrder(body);
    //form.submit();
  }
});

function validate(contact) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const specialChars = /^(([^a-zA-Z ])+([a-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ][a-zàáâãäåçèéêëìíîïðòóôõöùúûüýÿ\' -]))/g
  const cityChars = /[^a-zA-ZÀ-ÿ ]/g;
  const addressRegex = /[^a-zA-Z0-9À-ÿ,. ]/g

  if (contact.firstName.match(specialChars)) {
    document.querySelector("#firstNameErrorMsg").innerHTML = "Le champs Prenom est incorrect.";
    return false;
  }

  if(contact.lastName.match(specialChars)) {
    document.querySelector("#lastNameErrorMsg").innerHTML =  "Le champs Nom est incorrect.";
    return false;
  }
  
  if(contact.address.match(addressRegex)) {
    document.querySelector("#adressErrorMsg").innerHTML =  "Le champs Adresse est incorrect.";
    return false;
  } 

  if(contact.city.match(cityChars)) {
    document.querySelector("#cityErrorMsg").innerHTML = "Le champs Ville est incorrect.";
    return false;
  }
  
  if(!emailRegex.test(contact.email)){
    document.querySelector("#emailErrorMsg").innerHTML = "Le champs Email est incorrect.";
    return false;
  }
  
  return true;
} 

function getProductIds() {  
  let cart = JSON.parse(localStorage.getItem('cart'));
  product_ids = cart.items.map((item) => item._id);
  return product_ids;
}

async function sendOrder(body) {
  // Envoyer la requete de creation de commande
  let response = await fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(body)
  });
  
  let data = await response.json();


  if (data.orderId) {
    localStorage.removeItem('cart');
    window.location.replace(`confirmation.html?orderId=${data.orderId}`); //je passe orderId en url
  }

}