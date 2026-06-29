import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ptSansRegularUrl from "@/assets/fonts/PTSans-Regular.ttf?url";
import ptSansBoldUrl from "@/assets/fonts/PTSans-Bold.ttf?url";
import type { LikertOption, TestConfig } from "@/data/tests/types";
import { deriveRanges } from "@/lib/testRanges";
import {
  scoredValueForQuestion,
  subscaleScore,
  subscaleMaxScore,
} from "@/lib/testScoring";

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
};

const formatDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const fileDate = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const scaleForQuestion = (
  config: TestConfig,
  i: number,
): LikertOption[] => config.perQuestionScale?.[i] ?? config.scale;

const findOptionLabel = (
  scale: LikertOption[],
  value: number | undefined,
): string => {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  const opt = scale.find((o) => o.value === value);
  return opt ? opt.label : String(value);
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
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  const bottomLimit = pageHeight - 50;

  const ensureSpace = (needed: number) => {
    if (y + needed > bottomLimit) {
      doc.addPage();
      y = margin;
    }
  };

  const drawHeading = (text: string) => {
    ensureSpace(28);
    doc.setFont("PTSans", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text(text, margin, y);
    y += 14;
  };

  const drawParagraph = (text: string) => {
    doc.setFont("PTSans", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const lines = doc.splitTextToSize(text, contentWidth) as string[];
    const lineH = 13;
    for (const line of lines) {
      ensureSpace(lineH);
      doc.text(line, margin, y);
      y += lineH;
    }
    y += 6;
  };

  const now = new Date();
  const result = config.scoring(answers);
  const safeMax = result.maxScore > 0 ? result.maxScore : 1;
  const pct = Math.max(
    0,
    Math.min(100, Math.round((result.score / safeMax) * 100)),
  );

  let y = margin;

  // Header
  doc.setFont("PTSans", "bold");
  doc.setFontSize(18);
  doc.setTextColor(20, 20, 20);
  const titleLines = doc.splitTextToSize(
    `${config.code} — Отчёт по тесту`,
    contentWidth,
  ) as string[];
  for (const line of titleLines) {
    doc.text(line, margin, y);
    y += 22;
  }

  doc.setFont("PTSans", "normal");
  doc.setFontSize(11);
  doc.setTextColor(90, 90, 90);
  const subtitleLines = doc.splitTextToSize(
    config.title,
    contentWidth,
  ) as string[];
  for (const line of subtitleLines) {
    doc.text(line, margin, y);
    y += 14;
  }
  y += 4;
  doc.setFontSize(9);
  doc.text(`Дата прохождения: ${formatDate(now)}`, margin, y);
  y += 12;
  doc.text(
    "Скрининговый инструмент. Результат не является диагнозом.",
    margin,
    y,
  );
  y += 20;

  // Score block — dynamic height for long level labels
  doc.setFont("PTSans", "bold");
  doc.setFontSize(15);
  const levelLines = doc.splitTextToSize(
    result.levelLabel,
    contentWidth - 28,
  ) as string[];
  const blockHeight = 36 + levelLines.length * 18 + 14;
  ensureSpace(blockHeight + 8);
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, contentWidth, blockHeight, 6, 6, "FD");

  doc.setTextColor(60, 60, 60);
  doc.setFont("PTSans", "normal");
  doc.setFontSize(9);
  doc.text("Ваш результат", margin + 14, y + 18);

  let labelY = y + 36;
  doc.setFont("PTSans", "bold");
  doc.setFontSize(15);
  doc.setTextColor(20, 20, 20);
  for (const line of levelLines) {
    doc.text(line, margin + 14, labelY);
    labelY += 18;
  }
  doc.setFont("PTSans", "normal");
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `${result.score} из ${result.maxScore} баллов · ${pct}%`,
    margin + 14,
    labelY + 2,
  );
  y += blockHeight + 14;

  // Score ranges (only when scoring is monotonic enough to produce a useful table)
  const ranges = deriveRanges(config);
  if (ranges.length > 1 && ranges.length <= 20) {
    autoTable(doc, {
      startY: y,
      head: [["Уровень", "Диапазон баллов"]],
      body: ranges.map((r) => [
        r.label,
        r.min === r.max ? String(r.min) : `${r.min}–${r.max}`,
      ]),
      margin: { left: margin, right: margin },
      styles: { font: "PTSans", fontSize: 9, cellPadding: 6 },
      headStyles: {
        font: "PTSans",
        fontStyle: "bold",
        fillColor: [235, 238, 242],
        textColor: [40, 40, 40],
      },
      columnStyles: { 1: { halign: "right", cellWidth: 120 } },
      didParseCell: (data) => {
        if (data.section !== "body") return;
        const r = ranges[data.row.index];
        if (result.score >= r.min && result.score <= r.max) {
          data.cell.styles.fillColor = [255, 244, 214];
          data.cell.styles.fontStyle = "bold";
        }
      },
    });
    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 16;
  }

  // Interpretation
  drawHeading("Интерпретация");
  drawParagraph(result.interpretation);

  drawHeading("Что делать дальше");
  drawParagraph(result.recommendation);

  // Subscales — apply reverse-scoring and per-question scale
  if (config.subscales && config.subscales.length > 0) {
    ensureSpace(60);
    autoTable(doc, {
      startY: y,
      head: [["Подшкала", "Балл", "Максимум"]],
      body: config.subscales.map((sub) => {
        const subScore = subscaleScore(config, answers, sub.items);
        const subMax = subscaleMaxScore(config, sub.items);
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
    y =
      (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 16;
  }

  // Answers table — uses per-question scale and reverse-aware scored points
  const hasReverse = (config.reverseItems?.length ?? 0) > 0;
  autoTable(doc, {
    startY: y,
    head: hasReverse
      ? [["#", "Вопрос", "Ответ", "Сырой", "Балл"]]
      : [["#", "Вопрос", "Ответ", "Балл"]],
    body: config.questions.map((q, i) => {
      const scale = scaleForQuestion(config, i);
      const ans = answers[i];
      const label = findOptionLabel(scale, ans);
      const scored = scoredValueForQuestion(config, i, ans);
      const isReverse = config.reverseItems?.includes(i + 1) ?? false;
      const reverseMark = isReverse ? "↺ " : "";
      const questionCell = `${reverseMark}${q}`;
      if (hasReverse) {
        return [
          String(i + 1),
          questionCell,
          label,
          ans === undefined || ans === null ? "—" : String(ans),
          scored === null ? "—" : String(scored),
        ];
      }
      return [
        String(i + 1),
        questionCell,
        label,
        scored === null ? "—" : String(scored),
      ];
    }),
    margin: { left: margin, right: margin },
    styles: { font: "PTSans", fontSize: 9, cellPadding: 6, valign: "top" },
    headStyles: {
      font: "PTSans",
      fontStyle: "bold",
      fillColor: [235, 238, 242],
      textColor: [40, 40, 40],
    },
    columnStyles: hasReverse
      ? {
          0: { cellWidth: 24, halign: "right" },
          2: { cellWidth: 120 },
          3: { cellWidth: 40, halign: "right" },
          4: { cellWidth: 40, halign: "right" },
        }
      : {
          0: { cellWidth: 24, halign: "right" },
          2: { cellWidth: 140 },
          3: { cellWidth: 40, halign: "right" },
        },
  });
  y =
    (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 8;

  if (hasReverse) {
    ensureSpace(24);
    doc.setFont("PTSans", "normal");
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "↺ — вопрос с обратной кодировкой: «Балл» уже учитывает инверсию.",
      margin,
      y,
    );
    y += 14;
  }

  // User note
  if (userNote && userNote.trim()) {
    y += 4;
    drawHeading("Что хочу обсудить с психологом");
    drawParagraph(userNote.trim());
  }

  // Footer on every page
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
