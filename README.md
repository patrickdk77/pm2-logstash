pm2-logstash
=================

An quick and dirty library to redirect your [PM2](http://pm2.io) logs to a [Logstash](https://www.elastic.co/products/logstash) input stream


* Heavily based on [https://github.com/pm2-hive/pm2-gelf](https://github.com/pm2-hive/pm2-gelf)
* Uses [https://github.com/purposeindustries/node-logstash-client](https://github.com/purposeindustries/node-logstash-client) to output to Logstash

## Installation

Tested on node 8.11.3, requires pm2.

```sh
  pm2 install pm2-logstash
```

## Configuration

This module has multiple configuration variables, all fed into node-logstash-client

- "logstash_host": The hostname of the logstash input (Default: '127.0.0.1')
- "logstash_port": The port to send logstash messages to (Default: 9997)
- "logstash_type": The connection type (Default: 'UDP') - udp, tcp, memory


After having installed the module:

```sh
  pm2 set pm2-logstash:<param> <value>
```

Examples:

```sh
  pm2 set pm2-logstash:logstash_host my.cool.host
  pm2 set pm2-logstash:logstash_port 12345
```