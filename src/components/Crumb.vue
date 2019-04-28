<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>{{nav1}}管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{nav2}}列表</el-breadcrumb-item>
    </el-breadcrumb>
  </div>
</template>

<script>
export default {
  props: ['nav1', 'nav2']
}
</script>

<style lang="less" scoped>
</style>
