<template>
  <div class="container">
    <el-dialog
      width="60%"
      class="container-dialog"
      title="提交成功"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form ref="ruleForm">
        <el-form-item prop="ttxt">
          <el-input v-model="info" :autosize="{ minRows: 15}" readonly type="textarea" placeholder="内容" />
          <span class="right-span" />
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    info: String
  },
  data() {
    return {
    }
  },
  computed: {
    formVisible: {
      get() {
        return this.visible
      },
      set(s) {
        this.$emit('update:visible', s)
      }
    }
  },
  methods: {
    close() {
      this.$emit('closeAlert', 'editform', false)
    }
  }
}
</script>
