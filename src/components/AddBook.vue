<template>

    <form @submit.prevent="addBook">
        
        <br><h4>Añadir Libro</h4>
        <label for="bookId">Id: </label>
        <input id="bookId" v-model="newBookId" required /><br>

        <label for="bookModule">Módulo: </label>
        <select id="bookModule" v-model="newBookModule">
            <option disabled selected>-- SELECCIONA UN MÓDULO --</option>
            <option v-for="option in options" :value="option.code">{{ option.cliteral }}</option>
        </select><br>

        <label for="bookPublisher">Editorial: </label>
        <input id="bookPublisher" v-model="newBookPublisher" required /><br>

        <label for="bookPrice">Precio: </label>
        <input id="bookPrice" v-model="newBookPrice" required /><br>

        <label for="bookPages">Páginas: </label>
        <input id="bookPages" v-model="newBookPages" required /><br>

        <label>Estado: </label>

        <input type="radio" id="radioNew" name="bookStatus" value="new" v-model="newBookStatus" required />
        <label for="radioNew">Nuevo</label><br>

        <input type="radio" id="radioGood" name="bookStatus" value="good" v-model="newBookStatus" required />
        <label for="radioGood">Bueno</label><br>

        <input type="radio" id="radioUsed" name="bookStatus" value="used" v-model="newBookStatus" required />
        <label for="radioUsed">Usado</label><br>

        <input type="radio" id="radioBad" name="bookStatus" value="bad" v-model="newBookStatus" required />
        <label for="radioBad">Malo</label><br>

        <label for="comments">Comentarios: </label>
        <textarea name="comments" id="comments" v-model="newBookComments"></textarea><br>

        <button type="submit">Añadir</button>
        <button @click="resetFields">Reset</button>

    </form>

</template>

<script setup>

    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { useStoreDeMensajes } from '../stores/messages';

    const newBookId = ref("");
    const newBookModule = ref("");
    const newBookPublisher = ref("");
    const newBookPrice = ref("");
    const newBookPages = ref("");
    const newBookStatus = ref("");
    const newBookComments = ref("");

    const options = ref([]);
    const messages = useStoreDeMensajes();

    async function addBook() {
        
        try {

            await axios.post('http://localhost:3000/books', {
                
                moduleCode: newBookModule.value,
                publisher: newBookPublisher.value,
                price: newBookPrice.value,
                pages: newBookPages.value,
                status: newBookStatus.value,
                comments: newBookComments.value,
                id: newBookId.value
            });

            messages.addMessage('Libro añadido!');
            setTimeout(() => {messages.removeMessage(0)}, 3000);
        } catch (error) {

            messages.addMessage('Error al añadir libro: ' + error);
            setTimeout(() => {messages.removeMessage(0)}, 3000);
            console.error('Error al añadir:', error);
        }
    }
    

    async function fetchOptions() {
        
        try {
            
            const response = await axios.get('http://localhost:3000/modules');
            options.value = response.data;
        } catch (error) {
            
            messages.addMessage('Error en los modulos:' + error);
            setTimeout(() => {messages.removeMessage(0)}, 3000);
            console.error('Error en los modulos:', error);
        }
    }

    function resetFields() {
        
        newBookId.value = "";
        newBookModule.value = "";
        newBookPublisher.value = "";
        newBookPrice.value = "";
        newBookPages.value = "";
        newBookStatus.value = "";
        newBookComments.value = "";
    }

    onMounted(fetchOptions);


</script>

<style scoped>
select {
    width: 250px;
}
</style>    