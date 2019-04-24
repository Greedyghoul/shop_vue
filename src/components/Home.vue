<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
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
          :router="true"
        >
          <el-submenu
            :index="item.id + ''"
            :style="{width:isshow?'65px':'200px'}"
            v-for="(item,k) in menuLise"
            :key="item.id"
          >
            <template slot="title">
              <i :class="'iconfont icon-' + iconList[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item
              :index="item2.path"
              v-for="item2 in item.children"
              :key="item2.id"
            >
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  created() {
    // 后台主页加载的时候，即执行函数获取左侧导航数据
    this.getMenuList()
  },
  data() {
    return {
      isshow: false,
      // 接收左侧导航的数据成员
      menuLise: [],
      // 图标系列
      iconList: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    async getMenuList() {
      const { data: dt } = await this.$http('/menus')
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.menuLise = dt.data
    },
    logout() {
      this.$confirm('确认退出登录吗?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          // 退出后，删除token
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        // 此处catch函数必须保留
        .catch(() => {})
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
      user-select: none; // 禁止选中文字内容
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
      letter-spacing: 0.1em; // 设置字与字之间的间隔
      cursor: pointer;
      user-select: none;
    }
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
