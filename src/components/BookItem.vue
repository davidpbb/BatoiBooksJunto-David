<template>
    <div class="book">
        <p>Libro: {{ book.id }}</p>
        <p>{{ book.moduleCode }}</p>
        <p>{{ book.publisher }}</p>
        <p>Precio: {{ book.price }}</p>
        <p>Páginas: {{ book.pages }}</p>
        <p>Estado: {{ book.status }}</p>
        <p v-if="!book.soldDate">En venta</p>
        <p>Comentarios: {{ book.comments }}</p>
        <button @click="$emit('deleteBook');">Borrar</button>
    </div>
</template>

<script setup>

    import { defineProps } from 'vue';

    const props = defineProps({
        book: Object
    });

</script>

<style scoped>
.book {
    background-color: lightyellow;
}
</style>