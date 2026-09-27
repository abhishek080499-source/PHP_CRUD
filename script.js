const API = "http://localhost/php-interview-crud/";
// const API = "http://localhost:5000/";


// =====================================================
// SIGNUP
// ====================================================

const signupForm = document.getElementById("signupForm")

if(signupForm){
  signupForm.addEventListener("submit" , async function(e){
    e.preventDefault();

    const formData = new FormData (signupForm);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    const message = document.getElementById("signupMessage");

    if(!name || !email || !password){
      message.textContent = "All fileds are required";
      return;
    }
    if(password.length<6){
      message.textContent = "Password must contains 6 characters";
      return;
    }

    try {
      const response = await fetch (API+"auth/signup.php" ,
        {
        method : "POST",
        body : formData
        }
      )
      const data = await response.json();
      message.textContent = data.message;
      
              if (data.success) {
                 signupForm.reset();
                 setTimeout(function () {
                     window.location.href = "index.html";
                }, 1000);
            }
      
    } catch (error) {
  console.log(error);
  message.textContent = "Something went wrong";      
    }
  })
}


// =====================================================
// LOGIN
// =====================================================

const loginForm = document.getElementById("loginForm")

if(loginForm){
  loginForm.addEventListener("submit" , async function(e){
    e.preventDefault();

    const formData = new FormData (loginForm);
    const email = formData.get("email");
    const password = formData.get("password");

    const message = document.getElementById("loginMessage");

    if( !email || !password){
      message.textContent = "All fileds are required";
      return;
    }
    if(password.length<6){
      message.textContent = "Password must contains 6 characters";
      return;
    }

    try {
      const response = await fetch (API+"auth/login.php" ,
        {
        method : "POST",
        body : formData,
        credentials : "include",
        }
      )
      const data = await response.json();
      message.textContent = data.message;
      
              if (data.success) {
                 loginForm.reset();
               window.location.href = "dashboard.html";
              }
    } catch (error) {
  console.log(error);
  message.textContent = "Something went wrong";      
    }
  })
}



//PRODUCTS CRUD Operations


const productForm = document.getElementById("productForm");
const productContainer = document.getElementById("productContainer");

let editId = null;


// ================= LOAD PRODUCTS =================

if (productForm) {
    getProducts();
}
// ================= GET PRODUCTS =================

async function getProducts() {

    const response = await fetch(
        API + "products/get.php",
        {
            credentials: "include"
        }
    );
    const data = await response.json();
    showProducts(data.products);
}


// ================= SHOW PRODUCTS =================

function showProducts(products) {
    productContainer.innerHTML = "";

    if(!products || products.length === 0){
         productContainer.textContent = " No product found";
    }

    products.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <h3> Item-Name : ${product.item_name}</h3>
            <p>Price : ₹${product.price}</p>
            <p>Discription : ${product.description}</p>

            <button onclick="editProduct(
                ${product.id},
                '${product.item_name}',
                '${product.price}',
                '${product.description}'
            )">
                Edit
            </button>

            <button onclick="deleteProduct(${product.id})">
                Delete
            </button>
        `;

        productContainer.appendChild(card);
    });
}


// ================= ADD / UPDATE =================
if(productForm){
productForm.addEventListener("submit", async function(e) {
    e.preventDefault();

    const itemName = document.getElementById("itemName").value;
    const price = document.getElementById("price").value;
    const description = document.getElementById("description").value;


    const formData = new FormData();

    formData.append("item_name", itemName);
    formData.append("price", price);
    formData.append("description", description);


    let url;
    if (editId) {
        url = API + "products/update.php";
        formData.append("id", editId);
    } else {
        url = API + "products/create.php";
    }


    const response = await fetch(url, 
      { method: "POST",
        body: formData,
        credentials: "include"
    });
    const data = await response.json();
 alert(data.message);

    if (data.success) {
        productForm.reset();
        editId = null;
        getProducts();
    }

});
}

// ================= EDIT =================

function editProduct(id, name, price, description) {

    editId = id;

    document.getElementById("itemName").value = name;

    document.getElementById("price").value = price;

    document.getElementById("description").value = description;
}


// ================= DELETE =================

async function deleteProduct(id) {
    const formData = new FormData();
    formData.append("id", id);

    const response = await fetch(
        API + "products/delete.php",
        {
            method: "POST",
            body: formData,
            credentials: "include"
        }
    );
    const data = await response.json();
    alert(data.message);
    if (data.success) {
        getProducts();
    }
}
// =====================================================
// LOGOUT
// =====================================================
const logoutBtn = document.getElementById( "logoutBtn");
if(logoutBtn){    
logoutBtn.addEventListener("click", async function () {

        try {
            const response = await fetch(
                API + "auth/logout.php",
                {
                    method: "POST",
                    credentials: "include"
                }
            );
            const data =
                await response.json();

            if (data.success) {
                window.location.href =
                    "index.html";
            }
        } catch (error) {
            console.error(error);
        }
    }
);
}
