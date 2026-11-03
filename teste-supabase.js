
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function testarBanco() {
  const leitura = {
    temperatura: 25.5,
    umidade: 68,
    velocidade_vento: 12.4,
    direcao_vento: 180,
    chuva_mm: 0
  };

  const { data, error } = await supabase
    .from("leituras_meteorologicas")
    .insert([leitura])
    .select();

  if (error) {
    console.log("Erro ao gravar:", error.message);
    return;
  }

  console.log("SUCESSO! Leitura gravada no Supabase:");
  console.log(data);
}

testarBanco();
