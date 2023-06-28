<template>
    <div class="row">
        <div class="col-" style="width:200px;">
            <div class="d-flex flex-column align-items-stretch flex-shrink-0 px-3 py-1" style="width: 200px; height:100vh; background-color: #BD7C4A;">
                <a href="/mypage" class="d-flex align-items-center pb-1 mb-3 link-dark text-decoration-none border-bottom">
                <!-- <svg class="bi me-2" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>
                <span class="fs-5 fw-semibold">Collapsible</span> -->
                <img
                    id="Logo"
                    src="../assets/Login_Logo.png"
                    alt="../assets/Login_Logo.png"

                    style="height: 58.9px; width: 176px; padding: 0;"
                />
                </a>
                <ul class="list-unstyled ps-0">
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded" data-bs-toggle="collapse" data-bs-target="#home-collapse" aria-expanded="true">
                    품질 현황
                    </button>
                    <div class="collapse" id="home-collapse" style="">
                    <!-- <div class="collapse show" id="home-collapse" style=""> -->
                    <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="#" class="link-dark rounded">Overview</a></li>
                        <li><a href="#" class="link-dark rounded">Updates</a></li>
                        <li><a href="#" class="link-dark rounded">Reports</a></li>
                    </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#dashboard-collapse" aria-expanded="false">
                    실시간 품질 검사
                    </button>
                    <div class="collapse" id="dashboard-collapse">
                    <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="#" class="link-dark rounded">Overview</a></li>
                        <li><a href="#" class="link-dark rounded">Weekly</a></li>
                        <li><a href="#" class="link-dark rounded">Monthly</a></li>
                        <li><a href="#" class="link-dark rounded">Annually</a></li>
                    </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#orders-collapse" aria-expanded="false">
                    AI 품질 개선
                    </button>
                    <div class="collapse" id="orders-collapse">
                    <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="#" class="link-dark rounded">데이터 라벨링</a></li>
                        <li><a href="#" class="link-dark rounded">AI 모델 학습</a></li>
                        <li><a href="#" class="link-dark rounded">AI 모델 배포</a></li>
                    </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#account-collapse" aria-expanded="false">
                    과거 데이터 조회
                    </button>
                    <div class="collapse" id="account-collapse">
                    <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="#" class="link-dark rounded">New...</a></li>
                        <li><a href="#" class="link-dark rounded">Profile</a></li>
                        <li><a href="#" class="link-dark rounded">Settings</a></li>
                        <li><a href="#" class="link-dark rounded">Sign out</a></li>
                    </ul>
                    </div>
                </li>
                <li class="border-top my-3"></li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#a2-collapse" aria-expanded="false">
                    문의하기
                    </button>
                    <div class="collapse" id="a2-collapse">
                    <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="#" class="link-dark rounded">New...</a></li>
                        <li><a href="#" class="link-dark rounded">Profile</a></li>
                        <li><a href="#" class="link-dark rounded">Settings</a></li>
                        <li><a href="#" class="link-dark rounded">Sign out</a></li>
                    </ul>
                    </div>
                </li>
                <li class="mb-1">
                    <button class="btn btn-toggle align-items-center rounded collapsed" data-bs-toggle="collapse" data-bs-target="#a3-collapse" aria-expanded="false">
                    도움말
                    </button>
                    <div class="collapse" id="a3-collapse">
                    <ul class="btn-toggle-nav list-unstyled fw-normal pb-1 small">
                        <li><a href="#" class="link-dark rounded">New...</a></li>
                        <li><a href="#" class="link-dark rounded">Profile</a></li>
                        <li><a href="#" class="link-dark rounded">Settings</a></li>
                        <li><a href="#" class="link-dark rounded">Sign out</a></li>
                    </ul>
                    </div>
                </li>
                </ul>
            </div>
        </div>
        <div class="col">
            <div class="d-flex flex-row border-bottom" style="height:70px;">

                <p style="display:inline; margin-left: auto; margin-bottom:auto; margin-top:auto;" @click="Logout">광주제3공장blahbla</p>

                <p style="display:inline; margin-left: 15px; margin-bottom:auto; margin-top:auto;" @click="Logout">로그아웃</p>
                <img
                    id="Logo"
                    src="../assets/LogOut.png"
                    alt="../assets/LogOut.png"
                    style="height: 15px; width: 15px; padding: 0; margin-bottom: auto; margin-top: auto;" @click="Logout"
                />
            </div>
        </div>
    </div>



</template>