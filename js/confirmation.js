let data = JSON.parse(localStorage.getItem("req"));
console.log(data);

fetch("http://localhost:3000/api/order", {
	method: "POST",
	headers: {
		"Content-Type": "application/json",
	},
	body: data,
})
	.then((response) => response.json())
	.then((data) => {
		console.log("Success:", data);
	})
	.catch((error) => {
		console.error("Error:", error);
	});
