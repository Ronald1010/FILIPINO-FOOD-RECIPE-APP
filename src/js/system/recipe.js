import { doLogout, supabase } from "../main";

// Function to fetch recipe details based on dish ID
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

// Call the function to fetch and display recipe details
fetchAndDisplayRecipe();
