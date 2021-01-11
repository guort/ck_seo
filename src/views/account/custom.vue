<template>
  <div class="custom-container">
    <div class="container">
      <div class="filter-container">
        <div class="inline-div">
          <p>账号：</p>
          <el-input v-model="filter.search" placeholder="账号" />
        </div>
        <el-button type="primary" icon="el-icon-search" @click="queryList">查找</el-button>

        <el-button type="primary" icon="el-icon-plus" style="margin-left:100px;" @click="showEditDialog">添加</el-button>

      </div>
      <el-table :key="0" v-loading="isLoading" :data="datas" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="序号" width="50px" align="center" type="index">
          <template slot-scope="row">
            <span>{{ row.$index + limit * (page - 1) + 1 }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户名" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.sname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.suser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="密码" align="center" show-overflow-tooltip width="130">
          <template slot-scope="{ row }">
            <span>{{ row.spass }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <span>{{ row.addtime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px" show-overflow-tooltip fixed="right">
          <template slot-scope="row">
            <el-button type="primary" size="small" @click="showEditDialog(row)">修改</el-button>
            <el-button type="danger" size="small" @click="openDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="queryList" />
    </div>

    <copyright class="copyright" />

    <user-form
      v-if="dialogShow.userform"
      :visible.sync="dialogShow.userform"
      :info="accountInfo"
      @closeAlert="closeAlert"
    />

  </div>
</template>

<script>
import { getUsers, delUser } from '@/api/people'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import copyright from '@/components/copyright'
import { mapGetters } from 'vuex'

import UserForm from './components/form'

export default {
  components: { Pagination, copyright, UserForm },
  data() {
    return {
      filter: {
        account: ''
      },
      dialogShow: {
        'userform': false
      },
      datas: [],
      accountInfo: {},
      limit: 20,
      page: 1,
      total: 0,
      isLoading: true
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.queryList()
  },
  methods: {
    showDialog(name) {
      this.dialogShow[name] = true
    },
    closeAlert(name, refresh) {
      this.dialogShow[name] = false
      if (refresh) {
        this.queryList()
      }
    },
    queryList() {
      getUsers({
        page: this.page,
        limit: this.limit,
        ...this.filter
      }).then(res => {
        this.isLoading = false
        if (res.code === 0) {
          this.total = res.count
          this.datas = res.data || []
        } else {
          this.$message({
            message: res.msg || '获取数据失败',
            type: 'error',
            duration: 2000
          })
        }
      })
    },
    showEditDialog(row) {
      if (row && row.row) {
        this.accountInfo = row.row || {}
      } else {
        this.accountInfo = {}
      }

      this.showDialog('userform')
    },
    openDelete(row) {
      this.accountInfo = { ...row.row }
      this.$confirm('确定要删除此帐号吗？确定后账号将会永久删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.delUser()
        })
        .catch(() => {})
    },
    delUser() {
      delUser({
        id: this.accountInfo.id
      }).then(data => {
        if (data['code'] === 200) {
          this.queryList()
          this.$message({
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        } else {
          this.$message({
            message: data.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$light_gray: #5d6c7b;
.custom-container {
  position: relative;
  min-height: calc(100vh - 65px);
  .container {
    padding-bottom: 10px;
  }
  .filter-container {
    padding: 15px;
    .inline-div {
      display: inline-block;
    }
    p {
      margin-left: 5px;
      font-size: 16px;
      color: $light_gray;
      display: inline-block;
    }
    .el-input {
      width: 150px;
      display: inline-block;
    }
  }
  .filter-container::after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: '';
    clear: both;
    height: 0;
    line-height: 0;
  }
  .copyright {
    width: 100%;
    background-color: #ffffff;
    position: fixed;
    bottom: 0px;
    height: 33px;
    line-height: 33px;
  }
}
</style>
