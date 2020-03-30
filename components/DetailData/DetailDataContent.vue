<template>
  <div class="detailDataContent">
    <div class="filter">
      <div>
        <label>항공사</label>
        <b-select size="sm" v-model="airlineFilter" :options="airlineFilters"></b-select>
      </div>
      <div>
        <label>여행사</label>
        <b-form-group>
          <b-form-checkbox-group
            id="checkbox-group-1"
            v-model="selectedAgent"
            :options="filter"
            name="flavour-1"
          ></b-form-checkbox-group>
        </b-form-group>
      </div>
      <div>
        <label>공항변경</label>
        <b-form-group>
          <b-form-radio-group v-model="includeChange" name="some-radios" >
            <b-form-radio value="true">결과 포함</b-form-radio>
            <b-form-radio value="false">결과내제외</b-form-radio>
          </b-form-radio-group>
        </b-form-group>
      </div>
      <div>
        <label>리스트</label>
        <b-select size="sm" v-model="listLength" :options="[10, 20, 30, 40, 50]"></b-select>
      </div>
      <div>
        <b-button size="sm" @click="downloadExcel()">엑셀저장</b-button>
      </div>
    </div>
    <div class="tableWrapper">
      <table class="table" id="excel_table">
        <thead class="thead-light">
          <tr>
            <th><div class="text-nowrap">출발/도착</div></th>
            <th><div class="text-nowrap">출발일/도착일</div></th>
            <th><div class="text-nowrap">항공사</div></th>
            <th><div class="text-nowrap">출국스케줄</div></th>
            <th><div class="text-nowrap">귀국스케줄</div></th>
            <th><div class="text-nowrap">최저가여행사</div></th>
            <th><div class="text-nowrap">판매금액</div></th>
            <template v-for="x in firstGroup">
              <th><div class="text-nowrap"></div></th>
              <th><div class="text-nowrap">노출여부</div></th>
              <th><div class="text-nowrap">노출가격</div></th>
              <th><div class="text-nowrap">차액금액</div></th>
            </template>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(x, index) in itinerary">
            <td class="fix" v-if="index === 0" :rowspan="itinerary.length"><div class="text-nowrap">ICN/LAX</div></td>
            <td class="fix" v-if="index === 0" :rowspan="itinerary.length"><div class="text-nowrap">0507/0517</div></td>
            <td>
              <div class="text-nowrap">{{ x.outboundLegData.carriers.join('/') }}</div>
              <template v-if="x.outboundLegData.carriers.join('/') !== x.inboundLegData.carriers.join('/')">
                <div class="text-nowrap">+</div>
                <div class="text-nowrap">{{ x.inboundLegData.carriers.join('/') }}</div>
              </template>
            <td v-for="y in ['outboundLegData', 'inboundLegData']">
              <div class="text-nowrap">{{ x[y].flightNumbers.map(v => v.replace(/ /g, '')).join('+') }}</div>
              <div class="text-nowrap">{{ getTime(x[y].departureDateTime) }}/{{ getTime(x[y].arrivalDateTime) }}</div>
              <div class="text-nowrap"><span>비행시간</span> {{ parseInt(x[y].flightTime / 60, 10) }}:{{ $format.zeros(x[y].flightTime % 60) }}</div>
              <div class="text-nowrap"><span>체류시간</span> {{ parseInt((x[y].duration - x[y].flightTime) / 60, 10) }}:{{ $format.zeros((x[y].duration - x[y].flightTime) % 60) }}</div>
              <div v-if="x[y].changeAirport">공항변경</div>
            </td>
            <td>{{ x.agentPriceOptionList.find(v => selectedAgent.indexOf(v.category) >= 0).name }}</td>
            <td>{{ $format.numberFormat(x.agentPriceOptionList.find(v => selectedAgent.indexOf(v.category) >= 0).price) }}</td>
            <template v-for="y in firstGroup">
              <td class="fix" v-if="index === 0" :rowspan="itinerary.length"><div class="text-nowrap">{{ y }}</div></td>
              <td>{{ x.agentPriceOptionList.find(v => v.name === y) ? 'O' : 'X' }}</td>
              <td>{{ getPriceString(x, y, 'price') }}</td>
              <td>{{ getPriceString(x, y, 'differencePrice') }}</td>
            </template>
          </tr>
        </tbody>
      </table>
      <h5 v-if="filteredItinerary.length === 0" style="text-align: center; margin-top: 40px;">결과가 없습니다.</h5>
      <b-button class="more" v-if="(listLength * listPaging) < filteredItinerary.length" @click="listPaging += 1">더보기</b-button>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['allData'],
    data() {
      return {
        listPaging: 1,
        listLength: 20,
        includeChange: true,
        airlineFilter: 'all',
        selectedAgent: [0, 1, 2, 3],
        filter: [
          { text: '국내여행사', value: 1 },
          { text: '해외여행사', value: 2 },
          { text: '항공사', value: 3 },
          { text: '기타', value: 0 },
        ],
      };
    },
    computed: {
      firstGroup() {
        return this.allData.firstGroupAgentList;
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
      itinerary() {
        if (this.allData && this.allData.detailItinerarydataList) {
          const leng = (this.listLength * this.listPaging) > this.filteredItinerary.length ? this.filteredItinerary.length : (this.listLength * this.listPaging);
          return this.filteredItinerary.slice(0, leng);
        }
        return [];
      },
      filteredItinerary() {
        let arr = [];
        if (this.airlineFilter === 'all') {
          arr = this.allData.detailItinerarydataList.filter(z => z.agentPriceOptionList.find(v => this.selectedAgent.indexOf(v.category) >= 0));
        } else if (this.airlineFilter === 'combination') {
          arr = this.allData.detailItinerarydataList.filter(z => z.agentPriceOptionList.find(v => this.selectedAgent.indexOf(v.category) >= 0) && (z.outboundLegData.carriers.length > 1
            || z.inboundLegData.carriers.length > 1 || z.outboundLegData.carriers[0] !== z.inboundLegData.carriers[0]))
        } else {
          arr = this.allData.detailItinerarydataList.filter(z => z.agentPriceOptionList.find(v => this.selectedAgent.indexOf(v.category) >= 0) && (z.outboundLegData.carriers.length === 1
            && z.inboundLegData.carriers.length === 1 && z.outboundLegData.carriers[0] === this.airlineFilter
            && z.inboundLegData.carriers[0] === this.airlineFilter
          ));
        }
        if (!this.includeChange) {
          arr.filter(z => !z.outboundLegData.changeAirport || !z.inboundLegData.changeAirport);
        }
        return arr;
      },
    },
    methods: {
      downloadExcel() {
        const table = document.getElementById('excel_table');
        const styles = '<style></style>';
        const browser = navigator.userAgent.toLowerCase();
        if (browser.indexOf('trident') !== -1) {
          // IE인 경우
          // excel 다운로드 시 파일명
          const saveFileName = "example.xls";
          const oWin = window.open("about:blank", "_blank",  "width=150px; height=150px;");
          oWin.document.write(styles);
          oWin.document.write(table.outerHTML);
          const success = oWin.document.execCommand("SaveAs", false, saveFileName);
          oWin.close();
        } else {
          // IE 외의 브라우저인 경우
          const uri = 'data:application/vnd.ms-excel;base64,';
          const template =  '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' + styles + '</head><body>{table}</body></html>';
          const base64 = function(s){return window.btoa(unescape(encodeURIComponent(s)))}
          const format = function(s, c){return s.replace(/{(\w+)}/g, function(m, p){return c[p];})}
          const ctx = {worksheet : 'example' || 'Worksheet', table : table.outerHTML.split('₩').join('')}
          const a = document.createElement('a');
          a.href = uri + base64(format(template, ctx))
          a.download = 'example.xls';
          a.click();
        }
      },
      getTime(datetime) {
        return datetime.split('T')[1].substr(0, 5);
      },
      getPriceString(x, y, flag) {
        const agent = x.agentPriceOptionList.find(v => v.name === y);
        if (agent && flag === 'price') {
          return this.$format.numberFormat(agent.price);
        } else if (agent && flag === 'differencePrice') {
          const gap = agent.price - x.agentPriceOptionList.find(v => this.selectedAgent.indexOf(v.category) >= 0).price;
          return this.$format.numberFormat(gap);
        }
        return '';
      }
    },
  };
</script>

<style lang="scss">
  .detailDataContent{
    .filter{
      font-size: 14px;
      margin-top: 40px;
      display: flex;
      flex-flow: row wrap;
      > div{
        display: block;
        padding-right: 10px;
        > *{
          word-break: keep-all;
          float: left;
          height: 31px;
          vertical-align: middle;
          margin: 0;
          margin-bottom: 10px;
        }
        > label{
          padding-top: 5px;
          font-weight: bold;
          padding-right: 10px;
        }
        select{
          width: 120px;
        }
        &:first-child{
          width: 195px;
        }
        &:nth-of-type(2){
          width: 415px;
        }
        &:nth-of-type(3){
          width: 275px;
        }
        &:nth-of-type(4){
          width: 195px;
        }
        &:last-child{
          width: 120px;
          padding-right: 0;
          text-align: right;
          button{
            width: 120px;
          }
        }
        fieldset{
          padding-top: 5px;
        }
      }
    }
    .tableWrapper{
      overflow: auto; height: 500px;
      .table{
        margin-bottom: 0;
        font-size: 13px;
        font-weight: normal;
        text-align: center;
        thead{
          th{
            position: sticky;
            top: 0;
          }
        }
        tbody{
          td{
            border: 1px dashed #ccc;
          }
        }
        td{
          padding: 8px;
          vertical-align: middle;
          &.fix{
            position: relative;
            vertical-align: top;
            > div{
              position: sticky;
              top: 218px;
              width: 100%;
              text-align: center;
            }
          }
          .text-nowrap > span{
            padding: 0 4px;
            margin-bottom: 4px;
            display: inline-block;
            background-color: #999;
            color: #FFF;
            border-radius: 4px;
          }
        }
        tr:nth-child(odd){
          background-color: #f2f2f2;
        }
      }
      .more{
        width: 120px;
        margin: 8px 0;
        position: sticky;
        left: 50%;
        margin-left: -60px;
      }
    }
  }
</style>
