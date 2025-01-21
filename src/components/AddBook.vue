<template>

    <form ref="formulario">

        <br>
        <h4 id="titulo">Añadir Libro</h4>
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

        <div id="botones">
            <button 
                type="submit"
                id="editar"
                v-if="editMode"
                @click.prevent="editar"
            >Editar</button>
            <button 
                v-else
                type="submit"
                id="anyadir"
                @click.prevent="addBook"
            >Añadir</button>
            <button id="resetButton" @click="resetFields">Reset</button>
        </div>

    </form>

</template>

<script setup>

import { ref, onMounted, nextTick, watch } from 'vue';
import axios from 'axios';
import { useStoreDeMensajes } from '../stores/messages';
import { useRoute, useRouter } from 'vue-router';

//Campos reactivos del formulario
const newBookId = ref("");
const newBookModule = ref("");
const newBookPublisher = ref("");
const newBookPrice = ref("");
const newBookPages = ref("");
const newBookStatus = ref("");
const newBookComments = ref("");
const formulario = ref();


//Array de modulos reactivo
const options = ref([]);

//Store para mostrar mensajes
const messages = useStoreDeMensajes();

//Booleano para cambiar entre añadir y editar en el formulario
let editMode = false;


//Metodo que llama el botón del formulario si editmode = false;
async function addBook() {

    //Todos los campos del formulario no deben estar vacios
    if (formulario.value.checkValidity()) {

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
            //3 segundos para eliminar el mensaje
            setTimeout(() => { messages.removeMessage(0) }, 3000);
        
        } catch (error) {
            
            messages.addMessage('Error al añadir libro: ' + error);
            setTimeout(() => { messages.removeMessage(0) }, 3000);
            console.error('Error al añadir:', error);
        }
        //Redirige a la lista de libros
        router.push('/');

    } else {

        messages.addMessage('Todos los campos del formulario son obligatorios: ');
        setTimeout(() => { messages.removeMessage(0) }, 3000);
    }
    
}

//Metodo que llama el botón del formulario si editmode = true;
async function editar() {

    //Todos los campos del formulario no deben estar vacios
    if (formulario.value.checkValidity()) {

        try {

            await axios.patch(`http://localhost:3000/books/${newBookId.value}`, {

                moduleCode: newBookModule.value,
                publisher: newBookPublisher.value,
                price: newBookPrice.value,
                pages: newBookPages.value,
                status: newBookStatus.value,
                comments: newBookComments.value,
                id: newBookId.value
            });

            messages.addMessage('Libro editado!');
            setTimeout(() => { messages.removeMessage(0) }, 3000);

        } catch (error) {

            messages.addMessage('Error al editar libro: ' + error);
            setTimeout(() => { messages.removeMessage(0) }, 3000);
            console.error('Error al editar:', error);
        }

        //Redirige a la lista de libros
        router.push('/');

    } else {

        messages.addMessage('Todos los campos del formulario son obligatorios: ');
        setTimeout(() => { messages.removeMessage(0) }, 3000);
    }

}

//Recupera los modulos del json server y los carga en el array reactivo (options)
async function fetchOptions() {

    try {

        const response = await axios.get('http://localhost:3000/modules');
        options.value = response.data;
    } catch (error) {

        messages.addMessage('Error en los modulos:' + error);
        setTimeout(() => { messages.removeMessage(0) }, 3000);
        console.error('Error en los modulos:', error);
    }
}

//Todos los campos reactivos del formulario se borran
function resetFields() {

    newBookId.value = "";
    newBookModule.value = "";
    newBookPublisher.value = "";
    newBookPrice.value = "";
    newBookPages.value = "";
    newBookStatus.value = null;
    newBookComments.value = "";
}

//Uso de la ruta actual
const route = useRoute();

//Uso del router creado
const router = useRouter();

//Observa si hay algun cambio en route.query.id (parametros al editar un libro)
watch(
    () => route.query.id,
    async () => {

        //nextTick para asegurarse que los cambios en el DOM se han completado.
        nextTick(async () => {

            //Elementos del formulario
            const titulo = document.getElementById('titulo');
            const idField = document.getElementById('bookId');
            const statusField = document.querySelectorAll('input[name="bookStatus"]');

            //Si hay parametros en la url...
            if (route.query.id) {

                //Recuperar el libro a editar
                const libro = await getBook(route.query.id);

                titulo.textContent = 'Editar Libro';

                idField.setAttribute('disabled', 'true');

                //Cargar los datos del libro obtenido en el formulario
                newBookId.value = route.query.id;
                newBookModule.value = libro.moduleCode;
                newBookPublisher.value = libro.publisher;
                newBookPrice.value = libro.price;
                newBookPages.value = libro.pages;
                newBookComments.value = libro.comments;

                Array.from(statusField).forEach((status) => {

                    if (status.value === libro.status) {
                        status.checked = true;
                    }
                });

                //Activar el modo edición para que el botón reactivo muestre 'Editar' y @click="editar()"
                editMode = true;

            } else {

                titulo.textContent = 'Añadir libro';
                resetFields();
                editMode = false;
            }

        });

    },
    //El watch() funciona inmediatamente tras detectar cambios
    { immediate: true }
);

//Recuperar libro del json server
async function getBook(id) {

    const libro = await axios.get(`http://localhost:3000/books/${id}`);
    return libro.data;
}

//Cuando el componente AddBook se haya montado, ejecutar fetchOptions()
onMounted(fetchOptions);

</script>

<style scoped>
select {
    width: 250px;
}
</style>