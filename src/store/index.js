
import Vue from 'vue'
import Vuex from 'vuex'
import { resolve } from 'url';

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    loading: false,
    user: null,
    closedIssues: {
      title: null,
      avatarUrl: null,
      totalClosedIssues: null,
      users: null,
    },
    error: null,
  },

  mutations: {
    setLoading(state, payload) {
      state.loading = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    clearUser(state, payload) {
        state.user = null;
    },
    setTotalClosedIssues(state, payload) {
      state.closedIssues = {
        title: (payload.title) ? payload.title : state.closedIssues.title,
        avatarUrl: (payload.avatarUrl) ? payload.avatarUrl : state.closedIssues.avatarUrl,
        totalClosedIssues: (payload.totalClosedIssues) ? payload.totalClosedIssues : state.closedIssues.totalClosedIssues,
        users: (payload.users) ? payload.users : state.closedIssues.users,
      }
    },
    setError(state, payload) {
      state.error = payload;
    }
  },

  actions: {
    getClosedIssues({ commit, getters }, payload) {
      payload.userName = payload.userName.trim();
      payload.repositoryName = payload.repositoryName.trim();

      commit('setLoading', true);
      commit('setError', null);
      commit('clearUser', null);
      
      let title = `${payload.userName}/${payload.repositoryName}`;
      let usersArray = [];
      let totalClosedIssues;

      /**
       *
       *
       * @param {*} url
       * @returns record of users from api call,
       * for one call it will retrun 100 users.
       */
      function getIssues(url) {
        return new Promise((resolve, reject) => {
          return Vue.http.get(url).then(data => {
            let items = data.data.items;
            items.forEach(item => {
              usersArray.push(item.user.login);
            });
            resolve(usersArray);
          })
            .catch(error => {
              commit('setError', `Couldn't fetch data from server`);
              commit('setLoading', false);
              reject(`GitHub api call limit exceeded.Try after somtime.`);
          })
        })
      }

      /**
       *
       *
       * @param {*} url
       * @returns total number of issues closed.
       */
      function getTotalCount(url) {
        return new Promise((resolve, reject) => {
          return Vue.http.get(url).then(data => {
            let totalCount = data.data.total_count;
            totalClosedIssues = totalCount;
            if (totalClosedIssues === 0) reject(`This repository doesn't have any closed issues.`);
            resolve(totalCount);
          }).catch(error => {
            error = JSON.parse(JSON.stringify(error));
            if (error.response.status == 403)
              reject(`GitHub api call limit exceeded. Try after somtime.`); 
            reject(`username or repository name doesn't match`);
          })
        })
      }

      Promise.resolve()
        .then(() => getTotalCount(`search/issues?q=repo:${payload.userName}/${payload.repositoryName}+is:issue+is:closed&per_page=100`))
        .then(totalCount => {
          return new Promise((resolve, reject) => {
            let totalPages = (totalCount % 100 !== 0) ? (Math.floor(totalCount / 100)) + 1 : (totalCount / 100);
            let  totalIssues= [];
            for (let i = 0; i < totalPages; i++) {
              totalIssues.push(getIssues(`search/issues?q=repo:${payload.userName}/${payload.repositoryName}+is:issue+is:closed&per_page=100&page=${i + 1}`));
            }

            // returns the array of users involved in given issues. 
            return Promise.all(totalIssues).then(data => {
              resolve(data[0]);
            })
          })
        })
        .then(users => {
          let userIssuePair = {}
          users.forEach(data => { userIssuePair[data] = (userIssuePair[data] || 0) + 1; });
          let usersArr = [];
          for (var prop in userIssuePair) {
            usersArr.push({ name: prop, totalIssues: userIssuePair[prop]})
          }

          // get the user's avatar.
          Vue.http.get(`users/${payload.userName}`)
            .then(data => {
              data = data.data;
              issuePayload.avatarUrl = data.avatar_url;
              commit('setTotalClosedIssues', issuePayload);
             })
            .catch(error => {
              issuePayload.avatarUrl = '';
              commit('setTotalClosedIssues', issuePayload);
            });
          
          let issuePayload = {
            title: title,
            totalClosedIssues: totalClosedIssues,
            users: usersArr,
          };

          commit('setTotalClosedIssues', issuePayload);
          commit('setUser', payload.userName);
          commit('setLoading', false);
        })
        .catch(error => {
          commit('setError', error);
          commit('setLoading', false);
        });

    },

    clearUser({ commit }, payload) {
      commit('clearUser', payload);
    },

    clearError({ commit, getters }, payload) {
      commit('setError', null);
    },

  },

  getters: {
    user(state) {
      return state.user;
    },
    closedIssues(state) {
      return state.closedIssues;
    },
    loading(state) {
      return state.loading;
    },
    getError(state) {
      return state.error;
    }
  }
})