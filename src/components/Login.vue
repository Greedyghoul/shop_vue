<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <el-form :model="loginForm" ref="loginFormRef" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :push="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetForm">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginFormRules: {
        username: [
          // required:非空  message:错误提示  trigger:触发校验机制
          { required: true, message: '用户名必填', trigger: 'blur' }
          // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }       长度规则限制
        ],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      // 表单校验没有问题时，才能跳转
      this.$refs.loginFormRef.validate(async valid => {
        // valid:校验成功/失败的标志，true为成功，false为失败
        // console.log(valid)
        if (valid === true) {
          // 表单校验后，要进行真实性校验，即验证用户名和密码是否正确
          // const { data: dt } = await this.$http.post('/login', {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password
          // })
          // 以上简写
          const { data: dt } = await this.$http.post('/login', this.loginForm)
          // console.log(dt)
          // 登录失败提示
          if (dt.meta.status !== 200) {
            return this.$message.error(dt.meta.msg)
          }
          // 登录成功，保存为sessionStorage
          window.sessionStorage.setItem('token', dt.data.token)
          this.$router.push('/home')
        }
      })
    },
    resetForm() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    #logo-box {
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 130px;
      height: 130px;
      padding: 8px;
      border: 1px solid #eee;
      background-color: #fff;
      border-radius: 50%;
      box-shadow: 0 0 10px #eee;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .el-form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 20px;
      box-sizing: border-box;
    }
  }
}
</style>
