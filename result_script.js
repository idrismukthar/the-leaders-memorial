// New simplified result renderer.
// This script reads `loggedStudent` (set by login.js) from localStorage and
// populates `result.html`. If the student object isn't present, it will try
// to fetch the `studentClass` JSON and find the student by AdmissionNumber.

// Check if student is logged in before rendering
const studentCheck = JSON.parse(localStorage.getItem("loggedStudent"));
if (!studentCheck) {
  window.location.href = "login.html";
}

// Principal Comments Array - Congratulations & Encouragement
const principalComments = [
  // Academic Excellence
  "${firstName} has shown remarkable academic progress this session.",
  "${firstName} continues to display excellent behavior and diligence.",
  "${firstName} is an outstanding example to peers.",
  "${firstName} has improved tremendously in academics.",
  "${firstName}'s dedication to studies is highly commendable.",
  "${firstName} always demonstrates a positive attitude towards learning.",
  "${firstName} continues to excel in every aspect of school life.",
  "${firstName} is a delight to have in our school.",
  "${firstName} is growing steadily in confidence and ability.",
  "${firstName} sets a high standard for classmates.",
  "${firstName} has demonstrated exceptional commitment to excellence.",
  "${firstName} is a model student with outstanding potential.",
  "${firstName} brings positive energy to the classroom.",
  "${firstName}'s hard work and perseverance are truly admirable.",
  "${firstName} has made impressive strides this term.",

  // Encouragement & Growth
  "${firstName} shows great promise and a bright future ahead.",
  "Congratulations ${firstName}! Your effort and determination are inspiring.",
  "${firstName} continues to grow both academically and personally.",
  "Well done ${firstName}! Keep up this excellent momentum.",
  "${firstName} demonstrates remarkable focus and commitment to excellence.",
  "${firstName} is a credit to the school community.",
  "Excellent work ${firstName}! Your consistency is commendable.",
  "${firstName} has earned the respect of teachers and peers alike.",
  "${firstName} continues to demonstrate outstanding character and discipline.",
  "Bravo ${firstName}! Your progress is truly noteworthy.",

  // Character & Conduct
  "${firstName} displays exceptional leadership qualities.",
  "${firstName} is a role model for integrity and honesty.",
  "${firstName}'s positive attitude is a source of inspiration.",
  "${firstName} demonstrates maturity beyond their years.",
  "${firstName} shows great responsibility in all endeavors.",
  "${firstName} is known for their helpful and cooperative spirit.",
  "${firstName} consistently demonstrates respect for authority and peers.",
  "${firstName} has developed into a well-rounded individual.",
  "${firstName} shows outstanding initiative and independence.",
  "${firstName} is a valuable member of our school community.",

  // Performance & Achievement
  "${firstName} has achieved excellent results across all subjects.",
  "Congratulations ${firstName} on your outstanding performance.",
  "${firstName} continues to break new heights in academics.",
  "${firstName} has surpassed expectations in this term's assessment.",
  "${firstName} demonstrates mastery in their chosen subjects.",
  "${firstName} shows exceptional aptitude and understanding.",
  "${firstName}'s assignments reflect careful thought and effort.",
  "${firstName} has shown consistent improvement throughout the term.",
  "${firstName} deserves recognition for their academic achievements.",
  "${firstName} is excelling in both theory and practical skills.",

  // Personal Development
  "${firstName} is developing into a conscientious and responsible student.",
  "${firstName} shows admirable resilience when facing challenges.",
  "${firstName} demonstrates excellent time management and organization.",
  "${firstName} takes constructive feedback and applies it effectively.",
  "${firstName} shows genuine interest in expanding their knowledge.",
  "${firstName} is developing strong critical thinking skills.",
  "${firstName} demonstrates excellent communication abilities.",
  "${firstName} shows commendable growth in confidence and self-expression.",
  "${firstName} is building a strong foundation for future success.",
  "${firstName} demonstrates remarkable adaptability and flexibility.",

  // Enthusiasm & Participation
  "${firstName} participates actively in all classroom activities.",
  "${firstName} shows genuine enthusiasm for learning.",
  "${firstName} is always ready to help classmates in need.",
  "${firstName} brings enthusiasm and energy to group work.",
  "${firstName} demonstrates active engagement in school activities.",
  "${firstName} contributes meaningfully to class discussions.",
  "${firstName} shows genuine curiosity and love for learning.",
  "${firstName} participates wholeheartedly in school events.",
  "${firstName} is an asset to our vibrant school community.",
  "${firstName} demonstrates infectious positivity and enthusiasm.",

  // Future Outlook
  "${firstName}, keep striving for excellence—the future is yours!",
  "${firstName} is destined for great things ahead.",
  "The sky is the limit for ${firstName}'s potential.",
  "${firstName} has all the qualities needed for outstanding success.",
  "${firstName} is well-positioned for a brilliant academic career.",
  "${firstName} will go far with the current trajectory of progress.",
  "${firstName} shows every sign of becoming a future leader.",
  "${firstName} is building excellent foundations for university and beyond.",
  "${firstName}'s success story is just beginning.",
  "${firstName} has tremendous potential waiting to be unleashed.",

  // Holistic Recognition
  "${firstName} is an all-around excellent student and individual.",
  "${firstName} embodies the values we cherish at our school.",
  "${firstName} demonstrates excellence in academics and character alike.",
  "${firstName} is a testament to what dedication can achieve.",
  "${firstName} has become a symbol of success and perseverance.",
  "${firstName} represents the very best of our student body.",
  "${firstName} is a proud representative of school excellence.",
  "${firstName} continues to make our school proud.",
  "${firstName} is truly exceptional in every way.",
  "${firstName} deserves heartfelt congratulations for this stellar performance.",
];

// Function to pick random comment
function getRandomComment(firstName) {
  const random =
    principalComments[Math.floor(Math.random() * principalComments.length)];
  return random.replace(/\$\{firstName\}/g, firstName);
}

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

  // If no student object, try to fetch from the stored class file
  if (!student) {
    const classFile = localStorage.getItem("studentClass");
    if (classFile) {
      try {
        const resp = await fetch(classFile);
        if (resp.ok) {
          const arr = await resp.json();
          console.warn(
            "No logged student found in storage. Please login first."
          );
        }
      } catch (e) {
        console.error("Failed to fetch class file", e);
      }
    }
  }

  if (!student) {
    // Show a friendly message on the page asking the user to login
    const container = document.querySelector(".result-page") || document.body;
    container.innerHTML =
      '<p style="padding:20px; text-align: center;">No student data found — please <a href="login.html">login</a> from the portal first.</p>';
    return;
  }

  // Populate basic info
  document.getElementById("studentName").textContent = student.Name || "";
  document.getElementById("studentSex").textContent = student.Sex || "";
  document.getElementById("studentClass").textContent =
    student.Class || localStorage.getItem("studentClass") || "";
  document.getElementById("studentID").textContent =
    student.AdmissionNumber ?? student.Admission ?? "";

  // Passport
  const photoEl = document.getElementById("studentPhoto");
  if (photoEl && student.Passport) {
    photoEl.src = `img/${student.Passport}`;
    photoEl.alt = student.Name + " Passport";
  }

  // Build subjects table by finding all "(CA 40)" and "(Exam 60)" pairs
  const subjects = {};
  Object.keys(student).forEach((k) => {
    const caMatch = k.match(/^(.*) \(CA 40\)$/);
    const exMatch = k.match(/^(.*) \(Exam 60\)$/);
    if (caMatch) {
      const name = caMatch[1].trim();
      subjects[name] = subjects[name] || { ca: 0, exam: 0 };
      subjects[name].ca = Number(student[k]) || 0;
    }
    if (exMatch) {
      const name = exMatch[1].trim();
      subjects[name] = subjects[name] || { ca: 0, exam: 0 };
      subjects[name].exam = Number(student[k]) || 0;
    }
  });

  const tbody =
    document.getElementById("resultsBody") ||
    document.querySelector("#resultsTable tbody");
  if (tbody) tbody.innerHTML = "";

  let totalScore = 0;
  const subjectNames = Object.keys(subjects).sort();
  subjectNames.forEach((name) => {
    const { ca, exam } = subjects[name];
    const total = (Number(ca) || 0) + (Number(exam) || 0);
    totalScore += total;
    const remark = getRemarkFromScore(total);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td style="text-align: center;">${ca}</td>
      <td style="text-align: center;">${exam}</td>
      <td style="text-align: center;">${total}</td>
      <td style="text-align: center;">${remark}</td>
    `;
    if (tbody) tbody.appendChild(row);
  });

  const avg = subjectNames.length
    ? (totalScore / (subjectNames.length * 100)) * 100
    : 0;

  // Update both old and new element IDs for compatibility
  const totalScoreEl = document.getElementById("totalScore");
  const averageEl = document.getElementById("averageScore");
  const avgDisplay = document.getElementById("avgDisplay");
  const totalDisplay = document.getElementById("totalDisplay");

  if (totalScoreEl) totalScoreEl.textContent = totalScore;
  if (totalDisplay) totalDisplay.textContent = totalScore;
  if (averageEl) averageEl.textContent = avg.toFixed(2);
  if (avgDisplay) avgDisplay.textContent = avg.toFixed(2);

  // Get student's second name (last name) for comment personalization
  const nameParts = (student.Name || "").split(" ");
  const secondName =
    nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0];

  // Principal comment (random from list)
  const principalCommentEl = document.getElementById("principalComment");
  if (principalCommentEl) {
    principalCommentEl.textContent = getRandomComment(secondName);
  }

  // Download button handler
  const downloadBtn = document.getElementById("downloadBtn");
  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      downloadResultPDF(student.Name || "Student");
    });
  }

  // Logout button handler
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      // Clear session data
      localStorage.removeItem("loggedStudent");
      localStorage.removeItem("studentClass");
      // Redirect to login page
      window.location.href = "login.html";
    });
  }
});

function getRemarkFromScore(total) {
  // total is out of 100
  if (total >= 75) return "Excellent";
  if (total >= 60) return "Good";
  if (total >= 50) return "Fair";
  if (total >= 40) return "Pass";
  return "Fail";
}

// Download PDF function
function downloadResultPDF(studentName) {
  const element = document.querySelector(".result-page");
  if (!element) {
    alert("Cannot find result page to download.");
    return;
  }

  // Check if html2pdf is available
  if (typeof html2pdf === "undefined") {
    // Fallback to browser print
    alert("PDF library not available. Using browser print instead.");
    window.print();
    return;
  }

  const opt = {
    margin: 10,
    filename: `${studentName}_Result.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, logging: false },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };

  html2pdf().set(opt).from(element).save();
}
