<template>
  <RouterView>  </RouterView>

</template>

<script>

export default{
  name: "app",
  components: {
    
  },
  mounted() {
    this.$store.commit('loadSessionStorageLogin')
    console.log(this.$store.state.account)
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
/* 
nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
} */
</style>
