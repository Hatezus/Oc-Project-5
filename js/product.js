const url = new URL(window.location.href);
const searchParams1 = new URLSearchParams(url.search);
const urlID = searchParams1.get("id");

let cartContent = [];

fetch("http://localhost:3000/api/products/" + urlID)
	.then((res) => {
		if (res.ok === true) {
			return res.json();
		}
	})
	.then((product) => {
		recup(product);
	})
	.catch((err) => {
		console.log("Erreur");
	});

function recup(product) {
	const canap = new Couch(
		product.colors,
		product.id,
		product.name,
		product.price,
		product.imageUrl,
		product.description,
		product.altTxt
	);
	display(canap);
}

function display(gaveItem) {
	document.querySelector(
		".item__img"
	).innerHTML = `<img src="${gaveItem.imageUrl}" alt="${gaveItem.altTxt}">`;

	document.querySelector("#title").innerHTML = `${gaveItem.name}`;

	document.querySelector("#price").innerHTML = `${gaveItem.price}`;

	document.querySelector("#description").innerHTML = `${gaveItem.description}`;

	for (let color of gaveItem.colors) {
		document
			.querySelector("#colors")
			.insertAdjacentHTML(
				"afterbegin",
				`<option value=${color}> ${color} </option>`
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

class CartProduct {
	constructor(color, id, quantity) {
		this.color = color;
		this.id = id;
		this.quantity = quantity;
	}
}

document.querySelector("#addToCart").addEventListener("click", addToCart);

function addToCart() {
	let productToAdd = createCartObject();

	if (productToAdd.color === "") {
		alert("Veuillez selectionner une couleur");
	} else if (productToAdd.quantity === "0") {
		alert("Veuillez selectionner une quantitée");
	} else {
		checkCartContent(productToAdd);
	}
}

function createCartObject() {
	productToAdd = new CartProduct(
		document.querySelector("#colors").value,
		urlID,
		document.querySelector("#quantity").value
	);
	return productToAdd;
}

function checkCartContent(productToCheck) {
	if (JSON.parse(localStorage.getItem("cartContent")) === null) {
		cartContent.push(productToCheck);
		saveCartContent(cartContent);
	} else {
		cartContent = JSON.parse(localStorage.getItem("cartContent"));

		let isColorThere = null;
		let isProductThere;

		for (let i = 0; i < cartContent.length; i++) {
			if (productToCheck.id === cartContent[i].id) {
				isProductThere = true;

				if (productToCheck.color === cartContent[i].color) {
					cartContent[i].quantity =
						parseInt(cartContent[i].quantity) +
						parseInt(productToCheck.quantity);
					saveCartContent(cartContent);

					isColorThere = true;
				}
				if (isColorThere === null) {
					isColorThere = false;
				}
			} else {
				isProductThere = false;
			}
		}
		if (isColorThere === false) {
			cartContent.push(productToCheck);
			saveCartContent(cartContent);
		}
		if (isProductThere === false) {
			cartContent.push(productToCheck);
			saveCartContent(cartContent);
		}
	}
}

function saveCartContent(dataToSave) {
	localStorage.setItem("cartContent", JSON.stringify(dataToSave));
}
