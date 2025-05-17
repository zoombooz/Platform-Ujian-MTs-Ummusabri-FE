import React from "react";
import {
  Document,
  Page,
  Text,
  Image,
  StyleSheet,
  View,
  PDFViewer,
  Font,
} from "@react-pdf/renderer";

// Styles
const styles = StyleSheet.create({
    viewer: { width: '100%', height: '100vh' },
    page: { padding: 20, fontSize: 10, fontFamily: 'Helvetica' },
  
    // Top metadata
    metaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    metaText: { fontSize: 8 },
  
    // Header top with logo and main titles
    headerTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    logo: { width: 60, height: 60 },
    titleBlock: { flex: 1, textAlign: 'center' },
    mainTitle: { fontSize: 14, fontWeight: 'bold', textAlign: 'center' },
    subTitle: { fontSize: 12, textAlign: 'center', marginTop: 2 },
  
    // Detail section
    detailSection: { flexDirection: 'column', justifyContent: 'space-around',gap:'1rem', marginBottom: 12 },
    detailCol: { flexDirection: 'row', flex: 1 },
    detailLabel: { fontWeight: 'bold', width: 100 },
    detailValue: { flex: 1 },
  
    // Table
    table: { borderWidth: 1, borderColor: '#000', borderStyle: 'solid' },
    tableRow: { flexDirection: 'row' },
    tableColHeader: { width: '20%', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#000', backgroundColor: '#E4E4E4', padding: 4 },
    tableCol: { width: '20%', borderBottomWidth: 1, borderRightWidth: 1, borderColor: '#000', padding: 4 },
    tableCellHeader: { fontWeight: 'bold' },
  });
  

// Data interface
interface Participant {
  nomor_peserta: number;
  nama: string;
  kelas: string;
  benar: number;
  salah: number;
  score: number;
}

interface Props {
  data: Participant[];
  title?: string;
  kelas?: string;
  tingkatan?: string;
  logoUrl?: string;
}

// PDF document
const PDFTableDocument: React.FC<Props> = ({
  data = null,
  title = null,
  kelas = null,
  tingkatan = null,
  logoUrl = null,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Top metadata */}
      <View style={styles.metaRow}>
        <Text style={styles.metaText}>{new Date().toLocaleString()}</Text>
        <Text style={styles.metaText}>{"Absen CBT"}</Text>
      </View>

      {/* Main heading */}

      <View style={styles.headerTop}>
        <Image style={styles.logo} src={`${logoUrl}`} />
        <View style={styles.titleBlock}>
          <Text style={styles.subTitle}>MTS Ummusshabri Kendari</Text>
          <Text style={styles.mainTitle}>
            HASIL UJIAN {title?.toUpperCase()}
          </Text>
        </View>
      </View>
      {/* Detail section */}
      <View style={styles.detailSection}>

          <Text style={{ fontSize: 12 }}>
            <Text style={{ fontWeight: "bold" }}>Kelas:</Text> {kelas}
          </Text>
          <Text style={{ fontSize: 12 }}>
            <Text style={{ fontWeight: "bold" }}>Tingkatan:</Text> {tingkatan}
          </Text>

      </View>

      {/* Table */}
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Nomor Peserta</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Nama</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Benar</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Salah</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Score</Text>
          </View>
        </View>
        {data?.map((item, idx) => (
          <View style={styles.tableRow} key={idx}>
            <View style={styles.tableCol}>
              <Text>{item.nomor_peserta}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{item.nama}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{item.benar}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{item.salah}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text>{item.score}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

// Viewer component
const HasilUjianPdfViewer: React.FC<Props> = (props) => (
  <PDFViewer style={styles.viewer}>
    <PDFTableDocument {...props} />
  </PDFViewer>
);

export default HasilUjianPdfViewer;
