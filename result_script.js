// New simplified result renderer.
// This script reads `loggedStudent` (set by login.js) from localStorage and
// populates `result.html`.

// --- CORE FUNCTIONS ---

// Function to pick random comment
const principalComments = [
  // ... (Your extensive list of principal comments here) ...
  "${firstName} has shown remarkable academic progress this session.",
  "${firstName} continues to display excellent behavior and diligence.",
  "The sky is the limit for ${firstName}'s potential.",
  "Congratulations ${firstName} on your outstanding performance.",
  "${firstName} is a model student with outstanding potential.",
  "Excellent work ${firstName}! Your consistency is commendable.",
  "${firstName} is an all-around excellent student and individual.",
];

function getRandomComment(firstName) {
  const random =
    principalComments[Math.floor(Math.random() * principalComments.length)];
  return random.replace(/\$\{firstName\}/g, firstName);
}

function getRemarkFromScore(total) {
  // total is out of 100
  if (total >= 75) return "Excellent (A)";
  if (total >= 60) return "Good (B)";
  if (total >= 50) return "Fair (C)";
  if (total >= 40) return "Pass (D)";
  return "Fail (F)";
}

// --- PDF DOWNLOAD FUNCTION (SINGLE PAGE FIX) ---
function downloadResultPDF(studentName) {
  const element = document.getElementById("result-page");
  if (!element) {
    alert("Cannot find result page to download.");
    return;
  }

  if (typeof html2pdf === "undefined") {
    alert("PDF library not available. Using browser print instead.");
    window.print();
    return;
  }

  const opt = {
    // 🔥 CRITICAL: Set PDF output to A4 portrait
    margin: [10, 15, 10, 15], // Top, Left, Bottom, Right in mm (Matching @page in CSS)
    filename: `${studentName}_First_Term_Result.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      logging: false,
      // Lower DPI to fit content better if needed, but scale: 2 is usually enough.
    },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },

    // 🔥 CRITICAL FIX: Tell the PDF generator to respect your CSS page-break rules
    pagebreak: {
      mode: ["css"], // This relies on 'page-break-inside: avoid' in result.css
    },
  };

  html2pdf().set(opt).from(element).save();
}

// --- MAIN EXECUTION ---
document.addEventListener("DOMContentLoaded", async () => {
  let student = null;
  const stored = localStorage.getItem("loggedStudent");
  if (stored) {
    try {
      student = JSON.parse(stored);
    } catch (e) {
      console.error("Failed to parse loggedStudent from localStorage", e);
    }
  }

  // Check if student is logged in (use the direct check)
  if (!student) {
    // Fallback or redirect if no data
    const container = document.querySelector(".result-page") || document.body;
    container.innerHTML =
      '<p style="padding:20px; text-align: center;">No student data found — please <a href="login.html">login</a> from the portal first.</p>';
    return;
  }

  // --- 1. POPULATE BASIC INFO & DATE ---
  document.getElementById("studentName").textContent = student.Name || "N/A";
  document.getElementById("studentSex").textContent = student.Sex || "N/A";
  document.getElementById("studentClass").textContent = student.Class || "N/A";
  document.getElementById("studentID").textContent =
    student.AdmissionNumber ?? "N/A";
  // Assuming 'Position' is not automatically calculated here, set placeholder
  document.getElementById("studentPosition").textContent =
    student.Position && student.Position !== "nil"
      ? student.Position
      : "Awaiting";

  // 🔥 NEW FEATURE: Printed On Date/Time
  const date = new Date();
  document.getElementById("printedOn").textContent = date.toLocaleString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  // Passport
  const photoEl = document.getElementById("studentPhoto");
  if (photoEl && student.Passport) {
    // Assuming passport images are in an 'img' folder
    photoEl.src = `img/${student.Passport}`;
    photoEl.alt = student.Name + " Passport";
  }

  // --- 2. BUILD SUBJECTS TABLE & CALCULATE SCORES ---
  const subjects = {};
  Object.keys(student).forEach((k) => {
    const caMatch = k.match(/^(.*) \(CA 40\)$/);
    const exMatch = k.match(/^(.*) \(Exam 60\)$/);

    // Simplify subject names for subjects like CRS/IRS if needed, otherwise use key name
    let name = k;
    if (caMatch) {
      name = caMatch[1].trim();
      subjects[name] = subjects[name] || { ca: 0, exam: 0 };
      subjects[name].ca = Number(student[k]) || 0;
    }
    if (exMatch) {
      name = exMatch[1].trim();
      subjects[name] = subjects[name] || { ca: 0, exam: 0 };
      subjects[name].exam = Number(student[k]) || 0;
    }
  });

  const tbody = document.getElementById("resultsBody");
  if (tbody) tbody.innerHTML = "";

  let totalScore = 0;
  let countedSubjects = 0;
  const subjectNames = Object.keys(subjects).sort();

  subjectNames.forEach((name) => {
    const { ca, exam } = subjects[name];
    const total = (Number(ca) || 0) + (Number(exam) || 0);

    // Only count subjects that have a score (total > 0)
    if (total > 0) {
      totalScore += total;
      countedSubjects++;
      const remark = getRemarkFromScore(total);

      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${name}</td>
                <td style="text-align: center;">${ca.toFixed(0)}</td>
                <td style="text-align: center;">${exam.toFixed(0)}</td>
                <td style="text-align: center;">${total.toFixed(0)}</td>
                <td style="text-align: center;">${remark}</td>
            `;
      tbody.appendChild(row);
    }
  });

  // Calculate average based on counted subjects (out of 100)
  const avg = countedSubjects ? totalScore / countedSubjects : 0;

  // --- 3. POPULATE AVERAGES & COMMENTS ---
  const avgDisplay = document.getElementById("avgDisplay");
  const totalDisplay = document.getElementById("totalDisplay");

  if (totalDisplay) totalDisplay.textContent = totalScore.toFixed(0);
  if (avgDisplay) avgDisplay.textContent = `${avg.toFixed(2)}%`;

  // Get student's first name for comment personalization
  const nameParts = (student.Name || "").split(" ");
  const firstName = nameParts[0];

  // Principal comment (random from list)
  const principalCommentEl = document.getElementById("principalComment");
  if (principalCommentEl) {
    principalCommentEl.textContent = getRandomComment(firstName);
  }

  // --- 4. BUTTON HANDLERS ---
  document.getElementById("downloadBtn")?.addEventListener("click", () => {
    downloadResultPDF(student.Name || "Student");
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("loggedStudent");
    localStorage.removeItem("studentClass");
    window.location.href = "login.html";
  });
});
