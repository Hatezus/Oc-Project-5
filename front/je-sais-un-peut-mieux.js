const url = new URL(window.location.href);
const searchParams1 = new URLSearchParams(url.search);
const urlID = searchParams1.get("id");
console.log(urlID);

fetch("http://localhost:3000/api/products/" + urlID)
	.then((res) => {
		if (res.ok === true) {
			return res.json();
		}
	})
	.then((product) => {
		console.log(product);
		// display(product);
	})
	.catch((err) => {
		console.log("Erreur");
	});
