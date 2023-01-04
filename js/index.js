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
