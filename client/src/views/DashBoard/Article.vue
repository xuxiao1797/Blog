<template>
  <n-tabs v-model:value="tabValue" justify-content="start" type="line">
      <n-tab-pane name="list" tab="文章列表">
        <div v-for="(blog,index) in blogListInfo" style="margin-buttom:15px">
        <n-card :title="blog.title">
          {{ blog.content }}

          <template #footer>
            <n-space align="center">
              <div>发布时间：{{ blog.create_time }}</div>
              <n-button @click="toUpdate(blog)">修改</n-button>
              <n-button @click="todelete(blog)">删除</n-button>
            </n-space>
          </template>
        </n-card>
       </div>
       <n-space style="margin-top: 20px;">
           <n-pagination
            v-model:page="page"
            v-model:page-size="pageSize"
            :page-count=pageInfo.pageCount
            show-size-picker
           :page-sizes="pageSizes"
           :on-update:page="changePage"
           :on-update:page-size="changePageSize"/>
       </n-space>

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
      <n-tab-pane name="update" tab="修改">
        <n-form>
          <n-form-item path="age" label="标题">
         <n-input v-model:value="updateArticle.title" placeholder="请输入标题"/>
         </n-form-item>
         <n-form-item path="age" label="分类">
         <n-select v-model:value="updateArticle.categoryId" :options="categoryOptions" />
         </n-form-item>
         
         <n-form-item path="age" label="文章内容">
         <TextEditor v-model="updateArticle.content"></TextEditor>
         </n-form-item>
         <n-form-item path="age" label="">
         <n-button @click="update">提交</n-button>
         </n-form-item>
        </n-form>
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
  categoryId:"",
  content:""
})

let updateArticle = reactive({
  id:0,
  title:"",
  categoryId:"",
  content:""
})

const categoryOptions = ref([])

const blogListInfo = ref([])

const tabValue = ref("list")
const dialog = inject("dialog")

const pageInfo = reactive({
  page:1,
  pageSize:3,
  pageCount : 0,
  count : 0
})

const pageSizes = [
      {
        label: "3 每页",
        value: 3
      },
      {
        label: "5 每页",
        value: 5
      },
      {
        label: "10 每页",
        value: 10
      }
    ];

const loadCategorys = async () =>{
  let res = await axios.get('/category/list')
  categoryOptions.value = res.data.rows.map((item) =>{
    return{
      label:item.name,
      value:item.id
    }
  })

  //console.log(categoryOptions)
}

const loadBlogs = async () =>{
  let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  // console.log(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`)
  // console.log(res)
  let temp_rows = res.data.data.rows
  for(let row of temp_rows){
    row.content +="..."
    let d = new Date(row.create_time)
    row.create_time = `${d.getFullYear()}年${d.getMonth()+1}月${d.getDate()}日`
  }
  blogListInfo.value = res.data.data.rows
  pageInfo.count = res.data.data.count;
  pageInfo.pageCount = parseInt(pageInfo.count / pageInfo.pageSize) + (pageInfo.count % pageInfo.pageSize >0?1:0)
  //console.log(res)
}

onMounted(() => {
  loadBlogs()
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

const changePage = (page) => {
  pageInfo.page = page
  loadBlogs()
}

const changePageSize = (pageSize) => {
  pageInfo.pageSize = pageSize
  loadBlogs()
}

const toUpdate = async (blog) =>{
  tabValue.value = 'update'
  let res = await axios.get('/blog/detail?id='+blog.id)
  updateArticle.id = blog.id
  updateArticle.title = res.data.rows[0].title
  updateArticle.categoryId = res.data.rows[0].category_id
  updateArticle.content = res.data.rows[0].content
}

const update = async() =>{
  let res = await axios.put('/blog/_token/update',updateArticle)
  if(res.data.code == 200){
    message.info(res.data.msg)
    loadBlogs()
    tabValue.value = 'list'
  }else{
    message.error(res.data.msg)
  }
}

const todelete  = async(blog) =>{

  dialog.warning({
          title: '警告',
          content: '是否要删除',
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async() => {
      
            let res = await axios.delete('/blog/_token/delete?id='+blog.id)
            if(res.data.code == 200){
               message.info(res.data.msg)
              loadBlogs()
                tabValue.value = 'list'
               }else{
            message.error(res.data.msg)
              }
          },
          onNegativeClick: () => {
          }
        })
  
}
// const toPage = async(page) =>{
//   console.log(pageInfo)
//   pageInfo.page = page
//   pageInfo.pageSize = pageSize
//   console.log(pageInfo)
//   loadBlogs()
// }

</script>

<style lang="scss" scoped>

</style>