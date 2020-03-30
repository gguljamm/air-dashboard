<template>
  <div class="realTimeDashboard">
    <h4>실시간 스카이스캐너 대시보드</h4>
    <div>조회시간 기준으로 1G여행사 스카이스캐너 노출 데이터 대시보드</div>
    <div>실시간 데이터로 재조회 시 데이터 변경이 있을 수 있습니다.</div>
    <search-box
      @btnClick="btnClick"
      @submit="submit"
    ></search-box>
    <dashboard-content
      :allData="allData"
    ></dashboard-content>
    <b-modal v-model="modalShow" ok-only>
      <p>모든 조건을 채워주세요.</p>
    </b-modal>
    <loading-popup
      v-show="loading"
    ></loading-popup>
  </div>
</template>

<script>
  import SearchBox from '~/components/SearchBox/RealTime.vue';
  import DashboardContent from '~/components/Dashboarad/DashboardContent.vue';
  import LoadingPopup from '~/components/LoadingPopup.vue';

  export default {
    components: {
      SearchBox,
      DashboardContent,
      LoadingPopup,
    },
    data() {
      return {
        loading: false,
        modalShow: false,
        allData: {},
      };
    },
    methods: {
      submit(form) {
        if (Object.values(form).some(x => x === '')) {
          this.modalShow = true;
          return;
        }
        this.loading = true;
        this.allData = {};
        this.$apis.getLiveData(form).then((resp) => {
          this.loading = false;
          if (resp.data.status === 'Success') {
            this.allData = resp.data.message;
            this.$store.commit('setRecentSearchData', [form, this.allData]);
            // console.log(resp.data.message);
          } else {
            alert('정보를 불러오는데 실패했습니다. 이후 다시 시도해주세요.');
          }
        }).catch(() => {
          this.loading = false;
          alert('정보를 불러오는데 실패했습니다. 이후 다시 시도해주세요.');
        });
      },
      btnClick(flag) {
        if (flag) {
          this.allData = this.$store.state.recentSearch.data;
        } else {
          this.$store.commit('setRecentSearchData', [null, null]);
        }
      }
    },
    mounted() {},
  };
</script>

<style lang="scss">
  .realTimeDashboard{
  }
</style>
