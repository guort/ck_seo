<template>
  <div class="container">
    <el-dialog
      width="80%"
      class="container-dialog"
      title="标签信息"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form ref="ruleForm" :model="formInfo" :rules="rules" label-width="120px">
        <el-form-item label="标签名称" prop="tname">
          <el-input v-model="formInfo.tname" class="formInput" />
          <span class="right-span" />
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model="formInfo.xuhao" class="formInput" />
          <span class="right-span" />
        </el-form-item>
        <el-form-item label="是否可见">
          <el-switch
            v-model="formInfo.ishide"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="可见"
            inactive-text="不可见"
            :active-value="1"
            :inactive-value="0"
          />
          <span class="right-span" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="isLoading" @click="sureAction">确定</el-button>
          <el-button @click="cancelAction">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { writeTag, addTag } from '@/api/tags'
export default {
  props: {
    visible: Boolean,
    info: Object
  },
  data() {
    return {
      formInfo: {
        tname: '',
        xuhao: '',
        ishide: 0
      },
      isLoading: false,
      rules: {
        tname: [
          { required: true, message: '请输入标签名称', trigger: 'blur' }
        ]
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
    this.formInfo = this.info
  },
  methods: {
    sureAction() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) { // 编辑用户
          if (this.formInfo['id']) {
            writeTag(this.formInfo).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$emit('closeAlert', 'tagform', true)
              } else {
                this.$message({
                  message: res.msg || '修改失败',
                  type: 'error'
                })
              }
            }, () => {
              this.$message({
                message: '服务器繁忙，请稍后重试！',
                type: 'error'
              })
            })
          } else {
            addTag(this.formInfo).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '新增成功',
                  type: 'success'
                })
                this.$emit('closeAlert', 'tagform', true)
              } else {
                this.$message({
                  message: res.msg || '新增失败',
                  type: 'error'
                })
              }
            }, () => {
              this.$message({
                message: '服务器繁忙，请稍后重试！',
                type: 'error'
              })
            })
          }
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
      this.$emit('closeAlert', 'userform', false)
    }
  }
}
</script>
<style lang="scss" scoped>
  .formInput{
    width:400px;
  }
</style>
