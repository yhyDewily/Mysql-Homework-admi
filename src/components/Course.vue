<template>
    <div id="course">
        <v-toolbar color="cyan" dark tabs>
            <v-toolbar-title>课程信息</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn class="green accent-3" @click="addCourse">
                <v-icon medium>add</v-icon>
            </v-btn>
        </v-toolbar>
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
        <v-btn v-show="addCourseInfo.status">保存</v-btn>
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
                    <v-btn icon @click="delCourse(props.item.courseId)">
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
        (v) => (v && v.length === 2) || '课程号长度应为2'
      ],
      courseNameRules: [
        (v) => !!v || '课程名不能为空'
      ],
      courseCreditRules: [
        (v) => !!v || '学分不能为空',
        (v) => {
          if (parseInt(v).toString() === 'NaN') {
            return '请输入数字'
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
    semesterCourses: [
      {
        courseId: 'C1',
        courseName: 'PASCAL',
        courseCredit: 4,
        teacherName: '王晓名',
        dept: '计算机应用'
      },
      {
        courseId: 'C2',
        courseName: 'PASCAL',
        courseCredit: 4,
        teacherName: '王晓名',
        dept: '计算机应用'
      },
      {
        courseId: 'C3',
        courseName: 'PASCAL',
        courseCredit: 4,
        teacherName: '王晓名',
        dept: '计算机应用'
      },
      {
        courseId: 'C4',
        courseName: 'PASCAL',
        courseCredit: 4,
        teacherName: '王晓名',
        dept: '计算机应用'
      }
    ],
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
  methods: {
    delCourse: function (courseId) {

    },
    addCourse: function () {
      this.addCourseInfo.status = !this.addCourseInfo.status
    }
  }
}
</script>

<style scoped>

</style>
