
import Mock from 'mockjs';

// 3.1.1.2.9违纪事件筛选
Mock.mock('http://192.168.20.153:8989/muti_dispose/signInManage/getSignInDetailInfo', {
  "code": '-1',
  "data": {
    "currentPage": 1,
    "pageData|1-10": [
      {
        "arrangeExaminerList|0-3": [{
          "name|1": ["老周", "老王", "老李"],
          "type|1": ['1','2','3'],
          "uid": /\w\W\s\S\d\D/,
        }],
        "logicExrNo": /\w\W\s\S\d\D/,
        "orgCode": "86.32.07.01.03",
        "orgName": "连云港高级中学连云港高级中学连云港高级中学连云港高级中学",
        "orgTypeId|1": ['1','2','3','4'],
        "signExaminerList|0-3": [{
          "name|1": ["老周", "老王", "老李"],
          "type|1": ['1','2','3'],
          "uid": /\w\W\s\S\d\D/,
        }],
      }
    ],
    "pageSize": 10,
    "startIndex": 0,
    "totalPage": 0,
    "totalRow": 0
  },
  "message": "OK",
  "result": true,
  "total": 0,
  "version": "1.0.0"
})