<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb nav2="角色" nav1="权限"></crumb>

    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-row>
        <el-button type="primary">添加角色</el-button>
      </el-row>
      <!-- 角色列表展示 -->
      <el-table :data="rolesData" border stripe style="width: 100%">
        <!-- 第一级别权限遍历 -->
        <el-table-column type="expand">
          <template slot-scope="info">
            <el-row
              v-for="(v,k) in info.row.son"
              :key="v.id"
              :style="{'border-bottom': '1px solid rgb(235, 238, 245)', 'border-top': k === 0 ? '1px solid rgb(235, 238, 245)' : ''}"
            >
              <el-col :span="6">
                <el-tag closable>{{v.authName}}</el-tag>
                <span class="el-icon-caret-right"></span>
              </el-col>
              <el-col :span="18">
                <el-row
                  v-for="(vv,k)
                  in v.children"
                  :key="vv.id"
                  :style="{'border-top':k===0?'':'1px solid rgb(235, 238, 245)'}"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable>{{vv.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      closable
                    >{{vvv.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述" width="180"></el-table-column>
        <el-table-column label="操作">
          <el-row>
            <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" class="el-icon-setting">分配权限</el-button>
          </el-row>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRolesData()
  },
  data() {
    return {
      rolesData: []
    }
  },
  methods: {
    async getRolesData() {
      const { data: dt } = await this.$http.get('roles')
      //   console.log(dt)
      // 从打印出来的dt数据可以看到，数据列表第一第二序列都包含children属性，与element组件中属性冲突，故需要对此属性名称进行变更
      dt.data.forEach(item => {
        //   item代表遍历出来的每一个小单元
        // console.log(item)
        // 将children的内容赋予son
        item.son = item.children
        // 删除children属性
        delete item.children
      })
      this.rolesData = dt.data
      // console.log(this.rolesData)
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 10px 5px;
}
</style>
