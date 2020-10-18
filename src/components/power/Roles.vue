<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级权限 -->
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限、三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{
                      item2.authName
                    }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="13">
                    <el-tag
                      type="warning"
                      closable
                      @close="removeRightById(scope.row, item3.id)"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 序号 -->
        <el-table-column label="序号" type="index"></el-table-column>
        <!-- 列头 -->
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" sizi="mini"> 编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" sizi="mini"> 删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              sizi="mini"
              @click="showSetRightDialog(scope.row)"
            >
              分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="righDialogVisible"
      width="30%"
      @close="setRightDialogClosed"
    >
      <el-tree
        ref="treeRef"
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        default-expand-all
        :default-checked-keys="defaultKey"
        node-key="id"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="righDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allocateRights">配置权限</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roleId: '', // 角色id
      rolesList: [], // 所有角色列表数据
      rightsList: [], // 所有权限数据
      righDialogVisible: false, // 配置权限对话框显示隐藏
      // 树形控件结构
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      defaultKey: [] // 默认选中项
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$axios.get('/roles')
      if (res.meta.status !== 200) {
        this.$message.error('获取角色列表失败')
      }
      this.rolesList = res.data
    },
    /** 删除指定角色指定权限
     *@params role -角色
     *@params authId -权限ID
     */
    removeRightById(role, authId) {
      this.$confirm('此操作将永久删除改权限，是否继续？', '提示', {
        confrimButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async res => {
          if (res === 'confirm') {
            const { data: res } = await this.$axios.delete(`/roles/${role.id}/rights/${authId}`)
            if (res.meta.status !== 200) {
              this.$message.error('删除权限失败')
            } else {
              this.$message.success('删除权限成功')
              role.children = res.data
            }
          }
        })
        .catch(err => {
          if (err === 'cancel') {
            this.$message.info('删除取消')
          } else {
            return err
          }
        })
    },
    // 分配权限
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$axios.get('/rights/tree')
      if (res.meta.status !== 200) {
        this.$message.error('获取权限数据失败')
      }
      this.rightsList = res.data
      this.getLeafKeys(role, this.defaultKey)
      this.righDialogVisible = true
    },
    // 关闭对话框时清空树状图默认选中项
    setRightDialogClosed() {
      this.defaultKey = []
    },
    // 递归获取三级权限ID
    getLeafKeys(node, arr) {
      // 节点不包含children属性，说明是三级权限
      if (!node.children) {
        return arr.push(node.id)
      } else {
        node.children.forEach(item => {
          this.getLeafKeys(item, arr)
        })
      }
    },
    async allocateRights() {
      const checkedKeys = this.$refs.treeRef.getCheckedKeys()
      const halfCheckedKeys = this.$refs.treeRef.getHalfCheckedKeys()
      const keys = [...checkedKeys, ...halfCheckedKeys]
      const idStr = keys.join(',')
      const { data: res } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.righDialogVisible = false
    }
  }
}
</script>

<style lang="less">
.el-tag {
  margin: 8px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>
