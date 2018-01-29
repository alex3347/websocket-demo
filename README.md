### 技术栈： [ws](https://github.com/websockets/ws) + nodejs + [qrcode](https://github.com/davidshimjs/qrcodejs) + jquery + gulp + sass

#### 实现功能

##### 1、扫码页面刷新状态

客户端创建连接时，服务端发送ws._ultron.id做为客户端唯一标识；

客户端收到唯一标识后，将唯一标识附加在请求网址后面，使用qrcode生成二维码图片

扫码后  开启另一个ws连接  新连接将接收到的前一页面唯一标识发给服务端，服务端在message回调中找到唯一标识对应的ws连接，再send数据

扫码产生的ws连接可以设置为跳转或者直接关闭

##### 2、更新客户端状态

单独建立backend页面作为后台，也通过ws连接服务端进行数据转发，数据传输前JSON.stringfy，因为ws send的数据是以blob对象形式传输