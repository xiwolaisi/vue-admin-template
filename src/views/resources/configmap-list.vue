<template>
  <div>
    <el-container v-for="ns in nslist"  >
      <el-header>{{ ns.Name }}</el-header>
      <el-main>
        <el-table
            :data="ingresslist[ns.Name]"
            border
            fit
            highlight-current-row
            :summary-method="getCount"
            show-summary
        >
          <el-table-column align="center" label="序号" width="95">
            <template slot-scope="scope">
              {{ scope.$index+1 }}
            </template>
          </el-table-column>
          <el-table-column label="类型" width="150">
            <template slot-scope="scope">
              <p>{{ scope.row.Type }}</a></p>
            </template>
          </el-table-column>
          <el-table-column label="命名空间" width="100">
            <template slot-scope="scope">
              <p>{{ scope.row.NameSpace }}</a></p>
            </template>
          </el-table-column>
          <el-table-column label="名称" width="150">
            <template slot-scope="scope">
              <p><router-link :to="{name:'ConfigmapGet',
              params:{ns:scope.row.NameSpace,name:scope.row.Name}}">{{ scope.row.Name }}</router-link></p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.CreateTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button type="danger" @click="()=>rmConfigmap(scope.row.NameSpace,scope.row.Name )" icon="el-icon-delete" circle></el-button>
            </template>
          </el-table-column>
        </el-table>
        </el-table>
      </el-main>
    </el-container>
  </div>

</template>
<script>
import { getList  as getNsList } from '@/api/ns'
import { getList  as getSecetsList } from '@/api/configmap'
import { rmConfigmap } from '@/api/configmap'
import { NewClient } from "@/utils/ws"

export default {
  data(){
    return {
      nslist:null,
      svclist:{},
      ingresslist:{},
      wsClient: null
    }
  },
  created() {
    this.wsClient = NewClient()
    getNsList().then(response => {
      this.nslist = response.data  // namespace 列表
      this.nslist.forEach(ns=>{ //循环获取pods
        this.loadIngress(ns.Name)
      })
      // 通过websocket获取,并动态刷新
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'configmap') {
            this.$set(this.ingresslist, object.result.ns, object.result.data)
          }
        }
      }
    })
  },
  methods:{
    loadIngress(ns){
      getSecetsList(ns).then(rsp=>{
        this.$set(this.ingresslist, ns, rsp.data)

      })
    },
    getCount(param){
      const { data } =param
      let podAllNum=0
      const sum=[]
      sum[0] = 'Service合计'
      data.forEach(item=>{
        podAllNum++
      })
      sum[1]=podAllNum
      return sum
    },
    rmConfigmap(ns,name){
      this.$confirm('是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        rmConfigmap(ns,name)
      })
    },
  }
}

</script>
<style>
.bold-text {
  font-weight: bold;
}
.el-header, .el-footer {
  background-color: #7cd1c0;
  color: #fff;
  text-align: center;
  line-height: 60px;

}
</style>
