<template>
    <div style="width:100%; height:100%; display: flex; flex-direction: column; justify-content: space-around; align-items: center; background-color: aqua;">
        <div style="width:98%; text-align: left;">
            여기는 AI 모델 학습 서비스입니다.
        </div>

        <div class="dard-container" style="width:98%; height:140px; display:flex; flex-direction: column; justify-content: flex-start;">
            <div class="dard-header"></div>
            <div class="dard-main" style="display:flex; flex-direction: row; align-items: center;">
                <div style="display:flex; flex-direction: column; align-items: flex-start; margin:0.5em 1.0em 0.5em 2.0em;">
                    <p class="column-header">최종 모델 학습 시작 시간</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">2023.01.05 09:22</p>
                </div>
                <div style="display:flex; flex-direction: column; align-items: flex-start; margin:0.5em 1.0em;">
                    <p class="column-header">최종 모델 학습 완료 시간</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">2023.01.05 12:31</p>
                </div>
                <div style="display:flex; flex-direction: column; align-items: center; margin:0.5em 1.0em;">
                    <p class="column-header">신규 학습 가능 OK 데이터 수</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">000</p>
                </div>
                <div style="display:flex; flex-direction: column; align-items: center; margin:0.5em 1.0em;">
                    <p class="column-header">신규 학습 가능 NG 데이터 수</p>
                    <p style="font-family: Poppins-SemiBold; font-size:1.5rem; margin-bottom:0;">000</p>
                </div>
                <div id="btn-deploy" style="margin-left: auto; margin-right: 3.0em;">
                    신규 모델 학습
                </div>
            </div>
        </div>

        <div class="dard-container" style="width:98%; height:700px; display:flex; flex-direction: column; justify-content: flex-start;">
            <div class="dard-header"></div>
            <div class="dard-main" style="display:flex; flex-direction: column; align-items: flex-start;">

            </div>
        </div>



    </div>
</template>

<script>

export default{
    data() {
        return {

        }
    },
    methods: {

    },

    mounted() {

    },
}

</script>

<style>
.dard-header {
    width: 100%;
    height: 40px;

    background-color: #BD7C4A;

    border-top-right-radius: 1em;
    border-top-left-radius: 1em;
}
.dard-main {
    width: 100%;
    height: calc(inherit - 40px);

    background-color: white;

    border-bottom-left-radius: 1em;
    border-bottom-right-radius: 1em;
}
.column-header {
    color: #6E738A;
    font-family:'Poppins-Semibold';
    font-size: 0.75rem;
    margin-bottom: 0;
}
#btn-deploy {
  color: #2777E4;
  background-color: #F0F0F5;
  border-color: #D2E7FF;
  cursor: pointer;

  display: inline-block;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  border: 1px solid transparent;

  margin: 0 0.25rem;
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
  line-height: 1.5;
  border-radius: 1.0rem;

  font-family:'NotoSansKR-Light';
  font-weight: bold;
}
</style>