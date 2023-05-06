<template>
    <div id="menu-title">
        <h4>소식</h4>
        <div id="menu-more">more ></div>
    </div>

    <div id="menu-contents">

        <!-- <MyPageApplicationCard></MyPageApplicationCard>
        <MyPageApplicationCard></MyPageApplicationCard> -->

    </div>
</template>

<script>
// import MyPageProjectsCard from "@/components/MyPageProjectsCard.vue"
export default {
    components: {
        // MyPageProjectsCard
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