<template>
    <div class="modal">
      <div style="width:60%;">

        <div v-if="!registerActive" class="login" v-bind:class="{ error: emptyFields }">
        <h1>Sign In</h1>
        <form class="form-group" @submit.prevent="doLogin">
          <input v-model="account.email" type="email" class="form-control" placeholder="Email" required>
          <input v-model="account.password" type="password" class="form-control" placeholder="Password" required>
          <input type="submit" class="btn btn-primary" @click="doLogin">

          <p>Don't have an account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Sign up here</a>
          </p>
          <p><a href="#">Forgot your password?</a></p>
        </form>
      </div>

      <div v-else class="register" v-bind:class="{ error: emptyFields }">
        <h1>Sign Up</h1>
        <form class="form-group">
          <input v-model="emailReg" type="email" class="form-control" placeholder="Email" required>
          <input v-model="passwordReg" type="password" class="form-control" placeholder="Password" required>
          <input v-model="confirmReg" type="password" class="form-control" placeholder="Confirm Password" required>
          <input type="submit" class="btn btn-primary" @click="doRegister">

          <p>Already have an account? <a href="#" @click="registerActive = !registerActive, emptyFields = false">Sign in here</a>
          </p>
        </form>
      </div>
      
      </div>
      


    </div>
</template>

<script>
import $ from 'jquery';

export default{
  // props: [account],
  data() {
    return {
      registerActive: false,
      account: {
        email: "",
        password: "",
      },
      emailLogin: "",
      passwordLogin: "",
      emailReg: "",
      passwordReg: "",
      confirmReg: "",
      emptyFields: false
    }
  },
  methods: {
    doLogin() {
        if (this.account.email === "" || this.account.password === "") {
            this.emptyFields = true;
        } 
        else {          
          this.get_Login()

        }
      },
      
    doRegister() {
        if (this.emailReg === "" || this.passwordReg === "" || this.confirmReg === "") {
          this.emptyFields = true;
        } else {
          alert("You are now registered");
        }
    },


    //  API 내놔~
    get_Login() {
      $.ajax({
          url: "http://183.105.120.175:30004/user/login", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
          method: "GET",   // HTTP 요청 메소드(GET, POST 등)
          dataType: "json", // 서버에서 보내줄 데이터의 타입
          data: {
              email: this.account.email,
              password: this.account.password,
          },  // HTTP 요청과 함께 서버로 보낼 데이터
      })
      .then( data => {
          if(data.code == '200' && data.message=='login success'){
            this.$router.push('/mypage')
          }
          else {
            alert('Login Failed')
          }
      })
    },


    // post_account_login() {
    //   fetch(this.API_List.robot_stop_sklee, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   }).then((response) => console.log(response));
    // },

    // put_deployed(item) {
    //   fetch(this.API_List.ai_model_deploy + String(item.id), {
    //       method: "PUT",   // HTTP 요청 메소드(GET, POST 등)
    //       headers: {"Content-Type": "application/json"},
    //       body: JSON.stringify({
    //           ckpt_file_path: item.FilePath,
    //           score: item.Score,
    //           deploy_status: "deployed",
    //           create_time: item.CreateTime_origin,
    //           }), //전송 데이터
    //   })
    // },

    // get_AIModelList() {
    //   $.ajax({
    //       //quality-improvement?page=1&size=50
    //       url: this.API_List.quality_improvement, // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
    //       method: "GET",   // HTTP 요청 메소드(GET, POST 등)
    //       dataType: "json", // 서버에서 보내줄 데이터의 타입
    //       data: {
    //           page: (this.pagination.num_start-1)/this.pagination.size + 1,
    //           size: this.pagination.size,
    //       },  // HTTP 요청과 함께 서버로 보낼 데이터
    //   })
    //   .then( (data, res) => {
    //       this.AIModelList = this.Format_AIModelList(data.items)
    //       this.AIModelList.total = data.total
    //       this.check_Previous_State()
    //       this.check_Next_State()
    //   })
    // },

  }
}
</script>

<style scoped>
.modal {
  display: flex;
  /* 그럼 얘는 머지? */
  justify-content: center;
  /* 수직 가운데 정렬 */
  align-items: center;  
  position : fixed;
  width: 40vw;
  height: 80vh;
  left:30vw;
  top:10vh;
  border-radius: 0.5em;

  background-color: white;
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