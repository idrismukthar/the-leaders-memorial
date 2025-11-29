/**
 * Test script to simulate login and result page loading
 * Run this in the browser console after opening result.html to verify the flow
 */

// Step 1: Verify jss1.json can be fetched and student 25008 exists
async function testLoginFlow() {
  console.log("=== Testing Login Flow ===\n");

  try {
    // Fetch jss1.json
    const response = await fetch("jss1.json");
    const students = await response.json();
    console.log("✓ jss1.json loaded successfully");
    console.log(`  Total students: ${students.length}`);

    // Find student 25008
    const student = students.find((s) => s.AdmissionNumber === 25008);
    if (student) {
      console.log(
        `✓ Student found: ${student.Name} (Admission: ${student.AdmissionNumber})`
      );
      console.log(`  Sex: ${student.Sex}, Class: ${student.Class}`);
      console.log(`  Passport: ${student.Passport}`);

      // Count subjects with scores
      let subjectsWithScores = 0;
      Object.keys(student).forEach((k) => {
        if (k.match(/\(CA 40\)$/) && student[k] !== null) subjectsWithScores++;
      });
      console.log(`  Subjects with CA scores: ${subjectsWithScores}`);

      // Simulate localStorage set (as login.js would do)
      localStorage.setItem("loggedStudent", JSON.stringify(student));
      localStorage.setItem("studentClass", "jss1.json");
      console.log("\n✓ Student data stored in localStorage");

      // Test comment randomization
      const comments = [
        "${firstName} has shown remarkable academic progress this session.",
        "${firstName} continues to display excellent behavior and diligence.",
        "${firstName} is an outstanding example to peers.",
      ];

      const firstName = student.Name.split(" ")[0];
      const randomComment = comments[0].replace(/\$\{firstName\}/g, firstName);
      console.log(`\n✓ Example principal comment: "${randomComment}"`);

      console.log("\n=== Test Complete ===");
      console.log(
        "To see the full report, navigate to result.html or refresh the page."
      );
    } else {
      console.log("✗ Student 25008 not found!");
    }
  } catch (error) {
    console.error("✗ Error:", error);
  }
}

// Run the test
testLoginFlow();
