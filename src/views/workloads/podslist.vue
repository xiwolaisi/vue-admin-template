<template>
  <div>
    <el-container v-for="ns in nslist"  >
      <el-header>{{ ns.Name }}</el-header>
      <el-main>
        <el-table
            :data="pods[ns.Name]"
            border
            fit
            highlight-current-row
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
import { getList } from "@/api/ns";
import { getPodsByNs } from "@/api/pods";

export default {
  data(){
    return {
      nslist:null,
      pods:{}
    }
  },
  created() {
    getList().then(response => {
      this.nslist = response.data  // namespace 列表
      this.nslist.forEach(ns=>{ //循环获取pods
        this.loadPods(ns.Name)
      })
    })
  },
  methods:{
    loadPods(ns){
      getPodsByNs(ns).then(rsp=>{
        this.$set(this.pods, ns, rsp.data)
      })
    },
    getStatus(isReady){
      if(isReady)
        return "<span class='green'>Active</span>"
      return "<span class='red'>Waiting</span>"
    },
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
