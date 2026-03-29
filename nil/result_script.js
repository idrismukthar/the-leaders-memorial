// New simplified result renderer for TLMPS
// Populates result.html with student data and random Principal's comments

// --- CORE FUNCTIONS ---

// Function to pick random comment - MASSIVE LIST IN BRITISH ENGLISH
const principalComments = [
  // Academic Excellence
  "${firstName} has shown remarkable academic progress this session. A brilliant result.",
  "${firstName} continues to display excellent behaviour and diligence in all lessons.",
  "${firstName} is an outstanding student who sets a high standard for others to follow.",
  "A fantastic performance, ${firstName}! Your hard work has truly paid off.",
  "${firstName} has demonstrated exceptional commitment to academic excellence this term.",
  "${firstName} is a focused and highly motivated pupil with great potential.",
  "Excellent results, ${firstName}! You have mastered the curriculum with ease.",
  "A very impressive report card, ${firstName}. Keep up the stellar work.",
  "${firstName}'s dedication to studies is highly commendable and reflected in these marks.",
  "Well done, ${firstName}! You are a credit to your class and the school.",

  // Character & Leadership
  "${firstName} displays exceptional leadership qualities and a mature attitude.",
  "${firstName} is a role model for integrity and honesty within the school community.",
  "${firstName}'s positive attitude is a source of inspiration to peers and teachers alike.",
  "${firstName} demonstrates maturity beyond their years and handles tasks responsibly.",
  "A very well-behaved and polite student. ${firstName} is a pleasure to teach.",
  "${firstName} shows great responsibility and is always willing to assist others.",
  "${firstName} consistently demonstrates respect for authority and school rules.",
  "It is a joy to see ${firstName} develop into such a well-rounded individual.",
  "${firstName} shows outstanding initiative and independence in all activities.",
  "A very helpful and cooperative member of the school. Well done, ${firstName}!",

  // Growth & Improvement
  "${firstName} has shown significant improvement this term. Keep up the momentum!",
  "I am pleased with ${firstName}'s progress. The extra effort is clearly showing.",
  "${firstName} is growing steadily in confidence and ability. A good term's work.",
  "Well done on your improved focus, ${firstName}. Continue to strive for the best.",
  "${firstName} has made impressive strides in several subjects this session.",
  "I am encouraged by ${firstName}'s determination to succeed against challenges.",
  "${firstName} is building a strong foundation for future academic success.",
  "Keep working hard, ${firstName}. Your progress is very noteworthy this year.",
  "${firstName} has successfully applied feedback to improve their overall performance.",
  "A steady and consistent performance. ${firstName} is moving in the right direction.",

  // Enthusiasm & Participation
  "${firstName} participates wholeheartedly in all school programmes and events.",
  "It is wonderful to see ${firstName} so engaged and enthusiastic about learning.",
  "${firstName} brings a vibrant and positive energy to every classroom discussion.",
  "${firstName} is an active participant in group work and a supportive teammate.",
  "I am impressed by ${firstName}'s curiosity and eagerness to explore new topics.",
  "Excellent involvement in extra-curricular activities, ${firstName}. Well done.",
  "${firstName} demonstrates infectious positivity and a love for learning.",
  "A very energetic and involved student. ${firstName} makes a great contribution.",
  "${firstName} is always ready to take on new challenges with a smile.",
  "Your enthusiasm for school life is fantastic, ${firstName}! Keep it up.",

  // Future Outlook
  "${firstName}, keep striving for excellence—the future is yours to command!",
  "${firstName} is destined for great things if this level of work continues.",
  "The sky is the limit for ${firstName}'s potential. A truly bright future ahead.",
  "${firstName} has all the qualities required for outstanding future success.",
  "I look forward to seeing ${firstName} reach even greater heights next term.",
  "${firstName} is well-positioned for a brilliant academic career. Bravo!",
  "Continue to believe in yourself, ${firstName}. You are capable of greatness.",
  "${firstName} represents the very best of our student body. Excellent work.",
  "Hearty congratulations, ${firstName}, on a successful and productive term!",
  "Maintain this standard of excellence, ${firstName}. You are doing wonderfully.",
];

function getRandomComment(firstName) {
  const random =
    principalComments[Math.floor(Math.random() * principalComments.length)];
  return random.replace(/\$\{firstName\}/g, firstName);
}

function getRemarkFromScore(total) {
  if (total >= 75) return "Excellent (A)";
  if (total >= 60) return "Very Good (B)";
  if (total >= 50) return "Good (C)";
  if (total >= 40) return "Pass (D)";
  return "Fail (F)";
}

// --- PDF DOWNLOAD FUNCTION ---
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
    margin: [10, 15, 10, 15],
    filename: `${studentName}_First_Term_Result.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    pagebreak: { mode: ["css"] },
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
      console.error("Failed to parse loggedStudent", e);
    }
  }

  if (!student) {
    const container = document.querySelector(".result-page") || document.body;
    container.innerHTML =
      '<p style="padding:20px; text-align: center;">No student data found — please <a href="login.html">login</a> from the portal first.</p>';
    return;
  }

  // 1. POPULATE BASIC INFO
  document.getElementById("studentName").textContent = student.Name || "N/A";
  document.getElementById("studentSex").textContent = student.Sex || "N/A";
  document.getElementById("studentClass").textContent = student.Class || "N/A";
  document.getElementById("studentID").textContent =
    student.AdmissionNumber ?? "N/A";
  document.getElementById("studentPosition").textContent =
    student.Position && student.Position !== "nil"
      ? student.Position
      : "Awaiting";

  // Date/Time
  const date = new Date();
  document.getElementById("printedOn").textContent = date.toLocaleString(
    "en-GB",
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
    photoEl.src = `img/${student.Passport}`;
    photoEl.alt = student.Name + " Passport";
  }

  // 2. BUILD TABLE
  const subjects = {};
  Object.keys(student).forEach((k) => {
    const caMatch = k.match(/^(.*) \(CA 40\)$/);
    const exMatch = k.match(/^(.*) \(Exam 60\)$/);
    if (caMatch) {
      let name = caMatch[1].trim();
      subjects[name] = subjects[name] || { ca: 0, exam: 0 };
      subjects[name].ca = Number(student[k]) || 0;
    }
    if (exMatch) {
      let name = exMatch[1].trim();
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
    const total = ca + exam;
    if (total > 0) {
      totalScore += total;
      countedSubjects++;
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${name}</td>
                <td style="text-align: center;">${ca.toFixed(0)}</td>
                <td style="text-align: center;">${exam.toFixed(0)}</td>
                <td style="text-align: center;">${total.toFixed(0)}</td>
                <td style="text-align: center;">${getRemarkFromScore(
                  total
                )}</td>
            `;
      tbody.appendChild(row);
    }
  });

  // 3. TOTALS & PERSONALIZED COMMENT
  const avg = countedSubjects ? totalScore / countedSubjects : 0;
  if (document.getElementById("totalDisplay"))
    document.getElementById("totalDisplay").textContent = totalScore.toFixed(0);
  if (document.getElementById("avgDisplay"))
    document.getElementById("avgDisplay").textContent = `${avg.toFixed(2)}%`;

  // 🔥 FIX: GET THE "NAME" NOT "SURNAME"
  // Assumes format: "SURNAME FIRSTNAME" or "SURNAME FIRSTNAME MIDDLENAME"
  const nameParts = (student.Name || "").split(" ");
  let commentName = nameParts[0]; // Fallback to first part if only one name exists

  if (nameParts.length > 1) {
    // This picks the second word in the string as the First Name
    commentName = nameParts[1];
  }

  const principalCommentEl = document.getElementById("principalComment");
  if (principalCommentEl) {
    principalCommentEl.textContent = getRandomComment(commentName);
  }

  // 4. BUTTONS
  document.getElementById("downloadBtn")?.addEventListener("click", () => {
    downloadResultPDF(student.Name || "Student");
  });

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("loggedStudent");
    localStorage.removeItem("studentClass");
    window.location.href = "login.html";
  });
});
