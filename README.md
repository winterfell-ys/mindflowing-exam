## 题干
1. 前端 react 工程，使用 mobx-state-tree 作为状态管理方案，体现计算值，同步和异步 action，驱动 react 视图反映实时状态。
2. 后端 nodejs 工程，使用 typeorm+sqlite 实现完全 typescript 开发的 web 服务，包括建模两张有关联关系的表，实现基本的增删改，包括关系

## 启动
`cd backend && yarn start`
`cd frontend && pnpm dev`

## 功能

### 前端

增: 2个输入框 分别输入任务标题和分配人员id, 点击添加按钮，任务列表.人员列表 分别会新增数据(异步action) 
删: 点击人员删除按钮, 人员列表-1(同步action), 发送删除请求到后端删除此人的任务, 删除成功后, 任务列表-1(异步action)
改: 点击任务列表按钮切换完成状态(异步action), 待办任务列表实时刷新(计算值)
查: 异步action

### 后端
接口增删改成 sqlite持久化
User Task 一对多
| 表名 | 字段名 | 含义描述             |
| ---- | ------ | -------------------- |
| User | id     | 用户的唯一标识       |
| Task | userId | 外键，指向 `User.id` |
删除用户时, 删除此用户下的所有任务

## 其他说明
1. 前端: vite 脚手架初始化, 使用pnpm
2. 后端: npx typeorm init 初始化, 由于pnpm install sqlite3 时不能正常node-gyp, 未深入排查, 故使用yarn
