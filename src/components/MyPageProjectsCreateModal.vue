<template>
   <div class = "modal-wrapper" @click="close_modal()">
      <div class="modal" @click.stop="do_nothing()">
      <div class="row" style="display:flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; width:100%; margin:0; border-radius: 0.5em; border: 1px dotted grey;">
         <h1>프로젝트 생성</h1>
         <form class="form-group" @submit.prevent="dosubmit">

            <div class="row" >
               <div class="col-5" style=" display: flex; flex-direction: column; justify-content: center;">
                  <h4 style="margin-bottom: 0; line-height: 150%">프로젝트 이름</h4>
               </div>
               <div class="col-7" style="">
                  <input v-model="project_info.project_name" class="form-control" style="margin-bottom: 0;" placeholder="제품+검사+공정" required>
               </div>
            </div>

            <div class="row" style="height:2%"></div>

            <div class="row" >
               <div class="col-5" style=" display: flex; flex-direction: column; justify-content: center;">
                  <h4 style="margin-bottom: 0; line-height: 150%">공장</h4>
               </div>
               <div class="col-7" style="">
                  <input v-model="project_info.factory_name" class="form-control" style="margin-bottom: 0;" placeholder="공장명" required>
               </div>
            </div>

            <div class="row" style="height:2%"></div>

            <div class="row" >
               <div class="col-5" style=" display: flex; flex-direction: column; justify-content: center;">
                  <h4 style="margin-bottom: 0; line-height: 150%">제품</h4>
               </div>
               <div class="col-7" style="">
                  <input v-model="project_info.product_name" class="form-control" style="margin-bottom: 0;" placeholder="제품명" required>
               </div>
            </div>

            <div class="row" style="height:2%"></div>

            <div class="row" >
               <div class="col-5" style=" display: flex; flex-direction: column; justify-content: center;">
                  <h4 style="margin-bottom: 0; line-height: 150%">검사</h4>
               </div>
               <div class="col-7" style="">
                  <input v-model="project_info.process_name" class="form-control" style="margin-bottom: 0;" placeholder="검사명" required>
               </div>
            </div>

            <div class="row" style="height:2%"></div>

            <div class="row" >
               <div class="col-5" style=" display: flex; flex-direction: column; justify-content: center;">
                  <h4 style="margin-bottom: 0; line-height: 150%">공정</h4>
               </div>
               <div class="col-7" style="">
                  <input v-model="project_info.operation_name" class="form-control" style="margin-bottom: 0;" placeholder="공정명" required>
               </div>
            </div>

            <div class="row" style="height:2%"></div>

            <div class="row" >
               <div class="col-5" style=" display: flex; flex-direction: column; justify-content: center;">
                  <h4 style="margin-bottom: 0; line-height: 150%">프로젝트 타입</h4>
               </div>
               <div class="col-7" style="">
                  <!-- <input v-model="project_info.project_type" class="form-control" style="margin-bottom: 0;" placeholder="프로젝트 타입" required> -->

                  <div class="dropdown text-left form-control custom-select-sm w-100" >
                     <button
                        class="btn text-primary text-left w-100 h-100 dropdown-item-cover text-truncate"
                        type="button"
                        id="dropdownMenuButton1"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="margin: 0 0; display: inline; padding: auto;"
                     >
                        {{ this.project_info.project_type }}
                     </button>
                     <ul class="dropdown-menu w-100" aria-labelledby="dropdownMenuButton1">
                        <a v-for="item in this.Project_typelist" :key="item" :value="item" class="dropdown-item p-10" herf="#" @click="select_projectType"
                        style="padding:0;">{{ item }}</a>
                     </ul>
                  </div>
               </div>
            </div>

            <div class="row" style="height:2%"></div>

            <div class="row" >
               <div class="col-5" style=" display: flex; flex-direction: column; justify-content: center;">
                  <h4 style="margin-bottom: 0; line-height: 150%">설명</h4>
               </div>
               <div class="col-7" style=""></div>
            </div>
            <div class="row" style="height:20%;">
               <div class="col-12">
                  <textarea v-model="project_info.project_script" style="width: 100%; height:100%;"></textarea>
               </div>
            </div>


            <div class="row" style="height:2%"></div>

            <input type="submit" class="btn btn-primary" @click="handle_toggle">

         </form>



         <!-- <button @click="handle_toggle" type="button">OK</button> -->
      </div>

    </div>

   </div>
    
</template>

<script>
import $ from 'jquery';


export default{
   data() {
      return {
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
         Project_typelist : ["Classification", "Detection", "Segmentation"]
      }
   },

   computed: {
      // user_id() {
      //    return this.$store.state.account.user_id
      // }, 
   },

   methods: {
      handle_toggle() {
         this.post_register_account()
         
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

      post_register_account() {
         console.log(this.$store.state.account.User_ID)
         fetch("http://183.105.120.175:30004/project", {
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
   }
}
</script>

<style scoped>
.modal-wrapper {
   position: fixed;
   width: 100vw;
   height: 100vh;
   left:0vw;
   top:0vh;
   background-color: rgba(250,252,254,0.7);
   /* background-color: #000000; */
}
.modal {
  display: flex;
  /* 그럼 얘는 머지? */
  justify-content: center;
  /* 수직 가운데 정렬 */
  align-items: center;
  position : fixed;
  width: 50vw;
  height: 80vh;
  left:25vw;
  top:10vh;
  border-radius: 0.5em;

  /* Black w/ opacity */
  background-color: rgba(250,252,254,0.9);
  box-shadow: 0px 0px 1px 1px #dddddd;
}

p {
   line-height: 1rem;
}

input {
    margin-bottom: 20px;
    /* margin: 10px 10px; */
}

.btn {
  width: 25%;
}


h1 {
  margin-bottom: 1.5rem;
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