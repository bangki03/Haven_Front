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
      <p style="margin-left: auto; margin-right:0.5em; height: 1.5rem; margin-bottom: 0; cursor: pointer;" @mouseenter="showrevision = true" @mouseleave="showrevision = false">
        Version : A.11 / Relase Date : 23.07.14 01:00</p>
      <div v-if=showrevision class="revision">
        <br>
        Version : A.11<br>
        Relase Date : 23.07.14 01:00 <br>
        <br>
        [TrainView]<br>
        - deploy 버튼 클릭 시, application stop 요청<br>
        <br>
        [TestView]<br>
        - 검증 요청 시, 전송하는 이미지 정보 변경에 따른 검증 결과 수정 완료<br>
        - Mask스위치 Default 값 변경 (Off -> On)<br>
        <br>
      </div>
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
      showrevision: false,
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
.revision {
  position: absolute;
  top: 2.0rem;
  left: 80%;
  background-color: rgba(255,255,255,0.2);
  /* z-index: 999; */
  padding: 0.5em;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  text-align: left;
  /* display:flex;
  flex-direction: column;
  align-items: flex-start; */
  /* justify-content: flex-start; */
}


</style>