const express = require('express');
const router = express.Router();
const axios = require('axios');
const pdf = require('pdf-parse');
const cheerio = require('cheerio');
const authMiddleware = require('../middleware/auth');
const Kura = require('../models/Kura');

// URL for Istanbul Health Ministry website
const BASE_URL = 'https://istanbulism.saglik.gov.tr';
const KURA_LIST_URL = `${BASE_URL}/aile-hekimligi-kura`;

// Fetch and parse PDF from URL
async function fetchPDFData(pdfUrl) {
  try {
    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const data = await pdf(response.data);
    return data.text;
  } catch (error) {
    console.error('Error fetching PDF:', error);
    throw new Error('PDF verisi alınamadı');
  }
}

// Parse kura list from PDF text
function parseKuraList(pdfText) {
  const lines = pdfText.split('\n');
  const kuraList = [];

  // Pattern to match kura entries (adjust based on actual PDF format)
  const pattern = /(\d+)\s+(.+?)\s+(\d{11})\s+(.+?)\s+(\d+,\d+)/;

  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      kuraList.push({
        sira_no: parseInt(match[1]),
        ad_soyad: match[2].trim(),
        tc_kimlik: match[3],
        ilce: match[4].trim(),
        hizmet_puani: parseFloat(match[5].replace(',', '.'))
      });
    }
  }

  return kuraList;
}

// Scrape website for PDF links
async function scrapePDFLinks() {
  try {
    const response = await axios.get(KURA_LIST_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const pdfLinks = [];

    // Find all PDF links (adjust selector based on actual website)
    $('a[href*=".pdf"]').each((index, element) => {
      const href = $(element).attr('href');
      const text = $(element).text().trim();

      // Convert relative URLs to absolute
      const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;

      pdfLinks.push({
        url: fullUrl,
        title: text,
        date: new Date()
      });
    });

    return pdfLinks;
  } catch (error) {
    console.error('Error scraping website:', error);
    throw new Error('Web sitesi taranamadı');
  }
}

// Route: Fetch latest kura PDF and import data
router.post('/import-latest', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Yetkiniz bulunmamaktadır' });
    }

    // Get PDF links from website
    const pdfLinks = await scrapePDFLinks();

    if (pdfLinks.length === 0) {
      return res.status(404).json({ error: 'PDF dosyası bulunamadı' });
    }

    // Get the latest PDF
    const latestPDF = pdfLinks[0];

    // Fetch and parse PDF data
    const pdfText = await fetchPDFData(latestPDF.url);
    const kuraList = parseKuraList(pdfText);

    // Import to database
    let imported = 0;
    let updated = 0;

    for (const entry of kuraList) {
      const existing = await Kura.findOne({ tc_kimlik: entry.tc_kimlik });

      if (existing) {
        // Update existing entry
        await Kura.updateOne(
          { tc_kimlik: entry.tc_kimlik },
          { $set: entry }
        );
        updated++;
      } else {
        // Create new entry
        await Kura.create(entry);
        imported++;
      }
    }

    res.json({
      success: true,
      message: 'PDF verisi başarıyla içe aktarıldı',
      stats: {
        total: kuraList.length,
        imported,
        updated,
        source: latestPDF.title
      }
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Get available PDF links
router.get('/available-pdfs', authMiddleware, async (req, res) => {
  try {
    const pdfLinks = await scrapePDFLinks();

    res.json({
      success: true,
      count: pdfLinks.length,
      pdfs: pdfLinks
    });
  } catch (error) {
    console.error('Error getting PDFs:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Import from specific PDF URL
router.post('/import-from-url', authMiddleware, async (req, res) => {
  try {
    const { pdfUrl } = req.body;

    if (!pdfUrl) {
      return res.status(400).json({ error: 'PDF URL gerekli' });
    }

    // Check if user is admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Yetkiniz bulunmamaktadır' });
    }

    // Fetch and parse PDF data
    const pdfText = await fetchPDFData(pdfUrl);
    const kuraList = parseKuraList(pdfText);

    // Import to database
    let imported = 0;
    let updated = 0;

    for (const entry of kuraList) {
      const existing = await Kura.findOne({ tc_kimlik: entry.tc_kimlik });

      if (existing) {
        await Kura.updateOne(
          { tc_kimlik: entry.tc_kimlik },
          { $set: entry }
        );
        updated++;
      } else {
        await Kura.create(entry);
        imported++;
      }
    }

    res.json({
      success: true,
      message: 'PDF verisi başarıyla içe aktarıldı',
      stats: {
        total: kuraList.length,
        imported,
        updated
      }
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route: Auto-sync (can be called by cron job)
router.post('/auto-sync', async (req, res) => {
  try {
    // Verify secret key for cron job
    const { secret } = req.body;
    if (secret !== process.env.CRON_SECRET) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // Get PDF links from website
    const pdfLinks = await scrapePDFLinks();

    if (pdfLinks.length === 0) {
      return res.json({ message: 'No PDFs found' });
    }

    // Get the latest PDF
    const latestPDF = pdfLinks[0];

    // Check if we already processed this PDF
    const lastSync = await Kura.findOne().sort({ updatedAt: -1 });

    // Fetch and parse PDF data
    const pdfText = await fetchPDFData(latestPDF.url);
    const kuraList = parseKuraList(pdfText);

    // Import to database
    let imported = 0;
    let updated = 0;

    for (const entry of kuraList) {
      const existing = await Kura.findOne({ tc_kimlik: entry.tc_kimlik });

      if (existing) {
        await Kura.updateOne(
          { tc_kimlik: entry.tc_kimlik },
          { $set: entry }
        );
        updated++;
      } else {
        await Kura.create(entry);
        imported++;
      }
    }

    res.json({
      success: true,
      message: 'Auto-sync completed',
      stats: {
        total: kuraList.length,
        imported,
        updated,
        source: latestPDF.title,
        syncedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Auto-sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;