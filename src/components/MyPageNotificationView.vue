<template>
    <div id="menu-title">
        <h4>알림</h4>
        <div id="menu-more">more ></div>
    </div>

    <div id="menu-contents">

        <!-- <MyPageNotificationCard></MyPageNotificationCard>
        <MyPageNotificationCard></MyPageNotificationCard>
        <MyPageNotificationCard></MyPageNotificationCard> -->

    </div>

    <!-- <div style="display:inline-block; width:90%; height:30%; padding: 0.5em 0;">
        <MyPageNotificationCard style="border-radius: 0.5em;"></MyPageNotificationCard>
    </div>
    <div style="display:inline-block; width:90%; height:30%; padding: 0.5em 0;">
        <MyPageNotificationCard style="border-radius: 0.5em;"></MyPageNotificationCard>
    </div>
    <div style="display:inline-block; width:90%; height:30%; padding: 0.5em 0;">
        <MyPageNotificationCard style="border-radius: 0.5em;"></MyPageNotificationCard>
    </div> -->

    <!-- <div v-for="SummaryCard in this.List_SummaryCard.data_list_notyet" style="display:inline-block; width:25%; height:100%; padding: 0 2px;">
        <MyPageProjectsCard @click="click_SummaryCard(SummaryCard)" :data_SummaryCard="SummaryCard"/>
    </div> -->
</template>

<script>
// import MyPageNotificationCard from "@/components/MyPageNotificationCard.vue"
export default {
    components: {
        // MyPageNotificationCard
    }
}
</script>

<style>
#menu-title {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    padding: 1em 1.5em;

}
#menu-more {
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 0.6em;
    color: #C4C4C4;
}

#menu-contents{
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0px 2.0em;
}
</style>