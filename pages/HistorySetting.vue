<template>
  <div class="historySetting">
    <h4>데이터 수집 이력</h4>
    <div>수집된 데이터 현황을 확인할 수 있습니다.</div>
    <div class="saveBtn" v-if="settingData"><div>
      <b-button @click="submit()" variant="primary">저장</b-button>
    </div></div>
    <div class="content" v-if="settingData">
      <label>수집 제외 항공사</label>
      <b-input-group>
        <b-form-input
          placeholder="D7,XJ,Z2"
          v-model="carrierInput"
        ></b-form-input>
        <b-input-group-append>
          <b-button @click="carrierAdd()" size="sm" text="Button" variant="success" style="width: 120px">추가</b-button>
        </b-input-group-append>
      </b-input-group>
      <label>제외 리스트</label>
      <ul class="exCarrier">
        <li v-for="x in settingData.excludedCarrier">{{ x }}<b-button-close @click="carrierPop(x)"></b-button-close></li>
      </ul>
      <div class="etcBox">
        <div class="cabinClass">
          <label>좌석등급</label>
          <ul>
            <li :class="settingData.cabinClass.indexOf('ECONOMY') >= 0 ? 'selected' : ''" @click="setClass('ECONOMY')">일반석</li>
            <li :class="settingData.cabinClass.indexOf('PREMIUMECONOMY') >= 0 ? 'selected' : ''" @click="setClass('PREMIUMECONOMY')">프리미엄 일반석</li>
            <li :class="settingData.cabinClass.indexOf('BUSINESS') >= 0 ? 'selected' : ''" @click="setClass('BUSINESS')">비즈니스</li>
            <li :class="settingData.cabinClass.indexOf('FIRST') >= 0 ? 'selected' : ''" @click="setClass('FIRST')">일등석</li>
          </ul>
        </div>
        <div class="startTime">
          <label>데이터 수집 시작시간</label>
          <b-select v-model="settingData.collectionTime" :options="timeList"></b-select>
        </div>
        <div class="interval">
          <label>데이터 수집 시간간격(초)</label><br>
          <b-input-group append="초" style="width: 120px;">
            <b-form-input type="number" v-model="settingData.intervalFrom"></b-form-input>
          </b-input-group>
          <div>~</div>
          <b-input-group append="초" style="width: 120px;">
            <b-form-input type="number" v-model="settingData.intervalTo"></b-form-input>
          </b-input-group>
        </div>
      </div>
      <div class="region">
        <label>지역</label>
        <div class="regionSelector">
          <div :class="{ selected: selectedRegion === 'europe' }" @click="selectedRegion = 'europe'">유럽</div>
          <div :class="{ selected: selectedRegion === 'americas' }" @click="selectedRegion = 'americas'">미주</div>
          <div :class="{ selected: selectedRegion === 'southeastAsia' }" @click="selectedRegion = 'southeastAsia'">동남아</div>
          <div :class="{ selected: selectedRegion === 'japan' }" @click="selectedRegion = 'japan'">일본</div>
          <div :class="{ selected: selectedRegion === 'china' }" @click="selectedRegion = 'china'">중국</div>
          <div :class="{ selected: selectedRegion === 'oceania' }" @click="selectedRegion = 'oceania'">대양주</div>
          <div :class="{ selected: selectedRegion === 'middleEastAsia' }" @click="selectedRegion = 'middleEastAsia'">중동/아프리카</div>
        </div>
        <div class="regionContent">
          <div>
            <div>
              <label>출국일/귀국일</label>
              <div>
                <b-datepicker
                  v-model="settingData.outboundDate"
                  :style="{ width: '140px' }"
                  :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                  :min="min"
                  placeholder="YYYY-MM-DD"
                  size="sm"
                ></b-datepicker>
                <div>~</div>
                <b-datepicker
                  v-model="settingData.inboundDate"
                  :style="{ width: '140px' }"
                  :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
                  :min="settingData.outboundDate || min"
                  placeholder="YYYY-MM-DD"
                  size="sm"
                ></b-datepicker>
                <div class="clear"></div>
              </div>
            </div>
            <div>
              <label>출발지/도착지 추가</label>
              <div>
                <b-input id="inputDep" size="sm" type="text" v-model="dep" v-on:keyup="keypress" maxlength="3" style="ime-mode:disabled;text-transform:uppercase;"></b-input>
                <div>~</div>
                <b-input id="inputArr" size="sm" type="text" v-model="arr" v-on:keyup="keypress" maxlength="3" style="ime-mode:disabled;text-transform:uppercase;"></b-input>
                <b-button @click="checkCode()" size="sm" text="Button" variant="success">추가</b-button>
                <div class="clear"></div>
              </div>
            </div>
          </div>
          <div>
            <div>
              <label>직항/경유</label>
              <div>
                <div :class="settingData.stops >= 0 ? 'selected' : ''" @click="settingData.stops = 0">직항</div>
                <div :class="settingData.stops >= 1 ? 'selected' : ''" @click="settingData.stops = settingData.stops === 1 ? 0 : 1 ">1번 경유</div>
                <div :class="settingData.stops === 2 ? 'selected' : ''" @click="settingData.stops = settingData.stops === 2 ? 1 : 2">2번 이상 경유</div>
              </div>
            </div>
            <div>
              <label>출발지/도착지 리스트</label>
              <div>
                <div v-for="x in settingData[selectedRegion]">{{ x }}<b-button-close @click="cityPop(x)"></b-button-close></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const min = new Date();
      return {
        min,
        selectedRegion: 'europe',
        timeList: [
          '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
          '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
        ],
        settingData: null,
        carrierInput: '',
        dep: '',
        arr: '',
      }
    },
    methods: {
      checkCode() {
        const obj = {
          destination: this.arr.toUpperCase(),
          continent: this.selectedRegion.toUpperCase(),
        };
        this.$apis.checkDestination(obj).then((resp) => {
          if (resp.data.message) {
            this.settingData[this.selectedRegion].push(`${this.dep.toUpperCase()}-${this.arr.toUpperCase()}`);
          } else {
            alert('선택된 지역에 해당하는 공항이 아닙니다. 다시 확인하세요.');
          }
        }).catch(() => {
          alert('선택된 지역에 해당하는 공항이 아닙니다. 다시 확인하세요.');
        });
      },
      keypress(e) {
        const val = e.key;
        const patt1 = /([^A-Za-z])/gi;
        if (patt1.test(val)) {
          alert('영문만 입력가능합니다.');
          const v = val.replace(patt1, '');
          e.target.value = v;
          if (e.target.id === 'inputDep') {
            this.dep = v;
          } else if (e.target.id === 'inputArr') {
            this.arr = v;
          }
        }
      },
      setClass(cabinClass) {
        const index = this.settingData.cabinClass.indexOf(cabinClass);
        if (index >= 0) {
          this.settingData.cabinClass.splice(index, 1);
        } else {
          this.settingData.cabinClass.push(cabinClass);
        }
      },
      carrierAdd() {
        const text = this.carrierInput.replace(/ /g, '').toUpperCase();
        if (text) {
          const a = text.split(',');
          for (let x = 0; x < a.length; x += 1) {
            if (a[x] && this.settingData.excludedCarrier.indexOf(a[x]) < 0) {
              this.settingData.excludedCarrier.push(a[x]);
            }
          }
          this.carrierInput = '';
        }
      },
      submit() {
        this.$apis.setCollectionSetting(this.settingData).then((resp) => {
          if (resp.data.status === 'Success') {
            alert('정상 저장 되었습니다. 내일 00시 부터 적용됩니다.');
          } else {
            alert('실패되었습니다. 다시 시도해주세요.');
          }
        });
      },
      carrierPop(code) {
        this.settingData.excludedCarrier.splice(this.settingData.excludedCarrier.indexOf(code), 1);
      },
      cityPop(code) {
        this.settingData[this.selectedRegion].splice(this.settingData[this.selectedRegion].indexOf(code), 1);
      }
    },
    mounted() {
      this.$store.commit('setRecentSearchPage', this.$route.path);
      this.$store.commit('setRecentSearchData', [null, null]);

      this.$apis.getCollectionSetting().then((resp) => {
        if (resp.data.status === 'Success') {
          const data = resp.data.message;
          this.settingData = {
            excludedCarrier: data.excludedCarrier,
            cabinClass: data.cabinClass.map(z => z.toUpperCase()),
            collectionTime: data.collectionTime,
            intervalFrom: data.intervalFrom,
            intervalTo: data.intervalTo,
            outboundDate: data.outboundDate,
            inboundDate: data.inboundDate,
            europe: data.europe.filter(v => v),
            americas: data.americas.filter(v => v),
            southeastAsia: data.southeastAsia.filter(v => v),
            middleEastAsia: data.middleEastAsia.filter(v => v),
            japan: data.japan.filter(v => v),
            china: data.china.filter(v => v),
            oceania: data.oceania.filter(v => v),
            stops: data.stops,
          };
          // console.log(this.settingData);
        } else {
          alert('기본 정보를 불러오는데 실패했습니다. 이후에 다시 시도해주세요.');
        }
      }).catch(() => {
        alert('기본 정보를 불러오는데 실패했습니다. 이후에 다시 시도해주세요.');
      });
    },
  };
</script>

<style lang="scss">
  .historySetting{
    position: relative;
    .saveBtn{
      width: 100%;
      top: 96px;
      left: 0;
      position: fixed;
      > div{
        padding: 0 15px;
        max-width: 1230px;
        margin: 0 auto;
        > button{
          float:right;
          width: 120px;
        }
      }
    }
    .content{
      padding-top: 40px;
      label{
        padding-top: 20px;
        font-weight: bold;
      }
      .input-group{
        width: 500px;
      }
      .exCarrier{
        display: flex;
        flex-flow: row wrap;
        > li{
          margin-bottom: 4px;
          height: 38px;
          width: 120px;
          border-radius: 8px;
          border: 1px solid #999;
          text-align: center;
          line-height: 36px;
          margin-right: 8px;
          position: relative;
          padding-right: 10px;
          > button{
            position: absolute;
            right: 4px;
            top: 4px;
          }
        }
      }
      .etcBox{
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        .cabinClass{
          flex: auto;
          ul{
            > li{
              float: left;
              width: 160px;
              background-color: white;
              border: 1px solid #dc3545;
              border-radius: 8px;
              transition: .1s ease;
              text-align: center;
              height: 38px;
              line-height: 36px;
              margin-right: 12px;
              cursor: pointer;
              margin-bottom: 8px;
              opacity: .6;
              &.selected{
                opacity: 1;
                background-color: #dc3545;
                color: #FFF;
              }
              &:last-child{
                margin-right: 0;
              }
              &:hover{
                opacity: 1;
              }
            }
          }
        }
        .startTime{
          padding: 0 40px;
          flex: 0 0 240px;
        }
        .interval{
          flex: auto;
          > div{
            margin-bottom: 8px;
            float: left;
            &:not(.input-group) {
              width: 40px;
              line-height: 38px;
              text-align: center;
            }
          }
        }
      }
    }
    .region{
      .regionSelector{
        display: flex;
        > div{
          color: #999;
          cursor: pointer;
          padding: 8px 20px;
          &.selected{
            color: #000;
            border-bottom: 2px solid #7F828B;
          }
        }
      }
      .regionContent{
        margin-top: 20px;
        font-size: 14px;
        border: 1px solid #999;
        label{
          padding: 0;
        }
        > div:first-of-type{
          display: flex;
          > div:first-of-type{
            flex: 0 0 30%;
            padding: 20px;
            border-right: 1px solid #999;
            > div{
              min-height: 39px;
              > *{
                margin-bottom: 8px;
                float: left;
              }
              > div{
                padding: 0 12px;
                line-height: 31px;
              }
              label.form-control{
                font-weight: normal;
                line-height: 29px;
              }
            }
          }
          > div:nth-of-type(2){
            flex: 0 0 70%;
            padding: 20px;
            > div{
              > *{
                margin-bottom: 8px;
                float: left;
              }
              > div{
                padding: 0 12px;
                line-height: 31px;
              }
              input{
                width: 120px;
              }
              > button{
                width: 120px;
                margin-left: 20px;
              }
            }
          }
        }
        > div:nth-of-type(2){
          display: flex;
          > div:nth-of-type(1){
            flex: 0 0 30%;
            padding: 20px;
            border-right: 1px solid #999;
            > div{
              > div{
                width: 100%;
                background-color: white;
                border: 1px solid #dc3545;
                border-radius: 8px;
                transition: .1s ease;
                text-align: center;
                height: 38px;
                line-height: 36px;
                margin-right: 12px;
                cursor: pointer;
                margin-bottom: 8px;
                opacity: .6;
                &.selected{
                  opacity: 1;
                  background-color: #dc3545;
                  color: #FFF;
                }
                &:last-child{
                  margin-right: 0;
                }
                &:hover{
                  opacity: 1;
                }
              }
            }
          }
          > div:nth-of-type(2){
            flex: 0 0 70%;
            padding: 20px;
            > div{
              display: flex;
              flex-flow: row wrap;
              > div{
                height: 38px;
                width: 120px;
                border-radius: 8px;
                border: 1px solid #999;
                text-align: center;
                line-height: 36px;
                margin-right: 8px;
                position: relative;
                padding-right: 10px;
                margin-bottom: 4px;
                &:hover{
                  background-color: lightgray;
                }
                > button{
                  position: absolute;
                  right: 4px;
                  top: 4px;
                }
              }
            }
          }
        }
      }
    }
    .clear{
      margin: 0 !important;
      padding: 0 !important;
      float: none !important;
      clear: both !important;
    }
  }
</style>
