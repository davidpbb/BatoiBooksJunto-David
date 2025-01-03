<template>
    <div class="cart">
        <h2>Libros en el carrito</h2>
        <ul>
            <li v-for="book in cart" :key="index">
                {{ book }}
            </li>
        </ul>
    </div>
</template>

<script setup>

    import { ref } from 'vue';

    const cart = ref([]);

</script>

<style scoped></style>