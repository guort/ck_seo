<template>
  <div class="container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ tagInfo.tname }}</span>
      </div>
      <div class="area">
        <div class="line">
          <span>长度：</span>
          <el-select v-model="tagInfo.long" placeholder="请选择">
            <el-option
              v-for="item in lang"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
        <div class="leftBox">
          <div class="label">编辑内容：</div>
          <el-input
            v-model="tagInfo.ttxt"
            :autosize="{ minRows: 20}"
            resize="none"
            type="textarea"
            placeholder="请输入内容"
            class="textBox"
          />
        </div>
        <div class="rightBox">
          <div class="label">生成：</div>
          <el-input
            v-model="tagInfo.result"
            :autosize="{ minRows: 20}"
            readonly
            resize="none"
            type="textarea"
            placeholder="生成"
            class="textBox"
          />
        </div>
      </div>
      <div class="bottom">
        <el-button type="primary" style="display:inline-block;" @click="submit">提交</el-button>
      </div>
    </el-card>

  </div>
</template>

<script>
import { queryTag, editTagSearch } from '@/api/tags'

export default {
  data() {
    return {
      tagInfo: {
        tname: '',
        long: '150',
        ttxt: '',
        result: ''
      },
      editForm: false,
      lang: [
        {
          label: '150',
          value: '150'
        },
        {
          label: '200',
          value: '200'
        }
      ]
    }
  },
  mounted() {
    this.queryList()
  },
  methods: {
    queryList() {
      queryTag().then(res => {
        if (res.code === 0) {
          const data = res.data || []
          const item = data[0] || {}
          this.tagInfo['tname'] = item['tname']
        } else {
          this.$message({
            message: res.msg || '获取失败',
            type: 'error'
          })
        }
      })
    },
    submit() {
      const long = this.tagInfo['long'] || ''
      const ttxt = this.tagInfo['ttxt'] || ''

      this.tagInfo['result'] = ''

      if (!long) {
        this.$message({
          message: '请选择长度',
          type: 'error'
        })
        return
      }

      if (!ttxt) {
        this.$message({
          message: '请输入编辑内容',
          type: 'error'
        })
        return
      }

      editTagSearch({
        long,
        ttxt
      }).then(res => {
        if (res.code === 200) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          const ttxt = res.ttxt || ''
          this.tagInfo['result'] = ttxt
        } else {
          this.$message({
            message: res.msg || '提交成功',
            type: 'error'
          })
        }
      }, () => {})
    },
    closeAlert(name, txt) {
      this.editForm = false

      this.tagInfo['ttxt'] = txt
    }
  }
}
</script>

<style lang="scss" scoped>
  .area{
    width: 100%;
    min-height: 300px;
    white-space: nowrap;
    .leftBox{
      width: 50%;
      display: inline-block;
      vertical-align: top;
    }
    .rightBox{
      width: 50%;
      display: inline-block;
      vertical-align: top;
    }
  }
  .line{
    margin:10px 0;
  }
  .bottom{
    margin-top: 20px;
    text-align: right;
  }
  .textBox{
    height: 100%;
  }
  .label{
    margin:10px 0;
  }
</style>
