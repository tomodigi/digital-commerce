<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { getSupabase } from "$lib/supabase/client";
    import { PUBLIC_SITE_URL } from "$env/static/public";

    const dispatch = createEventDispatcher();

    let email = "";
    let isLoading = false;
    let message = "";
    let messageType = "";

    async function handleSubmit(event: Event) {
        event.preventDefault();
        if (!email) return;

        isLoading = true;
        message = "";

        try {
            const supabase = await getSupabase();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `http://localhost:5173/login/reset-password`,
            });

            if (error) {
                throw error;
            }

            message =
                "Password reset link has been sent to your email. Please check your inbox.";
            messageType = "success";
            dispatch("success", { email });
        } catch (error) {
            console.error("Password reset error:", error);
            message =
                error instanceof Error
                    ? error.message
                    : "Failed to send reset link. Please try again.";
            messageType = "error";
        } finally {
            isLoading = false;
        }
    }
</script>

<div class="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
    <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-800">Forgot Password?</h1>
        <p class="mt-2 text-gray-500">
            No problem. Enter your email below and we'll send you a link to
            reset it.
        </p>
    </div>

    {#if message}
        <div
            class="p-4 rounded-md text-sm {messageType === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'}"
            role="alert"
        >
            {message}
        </div>
    {/if}

    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
        <div>
            <label for="email" class="text-sm font-medium text-gray-700"
                >Email address</label
            >
            <div class="mt-1">
                <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    bind:value={email}
                    placeholder="you@example.com"
                    class="w-full px-3 py-2 placeholder-gray-400 border border-gray-300 rounded-md shadow-sm appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    disabled={isLoading}
                />
            </div>
        </div>

        <div>
            <button
                type="submit"
                class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !email}
            >
                {#if isLoading}
                    <svg
                        class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            class="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            stroke-width="4"
                        ></circle>
                        <path
                            class="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <span>Sending...</span>
                {:else}
                    <span>Send Reset Link</span>
                {/if}
            </button>
        </div>
    </form>
</div>
