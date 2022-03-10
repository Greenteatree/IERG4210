document.getElementById("add-to-cart-button").addEventListener("click", addProdcut);
window.addEventListener("load", shoppingCartReload());

const val = JSON.parse(document.getElementById('data').textContent);
const data = JSON.parse(val);

function checkProductExist(pid){
	console.log(pid);
    let exist = document.getElementById(pid);
    console.log(exist === null);
	return (exist !== null);
}

function shoppingCartReload(){
	for (var key in localStorage)	{
		shoppingCartAddItem(localStorage.getItem(key));
	}
}

function shoppingCartAddItem(localStorageItem){
	if (localStorageItem === null) return ;

	let item = JSON.parse(localStorageItem);
	let content = document.createElement("li");
    content.setAttribute("id", item.pid);
    let itemName = document.createTextNode(item.name);
    let itemImg = new Image(40, 40);
    itemImg.src = item.image_url;
    content.appendChild(itemImg);
    content.appendChild(itemName);
    let itemInput = document.createElement("input");
    itemInput.type = "number";
    itemInput.defaultValue = item.quantity;
    itemInput.setAttribute("min", 1);
    itemInput.setAttribute("size", 10);
    itemInput.setAttribute("placeholder", "Range: [1, ]");
    content.appendChild(itemInput);

    document.getElementById("shopping-cart-content").appendChild(content);

}

function shoppingContentUpdate(){
	
	

}

function amountUpdate(price, quantity){
	let amount = 0;
	if (localStorage.getItem("amount") === null){
		localStroage.setItem("amount", amount);
	}else {
		amount = localStorage.getItem("amount");
		localStroage.setItem("amount", amount+(price*quantity));
	}
	
}


function addProdcut(){
	if (checkProductExist(data.pid)) {
		alert("You already add this item to the cart!");
		return ;
	} 

    const content = document.createElement("li");
    content.setAttribute("id", data.pid);
    let url = window.location.href.slice(-1);


//  const val = JSON.parse(document.getElementById('data').textContent);
//  const data = JSON.parse(val);
//    content.setAttribute("class", "img"+data.pid);

    var name = document.createTextNode(data.name);
    var img = new Image(40, 40);
    img.src = data.image_url;
//    content.style.listStyleImage = data.image_url;
    content.appendChild(img);
    content.appendChild(name);
    var input = document.createElement("input");
    input.type = "number";
    input.defaultValue = 1;
    input.setAttribute("min", 1);
    input.setAttribute("max", 3);
    input.setAttribute("size", 10);
    input.setAttribute("placeholder", "Range: [1, ]");
    content.appendChild(input);

    document.getElementById("shopping-cart-content").appendChild(content);
	productData = JSONdataToLocalDict(data);
	localStorage.setItem(data.pid.toString(), JSON.stringify(productData));


}

function JSONdataToLocalDict(JSONdata){
	var dict = {"quantity": 1};
	for (const [key, value] of Object.entries(JSONdata)) {
		dict[key] = value;
	}
	return dict;
	

}

