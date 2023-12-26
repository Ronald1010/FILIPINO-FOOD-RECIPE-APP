import { supabase } from "../main";

//
//

async function fetchAndDisplayUserInfo() {
  try {
    // Retrieve email from Local Storage
    const userEmail = localStorage.getItem("email");

    if (!userEmail) {
      console.error("Email not found in Local Storage");
      return;
    }

    // Fetch user info from the user_info table using the email
    let { data: user, error } = await supabase
      .from("user_info")
      .select("firstname, lastname, email, image_path")
      .eq("email", userEmail);

    if (error) {
      console.error("Error fetching user info:", error.message);
      return;
    }

    // Display fetched user info in HTML elements
    if (user && user.length > 0) {
      document.getElementById("firstname").textContent = user[0].firstname;
      document.getElementById("lastname").textContent = user[0].lastname;
      document.getElementById("email").textContent = user[0].email;

      // Update profile image source with the fetched image path
      const profileImage = document.getElementById("profile_image");
      profileImage.src = user[0].image_path;

      // Log fetched user info to the console
      console.log("Fetched User Info:", user);
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

// Call the function to fetch and display user info when the page loads
window.onload = fetchAndDisplayUserInfo;

// HANDLE FILE UPLOAD

// Function to delete the existing image from Supabase Storage
function getUserIdFromLocalStorage() {
  const userId = localStorage.getItem("user_id"); // Replace "user_id" with your actual key
  return userId;
}
async function deleteExistingImage(userId) {
  try {
    const { data, error } = await supabase.storage
      .from("profile_pictures")
      .remove([
        `user_${userId}/profile.jpg`, // Remove only the file path within the storage bucket
      ]);

    if (error) {
      throw new Error(`Error deleting existing image: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting existing image:", error);
    return null;
  }
}

// UPDATE IMAGE_PATH
async function updateImagePathByEmail(email, imageUrl) {
  try {
    console.log("Updating image path in user_info table...");

    const { data: userData, error: userError } = await supabase
      .from("user_info")
      .update({ image_path: imageUrl })
      .eq("email", email);

    if (userError) {
      throw new Error(
        `Error updating image path in user_info table: ${userError.message}`
      );
    }

    console.log("Image path updated in user_info table:", userData);
    return userData;
  } catch (error) {
    console.error("Error updating image path in user_info table:", error);
    return null;
  }
}

// Function to upload image to Supabase Storage and update user profile
async function uploadImageAndUpdateProfile(file) {
  try {
    const userId = getUserIdFromLocalStorage(); // Retrieve user ID from localStorage

    // Delete existing image (if any)
    const deletionResult = await deleteExistingImage(userId);
    console.log("Deletion Result:", deletionResult);

    // Wait for a short delay to ensure deletion completes
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Adjust the delay as needed

    // Upload the new image to Supabase Storage after the delay
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("profile_pictures")
      .upload(`/user_${userId}/profile.jpg`, file, {
        cacheControl: "3600",
      });

    if (uploadError) {
      throw new Error(`Error uploading image: ${uploadError.message}`);
    }

    // Construct the image URL based on the retrieved user ID and the filename
    const imageUrl = `https://yjzcvrbsaxmfuaeakpzl.supabase.co/storage/v1/object/public/profile_pictures/user_${userId}/profile.jpg`; // Replace with the actual URL of the uploaded image

    // Update image path in user_info table based on email
    const userEmail = localStorage.getItem("email");
    const updateImagePathResult = await updateImagePathByEmail(
      userEmail,
      imageUrl
    );
    console.log("Update Image Path Result:", updateImagePathResult);

    // Rest of the code remains unchanged...
    // ...
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

// Example usage when a user uploads an image
const fileInput = document.getElementById("fileInput");
const uploadButton = document.getElementById("uploadButton");

uploadButton.addEventListener("click", async () => {
  const file = fileInput.files[0];

  if (file) {
    const updateResult = await uploadImageAndUpdateProfile(file);
    if (updateResult) {
      // Update UI or notify user about successful image upload and profile update
      console.log("Image uploaded and profile updated successfully.");
    }
  } else {
    console.error("No file selected.");
  }
});

// UPDATE IMAGE IN PROFILE
//
//
