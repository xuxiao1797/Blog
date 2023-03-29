<template>
  <n-tabs default-value="add" justify-content="start" type="line">
      <n-tab-pane name="oasis" tab="Oasis">
        Wonderwall
      </n-tab-pane>
      <n-tab-pane name="add" tab="添加文章">
        <n-form>
          <n-form-item path="age" label="标题">
         <n-input v-model:value="addArticle.title" placeholder="请输入标题"/>
         </n-form-item>
         <n-form-item path="age" label="分类">
         <n-select v-model:value="addArticle.categoryId" :options="categoryOptions" />
         </n-form-item>
         
         <n-form-item path="age" label="文章内容">
         <TextEditor v-model="addArticle.content"></TextEditor>
         </n-form-item>
         <n-form-item path="age" label="">
         <n-button @click="add">提交</n-button>
         </n-form-item>
        </n-form>
      </n-tab-pane>
      <n-tab-pane name="jay chou" tab="周杰伦">
        七里香
      </n-tab-pane>
    </n-tabs>
</template>

<script setup>

import{ref,reactive,inject,onMounted} from 'vue' 
import{AdminStore} from '../../stores/AdminStore'
import { useRouter,useRoute } from 'vue-router';
import TextEditor from '../../components/TextEditor.vue'
import { addYears } from 'date-fns';

const message = inject("message")

const axios = inject("axios")
const adminStore = AdminStore()

const router = useRouter()
const route = useRoute()

let addArticle = reactive({
  title:"",
  categoryId:0,
  content:""
})
const categoryOptions = ref([])

const loadCategorys = async () =>{
  let res = await axios.get('/category/list')
  categoryOptions.value = res.data.rows.map((item) =>{
    return{
      label:item.name,
      value:item.id
    }
  })

  console.log(categoryOptions)
}

onMounted(() => {
  loadCategorys()
})

const add = async() => {
  let res = await axios.post('/blog/_token/add',addArticle)
  if(res.data.code == 200){
    message.info(res.data.msg)
    addArticle.title = ""
    addArticle.categoryId = 0
    addArticle.content = ""
  }else{
    message.error(res.data.msg)
  }
}

</script>

<style lang="scss" scoped>

</style>