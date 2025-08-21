<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { getSupabase } from '$lib/supabase/client';
  import { goto } from '$app/navigation';
  import { toast } from 'svelte-sonner';

  // Form state
  let password = '';
  let confirmPassword = '';
  let isLoading = false;
  let errorMessage = '';
  let successMessage = '';
  let accessToken = '';
  let refreshToken = '';

  // Extract token from URL hash
  onMount(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    accessToken = params.get('access_token') || '';
    refreshToken = params.get('refresh_token') || '';

    if (!accessToken || !refreshToken) {
      errorMessage = 'Invalid or expired reset link. Please request a new password reset.';
    }
  });

  async function handleSubmit(event: Event) {
    event.preventDefault();
    
    // Reset messages
    errorMessage = '';
    successMessage = '';
    
    // Validate passwords
    if (password !== confirmPassword) {
      errorMessage = 'Passwords do not match';
      return;
    }
    
    if (password.length < 8) {
      errorMessage = 'Password must be at least 8 characters long';
      return;
    }

    try {
      isLoading = true;
      
      // Update password using Supabase
      const supabase = await getSupabase();
      
      // First, set the session with the tokens from the URL
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });
      
      if (sessionError) throw sessionError;
      
      // Then update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });
      
      if (updateError) throw updateError;
      
      // Success - show message and redirect
      successMessage = 'Your password has been reset successfully!';
      toast.success('Password updated successfully');
      
      // Redirect to login after a short delay
      setTimeout(() => {
        goto('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error resetting password:', error);
      errorMessage = error.error_description || error.message || 'Failed to reset password. Please try again.';
      
      if (errorMessage.includes('invalid token')) {
        errorMessage = 'This password reset link has expired or is invalid. Please request a new one.';
      }
      
      toast.error('Failed to reset password');
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
  <div class="max-w-md w-full space-y-8">
    <div class="text-center">
      <h2 class="mt-6 text-3xl font-extrabold text-gray-900">
        Reset Your Password
      </h2>
      <p class="mt-2 text-sm text-gray-600">
        Enter your new password below.
      </p>
    </div>

    {#if errorMessage}
      <div class="rounded-md bg-red-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">{errorMessage}</h3>
          </div>
        </div>
      </div>
    {/if}

    {#if successMessage}
      <div class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm font-medium text-green-800">{successMessage}</p>
          </div>
        </div>
      </div>
    {/if}

    <form class="mt-8 space-y-6" on:submit|preventDefault={handleSubmit}>
      <div class="rounded-md shadow-sm -space-y-px">
        <div>
          <label for="password" class="sr-only">New Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="New Password"
            bind:value={password}
            disabled={isLoading}
          />
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">Confirm New Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Confirm New Password"
            bind:value={confirmPassword}
            disabled={isLoading}
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !password || !confirmPassword || password !== confirmPassword}
        >
          {#if isLoading}
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Resetting...
          {:else}
            Reset Password
          {/if}
        </button>
      </div>
      
      <div class="text-center text-sm">
        <a href="/login" class="font-medium text-indigo-600 hover:text-indigo-500">
          Back to Sign in
        </a>
      </div>
    </form>
  </div>
</div>
