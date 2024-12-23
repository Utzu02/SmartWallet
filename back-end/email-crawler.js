import { promises as fs } from 'fs';
import path from 'path';
import process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';
import pdfParse from 'pdf-parse';
import { remove } from 'diacritics';

const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

// Funcție care verifică dacă un text conține cuvinte cheie care sugerează că este o factură
const isInvoice = (text) => {
  const invoiceKeywords = [
    "invoice", "nr. factura", "numar factura", "data facturii", "total de plata", "suma totala", "valoare TVA", "valoare articole",
    "cota tva", "termen de plata", "plata restanta", "data scadentei", "cod fiscal", "detalii plata", 
    "factura proforma", "subtotal", "factura fiscala", 
    "suma de plata", "ordin de plata", "numar comanda", "factura originala", "factura curenta","total fara tva"
  ];
  const x=0;
  // Elimină diacriticele și face textul case-insensitive
  const normalizedText = remove(text).toLowerCase();
  return invoiceKeywords.some(keyword => normalizedText.includes(remove(keyword).toLowerCase()));
};

// Funcție pentru a extrage suma totală plătită
const extractTotalAmount = (text) => {
  const regex = /\s?(\d+(?:[\.,]\d{1,2})?)\s*(RON|LEI|RONI|LEU)/gi;  // Căutăm toate numerele urmate de RON, LEI etc.
  const matches = [];
  let match;

  while ((match = regex.exec(text)) !== null) {
    const amountString = match[1].replace(',', '.');
    const precedingChar = text[match.index - 1];  // Caracterul care precede suma

    // Verificăm dacă înainte de sumă există o literă
    if (/[a-zA-Z]/.test(precedingChar)|| precedingChar == '.') {
      // Dacă există literă, ignorăm această sumă
      continue;
    }

    // Dacă suma este validă, o adăugăm în lista de sume
    const amount = parseFloat(amountString);
    matches.push(amount);
  }

  return matches; // Returnăm lista de sume găsite
};

// Încarcă credențialele salvate, dacă există
async function loadSavedCredentialsIfExist() {
  try {
    const content = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch {
    return null;
  }
}

// Salvează credențialele utilizatorului într-un fișier
async function saveCredentials(client) {
  const content = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token,
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

// Autentifică utilizatorul și obține un client autorizat
async function authorize() {
  let client = await loadSavedCredentialsIfExist();
  if (client) return client;
  client = await authenticate({ scopes: SCOPES, keyfilePath: CREDENTIALS_PATH });
  if (client.credentials) await saveCredentials(client);
  return client;
}

/**
 * Extrage atașamentele relevante dintr-un mesaj.
 *
 * @param {Object} payload Payload-ul mesajului.
 * @param {Array<string>} extensions Extensiile de fișiere care trebuie verificate.
 * @return {Array} Lista de atașamente.
 */
const extractAttachments = (payload, extensions) => {
  const attachments = [];
  const findAttachments = (parts) => {
    for (const part of parts) {
      if (part.filename && extensions.some(ext => part.filename.endsWith(ext)) && part.body.attachmentId) {
        attachments.push({
          filename: part.filename,
          mimeType: part.mimeType,
          attachmentId: part.body.attachmentId,
        });
      }
      if (part.parts) findAttachments(part.parts);
    }
  };
  findAttachments(payload.parts || []);
  return attachments;
};

/**
 * Citește fișierul PDF și verifică dacă conține o factură.
 * 
 * @param {Buffer} pdfBuffer Buffer-ul fișierului PDF.
 * @return {boolean} True dacă fișierul conține o factură, altfel False.
 */
const checkIfPdfIsInvoice = async (pdfBuffer) => {
  try {
    const data = await pdfParse(pdfBuffer);
    const text = data.text;
    return isInvoice(text);
  } catch (error) {
    console.error('Eroare la procesarea PDF-ului:', error);
    return false;
  }
};

/**
 * Extrage domeniul din adresa de email
 * 
 * @param {string} email Adresa de email.
 * @return {string} Domeniul extraat din email.
 */
const extractDomain = (email) => {
  const domainMatch = email && email.includes('@') ? email.split('@')[1].split('.')[0] : '(Unknown domain)';
  return domainMatch;
};

// Vector pentru stocarea facturilor
const invoicesArray = [];

// Mapa pentru stocarea sumelor totale de plată pentru fiecare domeniu
const domainTotalMap = new Map();

/**
 * Listează și extrage atașamentele din mesajele Gmail și verifică dacă conțin facturi.
 * 
 * @param {google.auth.OAuth2} auth Un client OAuth2 autorizat.
 */
var maxSettedResults;

async function listMessagesWithAllAttachments(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  const extensions = ['.pdf', '.docx', '.xlsx']; // Extensiile de fișiere relevante

  try {
    // Obține lista de mesaje care au atașamente
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: maxSettedResults, // Modifică după necesitate pentru a obține mai multe mesaje
      q: 'has:attachment' // Filtrare doar pentru mesaje cu atașamente
    });

    const messages = res.data.messages;
    if (!messages || messages.length === 0) {
      console.log('No messages found.');
      return;
    }

    // Procesăm mesajele în paralel, folosind Promise.all
    await Promise.all(messages.map(async (message) => {
      const msgRes = await gmail.users.messages.get({ userId: 'me', id: message.id });
      const msg = msgRes.data;

      // Extrage atașamentele relevante
      const attachments = extractAttachments(msg.payload, extensions);
      if (attachments.length > 0) {
        // Extrage adresa de email a expeditorului
        const fromHeader = msg.payload.headers.find(header => header.name === 'From')?.value;
        const emailSender = fromHeader ? fromHeader.split('<')[1]?.split('>')[0] : '(Unknown email)';
        const domainPart = extractDomain(emailSender);

        // Procesare atașamente
        await Promise.all(attachments.map(async (attachment) => {

          if (attachment.filename.endsWith('.pdf')) {
            const attachmentData = await gmail.users.messages.attachments.get({
              userId: 'me',
              messageId: msg.id,
              id: attachment.attachmentId,
            });

            const pdfBuffer = Buffer.from(attachmentData.data.data, 'base64');
            const isInvoiceFile = await checkIfPdfIsInvoice(pdfBuffer);

            if (isInvoiceFile) {
              const pdfText = await pdfParse(pdfBuffer);

              // Extrage toate sumele din textul facturii
              const totalAmounts = extractTotalAmount(pdfText.text);

              // Adăugăm facturile în vector
              totalAmounts.forEach(totalAmount => {
                invoicesArray.push({
                  domain: domainPart,
                  filename: attachment.filename,
                  PDF: pdfText,
                  totalAmount: totalAmount,
                });

                // Actualizăm suma totală în mapa pentru domenii
                if (domainTotalMap.has(domainPart)) {
                  domainTotalMap.set(domainPart, domainTotalMap.get(domainPart) + totalAmount);
                } else {
                  domainTotalMap.set(domainPart, totalAmount);
                }
              });
            }
          }
        }));
      }
    }));
  } catch (error) {
    console.error('Error fetching messages:', error);
  }

  // Sortează facturile în funcție de domeniu
  invoicesArray.sort((a, b) => a.domain.localeCompare(b.domain));

  // Afișează facturile procesate
  invoicesArray.forEach((invoice) => {
    console.log(`Domeniu expeditor: ${invoice.domain}`);
    console.log(`Fișier: ${invoice.filename}`);
    console.log(`Suma totală: ${invoice.totalAmount} RON`);
    console.log('=====================================================');
  });

  // Afișează suma totală de plată pentru fiecare domeniu
  console.log('Suma totală de plată pentru fiecare domeniu:');
  domainTotalMap.forEach((total, domain) => {
    console.log(`${domain}: ${total} RON`);
  });

  console.log("FINISH");
}

// Verifică starea și începe procesul

// Autentifică și afișează toate atașamentele
const emailCrawl = (x) => {
  maxSettedResults = x;
  return authorize().then(listMessagesWithAllAttachments).catch(console.error);
};

export default emailCrawl;
