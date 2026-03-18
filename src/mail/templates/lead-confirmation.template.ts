export const leadConfirmationTemplate = (): string => {
  const primaryColor = '#0070f3';
  const year = new Date().getFullYear();

  // Tratamento para quando não há nome (apenas email cadastrado)

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; }
    .header { background: #000000; padding: 32px; text-align: center; }
    .content { padding: 40px; color: #374151; line-height: 1.6; }
    .footer { padding: 24px; background: #f3f4f6; color: #6b7280; font-size: 12px; text-align: center; }
    .badge { display: inline-block; background: #e0f2fe; color: ${primaryColor}; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 0.05em; }
    h1 { color: #111827; font-size: 24px; margin-bottom: 16px; margin-top: 0; }
    .highlight-box { background: #f9fafb; border: 1px dashed #d1d5db; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center; }
    .footer-text { margin-top: 32px; font-size: 14px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
       <span style="color: white; font-weight: bold; font-size: 20px; letter-spacing: -0.5px;">ONBOARDIX</span>
    </div>
    <div class="content">
      <div class="badge">Acesso ao Sistema</div>
      <h1>Olá!</h1>
      <p>Obrigado pelo seu interesse em fazer parte do <strong>Onboardix</strong>!</p>
      <p>Recebemos sua solicitação de acesso antecipado. Estamos liberando a plataforma gradualmente para garantir que cada empresa tenha a melhor experiência possível.</p>
      
      <div class="highlight-box">
        <p style="margin: 0; color: #111827; font-weight: 500;">Você está na nossa lista de prioridades.</p>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: #6b7280;">Avisaremos você assim que seu ambiente estiver pronto para ser configurado.</p>
      </div>

      <p>Enquanto isso, prepare seus processos de onboarding — em breve, gerenciar novos talentos será muito mais simples.</p>
      
      <p class="footer-text">Equipe Onboardix</p>
    </div>
    <div class="footer">
      <p>&copy; ${year} Onboardix. Todos os direitos reservados.</p>
      <p>Você recebeu este e-mail porque se inscreveu para o acesso ao sistema em nosso site.</p>
    </div>
  </div>
</body>
</html>
  `;
};
