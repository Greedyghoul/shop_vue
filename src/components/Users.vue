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
          <el-input
            placeholder="请输入搜索内容"
            class="input-with-select"
            clearable
            v-model="queryData.query"
            @clear="search()"
            @keydown.enter.native="search()"
          >
            <!-- 以上按键修饰符使用native的作用是激活组件原始的内部html特性 -->
            <el-button slot="append" icon="el-icon-search" @click="search()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <!-- 添加新用户 -->
          <el-button type="primary" @click="showAddDialog = true">添加用户</el-button>
          <!-- 对话框 -->
          <el-dialog
            title="添加用户"
            :visible.sync="showAddDialog"
            width="50%"
            center
            @close="resetForm()"
          >
            <el-form
              :model="addRuleForm"
              :rules="addFormRules"
              ref="addFormRef"
              label-width="100px"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addRuleForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="addRuleForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addRuleForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机号" prop="mobile">
                <el-input v-model="addRuleForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="showAddDialog = false">取 消</el-button>
              <el-button type="primary" @click="addUser()">确 定</el-button>
            </span>
          </el-dialog>
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
        <el-table-column prop="address" label="操作">
          <!-- 添加操作按钮 -->
          <!-- 在操作列中，修改、删除、分配角色 按钮都需要获取到当前的每条记录信息，将对应用户ID回传，此时需要使用作用域插槽 -->
          <template slot-scope="info">
            <el-row>
              <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(info.row.id)"
              ></el-button>
              <el-tooltip
                class="item"
                effect="dark"
                content="分配角色"
                placement="top"
                :enterable="false"
              >
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
            </el-row>
          </template>
        </el-table-column>
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
          :total="tot"
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
    var checkMobile = (rule, value, callback) => {
      // 利用正则表达式制定手机号码规则
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 格式错误，返回错误格式
        return callback(new Error('手机号码格式不正确'))
      }
      // 正确，继续执行
      callback()
    }
    return {
      tot: 0,
      tableData: [],
      // 查询用户数据需要提供的请求信息
      queryData: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 2 // 每页显示数据条数
      },
      // 添加用户对话框显示开关
      showAddDialog: false,
      // 添加用户对话框表单规则
      addRuleForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 表单验证规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [{ required: true, message: '请输入邮箱地址', trigger: 'blur' }],
        // 自定义检测规则应用
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
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
      this.tot = dt.data.total
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
    },
    // 关键字搜索
    search() {
      this.getTableData()
    },
    // 关闭对话框时清空表单,故此处关闭事件需要加在对话框上，而不是form上
    resetForm() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        // console.log(valid)
        // console.log(this.addRuleForm)
        if (valid) {
          const { data: dt } = await this.$http.post('users', this.addRuleForm)
          // console.log(dt)
          if (dt.meta.status !== 201) {
            return this.$message.error(dt.meta.msg)
          }
          // 添加成功后，关闭对话框，弹窗提示添加成功，重新获取用户列表
          this.showAddDialog = false
          this.$message.success(dt.meta.msg)
          this.getTableData()
        }
      })
    },
    // 删除用户信息
    delUser(id) {
      // console.log(id)
      this.$confirm('确认删除该用户吗?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // 发送axios正式删除用户信息，并接受返回信息
          const { data: dt } = await this.$http.delete('users/' + id)
          // console.log(dt)
          // 删除成功提示
          this.$message.success(dt.meta.msg)
          // 删除成功后重新获取并刷新数据
          this.getTableData()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
</style>
