<template>
  <div class="savedDetailData">
    <h4>저장된 데이터 스카이스캐너 상세데이터</h4>
    <div>설정에 따라 저장된 데이터에 1G 여행사 스카이스캐너 노출 상세 데이터</div>
    <div>설정된 조건에 따라 AM00:00~05:00에 수집된 데이터입니다.</div>
    <search-box
      :savedDate="savedDate"
      :destinationList="destinationList"
      @btnClick="btnClick"
      @submit="submit"
      @getDestination="getDestination"
    ></search-box>
    <detail-data
      v-if="allData.detailItinerarydataList"
      :allData="allData"
    ></detail-data>
    <b-modal v-model="modalShow" ok-only>
      <p>모든 조건을 채워주세요.</p>
    </b-modal>
    <loading-popup
      v-show="loading"
    ></loading-popup>
  </div>
</template>

<script>
  import SearchBox from '~/components/SearchBox/SavedData.vue';
  import DetailData from '~/components/DetailData/DetailDataContent.vue';
  import LoadingPopup from '~/components/LoadingPopup.vue';

  export default {
    components: {
      SearchBox,
      DetailData,
      LoadingPopup,
    },
    data() {
      return {
        modalShow: false,
        allData: {},
        savedDate: [],
        destinationList: [],
        loading: false,
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
          } else {
            alert('정보를 불러오는데 실패했습니다. 이후 다시 시도해주세요.');
          }
        }).catch(() => {
          this.loading = false;
          alert('정보를 불러오는데 실패했습니다. 이후 다시 시도해주세요.');
        });
      },
      getDestination(form) {
        this.$apis.getCollectionDestination({
          collectionDate: form.collectionDate,
          originPlace: form.originPlace,
          continent: form.continent,
          stops: form.stops,
        }).then((resp) => {
          if (resp.data.status === 'Success') {
            this.destinationList = resp.data.message;
          } else {
            this.destinationList = [];
          }
        }).catch(() => {
          this.destinationList = [];
        });
      },
      btnClick(flag) {
        this.$bvModal.hide('bv-modal-example');
        if (flag) {
          this.allData = this.$store.state.recentSearch.data;
        } else {
          this.$store.commit('setRecentSearchData', [null, null]);
        }
      }
    },
    mounted() {
      this.$apis.getcollectionDate().then((resp) => {
        if (resp.data.status === 'Success') {
          this.savedDate = resp.data.message.map(v => {
            return {
              collectionDate: v.collectionDate.map(z => this.$format.zeros(z)).join('-'),
              outboundDate: v.outboundDate.map(z => this.$format.zeros(z)).join('-'),
              inboundDate: v.inboundDate.map(z => this.$format.zeros(z)).join('-'),
            };
          });
          // console.log(this.savedDate);
        } else {
          alert('저장된 데이터 일정을 불러오는데 실패했습니다. 다시 시도해주세요.');
        }
      }).catch(() => {
        alert('저장된 데이터 일정을 불러오는데 실패했습니다. 다시 시도해주세요.');
      });
    },
  }
</script>

<style>
  .savedDetailData{
  }
</style>
