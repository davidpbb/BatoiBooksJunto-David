<template>
    <div id="app">
        <img src="../public/logoBatoi.png">
        <AppMenu />
        <AppMessages />
        <BooksList />
        <AddBook />
        <AppCart />
        <AppAbout />
    </div>
</template>

<script setup>

    import AppMenu from './components/AppMenu.vue';
    import AppMessages from './components/AppMessages.vue';
    import BooksList from './components/BooksList.vue';
    import AddBook from './components/AddBook.vue';
    import AppCart from './components/AppCart.vue';
    import AppAbout from './components/AppAbout.vue';
    
</script>

<style>

</style>