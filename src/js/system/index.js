import { doLogout, supabase } from "../main";

// Assign Logout Functionality
const btn_logout = document.getElementById("btn_logout");

btn_logout.onclick = doLogout;

async function fetchAndDisplayDishes() {
  const { data: dishes, error } = await supabase.from("dishes").select("*");

  if (error) {
    console.error("Error fetching dishes:", error);
    return;
  }

  console.log("Fetched dishes:", dishes); // Log fetched dishes

  mainDishes(dishes);
  noodleDishes(dishes); // Call the function to display noodle dishes
  snacksDishes(dishes); // Call the function to display snacks dishes
  riceDishes(dishes); // Call the function to display snacks dishes
  soupDishes(dishes); // Call the function to display
  dissertSweet(dishes);
  beverages(dishes); // Call the function to display
}
// MainDishes
function mainDishes(dishesData) {
  const mainDishesContainer = document.getElementById("mainDishes");

  const filteredMainDishes = dishesData.filter(
    (dish) => dish.categories_id === 2
  );

  console.log("Filtered main dishes:", filteredMainDishes); // Log filtered main dishes

  filteredMainDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    mainDishesContainer.appendChild(dishElement);
  });
}
// NoodleDishes
function noodleDishes(dishesData) {
  const noodleDishesContainer = document.getElementById("noodleDishes");

  const filteredNoodleDishes = dishesData.filter(
    (dish) => dish.categories_id === 1
  );

  console.log("Filtered noodle dishes:", filteredNoodleDishes); // Log filtered noodle dishes

  filteredNoodleDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    noodleDishesContainer.appendChild(dishElement);
  });
}
// Snacks
function snacksDishes(dishesData) {
  const snacksDishesContainer = document.getElementById("snacksDishes");

  const filteredSnacksDishes = dishesData.filter(
    (dish) => dish.categories_id === 4
  );

  console.log("Filtered snacks dishes:", filteredSnacksDishes); // Log filtered snacks dishes

  filteredSnacksDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    snacksDishesContainer.appendChild(dishElement);
  });
}
// Rice Dishes

function riceDishes(dishesData) {
  const riceDishesContainer = document.getElementById("riceDishes");

  const filteredriceDishes = dishesData.filter(
    (dish) => dish.categories_id === 6
  );

  console.log("Filtered rice dishes:", filteredriceDishes); // Log filtered snacks dishes

  filteredriceDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    riceDishesContainer.appendChild(dishElement);
  });
}
// Soup Dishes
function soupDishes(dishesData) {
  const soupDishesContainer = document.getElementById("soupDishes");

  const filteredsoupDishes = dishesData.filter(
    (dish) => dish.categories_id === 7
  );

  console.log("Filtered Soup dishes:", filteredsoupDishes); // Log filtered snacks dishes

  filteredsoupDishes.forEach((dish) => {
    const dishElement = createDishElement(dish);
    soupDishesContainer.appendChild(dishElement);
  });
}
// Dessert and Sweets
function dissertSweet(dishesData) {
  const dissertSweetContainer = document.getElementById("dissertSweet");

  const filtereddissertSweet = dishesData.filter(
    (dish) => dish.categories_id === 8
  );

  console.log("Filtered Desserts and Sweet dishes:", filtereddissertSweet); // Log filtered snacks dishes

  filtereddissertSweet.forEach((dish) => {
    const dishElement = createDishElement(dish);
    dissertSweetContainer.appendChild(dishElement);
  });
}
// Beverages

function beverages(dishesData) {
  const beveragesContainer = document.getElementById("beverages");

  const filteredbeverages = dishesData.filter(
    (dish) => dish.categories_id === 8
  );

  console.log("Filtered beverages:", filteredbeverages); // Log filtered snacks dishes

  filteredbeverages.forEach((dish) => {
    const dishElement = createDishElement(dish);
    beveragesContainer.appendChild(dishElement);
  });
}

// Dish Element Creation
function createDishElement(dish) {
  const dishElement = document.createElement("div");
  dishElement.classList.add("col-4");

  dishElement.innerHTML = `
    <a href="./Recipe/recipe.html?id=${dish.id}">
      <div class="card">
        <img
          src="${dish.image_path}"
          class="card-img-top"
          alt="..."
        />
        <small class="card-title text-center">${dish.dish_name}</small>
      </div>
    </a>
  `;

  return dishElement;
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAndDisplayDishes();
});
