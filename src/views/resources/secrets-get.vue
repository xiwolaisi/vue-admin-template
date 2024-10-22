<template>
  <div>
    <div style="padding: 10px">
      命名空间:{{this.ns}} 名称:{{this.name}}
    </div>
    <div style="text-align: center">
      <el-table
          :data="SecretData"
          style="width: 100%"
      >
        <el-table-column label="Key名" width="180">
          <template slot-scope="scope">
            <p>{{scope.row.key}}</p>
          </template>
        </el-table-column>
        <el-table-column label="Value值" width="380">
          <template slot-scope="scope">
            <p @mouseover="()=>base64Decode(scope.row.value,scope.row.key)"
               @mouseleave="()=>showStr(scope.row.value,scope.row.key)"
               :ref="scope.row.key">{{scope.row.value}}</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>

</template>
<script>
import { getSecret } from '@/api/secrets'
export default {
  data(){
    return {
      SecretData:[],
      ns:"",
      name:""
    }
  },
  created() {
    this.ns=this.$route.params.ns
    this.name=this.$route.params.name
    getSecret(this.ns,this.name).then(rsp=>{
      for (let key in rsp.data.Data){
        this.SecretData.push({key,value:rsp.data.Data[key]})
      }
    })
  },
  methods:{
    base64Decode (str,ref) {
      this.$refs[ref].innerHTML=decodeURIComponent(atob(str))
    },
    showStr (str,ref) {
      this.$refs[ref].innerHTML=str
    }
  }
}

</script>

