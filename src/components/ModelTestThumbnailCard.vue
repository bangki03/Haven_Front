<template>
    <div style="height: 100%; display:flex; flex-direction: row; align-items: center; justify-content: center;">
        <div v-show="state_loading" style="height: 100%; display:flex; flex-direction: column; justify-content: center;">
            <fade-loader :color="'#BD7C4A'"></fade-loader>
        </div>
        <div v-show="!state_loading" style="height: 100%; display:flex; flex-direction: column; justify-content: center;">
            <img :id="'overlay-image' + index" style="object-fit: contain; width: auto; height: auto; max-width: 100%; max-height: calc(100% - 1.5rem);" @click="ImageZoomModal" />
            <p style="margin-bottom: 0;"> {{ inferenceInfo.image_path1 }}</p>
        </div>
    </div>


</template>

<script>
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

export default{
    components: {
        FadeLoader,
    },
    props: {
        inferenceInfo: {
            image_path_raw : String,
            result: String,
            uncertainty: Number,
            image_path1: String,    // 보여주기 위한 경로
            image_path2: String,    // 이미지 로드 할 때 쓰는 경로
            mask: Array,

        },
        index: Number,
        colorList: Array,

        // InferenceData: [
            //     {
            //         'image_path_raw': "/iQ.Platform/projects/1/data/2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg",
            //         "result": "OK",
            //         "uncertainty": 0,
            //         "image_path1": "2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg",
            //         "image_path2": "",
            //         "mask" : [
            //             {id: "175", name: "175", data_base64Decoded: []},
            //             {id: "176", name: "176", data_base64Decoded: []},
            //         ],
            //     }
            // ],
    },
    data() {
        return {
            state_loading: true,
            imageSize: {
                width: 0,
                height: 0,
            },
        }
    },

    methods: {
        ImageZoomModal() {
            this.$emit("OpenZoomImageModal")
        },
        // 이미지 로드 및 마스크 그리기 함수 (임시 마스크 1개)
        loadAndOverlayImage1() {
            let elementid = "overlay-image" + this.index
            console.log("elementid: ", elementid)
            const imgElement = document.getElementById(elementid);
            const canvas = document.createElement("canvas");

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.imageSize.width = img.width
                    this.imageSize.height = img.height
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    // 첫 번째 마스크 그리기
                    const mask1 = new Image();
                    mask1.onload = () => {
                        ctx.globalAlpha = 1; // 마스크의 투명도 조절
                        ctx.drawImage(mask1, 0, 0);

                        // 캔버스의 이미지 데이터를 img 요소에 할당하여 표시
                        imgElement.src = canvas.toDataURL();
                        resolve();
                    };
                    mask1.src = this.binary2png(this.inferenceInfo.mask[0].data_base64Decoded, this.ColorHEX2RGB(this.colorList[0]))
                };
                img.onerror = () => {
                    reject(new Error("Failed to load image."));
                };
                img.src = this.inferenceInfo.image_path2;
                // console.log("img.src")
                // console.log(img.src)
            });
        },
        // 이미지 로드 및 마스크 그리기 함수 (임시 마스크 2개)
        loadAndOverlayImage2() {
            let elementid = "overlay-image" + this.index
            console.log("elementid: ", elementid)
            const imgElement = document.getElementById(elementid);
            const canvas = document.createElement("canvas");

            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    this.imageSize.width = img.width
                    this.imageSize.height = img.height
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0);

                    // 첫 번째 마스크 그리기
                    const mask1 = new Image();
                    mask1.onload = () => {
                        ctx.globalAlpha = 1; // 마스크의 투명도 조절
                        ctx.drawImage(mask1, 0, 0);

                        // 두 번째 마스크 그리기
                        const mask2 = new Image();
                        mask2.onload = () => {
                            ctx.drawImage(mask2, 0, 0);

                            // 캔버스의 이미지 데이터를 img 요소에 할당하여 표시
                            imgElement.src = canvas.toDataURL();
                            resolve();
                        };
                        mask2.src = this.binary2png(this.inferenceInfo.mask[1].data_base64Decoded, this.ColorHEX2RGB(this.colorList[1]))
                    };
                    mask1.src = this.binary2png(this.inferenceInfo.mask[0].data_base64Decoded, this.ColorHEX2RGB(this.colorList[0]))
                };
                img.onerror = () => {
                    reject(new Error("Failed to load image."));
                };
                img.src = this.inferenceInfo.image_path2;
            });
        },
        binary2png(data_binary, color_ref){
            // 캔버스 생성
            const canvas = document.createElement('canvas');
            canvas.width = this.imageSize.width;
            canvas.height= this.imageSize.height;

            // 캔버스 컨텍스트 설정
            const context = canvas.getContext('2d');

            // 픽셀값 데이터를 이용하여 이미지 생성
            const imageData = context.createImageData(this.imageSize.width, this.imageSize.height);
            // const imageData = context.createImageData(1024, 1024);
            const data = imageData.data;    // data : 가로 x 세로 x 4ch Array

            const transparency = [0, 0, 0, 0];

            for (let i = 0; i < data.length; i += 4) {
                const index = i / 4;
                const color = data_binary[index] === '1' ? color_ref : transparency;
                // if(data_binary[index] === '1') {
                //     console.log("defect")
                // }

                data[i] = color[0];
                data[i + 1] = color[1];
                data[i + 2] = color[2];
                data[i + 3] = color[3];
            }

            // 이미지 데이터 추출
            context.putImageData(imageData, 0, 0);
            const image = canvas.toDataURL('image/png');

            return image
        },
        ColorHEX2RGB(hex) {
            // '#' 문자 제거
            hex = hex.replace('#', '');

            // 2개씩 나눠서 각 채널 값 추출
            const r = parseInt(hex.substring(0, 2), 16);
            const g = parseInt(hex.substring(2, 4), 16);
            const b = parseInt(hex.substring(4, 6), 16);

            // RGB 배열 반환
            return [r, g, b, 255];
        },
    },
    created() {

    },
    mounted() {
        if(this.inferenceInfo.mask.length == 1) {
            this.loadAndOverlayImage1()
            .then(() => {
                this.state_loading = false;
            })
        }
        else if(this.inferenceInfo.mask.length == 2) {
            this.loadAndOverlayImage2()
            .then(() => {
                this.state_loading = false;
            })
        }

        // .catch((error) => {
        //     console.error("Overlay error:", error);
        // });
    }

}
</script>

<style>

</style>