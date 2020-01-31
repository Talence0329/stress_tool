<template>
    <AppHeader fixed>
      <SidebarToggler class="d-lg-none" display="md" mobile />
      <b-link class="navbar-brand" to="#">
        <img class="navbar-brand-full" src="img/brand/logo.svg" width="89" height="25" alt="CoreUI Logo">
        <img class="navbar-brand-minimized" src="img/brand/sygnet.svg" width="30" height="30" alt="CoreUI Logo">
      </b-link>
      <SidebarToggler class="d-md-down-none" display="lg" :defaultOpen=true />
      <b-navbar-nav class="d-md-down-none">
      </b-navbar-nav>
      <b-navbar-nav class="ml-auto">
        CPU: {{ cpu }}% MEMORY: {{ memory }}
      </b-navbar-nav>
      <AsideToggler class="d-none d-lg-block" />
      <!--<AsideToggler class="d-lg-none" mobile />-->
    </AppHeader>
</template>
<script>
import Vue from 'vue'
import { Header as AppHeader, SidebarToggler, AsideToggler } from '@coreui/vue'
import DefaultHeaderDropdownAccnt from './DefaultHeaderDropdownAccnt'
export default {
  name: 'DefaultHeader',
  components: {
    AsideToggler,
    AppHeader,
    DefaultHeaderDropdownAccnt,
    SidebarToggler
  },
  data () {
    return {
      cpu: 0,
      memory: ''
    }
  },
  created () {
    let thisobj = this
    Vue.prototype.$SystemInfo = function (msg) {
      thisobj.cpu = msg.cpu
      let totalMemory = Math.round(msg.memory / 1024 * 100) / 100
      let useMemeory = (totalMemory * 100 - Math.round(msg.freemem / 1024 * 100)) / 100
      thisobj.memory = `${useMemeory} GB / ${totalMemory} GB`
    }
  },
  mounted () {
  },
  destroyed () {
  },
  methods: {
  }
}
</script>
