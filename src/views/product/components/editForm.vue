<template>
  <div class="container">
    <el-dialog
      width="60%"
      class="container-dialog"
      title="编辑"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form ref="ruleForm" :model="formInfo" :rules="rules" label-width="120px">
        <el-form-item label="标签名称">{{ info.tname }}</el-form-item>
        <el-form-item label="输入内容" prop="ttxt">
          <el-input v-model="formInfo.ttxt" :autosize="{ minRows: 15}" type="textarea" placeholder="请输入内容" />
          <span class="right-span" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isLoading" @click="sureAction">确定</el-button>
          <el-button @click="cancelAction">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <show-text
      v-if="showTxt.show"
      :visible.sync="showTxt.show"
      :info="showTxt.txt"
    />

  </div>
</template>
<script>
import { editTag } from '@/api/tags'
import ShowText from './showText'
export default {
  components: {
    ShowText
  },
  props: {
    visible: Boolean,
    info: Object
  },
  data() {
    return {
      formInfo: {
        ttxt: ''
      },
      isLoading: false,
      rules: {
        ttxt: [
          { required: true, message: '请输入内容', trigger: 'blur' }
        ]
      },
      showTxt: {
        show: false,
        txt: ''
      }
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
  mounted() {
    this.formInfo.ttxt = this.info.ttxt || ''
  },
  methods: {
    sureAction() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) { // 编辑
          editTag({
            id: this.info['id'],
            ...this.formInfo
          }).then(res => {
            if (res.code === 200) {
              this.$message({
                message: '编辑成功',
                type: 'success'
              })
              this.$emit('closeAlert', 'editform', true)
            } else {
              this.$message({
                message: res.msg || '编辑失败',
                type: 'error'
              })
            }
          }, () => {})
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelAction() {
      this.formVisible = false
    },
    close() {
      this.$emit('closeAlert', 'editform', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .formInput{
    width:400px;
  }
</style>
