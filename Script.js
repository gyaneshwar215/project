// Menu database
let menuItems = [
  {id:1, name:"Pizza", description:"Cheesy pizza", price:8.99, category:"Main Course", image:"pizz", specials:true, customizations:{size:["Small","Medium","Large"], toppings:["Cheese","Olives","+2 Cheese"]}, rating:4, time:"15 min"},
  {id:2, name:"Iced Coffee", description:"Cold brew with ice", price:3.50, category:"Drinks", image:"coffee.jpg", rating:5, time:"5 min"},
  {id:3, name:"Caesar Salad", description:"Fresh romaine lettuce with dressing", price:6.50, category:"Starters", image:"salad.jpg", rating:4, time:"8 min"},
  {id:4, name:"Spaghetti Bolognese", description:"Pasta with beef and tomato sauce", price:10.99, category:"Main Course", image:"spaghetti.jpg", rating:5, time:"20 min"},
  {id:5, name:"Lemonade", description:"Freshly squeezed lemonade with mint", price:2.99, category:"Drinks", image:"lemonade.jpg", rating:4, time:"5 min"},
  {id:6, name:"Cheeseburger", description:"Beef patty with cheese and lettuce", price:9.50, category:"Main Course", image:"burger.jpg", rating:5, time:"12 min"},
  {id:7, name:"Chocolate Cake", description:"Rich and moist chocolate cake", price:4.50, category:"Desserts", image:"chocolate_cake.jpg", rating:5, time:"10 min"},
  {id:8, name:"French Fries", description:"Crispy golden fries", price:3.00, category:"Starters", image:"fries.jpg", rating:4, time:"7 min"},
  {id:9, name:"Grilled Salmon", description:"Fresh salmon with lemon butter sauce", price:14.99, category:"Main Course", image:"salmon.jpg", rating:5, time:"25 min"},
  {id:10, name:"Ice Cream Sundae", description:"Vanilla ice cream with toppings", price:3.99, category:"Desserts", image:"icecream.jpg", rating:5, time:"5 min"}
];


let cart = [];
let isAdmin = false;

// Display Menu
function displayMenu(items){
  const menu = document.getElementById("menu");
  menu.innerHTML="";
  items.forEach(item=>{
    let card=document.createElement("div");
    card.classList.add("card");
    card.innerHTML=`
      <img src="images/${item.image || 'placeholder.jpg'}" alt="${item.name}">
      <h3>${item.name} ⭐${item.rating || 0}</h3>
      <p>${item.description}</p>
      <p><strong>$${item.price.toFixed(2)}</strong></p>
      ${item.specials ? `<span class="badge">Special!</span>`:""}
      <p><em>Ready in ${item.time || "10 min"}</em></p>
    `;

    // Customizations
    if(item.customizations){
      for(let opt in item.customizations){
        const select=document.createElement("select");
        item.customizations[opt].forEach(choice=>{
          let extra=choice.includes("+2")? " (+$2)" : "";
          select.innerHTML+=`<option>${choice}${extra}</option>`;
        });
        card.appendChild(select);
      }
    }

    let btn=document.createElement("button");
    btn.textContent="Add to Cart";
    btn.onclick=()=>addToCart(item,card);
    card.appendChild(btn);

    if(isAdmin){
      let editBtn=document.createElement("button");
      editBtn.textContent="Edit";
      editBtn.onclick=()=>editItem(item);
      let delBtn=document.createElement("button");
      delBtn.textContent="Delete";
      delBtn.onclick=()=>deleteItem(item.id);
      card.appendChild(editBtn);
      card.appendChild(delBtn);
    }

    menu.appendChild(card);
  });
}
displayMenu(menuItems);

// Filter
function filterMenu(category){
  if(category==="All") displayMenu(menuItems);
  else if(category==="Specials") displayMenu(menuItems.filter(i=>i.specials));
  else displayMenu(menuItems.filter(i=>i.category===category));
}

// Cart
function addToCart(item,card){
  let price=item.price;
  let selections=[];
  card.querySelectorAll("select").forEach(sel=>{
    selections.push(sel.value);
    if(sel.value.includes("+2")) price+=2;
  });
  cart.push({...item, selections, price});
  renderCart();
}
function renderCart(){
  const ul=document.getElementById("cartItems");
  ul.innerHTML="";
  let subtotal=0;
  cart.forEach((c,i)=>{
    subtotal+=c.price;
    let li=document.createElement("li");
    li.textContent=`${c.name} (${c.selections.join(", ")}) - $${c.price.toFixed(2)}`;
    let remove=document.createElement("button");
    remove.textContent="X";
    remove.onclick=()=>{cart.splice(i,1);renderCart();}
    li.appendChild(remove);
    ul.appendChild(li);
  });
  let tax=subtotal*0.1;
  let total=subtotal+tax;
  document.getElementById("subtotal").textContent=subtotal.toFixed(2);
  document.getElementById("tax").textContent=tax.toFixed(2);
  document.getElementById("total").textContent=total.toFixed(2);
  document.getElementById("points").textContent=Math.floor(total);
}

// Checkout
function checkout(){
  document.getElementById("checkoutModal").classList.remove("hidden");
  const summary=document.getElementById("orderSummary");
  summary.innerHTML="";
  cart.forEach(c=>{
    let li=document.createElement("li");
    li.textContent=`${c.name} - $${c.price.toFixed(2)}`;
    summary.appendChild(li);
  });
}
function closeCheckout(){document.getElementById("checkoutModal").classList.add("hidden");}
function confirmOrder(){
  alert("Order Confirmed! 🎉");
  cart=[];
  renderCart();
  closeCheckout();
}

// Admin
function showLogin(){document.getElementById("loginModal").classList.remove("hidden");}
function closeLogin(){document.getElementById("loginModal").classList.add("hidden");}
function login(){
  let pw=document.getElementById("adminPassword").value;
  if(pw==="admin123"){
    isAdmin=true;
    document.getElementById("admin").classList.remove("hidden");
    closeLogin();
    displayMenu(menuItems);
  } else alert("Wrong password");
}

// Add/Edit/Delete
document.getElementById("itemForm").onsubmit=(e)=>{
  e.preventDefault();
  let id=document.getElementById("editId").value;
  let newItem={
    id:id?parseInt(id):Date.now(),
    name:document.getElementById("name").value,
    description:document.getElementById("desc").value,
    price:parseFloat(document.getElementById("price").value),
    category:document.getElementById("category").value,
    image:document.getElementById("image").value || "placeholder.jpg"
  };
  if(id){
    let idx=menuItems.findIndex(i=>i.id==id);
    menuItems[idx]=newItem;
  }else menuItems.push(newItem);
  displayMenu(menuItems);
  e.target.reset();
};
function editItem(item){
  document.getElementById("editId").value=item.id;
  document.getElementById("name").value=item.name;
  document.getElementById("desc").value=item.description;
  document.getElementById("price").value=item.price;
  document.getElementById("category").value=item.category;
  document.getElementById("image").value=item.image;
}
function deleteItem(id){
  menuItems=menuItems.filter(i=>i.id!==id);
  displayMenu(menuItems);
}

// Search
document.getElementById("searchBar").addEventListener("input",e=>{
  let q=e.target.value.toLowerCase();
  displayMenu(menuItems.filter(i=>i.name.toLowerCase().includes(q)));
});

