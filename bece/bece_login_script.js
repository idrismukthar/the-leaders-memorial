async function handleLogin() {
  // Get the filename based on selection (e.g., 'bece' or 'bece24')
  const fileKey = document.getElementById("examYear").value;
  const jsonFile = `${fileKey}.json`;

  const surnameInput = document
    .getElementById("surname")
    .value.trim()
    .toUpperCase();
  const passwordInput = document
    .getElementById("password")
    .value.trim()
    .toLowerCase();
  const errorMsg = document.getElementById("error-msg");

  try {
    const response = await fetch(jsonFile);

    if (!response.ok) {
      throw new Error(
        `I'm so sorry your result is ot Available yet!, try again later.`
      );
    }

    const data = await response.json();

    // Search database
    const student = data.find(
      (s) =>
        s.Candidate_SURNAME.trim().toUpperCase() === surnameInput &&
        s.password.trim().toLowerCase() === passwordInput
    );

    if (student) {
      sessionStorage.setItem("currentBeceStudent", JSON.stringify(student));
      window.location.href = "bece_result.html";
    } else {
      errorMsg.textContent = "Access Denied: Incorrect Surname or Password.";
      errorMsg.style.display = "block";
    }
  } catch (error) {
    errorMsg.textContent = error.message;
    errorMsg.style.display = "block";
  }
}

function toggleRecovery() {
  const box = document.getElementById("recovery-box");
  box.style.display = box.style.display === "none" ? "block" : "none";
}

async function recoverPassword() {
  const fileKey = document.getElementById("examYear").value;
  const jsonFile = `${fileKey}.json`;

  const surname = document.getElementById("surname").value.trim().toUpperCase();
  const middle = document
    .getElementById("middleNameVerify")
    .value.trim()
    .toUpperCase();
  const recMsg = document.getElementById("recovery-msg");

  try {
    const response = await fetch(jsonFile);
    const data = await response.json();

    const student = data.find(
      (s) =>
        s.Candidate_SURNAME.trim().toUpperCase() === surname &&
        s.Candidate_MName.trim().toUpperCase() === middle
    );

    if (student) {
      recMsg.innerHTML = `MATCH FOUND!<br>Your Password is: <b>${student.password}</b>`;
      recMsg.style.display = "block";
    } else {
      alert("No match found for that Surname/Middle Name combo.");
    }
  } catch (e) {
    alert("Could not access the database for recovery.");
  }
}

// Enter key support
document.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleLogin();
});
