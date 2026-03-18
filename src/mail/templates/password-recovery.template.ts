export interface PasswordRecoveryEmailData {
  userName?: string;
  code: string;
  expiresInMinutes: number;
}

export const passwordRecoveryTemplate = (
  data: PasswordRecoveryEmailData,
): string => {
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
    
    .code-container { 
      background-color: #f3f4f6; 
      border-radius: 12px; 
      padding: 24px; 
      text-align: center; 
      margin: 32px 0;
      border: 2px dashed #e5e7eb;
    }
    .code-text { 
      font-family: 'Courier New', Courier, monospace; 
      font-size: 36px; 
      font-weight: bold; 
      letter-spacing: 8px; 
      color: #111827;
      margin: 0;
    }
    
    .security-badge { display: inline-block; background: #fef2f2; color: #ef4444; padding: 4px 12px; border-radius: 99px; font-size: 14px; font-weight: 500; margin-bottom: 8px; }
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
      <div class="security-badge">Recuperação de Acesso</div>
      <h1>Redefina sua senha.</h1>
      <p>Olá${data.userName ? `, ${data.userName}` : ''}!</p>
      <p>Recebemos uma solicitação para redefinir a senha da sua conta no <strong>Onboardix</strong>. Use o código abaixo para prosseguir com a alteração:</p>
      
      <div class="code-container">
        <p style="margin-top: 0; font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 1px;">Seu código de verificação</p>
        <h2 class="code-text">${data.code}</h2>
      </div>

      <p style="text-align: center; font-size: 14px; color: #6b7280;">
        Este código é válido por <strong>${data.expiresInMinutes} minutos</strong>.
      </p>

      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #6b7280;">
        <strong>Não foi você?</strong> Se você não solicitou a alteração de senha, pode ignorar este e-mail com segurança. Sua senha atual permanecerá a mesma.
      </p>
    </div>
    <div class="footer">
      <p>&copy; ${year} Onboardix. Segurança e simplicidade no onboarding.</p>
      <p>Este é um e-mail automático enviado para sua proteção, por favor não responda.</p>
    </div>
  </div>
</body>
</html>
  `;
};
