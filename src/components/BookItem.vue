<template>
    <div class="book">
        <p>Libro: <b>{{ book.id }}</b></p>
        <p>Código de módulo: <b>{{ book.moduleCode }}</b></p>
        <p>Editorial: <b>{{ book.publisher }}</b></p>
        <p>Precio: <b>{{ book.price }}</b></p>
        <p>Páginas: <b>{{ book.pages }}</b></p>
        <p>Estado: <b>{{ book.status }}</b></p>
        <p v-if="!book.soldDate"><b>En venta</b></p>
        <p>Comentarios: <b>{{ book.comments }}</b></p>
        <button @click="$emit('deleteBook');">Borrar</button>
        <button @click="$emit('editBook');">Editar</button>
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