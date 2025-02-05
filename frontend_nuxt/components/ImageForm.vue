<template>
  <form 
    @submit.prevent="handleSubmit" 
    style="display: flex; flex-direction: column; gap: 1rem; background: #222; padding: 1rem; border-radius: 0.5rem; width: 50%; margin: 0 auto;"
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
// Import necessary Vue functions for reactivity
import { ref } from 'vue';

// Define custom emit event for upload success
const emit = defineEmits<{ (e: "uploadSuccess"): void }>();

// Constants
const apiBaseUrl = 'http://localhost:8080';

// Reactive variables for form inputs
const title = ref('');
const file = ref<File | null>(null);

/**
 * Handle file input changes.
 * Extracts the selected file from event.
 */
function handleFileChange(event: Event): void {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    file.value = target.files[0];
  }
}

/**
 * Upload image to the backend using FormData.
 * @param formData - The FormData containing title and file.
 * @returns Response data in JSON format.
 */
async function uploadImage(formData: FormData): Promise<any> {
  const response = await fetch(`${apiBaseUrl}/images`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Failed to upload image');
  }
  return await response.json();
}

/**
 * Reset the form inputs.
 */
function resetForm(): void {
  title.value = '';
  file.value = null;
}

/**
 * Handle form submission.
 * Validates file selection, uploads image, resets form and emits success event.
 */
async function handleSubmit(): Promise<void> {
  // Validate that a file is selected
  if (!file.value) {
    alert('Please select a file to upload');
    return;
  }
  
  // Create FormData and append title and file
  const formData = new FormData();
  formData.append('title', title.value);
  formData.append('file', file.value);
  
  try {
    // Execute the image upload process
    await uploadImage(formData);
    
    // Reset form data after successful upload
    resetForm();
    
    // Emit an event to inform parent component about the successful upload
    emit("uploadSuccess");
  } catch (error: any) {
    alert(error.message || 'An error occurred during upload');
  }
}
</script>

<style scoped>
/* Scoped styling for ImageForm component */
</style>