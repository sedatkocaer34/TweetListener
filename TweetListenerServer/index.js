const app = require('express')();
const http = require('http').createServer(app);
const bodyParser = require("body-parser");
const createStream = require('./streams/createStream');
const io = require('socket.io')(http, {
  cors: {origins: ['http://localhost:4200']}
});

let currentStream = {};
const ruleList = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

io.on('connection',  (socket) =>  {
  socket.on('addtweetlistener', async (listenerdata) => {
        if (!Array.isArray(listenerdata)) {
          return null;
        }
        for (const index in listenerdata) {  
          ruleList[index] = {from:listenerdata[index].tweetOwner ,
            text:listenerdata[index].tweetText , tag:`${listenerdata[index].tweetOwner}`};
        }
        currentStream = await createStream.startStream(ruleList,io);
        console.log(currentStream);
  });

  socket.on('removetweetlistener', async () => {
    currentStream.request.abort();
    console.log("Request Aborted.");
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});