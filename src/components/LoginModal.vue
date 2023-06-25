<template>
    <div class="modal">
      <div style="width:60%;">

        <div v-if="!registerActive" class="login" v-bind:class="{ error: emptyFields }">
        <h1 style="color: #BD7C4A">로그인</h1>
        <form class="form-group" @submit.prevent="doLogin">
          <input id="login_id" :value="prop_account.Email" @input="prop_account.Email = $event.target.value" type="email" @blur="saveInputValue" class="form-control" placeholder="이메일" required>
          <input id="login_password" :value="prop_account.Password" @input="prop_account.Password = $event.target.value" @blur="saveInputValue" type="password" class="form-control" placeholder="비밀번호" required>
          <input type="submit" class="btn" value="로그인" style="background-color: #BD7C4A; color:white;">

          <p><a href="#" @click="registerActive = !registerActive, emptyFields = false">회원가입</a>
          </p>
        </form>
      </div>

      <div v-else class="register" v-bind:class="{ error: emptyFields }">
        <h1 style="color: #BD7C4A">회원가입</h1>
        <form class="form-group" @submit.prevent="doRegister">
        <!-- <form class="form-group"> -->
          <input id="register_id" :value="prop_account.Email" @input="prop_account.Email = $event.target.value" @blur="saveInputValue" type="email" class="form-control" placeholder="이메일" required>
          <input id="register_name" :value="prop_account.Name" @input="prop_account.EmaNameil = $event.target.value" @blur="saveInputValue" type="name" class="form-control" placeholder="이름" required>
          <input id="register_password" :value="prop_account.Password" @input="prop_account.Password = $event.target.value" @blur="saveInputValue" type="password" class="form-control" placeholder="비밀번호" required>
          <input id="register_passwordconfirm" :value="prop_account.Password_confirm" @input="prop_account.Password_confirm = $event.target.value" @blur="saveInputValue" type="password" class="form-control" placeholder="비밀번호 확인" required>
          <input id="register_phonenNo" :value="prop_account.PhoneNumber" @input="prop_account.PhoneNumber = $event.target.value" @blur="saveInputValue" type="tel" class="form-control" placeholder="휴대폰 번호(010-OOOO-OOOO)" required>
          <!-- <input type="submit" class="btn btn-primary" @click="doRegister"> -->
          <input type="submit" class="btn" value="가입하기" style="background-color: #BD7C4A; color:white;">

          <p>계정이 이미 있으시다면? <a href="#" @click="registerActive = !registerActive, emptyFields = false">로그인</a>
          </p>
        </form>
      </div>

      </div>



    </div>
</template>

<script>
import $ from 'jquery';

export default{
  props: ['account'],
  data() {
    return {
      registerActive: false,
      prop_account: {
        Email : "",
        Password : "",
        LoginActive : false,
      },
      reg_account: {
        Email : "",
        Name : "",
        Password : "",
        Password_confirm : "",
        PhoneNumber : "",
      },
      emptyFields: false
    }
  },
  computed: {
  },
  methods: {
    saveInputValue(event){
      if(event.target.id == "login_id") {
        this.prop_account.Email = event.target.value
      }
      else if(event.target.id == "login_password") {
        this.prop_account.Password = event.target.value
      }
      else if(event.target.id == "register_id") {
        this.prop_account.Email = event.target.value
      }
      else if(event.target.id == "register_name") {
        this.prop_account.Name = event.target.value
      }
      else if(event.target.id == "register_password") {
        this.prop_account.Password = event.target.value
      }
      else if(event.target.id == "register_passwordconfirm") {
        this.prop_account.Password_confirm = event.target.value
      }
      else if(event.target.id == "register_phonenNo") {
        this.prop_account.PhoneNumber = event.target.value
      }

    },
    doLogin() {
        if (this.prop_account.email === "" || this.prop_account.password === "") {
            this.emptyFields = true;
        }
        else {
          this.get_Login()
        }
      },

    doRegister() {
        if (this.reg_account.Email === "" || this.reg_account.Name === "" || this.reg_account.Password === "" || this.reg_account.Password_confirm === "" || this.reg_account.PhoneNumber === "") {
          this.emptyFields = true;
        } else {
          this.post_register_account()
        }
    },

    // setLogin() {
    //   this.prop_account.LoginActive = true;
    //   this.$emit('setLogin', this.prop_account);
    // },

    //  API 내놔~
    get_Login() {
      $.ajax({
          url: "http://183.105.120.175:30004/user/login", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
          method: "GET",   // HTTP 요청 메소드(GET, POST 등)
          dataType: "json", // 서버에서 보내줄 데이터의 타입
          data: {
              email: this.prop_account.Email,
              password: this.prop_account.Password,
          },  // HTTP 요청과 함께 서버로 보낼 데이터
      })
      .then( data => {
          if(data.code == '200' && data.message=='login success'){
            this.get_UserID()

          }
          else {
            alert('Login Failed')
          }
      })
    },

    get_UserID() {
      $.ajax({
          url: "http://183.105.120.175:30004/user", // 클라이언트가 HTTP 요청을 보낼 서버의 URL 주소
          method: "GET",   // HTTP 요청 메소드(GET, POST 등)
          dataType: "json", // 서버에서 보내줄 데이터의 타입
          data: {
              user_email: this.prop_account.Email,
          },  // HTTP 요청과 함께 서버로 보낼 데이터
      })
      .then( data => {
        this.$store.commit("setLogin", this.prop_account);
        this.$store.commit("setUserID", data)
        this.$store.commit("saveSessionStorageLogin")
        console.log("Login")
        this.$router.push('/mypage')
      })
    },


    post_register_account() {
      fetch("http://183.105.120.175:30004/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: this.reg_account.Email,
          password: this.reg_account.Password,
          name: this.reg_account.Name,
          phone_number: this.reg_account.PhoneNumber,
        }),
      }).then( data => {
        if(data.status == '200'){
          alert("회원 가입 되었습니다. 다시 로그인 해주세요!");
          this.$router.go();
        }
      });

    },

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