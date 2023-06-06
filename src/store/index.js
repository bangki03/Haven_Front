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
    menu: {
      index: 0,
    },
    undo: [],
  },
  getters: {},
  mutations: {
    //// Login 정보 ////
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

    //// Project 정보 ////
    loadSessionStorageProject(state) {
      if(sessionStorage.getItem("project") != "undefined" && sessionStorage.getItem("project") != "null" && sessionStorage.getItem("project") != null) {
        state.project = JSON.parse(sessionStorage.getItem("project"))
      }
    },
    saveSessionStorageProject(state) {
      sessionStorage.setItem("project", JSON.stringify(state.project))
      
      console.log('#### store - saveProjectSession')
      console.log(state.project)
      console.log("############################")
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

    //// Page 정보 ////
    loadSessionStorageMenu(state) {
      if(sessionStorage.getItem("indexMenu") != "undefined" && sessionStorage.getItem("indexMenu") != "null" && sessionStorage.getItem("indexMenu") != null) {
        console.log("loadSessionStorageMenu")
        state.menu = JSON.parse(sessionStorage.getItem("indexMenu"))
      }
    },
    saveSessionStorageMenu(state) {
      sessionStorage.setItem("indexMenu", JSON.stringify(state.menu))
      console.log("saveSessionStorageMenu")
    },
    
    setMenu(state, index) {
      state.menu.index = index

      console.log("#### store - setMenu ####")
      console.log(index)
      console.log("############################")
    },


    addUndo(state, action) {
      state.undo.push(action);
    },

  },
  actions: {},
  modules: {},
});
