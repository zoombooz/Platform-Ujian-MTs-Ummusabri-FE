import React from 'react';
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image, 
  // Font 
} from '@react-pdf/renderer';

// Define interfaces for our data
interface StudentData {
  name: string;
  id?: string;
  program?: string;
}

interface ExamData {
  title: string;
  date: string;
  time?: string;
  room?: string;
  location?: string;
  sign_date?: string;
  supervisor?: string;
}

interface ExamCardProps {
  student?: any;
  exam?: any;
}

// You would need to register any custom fonts you want to use
// Font.register({
//   family: 'Noto Sans Arabic',
//   src: '/src/font/NotoSansArabic.ttf',
// });

// Create styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: 'white',
    padding: 0,
  },
  container: {
    margin: 10,
    border: '1pt solid #c8e6c9',
    borderRadius: 5,
    overflow: 'hidden',
  },
  headerStripe: {
    height: 10,
    backgroundColor: '#1b5e20',
    backgroundImage: 'repeating-linear-gradient(45deg, #d4af37, #d4af37 10pt, #1b5e20 10pt, #1b5e20 20pt)',
  },
  header: {
    backgroundColor: '#1b5e20',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundImage: 'linear-gradient(to bottom, #1b5e20, #2e7d32)',
  },
  logoContainer: {
    width: 60,
    height: 60,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    border: '2pt solid #d4af37',
  },
  headerTextContainer: {
    flex: 1,
    textAlign: 'center',
  },
  arabicTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    fontFamily: "Noto Sans Arabic" // Uncomment if you register an Arabic font
  },
  title: {
    fontSize: 20,
    color: 'white',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: 'white',
  },
  spacer: {
    width: 60,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '10pt 0',
    padding: '0 20pt',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#d4af37',
  },
  dividerSymbol: {
    margin: '0 15pt',
    color: '#1b5e20',
    fontSize: 18,
  },
  contentContainer: {
    padding: '10pt 20pt 20pt',
    flexDirection: 'row',
    backgroundColor: '#e8f5e933', // 20% opacity
  },
  infoContainer: {
    flex: 3,
    paddingRight: 20,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1pt dotted #a5d6a7',
    paddingVertical: 8,
  },
  lastTableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  tableLabel: {
    width: 120,
    fontWeight: 'bold',
    color: '#1b5e20',
  },
  tableValue: {
    flex: 1,
  },
  photoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  photoFrame: {
    width: 100,
    height: 130,
    border: '2pt solid #d4af37',
    padding: 5,
    marginBottom: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photoText: {
    fontSize: 12,
    color: '#81c784',
  },
  qrContainer: {
    alignItems: 'center',
  },
  qrFrame: {
    border: '2pt solid #d4af37',
    padding: 5,
    backgroundColor: 'white',
  },
  qrCode: {
    width: 100,
    height: 100,
  },
  qrText: {
    fontSize: 12,
    color: '#388e3c',
    marginTop: 5,
  },
  footer: {
    backgroundColor: '#e8f5e9',
    padding: 15,
    borderTop: '2pt solid #d4af37',
    textAlign: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#2e7d32',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#388e3c',
    textAlign: 'center',
  },
  signatureContainer: {
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#e8f5e933', // 20% opacity
  },
  signatureBox: {
    width: 200,
    alignItems: 'center',
  },
  signatureDate: {
    fontSize: 14,
    marginBottom: 40,
  },
  signatureLine: {
    borderTop: '2pt solid #d4af37',
    paddingTop: 5,
    marginTop: 5,
    width: '100%',
  },
  signatureName: {
    fontSize: 14,
    color: '#1b5e20',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

// Create Document Component
const ExamCard: React.FC<ExamCardProps> = ({ student, exam }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.container}>
        {/* Header with Arabic ornament */}
        <View style={styles.headerStripe} />
        
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image 
              style={styles.logo} 
              src="/src/assets/logo-pesri.png" 
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.arabicTitle}>بِطَاقَة الاِمْتِحَان</Text>
            <Text style={styles.title}>KARTU UJIAN</Text>
            <Text style={styles.subtitle}>MTS UMMUSSHABRI PESRI KENDARI</Text>
          </View>
          <View style={styles.spacer} />
        </View>
        
        <View style={styles.headerStripe} />
        
        {/* Ornamental Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerSymbol}>✧</Text>
          <View style={styles.dividerLine} />
        </View>
        
        {/* Content */}
        <View style={styles.contentContainer}>
          <View style={styles.infoContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Nama</Text>
              <Text style={styles.tableValue}>: {student?.nama}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>NIM/NPM</Text>
              <Text style={styles.tableValue}>: {student?.nomor_peserta || '123456789'}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Kelas</Text>
              <Text style={styles.tableValue}>: {student?.kelas?.nama || 'Teknik Informatika'}</Text>
            </View>
            {/* <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Ujian</Text>
              <Text style={styles.tableValue}>: {exam?.title}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Tanggal</Text>
              <Text style={styles.tableValue}>: {exam?.date}</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.tableLabel}>Waktu</Text>
              <Text style={styles.tableValue}>: {exam?.time || '08:00 - 10:00'}</Text>
            </View>
            <View style={styles.lastTableRow}>
              <Text style={styles.tableLabel}>Ruangan</Text>
              <Text style={styles.tableValue}>: {exam?.room || 'R.301'}</Text>
            </View> */}
          </View>
          
          <View style={styles.photoContainer}>
            <View style={styles.photoFrame}>
              <Text style={styles.photoText}>Foto 3x4</Text>
            </View>
            {/* <View style={styles.qrContainer}>
              <View style={styles.qrFrame}>
                <Image 
                  style={styles.qrCode} 
                  src="/placeholder.svg?height=100&width=100" 
                />
              </View>
              <Text style={styles.qrText}>Scan untuk verifikasi</Text>
            </View> */}
          </View>
        </View>
        
        {/* Ornamental Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerSymbol}>✧</Text>
          <View style={styles.dividerLine} />
        </View>
        
        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Harap membawa kartu ujian ini dan kartu identitas saat ujian
          </Text>
          <Text style={styles.footerSubtext}>
            Dilarang membawa alat komunikasi dan melakukan kecurangan dalam bentuk apapun
          </Text>
        </View>
        
        {/* Signature */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureDate}>
              {exam?.location || 'Jakarta'}, {exam?.sign_date || new Date().toLocaleDateString('id-ID')}
            </Text>
            <View style={styles.signatureLine}>
              <Text style={styles.signatureName}>
                {exam?.supervisor || 'Kepala Akademik'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Bottom Ornamental Border */}
        <View style={styles.headerStripe} />
      </View>
    </Page>
  </Document>
);

// Example usage
const ExamCardWrapper: React.FC = () => {
  // Sample data - in a real application, this would come from props or an API
  const studentData: StudentData = {
    name: "Ahmad Fauzi",
    id: "123456789",
    program: "Teknik Informatika"
  };
  
  const examData: ExamData = {
    title: "Ujian Tengah Semester",
    date: "15 Oktober 2023",
    time: "08:00 - 10:00",
    room: "R.301",
    location: "Jakarta",
    sign_date: "10 Oktober 2023",
    supervisor: "Dr. Hasan Basri"
  };

  return <ExamCard student={studentData} exam={examData} />;
};

export default ExamCardWrapper;
export { ExamCard };
export type { StudentData, ExamData, ExamCardProps };