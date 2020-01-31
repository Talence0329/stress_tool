<template>
  <b-tabs>
    <b-tab>
      <template slot="title">
        <i class='icon-list'></i>
      </template>
      <b-list-group class="list-group-accent">
        <b-list-group-item class="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
          HAHA 目前沒用
        </b-list-group-item>
      </b-list-group>
    </b-tab>
    <b-tab>
      <template slot="title">
        <i class='icon-settings'></i>
      </template>
      <b-list-group class="list-group-accent">
        <b-list-group-item class="list-group-item-accent-secondary bg-light text-center font-weight-bold text-muted text-uppercase small">
          系統設定
        </b-list-group-item>
      </b-list-group>
    </b-tab>
  </b-tabs>
</template>

<script>
import Vue from 'vue'
import env from '../env'
import { watch } from 'fs'
export default {
  name: 'DefaultAside'
}
</script>
