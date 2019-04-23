<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :style="{width:isshow?'65px':'200px'}">
        <div class="toggle_bar" :style="{width:isshow?'65px':'200px'}" @click="isshow=!isshow">|||</div>
        <el-menu
        background-color="#333744"
        text-color="#fff"
        active-text-color="#ffd04b"
        :unique-opened="true"
        :collapse="isshow"
        :collapse-transition="false"
        >
          <el-submenu index="1" :style="{width:isshow?'65px':'200px'}" >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>
            <el-menu-item index="1-1">选项1</el-menu-item>
            <el-menu-item index="1-2">选项2</el-menu-item>
          </el-submenu>
          <el-submenu index="2" :style="{width:isshow?'65px':'200px'}" >
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>导航二</span>
            </template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      isshow: false
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    display: flex;
    justify-content: space-between;
    padding: 0;
    padding-right: 20px;
    align-items: center;
    background-color: #373d41;
    #logo-box {
      color: #fff;
      font-size: 22px;
      display: flex;
      align-items: center;
      user-select: none;      // 禁止选中文字内容
      img {
        width: 50px;
        height: 50px;
        margin-right: 10px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    .toggle_bar {
      height: 25px;
      background-color: #4a5064;
      text-align: center;
      color: #fff;
      font-size: 12px;
      line-height: 25px;
      letter-spacing: 0.1em;   // 设置字与字之间的间隔
      cursor: pointer;
      user-select: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
