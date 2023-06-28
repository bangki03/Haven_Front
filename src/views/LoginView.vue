<template>
  <LoginModal></LoginModal>
  <div class="row" style="height: 100vh; width: 100vw; padding: 0.5em 0.5em; margin: 0 0; position: relative; background-color: #F8F9FA;">
    <div style="height: 50%; display:flex; flex-direction: row; justify-content: flex-start; background-color: #BD7C4A; border-radius: 0.5em; margin: 0 auto;">
      <img
        id="Logo"
        src="../assets/Login_Logo.png"
        alt="../assets/Login_Logo.png"

        style="height: 58.9px; width: 176px; padding: 0;"
      />
      <p style="margin-left: auto; margin-right:0.5em;">version: A.08 / Date : 23.06.29 00:30</p>
    </div>
    <div class="row" style="height: 50%; margin: 0 auto;"></div>
  </div>



</template>

<script>
import LoginModal from "@/components/LoginModal.vue"

export default{
  components: {
    LoginModal
  },
  data() {
    return{
    }
  },

  methods: {
    routespage() {
      if (this.$store.state.account.LoginActive) {
        this.$router.push('/mypage')
      }
    },
  },

  mounted() {
    this.$store.commit('loadSessionStorageLogin')
    this.routespage()
  },

  created() {

  },

  beforeUnmount() {
  },
}
</script>

<style scoped>



</style>