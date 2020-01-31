<template>
<div>
  <div class="animated fadeIn">
    <b-row>
      <b-col md="12">
        <b-card>
          <b-form>
            <b-row>
              <b-col sm="12" md="10" lg="8">
                <b-form-group>
                  <b-btn variant="primary" v-on:click.stop='SelectJmeter()'>選擇Jmeter</b-btn>
                </b-form-group>
                <b-form-group label="名稱" :label-cols="3">
                  <b-form-input v-model="name"></b-form-input>
                </b-form-group>
                <b-form-group label="描述" :label-cols="3">
                  <b-form-textarea v-model="describe"></b-form-textarea>
                </b-form-group>
                <b-form-group label="檔案" :label-cols="3">
                  <p>{{ fileName }}</p>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-card>
                  <div slot="header">
                    <b-row>
                      <b-col sm="6">
                      <strong>參數：</strong>
                      </b-col>
                      <b-col sm="6">
                        <b-btn variant="primary" v-on:click.stop='AddParam()' class="float-right">新增</b-btn>
                      </b-col>
                    </b-row>
                  </div>
                  <template v-for="(item, key) in param">
                    <b-row :key="'param-' + key">
                      <b-col sm="4">
                        <b-form-input v-model="item.key"></b-form-input>
                      </b-col>
                      <b-col sm="7">
                        <b-form-input v-model="item.value"></b-form-input>
                      </b-col>
                      <b-col sm="1">
                        <b v-on:click.stop='DelParam(key)' :style="'font-size: 25px;color: red;cursor: pointer;'">X</b>
                      </b-col>
                    </b-row>
                  </template>
                </b-card>
                <b-card>
                  <div slot="header">
                    <b-row>
                      <b-col sm="6">
                      <strong>遠端：</strong>
                      </b-col>
                      <b-col sm="6">
                        <b-btn variant="primary" v-on:click.stop='AddRemote()' class="float-right">新增</b-btn>
                      </b-col>
                    </b-row>
                  </div>
                  <template v-for="(item, key) in remote">
                    <b-row :key="'param-' + key">
                      <b-col sm="5">
                        <b-form-group label="遠端名稱" :label-cols="4">
                          <b-form-input v-model="item.name"></b-form-input>
                        </b-form-group>
                      </b-col>
                      <b-col sm="1"></b-col>
                      <b-col sm="5">
                        <b-form-group label="IP" :label-cols="2">
                        <b-form-input v-model="item.ip"></b-form-input>
                        </b-form-group>
                      </b-col>
                      <b-col sm="1">
                        <b v-on:click.stop='DelRemote(key)' :style="'font-size: 25px;color: red;cursor: pointer;'">X</b>
                      </b-col>
                    </b-row>
                  </template>
                </b-card>
              </b-col>
            </b-row>
            <div slot="footer">
              <b-btn variant='primary' v-on:click.stop='Save()' class="float-right">儲存</b-btn>
            </div>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
  <b-modal id="selectJmeterModal" ref="selectJmeterModal" :hide-footer="true" :title="'選擇Jmeter'" size="lg">
    <SelectJmeter v-on:SelectDone="SelectDone"></SelectJmeter>
  </b-modal>
</div>
</template>

<script>
var axios = require('axios')
import SelectJmeter from '../component/selectJmeter'
export default {
  name: 'workForm',
  components: {
    SelectJmeter
  },
  props: {
    selectedID: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      apiUrl: this.API_URL + '/work',
      id: '',
      JT_id: '',
      name: '',
      file: '',
      fileName: '',
      describe: '',
      param: [],
      remote: []
    }
  },
  created: async function () {
    if (this.selectedID !== 0) {
      let data = await this.GetData()
      Object.keys(data).forEach(element => {
        this[element] = data[element]
        if (element == 'param') {
          this[element] = JSON.parse(data[element])
        }
        if (element == 'remote') {
          this[element] = JSON.parse(data[element])
        }
      })
    }
  },
  watch: {
    selectedID: async function () {
      this.ClearData()
    }
  },
  methods: {
    SelectJmeter: function () {
      this.$refs['selectJmeterModal'].show()
    },
    AddParam: function () {
      this.param.push({key: '', value: ''})
    },
    DelParam: function (key) {
      this.param.splice(key, 1)
    },
    AddRemote: function () {
      this.remote.push({name: '', ip: ''})
    },
    DelRemote: function (key) {
      this.remote.splice(key, 1)
    },
    Save: async function () {
      let saveData
      if (this.selectedID === 0) {
        // 新增
        saveData = {
          do: 'create',
          data: {
            JT_id: this.JT_id,
            name: this.name,
            describe: this.describe,
            file: this.file,
            param: JSON.stringify(this.param),
            remote: JSON.stringify(this.remote),
            isalive: 0
          }
        }
      } else {
        // 修改
        saveData = {
          do: 'update',
          data: {
            id: this.id,
            JT_id: this.JT_id,
            name: this.name,
            describe: this.describe,
            file: this.file,
            param: JSON.stringify(this.param),
            remote: JSON.stringify(this.remote),
            isalive: 0
          }
        }
      }

      let ret = await this.CallApi(saveData)
      if (ret) {
        if (ret.status) {
          alert('儲存成功!')
          this.$emit('SaveDone')
        } else alert('儲存失敗!')
      } else alert('儲存失敗!')
    },
    GetData: async function () {
      let result = {}
      let getData = {
        do: 'get',
        data: {
          where: [
            {key: 'id', value: this.selectedID}
          ]
        }
      }

      let ret = await this.CallApi(getData)
      if (ret) {
        if (ret.status) {
          result = ret.data
        } else alert('取得資料失敗!')
      } else alert('取得資料失敗!')

      return result
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
    ClearData: function () {
      this.name = ''
      this.file = ''
      this.fileName = ''
      this.describe = ''
      this.param = []
      this.remote = []
    },
    SelectDone: async function (jmeter) {
      this.JT_id = jmeter.id
      this.name = jmeter.name
      this.describe = jmeter.describe
      this.file = jmeter.file
      this.fileName = jmeter.file
      this.param = jmeter.param
      this.remote = jmeter.remote
      this.$refs['selectJmeterModal'].hide()
    }
  }
}
</script>