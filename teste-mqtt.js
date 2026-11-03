
require("dotenv").config();

const mqtt = require("mqtt");

const client = mqtt.connect(
  `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
  {
    clientId: process.env.MQTT_CLIENT_ID,
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD,
    clean: true,
    connectTimeout: 10000,
    reconnectPeriod: 0
  }
);

client.on("connect", () => {
  console.log("SUCESSO! Conectado ao broker MQTT.");
  client.end();
});

client.on("error", (erro) => {
  console.log("ERRO na conexão MQTT:", erro.message);
  client.end(true);
});
