
require("dotenv").config();

const mqtt = require("mqtt");

const client = mqtt.connect(
  `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
  {
    clientId: process.env.MQTT_CLIENT_ID + "_teste",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
  }
);

const topico = process.env.MQTT_TOPIC;

client.on("connect", () => {
  console.log("Conectado ao MQTT!");

  client.subscribe(topico, (erro) => {
    if (erro) {
      console.log("Erro ao assinar tópico:", erro.message);
      client.end();
      return;
    }

    console.log("Aguardando mensagem...");

    const leitura = {
      temperatura: 25.5,
      umidade: 68,
      velocidade_vento: 12.4,
      direcao_vento: 180,
      chuva_mm: 0
    };

    client.publish(topico, JSON.stringify(leitura));
  });
});

client.on("message", (topicoRecebido, mensagem) => {
  console.log("\nMensagem recebida!");
  console.log("Tópico:", topicoRecebido);
  console.log("Dados:", mensagem.toString());

  client.end();
});

client.on("error", (erro) => {
  console.log("Erro MQTT:", erro.message);
  client.end(true);
});
