<template>
    <div class="row" style="display:flex; flex-direction: column; flex-wrap: nowrap; justify-content: flex-start;   height: 100vh; width: 100vw; padding: 1.5em 1.5em; margin: 0 0; position: relative; background-color: #F8F9FA;">
      <div id="topbar1">
          <div>
            <img
              id="Logo"
              src="../assets/Icon_Topbar.png"
              alt="../assets/Icon_Topbar.png"
              style="margin-top:0.5em; margin-right:auto; height:calc(46px * 0.69);"
          />
          </div>

          <div style="display:flex; margin-top: 5px;">
            <p style="display:inline; margin-left: auto; margin-bottom:auto;" @click="Logout">로그아웃</p>
            <img
                id="Logo"
                src="../assets/LogOut.png"
                alt="../assets/LogOut.png"
                style="height: 15px; width: 15px; padding: 0; margin-top: 3px;" @click="Logout"
            />
          </div>

      </div>

      <!-- <div class="row" style="margin-top: 1.0em; opacity: 0;"></div> -->
      <div class="row" style="height: 48%; width:90%; background-color: #F8F9FA;  margin: 1.0em auto 0 auto;">
          <div class="col" style="background-color: #FFFFFF; border-radius: 0.5em; margin: 0 1em; padding:1em 0;"><MyPageProjectsView></MyPageProjectsView></div>
      </div>

      <!-- <div class="row" style="height: 2%; opacity: 0;"></div> -->
      <div class="row" style="height: 35%; width:90%; background-color: #F8F9FA; margin: 1.0em auto auto auto;">
          <div class="col" style="background-color: #FFFFFF; border-radius: 0.5em; margin: 0 1em; padding:1em 0;"><MyPageApplicationView></MyPageApplicationView></div>
          <div class="col" style="background-color: #FFFFFF; border-radius: 0.5em; margin: 0 1em; padding:1em 0;"><MyPageNewsView></MyPageNewsView></div>
          <div class="col" style="background-color: #FFFFFF; border-radius: 0.5em; margin: 0 1em; padding:1em 0;"><MyPageNotificationView></MyPageNotificationView></div>
      </div>

      <!-- <div class="row" style="margin-top: auto; opacity: 0;"></div> -->

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
      if (!this.$store.state.account.LoginActive) {
        alert("Please, Login First")
        this.$router.push('/')
      }
    },
    Logout() {
      this.$store.commit("setLogout");
      alert('Logout')
      this.$router.push('/')
    }



  },

  mounted() {
    // this.routespage()
  },

  created() {
  },

  beforeUnmount() {

  },

}
</script>

<style>
h4, div, a, p {
    font-family:'HermeneusOne-Regular'
}

#topbar1 {
  height: 10.9%;
  width: 100%;
  background-color: #BD7C4A;
  border-radius: 0.5em;
  margin: 0 auto;

  display:flex; flex-direction: row; justify-content: space-between;
}
</style>