<template>
    <h4 style="text-align: left; margin-left: 1em;">PROJECTS</h4>
    <div style="display:inline-block; width:25%; height:90%; padding: 0 0.5em; ">
        <MyPageProjectsCard @click=" click_ProjectCard" style="border-radius: 0.5em;"></MyPageProjectsCard>
    </div>
    <div style="display:inline-block; width:25%; height:90%; padding: 0 0.5em;">
        <MyPageProjectsCard @click=" click_ProjectCard" style="border-radius: 0.5em;"></MyPageProjectsCard>
    </div>
    <div style="display:inline-block; width:25%; height:90%; padding: 0 0.5em;">
        <MyPageProjectsCard @click=" click_ProjectCard" style="border-radius: 0.5em;"></MyPageProjectsCard>
    </div>
    <div style="display:inline-block; width:25%; height:90%; padding: 0 0.5em;">
        <MyPageProjectsCard @click=" click_ProjectCard" style="border-radius: 0.5em;"></MyPageProjectsCard>
    </div>
    <!-- <div v-for="SummaryCard in this.List_SummaryCard.data_list_notyet" style="display:inline-block; width:25%; height:100%; padding: 0 2px;">
        <MyPageProjectsCard @click="click_SummaryCard(SummaryCard)" :data_SummaryCard="SummaryCard"/>
    </div> -->
</template>

<script>
import MyPageProjectsCard from "@/components/MyPageProjectsCard.vue"
export default {
    components: {
        MyPageProjectsCard
    },

    methods: {
        click_ProjectCard() {
        this.$router.push('/project')
      },
    }
}
</script>

<style>
</style>