import React from 'react';
import { Document, Page, View, Text, StyleSheet, Font } from '@react-pdf/renderer';
import { CVData } from '../../types/cv.types';

// Register a font if needed (e.g., for bold/semibold if Helvetica doesn't support it well)
// Font.register({ family: 'Open Sans', fonts: [
//   { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf' },
//   { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf', fontWeight: 600 },
//   { src: 'https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf', fontWeight: 700 },
// ]});

// Define colors based on common Tailwind/CSS variable usage
const colors = {
  primary: '#0056b3', // Example: a blue for titles/accents
  text: '#333', // General text color
  gray600: '#666', // Lighter gray text
  gray700: '#4a4a4a', // Slightly darker gray text
  borderColor: '#ddd', // Border color
  headerBg: '#f3f4f6', // Example header background
  headerText: '#2c3e50', // Example header text
  cvBg: '#ffffff', // CV background
};

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: colors.cvBg,
    padding: 25,
    fontFamily: 'Helvetica', // Or 'Open Sans' if registered
  },
  section: {
    marginBottom: 20,
  },
  // Mimicking text-2xl font-bold
  h2: {
    fontSize: 24, // text-2xl
    fontWeight: 'bold', // font-bold
    color: colors.primary,
    borderBottomWidth: 2, // border-b-2
    borderBottomColor: colors.borderColor,
    paddingBottom: 8, // pb-2 (approx 8px)
    marginBottom: 16, // mb-4 (approx 16px)
  },
  // Mimicking text-lg font-semibold
  h3: {
    fontSize: 18, // text-lg
    fontWeight: 'semibold', // font-semibold
    color: colors.text,
  },
  // Mimicking text-base
  textBase: {
    fontSize: 16, // text-base
    color: colors.text,
    lineHeight: 1.6,
  },
  // Mimicking text-sm
  textSm: {
    fontSize: 14, // text-sm
    color: colors.gray600,
  },
  // Mimicking text-xs
  textXs: {
    fontSize: 12, // text-xs
    color: colors.gray600,
  },
  jobPeriod: {
    fontStyle: 'italic',
    fontSize: 14, // text-sm
    color: colors.gray600,
    marginBottom: 5,
  },
  bulletList: {
    padding: 0,
    marginTop: 8, // mt-2
  },
  bulletItem: {
    marginBottom: 4, // mb-1
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingLeft: 15, // pl-5
  },
  bullet: {
    fontSize: 16, // Match textBase for visual consistency
    color: colors.primary,
    fontWeight: 'bold',
    marginRight: 5,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  // For skills section columns
  skillsColumn: {
    width: '50%',
    paddingRight: 10, // gap-x-8 (approx)
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

interface PDFDocumentProps {
  cvData: CVData;
}

const PDFDocument: React.FC<PDFDocumentProps> = ({ cvData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Personal Header */}
      <View style={styles.section}>
        <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: colors.headerText }}>{cvData.personalInfo?.name || 'Nome Completo'}</Text>
        <Text style={{ fontSize: 14, textAlign: 'center', color: colors.gray600, marginTop: 5 }}>
          {cvData.personalInfo?.email || 'email@exemplo.com'} | {cvData.personalInfo?.phone || '(11) 98765-4321'} | {cvData.personalInfo?.linkedin ? cvData.personalInfo.linkedin.replace(/^(https?:\/\/)?(www\.)?/, '') : 'linkedin.com/in/seu-perfil'}
        </Text>
      </View>

      {/* Summary Section */}
      {cvData.summary && (
        <View style={styles.section}>
          <Text style={styles.h2}>Resumo Profissional</Text>
          <Text style={styles.textBase}>{cvData.summary}</Text>
        </View>
      )}

      {/* Education Section (moved here as per user request) */}
      {cvData.education && cvData.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.h2}>Formação Acadêmica</Text>
          {cvData.education.map((edu, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.h3}>{edu.degree || 'Grau/Curso'} em {edu.institution || 'Instituição'}</Text>
              <Text style={styles.jobPeriod}>{edu.startDate || ''} - {edu.endDate || ''}</Text>
              {edu.description && edu.description.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.textBase}>{line.replace(/^(-|\*)\s*/, '')}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {/* Skills Section */}
      {cvData.skills && cvData.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.h2}>Habilidades</Text>
          <View style={styles.skillsRow}>
            {cvData.skills.map((skill, index) => (
              <Text key={index} style={styles.skillsColumn}>
                <Text style={{ fontWeight: 'semibold' }}>{skill.name}</Text>: {skill.level}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Experience Section */}
      {cvData.experiences && cvData.experiences.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.h2}>Experiência Profissional</Text>
          {cvData.experiences.map((exp, index) => (
            <View key={index} style={{ marginBottom: 10 }}>
              <Text style={styles.h3}>{exp.title || 'Cargo'} em {exp.company || 'Empresa'}</Text>
              <Text style={styles.jobPeriod}>{exp.startDate || ''} - {exp.endDate || ''}</Text>
              {exp.description && exp.description.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                <View key={idx} style={styles.bulletItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.textBase}>{line.replace(/^(-|\*)\s*/, '')}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default PDFDocument;