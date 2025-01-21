<template>
    <div id="app">

        <img src="/logoBatoi.png">
        <AppMenu />
        <AppMessages />
        <main>
            <router-view />
        </main>

    </div>
</template>

<script setup>

    import AppMenu from './components/AppMenu.vue';
    import AppMessages from './components/AppMessages.vue';
    
</script>

<style>

body {
    background-color: lightyellow;
}
</style>