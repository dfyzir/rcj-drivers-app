import { NewDriverForm } from "@/types/newDriverForm";
import rcj_transport from "../../public/rcj_transport.png";
import jsPDF from "jspdf";
import SignatureCanvas from "react-signature-canvas";
import { applyPlugin } from "jspdf-autotable";

applyPlugin(jsPDF);
interface generatePDFProps {
  formData: NewDriverForm;
  sigCanvas: React.RefObject<SignatureCanvas | null>;
}

function PWithHighlight(
  doc: jsPDF,
  text: string,
  y: number,
  L: number,
  R: number,
  opts?: {
    regex?: RegExp; // default /RCJ\s+Transport/gi (matches across spaces)
    fontSize?: number; // default 8
    lineHeightEm?: number; // default 1.2
    paraGap?: number; // default 2
    padX?: number; // default 0.6mm
    padY?: number; // default 0.7mm
    normalFont?: [string, "normal" | "bold"];
    boldFont?: [string, "bold"];
    fill?: [number, number, number]; // default yellow
  }
) {
  const {
    regex = /RCJ\s+Transport/gi,
    fontSize = 8,
    lineHeightEm = 1.2,
    paraGap = 2,
    padX = 0.6,
    padY = 0.7,
    normalFont = ["Calibri", "normal"] as [string, "normal" | "bold"],
    boldFont = ["Calibri", "bold"] as [string, "bold"],
    fill = [255, 235, 59] as [number, number, number],
  } = opts || {};

  const maxW = R - L;
  const ptToMm = 0.352777778;
  const lineStep = fontSize * ptToMm * lineHeightEm;

  // Wrap first
  doc.setFont(normalFont[0], normalFont[1]);
  doc.setFontSize(fontSize);
  const lines = doc.splitTextToSize(text, maxW) as string[];

  // Page metrics
  const pageH = doc.internal.pageSize.getHeight();
  const TOP_Y = 22;
  const BOTTOM_Y = pageH - 20;

  // Measure helper that respects style
  const measure = (s: string, bold: boolean) => {
    const [f, w] = bold ? boldFont : normalFont;
    doc.setFont(f, w);
    doc.setFontSize(fontSize);
    return doc.getTextWidth(s);
  };

  // Pre-break if needed
  const blockH = lines.length * lineStep;
  if (y + blockH > BOTTOM_Y) {
    doc.addPage();
    y = TOP_Y;
  }

  // Draw each line with inline highlighting
  for (let li = 0; li < lines.length; li++) {
    const line = lines[li];
    let x = L;
    let lastIndex = 0;

    // Find matches on this line (per-line, not tokenized)
    const re = new RegExp(
      regex.source,
      regex.flags.includes("g") ? regex.flags : regex.flags + "g"
    );
    let m: RegExpExecArray | null;

    // First pass: backgrounds + bold text in segments
    while ((m = re.exec(line)) !== null) {
      const start = m.index || 0;
      const end = start + m[0].length;

      // draw normal segment before match
      const before = line.slice(lastIndex, start);
      if (before) {
        const w = measure(before, false);
        doc.setFont(normalFont[0], normalFont[1]);
        doc.text(before, x, y);
        x += w;
      }

      // draw highlight background for match (bold)
      const matchTxt = line.slice(start, end);
      const matchW = measure(matchTxt, true);
      doc.setFillColor(fill[0], fill[1], fill[2]);
      doc.rect(
        x - padX,
        y - (lineStep - padY),
        matchW + padX * 2,
        lineStep,
        "F"
      );

      // draw bold match text
      doc.setFont(boldFont[0], boldFont[1]);
      doc.text(matchTxt, x, y);
      x += matchW;

      lastIndex = end;

      // prevent infinite loop on zero-length
      if (m[0].length === 0) re.lastIndex++;
    }

    // draw any remaining tail (normal)
    const tail = line.slice(lastIndex);
    if (tail) {
      const w = measure(tail, false);
      doc.setFont(normalFont[0], normalFont[1]);
      doc.text(tail, x, y);
      x += w;
    }

    y += lineStep;
  }

  return y + paraGap;
}

function addPSPDisclosurePages(
  doc: jsPDF,
  formData: NewDriverForm,
  sigCanvas: React.RefObject<SignatureCanvas | null>
): { start: number; end: number } {
  const W = doc.internal.pageSize.getWidth();
  const L = 20,
    R = W - 20;
  const paraGap = 6;

  const P = (s: string, y: number) => {
    doc.setFont("Calibri", "normal"); // keep your font choice
    doc.setFontSize(8); // keep your size
    const wrapped = doc.splitTextToSize(s, R - L);

    // compute exact line step from font size (pt → mm) with a sane line-height
    const ptToMm = 0.352777778;
    const lineStep = doc.getFontSize() * ptToMm * 1.2; // ~1.2em
    const blockH = wrapped.length * lineStep;

    // page break BEFORE drawing if needed
    const pageH = doc.internal.pageSize.getHeight();
    const topY = 22;
    const bottomY = pageH - 20; // ~20mm bottom margin like rest of doc
    if (y + blockH > bottomY) {
      doc.addPage();
      y = topY;
    }

    doc.text(wrapped, L, y);
    return y + blockH + paraGap; // advance by actual block height + small gap
  };
  const Line = (x1: number, y: number, x2: number) => {
    doc.setLineWidth(0.3);
    doc.line(x1, y, x2, y);
  };
  const Label = (s: string, x: number, y: number) => {
    doc.setFont("Calibri", "bold");
    doc.setFontSize(10);
    doc.text(s, x, y);
  };
  const Field = (text: string, x: number, y: number, w: number) => {
    doc.setFont("Calibri", "normal");
    doc.setFontSize(10);
    if (text) doc.text(text, x + 1, y - 1.2);
    Line(x, y, x + w);
  };

  const start = doc.getNumberOfPages() + 1; // first PSP page index (1-based)
  doc.addPage("a4", "p");

  // Title (exact)
  let y = 22;
  doc.setFont("Calibri", "bold");
  doc.setFontSize(10);
  doc.text(
    "IMPORTANT DISCLOSURE REGARDING BACKGROUND REPORTS FROM THE PSP Online Service",
    L,
    y
  );
  y += 8;

  // --- Paste the EXACT paragraphs you provided, in order ---
  const paras = [
    `In connection with your application for employment with RCJ Transport (“Prospective Employer”), Prospective Employer, its employees, agents or contractors may obtain one or more reports regarding your driving, and safety inspection history from the Federal Motor Carrier Safety Administration (FMCSA).`,
    `When the application for employment is submitted in person, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer will provide you with a copy of the report upon which its decision was based and a written summary of your rights under the Fair Credit Reporting Act before taking any final adverse action. If any final adverse action is taken against you based upon your driving history or safety report, the Prospective Employer will notify you that the action has been taken and that the action was based in part or in whole on this report. `,
    `When the application for employment is submitted by mail, telephone, computer, or other similar means, if the Prospective Employer uses any information it obtains from FMCSA in a decision to not hire you or to make any other adverse employment decision regarding you, the Prospective Employer must provide you within three business days of taking adverse action oral, written or electronic notification: that adverse action has been taken based in whole or in part on information obtained from FMCSA; the name, address, and the toll free telephone number of FMCSA; that the FMCSA did not make the decision to take the adverse action and is unable to provide you the specific reasons why the adverse action was taken; and that you may, upon providing proper identification, request a free copy of the report and may dispute with the FMCSA the accuracy or completeness of any information or report. If you request a copy of a driver record from the Prospective Employer who procured the report, then, within 3 business days of receiving your request, together with proper identification, the Prospective Employer must send or provide to you a copy of your report and a summary of your rights under the Fair Credit Reporting Act.`,
    `Neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. You may challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov. If you challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. Your request will be forwarded by the DataQs system to the appropriate State for adjudication. `,
    `Any crash or inspection in which you were involved will display on your PSP report. Since the PSP report does not report, or assign, or imply fault, it will include all Commercial Motor Vehicle (CMV) crashes where you were a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, all inspections, with or without violations, appear on the PSP report. State citations associated with Federal Motor Carrier Safety Regulations (FMCSR) violations that have been adjudicated by a court of law will also appear, and remain, on a PSP report. `,
    `The Prospective Employer cannot obtain background reports from FMCSA without your authorization.`,
    // HEADER
    `AUTHORIZATION`,
    `If you agree that the Prospective Employer may obtain such background reports, please read the following and sign below: I authorize RCJ Transport (“Prospective Employer”) to access the FMCSA Pre-Employment Screening Program (PSP) system to seek information regarding my commercial driving safety record and information regarding my safety inspection history. I understand that I am authorizing the release of safety performance information including crash data from the previous five (5) years and inspection history from the previous three (3) years. I understand and acknowledge that this release of information may assist the Prospective Employer to make a determination regarding my suitability as an employee. `,
    `I further understand that neither the Prospective Employer nor the FMCSA contractor supplying the crash and safety information has the capability to correct any safety data that appears to be incorrect. I understand I may challenge the accuracy of the data by submitting a request to https://dataqs.fmcsa.dot.gov. If I challenge crash or inspection information reported by a State, FMCSA cannot change or correct this data. I understand my request will be forwarded by the DataQs system to the appropriate State for adjudication. `,
    `I understand that any crash or inspection in which I was involved will display on my PSP report. Since the PSP report does not report, or assign, or imply fault, I acknowledge it will include all CMV crashes where I was a driver or co-driver and where those crashes were reported to FMCSA, regardless of fault. Similarly, I understand all inspections, with or without violations, will appear on my PSP report, and State citations associated with FMCSR violations that have been adjudicated by a court of law will also appear, and remain, on my PSP report. `,
    `I have read the above Disclosure Regarding Background Reports provided to me by Prospective Employer and I understand that if I sign this Disclosure and Authorization, Prospective Employer may obtain a report of my crash and inspection history. I hereby authorize Prospective Employer and its employees, authorized agents, and/or affiliates to obtain the information authorized above.`,
  ];

  // Render paragraphs (auto-continue on new page if needed)
  for (const text of paras) {
    if (y > 270) {
      doc.addPage();
      y = 22;
    }
    if (text === "AUTHORIZATION") {
      doc.setFont("Calibri", "bold");
      doc.setFontSize(10);
      doc.text("AUTHORIZATION", W / 2, y, { align: "center" });
      y += 6;
      continue;
    }
    y = PWithHighlight(doc, text, y, L, R, {
      regex: /RCJ\s+Transport/gi, // catches any whitespace between words
      fontSize: 8,
      lineHeightEm: 1.2,
      paraGap: 2,
      normalFont: ["Calibri", "normal"],
      boldFont: ["Calibri", "bold"],
      fill: [255, 235, 59],
    });
  }

  // Signature block
  if (y > 260) {
    doc.addPage();
    y = 22;
  }
  Label("Date:", L, y + 8);
  Field(formData.date || "", L + 16, y + 10, 40);
  Label("Signature", L + 70, y + 8);
  Field("", L + 95, y + 10, 80);
  if (sigCanvas.current) {
    const sig = sigCanvas.current.toDataURL("image/png");
    doc.addImage(sig, "PNG", L + 97, y + 0.5, 45, 15);
  }
  y += 20;
  Label("Name (Please Print)", L, y + 8);
  Field(`${formData.printedName ?? ""}`.trim(), L + 55, y + 10, 120);
  y += 20;

  // Notices (exact)
  const notices = [
    `NOTICE: This form is made available to monthly account holders by NIC on behalf of the U.S. Department of Transportation, Federal Motor Carrier Safety Administration (FMCSA). Account holders are required by federal law to obtain an Applicant’s written or electronic consent prior to accessing the Applicant’s PSP report. Further, account holders are required by FMCSA to use the language contained in this Disclosure and Authorization form to obtain an Applicant’s consent. The language must be used in whole, exactly as provided. Further, the language on this form must exist as one stand-alone document. The language may NOT be included with other consent forms or any other language.`,
    `NOTICE: The prospective employment concept referenced in this form contemplates the definition of “employee” contained at 49 C.F.R. 383.5.\nLAST UPDATED 2/11/2016`,
  ];
  for (const n of notices) {
    if (y > 270) {
      doc.addPage();
      y = 22;
    }
    y = P(n, y);
  }

  const end = doc.getNumberOfPages(); // last PSP page index (1-based)
  return { start, end };
}

function drawKeyValueTable(
  doc: jsPDF,
  data: Record<string, string>,
  startY: number
): number {
  const rows = Object.entries(data).map(([label, val]) => [label, val]);
  (doc as any).autoTable({
    startY,
    head: [["Field", "Value"]],
    body: rows,
    showHead: false,
    styles: { fontSize: 10 },
    margin: { left: 15, right: 15, bottom: 20 },
    columnStyles: {
      0: {
        fillColor: "#2980b9",
        textColor: 255,
        fontStyle: "bold",
        cellPadding: 3,
        cellWidth: 50,
        lineWidth: 0.1,
        lineColor: 255,
      },
      1: {
        cellWidth: doc.internal.pageSize.width - 15 * 2 - 50,
        lineWidth: 0.1,
        lineColor: 255,
      },
    },
  });
  // lastAutoTable is injected by the plugin:
  const tbl = (doc as any).lastAutoTable;
  return (tbl?.finalY ?? startY) + 10;
}

function drawSectionTable(
  doc: jsPDF,
  title: string,
  headers: string[],
  rows: (string | number)[][],
  startY: number,
  isNumerated?: boolean,
  isLast?: boolean
): number {
  // if we’re too close to bottom, add a page first

  const pageHeight = doc.internal.pageSize.height;
  const pageWidth = doc.internal.pageSize.width;
  const marginLeft = 15;
  const marginRight = 15;
  if (startY > pageHeight - 30) {
    doc.addPage();
    startY = 20;
  }
  doc.setFontSize(14);
  doc.text(title, marginLeft, startY);
  const usableWidth = pageWidth - marginLeft - marginRight;
  const columnStyles: Record<number, { cellWidth: number }> = {};

  if (isNumerated) {
    const firstColWidth = 8;
    const otherColsCount = headers.length - 1;
    const otherColWidth = (usableWidth - firstColWidth) / otherColsCount;

    // explicitly size the “#” column
    columnStyles[0] = { cellWidth: firstColWidth };

    for (let i = 1; i < headers.length; i++) {
      columnStyles[i] = { cellWidth: otherColWidth };
    }
  } else {
    const colWidth = usableWidth / headers.length;
    headers.forEach((_, i) => {
      columnStyles[i] = { cellWidth: colWidth };
    });
  }

  (doc as any).autoTable({
    startY: startY + 5,
    head: [headers],
    body: rows,
    margin: { left: marginLeft, right: marginRight, bottom: isLast ? 40 : 25 },
    styles: { fontSize: 10 },
    columnStyles,
  });

  // now grab the table instance that was just drawn
  const table = (doc as any).lastAutoTable;
  if (!table || typeof table.finalY !== "number") {
    // fallback if something went wrong
    return startY + 5 + rows.length * 10;
  }
  return table.finalY + 10; // next Y after table
}

export const generatePDF = async ({
  formData,
  sigCanvas,
}: generatePDFProps) => {
  let pageWidth = 170,
    margin = 0.5,
    maxLineWidth = pageWidth - margin * 2,
    fontSize = 10,
    applicantAuthorization =
      "I authorize you to make such investigations and inquiries of my personal, employment, financial or medical history and other related matters as may be necessary in arriving at a decision. (Generally, inquiries regarding medical history will be made only if and after a conditional offer has been extended.) I hereby release employers, schools, health care providers and other persons from all liability in responding to inquiries and releasing information in connection with my application. I understand that false or misleading information given in my application or interview(s) may result in discharge. I understand, also, that I am required to abide by all rules and regulations of RCJ TRANSPORT. I understand that information I provide regarding current and/or previous employers may be used, and those employer(s) will be contacted, for the purpose of investigating my safety performance history as required by 49 CFR 391.23 (d) and (e). I understand that I have the right to:\n" +
      "     -Review information provided by previous employers;\n" +
      "     -Have errors in the information corrected by previous employers and for those previous employers \n" +
      "to resend the corrected information to the prospective employer;\n" +
      "      -Have a rebuttal statement attached to the alleged erroneous information, if the previous employer(s) and I cannot agree on the accuracy of the information\n";
  const doc = new jsPDF("p", "mm", "a4");

  doc.addImage(rcj_transport.src, "PNG", 15, 8, 60, 35);
  doc.setFont("Arial", "bold");
  doc.setFontSize(20);
  doc.text("DRIVER'S APPLICATION", 60, 12);
  doc.setFont("Arial", "semibold");
  doc.setFontSize(16);
  doc.text("RCJ Transport Logistics Inc.", 77, 20);
  doc.text("25511 BUDDE RD. SUITE 102", 77, 28);
  doc.text("THE WOODLANDS, TX      77380", 77, 36);
  doc.setLineWidth(5);
  doc.setDrawColor("#2980b9");
  doc.line(10, 43, 200, 43);
  doc.line(10, 125, 200, 125);
  doc.line(10, 275, 200, 275);
  doc.setLineWidth(0.1);
  doc.line(10, 128.5, 200, 128.5);
  doc.line(10, 278.5, 200, 278.5);
  doc.setFontSize(12);
  doc.setFontSize(12);
  const textLines = doc
    .setFont("Arial")
    .setFontSize(fontSize)
    .splitTextToSize(applicantAuthorization, maxLineWidth);
  doc.setLineWidth(4);
  doc.setDrawColor("#2980b9");
  doc.line(25, 48.5, 54, 48.5);
  doc.setTextColor("white").text("AUTHORIZATION", 25, 50);
  doc.setTextColor("black").text(textLines, 25, 55);
  doc.setDrawColor("black");
  doc.setLineWidth(0.1);
  doc.line(40, 121, 65, 121);
  doc.line(148, 121, 165, 121);
  doc.setFont("Arial", "bold").text("Siganture", 25, 120);
  doc.setFont("Arial", "bold").text(`Date  ${formData.date}`, 140, 120);
  if (sigCanvas.current) {
    const signature = sigCanvas.current.toDataURL("image/png");
    const imgWidth = 30;
    const imgHeight = 12;
    doc.addImage(signature, "PNG", 40, 109, imgWidth, imgHeight);
  }
  let y = 135;
  // 1) Name / Phone / SSN / DOB
  {
    const headers = [
      "Application Type",
      "Name",
      "Date of Birth",
      "SSN",
      "Phone",
      "Alt.Phone",
    ];
    const {
      applicationType,
      lastName,
      firstName,
      dateOfBirth,
      socialSecurity,
      phone,
      altPhone,
    } = formData;
    const applicationTypeLabel =
      applicationType === "ownerOperator"
        ? "Owner Operator"
        : applicationType === "companyDriver"
        ? "Company Driver"
        : "";
    const data = [
      [
        applicationTypeLabel,
        `${firstName + " " + lastName}`,
        dateOfBirth,
        socialSecurity,
        phone,
        altPhone,
      ],
    ];

    y = drawSectionTable(doc, "PERSONAL INFORMATION", headers, data, y);
  }

  // 2) Driver’s License

  {
    const headers = ["DL Number", "Class", "State", "Expiration Date"];
    const { number, class: dlClass, state, expDate } = formData.driversLicense;

    const data = [[number, dlClass, state, expDate]];

    y = drawSectionTable(doc, "DRIVER'S LICENSE", headers, data, y);
  }
  // 3) Home Address (just one)
  {
    const headers = ["#", "Street", "City", "State", "Zip Code"];

    const data = formData.physicalAddress.length
      ? formData.physicalAddress.map((item, idx) => [
          `#${idx + 1}`,
          item.street,
          item.city,
          item.state,
          item.zip,
        ])
      : Array.from({ length: 1 }, (_, i) => [String(i + 1), "", "", "", ""]);

    y = drawSectionTable(
      doc,
      "HOME ADDRESS (Last 3 years)",
      headers,
      data,
      y,
      true
    );
  }

  // 4) Emergency Contact
  {
    const ecHeaders = ["Name", "Phone", "Relationship"];
    const { name, phone, relationship } = formData.emergencyContact;
    const ecRow = [[name, phone, relationship]];
    y = drawSectionTable(doc, "EMERGENCY CONTACT", ecHeaders, ecRow, y);
  }
  const numOfPages = doc.getNumberOfPages();
  if (numOfPages && numOfPages === 1) {
    y = 285; // last used Y on first page
  }

  // 5) Driving Experience
  {
    const headers = ["#", "Type of Equipment", "Years Exp.", "Miles Driven"];
    const data = formData.drivingExperience.length
      ? formData.drivingExperience.map((exp, i) => [
          String(i + 1),
          exp.equipmentType,
          exp.yearsOfExperience,
          exp.milesDriven,
        ])
      : Array.from({ length: 3 }, (_, i) => [String(i + 1), "", "", ""]);
    y = drawSectionTable(doc, "DRIVING EXPERIENCE", headers, data, y, true);
  }

  // 6) Accident Record
  {
    const headers = ["#", "Date", "Type", "Fatalities", "Injuries"];
    const data = formData.accidentRecord.length
      ? formData.accidentRecord.map((acc, i) => [
          String(i + 1),
          acc.accidentDate || "",
          acc.accidentType,
          acc.fatalities,
          acc.injuries,
        ])
      : Array.from({ length: 3 }, (_, i) => [String(i + 1), "", "", "", ""]);
    y = drawSectionTable(
      doc,
      "ACCIDENT RECORD (Last 3 Years)",
      headers,
      data,
      y,
      true
    );
  }
  // 7) Traffic Convictions
  {
    const headers = ["#", "Location", "Date", "Charge"];
    const data = formData.trafficConvictions.length
      ? formData.trafficConvictions.map((tc, i) => [
          String(i + 1),
          tc.location,
          tc.convictionDate || "",
          tc.charge,
        ])
      : Array.from({ length: 3 }, (_, i) => [String(i + 1), "", "", ""]);
    y = drawSectionTable(
      doc,
      "TRAFFIC CONVICTIONS (Last 3 Years)",
      headers,
      data,
      y,
      true
    );
  }
  //Criminal Background
  {
    doc.setFontSize(14);
    doc.text("CRIMINAL RECORD", 15, y);
    y += 8;

    // mini-heading per entry
    const {
      deniedLicense,
      suspendedOrRevoked,
      deniedOrRevokedExplanation,
      isConvicted,
      convictedExplanation,
    } = formData;

    // turn the entry into a label→value map
    const map: Record<string, string> = {
      "Have you ever been denied a license, permit or privilege to operate a motor vehicle?":
        deniedLicense ? "Yes" : "No",
      "Has any license, permit or privilege ever been suspended or revoked?":
        suspendedOrRevoked ? "Yes" : "No",
      "If the answer to either above, give details:":
        deniedOrRevokedExplanation ?? "",
      "Have you ever been arrested and/or convicted of a misdemeanor or felony?":
        isConvicted ? "Yes" : "No",
      "If yes, please explain fully. Conviction of a crime is not an automatic bar to employment, all circumstances will be considered":
        convictedExplanation,
    };

    // draw that mini-table and bump y
    y = drawKeyValueTable(doc, map, y);
  }
  if (y > 265) {
    doc.addPage();
    y = 20;
  }

  // 8) Employment History
  if (formData.employmentHistory.length) {
    doc.setFontSize(14);
    doc.text("EMPLOYMENT HISTORY (Last 10 Years)", 15, y);
    y += 8;

    formData.employmentHistory.forEach((eh, i) => {
      // mini-heading per entry
      doc.setFontSize(12).text(`Employer #${i + 1}`, 15, y);
      y += 6;

      // turn the entry into a label→value map
      const map: Record<string, string> = {
        Company: eh.companyName,
        "Contact Person": eh.contactPerson,
        "Position Held": eh.position,
        "From/To": `${eh.from} - ${eh.to}` || "",
        "Reason for Leaving": eh.leaveReason,
        "Trailer Type": eh.trailerType,
        "Subject to FMCSR?": eh.fmcsrSubject ? "Yes" : "No",
        "DOT Drug-Testing?": eh.dotDrugTestRegulated ? "Yes" : "No",
      };

      // draw that mini-table and bump y
      y = drawKeyValueTable(doc, map, y);
    });
  }
  const gapMap = formData.employmentGapExplanations || {};
  const gapEntries = Object.entries(gapMap);
  if (gapEntries.length > 0) {
    const headers = ["Gap", "Explanation"];
    const data = gapEntries.map(([gapKey, explanation]) => [
      gapKey,
      explanation,
    ]);

    y = drawSectionTable(
      doc,
      "Employment Gap(Over 3 Months)",
      headers,
      data,
      y,
      false,
      true
    );
  }

  (pageWidth = 180),
    (margin = 0.5),
    (maxLineWidth = pageWidth - margin * 2),
    (fontSize = 10);
  let applicationCertify =
    "This certifies that this application was completed by me, and that all entries on it and information in it are true and complete to the best of my knowledge.";
  const newTextLines = doc
    .setFont("Arial")
    .setFontSize(fontSize)
    .splitTextToSize(applicationCertify, maxLineWidth);
  // Draw a label
  doc.setFontSize(12).setFont("Arial", "bold");
  doc.setFontSize(10);
  doc.setTextColor("black").text(newTextLines, 15, 260);
  doc.setFontSize(14);
  doc.text("Signature:", 15, 280);

  // Draw the signature image (if available)
  if (sigCanvas.current) {
    const sigDataUrl = sigCanvas.current.toDataURL("image/png");
    const sigW = 30; // width in mm
    const sigH = 15; // height in mm
    doc.addImage(sigDataUrl, "PNG", 40, 270, sigW, sigH);
  }

  // Print the date on the same line (or just below, as you like)
  doc.text(`Date: ${formData.date}`, 135, 280);

  doc.addPage();

  // header
  doc.setFont("Arial", "bold");
  doc.setFontSize(20);
  doc.text("FAIR CREDIT REPORTING ACT ", 105, 20, undefined, "center");
  doc.text("DISCLOSURE STATEMENT", 105, 30, undefined, "center");

  // disclosure text
  const disclosure = `
In accordance with the provisions of Section 604 (b)(2)(A) of the Fair Credit Reporting Act, Public Law 91-508, as amended by the Consumer Credit Reporting Act of 1996 (Title II, Subtitle D, Chapter I, of Public Law 104-208), you are being informed that reports verifying your previous employment, previous drug and alcohol test results, and your driving record may be obtained on you for employment/contract purposes. These reports are required by Sections 382.413, 391.23, and 391.25, of the Federal Motor Carrier Safety Regulations.
`.trim();

  doc.setFont("Arial", "normal");

  // wrap to page width
  pageWidth = 160;
  (margin = 0.5), (maxLineWidth = pageWidth - margin * 2), (fontSize = 16);
  let lines = doc
    .setFont("Arial", "bold")
    .setFontSize(fontSize)
    .splitTextToSize(disclosure, maxLineWidth);

  // draw
  doc.text(lines, 25, 70);
  doc.setFontSize(14);
  doc.text("Signature:", 15, 260);
  doc.text(`Date:`, 135, 260);

  // Draw the signature image (if available)
  if (sigCanvas.current) {
    const sigDataUrl = sigCanvas.current.toDataURL("image/png");
    const sigW = 30; // width in mm
    const sigH = 15; // height in mm
    doc.addImage(sigDataUrl, "PNG", 40, 250, sigW, sigH);
  }
  doc.text(`Print Name:`, 15, 280);
  doc.text(`Social Security Number:`, 110, 280);
  doc.setFont("Arial", "normal");
  doc.text(`${formData.date}`, 150, 260);
  doc.text(`${formData.printedName}`, 45, 280);
  doc.text(`${formData.socialSecurity}`, 167, 280);

  const totalPages = doc.getNumberOfPages();
  const pageWidth2 = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.setTextColor("black");
    doc.text(`Page ${i} of ${totalPages}`, pageWidth2 / 2, pageHeight - 10, {
      align: "center",
    });
  }
  addPSPDisclosurePages(doc, formData, sigCanvas);

  const pdfBytes = doc.output("arraybuffer");
  return pdfBytes;
};
