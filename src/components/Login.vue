<template>
  <div class="container">
    <div class="box">
      <!-- 头徽 -->
      <div class="avatar">
        <img src="@/assets/logo.png" alt="#" />
      </div>
      <!-- 表单区域 -->
      <el-form ref="loginFormRef" class="form" :model="loginForm" :rules="loginFormRules">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            placeholder="请输入登录用户名称"
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            placeholder="请输入登录密码"
            prefix-icon="iconfont icon-password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btn-wrap">
          <el-button type="primary" @click="login">确定</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录用户名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 重置登录表单数据
    resetLoginForm: function() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login: function() {
      this.$refs.loginFormRef.validate(async (validateRes, msg) => {
        // eslint-disable-next-line no-useless-return
        if (!validateRes) return
        const { data: res } = await this.$axios.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('请求失败！')
        }
        this.$message.success('登录成功！')
        const { token } = res.data
        window.sessionStorage.setItem('token', token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  background: #2b4b6b;
  height: 100%;
}

.box {
  position: relative;
  width: 450px;
  height: 300px;
  background: #fff;
  border-radius: 5px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  .avatar {
    height: 130px;
    width: 130px;
    border-radius: 50%;
    border: 1px solid #eee;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: relative;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;

    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
  .form {
    padding: 20px;
    transform: translate(0, -30%);

    .btn-wrap {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
