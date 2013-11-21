# Kirua

A express daemon manager based on cluster module and kill command.

中文博文请猛击 [使用 mina 与 kirua 快速部署 express 应用](http://cyj.me/f2e/deploying-express-app/)

## Folder Structure

Kirua requires the express project folder being structured like below:

    .
    ├── app.js
    ├── log
    └── tmp
        └── pids

When `kirua start`, the pid and log files will go to:

    .
    ├── app.js
    ├── log
    │   └── production.log
    └── tmp
        └── pids
            ├── master.pid
            ├── worker.1.pid
            └── worker.2.pid

The number of workers is determined by the number of your CPUs.

The log file name is determined by your express enviroment, e.g. app.get('env').
So normally it would be development.log. When start server with

```
$ NODE_ENV=production kirua start
```

the file will be production.log.

## Process Management

```bash
➜  $ kirua

  Usage: kirua [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Examples:

    $ kirua start     # start server
    $ kirua stop      # stop server
    $ kirua restart   # restart server

```

## Continuously Running

As stated before, the number of workers is determined by the number of your
CPUs. If anything goes wrong with your app, causing a worker being killed
unexpectedly, kirua will fork a new worker. This keeps your app running
continuously.

If, for any reason, you want to kill a worker, use

```bash
➜  $ kill -9 0000 # replace 0000 with the pid of the worker
```
