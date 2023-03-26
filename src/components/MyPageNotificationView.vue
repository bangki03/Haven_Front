<template>
    <h4 style="text-align: left; margin-left: 1em;">알림</h4>

    <div style="display:inline-block; width:90%; height:30%; padding: 0.5em 0;">
        <MyPageNotificationCard style="border-radius: 0.5em;"></MyPageNotificationCard>
    </div>
    <div style="display:inline-block; width:90%; height:30%; padding: 0.5em 0;">
        <MyPageNotificationCard style="border-radius: 0.5em;"></MyPageNotificationCard>
    </div>
    <div style="display:inline-block; width:90%; height:30%; padding: 0.5em 0;">
        <MyPageNotificationCard style="border-radius: 0.5em;"></MyPageNotificationCard>
    </div>

    <!-- <div v-for="SummaryCard in this.List_SummaryCard.data_list_notyet" style="display:inline-block; width:25%; height:100%; padding: 0 2px;">
        <MyPageProjectsCard @click="click_SummaryCard(SummaryCard)" :data_SummaryCard="SummaryCard"/>
    </div> -->
</template>

<script>
import MyPageNotificationCard from "@/components/MyPageNotificationCard.vue"
export default {
    components: {
        MyPageNotificationCard
    }
}
</script>

<style>
</style>