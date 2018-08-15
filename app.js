const pm2 = require("pm2");
const pmx = require("pmx");
const Logstash = require("logstash-client");
const packageJSON = require("./package");
const conf = pmx.initModule();

const logstash = new Logstash({
  type: conf.logstash_type,
  host: conf.logstash_host,
  port: conf.logstash_port
});

pm2.Client.launchBus(function(err, bus) {
  if (err) {
    return console.error('PM2 LogStash', err);
  }

  console.log('PM2 Logstash Connector: Bus connected, sending logs to ' + conf.logstash_host + ':' + conf.logstash_port);
  
  bus.on("log:out", function(log) {
    if (log.process.name === packageJSON.name) {
      return;
    }

    const message = {
      application: log.process.name,
      log_level: "INFO",
      raw_message: log.data,
      type: "pm2-logstash"
    };

    logstash.send(message);
  });
  
  bus.on("log:err", function(log) {
    if (log.process.name === packageJSON.name) {
      return;
    }

    const message = {
      application: log.process.name,
      log_level: "ERROR",
      raw_message: log.data,
      type: "pm2-logstash"
    };

    logstash.send(message);
  });

  bus.on('close', function() {
    console.log('PM2 Logstash Connector: Bus closed');
    pm2.disconnectBus();
  });
});
