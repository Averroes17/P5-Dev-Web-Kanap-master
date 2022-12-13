fetch("http://localhost:3000/api/products")
.then(Response => Response.json())
.then((items) => {
    html = ``;
    items.forEach(item => {
        html += `<a href="./product.html?id=${item._id}">
        <article>
          <img src="${item.imageUrl}" alt="${item.altTxt}">
          <h3 class="productName">${item.name}</h3>
          <p class="productDescription">${item.description}</p>
        </article>
      </a>`;

    }); 
    document.getElementById("items").innerHTML = html;  
})
.catch((error) => {
    console.error('Error:', error);
  });

