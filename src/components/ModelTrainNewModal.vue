<template>
    <div class="mymodal-wrapper" @click="close_modal()">
        <div class="mymodal" @click.stop="do_nothing()">
            <div class="modal-contents">
                <div class="mymodal-header">AI 모델 학습</div>

                <div class="mymodal-main">
                    <div class="item-key">AI 모델명</div>
                    <div class="item-value">
                        <!-- <input v-model="model_info.model_name" class="form-control" placeholder="모델명을 입력하세요." required> -->
                        <input id="input_model_name" :value="model_info.model_name" @input="model_info.model_name = $event.target.value" @blur="saveInputValue" class="form-control" placeholder="모델명을 입력하세요." required>

                    </div>

                    <div class="item-key">설명</div>

                    <!-- <div class="item-value" style="grid-row: 3 / span 2; grid-column: 1 / span 2; display:flex; align-items: stretch; justify-items: stretch;">
                        <textarea v-model="model_info.model_script" style="width: 100%; height:8em; line-height:1.5em; border-radius: 20px; padding: 0.2em 1em;"></textarea>
                    </div> -->

                    <!-- <div class="item-value" style="grid-row: 3 / span 2; grid-column: 1 / span 2; display:flex; align-items: stretch; justify-items: stretch;">
                        <input v-model="model_info.model_script" type="text" style="width: 100%; height:4em; line-height:4em; border-radius: 20px;">
                    </div> -->

                    <div class="item-value">
                        <!-- <input v-model="model_info.model_script" class="form-control" placeholder="설명을 적어주세요." required> -->
                        <input id="input_model_script" :value="model_info.model_script" @input="model_info.model_script = $event.target.value" @blur="saveInputValue" class="form-control" placeholder="설명을 적어주세요." required>
                    </div>
                </div>

                <div class="mymodal-footer">
                    <input type="submit" class="btn" value="생성하기" style="background-color: #BD7C4A; color:white; font-size: 2em; padding:0.1em 1em;" @click="handle_toggle">
                </div>

            </div>

        </div>
    </div>
</template>



<script>
// import $ from 'jquery';
import axios from "axios";

export default{
   data() {
      return {
         model_info: {
            model_name : "",
            model_script : "",
         },

         API_List: null,
      }
   },

   computed: {

   },

   methods: {
      saveInputValue(event){
         if(event.target.id == "input_model_name") {
            this.model_info.model_name = event.target.value
         }
         else if(event.target.id == "input_model_script") {
            this.model_info.model_script = event.target.value
         }
      },

      handle_toggle() {
         this.post_create_model()

      },

      selectProjectType(type) {
         this.selectedProjectType = type;
         this.showDropdownContent = false;
         this.selectedProjectTextColor = 'black'
      },
      close_modal() {
         this.$emit('closeModal')
      },
      do_nothing(){

      },

      post_create_model() {
         console.log(this.$store.state.account.User_ID)
         fetch(this.API_List.create_model, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            user_id: Number(this.$store.state.account.UserID),
            project_id: this.$store.state.project.id,
            name : this.model_info.model_name,
            description : this.model_info.model_script,
         }),
         }).then( data => {
         if(data.status == '200'){
            alert("신규 모델 학습 시작합니다.");
            this.$emit('closeModal')
            this.$router.go();
         }
         });

      },
      set_APIlist() {
         return axios.get('/api_list.json')
         .then(response => {
         this.API_List = response.data;
         })
         .catch(error => {
         console.log(error);
         });
      },
   },

   created() {
      this.set_APIlist()
   }

}
</script>

<style scoped>

.mymodal-wrapper {
   position: fixed;
   width: 100vw;
   height: 100vh;
   left:0vw;
   top:0vh;
   /* background-color: rgba(250,252,254,0.7); */
   background-color: rgba(0, 0, 0, 0.5); /* 불투명한 배경 스타일 */
}
.mymodal {
   display: flex;
   flex-direction: column;
   width: 30vw;
   height: none;
   left:35vw;
   top:25vh;
   position : fixed;

   border-radius: 0.5em;

   background-color: rgba(250,252,254,1);
   box-shadow: 0px 0px 1px 1px #dddddd;
}
.modal-contents{
    flex-grow: 1;
}
.mymodal-header{
    margin-top: 0.5em;
    padding-bottom: 0.5em;

    display: flex;
    justify-content: center;
    font-size: 1.8em;
    border: 0px solid;
    border-bottom-width: 2px;

    border-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    border-image-slice: 1;
}

.mymodal-main {
   padding: 1em 5em;
   display: grid;
   grid-template-columns: 2fr 5fr;
	grid-template-rows: repeat(2, minmax(60px, auto));
   column-gap: 1em;
   justify-content: center;
   /* 수직 가운데 정렬 */
   align-items: center;
}
.item-key {
   font-size: 1.6em;
}


.item-value input {
    margin-bottom: 0px;
    /* margin: 10px 10px; */
    border-radius: 20px;
    font-size: 1.4em;
    font-family: Actor-Regular;
    padding-left: 1em;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
input::placeholder {
   color: lightgray
}

h1 {
  margin-bottom: 1.5rem;
}

.mymodal-footer {
    display: flex;
    justify-content: center;
    align-items: center;


    margin-bottom: 1.0em;
    padding-top: 1.0em;

    /* font-size: 1.8em; */
    border: 0px solid;
    border-top-width: 2px;

    border-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));
    border-image-slice: 1;

}

.error {
   animation-name: errorShake;
   animation-duration: 0.3s;
}

@keyframes errorShake {
   0% {
      transform: translateX(-25px);
   }
   25% {
      transform: translateX(25px);
   }
   50% {
      transform: translateX(-25px);
   }
   75% {
      transform: translateX(25px);
   }
   100% {
      transform: translateX(0);
   }
}


</style>