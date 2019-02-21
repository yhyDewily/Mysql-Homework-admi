<template>
    <div id="students">
        <v-toolbar color="cyan" dark tabs>
            <v-toolbar-title>学生信息</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="green accent-3" @click="showAddStudent">
                <v-icon medium>add</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-form v-model="valid" ref="addStudentForm" lazy-validation>
                <v-text-field
                        label="学号"
                        v-model="addStudentInfo.studentId"
                        v-show="addStudentInfo.status"
                        :rules="addRules.studentIdRule"></v-text-field>
                <v-text-field
                        label="学生姓名"
                        v-model="addStudentInfo.studentName"
                        v-show="addStudentInfo.status"
                        :rules="addRules.studentNameRule"></v-text-field>
                <v-select
                        label="性别"
                        v-model="addStudentInfo.sex"
                        :items="sex"
                        v-show="addStudentInfo.status"
                        :rules="addRules.sexRule"></v-select>
                <v-text-field
                        label="年龄"
                        v-model="addStudentInfo.age"
                        v-show="addStudentInfo.status"
                        :rules="addRules.ageRule"></v-text-field>
                <v-select
                        v-model="addStudentInfo.dept"
                        label="所属院系"
                        :items="dept"
                        v-show="addStudentInfo.status"
                        :rules="addRules.deptRule"
                ></v-select>
                <v-text-field
                        label="登录名"
                        v-model="addStudentInfo.logn"
                        v-show="addStudentInfo.status"
                        :rules="addRules.lognRule"></v-text-field>
                <v-text-field
                        label="密码"
                        v-show="addStudentInfo.status"
                        :rules="addRules.pswdRule"
                        v-model="addStudentInfo.pswd"
                        :append-icon="pswdData.visible ? 'visibility_off' : 'visibility'"
                        :append-icon-cb="() => (pswdData.visible = !pswdData.visible)"
                        :type="pswdData.visible ? 'text' : 'password'"
                        required></v-text-field>
                <v-btn v-show="addStudentInfo.status" color="success" @click="addStudent(addStudentInfo)">保存</v-btn>
                <v-btn v-show="addStudentInfo.status" color="error" @click="clearAddStudentInfo(addStudentInfo)">重置</v-btn>
            </v-form>
        </v-container>
        <v-data-table
                :headers="studentHeaders"
                :items="students"
                item-key="id">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.studentId }}</td>
                <td>{{ props.item.studentName }}</td>
                <td>{{ props.item.sex }}</td>
                <td>{{ props.item.age }}</td>
                <td>{{ props.item.dept }}</td>
                <td>{{ props.item.logn }}</td>
                <td>{{ props.item.pswd }}</td>
                <td>
                    <v-btn icon @click="delStudent(props.item.studentId)">
                        <v-icon color="error">clear</v-icon>
                    </v-btn>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
  name: 'Students',
  data: () => ({
    valid: true,
    pswdData: {
      errorAlert: false,
      error: false,
      visible: false
    },
    dept: [
      '计算机应用',
      '计算机软件'
    ],
    sex: [
      '男',
      '女'
    ],
    addRules: {
      studentIdRule: [
        (v) => !!v || '学号不能为空',
        (v) => (v && v.length >= 2) || '学号长度应大于等于2',
        (v) => {
          var regex = /^S[0-9]+/
          if (regex.test(v) === true) {
            return true
          } else {
            return '学号格式应S+数字'
          }
        }
      ],
      studentNameRule: [
        (v) => !!v || '姓名不能为空'
      ],
      ageRule: [
        (v) => !!v || '年龄不能为空',
        (v) => {
          if (parseInt(v).toString() === 'NaN') {
            return '请输入数字'
          } else {
            return true
          }
        }
      ],
      sexRule: [
        (v) => !!v || '性别不能为空'
      ],
      deptRule: [
        (v) => !!v || '开课系不能为空'
      ],
      lognRule: [
        (v) => !!v || '登录名不能为空'
      ],
      pswdRule: [
        (v) => !!v || '密码不能为空'
      ]
    },
    students: [],
    studentHeaders: [
      {
        text: '学号',
        value: 'studentId'
      },
      {
        text: '学生姓名',
        value: 'studentName'
      },
      {
        text: '性别',
        value: 'sex'
      },
      {
        text: '年龄',
        value: 'age'
      },
      {
        text: '所属院系',
        value: 'dept'
      },
      {
        text: '登录名',
        value: 'logn'
      },
      {
        text: '密码',
        value: 'pswd'
      },
      {
        text: '删除学生',
        value: 'id'
      }
    ],
    addStudentInfo: {
      status: false,
      studentId: null,
      studentName: null,
      sex: null,
      age: null,
      dept: null,
      logn: null,
      pswd: null
    }
  }),
  mounted: function () {
    this.getAllStudent()
  },
  methods: {
    getAllStudent: function () {
      this.$axios.get('/students/getall')
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            this.students.push({
              studentId: response.data[i].sno,
              studentName: response.data[i].sname,
              sex: response.data[i].sex,
              age: response.data[i].age,
              dept: response.data[i].sdept,
              logn: response.data[i].logn,
              pswd: response.data[i].pswd
            })
          }
        })
        .catch(error => {
          window.alert(error)
        })
    },
    showAddStudent: function () {
      this.addStudentInfo.status = !this.addStudentInfo.status
    },
    addStudent: function (addStudentInfo) {
      if (this.$refs.addStudentForm.validate()) {
        for (let i = 0; i < this.students.length; i++) {
          if (addStudentInfo.studentId ===
            this.students[i].studentId) {
            window.alert('该学号已存在')
            return
          }
        }
        let StudentInfo = JSON.stringify({
          sno: addStudentInfo.studentId,
          sname: addStudentInfo.studentName,
          age: addStudentInfo.age,
          sex: addStudentInfo.sex,
          dept: addStudentInfo.dept,
          logn: addStudentInfo.logn,
          pswd: addStudentInfo.pswd
        })
        this.$axios.post('/students/add', StudentInfo)
          .then(response => {
            if (response.data.code === 200) {
              window.alert(response.data.msg)
              this.$router.go(0)
              // this.students.push({
              //   studentId: addStudentInfo.studentId,
              //   studentName: addStudentInfo.studentName,
              //   age: addStudentInfo.age,
              //   sex: addStudentInfo.sex,
              //   dept: addStudentInfo.dept,
              //   logn: addStudentInfo.logn,
              //   pswd: addStudentInfo.pswd
              // })
            }
          })
      }
    },
    delStudent: function (studentId) {
      this.$axios.post('/students/delete', {
        studentId: studentId
      })
        .then(response => {
          if (response.data.code === 200) {
            window.alert(response.data.msg)
            this.$router.go(0)
            // for (let i = 0; i < this.students.length; i++) {
            //   if (studentId === this.students[i].studentId) {
            //     this.students.splice(i, 1)
            //   }
            // }
          } else {
            window.alert(response.data.msg)
          }
        })
        .catch(error => {
          window.alert(error)
        })
    },
    clearAddStudentInfo: function (addStudentInfo) {
      this.addStudentInfo.pswd = null
      this.addStudentInfo.logn = null
      this.addStudentInfo.dept = null
      this.addStudentInfo.sex = null
      this.addStudentInfo.age = null
      this.addStudentInfo.studentName = null
      this.addStudentInfo.studentId = null
    }
  }
}
</script>

<style scoped>

</style>
