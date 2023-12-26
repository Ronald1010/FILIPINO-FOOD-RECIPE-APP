import { supabase } from "../main";

// Function to add/remove dishes from favorites and toggle button state
async function addToFavorites() {
  var button = document.getElementById("favoriteButton");
  var isChecked = button.parentElement.querySelector(
    "input[type='checkbox']"
  ).checked;

  // Replace 'your_dish_id' with the actual dish ID variable
  var dishID = "dishes_id"; // Replace with the actual dish ID

  const { data: existingFavorite, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("dishes_id", dishID)
    .single();

  if (isChecked) {
    if (!error && existingFavorite) {
      const { error: deleteError } = await supabase
        .from("favorites")
        .delete()
        .eq("dishes_id", dishID);

      if (!deleteError) {
        button.style.backgroundColor = "#3498db"; // Set original color
        alert("Removed from Favorites!");
      } else {
        console.error("Error removing from favorites:", deleteError);
      }
    } else {
      console.error("Error checking existing favorite:", error);
    }
  } else {
    if (!error && existingFavorite) {
      button.style.backgroundColor = "#27ae60"; // Set added color
      alert("Already in Favorites!");
    } else {
      const { error: insertError } = await supabase
        .from("favorites")
        .insert([{ dishes_id: dishID }]);

      if (!insertError) {
        button.style.backgroundColor = "#27ae60"; // Set added color
        alert("Added to Favorites!");
      } else {
        console.error("Error adding to favorites:", insertError);
      }
    }
  }
}
// event listener for adding to favorites
document
  .getElementById("favoriteButton")
  .addEventListener("click", addToFavorites);

// event listener for removing from favorites
window.addEventListener("load", async () => {
  var button = document.getElementById("favoriteButton");
  var dishID = "dishes_id"; // Replace with the actual dish ID
  const { data: existingFavorite, error } = await supabase
    .from("favorites")
    .select("*")
    .eq("dishes_id", dishID)
    .single();

  if (!error && existingFavorite) {
    button.style.backgroundColor = "#27ae60"; // Set added color
    button.parentElement.querySelector("input[type='checkbox']").checked = true;
  }
});
