<template>
  <form 
    @submit.prevent="handleSubmit" 
    style="display: flex; flex-direction: column; gap: 1rem; background: #222; padding: 1rem; border-radius: 0.5rem;"
  >
    <div>
      <label for="title" style="display: block; margin-bottom: 0.5rem; color: #fff;">
        Title
      </label>
      <input 
        type="text" 
        id="title" 
        v-model="title" 
        required 
        style="padding: 0.5rem; width: 100%;"
      />
    </div>
    <div>
      <label for="file" style="display: block; margin-bottom: 0.5rem; color: #fff;">
        Image File
      </label>
      <input 
        type="file" 
        id="file" 
        @change="handleFileChange" 
        accept="image/*" 
        required 
        style="padding: 0.5rem; width: 100%;"
      />
    </div>
    <button 
      type="submit" 
      style="padding: 0.75rem; background-color: #4CAF50; color: #fff; border: none; border-radius: 0.25rem; cursor: pointer;"
    >
      Upload Image
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// Reactive variables to store form inputs
const title = ref('');
const file = ref<File | null>(null);

// Define the backend API base URL
const apiBaseUrl = 'http://localhost:8080';

// Handle file input change event
function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
}

// Handle form submission event
async function handleSubmit() {
  if (!file.value) {
    alert('Please select a file to upload');
    return;
  }

  // Create FormData object and append title and file
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('file', file.value);

  try {
    // Send a POST request to the backend images endpoint with the form data
    const res = await fetch(`${apiBaseUrl}/images`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload image');
    }

    // Retrieve response data if necessary
    const data = await res.json();
    alert('Image uploaded successfully');

    // Optionally, reset input fields after successful submission
    title.value = '';
    file.value = null;
  } catch (error: any) {
    alert(error.message || 'An error occurred during upload');
  }
}
</script>

<style scoped>
/* Scoped styling for ImageForm component */
</style>