window.addEventListener("load", shoppingCartReload);
window.addEventListener("load", amountInit);

function checkProductExist(pid){
    let exist = document.getElementById(pid);
    return (exist !== null);
}

function shoppingCartReload(){
    for (var key in localStorage)   {
		if (parseInt(key)) shoppingCartAddItem(localStorage.getItem(key));
    }
}

function shoppingCartAddItem(localStorageItem){
    if (localStorageItem === null) return ;

    let item = JSON.parse(localStorageItem);
    let content = document.createElement("li");
    content.setAttribute("id", item.pid);
    let itemName = document.createTextNode(item.name);
    let itemImg = new Image(40, 40);
    itemImg.src = 'https://secure.s26.ierg4210.ie.cuhk.edu.hk/media/images/'+ item.name.replaceAll(" ", "_");
    content.appendChild(itemImg);
    content.appendChild(itemName);
    let itemInput = document.createElement("input");
	itemInput.name = item.pid; 
    itemInput.type = "number";
    itemInput.defaultValue = item.quantity;
    itemInput.setAttribute("min", 1);
    itemInput.setAttribute("size", 10);
    itemInput.setAttribute("placeholder", "Range: [1, ]");
    content.appendChild(itemInput);
	let deleteItemButton = deleteButton(localStorageItem);
	content.appendChild(deleteItemButton);

    document.getElementById("shopping-cart-content").appendChild(content);
}
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
	}
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
    if (localStorage.getItem("amount") === null  || localStorage.getItem("amount") === "NaN"){
        localStorage.setItem("amount", amount);
    }else {
        amount = parseInt(localStorage.getItem("amount"));
        amount = amount + (newQuantity-oldQuantity)*parseInt(item.price);
        localStorage.setItem("amount", amount);
    }
    localStorage.setItem(item.pid, JSON.stringify(item));

    document.getElementById("total-amount").textContent = "Total amount: " + amount;
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
