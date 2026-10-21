import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import {
  Award,
  Download,
  Printer,
  X,
  Sparkles,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useProgressStore } from '../../store/useProgressStore';
import { useUIStore } from '../../store/useUIStore';

export const CertificateGenerator: React.FC = () => {
  const { isCertificateOpen, setIsCertificateOpen } = useUIStore();
  const { displayName, setDisplayName, certificateClaimed, claimCertificate } = useProgressStore();

  const [studentName, setStudentName] = useState(displayName || 'Maker Learner');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isCertificateOpen) return null;

  const certificateDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const certificateCode = `LAP-2026-${Math.abs(studentName.split('').reduce((acc, c) => acc + c.charCodeAt(0), 1000)).toString(16).toUpperCase()}`;

  const handleDownloadPDF = () => {
    setIsGenerating(true);
    claimCertificate();
    setDisplayName(studentName);

    try {
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      // Background Cream Paper
      doc.setFillColor(250, 248, 245);
      doc.rect(0, 0, 297, 210, 'F');

      // Double Blueprint Borders
      doc.setDrawColor(22, 184, 176); // Teal
      doc.setLineWidth(3);
      doc.rect(12, 12, 273, 186);

      doc.setDrawColor(15, 30, 54); // Navy
      doc.setLineWidth(1);
      doc.rect(16, 16, 265, 178);

      // Header Brand
      doc.setTextColor(15, 30, 54);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(26);
      doc.text('LEARN ARDUINO PRO', 148.5, 42, { align: 'center' });

      doc.setFontSize(11);
      doc.setFont('courier', 'normal');
      doc.setTextColor(22, 184, 176);
      doc.text('EXPLORE · UNDERSTAND · BUILD', 148.5, 50, { align: 'center' });

      // Title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(50, 60, 80);
      doc.text('CERTIFICATE OF EMBEDDED ENGINEERING MASTERY', 148.5, 72, { align: 'center' });

      doc.setFontSize(11);
      doc.text('This is to certify that', 148.5, 86, { align: 'center' });

      // Student Name
      doc.setFontSize(30);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 30, 54);
      doc.text(studentName.toUpperCase(), 148.5, 104, { align: 'center' });

      // Underline rule
      doc.setDrawColor(22, 184, 176);
      doc.setLineWidth(1.5);
      doc.line(70, 109, 227, 109);

      // Description text
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 70, 90);
      doc.text(
        'has demonstrated mastery in microcontroller hardware architecture, digital I/O, pulse-width modulation,',
        148.5,
        122,
        { align: 'center' }
      );
      doc.text(
        'analog-to-digital conversion, asynchronous serial telemetry, sensor integration, and C++ sketch development.',
        148.5,
        129,
        { align: 'center' }
      );

      // Bottom Metadata: Date, Verification ID, Signature
      doc.setFontSize(10);
      doc.setFont('courier', 'normal');
      doc.setTextColor(100, 110, 130);
      doc.text(`Issue Date: ${certificateDate}`, 30, 175);
      doc.text(`Verification ID: ${certificateCode}`, 30, 182);

      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 30, 54);
      doc.text('Lead Instructor & Platform Architect', 215, 175);
      doc.setFont('helvetica', 'normal');
      doc.text('Sadeep Sasanka', 215, 182);

      doc.save(`Learn_Arduino_Pro_Certificate_${studentName.replace(/\s+/g, '_')}.pdf`);
    } catch (e) {
      console.error('Failed to generate PDF', e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none">
      <div className="w-full max-w-2xl bg-blueprint-cream dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-blueprint-creamDark dark:bg-blueprint-nightBg border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-blueprint-teal" />
            <h3 className="text-sm font-extrabold font-mono text-blueprint-navy dark:text-white uppercase tracking-wider">
              Arduino Mastery Certificate
            </h3>
          </div>
          <button
            onClick={() => setIsCertificateOpen(false)}
            className="p-1 rounded-lg text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Certificate Preview Card */}
        <div className="p-6 space-y-4">
          <div className="p-6 rounded-xl border-4 border-double border-blueprint-teal bg-[#FAF8F5] text-blueprint-navy text-center shadow-lg relative">
            <div className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-widest mb-1">
              LEARN ARDUINO PRO
            </div>
            <h2 className="text-lg font-serif font-black tracking-wide text-blueprint-navy">
              CERTIFICATE OF EMBEDDED MASTERY
            </h2>
            <p className="text-xs text-gray-600 mt-2 font-serif italic">This certifies that</p>

            <div className="my-3">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter Your Full Name"
                className="text-center font-bold font-serif text-xl sm:text-2xl text-blueprint-navy bg-transparent border-b-2 border-blueprint-teal/40 focus:border-blueprint-teal focus:outline-none px-4 py-1"
              />
            </div>

            <p className="text-xs text-gray-700 max-w-md mx-auto leading-relaxed font-sans">
              has completed all 11 curriculum modules and demonstrated proficiency in ATmega328P
              microcontroller firmware development and in-browser electronic simulation.
            </p>

            <div className="mt-6 pt-4 border-t border-gray-300 flex items-center justify-between text-[10px] font-mono text-gray-500">
              <div>
                <span>Date: {certificateDate}</span>
                <br />
                <span>ID: {certificateCode}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-blueprint-navy">Sadeep Sasanka</span>
                <br />
                <span>Platform Architect</span>
              </div>
            </div>
          </div>

          {/* Action Download Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold hover:border-blueprint-teal transition"
            >
              <Printer className="w-4 h-4 text-blueprint-teal" />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-md transition"
            >
              <Download className="w-4 h-4" />
              <span>{isGenerating ? 'Generating PDF...' : 'Download Official PDF'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
