<template>
  <div>
    <div style="margin:30px 0 30px 10px">
      <p><label>Pod总数:</label>
        <span>{{podsNum}}</span>

        <label>就绪:</label>
        <span class="green"> {{ podsReadyNum }}</span>

      </p>

    </div>
    <el-container v-for="ns in nslist"  >
      <el-header>{{ ns.Name }}</el-header>
      <el-main>
        <el-table
            :data="pods[ns.Name]"
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
              <p class="bold-text" v-html="getStatus(scope.row.IsReady)"></p>
            </template>
          </el-table-column>
          <el-table-column label="名称" width="350">
            <template slot-scope="scope">
              <p>{{ scope.row.Name }}</p>
              <p class="red">{{ getMessage(scope.row) }}</p>
            </template>
          </el-table-column>
          <el-table-column label="镜像" width="250" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.Images }}</p>
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
import { getList } from "@/api/ns"
import { getPodsByNs } from "@/api/pods"
import { NewClient } from "@/utils/ws"

export default {
  data(){
    return {
      nslist:null,
      pods:{},
      podsNum:0,
      podsReadyNum:0,
      wsClient: null
    }
  },
  created() {
    this.wsClient = NewClient()
    getList().then(response => {
      this.nslist = response.data  // namespace 列表
      this.nslist.forEach(ns=>{ //循环获取pods
        this.loadPods(ns.Name)
      })
      // 通过websocker获取,并动态刷新
      this.wsClient.onmessage = (e) => {
        if (e.data !== 'ping') {
          const object = JSON.parse(e.data)
          if (object.type === 'pods') {
            this.podsNum = 0;
            this.podsReadyNum = 0
            this.$set(this.pods, object.result.ns, object.result.data)
            // 重新计算所有命名空间的 Pod 总数和就绪数
            this.calculateTotalPods()
          }
        }
      }
    })
  },
  methods:{
    loadPods(ns){
      getPodsByNs(ns).then(rsp=>{
        this.$set(this.pods, ns, rsp.data)
        // 重新计算所有命名空间的 Pod 总数和就绪数
        this.calculateTotalPods()

      })
    },
    getStatus(isReady){
      if(isReady)
        return "<span class='green'>Active</span>"
      return "<span class='red'>Waiting</span>"
    },
    getCount(param){
      const { data } =param
      let podAllNum=0
      const sum=[]
      sum[0] = 'pods合计'
      data.forEach(item=>{
        podAllNum++
      })
      sum[1]=podAllNum
      return sum
    },
    getMessage(row){
      if(!row.IsReady){
        return row.Message
      }
      return ''
    },
    calculateTotalPods() {
      // 遍历所有命名空间的 pods 并更新总计数器
      this.podsNum = 0;
      this.podsReadyNum = 0;
      Object.values(this.pods).forEach(pods => {
        this.podsNum += (pods || []).length;
        this.podsReadyNum += (pods || []).filter(item => item.IsReady).length;
      })
    }
  }
}

</script>
<style>
.red{color: #d20000
}
.green{color:green}
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
