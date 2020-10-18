<template>
  <el-aside :width="isCollapse ? '64px' : '150px'">
    <div class="triggle" @click="toggleClloapse">
      <i v-if="!isCollapse" class="iconfont icon-arrow-double-left"></i>
      <i v-else class="iconfont icon-arrow-double-right"></i>
    </div>
    <el-menu
      unique-opened
      router
      :default-active="activePath"
      class="el-menu-vertical-demo"
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      :collapse-transition="false"
      :collapse="isCollapse"
    >
      <el-submenu :index="String(item.id)" v-for="item in menuList" :key="item.id">
        <template slot="title">
          <i :class="iconsObj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item
          :index="'/' + subItem.path"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="saveNavPath('/' + subItem.path)"
        >
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>{{ subItem.authName }}</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: 'selfAside',
  props: {
    menuList: {
      type: Array
    },
    iconsObj: {
      type: Object
    }
  },
  data() {
    return {
      // 是否折叠侧边栏
      isCollapse: false,
      activePath: ''
    }
  },
  created() {
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  mounted() {},
  methods: {
    toggleClloapse: function() {
      this.isCollapse = !this.isCollapse
    },
    // 保存当前激活的菜单链接
    saveNavPath: function(activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less">
.triggle {
  background: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
}
.el-aside {
  background-color: #333544;
  box-sizing: border-box;
}
.iconfont {
  margin-right: 10px;
}
.el-menu {
  border: none;
}
.el-submenu__title,
.el-menu .el-menu--inline {
  width: 150px;
}
</style>
