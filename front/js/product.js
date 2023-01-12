//Product page
const params = new URLSearchParams(window.location.search);
if (params.has('id')) {

  let product;
  async function fetchProduct() {
    const response = await fetch(`http://localhost:3000/api/products/${params.get('id')}`);
    product = await response.json();
    document.getElementById('price').innerHTML = product.price;
    document.getElementById('description').innerHTML = product.description;
    document.getElementById('title').innerHTML = product.name;
    document.getElementsByTagName('title')[0].innerHTML = product.name;
    document.getElementsByClassName('item__img')[0].innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`

    //button selection produit
    product.colors.forEach(color => {
      let option = document.createElement("option");
      option.text = color;
      option.value = color;
      document.getElementById('colors').add(option);
    })

    console.log(product);
  }

  // Ajouter clic bouton
  document.getElementById('addToCart').addEventListener('click', () => {
    //Conditions Ajouter
    if (document.getElementById('colors').value == '') {
      alert("choisissez une couleur !")
      return
    }

    if (document.getElementById('quantity').value <= 0) {
      alert("Ajoutez une quantité !")
      return
    }

    //fonctionnement normal    
    let item = {
      'id': product._id,
      'name': product.name,
      'color': document.getElementById('colors').value,// Séléction couleur
      'quantity': document.getElementById('quantity').value,// Séléction Quantitité
    }

    addToCart(item);
  });

  // Créer objet panier pour stocker les articles
  const cart = {
    items: []
  };

  // Fonction pour ajouter un produit au panier
  function addToCart(item) {
    let item_exist = false;
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
    saveCart();//Enregistrez le panier dans le stockage local
    renderCartCount();
  }

  // Fonction pour enregistrer le panier dans le stockage local
  function saveCart() {
    const cartJson = JSON.stringify(cart);// Convertir l'objet panier en chaîne JSON
    localStorage.setItem('cart', cartJson); // Save the cart to local storage
  }

  // Rendre le panier à la page
  renderCartCount();

  // Fonction pour rendre le panier à la page
  function renderCartCount() {
    const cartCount = document.getElementById('cart_count');
    cartCount.innerHTML = cart.items.length;
   }

  //Executer fetch
  fetchProduct();

} else {
  console.log('no id params set')
}





