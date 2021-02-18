const user = {
  state: {
    user: {}
  },
  mutations: {
    SET_USER: (state, user) => {
      if (user !== undefined) {
        state.user = user;
        sessionStorage.setItem('user', JSON.stringify(user));
      }
    }
  },
  actions: {
    getUserInfo({ commit }) {
      commit('SET_USER', {});
    }
  }
};
export default user;
