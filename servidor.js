
require("dotenv").config();
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Estação Meteorológica - Servidor ativo!");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Servidor HTTP ativo na porta ${PORT}`);
});
const mqtt = require("mqtt");
const { createClient } = require("@supabase/supabase-js");

// Conexão com o Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

// Conexão com o broker MQTT
const client = mqtt.connect(
  `mqtt://${process.env.MQTT_HOST}:${process.env.MQTT_PORT}`,
  {
    clientId: process.env.MQTT_CLIENT_ID + "_bridge",
    username: process.env.MQTT_USERNAME,
    password: process.env.MQTT_PASSWORD
  }
);

const topico = process.env.MQTT_TOPIC;

// Quando conectar ao MQTT
client.on("connect", () => {
  console.log("Conectado ao MQTT!");

  client.subscribe(topico, (erro) => {
    if (erro) {
      console.log("Erro ao assinar tópico:", erro.message);
      return;
    }

    console.log("Aguardando leituras meteorológicas...");
  });
});

// Quando receber uma mensagem
client.on("message", async (topico, mensagem) => {
    console.log("Mensagem MQTT recebida:", mensagem.toString())
  try {
    const leitura = JSON.parse(mensagem.toString());

    const campos = [
      "temperatura",
      "umidade",
      "velocidade_vento",
      "direcao_vento",
      "chuva_mm"
    ];

    for (const campo of campos) {
      if (
        typeof leitura[campo] !== "number" ||
        !Number.isFinite(leitura[campo])
      ) {
        throw new Error(`Campo inválido ou ausente: ${campo}`);
      }
    }

    const { error } = await supabase
      .from("leituras_meteorologicas")
      .insert([{
        temperatura: leitura.temperatura,
        umidade: leitura.umidade,
        velocidade_vento: leitura.velocidade_vento,
        direcao_vento: leitura.direcao_vento,
        chuva_mm: leitura.chuva_mm
      }]);

    if (error) {
      console.log("Erro ao gravar no Supabase:", error.message);
      return;
    }

    console.log("Nova leitura gravada no Supabase!");
    console.log(leitura);

  } catch (erro) {
    console.log("Erro ao processar mensagem:", erro.message);
  }
});

client.on("error", (erro) => {
  console.log("Erro MQTT:", erro.message);
});
