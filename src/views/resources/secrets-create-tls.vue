<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>TLS类型</span>
      </div>
      <el-form  label-width="80px" >
        <el-form-item label="证书key">
          <el-input v-model="kvs[0].key"></el-input>
        </el-form-item>
        <el-form-item label="证书内容">
          <el-input type="textarea" :row="2" v-model="kvs[0].value"></el-input>
          <a href="javascript:" class="file">
            <input @change="fileChange('filecrt')" ref="filecrt" type="file" accept=".txt,.pem,.key,.pkey"></input>
          </a>
        </el-form-item>
        <el-form-item label="私钥key">
          <el-input v-model="kvs[1].key"></el-input>
        </el-form-item>
        <el-form-item label="私钥内容">
          <el-input type="textarea" :row="2" v-model="kvs[1].value"></el-input>
          <a href="javascript:" class="file">从文件导入
            <input @change="fileChange('filekey')" ref="filekey" type="file" accept=".txt,.pem,.key,.pkey"></input>
          </a>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="Save" icon="el-icon-success">保存</el-button>
    </el-card>
  </div>
</template>
<script>
import { postSecret } from '@/api/secrets'

export default {
  props:["Name","NameSpace"],
  data(){
    return {
      kvs:[
        {key:"tls.crt",value:""},
        {key:"tls.key",value:""}
      ],
      errorMsg:""
    }
  },
  methods:{
    fileChange(fileName){
      if (this.$refs[fileName].value!=''){
        const reader=new FileReader()
        reader.readAsText(this.$refs[fileName].files[0],"UTF-8")
        reader.onload=(e)=>{
          if (fileName==="filecrt")
          {
            this.kvs[0].value=e.target.result
          }else {
            this.kvs[1].value=e.target.result
          }
        }
      }
    },
    Save(){
      //把kv数组整合成一个大对象
      let postData={}
      this.kvs.forEach((item)=> {
        console.log(item.key)
        console.log(item.value)
        postData[item.key]=item.value
      })
      const postModel={
        Name:this.$props.Name,
        NameSpace:this.$props.NameSpace,
        Type:"kubernetes.io/tls",
        Data:postData,
      }
      postSecret(postModel).then((rsp)=>{
        this.errorMsg= ''
        alert("成功")
      }).catch((error)=>{
        if(error.response){
          this.errorMsg = JSON.stringify(error.response.data)
        }else{
          this.errorMsg = JSON.stringify(error.message)
        }
      })
    }
  }
}

</script>
