<template>
  <div class="container">
    <div class="nav">
    <div @click="homePage">首页</div>
    <div>
      <n-popselect v-model:value="selectedCategory" 
                  :options="categoryOptions" 
                  trigger="click"
                  :on-update:value="changeCategory">
      <div>分类<span>{{ categoryName }}</span></div>
     </n-popselect>
    </div>
    <div @click="dashBoard">后台</div>
    <div style="margin-left:50px">
      <n-space>
    <n-input v-model:value="pageInfo.keyword" :style="{width:'500px'}" placeholder="请输入关键字"/>
    <n-button type="primary" ghost @click="loadBlogs">搜索</n-button>
    </n-space>
    </div>
  </div>
 
  <n-divider />
  
    <div v-for="(blog,index) in blogListInfo" style="margin-buttom:15px; cursor: pointer;">
        <n-card :title="blog.title" @click="toDetail(blog)">
          <div v-html="blog.content"></div>
          <template #footer>
            <n-space align="center">
              <div>发布时间：{{ blog.create_time }}</div>
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
  <n-divider />
  <div class="footer">
    <div>
      Power by xx
    </div>
    <div>
      XICP备
    </div>
  </div>
  </div>
</template>

<script setup>
import{ref,reactive,inject,onMounted,computed} from 'vue' 
import { useRouter,useRoute } from 'vue-router';

const message = inject("message")

const axios = inject("axios")

const router = useRouter()
const route = useRoute()

const selectedCategory = ref(0)

const categoryOptions = ref([])

const blogListInfo = ref([])

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

const changePage = (page) => {
  pageInfo.page = page
  loadBlogs()
}

const changePageSize = (pageSize) => {
  pageInfo.pageSize = pageSize
  pageInfo.page = 1
  loadBlogs()
}

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

const categoryName = computed(() =>{
 let selectedOption =  categoryOptions.value.find((option) =>{
    return option.value == selectedCategory.value
  })
  return selectedOption?selectedOption.label:""
})

const pageInfo = reactive({
  page:1,
  pageSize:3,
  pageCount : 0,
  count : 0,
  keyword:"",
  categoryId :0
})

const loadBlogs = async () =>{
  let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&categoryId=${pageInfo.categoryId}`)
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
  console.log(res)
}



onMounted(() =>{
  loadCategorys()
  loadBlogs()
})

const homePage= () =>{
  router.push("/")
}
const dashBoard = () =>{
  router.push("/login")
}

const toDetail = (blog) =>{
  router.push({path:"/detail",query:{id:blog.id}})
}

const changeCategory = (categoryId) =>{
  pageInfo.categoryId = categoryId
  loadBlogs()
}


</script>

<style lang="scss" scoped>

.container{
  width: 1200px;
  margin:0 auto;
}

.nav{
  display: flex;
  font-size: 20px;
  padding-top:20px;
  color:#64676a;
  
  div{
    cursor: pointer;
    margin-right: 15px;
    &:hover{
      color:#f60;
    }
    span{
      font-size: 12px;
    }
  }


}


.footer{
  text-align: center;
  line-height: 25px;
  color: #64676a;

}

</style>