<template>
    <div style="display:flex; flex-direction: column; justify-content: center; align-items:center;">
        <img
            id="Icon_Project_Preview_Application"
            :src= this.image_ThumbnailCard.image_file_path
            style=" width: 190px; padding: 0;"
        />
        <div style="font-size:0.8rem;">{{ filename }}</div>
    </div>

</template>

<script>
export default{
    props: ['image_ThumbnailCard'],

    data(){
        return {
            filename: ""    
        }
    },

    methods: {
        set_filename() {
            this.filename = this.image_ThumbnailCard.image_filename.split("/")[2]
        }
    },
    created() {
        this.set_filename()
    },
    mounted() {
        console.log("### Test : Annotator Thumbnail Card : Path : " + this.image_ThumbnailCard.image_file_path)
    }
}
</script>

<style>
</style>