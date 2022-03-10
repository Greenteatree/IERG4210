window.addEventListener("load", shoppingCartReload());
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



