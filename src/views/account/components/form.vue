<template>
  <div class="container">
    <el-dialog
      width="80%"
      class="container-dialog"
      title="用户信息"
      :visible.sync="formVisible"
      :close-on-click-modal="false"
      @close="close"
    >
      <el-form ref="ruleForm" :model="accountInfo" :rules="rules" label-width="120px">
        <el-form-item label="账号" prop="suser">
          <el-input v-model="accountInfo.suser" class="formInput" />
          <span class="right-span">(20个字符内数字和字母的组合)</span>
        </el-form-item>
        <el-form-item label="账号密码" prop="spass">
          <el-input v-model="accountInfo.spass" show-password class="formInput" />
          <span class="right-span">(6-12个字符，字母区分大小写)</span>
        </el-form-item>
        <el-form-item label="用户名" prop="sname">
          <el-input v-model="accountInfo.sname" class="formInput" />
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
import { editUser, addUsers } from '@/api/people'
export default {
  props: {
    visible: Boolean,
    info: Object
  },
  data() {
    return {
      accountInfo: {
        id: '',
        suser: '',
        spass: '',
        sname: ''
      },
      isLoading: false,
      rules: {
        suser: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        spass: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ],
        sname: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
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
    this.accountInfo = this.info
  },
  methods: {
    sureAction() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) { // 编辑用户
          if (this.accountInfo['id']) {
            editUser(this.accountInfo).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
                this.$emit('closeAlert', 'userform', true)
              } else {
                this.$message({
                  message: res.msg || '修改失败',
                  type: 'error'
                })
              }
            }, () => {})
          } else {
            addUsers(this.accountInfo).then(res => {
              if (res.code === 200) {
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.$emit('closeAlert', 'userform', true)
              } else {
                this.$message({
                  message: res.msg || '添加失败',
                  type: 'error'
                })
              }
            }, () => {})
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
