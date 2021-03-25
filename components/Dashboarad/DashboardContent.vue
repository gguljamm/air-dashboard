<template>
  <div class="dashboardWrapper" @click="selectedIndex = -1">
    <div>
      <label class="mr-sm-2" for="airline">항공사</label>
      <b-form-select id="airline" v-model="airlineFilter" :options="airlineFilters" style="display: inline-block; width: 200px;"></b-form-select>
    </div>
    <div>
      <div class="firstSection">
        <div>
          <div>
            <strong>최저가 노출 여행사 합계</strong>
            <div>여행사 최저가 노출 개수와 비율</div>
          </div>
          <div>
            <div>
              <div class="filter">
                <b-form-checkbox
                  v-model="filter[1]"
                  name="check_filter"
                >국내여행사</b-form-checkbox>
                <b-form-checkbox
                  v-model="filter[2]"
                  name="check_filter"
                >해외여행사</b-form-checkbox>
                <b-form-checkbox
                  v-model="filter[3]"
                  name="check_filter"
                >항공사</b-form-checkbox>
                <b-form-checkbox
                  v-model="filter[0]"
                  name="check_filter"
                >기타</b-form-checkbox>
              </div>
              <ul class="content">
                <div class="thead">
                  <div>여행사</div>
                  <div>최저가 수</div>
                  <div>최저가 비율</div>
                </div>
                <li v-for="(x, index) in lowestPriceListIncludeFilter" :ref="`li_${index}`"
                  @click.stop="selectItinerary(x, index)"
                  :class="{
                    selected: selectedIndex === index,
                  }"
                >
                  <div>{{ x.agentName }} <div>{{ x.lowestPriceCount }}</div></div>
                  <div>
                    <div :style="{
                      width: `${(x.lowestPriceCount / selectedAirlineLength) * 100 * (100 / ((lowestPriceListIncludeFilter[0].lowestPriceCount / selectedAirlineLength) * 100)) }%`
                    }"></div>
                  </div>
                  <div>{{ Math.round((x.lowestPriceCount / selectedAirlineLength) * 100) }}%</div>
                </li>
                <div v-if="lowestPriceListIncludeFilter.length === 0" style="padding: 40px; text-align: center">
                  결과가 없습니다.
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="secondSection">
        <div>
          <div>
            <strong>1G 여행사 최저가 비율</strong>
            <div>1G 여행사 내 최저가 운임 노출 개수 및 비율</div>
          </div>
          <div>
            <div v-if="selectedAirlineLength > 0">
              <div class="totalNum">TOTAL<br>{{ selectedAirlineLength }}</div>
              <GChart
                type="PieChart"
                :data="[['Agent', 'Impressions']].concat(firstGroupLowestPriceList).concat([['1G여행사 미노출', selectedAirlineLength - totalNum(firstGroupLowestPriceList)]])"
                :options="option"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="thirdSection">
        <div>
          <div>
            <strong>1G 여행사 스카이스캐너 노출 비율</strong>
            <div>1G 여행사 내 운임 노출 개수 및 비율</div>
          </div>
          <div>
            <ul>
              <li v-for="x in firstGroupList">
                <div>
                  <div>{{ x.agentName }}</div>
                  <div>{{ x.impressionCount }}/{{ selectedAirlineLength }}</div>
                  <div>{{ Math.round((x.impressionCount / selectedAirlineLength) * 100) }}%</div>
                </div>
                <div>
                  <div :style="{ width: `${ Math.round((x.impressionCount / selectedAirlineLength) * 100) }%` }"></div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      @click.stop
    >
      <detail-itinerary
        :key="selectedIndex"
        v-if="selectedIndex > -1"
        :selectedItinerary="selectedItinerary"
        :position="position"
        :carriers="allData.carrierList"
        :filter="filter"
        @close="selectedIndex = -1"
      ></detail-itinerary>
    </div>
  </div>
</template>

<script>
  import DetailItinerary from "./DetailItinerary";

  export default {
    components: {
      DetailItinerary,
    },
    props: ['allData'],
    data() {
      return {
        position: {
          x: 0,
          y: 0,
        },
        selectedIndex: -1,
        airlineFilter: 'all',
        filter: {
          0: true,
          1: true,
          2: true,
          3: true,
        },
        option: {
          height: 400,
          width: 400,
          pieHole: 0.4,
          showLables: 'true',
          pieSliceText: 'value-and-percentage',
          pieSliceTextStyle: {
            color: 'white',
            fontSize: 10
          },
          legend: {
            position: 'bottom',
            alignment: 'center'
          },
          chartArea: {
            top: 40,
            width: '100%',
            height: '65%'
          },
        },
        selectedItinerary: {},
      };
    },
    computed: {
      getFilteredList() {
        const arr = [];
        if (this.airlineFilter === 'all') {
          return this.allData.detailItinerarydataList;
        }
        if (this.airlineFilter === 'combination') {
          const temp = this.allData.detailItinerarydataList;
          for (let x = 0; x < temp.length; x += 1) {
            if (temp[x].outboundLegData.carriers.length > 1 || temp[x].inboundLegData.carriers.length > 1
              || temp[x].outboundLegData.carriers[0] !== temp[x].inboundLegData.carriers[0]
            ) {
              arr.push(temp[x]);
            }
          }
        } else {
          const temp = this.allData.detailItinerarydataList;
          for (let x = 0; x < temp.length; x += 1) {
            if (temp[x].outboundLegData.carriers.length === 1 && temp[x].inboundLegData.carriers.length === 1
              && temp[x].outboundLegData.carriers[0] === this.airlineFilter && temp[x].inboundLegData.carriers[0] === this.airlineFilter
            ) {
              arr.push(temp[x]);
            }
          }
        }
        return arr;
      },
      lowestPriceList() {
        if (this.allData.detailItinerarydataList) {
          const arr = [];
          const temp = this.allData.detailItinerarydataList;
          if (this.airlineFilter === 'all') {
            for (let x = 0; x < temp.length; x += 1) {
              const index = arr.map(z => z.agentName).indexOf(temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].name : '');
              if (index >= 0) {
                arr[index].lowestPriceCount += 1;
              } else {
                const obj = {
                  agentName: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].name : '',
                  category: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].category : '',
                  lowestPriceCount: 1,
                  firstGroup: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].firstGroup : false,
                };
                arr.push(obj);
              }
            }
          } else if (this.airlineFilter === 'combination') {
            for (let x = 0; x < temp.length; x += 1) {
              if (temp[x].outboundLegData.carriers.length > 1 || temp[x].inboundLegData.carriers.length > 1
                || temp[x].outboundLegData.carriers[0] !== temp[x].inboundLegData.carriers[0]) {
                const index = arr.map(z => z.agentName).indexOf(temp[x].agentPriceOptionList[0].name);
                if (index >= 0) {
                  arr[index].lowestPriceCount += 1;
                } else {
                  const obj = {
                    agentName: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].name : '',
                    category: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].category : '',
                    lowestPriceCount: 1,
                    firstGroup: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].firstGroup : '',
                  };
                  arr.push(obj);
                }
              }
            }
          } else {
            for (let x = 0; x < temp.length; x += 1) {
              if (temp[x].outboundLegData.carriers.length === 1 && temp[x].inboundLegData.carriers.length === 1
                && temp[x].outboundLegData.carriers[0] === this.airlineFilter && temp[x].inboundLegData.carriers[0] === this.airlineFilter
              ) {
                const index = arr.map(z => z.agentName).indexOf(temp[x].agentPriceOptionList[0].name);
                if (index >= 0) {
                  arr[index].lowestPriceCount += 1;
                } else {
                  const obj = {
                    agentName: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].name : '',
                    category: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].category : '',
                    lowestPriceCount: 1,
                    firstGroup: temp[x].agentPriceOptionList[0] ? temp[x].agentPriceOptionList[0].firstGroup : '',
                  };
                  arr.push(obj);
                }
              }
            }
          }
          return arr.sort((a, b) => {
            if (a.lowestPriceCount > b.lowestPriceCount) {
              return -1;
            }
            if (a.lowestPriceCount < b.lowestPriceCount) {
              return 1;
            }
            return 0;
          });
        }
        return [];
      },
      lowestPriceListIncludeFilter() {
        if (this.allData.detailItinerarydataList) {
          const arr = [];
          const temp = this.allData.detailItinerarydataList;
          if (this.airlineFilter === 'all') {
            for (let x = 0; x < temp.length; x += 1) {
              const min = temp[x].agentPriceOptionList.find(v => this.filter[v.category]);
              if (min) {
                const index = arr.map(z => z.agentName).indexOf(min.name);
                if (index >= 0) {
                  arr[index].lowestPriceCount += 1;
                } else {
                  const obj = {
                    agentName: min.name,
                    category: min.category,
                    lowestPriceCount: 1,
                    firstGroup: min.firstGroup,
                  };
                  arr.push(obj);
                }
              }
            }
          } else if (this.airlineFilter === 'combination') {
            for (let x = 0; x < temp.length; x += 1) {
              if (temp[x].outboundLegData.carriers.length > 1 || temp[x].inboundLegData.carriers.length > 1
                || temp[x].outboundLegData.carriers[0] !== temp[x].inboundLegData.carriers[0]) {
                const min = temp[x].agentPriceOptionList.find(v => this.filter[v.category]);
                if (min) {
                  const index = arr.map(z => z.agentName).indexOf(min.name);
                  if (index >= 0) {
                    arr[index].lowestPriceCount += 1;
                  } else {
                    const obj = {
                      agentName: min.name,
                      category: min.category,
                      lowestPriceCount: 1,
                      firstGroup: min.firstGroup,
                    };
                    arr.push(obj);
                  }
                }
              }
            }
          } else {
            for (let x = 0; x < temp.length; x += 1) {
              if (temp[x].outboundLegData.carriers.length === 1 && temp[x].inboundLegData.carriers.length === 1
                && temp[x].outboundLegData.carriers[0] === this.airlineFilter && temp[x].inboundLegData.carriers[0] === this.airlineFilter
              ) {
                const min = temp[x].agentPriceOptionList.find(v => this.filter[v.category]);
                if (min) {
                  const index = arr.map(z => z.agentName).indexOf(min.name);
                  if (index >= 0) {
                    arr[index].lowestPriceCount += 1;
                  } else {
                    const obj = {
                      agentName: min.name,
                      category: min.category,
                      lowestPriceCount: 1,
                      firstGroup: min.firstGroup,
                    };
                    arr.push(obj);
                  }
                }
              }
            }
          }
          return arr.sort((a, b) => {
            if (a.lowestPriceCount > b.lowestPriceCount) {
              return -1;
            }
            if (a.lowestPriceCount < b.lowestPriceCount) {
              return 1;
            }
            return 0;
          });
        }
        return [];
      },
      firstGroupLowestPriceList() {
        if (this.allData.detailItinerarydataList) {
          const arr = [];
          const list = this.lowestPriceList;
          for (let x = 0; x < list.length; x += 1) {
            if (list[x].firstGroup) {
              arr.push([list[x].agentName, list[x].lowestPriceCount]);
            }
          }
          return arr;
        }
        return [];
      },
      firstGroupList() {
        if (this.allData.detailItinerarydataList) {
          const arr = [];
          const list = this.allData.detailItinerarydataList;
          if (this.airlineFilter === 'all') {
            for (let x = 0; x < list.length; x += 1) {
              const temp = list[x].agentPriceOptionList;
              for (let y = 0; y < temp.length; y += 1) {
                if (temp[y].firstGroup) {
                  const index = arr.map(z => z.agentName).indexOf(temp[y].name);
                  if (index >= 0) {
                    arr[index].impressionCount += 1;
                  } else {
                    arr.push({
                      agentName: temp[y].name,
                      impressionCount: 1
                    })
                  }
                }
              }
            }
          } else if (this.airlineFilter === 'combination') {
            for (let x = 0; x < list.length; x += 1) {
              if (list[x].outboundLegData.carriers.length > 1 || list[x].inboundLegData.carriers.length
                || list[x].outboundLegData.carriers[0] !== list[x].inboundLegData.carriers
              ) {
                const temp = list[x].agentPriceOptionList;
                for (let y = 0; y < temp.length; y += 1) {
                  if (temp[y].firstGroup) {
                    const index = arr.map(z => z.agentName).indexOf(temp[y].name);
                    if (index >= 0) {
                      arr[index].impressionCount += 1;
                    } else {
                      arr.push({
                        agentName: temp[y].name,
                        impressionCount: 1
                      })
                    }
                  }
                }
              }
            }
          } else {
            for (let x = 0; x < list.length; x += 1) {
              if (list[x].outboundLegData.carriers.length === 1 && list[x].inboundLegData.carriers.length === 1
                && list[x].outboundLegData.carriers[0] === this.airlineFilter && list[x].inboundLegData.carriers[0] === this.airlineFilter
              ) {
                const temp = list[x].agentPriceOptionList;
                for (let y = 0; y < temp.length; y += 1) {
                  if (temp[y].firstGroup) {
                    const index = arr.map(z => z.agentName).indexOf(temp[y].name);
                    if (index >= 0) {
                      arr[index].impressionCount += 1;
                    } else {
                      arr.push({
                        agentName: temp[y].name,
                        impressionCount: 1
                      })
                    }
                  }
                }
              }
            }
          }
          return arr.sort((a, b) => {
            if (a.impressionCount > b.impressionCount) {
              return -1;
            }
            if (a.impressionCount < b.impressionCount) {
              return 1;
            }
            return 0;
          });
        }
        return [];
      },
      airlineFilters() {
        if (this.allData.carrierList) {
          const newArr = this.allData.carrierList.reduce((arr, item) => {
            if (item.code) {
              arr.push({ value: item.code, text: item.name });
            }
            return arr;
          }, []);
          return [{ value: 'all', text: '전체' }, { value: 'combination', text: '항공사 결합' }].concat(newArr);
        }
        return [];
      },
      selectedAirlineLength() {
        if (!this.allData || !this.allData.detailItinerarydataList) {
          return 0;
        }
        return this.getFilteredList.length;
      }
    },
    methods: {
      selectItinerary(v, index) {
        if (this.selectedIndex === index) {
          this.selectedIndex = -1;
          return;
        }
        const arr = [];
        const list = this.allData.detailItinerarydataList;
        for (let x = 0; x < list.length; x += 1) {
          if (this.airlineFilter === 'all') {
            const min = list[x].agentPriceOptionList.find(v => this.filter[v.category]);
            if (min && min.name === v.agentName) {
              arr.push(list[x]);
            }
          } else if (this.airlineFilter === 'combination') {
            if (list[x].outboundLegData.carriers.length > 1 || list[x].inboundLegData.carriers.length
              || list[x].outboundLegData.carriers[0] !== list[x].inboundLegData.carriers
            ) {
              const min = list[x].agentPriceOptionList.find(v => this.filter[v.category]);
              if (min && min.name === v.agentName) {
                arr.push(list[x]);
              }
            }
          } else {
            if (list[x].outboundLegData.carriers.length === 1 && list[x].inboundLegData.carriers.length === 1
              && list[x].outboundLegData.carriers[0] === this.airlineFilter && list[x].inboundLegData.carriers[0] === this.airlineFilter
            ) {
              const min = list[x].agentPriceOptionList.find(v => this.filter[v.category]);
              if (min && min.name === v.agentName) {
                arr.push(list[x]);
              }
            }
          }
        }
        const p = this.$refs[`li_${index}`][0].getBoundingClientRect();
        this.position = p;
        this.selectedItinerary = arr;
        this.selectedIndex = index;
      },
      totalNum(val) {
        return val.reduce((total, x) => total + x[1], 0);
      },
    }
  };
</script>

<style lang="scss">
  .dashboardWrapper{
    padding-top: 40px;
    width: 100%;
    > div:first-child{
      margin-bottom: 20px;
    }
    > div:nth-child(2){
      display: flex;
      flex-wrap: wrap;
      > div {
        flex: 1;
        > div{
          height: 100%;
          border: 1px solid #ddd;
          border-radius: 20px;
          position: relative;
          overflow: hidden;
          > div:first-child{
            background-color: #eee;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 88px;
            line-height: 22px;
            z-index: 1;
            padding: 20px;
            box-shadow: 0 0 4px 2px rgba(0,0,0,.1);
          }
          > div:nth-child(2){
            min-height: 488px;
            padding-top: 88px;
            display: flex;
            align-items: center;
            justify-content: center;
            > div{
              position: relative;
            }
          }
        }
      }
      .firstSection{
        padding-right: 10px;
        > div > div:nth-child(2) > div{
          width: 100%;
          padding: 8px 0;
        }
        .filter{
          display: flex;
          flex-flow: row wrap;
          line-height: 24px;
          margin-bottom: 8px;
          padding: 0 8px;
          > div{
            margin-right: 8px;
            font-size: 14px;
          }
        }
        .content{
          position: relative;
          height: 352px;
          overflow: auto;
          .thead{
            padding: 0 8px;
            border-bottom: 1px solid #eee;
            position: sticky;
            z-index: 4;
            background-color: #FFF;
            height: 20px;
            white-space: nowrap;
            top: 0;
            left: 0;
            width: 100%;
            display: flex;
            font-size: 12px;
            > div:nth-of-type(1){
              flex: 0 0 50%;
            }
            > div:nth-of-type(2){
              flex: 0 0 35%;
            }
            > div:nth-of-type(3){
              flex: 0 0 15%;
              text-align: right;
            }
          }
          > li{
            padding: 0 8px;
            &:hover{
              background-color: moccasin;
              > div:first-of-type > div{
                background-color: moccasin;
              }
            }
            &.selected{
              background-color: moccasin;
              > div:first-of-type > div{
                background-color: moccasin;
              }
            }
            cursor: pointer;
            font-size: 14px;
            line-height: 30px;
            display: flex;
            position: relative;
            > div:first-of-type{
              flex: 0 0 50%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              position: relative;
              padding-right: 30px;
              > div{
                position: absolute;
                right: 0;
                top: 0;
                line-height: 30px;
                background-color: #FFF;
                padding: 0 8px;
              }
            }
            > div:nth-of-type(2){
              flex: 0 0 35%;
              > div{
                height: 14px;
                margin-top: 8px;
                background-color: #dc3545;
              }
            }
            > div:nth-of-type(3){
              flex: 0 0 15%;
              text-align: right;
            }
          }
        }
      }
      .secondSection{
        flex: 0 0 400px;
        > div{
          > div{
            > div:nth-child(2){
              position: relative;
            }
            &:nth-of-type(2) > div {
              width: 100%;
              height: 400px;
              .totalNum{
                position: absolute;
                z-index: 1;
                top: 146px;
                left: 50%;
                width: 100px;
                text-align: center;
                margin-left: -50px;
              }
            }
          }
        }
      }
      .thirdSection{
        padding-left: 10px;
        ul{
          padding: 12px 20px;
          width: 100%;
          max-height: 400px;
          overflow: auto;
          > li{
            margin-bottom: 12px;
            > div:first-child{
              display: flex;
              font-size: 14px;
              > div:nth-of-type(1){
                flex: 0 0 50%;
                padding-left: 10px;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
              }
              > div:nth-of-type(2){
                flex: 0 0 30%;
                text-align: right;
              }
              > div:nth-of-type(3){
                flex: 0 0 20%;
                text-align: right;
              }
            }
            > div:nth-of-type(2){
              margin: 8px 0;
              border: 1px solid #eee;
              border-radius: 8px;
              overflow: hidden;
              > div{
                height: 30px;
                background-color: #dc3545;
              }
            }
            &:last-child{
              margin-bottom: 0;
            }
          }
        }
      }
    }
  }
  @media screen and (max-width: 991px) {
    .dashboardWrapper > div:nth-child(2) {
      display: block;
      width: 100%;
      > div{
        padding-right: 0 !important;
        margin-bottom: 20px;
      }
    }
  }
  svg > g > g:last-child { pointer-events: none }
</style>
