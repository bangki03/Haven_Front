<template>
    <div class="row" style="height: 100vh; width: 100vw; padding: 0.5em 0.5em; margin: 0 0; position: relative; background-color: #F8F9FA;">

        <div class="row" style="height: 15%; background-color: #BD7C4A; border-radius: 0.5em; margin: 0 auto;">
            <img
                id="Logo"
                src="../assets/Login_Logo.png"
                alt="../assets/Login_Logo.png"
                style="height: 58.9px; width: 176px; padding: 0;"
            />
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

export default {
  name: "MyPageView",
  components: {
    MyPageProjectsView,
    MyPageApplicationView,
    MyPageNewsView,
    MyPageNotificationView
  }
}
</script>

<style>
</style>