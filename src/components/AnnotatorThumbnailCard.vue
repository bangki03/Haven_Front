<template>
    <div style="display:flex; flex-direction: column; justify-content: center; align-items:center;">
        <img
            id="Icon_Project_Preview_Application"
            :src= this.image_ThumbnailCard.image_file_path
            alt="../assets/TestSampleImage.png"
            style=" width: 200px; padding: 0;"
        />
    </div>

</template>

<script>
export default{
    props: ['image_ThumbnailCard'],

    methods: {

    },
    mounted() {
        console.log("### Test : Annotator Thumbnail Card : Path : " + this.image_ThumbnailCard.image_file_path)
    }
}
</script>

<style>
</style>