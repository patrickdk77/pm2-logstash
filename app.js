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
    return console.error(err);
  }
  bus.on("log:out", function(log) {
    if (log.process.name === "logstash") {
      return;
    }

    const message = {
      application: log.process.name,
      log_level: "INFO",
      raw_message: log.data,
      type: "pm2-logstash"
    };

    sendMessage(message);
  });
});
