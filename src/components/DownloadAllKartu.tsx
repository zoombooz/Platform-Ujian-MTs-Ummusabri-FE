// DownloadAllKartu.tsx
import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { generateStudentPDF } from './ExamCardAll';

interface DownloadAllKartuProps {
  students: Array<{
    nama: string;
    nomor_peserta: string;
    password: string;
    kelas: { nama: string };
  }>|any[];
  exam?: {
    location: string;
    sign_date: string;
    supervisor: string;
  }|any;
}

const DownloadAllKartu: React.FC<DownloadAllKartuProps> = ({ students = [], exam }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadAll = async () => {
    if (students.length === 0) return;
    
    setLoading(true);
    setError('');
    
    try {
      const zip = new JSZip();
      
      // Generate semua PDF
      const promises = students.map(async (student) => {
        const blob = await generateStudentPDF(student, exam);
        const fileName = `Kartu_Ujian_${student.nama.replace(/ /g, '_')}.pdf`;
        zip.file(fileName, blob);
      });

      await Promise.all(promises);
      
      // Generate ZIP file
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'Kartu_Ujian_Semua_Peserta.zip');
      
    } catch (err) {
      setError('Gagal membuat file ZIP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button 
        onClick={handleDownloadAll}
        style={{
          padding: '10px 20px',
          backgroundColor: students.length ? '#2e7d32' : '#cccccc',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: students.length ? 'pointer' : 'not-allowed',
          fontSize: '14px',
          transition: 'background-color 0.3s',
        }}
        disabled={loading || !students.length}
      >
        {loading ? (
          'Membuat ZIP...'
        ) : students.length ? (
          `Download Semua (${students.length} File PDF)`
        ) : (
          'Tidak ada data siswa'
        )}
      </button>
      
      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}

      <style>{`
        button:hover {
          background-color: ${students.length ? '#1b5e20' : '#cccccc'} !important;
        }
      `}</style>
    </div>
  );
};

export default DownloadAllKartu;