<template>
<div>
  <div class="animated fadeIn">
    <div class='row'>
        <div class='col-sm-12'>
          <b-card>
            <div slot="header">
              <b-row>
                <b-col sm="12" md="4">
                <strong>Jmeter 列表</strong>
                </b-col>
                <b-col sm="12" md="8">
                  <b-btn variant='primary' v-on:click.stop='NewJmeter()' class="float-right mr-2"><i class='fa fa-dot-circle-o'></i> 新增Jmeter</b-btn>
                </b-col>
              </b-row>
            </div>
            <b-table hover striped bordered small fixed :items="items" :fields="fields">
              <template slot="handle" slot-scope="row">
                <b-btn size="sm" @click="row.toggleDetails" :variant="row.detailsShowing ? 'secondary' : 'outline-info'" class="mr-1">
                  {{ row.detailsShowing ? '隱藏' : '顯示'}}詳情
                </b-btn>
                <b-btn @click="EditJmeter(row.item)" size="sm" variant="primary" class="mr-1">修改</b-btn>
                <b-btn @click="DelJmeter(row.item)" size="sm" variant="danger" class="mr-1">刪除</b-btn>
              </template>
              <template slot="row-details" slot-scope="row">
                <b-card>
                  <b-form>
                    <!-- 報告按鈕 -->
                    <b-row align-h="end">
                      <b-col sm="3">
                        <b-form-group><b-button-group>
                          <b-btn :href="row.item.reportUrl" target="_blank" variant="warning">開啟報告</b-btn>
                          <b-btn :href="row.item.errorUrl" target="_blank" variant="danger">錯誤訊息</b-btn>
                        </b-button-group></b-form-group>
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
  <b-modal id="jmeterFormModal" ref="jmeterFormModal" :hide-footer="true" size="lg" @hide="selectedID = 0;GetList()" :title="formTitle">
    <JmeterForm v-on:SaveDone="SaveDone" :selectedID="selectedID"></JmeterForm>
  </b-modal>
</div>
</template>

<script>
var axios = require('axios')
import JmeterForm from './jmeterForm'
export default {
  name: 'jmeter',
  components: {
    JmeterForm
  },
  data () {
    return {
      apiUrl: this.API_URL + '/jmeter',
      fields: [
        {key: 'id', label: '編號', sortable: true},
        {key: 'name', label: '名稱', sortable: true},
        {key: 'file', label: '檔案名稱', sortable: true},
        {key: 'handle', label: '操作'}
      ],
      items: [],
      rowData: [],
      selectedID: 0,
      formTitle: '新增Jmeter',
    }
  },
  created: async function () {
    await this.GetList()
  },
  watch: {
    'rowData': function (val) {
      this.SortOutData()
    }
  },
  methods: {
    NewJmeter: function () {
      this.selectedID = 0
      this.formTitle = '新增Jmeter'
      this.$refs['jmeterFormModal'].show()
    },
    EditJmeter: function (jmeter) {
      this.selectedID = jmeter.id * 1
      this.formTitle = '修改Jmeter'
      this.$refs['jmeterFormModal'].show()
    },
    DelJmeter: async function (jmeter) {
      if (confirm(`是否刪除"${jmeter.name}"?`)) {
        let delData = {
          do: 'delete',
          where: [{key: 'id', value: jmeter.id}]
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
    GetList: async function () {
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
    CallApi: async function (apiData) {
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
    SortOutData: function () {
      if (this.rowData) {
        this.items = this.rowData.map(element => {
          element.param = typeof element.param === 'string' ? JSON.parse(element.param) : element.param
          element.remote = typeof element.remote === 'string' ? JSON.parse(element.remote) : element.remote
          element.reportUrl = `${this.API_URL}/report/${element.id}_${element.file.split('.')[0]}`
          element.errorUrl = element.reportUrl + '/Error.txt'
          return element
        })
      }
    },
    SaveDone: async function () {
      await this.GetList()
      this.$refs['jmeterFormModal'].hide()
    },
  }
}
</script>
