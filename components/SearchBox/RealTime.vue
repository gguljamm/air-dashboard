<template>
  <section class="rtinputWrapper">
    <b-form inline>
      <div>
        <label class="mr-sm-2" for="input-1">출발공항코드</label>
        <b-form-input
          id="input-1"
          v-model="form.originPlace"
          type="text"
          required
          placeholder="ex) ICN"
        ></b-form-input>
      </div>
      <div>
        <label class="mr-sm-2" for="input-2">도착지역</label>
        <b-form-select id="input-2" v-model="form.continent" :options="states"></b-form-select>
      </div>
      <div>
        <label class="mr-sm-2" for="input-3">도착공항코드</label>
        <b-form-input
          id="input-3"
          v-model="form.destinationPlace"
          type="text"
          required
          placeholder="ex) ICN"
        ></b-form-input>
      </div>
      <div class="dateBox">
        <label class="mr-sm-2" for="input-4">출발일</label>
        <b-form-datepicker
          id="input-4"
          v-model="form.outboundDate"
          :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
          :min="min"
          aria-required="true"
          placeholder="YYYY-MM-DD"
        ></b-form-datepicker>
      </div>
      <div class="dateBox">
        <label class="mr-sm-2" for="input-5">귀국일</label>
        <b-form-datepicker
          id="input-5"
          v-model="form.inboundDate"
          :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
          :min="inboundMin"
          aria-required="true"
          placeholder="YYYY-MM-DD"
        ></b-form-datepicker>
      </div>
      <div>
        <label class="mr-sm-2" for="input-6">좌석등급</label>
        <b-form-select id="input-6" v-model="form.cabinClass" :options="cabinClass"></b-form-select>
      </div>
      <div>
        <label class="mr-sm-2" for="input-7">경유</label>
        <b-form-checkbox v-model="form.isDirect" id="input-7" class="mb-2 mr-sm-2 mb-sm-0">직항만</b-form-checkbox>
      </div>
      <div>
        <b-button @click="$emit('submit', Object.assign({}, form))" variant="primary">조회</b-button>
      </div>
    </b-form>
    <b-modal id="bv-modal-example" hide-footer>
      <div class="d-block text-center">
        <h5 style="padding: 20px 0;">조회 하신 조건과 동일조건으로 조회합니다.</h5>
      </div>
      <footer id="modal-no-backdrop___BV_modal_footer_" class="modal-footer">
        <button type="button" class="btn btn-primary" @click="btnClick(true)">확인</button>
        <button type="button" class="btn btn-secondary" @click="btnClick(false)">조회조건 초기화</button>
      </footer>
    </b-modal>
  </section>
</template>

<script>
  export default {
    data() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      return {
        min: today,
        form: {
          originPlace: 'ICN',
          continent: 'AMERICAS',
          destinationPlace: '',
          outboundDate: '', // YYYY-MM-DD
          inboundDate: '', // YYYY-MM-DD
          cabinClass: 'ECONOMY',
          isDirect: false,
        },
        cabinClass: [
          { value: 'ECONOMY', text: '일반석' },
          { value: 'PREMIUMECONOMY', text: '프리미엄일반석' },
          { value: 'BUSINESS', text: '비즈니스석' },
          { value: 'FIRST', text: '일등석' },
        ],
        states: [
          { value: 'AMERICAS', text: '미주' },
          { value: 'EUROPE', text: '유럽' },
          { value: 'JAPAN', text: '일본' },
          { value: 'CHINA', text: '중국' },
          { value: 'SOUTHEASTASIA', text: '동남아' },
          { value: 'OCEANIA', text: '대양주' },
          { value: 'MIDDLEEASTASIA', text: '중동/아프리카' }
        ],
      };
    },
    computed: {
      inboundMin() {
        return this.form.outboundDate ? new Date(this.form.outboundDate) : this.min;
      },
    },
    methods: {
      btnClick(flag) {
        this.$bvModal.hide('bv-modal-example');
        if (flag) {
          Object.keys(this.form).forEach(key => {
            this.form[key] = this.$store.state.recentSearch.form[key] || '';
          })
        }
        this.$emit('btnClick', flag);
      }
    },
    mounted() {
      const path = this.$route.path === '/' ? '/RealTimeDetailData' : '/';
      if (this.$store.state.recentSearch.lastPage === path && this.$store.state.recentSearch.data) {
        this.$bvModal.show('bv-modal-example');
      } else {
        this.$store.commit('setRecentSearchData', [null, null]);
      }
      this.$store.commit('setRecentSearchPage', this.$route.path);
    },
  };
</script>

<style lang="scss">
  .rtinputWrapper{
    .form-inline{
      padding-top: 30px;
      padding-bottom: 40px;
      border-bottom: 1px solid #999;
      > div {
        width: 120px;
        padding-right: 10px;
        padding-top: 10px;
        &.dateBox{
          width: 180px;
          .text-muted{
            color: #ddd !important;
          }
          .b-form-datepicker{
            height: 38px !important;
          }
        }
        > label {
          text-align: left;
          justify-content: left;
          font-size: 12px;
          margin-bottom: 4px;
          line-height: 18px;
        }
        > input, > select, > button{
          width: 100% !important;
        }
        > button{
          margin-top: 18px;
        }
        .custom-checkbox{
          height: 38px;
          padding-top: 6px;
          padding-bottom: 6px;
        }
        &:last-child{
          padding-right: 0;
        }
        .custom-control-label{
          justify-content: left;
        }
      }
    }
  }
  .form-control.h-auto.text-center.p-0.mb-0{
    width: 100%;
  }
</style>
