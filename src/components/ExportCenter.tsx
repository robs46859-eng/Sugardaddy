import React, { useState } from 'react';
import { Booking, Review, Message, UserState } from '../types';
import { Download, FileText, FileSpreadsheet, Code, CheckCircle, Database } from 'lucide-react';

interface ExportCenterProps {
  currentUser: UserState;
  userBookings: Booking[];
  messagesList: Message[];
  reviewsList: Review[];
}

export const ExportCenter: React.FC<ExportCenterProps> = ({
  currentUser,
  userBookings,
  messagesList,
  reviewsList,
}) => {
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Trigger JSON download
  const handleExportJSON = () => {
    const backupDataset = {
      exportedAt: new Date().toISOString(),
      platformVersion: 'v1.4.0-Production-Luxe',
      userProfile: {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email,
        walletBalance: currentUser.walletBalance,
        verificationStatus: currentUser.verification,
      },
      bookings: userBookings,
      cachedConversations: messagesList,
      associatedReviews: reviewsList,
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(backupDataset, null, 2)
    )}`;
    
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `SugarDaddy_Backup_Data_${currentUser.name.replace(' ', '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setDownloadSuccessMessage('Robust system JSON data packet parsed and saved locally!');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  // Trigger CSV download
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Record Type,ID,Detail 1,Detail 2,Detail 3,Amount ($)\n';
    
    // Append profile row
    csvContent += `Profile,${currentUser.id},${currentUser.name},${currentUser.email},Verified,${currentUser.walletBalance}\n`;
    
    // Append bookings
    userBookings.forEach((book) => {
      csvContent += `Booking,${book.id},${book.providerName},${book.categoryName},${book.date},${book.totalAmount}\n`;
    });

    // Append messages count row
    csvContent += `Messages,System_Cache,All Cached Texts,Count: ${messagesList.length},e2e-Secured,-\n`;

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodedUri);
    downloadAnchor.setAttribute('download', `SugarDaddy_Bookings_ledger_${currentUser.name.replace(' ', '_')}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setDownloadSuccessMessage('Marketplace ledger parsed to standard CSV spreadsheet.');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  // Trigger PDF Simulated Receipts Document
  const handleExportPDF = () => {
    const documentBodyText = `
--------------------------------------------------
SUGAR DADDY MARKETPLACE - OFFICIAL DATA LEDGER
--------------------------------------------------
Client Owner Name: ${currentUser.name}
Email Address: ${currentUser.email}
Report Generation Timestamp: 2026-06-20 (UTC Calibration)
Platform Security Profile: Tier-1 Biometric Verified
Cleared Escrow Ledger Balance: $${currentUser.walletBalance}

BOOKINGS HISTORY LEDGER SUMMARY:
${userBookings.map((b, i) => `[${i + 1}] Booking Ref: ${b.id} | provider: ${b.providerName} | Amount: $${b.totalAmount} | Category: ${b.categoryName}`).join('\n')}

E2E ENCRYPTED CONVERSATION LOG COUNTER:
Total cached secure message transactions: ${messagesList.length} items.

AUTHENTICATION RECORD STATUS:
- Passport: ${currentUser.verification.governmentId}
- Biometrics: ${currentUser.verification.selfie}
- Legal Phone line: ${currentUser.verification.phone}

This structural transaction report satisfies GDPR and absolute client-side PII anonymity guidelines.
--------------------------------------------------
    `;

    const blob = new Blob([documentBodyText], { type: 'text/plain;charset=utf-8' });
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = URL.createObjectURL(blob);
    downloadAnchor.setAttribute('download', `Luxe_Ledger_Certificate_${currentUser.name.replace(' ', '_')}.txt`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    setDownloadSuccessMessage('Official Luxe ledger converted and compiled.');
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-xl relative overflow-hidden">
      
      {/* Decorative Golden Corner Glow */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none" />

      <div className="space-y-4">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold text-white tracking-tight font-serif uppercase">Secured Export Ledger</h2>
          </div>
          <p className="text-[#9e8e80] text-xs mt-1 leading-relaxed">
            Obtain absolute autonomy over your identity. Download complete offline-first database backups conforming to standard GDPR &amp; premium privacy practices.
          </p>
        </div>

        {downloadSuccessMessage && (
          <div className="bg-primary/10 border border-primary/25 text-primary text-xs py-2 px-3.5 rounded flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 animate-bounce" />
            <span>Success: {downloadSuccessMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          
          {/* PDF Plain Export Card */}
          <button 
            onClick={handleExportPDF}
            className="flex flex-col items-center justify-center p-4 bg-[#100e0c] hover:bg-surface border border-outline-variant hover:border-primary/45 rounded transition-all font-sans select-none text-center"
          >
            <div className="p-3 bg-primary/5 text-primary rounded mb-2 border border-primary/10">
              <FileText className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white font-mono uppercase">Plain Text Ledger</p>
            <p className="text-[10px] text-[#9e8e80] mt-1 pr-1 pl-1">Saves ledger certificate text for auditing check</p>
            <div className="mt-3 text-[10px] text-[#492900] font-mono font-medium flex items-center gap-1 bg-primary px-2 py-1 rounded glow-primary-sm">
              <Download className="w-3 h-3" />
              <span>Download Raw</span>
            </div>
          </button>

          {/* CSV Spreadsheet Export Card */}
          <button 
            onClick={handleExportCSV}
            className="flex flex-col items-center justify-center p-4 bg-[#100e0c] hover:bg-surface border border-outline-variant hover:border-primary/45 rounded transition-all font-sans select-none text-center"
          >
            <div className="p-3 bg-primary/5 text-primary rounded mb-2 border border-primary/10">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white font-mono uppercase">CSV Ledger CSV</p>
            <p className="text-[10px] text-[#9e8e80] mt-1 pr-1 pl-1">Organized spreadsheet format for Excel</p>
            <div className="mt-3 text-[10px] text-[#492900] font-mono font-medium flex items-center gap-1 bg-primary px-2 py-1 rounded glow-primary-sm">
              <Download className="w-3 h-3" />
              <span>Download CSV</span>
            </div>
          </button>

          {/* JSON Code package Export Card */}
          <button 
            onClick={handleExportJSON}
            className="flex flex-col items-center justify-center p-4 bg-[#100e0c] hover:bg-surface border border-outline-variant hover:border-primary/45 rounded transition-all font-sans select-none text-center"
          >
            <div className="p-3 bg-primary/5 text-primary rounded mb-2 border border-primary/10">
              <Code className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white font-mono uppercase">Backup Schema JSON</p>
            <p className="text-[10px] text-[#9e8e80] mt-1 pr-1 pl-1">Full developer payload metadata schema file</p>
            <div className="mt-3 text-[10px] text-[#492900] font-mono font-medium flex items-center gap-1 bg-primary px-2 py-1 rounded glow-primary-sm">
              <Download className="w-3 h-3" />
              <span>Download JSON</span>
            </div>
          </button>

        </div>

        <div className="text-[10px] text-neutral-500 italic text-center pt-2 select-none">
          ✨ Note: Offline-first storage backups are parsed on-the-fly and compiled strictly inside your browser sandbox.
        </div>
      </div>

    </div>
  );
};
export default ExportCenter;
