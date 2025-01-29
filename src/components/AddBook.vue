<template>

    <form>

        <br>
        <h4 id="titulo">Añadir Libro</h4>
        <label for="bookId">Id: </label>
        <input id="bookId" v-model="newBookId"/><br><br>

        <label for="bookModule">Módulo: </label>
        <select id="bookModule" v-model="newBookModule">
            <option disabled selected>-- SELECCIONA UN MÓDULO --</option>
            <option v-for="option in options" :value="option.code">{{ option.cliteral }}</option>
        </select><br>
        <span v-if="moduleCodeError">{{ moduleCodeError }}</span><br><br>

        <label for="bookPublisher">Editorial: </label>
        <input id="bookPublisher" v-model="newBookPublisher" /><br>
        <span v-if="publisherError">{{ publisherError }}</span><br><br>

        <label for="bookPrice">Precio: </label>
        <input id="bookPrice" v-model="newBookPrice" /><br>
        <span v-if="priceError">{{ priceError }}</span><br><br>

        <label for="bookPages">Páginas: </label>
        <input id="bookPages" v-model="newBookPages" /><br>
        <span v-if="pagesError">{{ pagesError }}</span><br><br>

        <label>Estado: </label><br>

        <input type="radio" id="radioNew" name="bookStatus" value="new" v-model="newBookStatus" />
        <label for="radioNew">Nuevo</label><br>

        <input type="radio" id="radioGood" name="bookStatus" value="good" v-model="newBookStatus" />
        <label for="radioGood">Bueno</label><br>

        <input type="radio" id="radioUsed" name="bookStatus" value="used" v-model="newBookStatus" />
        <label for="radioUsed">Usado</label><br>

        <input type="radio" id="radioBad" name="bookStatus" value="bad" v-model="newBookStatus" />
        <label for="radioBad">Malo</label><br>
        <span v-if="statusError">{{ statusError }}</span><br><br>

        <label for="comments">Comentarios: </label><br>
        <textarea name="comments" id="comments" v-model="newBookComments"></textarea><br>

        <!-- click.prevent llama a handleSubmit para comprobar que no haya errores de validación antes de enviar-->
        <div id="botones">
            <button 
                type="submit"
                id="editar"
                v-if="editMode"
                @click.prevent="onSubmitEdit"
            >Editar</button>
            <button 
                v-else
                type="submit"
                id="anyadir"
                @click.prevent="onSubmitAdd"
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
import { useForm, useField } from 'vee-validate';
import * as yup from 'yup';


//esquema de validación con yup
const schema = {

    moduleCode: yup.string()
    .required('Código de módulo obligatorio'),

    publisher: yup.string()
    .required('La editorial es obligatoria'),

    price: yup.number().
    required('El precio es obligatorio')
    .min(0, 'El precio no puede ser menor que 0')
    .typeError('El campo debe ser un número')
    .test('dos-decimales', 'El precio debe tener exactamente dos decimales', value => {
      if (value === undefined || value === null) return false
      return /^\d+\.\d{2}$/.test(value.toFixed(2))
    }),

    pages: yup.number()
    .required('Las páginas son obligatorias')
    .integer('Debe ser un numero entero')
    .typeError('El campo debe ser un número')
    .min(0, 'Las páginas no pueden ser menor que 0'),
    
    status: yup.string()
    .required('El estado es obligatorio')
}

/* 
* Desestructuración de useForm() que se le pasa el esquema como parametro y almacena en 
* handleSubmit una función para manejar el envío del formulario con @submit.prevent.
*/
const { handleSubmit } = useForm({ validationSchema: schema });

/*
* useField(param) -> param es el nombre utilizado en el esquema para referirse al campo del moduleCode.
* value contiene un campo ref() que se vincula con v-model en los inputs.
* errorMessage contiene el error de validación para ese input específico
* touched es una funcion devuelta por useField para comprobar si se ha hecho click
* en el campo, para que se muestren los errores de forma responsive
*/
const { value: newBookModule, errorMessage: moduleCodeError, touched: touchedModule } = useField('moduleCode');
const { value: newBookPublisher, errorMessage: publisherError, touched: touchedPublisher } = useField('publisher');
const { value: newBookPrice, errorMessage: priceError, touched: touchedPrice } = useField('price');
const { value: newBookPages, errorMessage: pagesError, touched: touchedPages } = useField('pages');
const { value: newBookStatus, errorMessage: statusError, touched: touchedStatus } = useField('status');


//Campos reactivos del formulario (comentados los campos ya que vee-validate ofrece campos con ref() en su propiedad 'value')
const newBookId = ref("");
const newBookComments = ref("");
// const newBookModule = ref("");
// const newBookPublisher = ref("");
// const newBookPrice = ref("");
// const newBookPages = ref("");
// const newBookStatus = ref("");

//Array de modulos reactivo
const options = ref([]);

const onSubmitAdd = handleSubmit(addBook);
const onSubmitEdit = handleSubmit(editar);

//Store para mostrar mensajes
const messages = useStoreDeMensajes();

//Booleano para cambiar entre añadir y editar en el formulario
let editMode = false;


//Metodo que llama el botón del formulario si editmode = false;
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
            //3 segundos para eliminar el mensaje
            setTimeout(() => { messages.removeMessage(0) }, 3000);
        
        } catch (error) {
            
            messages.addMessage('Error al añadir libro: ' + error);
            setTimeout(() => { messages.removeMessage(0) }, 3000);
            console.error('Error al añadir:', error);
        }
        //Redirige a la lista de libros
        router.push('/');
    
}

//Metodo que llama el botón del formulario si editmode = true;
async function editar() {

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