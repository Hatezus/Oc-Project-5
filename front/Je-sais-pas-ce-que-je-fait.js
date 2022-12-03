let arrayProducts = [];

fetch("http://localhost:3000/api/products")
	.then((res) => {
		if (res.ok === true) {
			return res.json();
		}
	})
	.then((products) => {
		recup(products);
	})
	.catch((err) => {
		console.log("erreurzrzerez");
	});

function recup(products) {
	for (let x of products) {
		arrayProducts.push(
			new Couch(
				x.colors,
				x.id,
				x.name,
				x.price,
				x.imageUrl,
				x.description,
				x.altTxt
			)
		);
	}
	display();
}

// function display() {
// 	let elt = document.getElementById("items");
// 	elt.innerHTML =
// 		'<a href="#"> <article> <img src ="" alt=""> <h3 class="productName"> </h3> <p class="productDescription"> </p> </img> </article> </a>';
// 	elt = document.getElementsByClassName("productName");
// 	console.log(elt);
// 	elt.textContent = arrayProducts[0].name;
// }

function display() {
	let cursor = document.querySelector(".items");

	let newLink = document.createElement("a");
	newLink.setAttribute("href", "./product.html?id=42"); // il faut integrer la var id ici

	let newArticle = document.createElement("article");

	let newImg = document.createElement("img");
	newImg.setAttribute("src", arrayProducts[0].imageUrl);
	newImg.setAttribute("alt", arrayProducts[0].altTxt);

	let newTitle = document.createElement("h3");
	newTitle.textContent = arrayProducts[0].name;

	let newDescription = document.createElement("p");
	newDescription.textContent = arrayProducts[0].description;

	cursor.append(newLink);

	cursor = document.querySelector(".items > a");
	console.log(cursor);
	cursor.append(newArticle);

	cursor = document.querySelector(".items > a > article");
	cursor.append(newImg);
	cursor.append(newTitle);
}

class Couch {
	constructor(colors, id, name, price, imageUrl, description, altTxt) {
		this.colors = colors;
		this.id = id;
		this.name = name;
		this.price = price;
		this.imageUrl = imageUrl;
		this.description = description;
		this.altTxt = altTxt;
	}
}
