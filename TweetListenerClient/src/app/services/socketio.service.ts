import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket:any;
  constructor() {}
  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }
  createListener(data:any[] ) {
    this.socket.emit("addtweetlistener",data);
  }
  removeListener() {
    this.socket.emit("removetweetlistener");
  }

  getNewTweet():any {
    this.socket.on("newTweet",(data:any) =>{
      console.log(data);
        return data;
    })
  }

}
