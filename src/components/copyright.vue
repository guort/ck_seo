<template>
  <div id="copyright">
    <p>copyRight 2020&nbsp;,&nbsp;版本号：v {{ version }}</p>
  </div>
</template>

<script>
import defaultSettings from '@/settings'
export default {
  data() {
    return {
      version: ''
    }
  },
  created() {
    this.getVersion()
  },
  methods: {
    getVersion() {
      this.version = defaultSettings['version']
    }
  }
}
</script>
<style lang="scss">
$light_gray: #5d6c7b;
#copyright {
  z-index: 100;
  p {
    margin: 0;
    color: $light_gray;
    font-size: 14px;
    width: 100%;
    padding-left: 10px;
    border-top: 1px solid #CCCCCC;
  }
}
</style>
