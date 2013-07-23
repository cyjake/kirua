# Kirua

A express daemon manager based on cluster module and kill command.

## Folder Structure

Kirua requires the express project folder being structured like below:

- app.js
- log
- tmp
  - pids

When `kirua start`, the pid and log files will go to:

- app.js
- log
  - :env.log
- tmp
  - pids
    - master.pid
    - worker.:id.pid
    - worker.:id.pid

The number of workers is determined by the number of your CPUs.

The log file name is determined by your express enviroment, e.g. app.get('env').
So normally it would be development.log. When start server with

```
$ NODE_ENV=production kirua start
```

the file will be production.log.

## Process Management

- kirua start
- kirua stop
- kirua restart

That's it.