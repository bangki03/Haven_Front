<template>
   <div class="mymodal-wrapper" @click="close_modal()">
      <div class="mymodal" @click.stop="do_nothing()">
         <div class="modal-contents">
            <div class="mymodal-header">프로젝트 생성</div>

            <div class="mymodal-main">
               <div class="item-key">프로젝트 이름</div>
               <div class="item-value">
                  <!-- <input v-model="project_info.project_name" class="form-control" placeholder="제품+검사+공정" required> -->
                  <input id="input_project_name" :value="project_info.project_name" @input="project_info.project_name = $event.target.value" @blur="saveInputValue" class="form-control" placeholder="제품+검사+공정" required>
               </div>

               <div class="item-key">공장</div>
               <div class="item-value">
                  <!-- <input v-model="project_info.factory_name" class="form-control" placeholder="공장명" required> -->
                  <input id="input_factory_name" :value="project_info.factory_name" @input="project_info.factory_name = $event.target.value" @blur="saveInputValue" class="form-control" placeholder="공장명" required>
               </div>

               <div class="item-key">제품</div>
               <div class="item-value">
                  <!-- <input v-model="project_info.product_name" class="form-control" placeholder="제품명" required> -->
                  <input id="input_product_name" :value="project_info.product_name" @input="project_info.product_name = $event.target.value" @blur="saveInputValue" class="form-control" placeholder="제품명" required>
               </div>

               <div class="item-key">검사</div>
               <div class="item-value">
                  <!-- <input v-model="project_info.process_name" class="form-control" placeholder="검사명" required> -->
                  <input id="input_process_name" :value="project_info.process_name" @input="project_info.process_name = $event.target.value" @blur="saveInputValue" class="form-control" placeholder="검사명" required>
               </div>

               <div class="item-key">공정</div>
               <div class="item-value">
                  <!-- <input v-model="project_info.operation_name" class="form-control" placeholder="공정명" required> -->
                  <input id="input_operation_name" :value="project_info.operation_name" @input="project_info.operation_name = $event.target.value" @blur="saveInputValue" class="form-control" placeholder="공정명" required>
               </div>

               <div class="item-key">프로젝트 타입</div>
               <div class="item-value" style="">
                  <div class="dropdown" ref="dropdownRef">
                     <button class="dropbtn" @click="handleDropBtn" :style="{ 'color' : selectedProjectTextColor }">{{ selectedProjectType }}</button>
                     <div class="dropdown-content" :style="{ display: showDropdownContent ? 'block' : 'none' }">
                        <a @click="selectProjectType('Classification')">Classification</a>
                        <a @click="selectProjectType('Detection')">Detection</a>
                        <a @click="selectProjectType('Segmentation')">Segmentation</a>
                     </div>
                  </div>
               </div>

               <div class="item-key">설명</div>
               <div class="item-value" style="grid-row: 8 / span 2; grid-column: 1 / span 2; display:flex; align-items: stretch; justify-items: stretch;">
                  <textarea v-model="project_info.project_script" style="width: 100%; height:8em; line-height:1.5em; border-radius: 20px; padding: 0.2em 1em;"></textarea>
                  <!-- <input v-model="project_info.project_script" type="text" style="width: 100%; height:4em; line-height:4em; border-radius: 20px;"> -->
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
import $ from 'jquery';
import axios from "axios";

export default{
   data() {
      return {
         showDropdownContent: false,
         selectedProjectType: '프로젝트 타입 선택',
         selectedProjectTextColor: '#D3D3D3',

         project_info: {
            project_name : "",
            product_name : "",
            process_name : "",
            operation_name : "",
            factory_name : "[고정]광주3공장",
            project_type : "",
            project_script : "",
         },
         emptyFields: false,
         Project_typelist : ["Classification", "Detection", "Segmentation"],

         API_List: null,
      }
   },

   computed: {
      // user_id() {
      //    return this.$store.state.account.user_id
      // },
   },

   methods: {
      saveInputValue(event){
         if(event.target.id == "input_project_name") {
            this.project_info.project_name = event.target.value
         }
         else if(event.target.id == "input_factory_name") {
            this.project_info.factory_name = event.target.value
         }
         else if(event.target.id == "input_product_name") {
            this.project_info.product_name = event.target.value
         }
         else if(event.target.id == "input_process_name") {
            this.project_info.process_name = event.target.value
         }
         else if(event.target.id == "input_operation_name") {
            this.project_info.operation_name = event.target.value
         }
      },
      handle_toggle() {
         this.post_register_project()

      },

      selectProjectType(type) {
         this.selectedProjectType = type;
         this.showDropdownContent = false;
         this.selectedProjectTextColor = 'black'

         this.project_info.project_type = this.selectedProjectType
      },

      handleDropBtn() {
         this.showDropdownContent = !this.showDropdownContent
      },
      handleDropdownContentClick(event) {
         event.stopPropagation(); // 클릭 이벤트 전파 중지
      },
      handleOutsideClick(event) {
         if (this.showDropdownContent && !this.$refs.dropdownRef.contains(event.target)) {
            this.showDropdownContent = false;
         }
      },

      close_modal() {
         this.$emit('closeModal')
      },
      do_nothing(){

      },
      select_projectType(event) {
         this.project_info.project_type = event.target.text;
         $("#dropdownMenuButton1").css('padding', 0)

      },

      post_register_project() {
         console.log(this.$store.state.account.User_ID)
         fetch(this.API_List.create_project, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            user_id: this.$store.state.account.UserID,
            project_name : this.project_info.project_name,
            product_name : this.project_info.product_name,
            process_name : this.project_info.process_name,
            // operation_name : this.project_info.operation_name,
            factory_name : this.project_info.factory_name,
            project_type : this.project_info.project_type,
            project_script : this.project_info.project_script,
         }),
         }).then( data => {
         if(data.status == '200'){
            alert("신규 프로젝트 생성되었습니다.");
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
   },
   mounted() {
      document.addEventListener("click", this.handleOutsideClick);
   },
   beforeUnmount() {
      document.removeEventListener("click", this.handleOutsideClick);
   },
}
</script>

<style scoped>
.dropdown {
   width: 100%;
   position: relative;
   display: inline-block;
}
.dropbtn {
   margin-bottom: 0px;
   border-radius: 20px;
   font-size: 1.4em;
   font-family: Actor-Regular;
   padding-left: 1em;

   color: lightgray;
   display: block;
   width: 100%;
   padding: 0.375rem 0.75rem;
   /* font-size: 1rem; */
   font-weight: 400;
   line-height: 1.5;
   text-align: start;
   padding-left: 1em;

   background-color: #fff;
   background-clip: padding-box;
   border: 1px solid #ced4da;

   appearance: none;

   transition: border-color .15s;

   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
   cursor: pointer;
}



.dropdown-content {
   width:100%;
  display: none;
  position: absolute;
  /* background-color: #f1f1f1; */
  background-color: white;
  border-radius: 20px;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 1;
}

.dropdown-content a {
  color: black;
  padding: 12px 16px;
  text-decoration: none;
  display: block;
}

.dropdown-content a:hover {background-color: #ddd; border-radius: 20px;}

.dropdown:hover .dropdown-content {display: block;}

/* .dropdown:hover .dropbtn {background-color: #3e8e41;} */
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
   display: block;
   width: 40vw;
   height: 78vh;
   left:30vw;
   top:10vh;
   position : fixed;

   border-radius: 0.5em;

   background-color: rgba(250,252,254,1);
   box-shadow: 0px 0px 1px 1px #dddddd;
}
.mymodal-header{
   margin-top: 0.5em;
   padding-bottom: 0.5em;

   display: flex;
   justify-content: center;
   font-size: 1.8em;
   border: 0px solid;
   border-bottom-width: 2px;

   border-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
   border-image-slice: 1;
}
.mymodal-main {
   padding: 1em 5em;
   display: grid;
   grid-template-columns: 2fr 5fr;
	grid-template-rows: repeat(9, minmax(60px, auto));
   column-gap: 1em;
   justify-content: center;
   /* 수직 가운데 정렬 */
   align-items: center;
}
.item-key {
   font-size: 1.6em;
}

textarea {
   border: 1px solid #ced4da;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
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

   border-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0));
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