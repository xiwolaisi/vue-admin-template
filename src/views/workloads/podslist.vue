<template>
  <div>
    <el-container v-for="item in nslist" >
      <el-header>{{ item.Name }}</el-header>
      <el-main>
        这里放表格
      </el-main>
    </el-container>
  </div>

</template>
<script>
  import { getList } from "@/api/ns";

  export default {
    data(){
      return {
        nslist:null
      }
    },
    created() {
      getList().then(response => {
        this.nslist = response.data
      })
    }
  }

</script>
<style>
  .el-header, .el-footer {
    background-color: #7cd1c0;
    color: #fff;
    text-align: center;
    line-height: 60px;

  }
</style>
