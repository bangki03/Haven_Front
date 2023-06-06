<template>
    <div style="height: 30px; width:100%; display:flex; flex-direction: row; justify-content: center; align-items: center;">
        <i id="arrow-previous" class="fa fa-chevron-left" style="font-size: 20px; transform: scaleX(1); color: #6CC2FF;"/>
        {{ page_start }}
        <i id="arrow-next" class="fa fa-chevron-right" style="font-size: 20px; transform: scaleX(1); color: #6CC2FF;"/>
    </div>

</template>

<script>

export default{
    props:{
        page_start: Number,
        page_end: Number,
    },
    // data() {
    //     return{
            
    //     }
    // },
    // methods: {
    
    // },
}

</script>

<style>
  
</style>