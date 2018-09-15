const data = [
  { "floor": 1 },
  { courseName: "courseName", teacherName: "张爱玲", className: "101", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "102", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "103", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { "floor": 2 },
  { courseName: "courseName", teacherName: "张爱玲", className: "101", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "102", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "103", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { "floor": 3 },
  { courseName: "courseName", teacherName: "张爱玲", className: "101", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "102", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "103", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
  { courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
]




const classInfoData2 = [
  { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "101", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "102", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "103", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },

  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },

  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: new Date().getTime() },
  { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: new Date().getTime() },

]

const classInfoData3 = [
  {
    floor: 1,
    classes: [
      { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "101", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "102", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "103", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "104", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 1, courseName: "courseName", teacherName: "张爱玲", className: "105", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
    ]
  }, {
    floor: 2,
    classes: [
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 2, courseName: "courseName", teacherName: "张爱玲", className: "201", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
    ]
  }, {
    floor: 3,
    classes: [
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: false, usageRate: 23.4, nextTime: "15h 33m" },
      { floor: 3, courseName: "courseName", teacherName: "张爱玲", className: "301", isonclass: true, usageRate: 23.4, nextTime: "15h 33m" },
    ]
  }
]





const testRenderData = (data) => {
  console.log(1, data);

  // 假设能放5行
  var rowNum = 5;
  // 有5列
  var rolNum = 5;

  var index = 1

  var renderData = []

  // setInterval(() => {
  this.test1(data, rowNum, rolNum, rowNum, rowNum * rolNum, renderData)
  // }, 5000);
}

const test1 = (data, rowNum, rolNum, useRow, maxLen, renderData) => {
  console.log(1, data);
  var data = data
  var renderData = renderData
  var useRow = useRow
  // 如果第一组数据的 classes 的长度 小于或等于可放置的长度
  if (data[0].classes.length < maxLen || data[0].classes.length === maxLen) {
    // 表示第一组数据可以在一页显示完
    // 余下多少行
    useRow = rowNum - Math.ceil(data[0].classes.length / rolNum)
    renderData.push(data[0])
    // 删除添加进去的组
    data.splice(0, 1);
    if (useRow > 0) {
      // this.test1(data, rowNum, rolNum, useRow, useRow * 5, renderData)
    }
  } else {
    // 第一组数据的长度大于了剩余长度 则截取剩余长度 的数据出来
    // 复制第一组数据
    var firstData = data[0]
    // 剩余长度
    var maxLen = maxLen

  }
}

export { classInfoData2, classInfoData3, }

