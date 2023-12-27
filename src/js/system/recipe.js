import {
  doLogout,
  supabase,
  successNotification,
  errorNotification,
} from "../main";
btn_logout.onclick = doLogout;

// Function to fetch recipe details based on dish ID
// Function to fetch recipe details based on dish ID
let currentRecipeId; // Declare a variable to store the fetched recipe ID

async function fetchAndDisplayRecipe() {
  try {
    // Get the dish ID from the URL query parameter
    const urlParams = new URLSearchParams(window.location.search);
    const dishId = urlParams.get("id");

    // Fetch specific recipe details from your database (e.g., Supabase) based on dish ID
    const { data: recipeDetails, error } = await supabase
      .from("recipe")
      .select("*")
      .eq("dishes_id", dishId) // Filter by dishes_id instead of id
      .single();

    if (error) {
      console.error("Error fetching recipe:", error);
      return;
    }

    // Log the fetched recipe details to the console
    console.log("Fetched Recipe Details:", recipeDetails);

    // Assign the fetched recipe ID to the variable
    currentRecipeId = recipeDetails.id; // Replace 'id' with the correct property name

    // Populate the HTML structure with fetched recipe details
    populateRecipeDetails(recipeDetails);
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
  }
}

// Function to populate HTML structure with fetched recipe details
// Function to populate HTML structure with fetched recipe details
// Function to populate HTML structure with fetched recipe details
function populateRecipeDetails(recipeDetails) {
  const recipeContainer = document.getElementById("recipe");
  const dishNameElement = recipeContainer.querySelector("#DishName b");
  const proceduresList = recipeContainer.querySelector(
    ".content ol:last-of-type"
  );
  const ingredientsList = recipeContainer.querySelector(".content ul");

  // Access the elements within the recipe container and fill them with the fetched data
  const aboutImg = recipeContainer.querySelector(".about-img img");
  const contentParagraph = recipeContainer.querySelector(".content p");
  const ingredientsHeader = recipeContainer.querySelector(
    ".content h2:first-of-type"
  );
  const proceduresHeader = recipeContainer.querySelector(
    ".content h2:last-of-type"
  );

  // Set the dish name
  dishNameElement.textContent = recipeDetails.dish_name;

  // Set the image source
  aboutImg.src = recipeDetails.image_path;

  // Set the description
  contentParagraph.innerHTML = `<b>Description:</b> ${recipeDetails.discreption}`;

  // Set the ingredients header
  ingredientsHeader.innerHTML = "<b>Ingredients:</b>";

  // Split the ingredients by a newline character
  const ingredients = recipeDetails.ingredients.split("\n");

  // Append each ingredient as a list item
  ingredients.forEach((ingredient) => {
    const listItem = document.createElement("li");
    listItem.textContent = ingredient.trim(); // Include each ingredient
    ingredientsList.appendChild(listItem);
  });

  // Set the procedures header
  proceduresHeader.innerHTML = "<b>Procedures:</b>";

  // Split procedure steps by a period and add each step as a list item
  const procedureSteps = recipeDetails.procedure.split("\n");

  // Append each step as a list item
  procedureSteps.forEach((step) => {
    const listItem = document.createElement("li");
    listItem.textContent = step.trim(); // Include each step
    proceduresList.appendChild(listItem);
  });
}

// Function to add recipe_id to the favorites table
async function addToFavorites(recipeId) {
  try {
    // Retrieve email from localStorage
    const userEmail = localStorage.getItem("email"); // Replace 'userEmail' with the key used to store the email

    if (!userEmail) {
      console.error("User email not found in localStorage");
      return;
    }

    const { data, error } = await supabase
      .from("favorites")
      .insert([{ recipe_id: recipeId, email: userEmail }]); // Use 'userEmail' here instead of 'email'

    if (error) {
      console.error("Error adding to favorites:", error);
      return;
    }

    console.log("Recipe added to favorites:", data);
  } catch (error) {
    console.error("Error adding to favorites:", error.message);
  }
}

// Event listener for the Favorite button click
const favoriteButton = document.getElementById("favoriteButton");
favoriteButton.addEventListener("click", async () => {
  // Use the stored recipe ID from fetchAndDisplayRecipe()
  const recipeId = currentRecipeId;

  // Call the function to add recipe_id to favorites
  await addToFavorites(recipeId);
});

// Call the function to fetch and display recipe details
fetchAndDisplayRecipe();

// Remove Favorites

const favoriteCheckbox = document.querySelector(
  '.ui-like input[type="checkbox"]'
);

// Function to delete the recipe from favorites based on the recipe ID
async function removeFromFavorites(recipeId) {
  try {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("recipe_id", recipeId); // Assuming the column name for recipe ID is 'recipe_id'

    if (error) {
      console.error("Error removing from favorites:", error);
      return;
    }

    console.log("Recipe removed from favorites");
  } catch (error) {
    console.error("Error removing from favorites:", error.message);
  }
}

// Event listener for the checkbox change (uncheck) event
favoriteCheckbox.addEventListener("change", async (event) => {
  const isChecked = event.target.checked;

  if (!isChecked) {
    // Call the function to remove from favorites using the stored recipe ID
    const recipeId = currentRecipeId; // Assuming currentRecipeId is available
    await removeFromFavorites(recipeId);
  }
});

// Handles Color

// SEARCH FUNCTIONS
// SEARCH FUNCTIONS
async function fetchSearchSuggestions(query) {
  try {
    const { data: recipes, error } = await supabase
      .from("recipe")
      .select("dishes_id, dish_name") // Select 'dishes_id' and 'dish_name' fields for suggestions
      .ilike("dish_name", `%${query}%`); // Search for dish_names containing the query (case insensitive)

    if (error) {
      throw error;
    }

    return recipes; // Return the fetched recipes
  } catch (error) {
    console.error("Error fetching search suggestions:", error.message);
    return [];
  }
}

inputBox.addEventListener("input", async function (event) {
  const query = event.target.value.trim();

  if (query.length > 0) {
    const suggestions = await fetchSearchSuggestions(query);
    displaySearchSuggestions(suggestions);
  } else {
    searchDropdown.innerHTML = "";
    searchDropdown.style.display = "none";
  }
});

function displaySearchSuggestions(suggestions) {
  const searchDropdown = document.getElementById("search-dropdown");
  searchDropdown.innerHTML = "";

  if (suggestions.length > 0) {
    suggestions.forEach((suggestion) => {
      const item = document.createElement("a");
      item.setAttribute("class", "dropdown-item");
      item.setAttribute(
        "href",
        `/Recipe/recipe.html?id=${suggestion.dishes_id}`
      ); // Use 'dishes_id' in the URL
      item.textContent = suggestion.dish_name;

      searchDropdown.appendChild(item);
    });

    searchDropdown.style.display = "block";
  } else {
    searchDropdown.style.display = "none";
  }
}

function navigateToRecipePage(recipeId) {
  // Handle the recipe ID, for example, display it in console
  console.log(`Clicked Recipe ID: ${recipeId}`);
  // You can perform any action here based on the clicked recipe ID
}
