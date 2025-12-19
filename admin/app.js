let currentStudents = [];

// 1. Ordinal Suffix (1st, 2nd...)
function getOrdinal(n) {
  let s = ["th", "st", "nd", "rd"],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// 2. Grading Logic
function getGrade(score) {
  if (score >= 70) return { g: "A", c: "#1cc88a", remark: "Excellent" };
  if (score >= 60) return { g: "B", c: "#4e73df", remark: "Very Good" };
  if (score >= 50) return { g: "C", c: "#f6c23e", remark: "Good" };
  if (score >= 45) return { g: "D", c: "#fd7e14", remark: "Pass" };
  if (score >= 40) return { g: "E", c: "#6c757d", remark: "Fair" };
  return { g: "F", c: "#e74a3b", remark: "Fail" };
}

async function loadClassData() {
  const file = document.getElementById("classSelect").value;
  const container = document.getElementById("studentContainer");
  container.innerHTML = "<h2>Loading data...</h2>";

  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error("File not found");
    const data = await response.json();

    // Exclude TEST users
    const realStudents = data.filter(
      (s) => !s.Name.toUpperCase().includes("TEST")
    );
    processAndDisplay(realStudents);
  } catch (err) {
    container.innerHTML = `<h2 style="color:red">Error: Could not load ${file}. <br> Make sure you are using a Live Server.</h2>`;
  }
}

function processAndDisplay(students) {
  students.forEach((student) => {
    student.scores = [];
    student.grandTotal = 0;
    let subCount = 0;

    Object.keys(student).forEach((key) => {
      if (key.includes("(CA 40)")) {
        const subName = key.split("(")[0].trim();
        const ca = student[`${subName} (CA 40)`] || 0;
        const exam = student[`${subName} (Exam 60)`] || 0;
        const total = ca + exam;

        student.scores.push({ name: subName, ca, exam, total });
        student.grandTotal += total;
        subCount++;
      }
    });
    student.average = student.grandTotal / subCount;
  });

  // Rank Positions
  students.sort((a, b) => b.grandTotal - a.grandTotal);
  students.forEach((s, i) => (s.classPosition = getOrdinal(i + 1)));

  // Subject Positions
  students.forEach((student) => {
    student.scores.forEach((subObj) => {
      const subjectRank = students
        .map((s) => s.scores.find((sc) => sc.name === subObj.name)?.total)
        .filter((t) => t !== undefined)
        .sort((a, b) => b - a);
      const rank = subjectRank.indexOf(subObj.total) + 1;
      subObj.position = getOrdinal(rank);
    });
  });

  currentStudents = students;
  renderCards(students);
}

function renderCards(students) {
  const container = document.getElementById("studentContainer");
  if (students.length === 0) {
    container.innerHTML = "<h3>No students found with that name.</h3>";
    return;
  }

  container.innerHTML = students
    .map(
      (s) => `
        <div class="student-card" style="background:white; margin:20px auto; padding:20px; border-radius:10px; width:95%; max-width:900px; box-shadow:0 4px 15px rgba(0,0,0,0.1)">
            <div style="display:flex; justify-content:space-between; border-bottom:2px solid #333; padding-bottom:10px">
                <div>
                    <h2 style="margin:0">${s.Name}</h2>
                    <p style="margin:5px 0">ID: ${s.AdmissionNumber} | Sex: ${
        s.Sex
      } | Class: ${s.Class}</p>
                </div>
                <div style="text-align:right">
                    <div style="font-size:1.2em; font-weight:bold; color:#4e73df">Pos: ${
                      s.classPosition
                    }</div>
                    <div style="font-size:1.5em; font-weight:bold">${s.average.toFixed(
                      1
                    )}%</div>
                </div>
            </div>

            <table style="width:100%; border-collapse:collapse; margin-top:15px">
                <thead>
                    <tr style="background:#f2f2f2">
                        <th style="border:1px solid #ddd; padding:10px; text-align:left">SUBJECT</th>
                        <th style="border:1px solid #ddd; padding:10px">CA</th>
                        <th style="border:1px solid #ddd; padding:10px">EXAM</th>
                        <th style="border:1px solid #ddd; padding:10px">TOTAL</th>
                        <th style="border:1px solid #ddd; padding:10px">GRADE</th>
                        <th style="border:1px solid #ddd; padding:10px">POS</th>
                    </tr>
                </thead>
                <tbody>
                    ${s.scores
                      .map((sub) => {
                        const gData = getGrade(sub.total);
                        return `
                        <tr>
                            <td style="border:1px solid #ddd; padding:8px; font-weight:bold">${sub.name}</td>
                            <td style="border:1px solid #ddd; padding:8px; text-align:center">${sub.ca}</td>
                            <td style="border:1px solid #ddd; padding:8px; text-align:center">${sub.exam}</td>
                            <td style="border:1px solid #ddd; padding:8px; text-align:center; font-weight:bold">${sub.total}</td>
                            <td style="border:1px solid #ddd; padding:8px; text-align:center; color:${gData.c}; font-weight:bold">${gData.g}</td>
                            <td style="border:1px solid #ddd; padding:8px; text-align:center">${sub.position}</td>
                        </tr>`;
                      })
                      .join("")}
                </tbody>
            </table>
            <div style="margin-top:10px; font-weight:bold">GRAND TOTAL: ${
              s.grandTotal
            }</div>
        </div>
    `
    )
    .join("");
}

function filterStudents() {
  const val = document.getElementById("searchInput").value.toLowerCase();
  const filtered = currentStudents.filter((s) =>
    s.Name.toLowerCase().includes(val)
  );
  renderCards(filtered);
}

// Start
loadClassData();
