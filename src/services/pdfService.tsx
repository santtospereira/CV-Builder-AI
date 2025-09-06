import { pdf } from '@react-pdf/renderer';
import PDFDocument from '../components/Preview/PDFDocument';
import { CVData } from '../types/cv.types'; // Assuming CVData is needed

/**
 * Exporta os dados do CV para um arquivo PDF usando @react-pdf/renderer.
 * @param cvData Os dados do CV a serem exportados.
 * @param fileName O nome do arquivo PDF a ser salvo.
 */
export const exportToPdf = async (cvData: CVData, fileName: string): Promise<void> => {
  try {
    const blob = await pdf(<PDFDocument cvData={cvData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Erro ao gerar o PDF:", error);
    throw new Error("Não foi possível gerar o PDF.");
  }
};
