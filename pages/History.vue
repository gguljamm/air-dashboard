<template>
  <div class="history">
    <h4>데이터 수집 이력</h4>
    <div>수집된 데이터 현황을 확인할 수 있습니다.</div>
    <div class="inputBox">
      <div>조회기간 (최대 30일)</div>
      <div class="dateWrap">
        <b-datepicker
          v-model="form.startDate"
          :style="{ width: '240px' }"
          :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
          :min="'2020-03-01'"
          :max="max"
          placeholder="YYYY-MM-DD"
        ></b-datepicker>
        <div class="pad">~</div>
        <b-datepicker
          v-model="form.endDate"
          :style="{ width: '240px' }"
          :date-format-options="{ year: 'numeric', month: '2-digit', day: '2-digit' }"
          :min="form.startDate || '2020-03-01'"
          :max="max"
          placeholder="YYYY-MM-DD"
        ></b-datepicker>
        <b-button @click="submit()" variant="primary">조회</b-button>
      </div>
    </div>
    <div class="clear"></div>
    <div class="content">
      <ul>
        <div>
          <div>수집날짜</div>
          <div>총합</div>
          <div>총 소요시간</div>
        </div>
        <li v-for="(x, index) in arrDateList" :class="{ selected: index === selectedIndex }" @click="selectedIndex = index">
          <div>{{ x }}</div>
          <div>{{ $format.numberFormat(getTotalCount('totalCount', x)) }}</div>
          <div>{{ getTotalTime(x, 'total') }}</div>
        </li>
      </ul>
      <div v-if="dateList[arrDateList[selectedIndex]]">
        <div>
          <label>수집결과</label>
          <div class="summary">
            <div>
              <div>수집일</div>
              <div>{{ arrDateList[selectedIndex] }}</div>
            </div>
            <div>
              <div>수집된 데이터 건 수</div>
              <div>{{ $format.numberFormat(getTotalCount('totalCount', arrDateList[selectedIndex])) }} 건</div>
            </div>
            <div>
              <div>전일대비</div>
              <div v-if="getTotalCount('comparedCount', arrDateList[selectedIndex]) >= 0">
                <b-icon-triangle-fill v-if="getTotalCount('comparedCount', arrDateList[selectedIndex]) !== 0"></b-icon-triangle-fill>
                {{ $format.numberFormat(getTotalCount('comparedCount', arrDateList[selectedIndex])) }} 건
              </div>
              <div v-else>
                <b-icon-triangle-fill style="transform: rotate(180deg)"></b-icon-triangle-fill>
                {{ $format.numberFormat(getTotalCount('comparedCount', arrDateList[selectedIndex]) * -1) }} 건
              </div>
            </div>
            <div>
              <div>시작시간</div>
              <div>{{ getTotalTime(arrDateList[selectedIndex], 'start') }}</div>
            </div>
            <div>
              <div>종료시간</div>
              <div>{{ getTotalTime(arrDateList[selectedIndex], 'end') }}</div>
            </div>
            <div>
              <div>총 소요시간</div>
              <div>{{ getTotalTime(arrDateList[selectedIndex], 'total') }}</div>
            </div>
          </div>
        </div>
        <div class="regionResult">
          <label>지역 별 상세결과</label>
          <div class="tab">
            <div :class="selectedTab === 'EUROPE' ? 'selected' : ''" @click="selectedTab = 'EUROPE'">유럽</div>
            <div :class="selectedTab === 'AMERICAS' ? 'selected' : ''" @click="selectedTab = 'AMERICAS'">미주</div>
            <div :class="selectedTab === 'SOUTHEASTASIA' ? 'selected' : ''" @click="selectedTab = 'SOUTHEASTASIA'">동남아</div>
            <div :class="selectedTab === 'JAPAN' ? 'selected' : ''" @click="selectedTab = 'JAPAN'">일본</div>
            <div :class="selectedTab === 'CHINA' ? 'selected' : ''" @click="selectedTab = 'CHINA'">중국</div>
            <div :class="selectedTab === 'OCEANIA' ? 'selected' : ''" @click="selectedTab = 'OCEANIA'">대양주</div>
            <div :class="selectedTab === 'MIDDLEEASTASIA' ? 'selected' : ''" @click="selectedTab = 'MIDDLEEASTASIA'">중동/아프리카</div>
          </div>
          <div class="context" v-if="!dateList[arrDateList[selectedIndex]][selectedTab]">저장된 결과가 없습니다.</div>
          <div class="context" v-else>
            <div>
              <div>
                <div>구간수</div>
                <div>{{ dateList[arrDateList[selectedIndex]][selectedTab].length }}</div>
              </div>
              <div>
                <div>수집된 데이터 건 수</div>
                <div>{{ $format.numberFormat(dateList[arrDateList[selectedIndex]][selectedTab].reduce((t ,v) => t + v.totalCount, 0)) }} 건</div>
              </div>
              <div>
                <div>전일대비</div>
                <div v-if="dateList[arrDateList[selectedIndex]][selectedTab].reduce((t ,v) => t + v.comparedCount, 0) >= 0">
                  <b-icon-triangle-fill v-if="dateList[arrDateList[selectedIndex]][selectedTab].reduce((t ,v) => t + v.comparedCount, 0) !== 0"></b-icon-triangle-fill>
                  {{ $format.numberFormat(dateList[arrDateList[selectedIndex]][selectedTab].reduce((t ,v) => t + v.comparedCount, 0)) }} 건
                </div>
                <div v-else>
                  <b-icon-triangle-fill style="transform: rotate(180deg)"></b-icon-triangle-fill>
                  {{ $format.numberFormat(dateList[arrDateList[selectedIndex]][selectedTab].reduce((t ,v) => t + v.comparedCount, 0) * -1) }} 건
                </div>
              </div>
              <div>
                <div>시작시간</div>
                <div>{{ getTotalTimeDeep('start') }}</div>
              </div>
              <div>
                <div>종료시간</div>
                <div>{{ getTotalTimeDeep('end') }}</div>
              </div>
              <div>
                <div>총 소요시간</div>
                <div>{{ getTotalTimeDeep('total') }}</div>
              </div>
            </div>
            <ul>
              <div>
                <div>구간</div>
                <div>수집된 데이터 건 수</div>
                <div>전일대비</div>
                <div>시작시간</div>
                <div>종료시간</div>
                <div>총 소요시간</div>
              </div>
              <li v-for="x in dateList[arrDateList[selectedIndex]][selectedTab]">
                <div>{{ x.place }}</div>
                <div>{{ $format.numberFormat(x.totalCount) }}</div>
                <div>
                  <b-icon-triangle-fill v-if="x.comparedCount !== 0" :style="{
                    transform: x.comparedCount < 0 ? 'rotate(180deg)' : ''
                  }"></b-icon-triangle-fill>
                  {{ x.comparedCount < 0 ? x.comparedCount * -1 : x.comparedCount }}
                </div>
                <div>{{ x.startTime.map(z => $format.zeros(z)).join(':') }}</div>
                <div>{{ x.endTime.map(z => $format.zeros(z)).join(':') }}</div>
                <div>{{ getTimeGap(x) }}</div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      d.setDate(d.getDate() - 10);
      return {
        selectedTab: 'EUROPE',
        selectedIndex: 0,
        max: today,
        form: {
          startDate: `${d.getFullYear()}-${this.$format.zeros(d.getMonth() + 1)}-${this.$format.zeros(d.getDate())}`,
          endDate: `${today.getFullYear()}-${this.$format.zeros(today.getMonth() + 1)}-${this.$format.zeros(today.getDate())}`,
        },
        dateList: {},
      };
    },
    computed: {
      arrDateList() {
        return Object.keys(this.dateList).sort((a, b) => {
          return new Date(b).getTime() - new Date(a).getTime();
        });
      },
    },
    methods: {
      getTotalCount(flag, date) {
        return Object.values(this.dateList[date]).reduce((t, v) => {
          return t += v.reduce((tt, vv) => tt += vv[flag], 0);
        }, 0);
      },
      getTotalTimeDeep(flag) {
        let start = null;
        let end = null;
        Object.values(this.dateList[this.arrDateList[this.selectedIndex]][this.selectedTab]).forEach(v => {
          const s = (v.startTime[0] * 3600) + (v.startTime[1] * 60) + (v.startTime[2]);
          const e = (v.endTime[0] * 3600) + (v.endTime[1] * 60) + (v.endTime[2]);
          if (start === null && end === null) {
            start = s;
            end = e;
          } else if (s < start) {
            start = s;
          } else if (e > end) {
            end = e;
          }
        });
        let v = 0;
        if (flag === 'total') {
          v = end - start;
        } else if (flag === 'start') {
          v = start;
        } else if (flag === 'end') {
          v = end;
        }
        return `${this.$format.zeros(parseInt(v / 3600, 10))}:${this.$format.zeros(parseInt(v % 3600 / 60, 10))}:${this.$format.zeros(parseInt(v % 3600 % 60, 10))}`;
      },
      getTimeGap(v) {
        const s = (v.startTime[0] * 3600) + (v.startTime[1] * 60) + (v.startTime[2]);
        const e = (v.endTime[0] * 3600) + (v.endTime[1] * 60) + (v.endTime[2]);
        const gap = e - s;
        return `${this.$format.zeros(parseInt(gap / 3600, 10))}:${this.$format.zeros(parseInt(gap % 3600 / 60, 10))}:${this.$format.zeros(parseInt(gap % 3600 % 60, 10))}`;
      },
      getTotalTime(date, flag) {
        let start = null;
        let end = null;
        Object.values(this.dateList[date]).forEach(vv => {
          vv.forEach(v => {
            const s = (v.startTime[0] * 3600) + (v.startTime[1] * 60) + (v.startTime[2]);
            const e = (v.endTime[0] * 3600) + (v.endTime[1] * 60) + (v.endTime[2]);
            if (start === null && end === null) {
              start = s;
              end = e;
            } else if (s < start) {
              start = s;
            } else if (e > end) {
              end = e;
            }
          });
        });
        let v = 0;
        if (flag === 'total') {
          v = end - start;
        } else if (flag === 'start') {
          v = start;
        } else if (flag === 'end') {
          v = end;
        }
        return `${this.$format.zeros(parseInt(v / 3600, 10))}:${this.$format.zeros(parseInt(v % 3600 / 60, 10))}:${this.$format.zeros(parseInt(v % 3600 % 60, 10))}`;
      },
      submit() {
        this.dateList = {};
        if (!this.form.startDate || !this.form.endDate) {
          alert('날짜를 입력해주세요.');
          return;
        }
        this.$apis.getCollectionHistory({
          dateFrom: this.form.startDate,
          dateTo: this.form.endDate,
        }).then((resp) => {
          if (resp.data.status === 'Success') {
            resp.data.message.forEach(z => {
              const key = z.collectionDate.map(v => this.$format.zeros(v)).join('-');
              if (!this.dateList[key]) {
                this.$set(this.dateList, key, {})
              }
              if (!this.dateList[key][z.continent]) {
                this.$set(this.dateList[key], z.continent, []);
              }
              this.dateList[key][z.continent].push(z);
            });
            // console.log(this.dateList);
          } else {
            alert('정보를 불러오는데 실패했습니다. 이후 다시 시도해주세요.');
          }
        }).catch(() => {
          alert('정보를 불러오는데 실패했습니다. 이후 다시 시도해주세요.');
        });
      },
    },
    mounted() {
      this.$store.commit('setRecentSearchPage', this.$route.path);
      this.$store.commit('setRecentSearchData', [null, null]);
    },
  };
</script>

<style lang="scss">
  .history{
    .inputBox{
      padding-top: 40px;
      .dateWrap{
        padding-top: 8px;
        overflow: visible;
        > *{
          margin-bottom: 8px;
          float: left;
          height: 38px;
        }
        > .pad{
          padding: 0 20px;
          line-height: 38px;
        }
        > button{
          margin-left: 40px;
          width: 120px;
        }
      }
    }
    .clear{
      clear: both;
    }
    .content{
      margin-top: 32px;
      display: flex;
      border: 1px solid #999;
      font-size: 14px;
      > ul{
        flex: 0 0 25%;
        height: 600px;
        overflow: auto;
        border-right: 1px solid #999;
        text-align: center;
        > div{
          border-bottom: 1px solid #999;
          padding: 8px 0;
          position: sticky;
        }
        > li {
          cursor: pointer;
          line-height: 24px;
          padding: 8px 0;
          > div{
            &:nth-of-type(2){
              text-align: right;
            }
          }
          transition: background-color .1s ease;
          &.selected{
            background-color: moccasin;
            &:hover{
              background-color: moccasin;
            }
          }
          &:hover{
            background-color: #f2f2f2;
          }
        }
        > * {
          display: flex;
          > div{
            padding: 0 8px;
            flex: 0 0 30%;
            &:first-child{
              flex: 0 0 40%;
            }
          }
        }
      }
      > div{
        padding: 20px;
        flex: 0 0 75%;
        height: 600px;
        white-space: nowrap;
        overflow-y: hidden;
        overflow-x: auto;
        position: relative;
        line-height: 22px;
        label{
          font-weight: bold;
        }
        .summary{
          display: flex;
          > div{
            flex: 1;
            text-align: center;
            > div:nth-of-type(2){
              font-weight: bold;
            }
          }
        }
        .regionResult{
          padding-top: 20px;
          .tab{
            display: flex;
            cursor: pointer;
            padding-bottom: 16px;
            > div{
              text-align: center;
              height: 32px;
              line-height: 31px;
              padding: 0 20px;
              border-bottom: 1px solid transparent;
              color: #999;
              &.selected{
                font-weight: bold;
                color: #000;
                border-bottom: 1px solid #000;
              }
            }
          }
          .context{
            > div:first-of-type{
              display: flex;
              > div{
                text-align: center;
                flex: 0 0 16.6666%;
                > div:nth-of-type(2){
                  font-weight: bold;
                }
              }
            }
            > ul{
              border: 1px solid #999;
              position: absolute;
              bottom: 20px;
              left: 20px;
              right: 20px;
              top: 264px;
              overflow: auto;
              > *{
                display: flex;
                > div{
                  text-align: center;
                  flex: 0 0 16.6666%;
                }
              }
              > div{
                z-index: 1;
                background-color: #FFF;
                top: 0;
                border-bottom: 1px solid #999;
                position: sticky;
              }
              > li{
                line-height: 24px;
                padding: 4px 0;
              }
            }
          }
        }
      }
    }
  }
</style>
