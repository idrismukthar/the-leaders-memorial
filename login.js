document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  // login.html's input id is `admission`
  const username = document.getElementById("admission").value.trim();
  const password = document
    .getElementById("password")
    .value.trim()
    .toLowerCase();

  let jsonFile = "";

  if (password === "tlmps1") jsonFile = "jss1.json";
  else if (password === "tlmps2") jsonFile = "jss2.json";
  else if (password === "tlmps3") jsonFile = "jss3.json";
  else {
    const errEl = document.getElementById("errorMsg");
    if (errEl) errEl.textContent = "Invalid password. Try again.";
    else alert("Invalid password. Try again.");
    return;
  }

  try {
    const response = await fetch(jsonFile);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const students = await response.json();

    if (!Array.isArray(students)) {
      console.error("JSON format error:", students);
      const errEl = document.getElementById("errorMsg");
      if (errEl) errEl.textContent = "Student data format invalid.";
      else alert("Student data format invalid.");
      return;
    }

    // AdmissionNumber in the JSON is stored as `AdmissionNumber` (no space)
    const student = students.find((s) => {
      const adm =
        s.AdmissionNumber ?? s["AdmissionNumber"] ?? s["Admission Number"];
      if (adm == null) return false;
      return adm.toString().trim() === username || adm === Number(username);
    });

    if (student) {
      // Save the student object and class file so result page can read it
      localStorage.setItem("loggedStudent", JSON.stringify(student));
      localStorage.setItem("studentClass", jsonFile);
      window.location.href = "result.html";
    } else {
      const errEl = document.getElementById("errorMsg");
      if (errEl)
        errEl.textContent =
          "Invalid admission number. Please check and try again.";
      else alert("Invalid Admission Number. Please check and try again.");
    }
  } catch (error) {
    console.error("Error loading student data:", error);
    const errEl = document.getElementById("errorMsg");
    if (errEl) errEl.textContent = "Error loading student data.";
    else alert("Error loading student data.");
  }
});
