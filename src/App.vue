<template>
  <div style="display:none;">version: A.06 / Date : 23.06.06 16:00</div>
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
@import "./assets/tooltip.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

@font-face {
  font-family:'HermeneusOne-Regular';
  src: url('assets/fonts/HermeneusOne-Regular.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family:'HermeneusOne-Regular';
  src: url('assets/fonts/HermeneusOne-Regular.ttf') format('truetype');
  font-weight: 300;
}
@font-face {
  font-family:'HermeneusOne-Regular';
  src: url('assets/fonts/HermeneusOne-Regular.ttf') format('truetype');
  font-weight: 700;
}
@font-face {
  font-family:'NotoSansKR-Thin';
  src: url('assets/fonts/NotoSansKR-Thin.otf') format('truetype');
  font-weight: 100;
}
@font-face {
  font-family:'NotoSansKR-Light';
  src: url('assets/fonts/NotoSansKR-Light.otf') format('truetype');
  font-weight: 200;
}
@font-face {
  font-family:'NotoSansKR-Light';
  src: url('assets/fonts/NotoSansKR-Light.otf') format('truetype');
  font-weight: 300;
}
@font-face {
  font-family:'NotoSansKR-Regular';
  src: url('assets/fonts/NotoSansKR-Regular.otf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family:'Poppins-Light';
  src: url('assets/fonts/Poppins-Light.ttf') format('truetype');
  font-weight: 200;
}
@font-face {
  font-family:'Poppins-Light';
  src: url('assets/fonts/Poppins-Light.ttf') format('truetype');
  font-weight: 300;
}
@font-face {
  font-family:'Poppins-Regular';
  src: url('assets/fonts/Poppins-Regular.ttf') format('truetype');
  font-weight: 400;
}
@font-face {
  font-family:'Poppins-Medium';
  src: url('assets/fonts/Poppins-Medium.ttf') format('truetype');
  font-weight: 500;
}
@font-face {
  font-family:'Poppins-SemiBold';
  src: url('assets/fonts/Poppins-SemiBold.ttf') format('truetype');
  font-weight: 600;
}
@font-face {
  font-family:'Actor-Regular';
  src: url('assets/fonts/Actor-Regular.ttf') format('truetype');
  font-weight: 400;
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
