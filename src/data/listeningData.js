// src/data/listeningData.js
// Bộ đề & Dữ liệu luyện nghe IELTS Listening thực chiến chuẩn Cambridge (Section 1 - 4)

export const IELTS_LISTENING_TESTS = [
  {
    id: "test_cam_01",
    title: "Cambridge IELTS Test: Sustainable Architecture & Campus Services",
    difficulty: "Medium - Academic",
    duration: "30 phút",
    sections: [
      {
        sectionNumber: 1,
        title: "Section 1: University Accommodation Registration",
        context: "A student is calling the university housing department to register for accommodation.",
        audioScript: `
Officer: Good morning, Student Accommodation Office. How may I help you?
Student: Hello, yes, I'm enrolling for the postgraduate program in September and I need to book accommodation on campus.
Officer: Certainly. Let me take down your basic details first. Could I have your surname, please?
Student: Yes, it's Mitchell. That's M-I-T-C-H-E-L-L.
Officer: Thank you. And your primary field of study?
Student: Environmental Economics.
Officer: Splendid. Now regarding preferred room types, we have standard single rooms with shared kitchens, or en-suite studio flats.
Student: I would definitely prefer a studio flat, if available, because I will need a quiet environment for thesis writing.
Officer: We do have a few studio units left in Oakwood Hall. The weekly rent is 185 pounds, which includes high-speed Wi-Fi and utility bills.
Student: That sounds within my budget. What about public transport access?
Officer: There is a shuttle bus that departs directly from outside Oakwood Hall every twenty minutes, heading straight to the Central Library.
Student: Excellent. And could you tell me what deposit is required to secure the reservation?
Officer: A deposit of 300 pounds is due within fourteen days of booking confirmation.
Student: Perfect, I will submit the bank transfer this afternoon.
        `.trim(),
        questions: [
          {
            id: "s1_q1",
            type: "fill",
            label: "1. Student's field of study: Environmental ________",
            answer: "Economics",
            explanation: "Học viên nói rõ: 'Environmental Economics'."
          },
          {
            id: "s1_q2",
            type: "choice",
            label: "2. The student prefers a studio flat because:",
            options: [
              "A. It has a larger cooking area",
              "B. It provides a quieter environment for studying",
              "C. It is closer to the central campus"
            ],
            answer: "B",
            explanation: "Student giải thích: 'I would definitely prefer a studio flat... because I will need a quiet environment for thesis writing.'"
          },
          {
            id: "s1_q3",
            type: "fill",
            label: "3. Weekly rental price for Oakwood Hall: £________ per week",
            answer: "185",
            explanation: "Nhân viên nêu: 'The weekly rent is 185 pounds'."
          },
          {
            id: "s1_q4",
            type: "fill",
            label: "4. The shuttle bus to Central Library runs every ________ minutes",
            answer: "20",
            explanation: "Đoạn ghi rõ: 'every twenty minutes'."
          }
        ]
      },
      {
        sectionNumber: 4,
        title: "Section 4: University Lecture on Bio-mimetic Architecture",
        context: "A university lecturer is discussing how natural structures inspire modern eco-friendly skyscrapers.",
        audioScript: `
Lecturer: Welcome everyone. Today, we turn our attention to biomimicry in contemporary urban architecture—specifically, how biological structures can resolve human engineering challenges.
A prime illustration is the Eastgate Centre in Harare, Zimbabwe. Designed by architect Mick Pearce, this multi-storey commercial complex utilizes zero conventional air-conditioning. Instead, Pearce observed the porous, ventilation-rich architectures constructed by local termites.
Termite mounds maintain an astonishingly stable internal temperature of 31 degrees Celsius, irrespective of extreme diurnal shifts outside. They achieve this thermal equilibrium via a complex network of passive ventilation funnels, drawing cool air from subterranean chambers while venting hot air through vertical chimneys.
Pearce replicated this aerodynamic mechanism in the building's concrete skeleton. Consequently, the Eastgate Centre consumes thirty-five percent less energy than conventional cooling structures, generating substantial annual electricity savings while establishing a milestone in sustainable civil engineering.
        `.trim(),
        questions: [
          {
            id: "s4_q1",
            type: "choice",
            label: "1. What is unique about the Eastgate Centre in Zimbabwe?",
            options: [
              "A. It was constructed entirely from recycled timber",
              "B. It uses no conventional air-conditioning systems",
              "C. It is the tallest office tower in southern Africa"
            ],
            answer: "B",
            explanation: "Giảng viên nhấn mạnh: 'this multi-storey commercial complex utilizes zero conventional air-conditioning'."
          },
          {
            id: "s4_q2",
            type: "fill",
            label: "2. The building's ventilation blueprint was inspired by the mounds of ________",
            answer: "termites",
            explanation: "Kiến trúc sư quan sát: 'architectures constructed by local termites'."
          },
          {
            id: "s4_q3",
            type: "fill",
            label: "3. The complex achieves an energy consumption reduction of ________ percent",
            answer: "35",
            explanation: "Giảng viên xác nhận: 'consumes thirty-five percent less energy'."
          }
        ]
      }
    ]
  }
];
