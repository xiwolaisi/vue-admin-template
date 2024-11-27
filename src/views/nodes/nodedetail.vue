<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本信息</span>
      </div>
      <el-form :model="nodeForm" label-width="120px">
        <el-form-item label="名称">
          <el-input v-model="nodeForm.name" readonly></el-input>
        </el-form-item>
        <el-form-item label="Host/IP">
          <el-input v-model="nodeForm.host" readonly></el-input>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>标签 (系统标签请谨慎修改)</span>
        <el-button class="add-button" @click="addLabel">
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
      <el-table
          :data="nodeForm.labels"
          style="width: 100%"
          border
          stripe>
        <el-table-column prop="key" label="Key" width="250">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="Value" width="250">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="removeLabel(scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>污点</span>
        <el-button class="add-button" @click="addTaint">
          <i class="el-icon-plus"></i>
        </el-button>
      </div>
      <el-table
          :data="nodeForm.taints"
          style="width: 100%"
          border
          stripe>
        <el-table-column prop="key" label="Key" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.key"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="value" label="Value" width="150">
          <template slot-scope="scope">
            <el-input v-model="scope.row.value"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="effect" label="Effect" width="150">
          <template slot-scope="scope">
            <el-select v-model="scope.row.effect" placeholder="选择 Effect">
              <el-option label="NoSchedule" value="NoSchedule"></el-option>
              <el-option label="PreferNoSchedule" value="PreferNoSchedule"></el-option>
              <el-option label="NoExecute" value="NoExecute"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="removeTaint(scope.$index)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <div style="text-align: right; margin-top: 10px;">
      <el-button type="primary" @click="saveChanges">保存</el-button>
      <el-button @click="$router.push({ name: 'Nodelist' })" style="margin-left: 10px;">取消</el-button>
    </div>
  </div>
</template>

<script>
import { getNodedetail, postNodedata } from "@/api/node";
export default {
  name: 'NodeDetail',
  data() {
    return {
      nodeNname:'',
      nodeForm: {
        name: '',
        host: '',
        labels: [],
        taints: [] // 初始污点为空
      },
      newTaint: { key: '', value: '', effect: '' }
    };
  },
  created() {
    this.nodeNname = this.$route.params.name
    this.fetchData()
  },
  methods: {
    fetchData() {
      getNodedetail(this.nodeNname).then(response => {
        const data = response.data;
        this.nodeForm.name = data.Name;
        this.nodeForm.host = `${data.HostName}/${data.IP}`;
        this.nodeForm.labels = Object.entries(data.OriginLabels).map(([key, value]) => ({ key, value }));
        this.nodeForm.taints = data.OriginTaints || [];
      });
    },
    addLabel() {
      this.nodeForm.labels.push({ key: '', value: '' });
    },
    removeLabel(index) {
      this.nodeForm.labels.splice(index, 1);
    },
    addTaint() {
      this.nodeForm.taints.push({ ...this.newTaint });
      this.newTaint = { key: '', value: '', effect: '' };
    },
    removeTaint(index) {
      this.nodeForm.taints.splice(index, 1);
    },
    saveChanges() {
      // 构建PostNodeModel对象
      const postData = {
        Name: this.nodeForm.name,
        OriginLabels: this.nodeForm.labels.reduce((acc, label) => {
          acc[label.key] = label.value;
          return acc;
        }, {}),
        OriginTaints: this.nodeForm.taints.map(taint => ({
          key: taint.key,
          value: taint.value,
          effect: taint.effect
        }))
      };
      // 将postData对象转换为JSON字符串
      const postDataJson = JSON.stringify(postData);
      //console.log('保存数据:', postDataJson);
      postNodedata(postDataJson).then(response => {
        this.errorMsg= ''
        alert("成功")
        this.$router.push({ name: 'Nodelist' }); // 成功后跳转到Nodelist路由
      }).catch((error)=>{
        if(error.response){
          this.errorMsg = JSON.stringify(error.response.data)
        }else{
          this.errorMsg = JSON.stringify(error.message)
        }
      });
    },
  }
};
</script>

<style scoped>
.box-card {
  margin: 20px 0;
}
.el-form-item {
  margin-bottom: 20px;
}
.add-button {
  background-color: black;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  margin-left: 10px;
  padding: 0;
}
.add-button .el-icon-plus {
  font-size: 16px;
}
</style>
