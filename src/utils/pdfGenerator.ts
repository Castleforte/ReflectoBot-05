import html2pdf from 'html2pdf.js';

export const generatePdf = async (element: HTMLElement, filename: string) => {
  // Increase delay to ensure DOM is fully rendered
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const options = {
    margin: [0.5, 0.5, 0.5, 0.5],
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: true
    },
    jsPDF: { 
      unit: 'in', 
      format: 'a4', 
      orientation: 'portrait' 
    }
  };

  return html2pdf().set(options).from(element).save();
};