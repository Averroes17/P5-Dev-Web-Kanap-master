const params = new URLSearchParams(window.location.search);
if(params.has('id')) {
  fetch("http://localhost:3000/api/products/"+params.get('id'))
  .then(Response => Response.json())
  .then((product) => {
      document.getElementById('price').innerHTML = product.price;
      document.getElementById('description').innerHTML = product.description;
      document.getElementById('title').innerHTML = product.name;
      document.getElementById('nom_produit').innerHTML = product.name;
      //button selection
      product.colors.forEach( color => {
        option = document.createElement("option");
        option.text = color;
        option.value = color;
        document.getElementById('colors').add(option);
      })
  })
  .catch((error) => {
      console.error('Error:', error);
    });

} else {
  console.log('no id params set')
}
fetch ("")
  

