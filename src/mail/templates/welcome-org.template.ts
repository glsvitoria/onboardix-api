export interface WelcomeOrgEmailData {
  ownerName: string;
  companyName: string;
  url: string;
}

export const welcomeOrganizationTemplate = (
  data: WelcomeOrgEmailData,
): string => {
  const primaryColor = '#8b5cf6';
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background: #000000; padding: 32px; text-align: center; }
    .content { padding: 40px; color: #374151; line-height: 1.6; }
    .footer { padding: 24px; background: #f9fafb; color: #6b7280; font-size: 12px; text-align: center; border-top: 1px solid #e5e7eb; }
    .button { display: inline-block; background-color: ${primaryColor}; color: #ffffff !important; padding: 14px 32px; text-decoration: none; border-radius: 9999px; font-weight: 600; margin-top: 24px; text-align: center; }
    .card { background: #f5f3ff; border-left: 4px solid ${primaryColor}; padding: 20px; margin: 24px 0; border-radius: 4px; }
    h1 { color: #111827; font-size: 24px; margin-bottom: 16px; font-weight: 700; }
    .highlight { color: ${primaryColor}; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
        <span style="color: white; font-weight: bold; font-size: 20px; tracking-spacing: 2px;">ONBOARDIX</span>
    </div>
    <div class="content">
      <h1>Olá, ${data.ownerName}.</h1>
      <p>Sua organização <span class="highlight">${data.companyName}</span> foi criada com sucesso no Onboardix!</p>
      
      <p>Estamos prontos para ajudar você a reduzir o tempo de ramp-up do seu time e eliminar a confusão do primeiro dia.</p>
      
      <div class="card">
        <span style="display: block; font-size: 12px; text-transform: uppercase; color: #6b7280; margin-bottom: 4px;">Próximo Passo</span>
        <span style="font-size: 16px; font-weight: 600; color: #111827;">Acesse seu painel para criar seu primeiro roteiro de integração.</span>
      </div>

      <p>Clique no botão abaixo para configurar seu ambiente de trabalho e convidar seus primeiros colaboradores:</p>
      
      <div style="text-align: center;">
        <a href="${data.url}" class="button">Acessar Dashboard</a>
      </div>
    </div>
    <div class="footer">
      <p>Você recebeu este e-mail porque uma conta foi criada para ${data.companyName}.</p>
      <p>&copy; ${year} Onboardix. A plataforma definitiva de onboarding.</p>
    </div>
  </div>
</body>
</html>
  `;
};
