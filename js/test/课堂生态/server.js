const server = require('express');
const app = server();


// app.use('/iser-web',server.static(__dirname + '/build 2018-8-22'))
app.use('/iser-web',server.static(__dirname + '/build 2018-8-23'))



app.listen(7170,()=>{
    console.log('server start at 7170')
});


// http://localhost:3001/iser-web/?token=2827474D1C7545648094ABB6A18D838C&orgode=2.1.20180807&page=index&argument=456
// ?token=2827474D1C7545648094ABB6A18D838C&orgode=2.1.20180807&page=index&argument=456