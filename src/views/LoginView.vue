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
        Version : A.10 / Relase Date : 23.07.13 02:30</p>
      <div v-if=showrevision class="revision">
        <br>
        Version : A.10<br>
        Relase Date : 23.07.13 02:30 <br>
        <br>
        - API config 파일 생성<br>
        <br>
        [MyPageView]<br>
        - 프로젝트 수정/삭제 기능 추가<br>
        <br>
        [AnnotatorView]<br>
        - Brush 도구 simplify(false) 적용<br>
        - 저장 시, 팝업 알림창 삭제<br>
        - 저장 시, 데이터 재조회<br>
        <br>
        [TrainView]<br>
        - 모델 학습 중, 신규모델학습 버튼 비활성화<br>
        <br>
        [TestView]<br>
        - 검증 요청 시, 전송하는 이미지 정보 변경<br>
          (기존: 파일명, 변경: 파일명 + base64인코딩된 데이터)<br>
        - 두번째 모델 legend Color 변경 (초록 → 피링)<br>
        - "뒤로가기" 마우스 커서 변경 (none -> pointer)<br>
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