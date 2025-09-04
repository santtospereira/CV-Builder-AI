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
      scale: 2, // Aumenta a resolução para melhor qualidade
      useCORS: true, // Permite carregar imagens de outras origens
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');

    // As dimensões do PDF serão A4 (210mm x 297mm)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // A proporção da imagem
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Adiciona a primeira página
    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Adiciona mais páginas se o conteúdo for maior que uma página A4
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save(`${fileName}.pdf`);

  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    throw new Error("Não foi possível gerar o PDF.");
  }
};
