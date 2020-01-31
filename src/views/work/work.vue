<template>
<div>
  <div class="animated fadeIn">
    <div class='row'>
        <div class='col-sm-12'>
          <b-card>
            <div slot="header">
              <b-row>
                <b-col sm="12" md="4">
                <strong>Work 列表</strong>
                </b-col>
                <b-col sm="12" md="8">
                  <b-btn variant='primary' v-on:click.stop='NewWork()' class="float-right mr-2"><i class='fa fa-dot-circle-o'></i> 新增Work</b-btn>
                </b-col>
              </b-row>
            </div>
            <b-table hover striped bordered small fixed :items="items" :fields="fields">
              <template slot="handle" slot-scope="row">
                <b-btn size="sm" @click="row.toggleDetails" :variant="row.detailsShowing ? 'secondary' : 'outline-info'" class="mr-1">
                  {{ row.detailsShowing ? '隱藏' : '顯示'}}詳情
                </b-btn>
                <b-btn v-if="row.item.isalive === 0" @click="RunWork(row.item)" size="sm" variant="success" class="mr-1">啟動</b-btn>
                <b-btn v-if="row.item.isalive === 1" @click="StopWork(row.item)" size="sm" variant="warning" class="mr-1">停止</b-btn>
                <b-btn v-if="row.item.isalive === 0" :href="row.item.reportUrl" size="sm" target="_blank" variant="info" class="mr-1">開啟報告</b-btn>
                <b-btn v-if="row.item.isalive === 0" :href="row.item.errorUrl" size="sm" target="_blank" variant="warning" class="mr-1">錯誤訊息</b-btn>
                <b-btn v-if="row.item.isalive === 0" @click="DelWork(row.item)" size="sm" variant="danger" class="mr-1">刪除</b-btn>
              </template>
              <template slot="row-details" slot-scope="row">
                <b-card>
                  <b-form>
                    <!-- 報告按鈕 -->
                    <b-row>
                      <b-col sm="12">
                        <b-card no-body style="max-height: 500px;" class="bg-dark mb-1">
                          <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-btn block href="#" v-b-toggle="'processStdout' + row.item.id" variant="dark">執行歷程</b-btn>
                          </b-card-header>
                          <b-collapse :id="'processStdout' + row.item.id" role="tabpanel" style="overflow: auto;">
                            <b-card-body>
                              <template v-for="(item, key) in processStdout[row.item.id]">
                                <p :key="row.item.id + '_stdout' + key" class="card-text">
                                  {{ item }}
                                </p>
                              </template>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </b-col>
                    </b-row>
                    <!-- 參數區域 -->
                    <b-row>
                      <b-col sm="6">
                        <b-form-group>
                          <h5>參數:</h5>
                        </b-form-group>
                        <template v-for="(item, key) in row.item.param">
                          <b-form-group :key="row.item.id + '_param' + key" :label="item.key" :label-cols="3">
                            <b-form-input :value="item.value" disabled></b-form-input>
                          </b-form-group>
                        </template>
                      </b-col>
                      <b-col sm="6">
                        <b-form-group>
                          <h5>遠端:</h5>
                        </b-form-group>
                      </b-col>
                    </b-row>
                  </b-form>
                </b-card>
              </template>
            </b-table>
          </b-card>
        </div>
    </div>
  </div>
  <b-modal id="workFormModal" ref="workFormModal" :hide-footer="true" size="lg" @hide="selectedID = 0;GetList()" :title="formTitle">
    <WorkForm v-on:SaveDone="SaveDone" :selectedID="selectedID"></WorkForm>
  </b-modal>
</div>
</template>

<script>
var axios = require('axios')
import Vue from 'vue'
import WorkForm from './workForm'
export default {
  name: 'work',
  components: {
    WorkForm
  },
  data () {
    return {
      apiUrl: this.API_URL + '/work',
      fields: [
        {key: 'id', label: '編號', sortable: true},
        {key: 'name', label: '名稱', sortable: true},
        {key: 'file', label: '檔案名稱', sortable: true},
        {key: 'handle', label: '操作'}
      ],
      items: [],
      rowData: [],
      selectedID: 0,
      formTitle: '新增Work',
      ws: {},
      registerList: [],
      processStdout: {}
    }
  },
  created: async function () {
    let thisobj = this
    await this.GetList()
    Vue.prototype.$ProcessStdout = function (msg) {
      console.log(msg.process)
      thisobj.processStdout[msg.id].push(msg.process)
      if (msg.process === 'WORK_END_FLAG') {
        alert('工作編號' + msg.id + '已完成')
        thisobj.GetList()
      }
    }
  },
  mounted: function () {
  },
  watch: {
    'rowData': function () {
      this.SortOutData()
    }
  },
  methods: {
    NewWork () {
      this.selectedID = 0
      this.formTitle = '新增Work'
      this.$refs['workFormModal'].show()
    },
    async DelWork (work) {
      if (confirm(`是否刪除"${work.name}"?`)) {
        let delData = {
          do: 'delete',
          where: [{key: 'id', value: work.id}]
        }
        let ret = await this.CallApi(delData)
        if (ret) {
          if (ret.status) {
            alert('刪除成功!')
          } else alert('刪除失敗!')
        } else alert('刪除失敗!')
        await this.GetList()
      }
    },
    async StopWork (work) {
      if (confirm(`是否中止"${work.name}"運行?`)) {
        let stopData = {
          do: 'stop',
          id: work.id
        }
        let ret = await this.CallApi(stopData)
        if (ret) {
          if (ret.status) {
            alert('停止成功!')
          } else alert('停止失敗!')
        } else alert('停止失敗!')
        await this.GetList()
      }
    },
    async RunWork (work) {
      let runData = {
        do: 'excute',
        where: [{key: 'id', value: work.id}]
      }
      let ret = await this.CallApi(runData)
      if (ret) {
        if (ret.status) {
          this.RegisterProcess(work.id)
          alert('執行成功!')
        } else {
          alert(ret.message)
          this.GetList()
        }
      } else alert('執行失敗!')
      await this.GetList()
    },
    async GetList () {
      let listData = {
        do: 'list'
      }
      let ret = await this.CallApi(listData)
      if (ret) {
        if (ret.status) {
          this.rowData = ret.data
        } else this.rowData = []
      } else this.rowData = []
    },
    async CallApi (apiData) {
      let ret = false
      await axios({
        url: this.apiUrl,
        method: 'post',
        data: apiData
      }).then((res) => {
        ret = res.data
      }).catch(error => {
        console.error(error)
      })
      return ret
    },
    SortOutData () {
      if (this.rowData) {
        this.items = this.rowData.map((element) => {
          element.param = typeof element.param === 'string' ? JSON.parse(element.param) : element.param
          element.remote = typeof element.remote === 'string' ? JSON.parse(element.remote) : element.remote
          element.reportUrl = `${this.API_URL}/report/${element.id}`
          element.errorUrl = element.reportUrl + '/Error.txt'
          if (element.isalive && this.registerList.indexOf(element.id) < 0) this.RegisterProcess(element.id)
          if (!this.processStdout[element.id])
            this.$set(this.processStdout, element.id, [])
          return element
        })
      }
    },
    async SaveDone () {
      await this.GetList()
      this.$refs['workFormModal'].hide()
    },
    RegisterProcess (workId) {
      this.$set(this.processStdout, workId, [])
      this.registerList.push(workId)
      this.$WsSend({do: 'register', service: 'process', workId: workId})
    }
  }
}
</script>
