<template>
  <div class="page-wrapper">
    <el-row>
      <el-col :span="10">
        <div class="page-title" id="vip-title">周报管理</div>
      </el-col>
      <el-col :span="14">
        <el-button type="primary" style="float:right;margin-right:10px" @click="addReport" :disabled="noAdd">填写周报</el-button>
        <el-date-picker style="float:right;margin-right:10px" v-model="dateValue" type="week" format="yyyy 第 WW 周"
          :picker-options="pickOption" :value-format="dateFormat" placeholder="选择周" @change="queryReport"></el-date-picker>
      </el-col>
    </el-row>
    <div class="bills-wrapper">
      <el-table :data="tableData" stripe style="width: 100%">
        <el-table-column label="时间范围" width='150'>
          <template slot-scope="scope">
            {{getWeekFirstDay(scope.row.createTime)}} <span style="display:block;">至</span>
            {{getWeekLastDay(scope.row.createTime)}}
          </template>
        </el-table-column>
        <el-table-column label="周报内容">
          <template slot-scope="scope">
            <p style="color:#888;font-size:12px;">本周工作内容</p>
            <ul>
              <li v-for="(item,index) in scope.row.content.worked" :key="index" style="display:flex;justify-content:space-between;padding:0 30px;margin:5px 0;">
                <span>{{index+1}}. {{item.content}}</span>
                <span>完成度：{{item.complete}}</span>
              </li>
            </ul>
            <p style="color:#888;font-size:12px;">下周工作计划</p>
            <ul>
              <li v-for="(item,index) in scope.row.content.toWork" :key="index" style="display:flex;justify-content:space-between;padding:0 30px;margin:5px 0;">
                <span>{{index+1}}. {{item.content}}</span>
                <span>完成度：{{item.complete}}</span>
              </li>
            </ul>
            <!-- <el-button type="primary" size="mini" @click="routerTo(scope.$index, scope.row)">评论</el-button> -->
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width='200'>
          <template slot-scope="scope">
            <span>{{formatDate(scope.row.createTime)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="上次更新时间" width='120'>
                    <template slot-scope="scope">
            <span>{{formatDate(scope.row.updateTime)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="操作" width='150'>
          <template slot-scope="scope">
            <el-button type="primary" size='small' @click="editReport(scope.row.id)" :disabled="scope.row.createTime<getWeekFirstDay(new Date())">编辑</el-button>
            <el-button type="warning" size='small' @click="showDiscuss(scope.row.id)">评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="填写周报" :visible.sync="dialogVisible" :before-close="clickCancel" :close-on-click-modal=false
      :close-on-press-escape=false>
      <div class="formContent">
        <p class="repTitle">本周工作总结</p>
        <div class="report" :key="index" v-for="(item,index) in formData.worked">
          <!-- <span>{{item.id}}</span> -->
          <el-input class="reportInput" v-model="item.content" placeholder="周报内容" :disabled="item.disableEdit"></el-input>
          <el-select class="reportSel" v-model="item.complete" placeholder="完成度">
            <el-option label="0%" value="0%"></el-option>
            <el-option label="20%" value="20%"></el-option>
            <el-option label="40%" value="40%"></el-option>
            <el-option label="60%" value="60%"></el-option>
            <el-option label="80%" value="80%"></el-option>
            <el-option label="100%" value="100%"></el-option>
            <el-option label="已暂停" value="已暂停"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
          <el-button class="delBtn" type="danger" @click="delItem(index,0)" :disabled="formData.worked.length==1 || item.disableEdit">x</el-button>
          <el-button class="addBtn" type="primary" @click="addItem(0)" v-if="formData.worked.length-1==index">+</el-button>
        </div>
        <p class="repTitle">下周工作计划</p>
        <div class="report" :key="index" v-for="(item,index) in formData.toWork">
          <!-- <span>{{item.id}}</span> -->
          <el-input class="reportInput" v-model="item.content" placeholder="周报内容"></el-input>
          <el-select class="reportSel" v-model="item.complete" placeholder="完成度">
            <el-option label="0%" value="0%"></el-option>
            <el-option label="20%" value="20%"></el-option>
            <el-option label="40%" value="40%"></el-option>
            <el-option label="60%" value="60%"></el-option>
            <el-option label="80%" value="80%"></el-option>
            <el-option label="100%" value="100%"></el-option>
          </el-select>
          <el-button class="delBtn" type="danger" @click="delItem(index,1)" :disabled="formData.toWork.length==1">x</el-button>
          <el-button class="addBtn" type="primary" @click="addItem(1)" v-if="formData.toWork.length-1==index">+</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel">取 消</el-button>
        <el-button type="primary" @click="submitReport">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="编辑周报" :visible.sync="dialogVisible2" :before-close="clickCancel2" :close-on-click-modal=false
      :close-on-press-escape=false>
      <div class="formContent">
        <p class="repTitle">本周工作总结</p>
        <div class="report" :key="index" v-for="(item,index) in formData.worked">
          <!-- <span>{{item.id}}</span> -->
          <el-input class="reportInput" v-model="item.content" placeholder="周报内容" :disabled="item.disableEdit"></el-input>
          <el-select class="reportSel" v-model="item.complete" placeholder="完成度">
            <el-option label="0%" value="0%"></el-option>
            <el-option label="20%" value="20%"></el-option>
            <el-option label="40%" value="40%"></el-option>
            <el-option label="60%" value="60%"></el-option>
            <el-option label="80%" value="80%"></el-option>
            <el-option label="100%" value="100%"></el-option>
            <el-option label="已暂停" value="已暂停"></el-option>
            <el-option label="已取消" value="已取消"></el-option>
          </el-select>
          <el-button class="delBtn" type="danger" @click="delItem(index,0)" :disabled="formData.worked.length==1 || item.disableEdit">x</el-button>
          <el-button class="addBtn" type="primary" @click="addItem(0)" v-if="formData.worked.length-1==index">+</el-button>
        </div>
        <p class="repTitle">下周工作计划</p>
        <div class="report" :key="index" v-for="(item,index) in formData.toWork">
          <!-- <span>{{item.id}}</span> -->
          <el-input class="reportInput" v-model="item.content" placeholder="周报内容"></el-input>
          <el-select class="reportSel" v-model="item.complete" placeholder="完成度">
            <el-option label="0%" value="0%"></el-option>
            <el-option label="20%" value="20%"></el-option>
            <el-option label="40%" value="40%"></el-option>
            <el-option label="60%" value="60%"></el-option>
            <el-option label="80%" value="80%"></el-option>
            <el-option label="100%" value="100%"></el-option>
          </el-select>
          <el-button class="delBtn" type="danger" @click="delItem(index,1)" :disabled="formData.toWork.length==1">x</el-button>
          <el-button class="addBtn" type="primary" @click="addItem(1)" v-if="formData.toWork.length-1==index">+</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel2">取 消</el-button>
        <el-button type="primary" @click="submitEditReport">提 交</el-button>
      </span>
    </el-dialog>
    <el-dialog title="评论" :visible.sync="dialogVisible3" :before-close="clickCancel3" :close-on-click-modal=false
      :close-on-press-escape=false>
      <div class="addDiscuss" style="display:flex;align-items:flex-end;margin-bottom:20px;">
        <el-input type='textarea' :rows='2' v-model="discussValue"></el-input>
        <el-button type='primary' size='small' style="margin-left:20px;" @click="submitDiscuss">提交</el-button>
      </div>
      <div class="discussList" v-for="(item,index) in discussList" :key="index">
        <p><span>{{item.truename}}:</span><span>{{formatDate(item.createtime)}}</span></p>
        <div class="item">{{item.content}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clickCancel3">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type='text/ecmascript-6'>
import { rootPath } from "../../config/apiConfig";

export default {
  data() {
    return {
      pickOption: {
        firstDayOfWeek: 1
      },
      tableData: [],
      dateFormat: "yyyy-MM-dd",
      dateValue: "",
      dialogVisible: false,
      dialogVisible2: false,
      dialogVisible3: false,
      discussValue: "",
      formData: {
        worked: [],
        toWork: []
      },
      editId: "",
      noAdd: false,
      discussId: "",
      discussList:[]
    };
  },
  mounted() {
    this.refreshData();
  },
  created() {
    if (!window.sessionStorage.getItem("userId")) {
      this.$router.push({
        path: "/login"
      });
    }
  },
  methods: {
    formatDate: function(date) {
      return (
        new Date(date).toLocaleDateString() +
        " " +
        new Date(date).toTimeString().slice(0, 8)
      );
    },
    getWeekFirstDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 1 - date.getDay());
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    },
    getWeekLastDay(day) {
      var date = new Date(day);
      date.setDate(date.getDate() + 7 - date.getDay());
      var month = date.getMonth() + 1;
      month = month < 10 ? "0" + month : month;
      var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      return date.getFullYear() + "-" + month + "-" + day;
    },
    editReport(id) {
      var that = this;
      this.dialogVisible2 = true;
      this.editId = id;
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/report/getbyid",
          params: {
            id: id
          }
        })
        .then(response => {
          if (response.data.code == "00000") {
            var data = response.data.data[0];
            that.formData = JSON.parse(data.content);
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
    addItem(type) {
      if (type == 0) {
        this.formData.worked.push({
          content: "",
          complete: "0"
        });
      } else {
        this.formData.toWork.push({
          content: "",
          complete: "0"
        });
      }
    },
    delItem(index, type) {
      if (type == 0) {
        this.formData.worked.splice(index, 1);
      } else {
        this.formData.toWork.splice(index, 1);
      }
    },
    showDiscuss(id) {
      this.dialogVisible3 = true;
      this.discussId = id;
      this.queryDiscuss();
    },
    submitDiscuss() {
      var that = this;
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/report/addReportDiscuss",
          params: {
            createdby: window.sessionStorage.getItem("userId"),
            content: that.discussValue,
            relateid: that.discussId
          }
        })
        .then(response => {
          that.$message({
            message: "添加成功",
            type: "success"
          });
          that.queryDiscuss();
          that.discussValue = "";
        })
        .catch(res => {
          that.$message({
            message: response.data.msg,
            type: "warrning"
          });
        });
    },
    queryDiscuss() {
      var that = this;
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/report/queryDiscuss",
          params: {
            relateid: that.discussId
          }
        })
        .then(response => {
          that.discussList = response.data.data;
        })
        .catch(res => {
          that.$message({
            message: response.data.msg,
            type: "warrning"
          });
        });
    },
    submitReport() {
      var that = this;

      for (var i = 0; i < that.formData.worked.length; i++) {
        if (that.formData.worked[i].content == "") {
          that.$message({
            message: "请填写内容或删除空条目后进行提交",
            type: "warning"
          });
          return;
        }
      }
      for (var i = 0; i < that.formData.toWork.length; i++) {
        if (that.formData.toWork[i].content == "") {
          that.$message({
            message: "请填写内容或删除空条目后进行提交",
            type: "warning"
          });
          return;
        }
      }
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/report/add",
          data: {
            userId: window.sessionStorage.getItem("userId"),
            content: that.formData
          }
        })
        .then(response => {
          if (response.data.code == "00000") {
            that.$message({
              message: "提交成功",
              type: "success"
            });
            that.dialogVisible = false;
            that.refreshData();
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
    submitEditReport() {
      var that = this;
      for (var i = 0; i < that.formData.worked.length; i++) {
        if (that.formData.worked[i].content == "") {
          that.$message({
            message: "请填写内容或删除空条目后进行提交",
            type: "warning"
          });
          return;
        }
      }
      for (var i = 0; i < that.formData.toWork.length; i++) {
        if (that.formData.toWork[i].content == "") {
          that.$message({
            message: "请填写内容或删除空条目后进行提交",
            type: "warning"
          });
          return;
        }
      }
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/report/update",
          params: {
            id: that.editId,
            content: that.formData
          }
        })
        .then(response => {
          if (response.data.code == "00000") {
            that.$message({
              message: "提交成功",
              type: "success"
            });
            that.dialogVisible2 = false;
            that.refreshData();
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
    queryReport() {
      var startDay = this.getWeekFirstDay(this.dateValue);
      var endDay = this.getWeekLastDay(this.dateValue);
      this.refreshData(startDay, endDay);
    },

    clickCancel() {
      this.dialogVisible = false;
    },

    clickCancel2() {
      this.dialogVisible2 = false;
    },
    clickCancel3() {
      this.dialogVisible3 = false;
    },

    addReport() {
      var that = this;
      this.dialogVisible = true;
      this.formData.worked.length = 0;
      this.formData.toWork.length = 0;
      this.getLastWeekReport();
      this.formData.toWork.push({
        content: "",
        complete: "0"
      });
    },
    getLastWeekReport() {
      var that = this;
      var userId = window.sessionStorage.getItem("userId");
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/report/getLastWeekReport",
          params: {
            userId: window.sessionStorage.getItem("userId")
          }
        })
        .then(response => {
          if (response.data.data) {
            var data = response.data.data[0];
            if (data) {
              var content = JSON.parse(data.content);
              for (var i = 0; i < content.toWork.length; i++) {
                content.toWork[i].disableEdit = true;
              }
              that.formData.worked = content.toWork;
            }
            that.formData.worked.push({
              content: "",
              complete: "0"
            });
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    },
    refreshData(startDay, endDay) {
      var that = this;
      var userId = window.sessionStorage.getItem("userId");
      that
        .axios({
          method: "post",
          url: rootPath + "/weeklyserver/report/get",
          params: {
            userId: window.sessionStorage.getItem("userId"),
            startTime: startDay,
            endTime: endDay
          }
        })
        .then(response => {
          if (response.data.data) {
            var data = response.data.data;
            for (var i = 0; i < data.length; i++) {
              data[i].content = JSON.parse(data[i].content);
            }
            that.tableData = data;

            if (that.tableData.length > 0) {
              var createTime = that.tableData[0].createTime;
              if (
                createTime <= that.getWeekLastDay(new Date()) &&
                createTime > that.getWeekFirstDay(new Date())
              ) {
                that.noAdd = true;
                return;
              } else {
                that.noAdd = false;
                return;
              }
            } else if (that.tableData.length == 0 && that.dateValue == "") {
              that.noAdd = false;
              return;
            } else if (
              that.dateValue != "" &&
              that.dateValue <= new Date(this.getWeekLastDay(new Date())) &&
              that.dateValue > new Date(this.getWeekFirstDay(new Date()))
            ) {
              that.noAdd = false;
              return;
            } else {
              that.noAdd = true;
              return;
            }
          } else {
            this.$message({
              message: response.data.msg,
              type: "error"
            });
          }
        });
    }
  }
};
</script>
<style scoped>
.page-title {
  border-left: 3px solid #699fff;
  text-indent: 8px;
  font-family: "Microsoft YaHei";
  font-size: 18px;
}

#page-title {
  margin-bottom: 0;
}

.bills-wrapper {
  float: left;
  width: 99%;
  padding-top: 20px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  border-radius: 4px;
  min-height: 30px;
}

.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.dkdia .el-dialog--small {
  width: 40%;
}

.dateContainer {
  height: 60px;
  border: 1px solid black;
}

.repTitle {
  font-size: 16px;
  color: #ccc;
  font-weight: bold;
  margin: 10px 0;
}

.report {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin: 5px 0;
}

.report span {
  display: block;
  width: 30px;
  font-size: 16px;
  text-align: center;
  margin: 0 5px;
}

.reportInput {
  width: 70%;
}

.reportSel {
  width: 80px;
  margin: 0 10px;
}
.discussList p {
  width: 100%;
  display: flex;
  justify-content: space-between;
  color: #ccc;
  margin: 5px 0;
}
.discussList .item {
  margin: 5px;
  padding: 5px;
  border-bottom: 1px solid #eee;
}
</style>
