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

  //Executer fetch
  fetchProduct();

} else {
  console.log('no id params set')
}





