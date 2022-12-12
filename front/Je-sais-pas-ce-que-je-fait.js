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
		console.log("Impossible de joindre le server");
	});

function recup(products) {
	for (let x of products) {
		arrayProducts.push(
			new Couch(
				x.colors,
				x._id,
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

function display() {
	const cursor = document.querySelector("#items");
	let url = encodeURI(window.location.href);
	url = url.replace("index", "product");

	let newUrl = new URL(url);

	for (let product of arrayProducts) {
		newUrl.searchParams.set("id", product.id);
		cursor.insertAdjacentHTML(
			"afterbegin",
			`<a href="${newUrl.href}"> 
				<article> 
					<img src="${product.imageUrl}" alt="${product.altTxt}">
						 <h3 class="productName"> ${product.name} </h3> 
						 <p class="productDescription"> ${product.description} </p> 
				</article> 
			</a>`
		);
	}
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

// function display() {
// 	let elt = document.getElementById("items");
// 	elt.innerHTML =
// 		'<a href="#"> <article> <img src ="" alt=""> <h3 class="productName"> </h3> <p class="productDescription"> </p> </img> </article> </a>';
// 	elt = document.getElementsByClassName("productName");
// 	console.log(elt);
// 	elt.textContent = arrayProducts[0].name;
// }

// function display() {
// 	let cursor = document.querySelector(".items");
// 	for (let i = 0; i < arrayProducts.length; i++) {
// 		let newLink = document.createElement("a");
// 		let linkSrc = "./product.html?id=$arrayProducts[i].id";
// 		newLink.setAttribute("href", linkSrc); // il faut integrer la var id ici

// 		let newArticle = document.createElement("article");

// 		let newImg = document.createElement("img");
// 		newImg.setAttribute("src", arrayProducts[i].imageUrl);
// 		newImg.setAttribute("alt", arrayProducts[i].altTxt);

// 		let newTitle = document.createElement("h3");
// 		newTitle.textContent = arrayProducts[i].name;

// 		let newDescription = document.createElement("p");
// 		newDescription.textContent = arrayProducts[i].description;

// 		cursor.append(newLink);

// 		cursor = document.querySelector(".items a");
// 		cursor.append(newArticle);

// 		cursor = document.querySelector(".items > a > article");
// 		cursor.append(newImg);
// 		cursor.append(newTitle);
// 		cursor.append(newDescription);
// 	}
// }
