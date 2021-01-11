<template>
  <div class="login-container">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
      <!-- <img :src="logo" class="logo"> -->
      <div class="title-container"><h3 class="title">智能设备管理系统</h3></div>
      <div>
        <el-form-item prop="username">
          <span class="svg-container"><svg-icon icon-class="user" /></span>
          <el-input ref="username" v-model="loginForm.account" placeholder="请输入用户名" name="account" type="text" tabindex="1" autocomplete="on" />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container"><svg-icon icon-class="password" /></span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd"><svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" /></span>
          </el-form-item>
        </el-tooltip>
        <!-- <p class="forget-password"><span @click="handlerForgetPassword">忘记密码？</span></p> -->
        <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
        <!-- <p class="copyright"></p> -->
      </div>
    </el-form>
    <el-dialog title="密码重置" :visible.sync="forgetPasswordAlert" class="forget-dialog">
      <div class="inline-div">
        <span class="email-current">您的账号：</span>
        <el-input v-model="forgetAccount" type="text" />
      </div>
      <div class="inline-div">
        <span class="email-current">您的注册邮箱：</span>
        <el-input v-model="forgetEmail" type="text" />
        <el-button type="primary" :loading="loading" @click="getEmail">提示</el-button>
      </div>
      <div v-if="getEmailText" class="inline-div" style="margin-top: -10px;">
        <span class="email-current" />
        <span>{{ getEmailText }}</span>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handlerCloseForgetPasswordAlert">取消</el-button>
        <el-button type="primary" :loading="loading2" @click="getPassword">发送新密码</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validUsername, validUserPassword } from '@/utils/validate'
import { Message } from 'element-ui'
import { forgetPwd, getEmail } from '@/api/people'
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确格式的用户名-至少5位'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (!validUserPassword(value)) {
        // callback(new Error('请输入正确格式的密码(6-12位)'))
        callback()
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      loading2: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      forgetPasswordAlert: false,
      forgetEmail: '',
      getEmailText: '',
      forgetAccount: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(res => {
              if (res.code === 200) {
                // if (this.redirect === '/') {
                if (this.$router.options.routes && this.$router.options.routes.length > 0) {
                  this.loginForm.account = ''
                  this.loginForm.password = ''
                  var firstPath = this.$router.options.routes[0].path
                  var secondPath = ''
                  if (this.$router.options.routes[0].children[0]['children']) {
                    secondPath = this.$router.options.routes[0].children[0].path + '/' + this.$router.options.routes[0].children[0]['children'][0].path
                  } else {
                    secondPath = this.$router.options.routes[0].children[0].path
                  }
                  var path = firstPath + '/' + secondPath
                  this.$router.options.routes[0].path
                  this.$router.push({ path: path, query: this.otherQuery })
                } else {
                  this.$message({
                    message: '当前账号没有任何权限，请联系管理员授权',
                    type: 'error',
                    duration: 2000
                  })
                }

                // } else {
                //   this.$router.push({ path: this.redirect || this.$router.options.routes[0].path, query: this.otherQuery })
                // }
              } else {
                this.$message({
                  message: res.msg,
                  type: 'error',
                  duration: 2000
                })
              }
              this.loading = false
            })
            .catch(e => {
              this.loading = false
            })
        } else {
          Message.error('请输入正确的用户名和密码')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    handlerForgetPassword() {
      this.forgetPasswordAlert = true
    },
    handlerCloseForgetPasswordAlert() {
      this.forgetPasswordAlert = false
      this.forgetEmail = ''
      this.getEmailText = ''
      this.forgetAccount = ''
    },
    getEmail() {
      this.loading = true
      getEmail({
        account: this.forgetAccount
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.getEmailText = res.data.email
        } else {
          this.$message({
            message: res.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    getPassword() {
      this.loading2 = true
      forgetPwd({
        account: this.forgetAccount,
        email: this.forgetEmail
      }).then(res => {
        this.loading2 = false
        if (res.code === 200) {
          this.handlerCloseForgetPasswordAlert()
          Message.success('您的新密码已经发送至您的邮箱，请及时查收')
        } else {
          this.$message({
            message: res.message,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .login-form .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .login-form {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;

      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 100px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .forget-password {
    width: 100%;
    text-align: right;
    color: #fff;
    cursor: pointer;
  }
  .copyright {
    width: 100%;
    text-align: center;
    color: #fff;
    margin-top: 50px;
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .logo {
    display: block;
    margin: 0 auto;
    width: 300px;
  }
  .title-container {
    position: relative;
    margin-top: 50px;
    .title {
      display: none;
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: 600;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>

<style lang="scss" scoped>
$light_gray: #5d6c7b;
.forget-dialog {
  .el-input {
    display: inline-block;
    width: 300px;
  }
  .inline-div {
    width: 100%;
    margin-top: 20px;
  }
  .email-current {
    color: $light_gray;
    font-size: 16px;
    display: inline-block;
    width: 120px;
    margin-left: 20px;
    height: 36px;
    line-height: 36px;
  }
}
</style>
