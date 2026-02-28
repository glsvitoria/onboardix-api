export interface InviteEmailData {
  organizationName: string;
  url: string; // Link com o token de convite
}

export const invitationTemplate = (data: InviteEmailData): string => {
  const primaryColor = '#0070f3'; // Azul moderno
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #000000; padding: 32px; text-align: center; }
    .content { padding: 40px; color: #374151; line-height: 1.6; }
    .footer { padding: 24px; background: #f3f4f6; color: #6b7280; font-size: 12px; text-align: center; }
    .button { display: inline-block; background-color: ${primaryColor}; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 24px; }
    .org-badge { display: inline-block; background: #eff6ff; color: ${primaryColor}; padding: 4px 12px; border-radius: 99px; font-size: 14px; font-weight: 500; margin-bottom: 8px; }
    h1 { color: #111827; font-size: 26px; margin-bottom: 16px; letter-spacing: -0.025em; }
    p { margin-bottom: 16px; }
    .divider { height: 1px; background-color: #e5e7eb; margin: 32px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
       <span style="color: white; font-weight: bold; font-size: 22px; letter-spacing: 1px;">ONBOARDIX</span>
    </div>
    <div class="content">
      <div class="org-badge">Convite de Organização</div>
      <h1>Você foi convidado(a).</h1>
      <p>Olá!</p>
      <p>Você foi convidado para fazer parte da organização <strong>${data.organizationName}</strong> no Onboardix.</p>
      <p>O Onboardix é a nossa plataforma oficial para centralizar treinamentos, guias de cultura e trilhas de aprendizado. Ao aceitar o convite, você terá acesso a todos os recursos preparados pelo seu time.</p>
      
      <div style="text-align: center;">
        <a href="${data.url}" class="button">Aceitar Convite e Entrar</a>
      </div>

      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #6b7280;">
        Se você não esperava este convite, pode ignorar este e-mail com segurança. O link de acesso expira em breve.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${year} Onboardix. Simplificando a jornada do colaborador.</p>
      <p>Este é um e-mail automático, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
  `;
};
