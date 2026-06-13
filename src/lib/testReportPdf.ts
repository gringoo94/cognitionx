import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ptSansRegularUrl from "@/assets/fonts/PTSans-Regular.ttf?url";
import ptSansBoldUrl from "@/assets/fonts/PTSans-Bold.ttf?url";
import type { TestConfig } from "@/data/tests/types";
import { deriveRanges } from "@/lib/testRanges";

let fontsLoaded = false;
let fontsPromise: Promise<{ regular: string; bold: string }> | null = null;

const fetchAsBase64 = async (url: string): Promise<string> => {
  const res = await fetch(url);
  const buf = await res.arrayBuffer();
  let binary = "";
  const bytes = new Uint8Array(buf);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunk)),
    );
  }
  return btoa(binary);
};

const loadFonts = async () => {
  if (!fontsPromise) {
    fontsPromise = Promise.all([
      fetchAsBase64(ptSansRegularUrl),
      fetchAsBase64(ptSansBoldUrl),
    ]).then(([regular, bold]) => ({ regular, bold }));
  }
  return fontsPromise;
};

const registerFonts = async (doc: jsPDF) => {
  const { regular, bold } = await loadFonts();
  doc.addFileToVFS("PTSans-Regular.ttf", regular);
  doc.addFont("PTSans-Regular.ttf", "PTSans", "normal");
  doc.addFileToVFS("PTSans-Bold.ttf", bold);
  doc.addFont("PTSans-Bold.ttf", "PTSans", "bold");
  fontsLoaded = true;
};

const sumByItems = (answers: number[], items: number[]) =>
  items.reduce((s, n) => s + (answers[n - 1] ?? 0), 0);

const formatDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fileDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export interface GenerateReportOptions {
  config: TestConfig;
  answers: number[];
  userNote?: string;
}

export const generateTestReportPdf = async ({
  config,
  answers,
  userNote,
}: GenerateReportOptions): Promise<void> => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  await registerFonts(doc);
  doc.setFont("PTSans", "normal");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  const now = new Date();
  const result = config.scoring(answers);
  const pct = Math.round((result.score / result.maxScore) * 100);

  let y = margin;

  // Header
  doc.setFont("PTSans", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  doc.text(`${config.code} — Отчёт по тесту`, margin, y);
  y += 22;

  doc.setFont("PTSans", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  doc.text(config.title, margin, y, { maxWidth: contentWidth });
  y += 16;
  doc.setFontSize(9);
  doc.text(`Дата прохождения: ${formatDate(now)}`, margin, y);
  y += 12;
  doc.text(
    "Скрининговый инструмент. Результат не является диагнозом.",
    margin,
    y,
  );
  y += 20;

  // Score block
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, 70, 6, 6, "FD");
  doc.setTextColor(60, 60, 60);
  doc.setFont("PTSans", "normal");
  doc.setFontSize(9);
  doc.text("Ваш результат", margin + 14, y + 18);

  doc.setFont("PTSans", "bold");
  doc.setFontSize(16);
  doc.setTextColor(20, 20, 20);
  doc.text(result.levelLabel, margin + 14, y + 38);

  doc.setFont("PTSans", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `${result.score} из ${result.maxScore} баллов · ${pct}%`,
    margin + 14,
    y + 58,
  );
  y += 86;

  // Interpretation
  doc.setFont("PTSans", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text("Интерпретация", margin, y);
  y += 14;
  doc.setFont("PTSans", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const interpLines = doc.splitTextToSize(result.interpretation, contentWidth);
  doc.text(interpLines, margin, y);
  y += interpLines.length * 13 + 10;

  doc.setFont("PTSans", "bold");
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text("Что делать дальше", margin, y);
  y += 14;
  doc.setFont("PTSans", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  const recLines = doc.splitTextToSize(result.recommendation, contentWidth);
  doc.text(recLines, margin, y);
  y += recLines.length * 13 + 14;

  // Subscales
  if (config.subscales && config.subscales.length > 0) {
    const maxPerItem = config.scale[config.scale.length - 1].value;
    autoTable(doc, {
      startY: y,
      head: [["Подшкала", "Балл", "Максимум"]],
      body: config.subscales.map((sub) => {
        const subScore = sumByItems(answers, sub.items);
        const subMax = sub.items.length * maxPerItem;
        return [sub.name, String(subScore), String(subMax)];
      }),
      margin: { left: margin, right: margin },
      styles: { font: "PTSans", fontSize: 9, cellPadding: 6 },
      headStyles: {
        font: "PTSans",
        fontStyle: "bold",
        fillColor: [235, 238, 242],
        textColor: [40, 40, 40],
      },
      columnStyles: {
        1: { halign: "right", cellWidth: 70 },
        2: { halign: "right", cellWidth: 80 },
      },
    });
    y = (doc as unknown as { lastAutoTable: { finalY: number } })
      .lastAutoTable.finalY + 16;
  }

  // Answers table
  autoTable(doc, {
    startY: y,
    head: [["#", "Вопрос", "Ответ", "Балл"]],
    body: config.questions.map((q, i) => {
      const ans = answers[i];
      const opt = config.scale.find((o) => o.value === ans);
      return [String(i + 1), q, opt ? opt.label : "—", String(ans ?? "—")];
    }),
    margin: { left: margin, right: margin },
    styles: { font: "PTSans", fontSize: 9, cellPadding: 6, valign: "top" },
    headStyles: {
      font: "PTSans",
      fontStyle: "bold",
      fillColor: [235, 238, 242],
      textColor: [40, 40, 40],
    },
    columnStyles: {
      0: { cellWidth: 24, halign: "right" },
      2: { cellWidth: 130 },
      3: { cellWidth: 36, halign: "right" },
    },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } })
    .lastAutoTable.finalY + 16;

  // User note
  if (userNote && userNote.trim()) {
    if (y > doc.internal.pageSize.getHeight() - 120) {
      doc.addPage();
      y = margin;
    }
    doc.setFont("PTSans", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text("Что хочу обсудить с психологом", margin, y);
    y += 14;
    doc.setFont("PTSans", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const noteLines = doc.splitTextToSize(userNote.trim(), contentWidth);
    doc.text(noteLines, margin, y);
    y += noteLines.length * 13 + 10;
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    const h = doc.internal.pageSize.getHeight();
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, h - 32, pageWidth - margin, h - 32);
    doc.setFont("PTSans", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130, 130, 130);
    doc.text("cognitionx.cloud · Психолог Дмитрий Яцко", margin, h - 18);
    doc.text(`Стр. ${i} из ${pageCount}`, pageWidth - margin, h - 18, {
      align: "right",
    });
  }

  const filename = `${config.code.replace(/[^A-Za-z0-9]/g, "")}-report-${fileDate(now)}.pdf`;
  doc.save(filename);
};

export { fontsLoaded };
