<template>
    <div id="grades">
        <v-toolbar color="cyan" dark tabs>
            <v-toolbar-title>成绩查询</v-toolbar-title>
            <v-tabs
                    slot="extension"
                    centered
                    color="cyan"
                    slider-color="yellow"
            >
                <v-tab>
                    课程列表
                </v-tab>
            </v-tabs>
        </v-toolbar>
        <v-tabs-items>
            <v-tab-item>
                <v-data-table
                        :headers="CourseHeaders"
                        :items="Courses"
                        item-key="id">
                    <template slot="items" slot-scope="props">
                        <td @click="showGrades(props.item.courseId,props.item.courseName)">
                            {{ props.item.courseId }}</td>
                        <td @click="showGrades(props.item.courseId,props.item.courseName)">
                            {{ props.item.courseName }}</td>
                        <td @click="showGrades(props.item.courseId,props.item.courseName)">
                            {{ props.item.courseCredit }}</td>
                        <td @click="showGrades(props.item.courseId,props.item.courseName)">
                            {{ props.item.teacherName }}</td>
                    </template>
                </v-data-table>
            </v-tab-item>
        </v-tabs-items>
        <v-toolbar color="cyan" dark tabs v-show="showgrades">
            <v-toolbar-title>选修{{ showGradesName }}的学生</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="green accent-3"
                   @click="showchangeGrades(0)">
                输入成绩
            </v-btn>
            <v-tabs
                    slot="extension"
                    centered
                    color="cyan"
                    slider-color="yellow"
            >
                <v-tab>
                    成绩列表
                </v-tab>
            </v-tabs>
        </v-toolbar>
        <v-tabs-items v-show="showgrades">
            <v-tab-item>
                <v-data-table
                        :headers="StudentGradesHeader"
                        :items="showStuGrades"
                        item-key="id">
                    <template slot="items" slot-scope="props">
                        <td>{{ props.item.studentId }}</td>
                        <td>{{ props.item.grade }}</td>
                        <td>
                            <v-btn icon @click="showchangeGrades(props.item.studentId)">
                                <v-icon color="success">done</v-icon>
                            </v-btn>
                         </td>
                    </template>
                </v-data-table>
                <v-form v-model="valid" ref="changeGradeForm" lazy-validation>
                    <v-container v-show="changeGradesInfo.status">
                        <v-layout>
                            <v-flex
                                    xs12
                                    md4
                            >
                                <v-text-field
                                        v-model="changeGradesInfo.studentId"
                                        :rules="IdRules"
                                        :counter="10"
                                        label="学号"
                                        required
                                        :disabled="changeGradesInfo.isChange"
                                ></v-text-field>
                            </v-flex>
                            <v-flex
                                    xs12
                                    md4
                            >
                                <v-text-field
                                        v-model="changeGradesInfo.grade"
                                        :rules="gradeRules"
                                        :counter="10"
                                        label="成绩"
                                        required
                                ></v-text-field>
                            </v-flex>
                        </v-layout>
                        <v-btn color="success"
                               @click="changeGrade(changeGradesInfo.studentId,changeGradesInfo.grade)">
                            保存
                        </v-btn>
                    </v-container>
                </v-form>
            </v-tab-item>
        </v-tabs-items>
    </div>
</template>

<script>
export default {
  name: 'Grades',
  data: () => ({
    valid: true,
    showgrades: false,
    showGradesName: null,
    IdRules: [
      (v) => !!v || '请输入学号',
      (v) => (v && v.length >= 2) || '课程号长度应大于等于2',
      (v) => {
        var regex = /^S[0-9]+/
        if (regex.test(v) === true) {
          return true
        } else {
          return '学号格式应为S+数字'
        }
      }
    ],
    gradeRules: [
      (v) => !!v || '请输入成绩',
      (v) => {
        if (parseInt(v).toString() === 'NaN') {
          return '请输入数字'
        } else {
          return true
        }
      }
    ],
    // 指定课程学生的成绩
    showStuGrades: [],
    // 所有学生的成绩
    StudentGrades: [],
    StudentGradesHeader: [
      {
        text: '学号',
        value: 'studentId'
      },
      {
        text: '成绩',
        value: 'grade'
      },
      {
        text: '修改成绩',
        value: 'id',
        sortable: false
      }
    ],
    // 所有课程
    Courses: [],
    CourseHeaders: [
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
      }
    ],
    // 修改或添加课程的信息
    changeGradesInfo: {
      isChange: false,
      status: false,
      courseId: null,
      studentId: null,
      grade: null
    },
    students: []
  }),
  mounted: function () {
    this.getAllCourses()
    this.getAllStudentsCourse()
    this.getAllStudentsId()
  },
  methods: {
    // 获取所有的学生成绩，减少从后台获取数据的次数
    getAllStudentsCourse: function () {
      this.$axios.get('/grades/students')
        .then(response => {
          console.log(response.data)
          for (let i = 0; i < response.data.length; i++) {
            this.StudentGrades.push({
              studentId: response.data[i].sno,
              courseId: response.data[i].cno,
              grade: response.data[i].grade
            })
          }
        })
    },
    getAllStudentsId: function () {
      this.$axios.get('/grades/studentsId')
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            this.students.push({
              studentId: response.data[i]
            })
          }
        })
    },
    getAllCourses: function () {
      this.$axios.get('/admin/course')
        .then(response => {
          for (let i = 0; i < response.data.length; i++) {
            this.Courses.push({
              courseId: response.data[i].cno,
              courseName: response.data[i].cname,
              courseCredit: response.data[i].credit,
              teacherName: response.data[i].tname
            })
          }
        })
        .catch(error => {
          window.alert(error)
        })
    },
    showGrades: function (courseId, courseName) {
      console.log(courseId, courseName)
      this.showgrades = true
      // 把课程号先添加，方便之后修改
      this.changeGradesInfo.courseId = courseId
      this.showGradesName = courseName
      this.showStuGrades = []
      console.log(this.StudentGrades)
      for (let i = 0; i < this.StudentGrades.length; i++) {
        if (courseId === this.StudentGrades[i].courseId) {
          this.showStuGrades.push({
            studentId: this.StudentGrades[i].studentId,
            grade: this.StudentGrades[i].grade
          })
        }
      }
    },
    showchangeGrades: function (studentId) {
      this.changeGradesInfo.status = true
      if (studentId !== 0) {
        this.changeGradesInfo.isChange = true
        this.changeGradesInfo.studentId = studentId
      } else {
        this.changeGradesInfo.studentId = null
        this.changeGradesInfo.isChange = false
      }
    },
    changeGrade: function (studentId, grade) {
      // var _this = this
      if (this.$refs.changeGradeForm.validate) {
        var flag = false
        for (let i = 0; i < this.students.length; i++) {
          if (this.students[i].studentId === studentId) {
            flag = true
            break
          }
        }
        if (flag === false) {
          window.alert('该学号不存在')
          return
        }
        let GradeInfo = JSON.stringify({
          cno: this.changeGradesInfo.courseId,
          sno: studentId,
          grade: grade
        })
        this.$axios.post('/grades/update', GradeInfo)
          .then(response => {
            if (response.data.code === 200) {
              window.alert(response.data.msg)
              for (let i = 0; i < this.StudentGrades.length; i++) {
                if (studentId === this.StudentGrades[i].studentId &&
                  this.changeGradesInfo.courseId === this.StudentGrades[i].studentId) {
                  this.StudentGrades[i].grade = grade
                  break
                }
              }
              for (let i = 0; i < this.showStuGrades.length; i++) {
                if (studentId === this.showStuGrades[i].studentId) {
                  this.showStuGrades[i].grade = grade
                  break
                }
              }
              this.changeGradesInfo.status = false
              this.changeGradesInfo.studentId = null
              this.changeGradesInfo.grade = null
            } else {
              window.alert(response.data.msg)
            }
          }).catch(error => {
            window.alert(error)
          })
      }
    }
  }
}
</script>

<style scoped>

</style>
