<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>基本配置</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="RoleBinding名称">
          <el-input v-model="matadata.name" placeholder="RoleBinding名称"></el-input>
        </el-form-item>
        <el-form-item label="命名空间">
          <el-select v-model="matadata.namespace" @change="changeNs">
            <el-option v-for="ns in namespaces" :label="ns.Name" :value="ns.Name" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择角色</span>
      </div>
      <el-form :inline="true">
        <el-form-item label="选择角色">
          <el-select v-model="roleRef.name">
            <el-option v-for="role in  rolelist" :label="role.Name" :value="role.Name" />
          </el-select>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>选择用户</span>
      </div>
      <el-form v-for="(subject, index) in subjects" :key="index" :inline="true">
        <el-form-item label="选择用户">
          <el-select v-model="subject.kind" @change="KindChange(subject, index)">
            <el-option v-for="v in userkind"
                :label="v"
                :value="v">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="subject.kind === 'User'" label="用户名">
          <el-input v-model="subject.name"></el-input>
        </el-form-item>
        <el-form-item v-else-if="subject.kind === 'ServiceAccount'" label="用户名">
            <el-select v-model="subject.name">
              <el-option v-for="sa in serviceAccounts" :label="sa.Name" :value="sa.Name" />
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-button type="primary" @click="addSub" v-if="index === subjects.length - 1">+</el-button>
        <el-button type="danger" @click="removeSub(index)" v-else>-</el-button>
      </el-form>
    </el-card>
    <div style="text-align: center; margin-top: 20px;">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getList as getNsList } from '@/api/ns';
import { getResources } from '@/api/resources';
import { getRolesByNs } from "@/api/roles";
import { getSAsByNs } from "@/api/serviceaccounts";
import {CreateRoleBinding} from "@/api/rolebindings";

const apiGroup="rbac.authorization.k8s.io"
export default {
  data() {
    return {
      matadata:{name:"",namespace:""},
      userkind:["User","ServiceAccount"],
      serviceAccounts:[],
      rolelist:[],
      namespaces: [],
      subjects:[
        { apiGroup,kind:"User",name:"" }
      ],
      roleRef: { apiGroup,kind:"Role",name:"" },
    };

  },
  async created() {
    try {
      const nsRsp = await getNsList();
      this.namespaces = nsRsp.data;
      const resRsp = await getResources();
      this.resources = resRsp.data;
    } catch (error) {
      console.error(error);
    }
  },
  methods: {
    loadNamespaces() {
      getNsList().then(rsp => {
        this.namespaces = rsp.data;
      });
    },
    changeNs(ns) {
      this.matadata.namespace = ns;
      this.loadRoles(ns);
      this.loadserviceaccounts(ns);
    },
    loadRoles(ns) {
      getRolesByNs(ns).then(rsp => {
       this.rolelist = rsp.data;
      });
    },
    loadserviceaccounts(ns) {
      getSAsByNs(ns).then(rsp => {
        this.serviceAccounts = rsp.data;
      });
    },
    KindChange(subject, index) {
      if (subject.kind === "ServiceAccount") {
        // 清空当前 name 字段
        this.$set(this.subjects, index, { ...subject, name: this.serviceAccounts[0].Name });
      } else {
        this.$set(this.subjects, index, { ...subject, name: "" });
      }
    },
    addSub(index) {
      this.subjects.push({ apiGroup,kind:"User",name:"" });
    },
    removeSub(index) {
      this.subjects.splice(index, 1);
    },
    save() {
      const postData = {
        metadata:{
          name: this.matadata.name,
          namespace:this.matadata.namespace
        },
        subjects: this.subjects.map(subject => {
          let aGroup = "";
          if (subject.kind === "User") {
            aGroup = "rbac.authorization.k8s.io";
          } // 对于 ServiceAccount，apiGroup 为空，默认值即可
          return { name: subject.name, kind: subject.kind, apiGroup: aGroup };
        }),
        roleRef: {
          name: this.roleRef.name,
          kind: this.roleRef.kind,
          apiGroup: apiGroup
        },
      };
      console.log(postData)
      // 将对象转换为 JSON 字符串
      const jsonData = JSON.stringify(postData);
      console.log(jsonData)
      CreateRoleBinding(jsonData).then(rsp=>{
        this.errorMsg= ''
        if (rsp.data==="success")
          alert("创建成功")
        this.$router.push({ name: 'Rolebindinglist' }); // 成功后跳转到RoleBindinglist路由
      }).catch((error)=>{
        if(error.response){
          this.errorMsg = JSON.stringify(error.response.data)
        }else{
          this.errorMsg = JSON.stringify(error.message)
        }
      })
    }
  },
};
</script>

