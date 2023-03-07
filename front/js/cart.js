let cart = {
  items: [],
};

// récuperation données du LS
const storedItems = JSON.parse(localStorage.getItem('cart'));
if (storedItems) {
  cart = storedItems;

  if (document.getElementById("cart__items")) {
    displayCart(cart);
  }
}

// Afficher les articles du panier 
async function displayCart(cart) {
  await fetchProducts(cart);
  
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

// Retouver et retirer un produit du panier
function remove(itemId, itemColor) {
  let itemIndex = cart.items.findIndex(item => item._id === itemId && item.color === itemColor);
  cart.items.splice(itemIndex, 1);  
  displayCart(cart);
  localStorage.setItem('cart', JSON.stringify(cart));// MJ
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
  const specialChars = /[^a-zA-ZÀ-ÿ]/g
  const addressRegex = /[^a-zA-ZÀ-ÿ 0-9]/g;
  const cityChars = /[^a-zA-ZÀ-ÿ 0-9]/g;

  // effacer les messages d'erreur précédents
  document.querySelector("#firstNameErrorMsg").innerHTML = "";
  document.querySelector("#lastNameErrorMsg").innerHTML = "";
  document.querySelector("#addressErrorMsg").innerHTML = "";
  document.querySelector("#cityErrorMsg").innerHTML = "";
  document.querySelector("#emailErrorMsg").innerHTML = "";
 
  let valide = true;

  if (contact.firstName.match(specialChars) || !contact.firstName) {
    document.querySelector("#firstNameErrorMsg").innerHTML = "Le champ Prénom est incorrect.";
    valide = false;
  }

  if(contact.lastName.match(specialChars) || !contact.lastName ) {
    document.querySelector("#lastNameErrorMsg").innerHTML =  "Le champ Nom est incorrect.";
    valide = false;
  }

  if(contact.address.match(addressRegex) || !contact.address) {
    document.querySelector("#addressErrorMsg").innerHTML =  "Le champ Adresse est incorrect.";
    valide = false;
  } 

  if(contact.city.match(cityChars) || !contact.city) {
    document.querySelector("#cityErrorMsg").innerHTML = "Le champ Ville est incorrect.";
    valide = false;
  }

  if(!emailRegex.test(contact.email)){
    document.querySelector("#emailErrorMsg").innerHTML = "Le champ Email est incorrect.";
    valide = false;
  }

  return valide;
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