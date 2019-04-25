<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 搜索区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入搜索内容" class="input-with-select">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格区 -->
      <el-table :data="tableData" stripe style="width: 100%" border>
        <el-table-column type="index" label="序号" width="60"></el-table-column>
        <el-table-column prop="username" label="用户名" width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号码" width="120"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="160"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="100">
          <!-- 此处为难点重点记忆 -->
          <el-switch v-model="info.row.mg_state" slot-scope="info"></el-switch>
          <!-- <span slot-scope="info">{{info.row}}</span> -->
        </el-table-column>
        <el-table-column prop="address" label="操作"></el-table-column>
      </el-table>

      <!-- 分页区 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.pagenum"
          :page-sizes="[2, 5, 10, 20]"
          :page-size="2"
          layout="total, sizes, prev, pager, next, jumper"
          :total="4"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getTableData()
  },
  data() {
    return {
      tableData: [],
      // 查询用户数据需要提供的请求信息
      queryData: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示数据条数
      }
    }
  },
  methods: {
    // 获取用户列表信息
    async getTableData() {
      const { data: dt } = await this.$http.get('/users', {
        params: this.queryData
      })
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.tableData = dt.data.users
    },
    // 切换分页显示数据条数触发的回调函数
    handleSizeChange(arg) {
      // console.log(arg)
      this.queryData.pagesize = arg
      this.getTableData()
    },
    // 当前页码变化触发的回调函数
    handleCurrentChange(arg) {
      // console.log(arg)
      this.queryData.pagenum = arg
      this.getTableData()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
