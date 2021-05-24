const pm2 = require("pm2");
const pmx = require("pmx");
const os  = require("os");
const Logstash = require("logstash-client");
const packageJSON = require("./package");
const conf = pmx.initModule();

const logstash = new Logstash({
  type: conf.logstash_type,
  host: conf.logstash_host,
  port: conf.logstash_port,
  hostname: conf.logstash_hostname || os.hostname(),
  stackname: conf.logstash_stackname || process.env.STACK_FULL
});

pm2.Client.launchBus(function(err, bus) {
  const hostname = os.hostname();
  const stackname = process.env.STACK_NAME;
  
  if (err) {
    return console.error('PM2 LogStash', err);
  }

  console.log('PM2 Logstash Connector: Bus connected, sending logs to ' + conf.logstash_host + ':' + conf.logstash_port);
  
  bus.on("log:out", function(log) {
    if (log.process.name === packageJSON.name) {
      return;
    }

    const message = {
      id: log.process.pm_id,
      application: log.process.name,
      '@timestamp': new Date().toISOString(),
      hostname: hostname,
      received_from: stackname,
      log_level: "info",
      message: log.data,
      type: "pm2-logstash"
    };

    logstash.send(message);
  });
  
  bus.on("log:err", function(log) {
    if (log.process.name === packageJSON.name) {
      return;
    }

    const message = {
      id: log.process.pm_id,
      application: log.process.name,
      '@timestamp': new Date().toISOString(),
      hostname: hostname,
      received_from: stackname,
      log_level: "error",
      message: log.data,
      type: "pm2-logstash"
    };

    logstash.send(message);
  });

  bus.on('close', function() {
    console.log('PM2 Logstash Connector: Bus closed');
    pm2.disconnectBus();
  });
});
