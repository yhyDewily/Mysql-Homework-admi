<template>
    <div id="course">
        <v-toolbar color="cyan" dark tabs>
            <v-toolbar-title>课程信息</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="green accent-3" @click="showAddCourse">
                <v-icon medium>add</v-icon>
            </v-btn>
        </v-toolbar>
        <v-container>
            <v-form v-model="valid" ref="addCourseForm" lazy-validation>
                <v-text-field
                        label="课程编号"
                        v-model="addCourseInfo.courseId"
                        v-show="addCourseInfo.status"
                        :rules="addRules.courseIdRules"></v-text-field>
                <v-text-field
                        label="课程名称"
                        v-model="addCourseInfo.courseName"
                        v-show="addCourseInfo.status"
                        :rules="addRules.courseNameRules"></v-text-field>
                <v-text-field
                        label="学分"
                        v-model="addCourseInfo.courseCredit"
                        v-show="addCourseInfo.status"
                        :rules="addRules.courseCreditRules"></v-text-field>
                <v-text-field
                        label="教师姓名"
                        v-model="addCourseInfo.teacherName"
                        v-show="addCourseInfo.status"
                        :rules="addRules.teacherNameRules"></v-text-field>
                <v-select
                        v-model="addCourseInfo.dept"
                        label="开课系"
                        :items="dept"
                        v-show="addCourseInfo.status"
                        :rules="addRules.deptRules"
                >
                </v-select>
                <v-btn v-show="addCourseInfo.status" color="success" @click="addCourse(addCourseInfo)">保存</v-btn>
                <v-btn v-show="addCourseInfo.status" color="error" @click="clearAddCourseInfo(addCourseInfo)">重置</v-btn>
            </v-form>
        </v-container>
        <v-data-table
                :headers="semesterCourseHeaders"
                :items="semesterCourses"
                item-key="id">
            <template slot="items" slot-scope="props">
                <td>{{ props.item.courseId }}</td>
                <td>{{ props.item.courseName }}</td>
                <td>{{ props.item.courseCredit }}</td>
                <td>{{ props.item.teacherName }}</td>
                <td>{{ props.item.dept }}</td>
                <td>
                    <v-btn icon @click="clearAddCourseInfo(props.item.courseId)">
                        <v-icon color="error">clear</v-icon>
                    </v-btn>
                </td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
export default {
  name: 'Course',
  data: () => ({
    valid: true,
    tab: null,
    sno: '',
    selected: [],
    dept: [
      '计算机应用',
      '计算机软件'
    ],
    addRules: {
      courseIdRules: [
        (v) => !!v || '课程号不能为空',
        (v) => (v && v.length >= 2) || '课程号长度应大于等于2',
        (v) => {
          var regex = /^C[0-9]+/
          console.log(regex.test(v))
          if (regex.test(v) === true) {
            return true
          } else {
            return '课程号格式应为C+数字'
          }
        }
      ],
      courseNameRules: [
        (v) => !!v || '课程名不能为空'
      ],
      courseCreditRules: [
        (v) => !!v || '学分不能为空',
        (v) => {
          if (parseInt(v).toString() === 'NaN') {
            return '请输入数字'
          } else {
            return true
          }
        }
      ],
      teacherNameRules: [
        (v) => !!v || '教师名不能为空'
      ],
      deptRules: [
        (v) => !!v || '开课系不能为空'
      ]
    },
    semesterCourses: [],
    semesterCourseHeaders: [
      {
        text: '课程编号',
        value: 'courseId'
      },
      {
        text: '课程名称',
        value: 'courseName'
      },
      {
        text: '学分',
        value: 'courseCredit'
      },
      {
        text: '教师',
        value: 'teacherName'
      },
      {
        text: '开课系',
        value: 'dept'
      },
      {
        text: '删除课程',
        value: 'id',
        sortable: false
      }
    ],
    addCourseInfo: {
      status: false,
      courseId: null,
      courseName: null,
      courseCredit: null,
      teacherName: null,
      dept: null
    }
  }),
  mounted: function () {
    this.getAllCourses()
  },
  methods: {
    getAllCourses: function () {
      this.$axios.get('/admin/course')
        .then(response => {
          console.log(response.data)
          for (let i = 0; i < response.data.length; i++) {
            this.semesterCourses.push({
              courseId: response.data[i].cno,
              courseName: response.data[i].cname,
              courseCredit: response.data[i].credit,
              teacherName: response.data[i].tname,
              dept: response.data[i].cdept
            })
          }
        })
        .catch(error => {
          window.alert(error)
        })
    },
    delCourse: function (courseId) {
      // console.log(courseId)
      this.$axios.post('/admin/course/delete', {
        cno: courseId
      })
        .then(response => {
          console.log(response.data)
          if (response.data.code === 200) {
            window.alert(response.data.msg)
            for (let i = 0; i < this.semesterCourses.length; i++) {
              if (this.semesterCourses[i].courseId === courseId) {
                this.semesterCourses.splice(i, 1)
              }
            }
          } else {
            window.alert(response.data.msg)
          }
        })
        .catch(error => {
          window.alert(error)
        })
    },
    showAddCourse: function () {
      this.addCourseInfo.status = !this.addCourseInfo.status
    },
    addCourse: function (addCourseInfo) {
      if (this.$refs.addCourseForm.validate()) {
        let CourseInfo = JSON.stringify({
          cno: addCourseInfo.courseId,
          cname: addCourseInfo.courseName,
          credit: addCourseInfo.courseCredit,
          cdept: addCourseInfo.dept,
          tname: addCourseInfo.teacherName
        })
        this.$axios.post('/admin/course/add', CourseInfo)
          .then(response => {
            if (response.data.code === 200) {
              window.alert(response.data.msg)
              this.semesterCourses.push({
                courseId: addCourseInfo.courseId,
                courseName: addCourseInfo.courseName,
                courseCredit: addCourseInfo.courseCredit,
                dept: addCourseInfo.dept,
                teacherName: addCourseInfo.teacherName
              })
              this.clearAddCourseInfo(addCourseInfo)
            } else {
              window.alert(response.data.msg)
            }
          }).catch(error => {
            window.alert(error)
          })
      }
    },
    clearAddCourseInfo: function (addCourseInfo) {
      addCourseInfo.courseId = null
      addCourseInfo.courseName = null
      addCourseInfo.courseCredit = null
      addCourseInfo.dept = null
      addCourseInfo.teacherName = null
    }
  }
}
</script>

<style scoped>

</style>
