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
              </b-row>
            </div>
            <b-table hover striped bordered small fixed :items="items" :fields="fields">
              <template slot="handle" slot-scope="row">
                <b-btn size="sm" @click="row.toggleDetails" :variant="row.detailsShowing ? 'secondary' : 'outline-info'" class="mr-1">
                  {{ row.detailsShowing ? '隱藏' : '顯示'}}詳情
                </b-btn>
                <b-btn v-on:click.stop='SelectJmeter(row.item)' size="sm" variant="primary" class="mr-1">選擇</b-btn>
              </template>
              <template slot="row-details" slot-scope="row">
                <b-card>
                  <b-form>
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
</div>
</template>

<script>
var axios = require('axios')
export default {
  name: 'selectJmeter',
  components: {},
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
    SelectJmeter: function (jmeter) {
      this.$emit('SelectDone', jmeter)
    }
  }
}
</script>
