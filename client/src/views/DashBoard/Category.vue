<template>
  <div>
    <n-button @click="showAddModal = true">添加</n-button>
    <n-table :bordered="false" :single-line="false">
    <thead>
      <tr>
        <th>编号</th>
        <th>名称</th>
        <th>操作</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(category,index) in categoryList">
        <td>{{ category.id }}</td>
        <td>{{ category.name }}</td>
        <td>
          <n-space>
          <n-button>修改</n-button>
          <n-button>删除</n-button>
         </n-space>
       </td>
          
      </tr>
    </tbody>
  </n-table>

  <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
    <template #header>
      <div>添加分类</div>
    </template>
    <div>
      <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
    </div>
    <template #action>
      <n-button @click="add">提交</n-button>
    </template>
  </n-modal>
  </div>
</template>

<script setup>
import { AdminStore } from '../../stores/AdminStore';

import{ref,reactive,inject,onMounted} from 'vue' 
import { useRouter,useRoute } from 'vue-router';

const message = inject("message")

const axios = inject("axios")
const adminStore = AdminStore()

const router = useRouter()
const route = useRoute()

const showAddModal = ref(false)

const categoryList = ref([])

const addCategory =reactive({
  name:""
})

onMounted(() => {
  loadData()
})

const loadData = async () => {
  let res = await axios.get('/category/list')
  categoryList.value = res.data.rows
}

const add = async() => {
  let res = await axios.post('/category/_token/add',{name:addCategory.name},{headers:{token:adminStore.token}})
  if(res.data.code == 200){
    loadData()
    message.info(res.data.msg)
  }else{
    message.error(res.data.msg)
  }
  showAddModal.value = false;
}

</script>

<style lang="scss" scoped>

</style>