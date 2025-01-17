<template>
    <div>
        <h1>Llista de llibres</h1>
        <BooksList />
    </div>
</template>

<script>

import BooksList from '../components/BooksList.vue';
import { computed } from 'vue';

export default {
    components: { BooksList },
};

</script>