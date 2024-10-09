<template>
  <div>
    <el-container v-for="ns in nslist"  >
      <el-header>{{ ns.Name }}</el-header>
      <el-main>
        <el-table
            :data="svclist[ns.Name]"
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
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
            </template>
          </el-table-column>
          <el-table-column label="名称" width="350">
            <template slot-scope="scope">
              <p>{{ scope.row.Name }}</p>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" width="170" align="center">
            <template slot-scope="scope">
              {{ scope.row.CreateTime }}
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>

</template>
<script>
import { getList  as getNsList } from '@/api/ns'
import { getList  as getSvcList } from '@/api/svc'
import { NewClient } from "@/utils/ws"

export default {
  data(){
    return {
      nslist:null,
      svclist:{},
      wsClient: null
    }
  },
  created() {
    this.wsClient = NewClient()
    getNsList().then(response => {
      this.nslist = response.data  // namespace 列表
      this.nslist.forEach(ns=>{ //循环获取pods
        this.loadSvcs(ns.Name)
      })
      // 通过websocker获取,并动态刷新
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'service') {
            this.$set(this.svclist, object.result.ns, object.result.data)
          }
        }
      }
    })
  },
  methods:{
    loadSvcs(ns){
      getSvcList(ns).then(rsp=>{
        this.$set(this.svclist, ns, rsp.data)

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
    }
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
