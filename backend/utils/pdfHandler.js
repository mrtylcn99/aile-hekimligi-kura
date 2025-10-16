const fs = require('fs');
const pdf = require('pdf-parse');
const PDFDocument = require('pdfkit');
const path = require('path');

async function parsePDF(pdfPath) {
  try {
    const dataBuffer = fs.readFileSync(pdfPath);
    const data = await pdf(dataBuffer);

    const lines = data.text.split('\n');
    const extractedData = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (line.match(/^\d+\s+\d{2}:\d{2}/)) {
        const parts = line.split(/\s+/);

        if (parts.length >= 10) {
          const row = {
            sira_no: parseInt(parts[0]),
            oturum_baslangic_saati: parts[1],
            ad: parts[2],
            soyad: parts[3],
            dogum_sonrasi_kamu_gorevine_baslama_tarihi: parseDate(parts[4]),
            hizmet_puani: parseFloat(parts[5]) || 0,
            unvan: parts[6] + ' ' + (parts[7] || ''),
            basvuru_sekli: parts[8] || '',
            ilce: '',
            aile_sagligi_merkezi: '',
            aile_hekimligi_birimi: '',
            muvafakat_durumu: ''
          };

          if (i + 1 < lines.length && lines[i + 1].trim()) {
            const nextLine = lines[i + 1].trim();
            const nextParts = nextLine.split(/\s+/);

            row.ilce = nextParts[0] || '';
            row.aile_sagligi_merkezi = nextParts.slice(1, -2).join(' ') || '';
            row.aile_hekimligi_birimi = nextParts[nextParts.length - 2] || '';
            row.muvafakat_durumu = nextParts[nextParts.length - 1] || '';
            i++;
          }

          extractedData.push(row);
        }
      }
    }

    return extractedData;
  } catch (err) {
    console.error('PDF parse hatası:', err);
    return null;
  }
}

function parseDate(dateStr) {
  if (!dateStr || dateStr === '') return null;

  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  }
  return null;
}

async function generateApplicationPDF(formData, formId) {
  try {
    const exportPath = path.join(__dirname, '..', '..', 'exports');
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const fileName = `basvuru_formu_${formId}_${Date.now()}.pdf`;
    const filePath = path.join(exportPath, fileName);

    const doc = new PDFDocument();
    doc.pipe(fs.createWriteStream(filePath));

    doc.fontSize(16).text('T.C. SAĞLIK BAKANLIĞI', { align: 'center' });
    doc.fontSize(14).text('İSTANBUL İL SAĞLIK MÜDÜRLÜĞÜ', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('AİLE HEKİMLİĞİ BAŞVURU FORMU', { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(10);
    const fields = [
      { label: 'T.C. Kimlik No', value: formData.tc_kimlik },
      { label: 'Adı', value: formData.ad },
      { label: 'Soyadı', value: formData.soyad },
      { label: 'Doğum Tarihi', value: formatDate(formData.dogum_tarihi) },
      { label: 'Doğum Yeri', value: formData.dogum_yeri || '-' },
      { label: 'Sicil No', value: formData.sicil_no || '-' },
      { label: 'Hizmet Puanı', value: formData.hizmet_puani || '-' },
      { label: 'Kadro Yeri', value: formData.kadro_yeri || '-' },
      { label: 'Ünvanı', value: formData.unvan || '-' },
      { label: 'Mezun Olduğu Üniversite', value: formData.mezun_universite || '-' },
      { label: 'Uyum Eğitimi Sertifika No', value: formData.uyum_egitimi_sertifika || '-' },
      { label: 'Cep Telefonu', value: formData.telefon },
      { label: 'E-posta Adresi', value: formData.email }
    ];

    fields.forEach(field => {
      doc.text(`${field.label}: ${field.value}`);
      doc.moveDown(0.5);
    });

    doc.moveDown(2);
    doc.text(`Başvuru Tarihi: ${formatDate(formData.basvuru_tarihi)}`, { align: 'right' });
    doc.moveDown(3);

    doc.text('İmza: _____________________', { align: 'right' });

    doc.end();

    return filePath;
  } catch (err) {
    console.error('PDF oluşturma hatası:', err);
    throw err;
  }
}

function formatDate(date) {
  if (!date) return '-';
  const d = new Date(date);
  return `${d.getDate().toString().padStart(2, '0')}.${(d.getMonth() + 1).toString().padStart(2, '0')}.${d.getFullYear()}`;
}

module.exports = {
  parsePDF,
  generateApplicationPDF
};