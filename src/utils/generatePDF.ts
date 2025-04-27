import { NewDriverForm } from "@/types/newDriverForm";
import rcj_transport from "../../public/rcj_transport.png";
import jsPDF from "jspdf";
import SignatureCanvas from "react-signature-canvas";
import autoTable, { applyPlugin } from "jspdf-autotable";
import { format } from "path";
applyPlugin(jsPDF);
interface generatePDFProps {
  formData: NewDriverForm;
  sigCanvas: React.RefObject<SignatureCanvas | null>;
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
    const headers = ["Name", "Date of Birth", "SSN", "Phone", "Alt.Phone"];
    const {
      lastName,
      firstName,
      dateOfBirth,
      socialSecurity,
      phone,
      altPhone,
    } = formData;
    const data = [
      [
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

  const pdfBytes = doc.output("arraybuffer");
  return pdfBytes;
};
