async function processarImagem() {
  if (!imagem) {
    alert('Selecione uma imagem primeiro!');
    return;
  }
  try {
    const resp = await fetch('http://localhost:3001/processar-imagem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagem }),
    });
    const dados = await resp.json();
    setResultado(dados.resultado || 'Sem resposta');
  } catch (err) {
    console.error(err);
    setResultado('Erro ao processar imagem');
  }
}
