const val = JSON.parse(document.getElementById('data').textContent);
var data = JSON.parse(val);
try {
	//const val = JSON.parse(document.getElementById('data').textContent);
	testingThePid = data.pid;
	if (typeof data.pid == "undefined"){
		console.log("Change data.");
		throw "The json parse is not as normal";
	}
} catch (error){
	
	function changeData(event) {
		data = JSON.parse(val);
		data = data[event.target.name];
	}	
	
	const nodeList = document.querySelectorAll(".btn-primary");
	for (let i = 0; i < nodeList.length; i++){
		console.log(nodeList[i]);
		nodeList[i].addEventListener("click", changeData);
		nodeList[i].addEventListener("click", addProdcut);
		//nodeList[i].addEventListener("click", testAlertFunction);
	}

}
function testAlertFunction(event){

	alert(event.target.name);
}
/*
function changeData(event) {
        var data = JSON.parse(val);
        data = data[event.target.name];


}
*/
document.getElementById("add-to-cart-button").addEventListener("click", addProdcut);
window.addEventListener("load", shoppingCartReload);
window.addEventListener("load", amountInit);

/*
const val = JSON.parse(document.getElementById('data').textContent);
try {
	const data = JSON.parse(val);
} catch (error){
		
}
*/
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
		
    itemImg.src ='https://secure.s26.ierg4210.ie.cuhk.edu.hk/media/images/'+ item.name.replaceAll(" ", "_");
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
	let deleteItemButton = deleteButton(localStorageItem);
    content.appendChild(deleteItemButton);
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
	if (isNaN(newQuantity)) {
		let one = 1;
		newQuantity = 0;

	} else {
		item.quantity = newQuantity;
	}
	let amount = 0;
	if (localStorage.getItem("amount") === null || localStorage.getItem("amount") === "NaN"){
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
//    let url = window.location.href.slice(-1);


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
//    input.setAttribute("max", 3);
    input.setAttribute("size", 10);
    input.setAttribute("placeholder", "Range: [1, ]");
    content.appendChild(input);

    document.getElementById("shopping-cart-content").appendChild(content);
	productData = JSONdataToLocalDict(data);
	localStorage.setItem(data.pid.toString(), JSON.stringify(productData));
	let amount = 0;
	if (localStorage.getItem("amount") === null || localStorage.getItem("amount") === "NaN" || isNaN(localStorage.getItem("amount"))) {
		amount += 0;
    } else {
		amount += parseInt(localStorage.getItem("amount"));
	}

	
	amount += parseInt(data.price);
	localStorage.setItem("amount", amount);

	let button = deleteButton(localStorage.getItem(data.pid.toString()));
	content.appendChild(button);
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


function deleteButton(localStorageItem){
    let item = JSON.parse(localStorageItem);
    let button = document.createElement("BUTTON");
    button.addEventListener("click", amountUpdate);
    button.addEventListener("click", deleteShoppingCartItem);
    button.itemPid = item.pid;
    button.name = item.pid;
    let text = document.createTextNode("Delete");
    button.value = "X";
    button.append(text);
    return button;

}

function deleteShoppingCartItem(event){
    //let item = JSON.parse(localStorageItem);

    let targetListItem = document.getElementById(event.target.itemPid);
    localStorage.removeItem(event.target.itemPid);
    targetListItem.remove();

}



