<template>
  <div class="custom-container">
    <div class="container">
      <div class="filter-container">
        <div class="inline-div">
          <p>标签：</p>
          <el-input v-model="filter.search" placeholder="标签" />
        </div>
        <el-button type="primary" icon="el-icon-search" @click="queryList">查找</el-button>

        <el-button type="primary" icon="el-icon-plus" style="margin-left:100px;" @click="showAttrDialog('tagform')">添加</el-button>

      </div>
      <el-table :key="0" v-loading="isLoading" :data="datas" border fit highlight-current-row style="width: 100%;">
        <el-table-column label="ID" align="center" width="80">
          <template slot-scope="{ row }">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签名称" align="center" width="300">
          <template slot-scope="{ row }">
            <el-input v-model="row.tname" @change="editInlineAction(row)" />
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            <div>{{ row.ttxt }}</div>
          </template>
        </el-table-column>
        <el-table-column label="序号" align="center" width="80">
          <template slot-scope="{ row }">
            <el-input v-model="row.xuhao" @change="editInlineAction(row)" />
          </template>
        </el-table-column>
        <el-table-column label="是否可见" align="center" width="200">
          <template slot-scope="{ row }">
            <el-switch
              v-model="row.ishide"
              active-color="#0fd602"
              inactive-color="#f14756"
              active-text="可见"
              inactive-text="不可见"
              :active-value="1"
              :inactive-value="0"
              @change="editInlineAction(row)"
            />
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="300px" show-overflow-tooltip fixed="right">
          <template slot-scope="row">
            <el-button size="small" @click="showAttrDialog('editform',row)">编辑内容</el-button>
            <el-button type="primary" size="small" @click="showAttrDialog('tagform',row)">修改</el-button>
            <el-button type="danger" size="small" @click="openDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="total > 0" :total="total" :page.sync="page" :limit.sync="limit" @pagination="queryList" />
    </div>

    <copyright class="copyright" />

    <tag-form
      v-if="dialogShow.tagform"
      :visible.sync="dialogShow.tagform"
      :info="fromInfo"
      @closeAlert="closeAlert"
    />

    <edit-form
      v-if="dialogShow.editform"
      :visible.sync="dialogShow.editform"
      :info="fromInfo"
      @closeAlert="closeAlert"
    />

  </div>
</template>

<script>
import baseRoles from '@/baseRoles.js'
import { getTags, delTag, writeTag } from '@/api/tags'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getUserInfo, getRoles } from '../../utils/auth'
import copyright from '@/components/copyright'
import { mapGetters } from 'vuex'

import TagForm from './components/form'
import EditForm from './components/editForm'

export default {
  components: { Pagination, copyright, TagForm, EditForm },
  data() {
    return {
      filter: {
        account: ''
      },
      dialogShow: {
        'tagform': false,
        'editform': false
      },
      routes: [],
      datas: [],
      queryDatas: [],
      fromInfo: {},
      limit: 20,
      page: 1,
      total: 0,
      roles: [], // 当前登录账号roles
      isLoading: true
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
    routesData() {
      return this.routes
    }
  },
  mounted() {
    this.routes = [...baseRoles]
    this.roles = getRoles()
    this.current_id = getUserInfo().id

    this.queryList()
  },
  methods: {
    editInlineAction(row) {
      writeTag(row).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '修改成功',
            type: 'success'
          })
          // this.$emit('closeAlert', 'tagform', true)
        } else {
          this.$message({
            message: res.msg || '修改失败',
            type: 'error'
          })
          this.queryList()
        }
      }, () => {
        this.$message({
          message: '服务器繁忙，请稍后重试！',
          type: 'error'
        })
      })
    },
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
      getTags({
        page: this.page,
        limit: this.limit,
        ...this.filter
      }).then(res => {
        this.isLoading = false
        if (res.code === 0) {
          this.total = res.count || 0
          this.datas = res.data
        } else {
          this.$message({
            message: res.msg || '获取数据失败',
            type: 'error',
            duration: 2000
          })
        }
      }, () => {
        this.$message({
          message: '服务器繁忙，请稍后重试！',
          type: 'error'
        })
      })
    },
    showAttrDialog(name, row) {
      if (row && row.row) {
        this.fromInfo = row.row || {}
      } else {
        this.fromInfo = {}
      }

      this.showDialog(name)
    },
    openDelete(row) {
      this.fromInfo = { ...row.row }
      this.$confirm('确定要删除此标签吗？确定后标签将会永久删除', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.delUser()
        })
        .catch(() => {})
    },
    delUser() {
      delTag({
        id: this.fromInfo.id
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
