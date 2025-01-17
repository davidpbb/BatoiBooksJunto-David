<template>

    <AddBook @submit="router.push('/')"></AddBook>

</template>

<script setup>

import AddBook from '../components/AddBook.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

</script>