<template>
    <div style="width:100%; display:flex; flex-direction: row; justify-content: flex-end; align-items: center;">
        <div v-for="(MaskInfo, index) in InferenceData.mask" :key="MaskInfo.ModelName">
            <div class="form-check form-switch" style="margin-right:1.0rem; display:flex; align-items:center;">
                <input class="form-check-input" style="height:1.5em; width:2.5em; margin-top:0.5em; margin-right:1em;" type="checkbox" :id="'flexSwitchCheckMask' + index" v-model="switchList[index]" @change="SwitchMaskChange">
                <label class="form-check-label" :style="{ color: colorList[index] }" style="font-weight:200;font-size: 1.2em; margin-right:2em; margin-top:0.3em;" :for="'flexSwitchCheckMask' + index">{{ MaskInfo.name }}</label>
            </div>
        </div>
    </div>
    <div class="middle-panel">
        <div id="frame" class="frame" @wheel="onwheel" >
            <canvas class="canvas" id="editor" ref="image" resize />
        </div>
    </div>
    <SelectToolTest
            v-show="false"
            :selected="activeTool"
            @update="activeTool = $event"
            :scale="image.scale"
            ref="select"
        />
</template>

<script>
import paper from "paper";
import SelectToolTest from "@/components/SelectToolTest";
export default{
    components: {
        SelectToolTest,
    },
    props: {
        InferenceData: {
            image_path_raw: String, // 원본 Path
            result: String,
            uncertainty: Number,

            image_path1: String,    // Front에 출력용
            image_path2: String,    // Load 용
            mask: Array,
        },
        colorList: Array,

        // InferenceData: [
        //     {
        //         'image_path_raw': "/iQ.Platform/projects/1/data/2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg",
        //         "result": "OK",
        //         "uncertainty": 0,
        //         "image_path1": "2023-06-16/16-19-41/2023-06-16_16-19-41_01image.jpg",
        //         "image_path2": "",
        //         "mask" : [
        //             {id: "175", name: "175", data_base64: "", data_base64Decoded: ""},
        //             {id: "176", name: "175", data_base64: "", data_base64Decoded: ""},
        //         ],
        //     }
        // ],


    },
    data() {
        return{
            switchList: [],

            maskRaster: [null, null,],
            mask1Raster: null,
            mask2Raster: null,

            paper: null,
            zoom: 0.2,
            activeTool: "Select",
            image: {
                raster: {},
                scale: 0,
                // metadata: {},
                ratio: 0,
                rotate: 0,
                id: null,
                url: "",
                dataset: 0,
                previous: null,
                next: null,
                filename: "",
                categoryIds: [],
                data: null,

                // 추가
                width: 0,
                height: 0,
            },

            canvasSize: {
                width: 0,
                height: 0,
            },
            imageSize: {
                width: 0,
                height: 0,
            },

            text: {
                topLeft: null,
                topRight: null
            },
        }
    },
    methods: {
        assignSwitchList() {
            this.switchList = Array(this.InferenceData.mask.length).fill(false);
        },
        initMaskInfo() {
            // for(let i=0; i<this.InferenceData.length; i++) {
            //     this.maskList.push({
            //         raster: {},
            //         scale: 0,
            //         // metadata: {},
            //         ratio: 0,
            //         rotate: 0,
            //         id: null,
            //         url: "",
            //         dataset: 0,
            //         previous: null,
            //         next: null,
            //         filename: "",
            //         categoryIds: [],
            //         data: null,

            //         // 추가
            //         width: 0,
            //         height: 0,
            //     })
            // }
        },
        initCanvas() {
            let canvas = document.getElementById("editor");
            this.paper.setup(canvas);
            this.paper.view.viewSize = [
                // this.paper.view.size.width,
                // window.innerWidth, window.innerHeight

                canvas.offsetWidth, canvas.offsetHeight
            ];

            this.paper.activate();
            // this.image.url = this.image_meta.imagepath_img
            // console.log("this.image.url : " + this.image.url)
            this.image.raster = new paper.Raster(this.image.url);

            const maskImage1 = new Image();
            maskImage1.src = this.mask1.url;

            this.image.raster.onLoad = () => {
                console.log('[initCanvas] - onloaded')
                let tempCtx = document.createElement("canvas").getContext("2d");
                let width = this.image.raster.width;
                let height = this.image.raster.height;

                tempCtx.canvas.width = width;
                tempCtx.canvas.height = height;

                this.image.raster.sendToBack();
                this.fit();
                this.image.ratio = (width * height) / 1000000;
                // this.removeProcess(process);

                tempCtx.drawImage(this.image.raster.image, 0, 0, width, height);

                maskImage1.onLoad = () => {
                    console.log('maskImage onload')
                    tempCtx.globalAlpha = 0.9; // 투명도 조절 값 (0.0 ~ 1.0)
                    tempCtx.drawImage(maskImage1, 0, 0, width, height);
                }

                this.image.data = tempCtx.getImageData(0, 0, width, height);
                let fontSize = width * 0.025;

                let positionTopLeft = new paper.Point(
                    -width / 2,
                    -height / 2 - fontSize * 0.5
                );
                this.text.topLeft = new paper.PointText(positionTopLeft);
                this.text.topLeft.fontSize = fontSize;
                this.text.topLeft.fillColor = "black";
                this.text.topLeft.content = this.image.url;

                // let positionTopRight = new paper.Point(
                //     width / 2,
                //     -height / 2 - fontSize * 0.4
                // );
                // this.text.topRight = new paper.PointText(positionTopRight);
                // this.text.topRight.justification = "right";
                // this.text.topRight.fontSize = fontSize;
                // this.text.topRight.fillColor = "black";
                // this.text.topRight.content = width + "x" + height;
            };
        },
        // 임시 Mask 1개일때,
        initCanvas_with_Mask1() {
            let canvas = document.getElementById("editor");
            this.paper.setup(canvas);
            this.canvasSize.width = canvas.offsetWidth
            this.canvasSize.height = canvas.offsetHeight
            this.paper.view.viewSize = [this.canvasSize.width, this.canvasSize.height];


            let imageLayer = new this.paper.Layer(); // 이미지를 그릴 레이어
            let mask1Layer = new this.paper.Layer(); // 마스크를 그릴 레이어
            // let mask2Layer = new this.paper.Layer(); // 마스크를 그릴 레이어
            // let mask3Layer = new this.paper.Layer(); // 마스크를 그릴 레이어

            this.paper.activate();
            this.image.raster = new this.paper.Raster(this.image.url);

            // 이미지 로드가 완료된 후 실행되는 콜백 함수
            this.image.raster.onLoad = () => {
                console.log("Image Onloaded: ", this.image.url)
                imageLayer.addChild(this.image.raster);
                this.image.raster.opacity = 1;

                this.imageSize.width = this.image.raster.width;
                this.imageSize.height = this.image.raster.height;


                // 마스크1 이미지 생성
                const mask1Image = new Image();

                mask1Image.onload = () => {
                    console.log("Mask1 Onloaded")
                    this.maskRaster[0] = new this.paper.Raster(mask1Image);
                    this.maskRaster[0].opacity = 0;

                    mask1Layer.addChild(this.maskRaster[0]);

                    imageLayer.position = new this.paper.Point(0, 0);
                    mask1Layer.position = new this.paper.Point(0, 0);

                    this.image.raster.sendToBack();
                    this.maskRaster[0].sendToBack();
                    this.fit();
                    this.image.ratio = (this.imageSize.width * this.imageSize.height) / 1000000;
                };

                // 마스크2 이미지 생성
                // const mask2Image = new Image();

                // mask2Image.onload = () => {
                //     console.log("Mask2 Onloaded")
                //     this.maskRaster[1] = new this.paper.Raster(mask2Image);
                //     this.maskRaster[1].opacity = 0;

                //     mask2Layer.addChild(this.maskRaster[1]);

                //     imageLayer.position = new this.paper.Point(0, 0);
                //     mask2Layer.position = new this.paper.Point(0, 0);

                //     this.image.raster.sendToBack();
                //     this.maskRaster[1].sendToBack();
                //     this.fit();
                //     this.image.ratio = (this.imageSize.width * this.imageSize.height) / 1000000;
                // };

                // 마스크3 이미지 생성
                // const mask3Image = new Image();

                // mask3Image.onload = () => {
                //     console.log("Mask1 Onloaded")
                //     this.maskRaster[2] = new this.paper.Raster(mask3Image);
                //     this.maskRaster[2].opacity = 0;

                //     mask3Layer.addChild(this.maskRaster[2]);

                //     imageLayer.position = new this.paper.Point(0, 0);
                //     mask3Layer.position = new this.paper.Point(0, 0);

                //     this.image.raster.sendToBack();
                //     this.maskRaster[2].sendToBack();
                //     this.fit();
                //     this.image.ratio = (this.imageSize.width * this.imageSize.height) / 1000000;
                // };

                const mask1Data = this.binary2png(this.InferenceData.mask[0].data_base64Decoded, this.ColorHEX2RGB(this.colorList[0]))
                // const mask2Data = this.binary2png(this.InferenceData.mask[1].data_base64Decoded, this.ColorHEX2RGB(this.colorList[1]))
                // const mask3Data = this.binary2png(this.InferenceData.mask[2].data_base64Decoded, this.ColorHEX2RGB(this.colorList[2]))
                mask1Image.src = mask1Data;
                // mask2Image.src = mask2Data;
                // mask3Image.src = mask3Data;

            };
        },

        // 임시 Mask 2개일때,
        initCanvas_with_Mask2() {
            let canvas = document.getElementById("editor");
            this.paper.setup(canvas);
            this.canvasSize.width = canvas.offsetWidth
            this.canvasSize.height = canvas.offsetHeight
            this.paper.view.viewSize = [this.canvasSize.width, this.canvasSize.height];


            let imageLayer = new this.paper.Layer(); // 이미지를 그릴 레이어
            let mask1Layer = new this.paper.Layer(); // 마스크를 그릴 레이어
            let mask2Layer = new this.paper.Layer(); // 마스크를 그릴 레이어
            // let mask3Layer = new this.paper.Layer(); // 마스크를 그릴 레이어

            this.paper.activate();
            this.image.raster = new this.paper.Raster(this.image.url);

            // 이미지 로드가 완료된 후 실행되는 콜백 함수
            this.image.raster.onLoad = () => {
                console.log("Image Onloaded: ", this.image.url)
                imageLayer.addChild(this.image.raster);
                this.image.raster.opacity = 1;

                this.imageSize.width = this.image.raster.width;
                this.imageSize.height = this.image.raster.height;


                // 마스크1 이미지 생성
                const mask1Image = new Image();

                mask1Image.onload = () => {
                    console.log("Mask1 Onloaded")
                    this.maskRaster[0] = new this.paper.Raster(mask1Image);
                    this.maskRaster[0].opacity = 0;

                    mask1Layer.addChild(this.maskRaster[0]);

                    imageLayer.position = new this.paper.Point(0, 0);
                    mask1Layer.position = new this.paper.Point(0, 0);

                    this.image.raster.sendToBack();
                    this.maskRaster[0].sendToBack();
                    this.fit();
                    this.image.ratio = (this.imageSize.width * this.imageSize.height) / 1000000;
                };

                const mask2Image = new Image();

                mask2Image.onload = () => {
                    console.log("Mask2 Onloaded")
                    this.maskRaster[1] = new this.paper.Raster(mask2Image);
                    this.maskRaster[1].opacity = 0;

                    mask2Layer.addChild(this.maskRaster[1]);

                    imageLayer.position = new this.paper.Point(0, 0);
                    mask2Layer.position = new this.paper.Point(0, 0);

                    this.image.raster.sendToBack();
                    this.maskRaster[1].sendToBack();
                    this.fit();
                    this.image.ratio = (this.imageSize.width * this.imageSize.height) / 1000000;
                };

                // 마스크3 이미지 생성
                // const mask3Image = new Image();

                // mask3Image.onload = () => {
                //     console.log("Mask1 Onloaded")
                //     this.maskRaster[2] = new this.paper.Raster(mask3Image);
                //     this.maskRaster[2].opacity = 0;

                //     mask3Layer.addChild(this.maskRaster[2]);

                //     imageLayer.position = new this.paper.Point(0, 0);
                //     mask3Layer.position = new this.paper.Point(0, 0);

                //     this.image.raster.sendToBack();
                //     this.maskRaster[2].sendToBack();
                //     this.fit();
                //     this.image.ratio = (this.imageSize.width * this.imageSize.height) / 1000000;
                // };

                const mask1Data = this.binary2png(this.InferenceData.mask[0].data_base64Decoded, this.ColorHEX2RGB(this.colorList[0]))
                const mask2Data = this.binary2png(this.InferenceData.mask[1].data_base64Decoded, this.ColorHEX2RGB(this.colorList[1]))
                // const mask3Data = this.binary2png(this.InferenceData.mask[2].data_base64Decoded, this.ColorHEX2RGB(this.colorList[2]))
                mask1Image.src = mask1Data;
                mask2Image.src = mask2Data;
                // mask3Image.src = mask3Data;

            };
        },


        // initCanvas_with_Mask() {
        //     let canvas = document.getElementById("editor");
        //     this.paper.setup(canvas);
        //     this.canvasSize.width = canvas.offsetWidth
        //     this.canvasSize.height = canvas.offsetHeight
        //     this.paper.view.viewSize = [
        //         canvas.offsetWidth, canvas.offsetHeight
        //     ];


        //     let imageLayer = new paper.Layer(); // 이미지를 그릴 레이어
        //     let mask1Layer = new paper.Layer(); // 마스크를 그릴 레이어


        //     this.paper.activate();
        //     this.image.raster = new paper.Raster(this.image.url);

        //     const maskImage1 = new Image();
        //     maskImage1.src = this.mask1.url;

        //     this.image.raster.onLoad = () => {
        //         imageLayer.addChild(this.image.raster)
        //         this.image.raster.opacity = 1

        //         let width = this.image.raster.width;
        //         let height = this.image.raster.height;

        //         this.mask1.raster = new paper.Raster(this.mask1.url);

        //         this.mask1.raster.onLoad = () => {
        //             mask1Layer.addChild(this.mask.raster)
        //             this.mask1.raster.opacity = 0;

        //             imageLayer.position = new paper.Point(0, 0);
        //             mask1Layer.position = new paper.Point(0, 0);

        //             this.image.raster.sendToBack();
        //             this.mask1.raster.sendToBack();
        //             this.fit();
        //             this.image.ratio = (width * height) / 1000000;
        //             this.mask1.ratio = (width * height) / 1000000;
        //         }
        //     };
        // },

        binary2png(data_binary, color_ref){
            // console.log(color_ref)
            // console.log(data_binary)
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

        fit() {
            let canvas = document.getElementById("editor");

            let parentX = this.image.raster.width;
            let parentY = this.image.raster.height;

            this.paper.view.zoom = Math.min(
                (canvas.width / parentX) * 0.95,
                (canvas.height / parentY) * 0.8
            );
            // console.log("canvas.width: ", canvas.width)
            // console.log("canvas.height: ", canvas.height)
            // console.log("parentX: ", parentX)
            // console.log("parentY: ", parentY)


            this.image.scale = 1 / this.paper.view.zoom;
            // this.mask.scale = 1 / this.paper.view.zoom; // mask 임시
            this.paper.view.setCenter(0, 0);
        },
        onwheel(e) {
            e.preventDefault();
            // if (!this.doneLoading) return;

            let view = this.paper.view;

            if (e.ctrlKey) {
            // Pan up and down
            let delta = new paper.Point(0, 0.5 * e.deltaY);
            this.paper.view.setCenter(view.center.add(delta));
            } else if (e.shiftKey) {
            // Pan left and right
            let delta = new paper.Point(0.5 * e.deltaY, 0);
            this.paper.view.setCenter(view.center.add(delta));
            } else {
            console.log("onWheel - else(ctrlkey)")
            let viewPosition = view.viewToProject(
                new paper.Point(e.offsetX, e.offsetY)
            );

            let transform = this.changeZoom(e.deltaY, viewPosition);
            if (transform.zoom < 10 && transform.zoom > 0.01) {
                this.image.scale = 1 / transform.zoom;
                this.paper.view.zoom = transform.zoom;
                this.paper.view.center = view.center.add(transform.offset);
            }
            }

            return false;
        },
        changeZoom(delta, p) {
            let oldZoom = this.paper.view.zoom;
            let c = this.paper.view.center;
            let factor = 1 + this.zoom;

            let zoom = delta < 0 ? oldZoom * factor : oldZoom / factor;
            let beta = oldZoom / zoom;
            let pc = p.subtract(c);
            let a = p.subtract(pc.multiply(beta)).subtract(c);

            return { zoom: zoom, offset: a };
        },
    },
    watch: {
        switchList: {
            deep: true,
            handler(after) {
                for (let i=0; i<this.switchList.length; i++) {
                    if(after[i] == true) {
                        if(this.maskRaster[i] != null) {
                            this.maskRaster[i].opacity = 1
                        }
                    }
                    else {
                        if(this.maskRaster[i] != null) {
                            this.maskRaster[i].opacity = 0
                        }
                    }
                }
            }
        },
    },

    created() {
        this.assignSwitchList();
        this.initMaskInfo();

        this.paper = new paper.PaperScope();

        this.image.url = this.InferenceData.image_path2
        // this.mask1.url = this.image_meta.maskpath
        console.log("created")
    },

    mounted() {
        console.log("mounted")
        // console.log(this.InferenceData.mask[0].data_base64)
        // console.log(this.InferenceData.mask[0].data_base64Decoded)
        // this.initCanvas()
        if(this.InferenceData.mask.length == 1) {
            this.initCanvas_with_Mask1()
        }
        else if(this.InferenceData.mask.length == 2) {
            this.initCanvas_with_Mask2()
        }
    },



}
</script>

<style scoped>
.middle-panel {
    display: block;
    /* width: calc(100% - 250px - 40px); */
    width: 100%;
    height: 100%;

    /* margin-left: 1em; */

    background-color: white;
    overflow: hidden;
    position: relative;

    /* border-top-left-radius: 1em; */
    border-bottom-left-radius: 1em;
    /* border-top-right-radius: 1em; */
    border-bottom-right-radius: 1em;
}
.frame{
    width: 100%;
    height: 100%;
}
.canvas {
    width: 100%;
    height: 100%;
}

</style>