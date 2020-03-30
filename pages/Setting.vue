<template>
  <div class="settingWrapper">
    <h4>기본설정</h4>
    <div>국내/해외 OTA 분류</div>
    <div class="saveBtn"><div>
      <b-button @click="submit()" variant="primary">저장</b-button>
    </div></div>
    <div class="flexWrap">
      <div>
        <div>국내OTA<span>{{ agentGroup[0].length }}</span></div>
        <ul>
          <li
            v-for="x in agentGroup[0]"
            :key="x.id"
            @click="clickItem(0, x.id)"
            :class="selected[0].indexOf(x.id) >= 0 ? 'selected' : ''"
          >
            <div>{{ x.name }}</div>
            <button @click.stop :class="x.firstGroup ? 'active' : ''" @click="x.firstGroup = !x.firstGroup">1G</button></li>
        </ul>
      </div>
      <div>
        <div>
          <button @click="move(0, 1)"><b-icon icon="chevron-right" font-scale="2"></b-icon></button>
          <button @click="move(1, 0)"><b-icon icon="chevron-left" font-scale="2"></b-icon></button>
        </div>
      </div>
      <div>
        <div>기타<span>{{ agentGroup[1].length }}</span></div>
        <ul>
          <li
            v-for="x in agentGroup[1]"
            :key="x.id"
            @click="clickItem(1, x.id)"
            :class="selected[1].indexOf(x.id) >= 0 ? 'selected' : ''"
          ><div>{{ x.name }}</div></li>
        </ul>
      </div>
      <div>
        <div>
          <button @click="move(1, 2)"><b-icon icon="chevron-right" font-scale="2"></b-icon></button>
          <button @click="move(2, 1)"><b-icon icon="chevron-left" font-scale="2"></b-icon></button>
        </div>
      </div>
      <div>
        <div>해외OTA<span>{{ agentGroup[2].length }}</span></div>
        <ul>
          <li
            v-for="x in agentGroup[2]"
            :key="x.id"
            @click="clickItem(2, x.id)"
            :class="selected[2].indexOf(x.id) >= 0 ? 'selected' : ''"
          ><div>{{ x.name }}</div></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        temp: {},
        agentGroup: {
          0: [],
          1: [],
          2: [],
        },
        selected: {
          0: [],
          1: [],
          2: [],
        },
      }
    },
    methods: {
      submit() {
        const arr = [];
        Object.keys(this.agentGroup).forEach(v => {
          for(let x = 0; x < this.agentGroup[v].length; x += 1) {
            const category = parseInt(v, 10) === 0 ? 1 : parseInt(v, 10) === 1 ? 0 : 2;
            const isFirst = category !== 1 ? false : this.agentGroup[v][x].firstGroup;
            if (this.agentGroup[v][x].category !== category) {
              const obj = Object.assign({}, this.agentGroup[v][x]);
              obj.category =  category;
              obj.firstGroup = isFirst;
              arr.push(obj);
            } else if (this.temp[this.agentGroup[v][x].id].firstGroup !== isFirst) {
              const obj = Object.assign({}, this.agentGroup[v][x]);
              obj.firstGroup = isFirst;
              arr.push(obj);
            }
          }
        });
        if (arr.length > 0) {
          this.$apis.putOtas(arr).then((resp) => {
            if (resp.data.status === 'Success') {
              alert('저장되었습니다.');
            } else {
              alert('저장에 실패하였습니다. 다시 시도해주세요.');
            }
          }).catch(() => {
            alert('저장에 실패하였습니다. 다시 시도해주세요.');
          });
        } else {
          alert('변경된 내용이 없습니다.');
        }
      },
      clickItem(index, id) {
        if (this.selected[index].indexOf(id) >= 0) {
          this.selected[index].splice(this.selected[index].indexOf(id), 1);
        } else {
          this.selected[index].push(id);
        }
      },
      move(before, after){
        for (let x = 0; x < this.selected[before].length; x += 1) {
          for (let y = 0; y < this.agentGroup[before].length; y += 1) {
            if (this.agentGroup[before][y].id === this.selected[before][x]) {
              const v = this.agentGroup[before][y];
              this.agentGroup[after].push(v);
              this.agentGroup[before].splice(y, 1);
              break;
            }
          }
        }
        this.selected[before] = [];
      }
    },
    mounted() {
      this.$store.commit('setRecentSearchPage', this.$route.path);
      this.$store.commit('setRecentSearchData', [null, null]);

      this.$apis.getOtas().then((resp) => {
        if (resp.data.status === 'Success') {
          resp.data.message.forEach((x) => {
            if (x.id === 0) {
              return;
            }
            let index;
            if (x.category === 0) {
              index = 1;
            } else if (x.category === 1) {
              index = 0;
            } else if (x.category === 2) {
              index = 2
            }
            this.agentGroup[index].push(x);
            this.temp[x.id] = Object.assign({}, x);
          });
        } else {
          alert('기본 정보를 불러오는데 실패했습니다. 이후에 다시 시도해주세요.');
        }
      }).catch(() => {
        alert('기본 정보를 불러오는데 실패했습니다. 이후에 다시 시도해주세요.');
      });
    }
  };
</script>

<style lang="scss">
  .settingWrapper{
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
    .flexWrap{
      margin-top: 40px;
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      > div{
        flex: 1;
        &:nth-of-type(2), &:nth-of-type(4){
          width: 60px;
          flex: 0 0 60px;
          position: relative;
          > div{
            position: absolute;
            top: 50%;
            margin-top: -50px;
            > button{
              background: transparent;
              margin-left: 10px;
              width: 40px;
              height: 40px;
              padding: 0;
              border: none;
              &:first-child{
                margin-bottom: 20px;
              }
            }
          }
        }
        &:nth-of-type(1), &:nth-of-type(3), &:nth-of-type(5){
          > div:first-child{
            > span{
              float: right;
            }
          }
          > ul{
            height: 600px;
            border: 1px solid #999;
            padding: 8px;
            overflow: auto;
            > li{
              position: relative;
              > div{
                margin-bottom: 8px;
                border-radius: 12px;
                transition: .1s ease;
                cursor: pointer;
                border: 1px solid #ddd;
                padding: 8px 12px;
                line-height: 26px;
                width: 100%;
                &:hover{
                  background-color: #f2f2f2;
                }
              }
              &.selected > div{
                background-color: moccasin;
                border-color: moccasin;
              }
            }
          }
        }
        &:nth-of-type(1) {
          ul{
            > li{
              > div{
                padding-right: 62px;
              }
              > button{
                height: 30px;
                width: 50px;
                position: absolute;
                right: 11px;
                top: 7px;
                background-color: white;
                border: 1px solid #dc3545;
                border-radius: 8px;
                transition: .1s ease;
                &:hover{
                  background-color: #f2f2f2;
                }
                &.active{
                  background-color: #dc3545;
                  color: #FFF;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
