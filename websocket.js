var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080});

// 连接池
var clients = [];

wss.on('connection', function(ws) {
    // 将该连接加入连接池
    clients.push(ws);

    var userID = ws._ultron.id;
    var data = {'userID':userID}

    ws.send(JSON.stringify(data));

    ws.on('message', function(message) {
        // 广播消息
        var message = JSON.parse(message)
        if(message['userID']){
            var temp = message['userID'];
            clients.forEach(function(ws1){

                if(ws1._ultron.id == temp) {
                    console.log('success');
                    ws1.send(JSON.stringify({'logined':true}));
                }
            })
        }else{
            var temp = {'mes':message};
            clients.forEach(function(ws1){

                if(ws1 !== ws) {
                    ws1.send(JSON.stringify(temp));
                }
            })
        }
    });

    ws.on('close', function() {
        // 连接关闭时，将其移出连接池
        clients = clients.filter(function(ws1){
            return ws1 !== ws
        })
    });

    ws.on('error', function() {
        // 连接出错时，将其移出连接池
        clients = clients.filter(function(ws1){
            return ws1 !== ws
        })
    });
});