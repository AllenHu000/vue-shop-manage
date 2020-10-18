<template>
  <el-container class="container">
    <el-header>
      <div class="logo-wrap">
        <img class="logo" src="@/assets/logo.png" alt="" />
        <span class="title">管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出登录</el-button>
    </el-header>
    <el-container>
      <!-- 侧边菜单栏 -->
      <SelfAside :menuList="menuList" :iconsObj="iconsObj"></SelfAside>
      <!-- body -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import SelfAside from '../components/SelfAside'

export default {
  data() {
    return {
      menuList: [],
      menuIcons: [],
      iconsObj: {
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        103: 'iconfont icon-tijikongjian',
        125: 'iconfont icon-user',
        145: 'iconfont icon-baobiao'
      }
    }
  },
  created() {
    this.getMenuList()
  },
  mounted() {},
  // 引入自定义组件
  components: {
    SelfAside // 侧边菜单栏
  },
  methods: {
    logout: function() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList: async function(params) {
      const { data: res } = await this.$axios.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
}

.logo {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #fff;
  font-size: 20px;

  .logo-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .title {
    margin-left: 15px;
  }
}

.el-main {
  background: #eee;
}
</style>
