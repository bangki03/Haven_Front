import { createStore } from "vuex";

export default createStore({
  state: {
    account: {
      LoginActive: false,
      Email: "",
      Password: "",
      UserID: ""
    }
  },
  getters: {},
  mutations: {
    loadSessionStorageLogin(state) {
      if(sessionStorage.getItem("account") != "undefined" && sessionStorage.getItem("account") != "null" && sessionStorage.getItem("account") != null) {
        state.account = JSON.parse(sessionStorage.getItem("account"))
      }
    },
    saveSessionStorageLogin(state) {
      console.log(state.account)
      sessionStorage.setItem("account", JSON.stringify(state.account))
      console.log('saveLoginSession')
    },

    setLogin(state, account){
      state.account.LoginActive = true
      state.account.Email = account.Email
      state.account.Password = account.Password
    },
    setUserID(state, UserID) {
      state.account.UserID = UserID
    },

    setLogout(state){
      state.account.LoginActive = false,
      state.account.Email = "",
      state.account.Password = ""
    }
  },
  actions: {},
  modules: {},
});
