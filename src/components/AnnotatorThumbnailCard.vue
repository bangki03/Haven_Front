<template>
    <div style="display:flex; flex-direction: column; justify-content: center; align-items:center;">
        <img
            id="Icon_Project_Preview_Application"
            :src= this.image_ThumbnailCard.image_file_path
            alt="../assets/TestSampleImage.png"
            style=" width: 220px; padding: 0;"
        />
        <div>{{ image_ThumbnailCard.image_filename }}</div>
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