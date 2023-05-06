import { createStore } from "vuex";

export default createStore({
  state: {
    account: {
      LoginActive: false,
      Email: "",
      Password: "",
      Name: "",
      UserID: ""
    },
    project: {
      id: 0,
      project_name: "",
      factory_name: "",
      product_name: "",
      project_type: "",
    },
    undo: [],
  },
  getters: {},
  mutations: {
    loadSessionStorageLogin(state) {
      if(sessionStorage.getItem("account") != "undefined" && sessionStorage.getItem("account") != "null" && sessionStorage.getItem("account") != null) {
        state.account = JSON.parse(sessionStorage.getItem("account"))
      }
    },
    saveSessionStorageLogin(state) {
      sessionStorage.setItem("account", JSON.stringify(state.account))
      
      console.log('#### store - saveLoginSession')
      console.log(state.account)
      console.log("############################")
    },

    setLogin(state, account){
      state.account.LoginActive = true
      state.account.Email = account.Email
      state.account.Password = account.Password
    },
    setUserID(state, account) {
      state.account.UserID = account.id
      state.account.Name = account.name
    },
    setLogout(state){
      state.account.LoginActive = false,
      state.account.Email = "",
      state.account.Password = ""
      state.account.UserID = ""

      sessionStorage.removeItem("account");
    },

    setProject(state, data) {
      state.project.id = data.id
      state.project.project_name = data.project_name
      state.project.factory_name = data.factory_name
      state.project.product_name = data.product_name
      state.project.project_type = data.project_type

      console.log("#### store - setProject ####")
      console.log(data)
      console.log("id : " + state.project.id)
      console.log("project_name : " + state.project.project_name)
      console.log("############################")
    },





    addUndo(state, action) {
      state.undo.push(action);
    },

  },
  actions: {},
  modules: {},
});
