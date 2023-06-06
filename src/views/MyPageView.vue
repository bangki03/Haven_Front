<template>
    <div class="row" style="height: 100vh; width: 100vw; padding: 0.5em 0.5em; margin: 0 0; position: relative; background-color: #F8F9FA;">
        <div id="topbar1" class="row">
            <div class="col" style="display:flex;">
              <img
                id="Logo"
                src="../assets/Login_Logo.png"
                alt="../assets/Login_Logo.png"
                style="height: 58.9px; width: 176px; padding: 0; margin-right:auto;"
            />
            </div>

            <div class="col" style="display:flex; margin-top: 5px;">
              <p style="display:inline; margin-left: auto; margin-bottom:auto;" @click="Logout">로그아웃</p>
              <img
                  id="Logo"
                  src="../assets/LogOut.png"
                  alt="../assets/LogOut.png"
                  style="height: 15px; width: 15px; padding: 0; margin-top: 3px;" @click="Logout"
              />
            </div>

        </div>

        <div class="row" style="height: 2%; opacity: 0;"></div>
        <div class="row" style="height: 40%; width:90%; background-color: #F8F9FA; border-radius: 0.5em; margin: 0 auto;">
            <div class="col" style="background-color: #FFFFFF; margin: 0 1em; padding:1em 0;"><MyPageProjectsView></MyPageProjectsView></div>
        </div>

        <div class="row" style="height: 2%; opacity: 0;"></div>
        <div class="row" style="height: 40%; width:90%; background-color: #F8F9FA; border-radius: 0.5em; margin: 0 auto;">
            <div class="col" style="background-color: #FFFFFF; margin: 0 1em; padding:1em 0;"><MyPageApplicationView></MyPageApplicationView></div>
            <div class="col" style="background-color: #FFFFFF; margin: 0 1em; padding:1em 0;"><MyPageNewsView></MyPageNewsView></div>
            <div class="col" style="background-color: #FFFFFF; margin: 0 1em; padding:1em 0;"><MyPageNotificationView></MyPageNotificationView></div>
        </div>

    </div>


</template>

<script>
import MyPageProjectsView from '@/components/MyPageProjectsView.vue';
import MyPageApplicationView from '@/components/MyPageApplicationView.vue';
import MyPageNewsView from '@/components/MyPageNewsView.vue';
import MyPageNotificationView from '@/components/MyPageNotificationView.vue';
// import $ from 'jquery';

export default {
  name: "MyPageView",
  components: {
    MyPageProjectsView,
    MyPageApplicationView,
    MyPageNewsView,
    MyPageNotificationView
  },
  data() {
    return {

    }
  },
  methods: {
    routespage() {
      console.log("routespage")
      if (!this.$store.state.account.LoginActive) {
        alert("Please, Login First")
        this.$router.push('/')
      }
      else{
        alert(this.$store.state.account.LoginActive)
      }
    },
    Logout() {
      this.$store.commit("setLogout");
      alert('Logout')
      this.$router.push('/')
      console.log("here")
    }



  },

  created() {
    this.routespage()
  },

  created() {
  },

  beforeUnmount() {

  },

}
</script>

<style scoped>
h4, div, a {
    font-family:'HermeneusOne-Regular'
}

#topbar1 {
  height: 15%;
  width: 97.5%;
  background-color: #BD7C4A;
  border-radius: 0.5em;
  margin: 0 auto;
}
</style>