const API = "http://localhost/php-interview-crud/";


// =========================
// SIGNUP
// =========================

const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(signupForm);

        const name = formData.get("name");
        const email = formData.get("email");
        const password = formData.get("password");

        const message = document.getElementById("signupMessage");

        // Frontend validation
        if (!name || !email || !password) {
            message.textContent = "All fields are required";
            return;
        }

        if (password.length < 6) {
            message.textContent = "Password must contain at least 6 characters";
            return;
        }

        try {
            const response = await fetch(
                API + "auth/signup.php",
                {
                    method: "POST",
                    body: formData
                }
            );

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
    });
}


// =========================
// LOGIN
// =========================

const loginForm = document.getElementById("loginForm");

if (loginForm) {
    loginForm.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(loginForm);

        const email = formData.get("email");
        const password = formData.get("password");

        const message = document.getElementById("loginMessage");

        // Frontend validation
        if (!email || !password) {
            message.textContent = "All fields are required";
            return;
        }

        if (password.length < 6) {
            message.textContent = "Password must contain at least 6 characters";
            return;
        }

        try {
            const response = await fetch(
                API + "auth/login.php",
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );

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
    });
}


// =========================
// PRODUCT CRUD
// =========================

const productForm = document.getElementById("productForm");
const productContainer = document.getElementById("productContainer");

const formTitle = document.getElementById("formTitle");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");


// This stores the product ID while editing
// null = Add mode
// number = Edit mode
let editId = null;


// Load products when dashboard opens
if (productForm) {
    getProducts();
}


// =========================
// GET PRODUCTS
// =========================

async function getProducts() {

    try {

        const response = await fetch(
            API + "products/get.php",
            {
                credentials: "include"
            }
        );

        const data = await response.json();

        if (data.success) {
            showProducts(data.products);
        } else {
            productContainer.innerHTML = `<p>${data.message}</p>`;
        }

    } catch (error) {

        console.log(error);

        productContainer.innerHTML =
            "<p>Unable to load products</p>";
    }
}


// =========================
// SHOW PRODUCTS
// =========================

function showProducts(products) {

    productContainer.innerHTML = "";

    if (!products || products.length === 0) {
        productContainer.innerHTML = "<p>No products found</p>";
        return;
    }

    products.forEach(function (product) {

        const card = document.createElement("div");

        card.className = "product-card";

        card.innerHTML = `
            <h3>Item Name: ${product.item_name}</h3>

            <p class="price">
                Price: ₹${product.price}
            </p>

            <p>
                Description: ${product.description}
            </p>

            <div class="card-buttons">

                <button
                    onclick="editProduct(
                        ${product.id},
                        '${product.item_name}',
                        '${product.price}',
                        '${product.description}'
                    )"
                >
                    Edit
                </button>

                <button
                    onclick="deleteProduct(${product.id})"
                >
                    Delete
                </button>

            </div>
        `;

        productContainer.appendChild(card);
    });
}


// =========================
// ADD / UPDATE PRODUCT
// =========================

if (productForm) {

    productForm.addEventListener("submit", async function (e) {

        e.preventDefault();

        const itemName =
            document.getElementById("itemName").value.trim();

        const price =
            document.getElementById("price").value.trim();

        const description =
            document.getElementById("description").value.trim();


        // Frontend validation
        if (!itemName || !price || !description) {

            alert("All fields are required");

            return;
        }


        if (isNaN(price) || Number(price) < 0) {

            alert("Price must be a valid number");

            return;
        }


        const formData = new FormData();

        formData.append("item_name", itemName);
        formData.append("price", price);
        formData.append("description", description);


        let url;


        // =========================
        // EDIT MODE
        // =========================

        if (editId !== null) {

            url = API + "products/update.php";

            formData.append("id", editId);

        }

        // =========================
        // ADD MODE
        // =========================

        else {

            url = API + "products/create.php";
        }


        try {

            const response = await fetch(
                url,
                {
                    method: "POST",
                    body: formData,
                    credentials: "include"
                }
            );


            const data = await response.json();

            alert(data.message);


            if (data.success) {

                // Clear form
                productForm.reset();

                // Very important:
                // Clear edit ID
                editId = null;

                // Return to Add mode
                resetProductForm();

                // Reload products
                getProducts();
            }

        } catch (error) {

            console.log(error);

            alert("Something went wrong");
        }

    });
}


// =========================
// EDIT PRODUCT
// =========================

function editProduct(id, name, price, description) {

    // Store product ID
    editId = id;


    // Put product data into form
    document.getElementById("itemName").value = name;

    document.getElementById("price").value = price;

    document.getElementById("description").value = description;


    // Change form to Update mode
    if (formTitle) {
        formTitle.textContent = "Update Product";
    }

    if (submitBtn) {
        submitBtn.textContent = "Update Product";
    }

    if (cancelBtn) {
        cancelBtn.style.display = "inline-block";
    }
}


// =========================
// CANCEL EDIT
// =========================

if (cancelBtn) {

    cancelBtn.addEventListener("click", function () {

        // Clear input fields
        productForm.reset();


        // VERY IMPORTANT
        // Clear edit ID
        // Now form will create a new product
        editId = null;


        // Return to Add mode
        resetProductForm();
    });
}


// =========================
// RESET PRODUCT FORM
// =========================

function resetProductForm() {

    if (formTitle) {
        formTitle.textContent = "Add Product";
    }

    if (submitBtn) {
        submitBtn.textContent = "Add Product";
    }

    if (cancelBtn) {
        cancelBtn.style.display = "none";
    }
}


// =========================
// DELETE PRODUCT
// =========================

async function deleteProduct(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this product?");


    if (!confirmDelete) {
        return;
    }


    const formData = new FormData();

    formData.append("id", id);


    try {

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

    } catch (error) {

        console.log(error);

        alert("Something went wrong");
    }
}


// =========================
// LOGOUT
// =========================

const logoutBtn = document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", async function () {

        try {

            const response = await fetch(
                API + "auth/logout.php",
                {
                    method: "POST",
                    credentials: "include"
                }
            );


            const data = await response.json();


            if (data.success) {

                window.location.href = "index.html";
            }

        } catch (error) {

            console.log(error);

            alert("Logout failed");
        }

    });
}













