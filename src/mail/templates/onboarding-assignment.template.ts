export interface OnboardingEmailData {
  name: string;
  templateName: string;
  url: string;
}

export const onboardingAssignmentTemplate = (
  data: OnboardingEmailData,
): string => {
  const primaryColor = '#0070f3';
  const year = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; border: 1px solid #e5e7eb; overflow: hidden; }
    .header { background: #000000; padding: 32px; text-align: center; }
    .content { padding: 40px; color: #374151; line-height: 1.6; }
    .footer { padding: 24px; background: #f3f4f6; color: #6b7280; font-size: 12px; text-align: center; }
    .button { display: inline-block; background-color: ${primaryColor}; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 24px; }
    .card { background: #f3f4f6; border-left: 4px solid ${primaryColor}; padding: 16px; margin: 24px 0; }
    h1 { color: #111827; font-size: 24px; margin-bottom: 16px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
       <span style="color: white; font-weight: bold; font-size: 20px;">ONBOARDIX</span>
    </div>
    <div class="content">
      <h1>Olá, ${data.name}.</h1>
      <p>Seja muito bem-vindo(a)! Estamos animados em ter você no time.</p>
      <p>Para facilitar sua chegada, preparamos um roteiro guiado de integração:</p>
      
      <div class="card">
        <span style="display: block; font-size: 12px; text-transform: uppercase; color: #6b7280;">Roteiro Atribuído</span>
        <span style="font-size: 18px; font-weight: 600; color: #111827;">${data.templateName}</span>
      </div>

      <p>Neste guia, você encontrará as etapas necessárias para configurar seu ambiente e conhecer nossa cultura.</p>
      
      <a href="${data.url}" class="button">Iniciar Onboarding</a>
    </div>
    <div class="footer">
      <p>&copy; ${year} Onboardix. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
  `;
};
