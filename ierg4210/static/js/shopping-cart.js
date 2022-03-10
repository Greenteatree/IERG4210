
document.getElementById("add-to-cart-button").addEventListener("click", addProdcut);
window.addEventListener("load", shoppingCartReload);
window.addEventListener("load", amountInit);

const val = JSON.parse(document.getElementById('data').textContent);
const data = JSON.parse(val);

function checkProductExist(pid){
    let exist = document.getElementById(pid);
	return (exist !== null);
}

function shoppingCartReload(){
	for (var key in localStorage)	{
		if (parseInt(key))
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
	itemInput.id = "input" + item.pid;
    itemInput.type = "number";
	itemInput.name = item.pid;
    itemInput.defaultValue = item.quantity;
    itemInput.setAttribute("min", 1);
    itemInput.setAttribute("size", 10);
    itemInput.setAttribute("placeholder", "Range: [1, ]");
    content.appendChild(itemInput);

    document.getElementById("shopping-cart-content").appendChild(content);

}


/*
inputList = document.querySelectorAll(".dropdown-content input");
testAmount = document.getElementById("total-amount");
console.log(inputList);
if (inputList !== null){
	console.log("running");
	for (var i = 0, len = inputList.length; i < len; i++) {
		console.log(inputList[i]);
		inputList[i].addEventListener("input", amountUpdate);
	}
	//inputList.addEventListener("input", amountInit);
}
*/
function amountInit(){
	
	inputList = document.querySelectorAll(".dropdown-content input");
	amountContent = document.getElementById("total-amount");
	if (localStorage.getItem("amount") === null){
		currentAmount = 0;
	}else {
		currentAmount = localStorage.getItem("amount");
	}

	amountContent.textContent =  "Total amount: " + currentAmount;
	if (inputList !== null){
    	for (var i = 0, len = inputList.length; i < len; i++) {
			
        	inputList[i].addEventListener("input", amountUpdate);
    }
    //inputList.addEventListener("input", amountInit);
}
}

function shoppingContentUpdate(){

}

function amountUpdate(event){
	let localStorageItem = localStorage.getItem(event.target.name);
	let newQuantity =  parseInt(event.target.value);
	let item = JSON.parse(localStorageItem);
	if (item === null) return ;
	
	let oldQuantity = item.quantity;
	item.quantity = newQuantity;
	let amount = 0;
	if (localStorage.getItem("amount") === null){
		localStorage.setItem("amount", amount);
	}else {
		amount = parseInt(localStorage.getItem("amount"));
		amount = amount + (newQuantity-oldQuantity)*parseInt(item.price);
		localStorage.setItem("amount", amount);
	}
	localStorage.setItem(item.pid, JSON.stringify(item));
	
	document.getElementById("total-amount").textContent = "Total amount: " + amount;
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
	input.name = data.pid;
    input.defaultValue = 1;
    input.setAttribute("min", 1);
    input.setAttribute("max", 3);
    input.setAttribute("size", 10);
    input.setAttribute("placeholder", "Range: [1, ]");
    content.appendChild(input);

    document.getElementById("shopping-cart-content").appendChild(content);
	productData = JSONdataToLocalDict(data);
	localStorage.setItem(data.pid.toString(), JSON.stringify(productData));
	if (localStorage.getItem("amount") === null) {
		localStorage.setItem("amount",data.price);
	}
	// Hard coded can use a new function
	// add to eventlistener since line 3 using load
	amountInit();

}

function JSONdataToLocalDict(JSONdata){
	var dict = {"quantity": 1};
	for (const [key, value] of Object.entries(JSONdata)) {
		dict[key] = value;
	}
	return dict;
	

}

