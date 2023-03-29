<template>
  <div class="container">
    <n-button @click="back">返回主页</n-button>
    <!-- 标题 -->
    <n-h1>
      {{ blogInfo.title }}
    </n-h1>
    <!-- 内容 -->
    <div class="blog-content">
      <div v-html="blogInfo.content"></div>
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

const blogInfo = ref({})

onMounted(() =>{
  loadBlog()
})

const loadBlog = async() =>{
  let res = await axios.get('/blog/detail?id='+route.query.id)
  console.log(res)
  blogInfo.value = res.data.rows[0]
}

const back = () =>{
  router.push("/")
}

</script>

<style>
.blog-content img{
  max-width: 100%;
}
</style>

<style lang="scss" scoped>

.container{
  width: 1200px;
  margin: 0 auto;
}

img{
  max-width: 100%;
}

</style>