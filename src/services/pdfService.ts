import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Exporta um elemento HTML para um arquivo PDF.
 * @param element O elemento HTML a ser exportado.
 * @param fileName O nome do arquivo PDF a ser salvo.
 */
export const exportToPdf = async (element: HTMLElement, fileName: string): Promise<void> => {
  if (!element) {
    console.error("Elemento para exportação não foi encontrado.");
    return;
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Aumenta a resoluÃ§Ã£o para melhor qualidade
      useCORS: true, // Permite carregar imagens de outras origens
      logging: true,
      ignoreElements: (element) => element.tagName === 'STYLE' || element.tagName === 'LINK' // Adicionado para depuraÃ§Ã£o
    });

    const imgData = canvas.toDataURL('image/png');

    // As dimensÃµes do PDF serÃ£o A4 (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // A proporÃ§Ã£o da imagem
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Adiciona a primeira pÃ¡gina
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Adiciona mais pÃ¡ginas se o conteÃºdo for maior que uma pÃ¡gina A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    if (element) {
      console.log("Elemento que causou o erro:", element.outerHTML);
    }
    throw new Error("NÃ£o foi possÃível gerar o PDF.");
  }
};
