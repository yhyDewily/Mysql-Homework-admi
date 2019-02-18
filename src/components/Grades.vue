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
                        :items="StudentGrades"
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
                <v-form v-model="valid">
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
    valid: false,
    showgrades: false,
    showGradesName: null,
    IdRules: [
      (v) => !!v || '请输入学号',
      (v) => (v && v.length >= 2) || '课程号长度应大于等于2',
      (v) => {
        var regex = /^S[0-9]+/
        console.log(regex.test(v))
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
    StudentGrades: [
      {
        studentId: 'S3',
        grade: 88
      },
      {
        studentId: 'S4',
        grade: 88
      },
      {
        studentId: 'S5',
        grade: 88
      }
    ],
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
    Courses: [
      {
        courseId: 'C1',
        courseName: 'PASCAL',
        courseCredit: 4,
        teacherName: '刘红'
      },
      {
        courseId: 'C2',
        courseName: 'PASCAL',
        courseCredit: 4,
        teacherName: '刘红'
      },
      {
        courseId: 'C3',
        courseName: 'PASCAL',
        courseCredit: 4,
        teacherName: '刘红'
      }
    ],
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
    changeGradesInfo: {
      isChange: false,
      status: false,
      courseId: null,
      studentId: null,
      grade: null
    }
  }),
  methods: {
    showGrades: function (courseId, courseName) {
      console.log(courseId)
      this.showgrades = true
      this.changeGradesInfo.courseId = courseId
      this.showGradesName = courseName
    },
    showchangeGrades: function (studentId) {
      this.changeGradesInfo.status = true
      if (studentId !== 0) {
        this.changeGradesInfo.isChange = true
        this.changeGradesInfo.studentId = studentId
      }
      console.log(studentId + '' + this.changeGradesInfo.courseId)
    },
    changeGrade: function (studentId, grade) {
      console.log(studentId, grade)
    }
  }
}
</script>

<style scoped>

</style>
