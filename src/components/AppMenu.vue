<template>
    <nav>
        <ul>
            <router-link to="/" class="link"><b>VER LIBROS</b></router-link>
            <router-link to="/addbook" class="link"><b>NUEVO LIBRO</b></router-link>
            <router-link to="/cart" class="link"><b>VER CARRITO</b></router-link>
            <router-link to="/about" class="link"><b>ACERCA DE...</b></router-link>
        </ul>
    </nav>
</template>

<script setup>
</script>

<style scoped>

.link {
    margin-right: 20px;
    font-size: 20px;
    color: lime;
    text-decoration: none;
    
}

.link:hover {
    color: gray;
    text-decoration: underline;
    transition: color 0.3s ease-in-out;
}
</style>