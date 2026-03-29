import json

# Fix JSS2.json - change all Password from tlmps3 to tlmps2
with open('jss2.json', 'r') as f:
    jss2_data = json.load(f)

for student in jss2_data:
    if student.get('Password') == 'tlmps3':
        student['Password'] = 'tlmps2'

with open('jss2.json', 'w') as f:
    json.dump(jss2_data, f, indent=1)

print("✓ jss2.json fixed: All passwords changed to tlmps2")

# JSS3 passwords should already be tlmps3 (correct), but verify
with open('jss3.json', 'r') as f:
    jss3_data = json.load(f)

jss3_correct = all(student.get('Password') == 'tlmps3' for student in jss3_data)
if jss3_correct:
    print("✓ jss3.json verified: All passwords are tlmps3")
else:
    print("⚠ jss3.json has mixed passwords, fixing...")
    for student in jss3_data:
        student['Password'] = 'tlmps3'
    with open('jss3.json', 'w') as f:
        json.dump(jss3_data, f, indent=1)
    print("✓ jss3.json fixed: All passwords set to tlmps3")

print("\n✓ JSON files fixed successfully!")
