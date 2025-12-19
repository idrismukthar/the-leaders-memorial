let pdfFileName = "Student_Result";

document.addEventListener("DOMContentLoaded", () => {
  const studentData = sessionStorage.getItem("currentBeceStudent");

  if (!studentData) {
    window.location.href = "bece_login.html";
    return;
  }

  const student = JSON.parse(studentData);
  pdfFileName = `${student.Candidate_SURNAME}_${student.Candidate_FNAME}_BECE_2025`;

  // 1. POPULATE PERSONAL DETAILS
  document.getElementById(
    "candidateName"
  ).textContent = `${student.Candidate_SURNAME} ${student.Candidate_FNAME} ${student.Candidate_MName}`;
  document.getElementById("examNo").textContent = student.Examination_No;

  // 2. PHOTO LOGIC - Strict check
  const photoEl = document.getElementById("studentPhoto");
  if (student.header_URL && student.header_URL.trim() !== "") {
    photoEl.src = student.header_URL;
    photoEl.onerror = () => {
      photoEl.src = "default.jfif";
    };
  } else {
    photoEl.src = "default.jfif";
  }

  // 3. GENERATE TABLE
  const tbody = document.getElementById("resultsBody");
  const subjects = [
    "ENGLISH STUDIES",
    "MATHEMATICS",
    "BUSINESS STUDIES",
    "BASIC SCIENCE & TECH",
    "CULTURAL & CREATIVE ARTS",
    "ISLAMIC RELIGIOUS STUDIES",
    "NATIONAL VALUES",
    "PRE VOCATIONAL STUDIES",
    "YORUBA",
  ];

  subjects.forEach((sub) => {
    const grade = student[sub] || "-";
    const row = document.createElement("tr");
    row.innerHTML = `<td>${sub}</td><td>${grade}</td><td>${getRemark(
      grade
    )}</td>`;
    tbody.appendChild(row);
  });

  // 4. RANDOM CURLY COMMENTS
  const comments = [
    `Outstanding achievement, ${student.Candidate_FNAME}! Your hard work has truly paid off. Best of luck in your senior secondary studies!`,
    `Congratulations on your success, ${student.Candidate_FNAME}! You have shown great character and brilliance. Keep the fire burning!`,
    `Well done! This is a solid foundation for your future career. We are proud of your performance at TLMPS.`,
    `Superb results, ${student.Candidate_FNAME}! Your dedication to excellence is evident. Wishing you more greatness ahead.`,
  ];
  document.getElementById("principalComment").textContent =
    comments[Math.floor(Math.random() * comments.length)];
});

function getRemark(grade) {
  const g = grade.trim().toUpperCase();
  if (["A1", "A2", "A3", "B"].includes(g)) return "Distinction";
  if (["C", "D"].includes(g)) return "Credit";
  if (["P", "E"].includes(g)) return "Pass";
  return "Pass";
}

function logout() {
  sessionStorage.removeItem("currentBeceStudent");
  window.location.href = "bece_login.html";
}

function downloadPDF() {
  const element = document.getElementById("certificate-page");
  const opt = {
    margin: [0, 0, 0, 0],
    filename: `${pdfFileName}.pdf`,
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3, useCORS: true },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
  };
  html2pdf().set(opt).from(element).save();
}
