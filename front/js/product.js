
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

  }

  // Ajouter clic bouton
  document.getElementById('addToCart').addEventListener('click', () => {
    product.color = document.getElementById('colors').value;// Séléction couleur
    product.quantity = document.getElementById('quantity').value;// Séléction Quantitité
    addToCart(product);
  });

  // Créer objet panier pour stocker les articles
  const cart = {
    items: [],
    totalPrice: 0
  };

  // Fonction pour ajouter un produit au panier
  function addToCart(product) {
    cart.items.push(product);  // Ajouter le produit au tableau des éléments
    cart.totalPrice += product.price; // Mettre à jour le prix total
    alert(`${product.name} ajouté!`);  // Afficher un message à l'utilisateur indiquant que le produit a été ajouté au panier
    saveCart();//Enregistrez le panier dans le stockage local
  }

  // Fonction pour enregistrer le panier dans le stockage local
  function saveCart() {
    const cartJson = JSON.stringify(cart);// Convertir l'objet panier en chaîne JSON
    localStorage.setItem('cart', cartJson); // Save the cart to local storage
  }
  //Executer fetch
  fetchProduct();


} else {
  console.log('no id params set')
}





