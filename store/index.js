/* eslint-disable */
export const state = () => ({
  recentSearch: {
    lastPage: '/',
    data: null,
    form: null,
  },
});

export const mutations = {
  setRecentSearchData(state, data) {
    state.recentSearch.form = data[0];
    state.recentSearch.data = data[1];
  },
  setRecentSearchPage(state, lastPage) {
    state.recentSearch.lastPage = lastPage;
  },
};
