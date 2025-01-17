<template>
    <div>
        <ul>
            <li v-for="book in books" :key="book.id">
                <BookItem :book="book" @deleteBook="deleteBook(book.id)" @editBook="editBook(book.id)"/>
            </li>
        </ul>
        <p>Total de libros: {{ totalBooks }}</p>
    </div>
</template>

<script setup>

    import { ref, computed, onMounted, nextTick } from 'vue';
    import axios from 'axios';
    import BookItem from './BookItem.vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();

    const books = ref([]);
    const totalBooks = computed(() => books.value.length);
    
    async function fetchBooks() {
    
        try {
        
            const response = await axios.get('http://localhost:3000/books');
            books.value = response.data;
        } catch (error) {
        
            console.error('Error al recuperar: ', error);
        }
    }
    
    async function deleteBook(id) {
    
        try {
            
            await axios.delete(`http://localhost:3000/books/${id}`);
            books.value = books.value.filter(book => book.id !== id);
        } catch (error) {
        
            console.error('Error al borrar: ', error);
        }
    }

    function editBook(id) {


        router.push({

            name: 'AddBook',
            query: { id }
        });

    }
    
    onMounted(fetchBooks);
</script>

<style scoped>
ul {
    list-style-type: none;
}
</style>