var WebSocketServer = require('ws').Server,
    wss = new WebSocketServer({port: 8080});

// 连接池
var clients = [];

wss.on('connection', function(ws) {
    // 将该连接加入连接池
    clients.push(ws);

    var userID = ws._ultron.id;
    var data = [].push(userID);
    const array = new Float32Array(5);

    for (var i = 0; i < array.length; ++i) {
        array[i] = i / 2;
    }
    ws.send(array);

    ws.on('message', function(message) {
        // 广播消息
        var temp = data.slice();
        temp.push(message);
        clients.forEach(function(ws1){

            if(ws1 !== ws) {
                ws1.send(temp);
            }
        })
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