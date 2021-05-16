import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { SocketioService } from './services/socketio.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit  {

  postedForm:boolean=false;
  strogeValue:any;
  public listeninguserList:any[]=[];
  public formlist: any[] = [{
    id:1,
    tweetOwner: '',
    tweetText: ''
  }];
  @ViewChild("btn") btn:any;
  constructor(private socketService: SocketioService) {}
  
  ngOnInit()
  {
    this.socketService.setupSocketConnection();
    this.strogeValue=localStorage.getItem('postedform') || null;
    if(this.strogeValue)
    {
      this.postedForm = JSON.parse(this.strogeValue);
    }
    localStorage.removeItem('postedform'); 
  }

  addformValue()
  {
    if(this.formlist.length>4)
    {
      alert("You Can add maximum 5 user.");
    }  
    else
    {
      this.formlist.push({
        id: this.formlist.length + 1,
        tweetOwner: '',
        tweetText: '',
      });
    }
  }

  removeformValue(i: number)
  {
    this.formlist.splice(i, 1);
  }

  logValue()
  {
    this.socketService.createListener(this.formlist);
    this.formlist.forEach(element => this.listeninguserList.push({tweetOwner:element.tweetOwner,
      tweetText:element.tweetText,createdDate:new Date()}));
    this.clearForm();
    this.postedForm=true;
    localStorage.setItem("postedform",JSON.stringify(this.postedForm));
  }

  clearForm()
  {
    this.formlist.length = 0;
    this.formlist.push({
      id: 1,
      tweetOwner: '',
      tweetText: '',
    });
  }

  removeTweetListener()
  {
    this.socketService.removeListener();
  }
}
