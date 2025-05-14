// ExamCardAll.tsx
import React from 'react';
import { pdf, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

interface Student {
  nama: string;
  nomor_peserta: string;
  password: string;
  kelas: {
    nama: string;
  };
}

interface Exam {
  location: string;
  sign_date: string;
  supervisor: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 10,
    fontSize: 10,
  },
  container: {
    border: '1pt solid #ddd',
    marginBottom: 10,
  },
  header: {
    backgroundColor: '#2e7d32',
    padding: 8,
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
  },
  content: {
    padding: 10,
    flexDirection: 'row',
  },
  infoColumn: {
    flex: 1,
    marginRight: 10,
  },
  row: {
    paddingVertical: 4,
    borderBottom: '1pt solid #eee',
  },
  footer: {
    marginTop: 10,
    padding: 8,
    borderTop: '1pt solid #ddd',
    textAlign: 'center',
  },
});

const ExamCardAll: React.FC<{ student: Student; exam?: Exam }> = ({ student, exam }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>KARTU UJIAN</Text>
          <Text style={[styles.title, { fontSize: 12 }]}>MTS UMMUSSHABRI PESRI KENDARI</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.infoColumn}>
            <View style={styles.row}>
              <Text>Nama: {student.nama}</Text>
            </View>
            <View style={styles.row}>
              <Text>NIM/NPM: {student.nomor_peserta}</Text>
            </View>
            <View style={styles.row}>
              <Text>Password: {student.password}</Text>
            </View>
            <View style={styles.row}>
              <Text>Kelas: {student.kelas.nama}</Text>
            </View>
          </View>
        </View>

        {/* <View style={styles.footer}>
          <Text>Harap membawa kartu identitas saat ujian</Text>
          <Text style={{ marginTop: 4 }}>{exam?.location}, {exam?.sign_date}</Text>
          <Text style={{ marginTop: 8 }}>{exam?.supervisor}</Text>
        </View> */}
      </View>
    </Page>
  </Document>
);

export const generateStudentPDF = async (student: Student, exam?: Exam) => {
  const blob = await pdf(<ExamCardAll student={student} exam={exam} />).toBlob();
  return blob;
};

export default ExamCardAll;