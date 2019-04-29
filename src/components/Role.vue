<template>
  <div>
    <!-- 面包屑导航 -->
    <crumb nav2="角色" nav1="权限"></crumb>

    <!-- 分配权限对话框 -->
    <el-dialog title="角色分配" :visible.sync="setRightsDialog" width="50%">
      <el-form ref="rightsFormRef" :model="rightsForm" label-width="120px">
        <el-form-item label="角色名称：">{{rightsForm.roleName}}</el-form-item>
        <el-form-item label="选取权限：">
          <el-tree
            :data="rightsList"
            :props="treeProps"
            default-expand-all
            show-checkbox
            node-key="id"
            :default-checked-keys="checkedRights"
            ref="treeRef"
          ></el-tree>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialog = false">取 消</el-button>
        <el-button type="primary" @click="saveRights()">确 定</el-button>
      </span>
    </el-dialog>

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
                <el-tag closable @close="delRights(info.row, v.id)">{{v.authName}}</el-tag>
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
                    <el-tag
                      type="success"
                      closable
                      @close="delRights(info.row, vv.id)"
                    >{{vv.authName}}</el-tag>
                    <span class="el-icon-caret-right"></span>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      type="warning"
                      v-for="vvv in vv.children"
                      :key="vvv.id"
                      closable
                      @close="delRights(info.row, vvv.id)"
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
          <template slot-scope="info">
            <el-row>
              <el-button type="primary" size="mini" class="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" class="el-icon-delete">删除</el-button>
              <el-button
                type="warning"
                size="mini"
                class="el-icon-setting"
                @click="setRights(info.row)"
              >分配权限</el-button>
            </el-row>
          </template>
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
      // 角色信息
      rolesData: [],
      // 分配权限对话框显示开关
      setRightsDialog: false,
      // 声明权限分配表单提交所需数据
      rightsForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 分配权限属性空间需求参数
      treeProps: {
        children: 'children', // 子树关联字段
        label: 'authName' // 树节点名称字段
      },
      //! 第三级别权限数据集合  必须数据
      rightsList: [],
      // 默认选中的权限集合
      checkedRights: []
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
    },
    // 删除角色权限
    delRights(roleinfo, rid) {
      // console.log(id)    角色id
      // console.log(rid)   权限id
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: dt } = await this.$http.delete(
            `roles/${roleinfo.id}/rights/${rid}`
          )
          // console.log(dt)
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 删除成功后，提示,并刷新当前角色权限列表
          this.$message.success(dt.meta.msg)
          // 改变角色信息，即可实现不刷新变更当前角色权限信息
          roleinfo.son = dt.data
        })
        .catch(() => {})
    },
    // 点击显示分配权限对话框，并显示角色权限勾选
    async setRights(role) {
      // 获取第三等级权限数组  获取树状图数据
      const { data: dt } = await this.$http.get('rights/tree')
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      this.rightsList = dt.data
      // 显示对话框
      this.setRightsDialog = true
      // 显示表单数据
      this.rightsForm = role
      // 获取默认选中的全选数组  执行递归函数，并将返回值赋予数组
      var rightsArr = []
      this.getCheckedRights(role, rightsArr)
      this.checkedRights = rightsArr
    },
    // 通过递归的方法，获得默认选中的权限数组
    // node:被处理的角色数据
    // arr递归返回的数据，即角色拥有的权限数组
    getCheckedRights(node, arr) {
      // 第一层级权限因之前获取数据时做变更，不含children属性，此时为其添加children成员
      // console.log(node.son)
      if (node.son) {
        node.children = node.son
      }
      // 当角色数据中不再含有children成员时，表明已经找到最底层(第三层级)权限，此时收集所有权限类型放入返回数组中
      if (!node.children) {
        return arr.push(node.id)
      }
      // 对于非第三层级权限，即含有children成员的层级，则继续循环调用函数本身，以继续执行函数找到所有权限
      node.children.forEach(item => {
        this.getCheckedRights(item, arr)
      })
    },
    // 保存修改角色权限树修改
    async saveRights() {
      // 获取角色的权限id
      // 获取全选权限id
      var id1 = this.$refs.treeRef.getCheckedKeys()
      // 获取半选权限id
      var id2 = this.$refs.treeRef.getHalfCheckedKeys()
      // console.log(id1, id2)
      // 将获得的权限id通过concat方法合并后使用','连接，变为字符串格式后发送axios给后段服务器
      var ids = id1.concat(id2).join(',')
      // console.log(ids)
      const { data: dt } = await this.$http.post(
        `roles/${this.rightsForm.id}/rights`,
        { rids: ids }
      )
      // console.log(dt)
      if (dt.meta.status !== 200) {
        return this.$message.error(dt.meta.msg)
      }
      // 成功更新权限后，关闭对话框，提示更新成功，并刷新列表页
      this.$message.success(dt.meta.msg)
      this.setRightsDialog = false
      this.getRolesData()
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
