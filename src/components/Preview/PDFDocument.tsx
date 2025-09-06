import React from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';
import { CVData } from '../../types/cv.types';

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 25, // Corresponds to 2.5cm margin
    fontFamily: 'Helvetica', // Default font
  },
  section: {
    marginBottom: 20,
  },
  h2: {
    fontSize: 14,
    color: '#0056b3',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 5,
    marginBottom: 15,
  },
  h3: {
    fontSize: 17.6, // Corresponds to 1.1em
    fontWeight: 'bold',
    color: '#333',
  },
  jobPeriod: {
    fontStyle: 'italic',
    fontSize: 14.4, // Corresponds to 0.9em
    color: '#666',
    marginBottom: 5,
  },
  text: {
    fontSize: 12, // Corresponds to 12pt body-md
    color: '#333',
    lineHeight: 1.6,
  },
  bulletList: {
    listStyleType: 'none',
    padding: 0,
  },
  bulletItem: {
    marginBottom: 5,
    paddingLeft: 20,
    position: 'relative',
  },
  bullet: {
    position: 'absolute',
    left: 0,
    top: 0,
    fontSize: 12,
    color: '#0056b3',
    fontWeight: 'bold',
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
        <Text style={{ fontSize: 40, fontWeight: 'extrabold', textAlign: 'center', color: '#2c3e50' }}>{cvData.personalInfo?.name || 'Nome Completo'}</Text>
        <Text style={{ fontSize: 19.2, textAlign: 'center', color: '#555', marginTop: 5 }}>
          {cvData.personalInfo?.email || 'email@exemplo.com'} | {cvData.personalInfo?.phone || '(11) 98765-4321'} | {cvData.personalInfo?.linkedin || 'linkedin.com/in/seu-perfil'}
        </Text>
      </View>

      {/* Summary Section */}
      {cvData.summary && (
        <View style={styles.section}>
          <Text style={styles.h2}>Resumo</Text>
          <Text style={styles.text}>{cvData.summary}</Text>
        </View>
      )}

      {/* Skills Section */}
      {cvData.skills && cvData.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.h2}>Habilidades</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {cvData.skills.map((skill, index) => (
              <Text key={index} style={{ width: '50%', ...styles.text }}>
                <Text style={{ fontWeight: 'bold' }}>{skill.name}</Text>: {skill.level}
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
              <Text style={styles.h3}>{exp.position || 'Cargo'} em {exp.company || 'Empresa'}</Text>
              <Text style={styles.jobPeriod}>{exp.period || 'Período'}</Text>
              {/* Description with bullet points */}
              {exp.description && exp.description.split('\n').filter(line => line.trim() !== '').some(line => line.trim().startsWith('- ') || line.trim().startsWith('* ')) ? (
                <View style={styles.bulletList}>
                  {exp.description.split('\n').filter(line => line.trim() !== '').map((line, idx) => (
                    <View key={idx} style={styles.bulletItem}>
                      <Text style={styles.bullet}>•</Text>
                      <Text style={{ ...styles.text, marginLeft: 15 }}>{line.replace(/^(-|\*)\s*/, '')}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.text}>{exp.description || 'Descrição da experiência'}</Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export default PDFDocument;