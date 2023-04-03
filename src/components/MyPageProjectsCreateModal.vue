<template>
    <div class="modal">
      <div style="width:60%;">

        <h1>프로젝트 생성</h1>

      </div>
      
    </div>
</template>

<script>
// import $ from 'jquery';

export default{
  methods: {

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

  /* Black w/ opacity */
  /* background-color: rgba(0,0,0,0.9);  */
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