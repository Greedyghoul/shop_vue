<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb nav1="权限" nav2="权限"></crumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-table :data="rightsData" border stripe style="width: 100%">
        <el-table-column type="index" label="序号" width="180"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="等级">
          <template slot-scope="info">
            <el-tag v-if="info.row.level == 0">一级</el-tag>
            <el-tag type="success" v-if="info.row.level == 1">二级</el-tag>
            <el-tag type="warning" v-if="info.row.level == 2">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRightsData()
  },
  data() {
    return {
      rightsData: []
    }
  },
  methods: {
    async getRightsData() {
      const { data: dt } = await this.$http.get('rights/list')
      //   console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightsData = dt.data
    }
  }
}
</script>

<style lang="less" scoped>
</style>
