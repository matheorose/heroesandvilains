<template>
  <div class="container">
    <h1 class="title">Heroes and Villains</h1>
    <h2 class="subtitle">Tim Carrara & Matheo Rose</h2>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(135deg, #1e1e2f, #3a3a5a);
  color: #fff;
  text-align: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.title {
  font-size: 4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 8px rgba(0,0,0,0.5);
}

.subtitle {
  font-size: 1.8rem;
  font-weight: 300;
  color: #ccc;
  text-shadow: 1px 1px 4px rgba(0,0,0,0.3);
}
</style>