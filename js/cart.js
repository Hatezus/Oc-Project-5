/*--------------------------------------------------[ Globals vars ]--------------------------------------------------*/
let cartContent = [];
let numberOfItemsInCart = 0;
let costOfCart = 0;
let arrayOfProductsID = [];
let req = {};
let isValid;

/*--------------------------------------------------[ Classes ]--------------------------------------------------*/
class CartItem {
	constructor(
		color,
		id,
		name,
		price,
		imageUrl,
		description,
		altTxt,
		quantity
	) {
		this.color = color;
		this.id = id;
		this.name = name;
		this.price = price;
		this.imageUrl = imageUrl;
		this.description = description;
		this.altTxt = altTxt;
		this.quantity = quantity;
	}
}

/*--------------------------------------------------[ Main ]--------------------------------------------------*/
main();

async function main() {
	await handleDisplay();

	activeDeleteButton();
	activeQuantityInput();

	document.querySelector("#order").addEventListener("click", handleOrder);
}

/*--------------------------------------------------[ Displays ]--------------------------------------------------*/
async function handleDisplay() {
	await getCartDatas();
	displayCartContent();
	displayCartCost();
}

async function getCartDatas() {
	let savedCartContent = JSON.parse(localStorage.getItem("cartContent"));

	for (let i = 0; i < savedCartContent.length; i++) {
		let urlID = savedCartContent[i].id;

		await fetch("http://localhost:3000/api/products/" + urlID)
			.then((res) => {
				if (res.ok === true) {
					return res.json();
				}
			})
			.then((product) => {
				createCartObjects(product, savedCartContent[i]);
			})
			.catch((err) => {
				console.log("Erreur");
			});
	}
}

function createCartObjects(datasFromFetch, datasFromLocalStorage) {
	cartContent.push(
		new CartItem(
			datasFromLocalStorage.color,
			datasFromLocalStorage.id,
			datasFromFetch.name,
			datasFromFetch.price,
			datasFromFetch.imageUrl,
			datasFromFetch.description,
			datasFromFetch.altTxt,
			datasFromLocalStorage.quantity
		)
	);
}

function displayCartContent() {
	const cursor = document.querySelector("#cart__items");

	for (let i = 0; i < cartContent.length; i++) {
		cursor.insertAdjacentHTML(
			"afterbegin",
			`<article class="cart__item"
				data-id="${cartContent[i].id}"
				data-color="${cartContent[i].color}"
			>
				<div class="cart__item__img">
					<img
						src="${cartContent[i].imageUrl}"
						alt="${cartContent[i].altTxt}"
					/>
				</div>
				<div class="cart__item__content">
					<div class="cart__item__content__description">
						<h2>${cartContent[i].name}</h2>
						<p>${cartContent[i].color}</p>
						<p>${cartContent[i].price} €</p>
					</div>
					<div class="cart__item__content__settings">
						<div
							class="cart__item__content__settings__quantity"
						>
							<p>Qté :</p>
							<input
								type="number"
								class="itemQuantity"
								name="itemQuantity"
								min="1"
								max="100"
								value=${cartContent[i].quantity}
							/>
						</div>
						<div
							class="cart__item__content__settings__delete"
						>
							<p class="deleteItem">Supprimer</p>
						</div>
					</div>
				</div>
			</article>`
		);
	}
}

function displayCartCost() {
	numberOfItemsInCart = 0;
	costOfCart = 0;

	calculCartQuantity();
	calculCartCost();

	let cursor = document.querySelector("#totalQuantity");
	// cursor.insertAdjacentHTML("afterbegin", `${numberOfItemsInCart}`);
	cursor.innerHTML = numberOfItemsInCart;

	cursor = document.querySelector("#totalPrice");
	// cursor.insertAdjacentHTML("afterbegin", `${costOfCart}`);
	cursor.innerHTML = costOfCart;
}

function calculCartQuantity() {
	for (let i = 0; i < cartContent.length; i++) {
		numberOfItemsInCart += parseInt(cartContent[i].quantity);
	}
}

function calculCartCost() {
	for (let i = 0; i < cartContent.length; i++) {
		costOfCart +=
			parseInt(cartContent[i].quantity) * parseInt(cartContent[i].price);
	}
}

/*--------------------------------------------------[ Modifyings inputs ]--------------------------------------------------*/
function activeDeleteButton() {
	let buttons = document.querySelectorAll(
		".cart__item__content__settings__delete"
	);

	buttons.forEach((button) => {
		button.addEventListener("click", function deleteCartItem() {
			let selectedArticle = button.closest("article");
			let selectedID = selectedArticle.dataset.id;
			let selectedColor = selectedArticle.dataset.color;

			for (i = 0; i < cartContent.length; i++) {
				if (
					cartContent[i].id === selectedID &&
					cartContent[i].color === selectedColor
				) {
					cartContent.splice(i, 1); //delete an entry without leaving a blank
					selectedArticle.remove(); //removing the html part
					saveCartContent(cartContent);
					displayCartCost();
				}
			}
		});
	});
}

function activeQuantityInput() {
	let quantityInputs = document.querySelectorAll(
		".cart__item__content__settings__quantity"
	);

	quantityInputs.forEach((quantityInput) => {
		quantityInput.addEventListener("change", function changeQuantity() {
			let selectedArticle = quantityInput.closest("article");
			let selectedID = selectedArticle.dataset.id;
			let selectedColor = selectedArticle.dataset.color;
			let newQuantity = quantityInput.children[1].value;

			for (i = 0; i < cartContent.length; i++) {
				if (
					cartContent[i].id === selectedID &&
					cartContent[i].color === selectedColor
				) {
					cartContent[i].quantity = newQuantity;
					saveCartContent(cartContent);
					displayCartCost();
				}
			}
		});
	});
}

function saveCartContent(dataToSave) {
	localStorage.setItem("cartContent", JSON.stringify(dataToSave));
}
/*--------------------------------------------------[ Order ]--------------------------------------------------*/

function handleOrder() {
	checkOrder();
	if (isValid === true) {
		createOrder();
		sendOrder();
	}
}

function checkOrder() {
	isValid = true;
	if (
		document.querySelector("#firstName").value.length === 0 ||
		document.querySelector("#lastName").value.length === 0 ||
		document.querySelector("#city").value.length === 0 ||
		document.querySelector("#address").value.length === 0 ||
		(document.querySelector("#email").value.length === 0) === true
	) {
		isValid = false;
		alert("Tout les champs doivent être remplis");
	}
	if (
		containsNumbers(document.querySelector("#firstName").value) ||
		containsNumbers(document.querySelector("#lastName").value) ||
		containsNumbers(document.querySelector("#city").value) === true
	) {
		isValid = false;
		alert("Le champs ne peut pas comporter de chiffres");
	}
	if (
		containsSpecials(document.querySelector("#firstName").value) ||
		containsSpecials(document.querySelector("#lastName").value) ||
		containsSpecials(document.querySelector("#address").value) ||
		containsSpecials(document.querySelector("#city").value) === true
	) {
		isValid = false;
		alert("Le champs ne peut pas contenir de caractères spéciaux");
	}

	if (
		containsMultiplesSpaces(document.querySelector("#firstName").value) ||
		containsMultiplesSpaces(document.querySelector("#lastName").value) ||
		containsMultiplesSpaces(document.querySelector("#address").value) ||
		containsMultiplesSpaces(document.querySelector("#city").value) ||
		containsMultiplesSpaces(document.querySelector("#email").value) === true
	) {
		isValid = false;
		alert(
			"Le champs ne doit ni finir ni commencer par un espace et il ne peut pas y voir plusieurs epsces consécutifs"
		);
	}
	if (containMailsNeeds(document.querySelector("#email").value) === false) {
		isValid = false;
		alert("L'adresse mail n'est pas au bon format");
	}

	// if (isValid === true) {
	// 	alert("Votre commande est transmise");
	// 	document.location.href =
	// 		"http://127.0.0.1:5500/front/html/confirmation.html";
	// }
	console.log(isValid);
	return isValid;
}

function containsNumbers(stringToTest) {
	return /\d/.test(stringToTest);
}

function containsSpecials(stringToTest) {
	const specialsChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
	return specialsChars.test(stringToTest);
}

function containsMultiplesSpaces(stringToTest) {
	const multipleSpaces = /\  |^\s|$\s/;
	return multipleSpaces.test(stringToTest);
}

function containMailsNeeds(stringToTest) {
	const mailsNeeds = /[@.]/;
	return mailsNeeds.test(stringToTest);
}

function createOrder() {
	const contact = {
		firstName: document.querySelector("#firstName").value,
		lastName: document.querySelector("#lastName").value,
		address: document.querySelector("#address").value,
		city: document.querySelector("#city").value,
		email: document.querySelector("#email").value,
	};

	localStorage.setItem("contact", JSON.stringify(contact));

	for (let i = 0; i < cartContent.length; i++) {
		arrayOfProductsID.push(cartContent[i].id);
	}

	req = contact + arrayOfProductsID;

	localStorage.setItem("reqAvant", JSON.stringify(req));
}

function sendOrder() {
	localStorage.setItem("req", JSON.stringify(req));
}

// function activeDeleteButton() {
// 	let buttons = document.querySelectorAll(
// 		".cart__item__content__settings__delete"
// 	);

// 	buttons.forEach((button) => {
// 		button.addEventListener("click", deleteCartItem(button));
// 	});
// }

// function deleteCartItem(button) {
// 	button.setAttribute("style", "background-color: yellow;");
// 	let selectedArticle = button.closest("article");
// 	console.log(selectedArticle.dataset.id);
// }
