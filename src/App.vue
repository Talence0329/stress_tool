<template>
  <router-view></router-view>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'app',
  data () {
    return {
      ws: null
    }
  },
  mounted () {
    let thisobj = this
    this.InitWebSocket()
    Vue.prototype.$WsSend = function (msg) {
      thisobj.ws.send(JSON.stringify(msg))
    }
  },
  destroyed () {
    this.ws.close()
  },
  methods: {
    InitWebSocket () {
      this.ws = new WebSocket(this.WS_URL)
      this.ws.onmessage = this.OnMessage
      this.ws.onopen = this.OnOpen
      this.ws.onerror = this.OnError
      this.ws.onclose = this.WsClose
    },
    OnOpen () {
    },
    OnError () {
      this.InitWebSocket()
    },
    OnMessage (msg) {
      const message = JSON.parse(msg.data)
      switch (message.type) {
        case 'systeminfo':
          if (this.$SystemInfo)
            this.$SystemInfo(message.data)
          break
        case 'processstdout':
          this.$ProcessStdout(message.data)
          break
        default:
          console.log(message)
          break
      }
    },
    WsClose (e) {
      console.log('connection close', e)
    }
  }
}
</script>

<style lang="scss">
  // CoreUI Icons Set
  @import '~@coreui/icons/css/coreui-icons.min.css';
  /* Import Font Awesome Icons Set */
  $fa-font-path: '~font-awesome/fonts/';
  @import '~font-awesome/scss/font-awesome.scss';
  /* Import Simple Line Icons Set */
  $simple-line-font-path: '~simple-line-icons/fonts/';
  @import '~simple-line-icons/scss/simple-line-icons.scss';
  /* Import Flag Icons Set */
  @import '~flag-icon-css/css/flag-icon.min.css';
  /* Import Bootstrap Vue Styles */
  @import '~bootstrap-vue/dist/bootstrap-vue.css';
  // Import Main styles for this application
  @import 'assets/scss/style';
</style>
