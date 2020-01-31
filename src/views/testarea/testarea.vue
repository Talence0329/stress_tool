<template>
  <div class="animated fadeIn">
  </div>
</template>

<script>
  export default {
    name : 'testarea',
    data() {
      return {
        ws: null,
      }
    },
    created() {
      this.InitWebSocket()
    },
    destroyed() {
      this.ws.close()
    },
    methods: {
      InitWebSocket () {
        const wsuri = "ws://192.168.0.142:8889";
        this.ws = new WebSocket(wsuri);
        this.ws.onmessage = this.OnMessage;
        this.ws.onopen = this.OnOpen;
        this.ws.onerror = this.OnError;
        this.ws.onclose = this.WsClose;
      },
      OnOpen () {
        let actions = {"test":"12345"}
        this.WsSend(JSON.stringify(actions))
      },
      OnError () {
        this.InitWebSocket()
      },
      OnMessage (e) {
        const redata = JSON.parse(e.data)
        console.log(redata)
      },
      WsSend (data) {
        console.log(data)
        this.ws.send(data)
      },
      WsClose (e) {
        console.log('connection close',e)
      },
    },
  }
</script>