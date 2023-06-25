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
            colorList: ['#FF0000', '#00FF00', '#0000FF'],
            maskList: [],


            mask1: new Image(),
            mask2: new Image(),
            mask3: new Image(),


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
        assignMaskList() {
            this.maskList = Array(this.InferenceData.mask.length).fill({maskImage:null, masklayer: null, maskRaster:null, maskData:null});
        },
        initCanvas() {
            let canvas = document.getElementById("editor");
            this.paper.setup(canvas);
            this.canvasSize.width = canvas.offsetWidth
            this.canvasSize.height = canvas.offsetHeight
            // this.paper.view.viewSize = [canvas.offsetWidth, canvas.offsetHeight];

            this.paper.activate();
            this.image.raster = new paper.Raster(this.image.url);

            this.image.raster.onLoad = () => {
                console.log('image onloaded')
                let tempCtx = document.createElement("canvas").getContext("2d");
                let width = this.image.raster.width;
                let height = this.image.raster.height;

                tempCtx.canvas.width = width;
                tempCtx.canvas.height = height;

                this.image.raster.sendToBack();
                this.fit();
                this.image.ratio = (width * height) / 1000000;

                tempCtx.drawImage(this.image.raster.image, 0, 0, width, height);

            };
        },

        // initCanvas() {
        //     let canvas = document.getElementById("editor");
        //     this.paper.setup(canvas);
        //     this.paper.view.viewSize = [
        //         // this.paper.view.size.width,
        //         // window.innerWidth, window.innerHeight

        //         canvas.offsetWidth, canvas.offsetHeight
        //     ];

        //     this.paper.activate();
        //     // this.image.url = this.image_meta.imagepath_img
        //     // console.log("this.image.url : " + this.image.url)
        //     this.image.raster = new paper.Raster(this.image.url);

        //     const maskImage1 = new Image();
        //     maskImage1.src = this.mask1.url;

        //     this.image.raster.onLoad = () => {
        //         console.log('[initCanvas] - onloaded')
        //         let tempCtx = document.createElement("canvas").getContext("2d");
        //         let width = this.image.raster.width;
        //         let height = this.image.raster.height;

        //         tempCtx.canvas.width = width;
        //         tempCtx.canvas.height = height;

        //         this.image.raster.sendToBack();
        //         this.fit();
        //         this.image.ratio = (width * height) / 1000000;
        //         // this.removeProcess(process);

        //         tempCtx.drawImage(this.image.raster.image, 0, 0, width, height);

        //         maskImage1.onLoad = () => {
        //             console.log('maskImage onload')
        //             tempCtx.globalAlpha = 0.9; // 투명도 조절 값 (0.0 ~ 1.0)
        //             tempCtx.drawImage(maskImage1, 0, 0, width, height);
        //         }

        //         this.image.data = tempCtx.getImageData(0, 0, width, height);
        //         let fontSize = width * 0.025;

        //         let positionTopLeft = new paper.Point(
        //             -width / 2,
        //             -height / 2 - fontSize * 0.5
        //         );
        //         this.text.topLeft = new paper.PointText(positionTopLeft);
        //         this.text.topLeft.fontSize = fontSize;
        //         this.text.topLeft.fillColor = "black";
        //         this.text.topLeft.content = this.image.url;

        //         // let positionTopRight = new paper.Point(
        //         //     width / 2,
        //         //     -height / 2 - fontSize * 0.4
        //         // );
        //         // this.text.topRight = new paper.PointText(positionTopRight);
        //         // this.text.topRight.justification = "right";
        //         // this.text.topRight.fontSize = fontSize;
        //         // this.text.topRight.fillColor = "black";
        //         // this.text.topRight.content = width + "x" + height;
        //     };
        // },

        initCanvas_with_Mask_ver3() {
            let canvas = document.getElementById("editor");
            this.paper.setup(canvas);
            this.canvasSize.width = canvas.offsetWidth;
            this.canvasSize.height = canvas.offsetHeight;
            this.paper.view.viewSize = [canvas.offsetWidth, canvas.offsetHeight];

            let imageLayer = new this.paper.Layer(); // 이미지를 그릴 레이어

            // 이미지 로드 완료 콜백
            this.image.raster = new this.paper.Raster(this.image.url);
            this.image.raster.onLoad = () => {
                console.log("Image Onloaded");
                imageLayer.addChild(this.image.raster);
                this.image.raster.opacity = 1;
                this.imageSize.width = this.image.raster.width;
                this.imageSize.height = this.image.raster.height;

                // 마스크 로드 완료 콜백
                const loadMask = (maskData, maskLayer, maskRaster) => {
                    console.log("[loadMask1]", maskData)
                    return new Promise((resolve, reject) => {
                        maskRaster.onLoad = () => {
                            console.log("Mask Onloaded");
                            maskLayer.addChild(maskRaster);
                            maskRaster.opacity = 0;
                            resolve();
                        };
                        maskRaster.onError = (error) => {
                            reject(error);
                        };
                        maskRaster.src = maskData;
                        console.log("[loadMask2]", maskData)
                    });
                };

                // 모든 마스크 로드를 기다리는 프라미스 배열 생성
                const maskPromises = this.maskList.map((maskItem, index) => {
                    const maskLayer = new this.paper.Layer(); // 마스크를 그릴 레이어
                    const maskRaster = new this.paper.Raster();
                    maskItem.maskLayer = maskLayer;
                    maskItem.maskData = this.binary2png(this.InferenceData.mask[index].data_base64Decoded, this.ColorHEX2RGB(this.colorList[index]))
                    console.log("[binary2png] index: ", index)
                    console.log("[binary2png]", maskItem.maskData)
                    return loadMask(maskItem.maskData, maskLayer, maskRaster);
                });

                // 모든 마스크 로드가 완료되면 실행
                Promise.all(maskPromises)
                .then(() => {
                    console.log("All Masks Loaded");
                    imageLayer.position = new this.paper.Point(0, 0);
                    this.maskList.forEach((maskItem) => {
                        maskItem.maskLayer.position = new this.paper.Point(0, 0);
                        this.image.raster.sendToBack();
                        maskItem.maskRaster.sendToBack();
                    });
                    this.fit();
                    this.image.ratio = (this.imageSize.width * this.imageSize.height) / 1000000;
                })
                .catch((error) => {
                    console.error("Error loading masks:", error);
                });
            };

        },


        initCanvas_with_Mask_ver2() {
            let canvas = document.getElementById("editor");
            this.paper.setup(canvas);
            this.canvasSize.width = canvas.offsetWidth
            this.canvasSize.height = canvas.offsetHeight
            this.paper.view.viewSize = [canvas.offsetWidth, canvas.offsetHeight];

            let imageLayer = new this.paper.Layer(); // 이미지를 그릴 레이어
            for(let i=0; i<this.maskList.length; i++) {
                this.maskList[i].maskLayer = new this.paper.Layer(); // 마스크를 그릴 레이어
            }
            console.log("[BeforeActivate-maskLayer]")
            for(let i=0; i<this.maskList.length; i++) {
                console.log(this.maskList[i].maskLayer)
            }

            this.paper.activate();
            this.image.raster = new this.paper.Raster(this.image.url);

            // 이미지 로드가 완료된 후 실행되는 콜백 함수
            this.image.raster.onLoad = () => {
                console.log("Image Onloaded: ", this.image.url)
                imageLayer.addChild(this.image.raster);
                this.image.raster.opacity = 1;

                let width = this.image.raster.width;
                let height = this.image.raster.height;

                for(let i=0; i<this.maskList.length; i++) {
                    this.maskList[i].maskImage = new Image();
                    // this.maskList[i].maskLayer = new this.paper.Layer(); // 마스크를 그릴 레이어

                    // 클로저 생성
                    ((index) => {
                        this.maskList[index].maskImage.onload = () => {
                        console.log(index, "th Mask Onloaded");
                        this.maskList[index].maskRaster = new this.paper.Raster(this.maskList[index].maskImage);
                        this.maskList[index].maskRaster.opacity = 0;

                        this.maskList[index].maskLayer.addChild(this.maskList[index].maskRaster);
                        console.log(index, "th MaskLayer");
                        console.log(this.maskList[index].maskLayer)

                        imageLayer.position = new this.paper.Point(0, 0);
                        this.maskList[index].maskLayer.position = new this.paper.Point(0, 0);

                        this.image.raster.sendToBack();
                        this.maskList[index].maskRaster.sendToBack();
                        this.fit();
                        this.image.ratio = (width * height) / 1000000;
                        };
                    })(i);

                    this.maskList[i].maskData = this.binary2png(this.InferenceData.mask[i].data_base64Decoded, this.ColorHEX2RGB(this.colorList[i]))
                    this.maskList[i].maskImage.src = this.maskList[i].maskData
                }
            };
        },

        initCanvas_with_Mask_ver1() {
            let canvas = document.getElementById("editor");
            this.paper.setup(canvas);
            this.canvasSize.width = canvas.offsetWidth
            this.canvasSize.height = canvas.offsetHeight
            this.paper.view.viewSize = [canvas.offsetWidth, canvas.offsetHeight];

            let imageLayer = new this.paper.Layer(); // 이미지를 그릴 레이어
            for(let i=0; i<this.maskList.length; i++) {
                this.maskList[i].maskLayer = new this.paper.Layer(); // 마스크를 그릴 레이어
            }

            this.paper.activate();
            this.image.raster = new this.paper.Raster(this.image.url);

            // 이미지 로드가 완료된 후 실행되는 콜백 함수
            this.image.raster.onLoad = () => {
                console.log("Image Onloaded")
                imageLayer.addChild(this.image.raster);
                this.image.raster.opacity = 1;

                let width = this.image.raster.width;
                let height = this.image.raster.height;

                for(let i=0; i<this.maskList.length; i++) {
                    this.maskList[i].maskImage = new Image();

                    this.maskList[i].maskImage.onload = () => {
                        console.log(i, "th Mask Onloaded")
                        this.maskList[i].maskRaster = new this.paper.Raster(this.maskList[i].maskImage);
                        this.maskList[i].maskRaster.opacity = 0;

                        this.maskList[i].maskLayer.addChild(this.maskList[i].maskRaster);

                        // imageLayer.position = new this.paper.Point(0, 0);
                        this.maskList[i].maskLayer.position = new this.paper.Point(0, 0);

                        this.image.raster.sendToBack();
                        this.maskList[i].maskRaster.sendToBack();
                        this.fit();
                        this.image.ratio = (width * height) / 1000000;

                    };

                    this.maskList[i].maskData = this.binary2png(this.InferenceData.mask[i].data_base64Decoded, this.ColorHEX2RGB(this.colorList[i]))
                    this.maskList[i].maskImage.src = this.maskList[i].maskData
                }

            };
        },


        // initCanvas_with_Mask() {
        //     let canvas = document.getElementById("editor");
        //     this.paper.setup(canvas);
        //     this.paper.view.viewSize = [
        //         canvas.offsetWidth, canvas.offsetHeight
        //     ];


        //     let imageLayer = new paper.Layer(); // 이미지를 그릴 레이어
        //     let mask1Layer = new paper.Layer(); // 마스크를 그릴 레이어
        //     let mask2Layer = new paper.Layer(); // 마스크를 그릴 레이어
        //     let mask3Layer = new paper.Layer(); // 마스크를 그릴 레이어


        //     this.paper.activate();
        //     this.image.raster = new paper.Raster(this.image.url);


        //     this.image.raster.onLoad = () => {
        //         imageLayer.addChild(this.image.raster)
        //         this.image.raster.opacity = 1

        //         let width = this.image.raster.width;
        //         let height = this.image.raster.height;

        //         this.mask1.onLoad = () => {
        //             console.log("mask1 onloaded")
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

        //         this.mask2.raster.onLoad = () => {
        //             console.log("mask2 onloaded")
        //             mask2Layer.addChild(this.mask.raster)
        //             this.mask2.raster.opacity = 0;

        //             imageLayer.position = new paper.Point(0, 0);
        //             mask2Layer.position = new paper.Point(0, 0);

        //             this.image.raster.sendToBack();
        //             this.mask2.raster.sendToBack();
        //             this.fit();
        //             this.image.ratio = (width * height) / 1000000;
        //             this.mask2.ratio = (width * height) / 1000000;
        //         }

        //         this.mask3.raster.onLoad = () => {
        //             console.log("mask3 onloaded")
        //             mask3Layer.addChild(this.mask.raster)
        //             this.mask3.raster.opacity = 0;

        //             imageLayer.position = new paper.Point(0, 0);
        //             mask3Layer.position = new paper.Point(0, 0);

        //             this.image.raster.sendToBack();
        //             this.mask3.raster.sendToBack();
        //             this.fit();
        //             this.image.ratio = (width * height) / 1000000;
        //             this.mask3.ratio = (width * height) / 1000000;
        //         }
        //     };



        //     let maskData1 = this.binary2png(this.InferenceData.mask[0].data_base64Decoded, this.ColorHEX2RGB(this.colorList[0]))
        //     maskImage1.src = maskData1

        //     let maskData2 = this.binary2png(this.InferenceData.mask[1].data_base64Decoded, this.ColorHEX2RGB(this.colorList[1]))
        //     maskImage2.src = maskData2

        //     let maskData3 = this.binary2png(this.InferenceData.mask[2].data_base64Decoded, this.ColorHEX2RGB(this.colorList[2]))
        //     maskImage3.src = maskData3
        // },

        binary2png(data_binary, color_ref){
            // console.log(color_ref)
            // console.log(data_binary)
            // 캔버스 생성
            const canvas = document.createElement('canvas');

            // 캔버스 컨텍스트 설정
            const context = canvas.getContext('2d');

            // 픽셀값 데이터를 이용하여 이미지 생성
            const imageData = context.createImageData(this.imageSize.width, this.imageSize.height);
            const data = imageData.data;    // data : 가로 x 세로 x 4ch Array

            const transparency = [0, 0, 0, 0];

            for (let i = 0; i < data.length; i += 4) {
                const index = i / 4;
                const color = data_binary[index] === '1' ? color_ref : transparency;
                // console.log(color[0])

                data[i] = color[0];
                data[i + 1] = color[1];
                data[i + 2] = color[2];
                data[i + 3] = color[3];
            }

            // 이미지 데이터 추출
            context.putImageData(imageData, 0, 0);
            const image = canvas.toDataURL('image/png');

            console.log(this.canvasSize.width)
            console.log(this.canvasSize.height)

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
                        if(this.maskList[i].maskRaster != null) {
                            this.maskList[i].maskRaster.opacity = 1
                        }
                    }
                    else {
                        if(this.maskList[i].maskRaster != null) {
                            this.maskList[i].maskRaster.opacity = 0
                        }
                    }
                }
            }
        },
        // "switchList"(after) {
        //     if(after == true){
        //         this.mask.raster.opacity=0.5
        //     }
        //     else{
        //         this.mask.raster.opacity=0
        //     }
        // }
    },

    created() {
        this.paper = new paper.PaperScope();

        this.assignSwitchList();
        this.assignMaskList();
        // this.initCanvas()
        // this.initMaskInfo();

        this.image.url = this.InferenceData.image_path2
        // this.mask1.url = this.image_meta.maskpath
    },

    mounted() {
        // this.initCanvas()
        this.initCanvas_with_Mask_ver3()
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