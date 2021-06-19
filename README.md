# TweetListener
TweetListener
Listen to twitter users tweet and get notification when they send tweet.


Use angular for web app and node js for backend development

![Alt Text](https://i.hizliresim.com/66s59el.png)

![Alt Text](https://i.hizliresim.com/ex5ulz4.png)



## Using Docker Compose
You can run the required infrastructure components by issuing a simple command:
```
$ docker-compose up
```
form your terminal command line, whilst being inside the repository rot directory.

It might be a good idea to run the services in detached mode, so you don't accidentally stop them. To do this, execute:
```
$ docker-compose up -d
```
To stop all services, from the repository root execute this command:
```
$ docker-compose stop
```
Hence that this command does not remove containers so you can run them again using docker-compose up or docker-compose start and your data will be retained from the previous section.

If you want to clean up all data, use
```
$ docker-compose down
```
This command stops all services and removes containers. The images will still be present locally so when you do docker-compose up - containers will be created almost instantly and everything will start with clean volumes.

