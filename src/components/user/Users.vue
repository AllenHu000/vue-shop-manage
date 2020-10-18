<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 功能区：搜索和添加 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            clearable
            v-model="queryInfo.query"
            @clear="getUserList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserList"> </el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表 -->
      <el-table border stripe :data="userList">
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="userStateChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200px">
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
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
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="添加用户"
        :visible.sync="dialogVisible"
        width="30%"
        @close="addDialogClosed"
      >
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username" placeholder="请输入用户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" placeholder="请输入个人邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserConfirm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 添加用户对话框 -->
      <el-dialog
        title="编辑用户"
        :visible.sync="editDialogVisible"
        width="30%"
        @close="editDialogClosed"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules" label-width="70px">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" placeholder="请输入个人邮箱"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="editForm.mobile" placeholder="请输入手机号码"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserConfirm">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    // 验证邮箱规则
    const checkEmail = (rule, value, callback) => {
      // 邮箱校验正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号
    const checkMobile = (rule, value, callback) => {
      // 手机号校验正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|14[57]|15[012356789]|17[678]|18[0-9])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入有效的手机号码'))
    }

    return {
      userList: [], // 用户列表数据
      total: 0, // 列表总数
      // 获取用户列表参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      dialogVisible: false, // 添加用户对话框
      editDialogVisible: false, // 编辑用户对话框
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 编辑用户表单
      editForm: {},
      // 添加用户表单数据校验规则
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '用户名的长度在 3 到 10 个字符之间', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '密码的长度在 6 到 15 个字符之间', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入个人邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 添加用户表单数据校验规则
      editFormRules: {
        email: [
          { required: true, message: '请输入个人邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: checkMobile, trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getUserList()
  },
  mounted() {},
  methods: {
    // 获取列表数据
    getUserList: async function() {
      const { data: res } = await this.$axios.get('users', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败！')
      }
      const { users, total } = res.data
      this.userList = users
      this.total = total
      console.log('users', users)
    },
    // 监听pagesize 改变
    handleSizeChange: function(size) {
      this.queryInfo.pagesize = size
      this.getUserList()
    },
    // 监听页页码改变
    handleCurrentChange: function(page) {
      this.queryInfo.pagenum = page
      this.getUserList()
    },
    // 修改状态
    async userStateChange(info) {
      const { mg_state: state, id } = info
      const { data: res } = await this.$axios.put(`users/${id}/state/${state}`)
      if (res.meta.status !== 200) {
        info.mg_state = !info.mg_state
      }
      this.$message.success('状态更新成功')
    },
    // 关闭添加用户对话框
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 关闭编辑用户对话框
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击确认按钮添加用户
    addUserConfirm() {
      this.$refs.addFormRef.validate(async valid => {
        console.log('valid', valid)
        if (!valid) return false
        const { data: res } = await this.$axios.post('/users', {
          ...this.addForm
        })
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        } else {
          this.$message.success('添加用户成功')
          this.dialogVisible = false
          this.getUserList()
        }
      })
    },
    // 显示编辑对话框
    async showEditDialog(id) {
      const { data: res } = await this.$axios.get('/users' + '/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('查询用户信息失败')
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 确认用户编辑
    editUserConfirm() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return false
        const { data: res } = await this.$axios.put(`/users/${this.editForm.id}`, {
          ...this.editForm
        })
        if (res.meta.status !== 200) {
          this.$message.error('编辑用户失败')
        } else {
          this.$message.success('编辑用户成功')
          this.editDialogVisible = false
          this.getUserList()
        }
      })
    },
    // 删除用户
    removeUserById(id) {
      this.$confirm('此操作将永久删除该用户，是否继续', '提示', {
        confrimButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async res => {
          if (res === 'confirm') {
            const { data: res } = await this.$axios.delete(`/users/${id}`)
            if (res.meta.status !== 200) {
              this.$message.error('删除用户失败')
            } else {
              this.$message.success('删除用户成功')
              this.getUserList()
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
    }
  }
}
</script>

<style lang="less">
.el-table {
  margin-top: 15px;
  font-size: 14px;
}
.el-pagination {
  margin-top: 15px;
  text-align: right;
}
</style>
