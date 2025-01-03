<template>

    <div class="messages">

        <div v-for="msg in messages" class="message">
            {{ msg }}
        </div>

    </div>
    
</template>

<script setup>

    import { ref, computed } from 'vue';
    import { useStoreDeMensajes } from '../stores/messages';

    const messagesStore = useStoreDeMensajes();

    const messages = computed(() => messagesStore.messages);

</script>

<style scoped></style>