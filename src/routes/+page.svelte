<script lang="ts">
    import svelteLogo from "$lib/assets/svelte.svg";
    import viteLogo from "$lib/assets/vite.svg";
    import Tensor from "$lib/Tensor.svelte";
</script>

<main class="main">
    <div class="logos">
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            <img src={viteLogo} class="logo" alt="Vite Logo" />
        </a>
        <a href="https://svelte.dev" target="_blank" rel="noreferrer">
            <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
        </a>
    </div>
    <div>
        <Tensor />
    </div>
</main>

<style>
    .main {
        padding: 80px 32px;
    }
    .logos {
        display: flex;
        justify-content: center;
        gap: 20px;
    }
    .logo {
        height: 6em;
        padding: 1.5em;
        will-change: filter;
        transition: filter 300ms;
    }
    .logo:hover {
        filter: drop-shadow(0 0 2em #646cffaa);
    }
    .logo.svelte:hover {
        filter: drop-shadow(0 0 2em #ff3e00aa);
    }
</style>
