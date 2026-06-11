const { Resend } = require('resend');

const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev';
function getResend() { return new Resend(process.env.RESEND_API_KEY); }

// CT-19: E-mail de boas-vindas após cadastro
async function enviarBoasVindas(destinatario, nome) {
  try {
    await getResend().emails.send({
      from: FROM,
      to: destinatario,
      subject: '🌿 Bem-vindo ao Conexão Gaúcha!',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1e293b">
          <div style="background:#134e4a;padding:32px 24px;border-radius:16px 16px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px">🌿 Conexão Gaúcha</h1>
            <p style="color:#99f6e4;margin:8px 0 0;font-size:14px">Descubra o Rio Grande do Sul</p>
          </div>
          <div style="background:#f8fafc;padding:32px 24px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0">
            <h2 style="font-size:20px;margin:0 0 12px">Olá, ${nome}! 👋</h2>
            <p style="color:#475569;line-height:1.6;margin:0 0 20px">
              Sua conta foi criada com sucesso. Agora você pode planejar roteiros personalizados
              por todo o Rio Grande do Sul — da Serra Gaúcha ao Litoral, das Missões à Campanha.
            </p>
            <div style="background:#f0fdfa;border:1px solid #99f6e4;border-radius:12px;padding:16px;margin-bottom:24px">
              <p style="margin:0;font-size:14px;color:#0f766e;font-weight:600">🚀 Por onde começar?</p>
              <ul style="margin:8px 0 0;padding-left:18px;color:#0f766e;font-size:14px;line-height:1.8">
                <li>Escolha uma região do RS</li>
                <li>Defina suas datas e orçamento</li>
                <li>Monte seu roteiro dia a dia</li>
                <li>Compartilhe com amigos e família</li>
              </ul>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center">
              Este e-mail foi enviado em conformidade com a LGPD — Lei nº 13.709/2018.<br>
              Conexão Gaúcha · Rio Grande do Sul, Brasil
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[Email] Boas-vindas enviado para ${destinatario}`);
  } catch (err) {
    console.error('[Email] Erro ao enviar boas-vindas:', err.message);
  }
}

// CT-09: E-mail de recuperação de senha
async function enviarRecuperacaoSenha(destinatario, nome, token) {
  const baseUrl = process.env.APP_URL || 'http://localhost:5173';
  const link = `${baseUrl}/recuperar-senha?token=${token}`;
  try {
    await getResend().emails.send({
      from: FROM,
      to: destinatario,
      subject: '🔑 Recuperação de senha — Conexão Gaúcha',
      html: `
        <div style="font-family:'Segoe UI',sans-serif;max-width:520px;margin:0 auto;color:#1e293b">
          <div style="background:#134e4a;padding:32px 24px;border-radius:16px 16px 0 0;text-align:center">
            <h1 style="color:#fff;margin:0;font-size:24px">🔑 Recuperar senha</h1>
          </div>
          <div style="background:#f8fafc;padding:32px 24px;border-radius:0 0 16px 16px;border:1px solid #e2e8f0">
            <p style="color:#475569;line-height:1.6;margin:0 0 20px">
              Olá, <strong>${nome}</strong>! Recebemos uma solicitação para redefinir a senha da sua conta.
              Clique no botão abaixo para criar uma nova senha. O link expira em <strong>1 hora</strong>.
            </p>
            <div style="text-align:center;margin:28px 0">
              <a href="${link}" style="background:#134e4a;color:#fff;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:15px;display:inline-block">
                Redefinir minha senha
              </a>
            </div>
            <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center">
              Se você não solicitou isso, ignore este e-mail — sua conta continua segura.<br>
              Conexão Gaúcha · LGPD — Lei nº 13.709/2018
            </p>
          </div>
        </div>
      `,
    });
    console.log(`[Email] Recuperação enviada para ${destinatario}`);
  } catch (err) {
    console.error('[Email] Erro ao enviar recuperação:', err.message);
  }
}

module.exports = { enviarBoasVindas, enviarRecuperacaoSenha };
