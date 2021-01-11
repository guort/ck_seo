<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <template v-if="device!=='mobile'">

        <error-log class="errLog-container right-menu-item hover-effect" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip style="display: none;" content="全局字体" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <!-- <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar"> -->
          <span class="account-name">{{ account }},您好</span>
          <i class="el-icon-caret-bottom" />

        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <el-dropdown-item divided @click.native="changePassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog title="修改密码" :visible.sync="showAlert" class="modifypwd-dialog" @close="closeAlert">
      <el-form ref="dataForm">
        <div class="inline-div">
          <span class="email-current">原密码：</span>
          <el-input
            v-model="originPwd"
            show-password
          />
        </div>
        <div class="inline-div">
          <span class="email-current">新密码：</span>
          <el-input
            v-model="newPwd"
            show-password
          />
        </div>
        <div class="inline-div">
          <span class="email-current">确认新密码：</span>
          <el-input
            v-model="cNewPwd"
            show-password
          />
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeAlert">
          取消
        </el-button>
        <el-button type="primary" :loading="loading" @click="confirmChange">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import { getUserInfo } from '../../utils/auth'
// import { changePwd } from '../../api/people'
export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect
  },
  data() {
    return {
      account: '',
      showAlert: false,
      originPwd: '',
      newPwd: '',
      cNewPwd: '',
      loading: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
    ])
  },
  mounted() {
    this.account = getUserInfo()['user']
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    changePassword() {
      this.showAlert = true
    },
    confirmChange() {
      if (!this.originPwd || !this.newPwd || !this.cNewPwd) {
        this.$message.error('请输入密码')
        return
      }
      if (this.newPwd.length < 6 || this.newPwd.length > 12) {
        this.$message.error('密码长度为6-12位')
        return
      }
      if (this.newPwd !== this.cNewPwd) {
        this.$message.error('两次新密码输入不一致')
        return
      }
      this.loading = true
      // changePwd({
      //   oldPassword: this.originPwd,
      //   newPassword: this.newPwd
      // }).then((res) => {
      //   this.loading = false
      //   if (res.code === 200) {
      //     this.$notify({
      //       message: '修改成功',
      //       type: 'success',
      //       duration: 1000
      //     })
      //     this.$router.push({ path: '/' })
      //   }
      // })
    },
    closeAlert() {
      this.showAlert = false
      this.originPwd = this.newPwd = this.cNewPwd = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
  .inline-div {
    margin-top: 20px;
  }
  .email-current {
    display: inline-block;
    width: 120px;
    height: 36px;
    line-height: 36px;
    margin-left: 20px;
  }
  .el-input {
    width: 300px;
    display: inline-block;
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }
    .account-name {
      font-size: 16px;
      margin-right: 5px;
    }
    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 20px;
        }
      }
    }
  }
}
</style>
