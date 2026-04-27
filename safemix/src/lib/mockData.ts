// Mock data for the entire SafeMix frontend

export const mockMedicines = [
  {
    id: "1",
    name: "Metformin 500mg",
    system: "Allopathy",
    dosage: "500mg",
    frequency: "Twice daily",
    time: "8:00 AM, 8:00 PM",
    withFood: true,
    startDate: "2024-01-15",
    status: "active",
  },
  {
    id: "2",
    name: "Karela Juice",
    system: "Ayurveda",
    dosage: "30ml",
    frequency: "Once daily",
    time: "7:00 AM",
    withFood: false,
    startDate: "2024-02-01",
    status: "active",
  },
  {
    id: "3",
    name: "Lisinopril 10mg",
    system: "Allopathy",
    dosage: "10mg",
    frequency: "Once daily",
    time: "9:00 AM",
    withFood: true,
    startDate: "2024-01-20",
    status: "active",
  },
  {
    id: "4",
    name: "Ashwagandha",
    system: "Ayurveda",
    dosage: "500mg",
    frequency: "Once daily",
    time: "10:00 PM",
    withFood: true,
    startDate: "2024-03-01",
    status: "active",
  },
  {
    id: "5",
    name: "Vitamin D3",
    system: "Supplement",
    dosage: "60,000 IU",
    frequency: "Weekly",
    time: "Sunday 9:00 AM",
    withFood: true,
    startDate: "2024-02-15",
    status: "active",
  },
];

export const mockInteractions = [
  {
    id: "1",
    medicine1: "Metformin 500mg",
    medicine2: "Karela Juice",
    severity: "red",
    title: "Severe Hypoglycemia Risk",
    description:
      "High risk of extreme hypoglycemia. Karela (bitter gourd) has significant blood sugar-lowering effects that can compound Metformin's action, causing dangerously low blood sugar.",
    timing: "Do not take within 4 hours of each other",
    recommendation: "Consult your doctor before continuing this combination.",
  },
  {
    id: "2",
    medicine1: "Lisinopril 10mg",
    medicine2: "Ashwagandha",
    severity: "yellow",
    title: "Possible Blood Pressure Interference",
    description:
      "Ashwagandha may reduce blood pressure. When combined with Lisinopril, this can cause blood pressure to drop too low.",
    timing: "Take Ashwagandha in the evening, Lisinopril in the morning",
    recommendation: "Monitor blood pressure closely. Inform your physician.",
  },
  {
    id: "3",
    medicine1: "Metformin 500mg",
    medicine2: "Vitamin D3",
    severity: "green",
    title: "Safe Combination",
    description:
      "No known interaction between Metformin and Vitamin D3. This combination is generally considered safe.",
    timing: "No special timing required",
    recommendation: "Continue as prescribed.",
  },
];

export const mockReminders = [
  {
    id: "1",
    medicine: "Metformin 500mg",
    time: "08:00",
    period: "AM",
    status: "taken",
    withFood: true,
  },
  {
    id: "2",
    medicine: "Karela Juice",
    time: "07:00",
    period: "AM",
    status: "missed",
    withFood: false,
  },
  {
    id: "3",
    medicine: "Lisinopril 10mg",
    time: "09:00",
    period: "AM",
    status: "upcoming",
    withFood: true,
  },
  {
    id: "4",
    medicine: "Ashwagandha",
    time: "10:00",
    period: "PM",
    status: "upcoming",
    withFood: true,
  },
  {
    id: "5",
    medicine: "Metformin 500mg",
    time: "08:00",
    period: "PM",
    status: "upcoming",
    withFood: true,
  },
];

export const mockFamilyProfiles = [
  {
    id: "1",
    name: "Mother",
    age: 62,
    relation: "Mother",
    medicines: 5,
    riskLevel: "yellow",
    avatar: "M",
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "2",
    name: "Father",
    age: 65,
    relation: "Father",
    medicines: 8,
    riskLevel: "red",
    avatar: "F",
    color: "bg-blue-100 text-blue-600",
  },
  {
    id: "3",
    name: "Spouse",
    age: 38,
    relation: "Spouse",
    medicines: 2,
    riskLevel: "green",
    avatar: "S",
    color: "bg-pink-100 text-pink-600",
  },
  {
    id: "4",
    name: "Child",
    age: 10,
    relation: "Son",
    medicines: 1,
    riskLevel: "green",
    avatar: "C",
    color: "bg-orange-100 text-orange-600",
  },
];

export const mockDoctorShares = [
  {
    id: "1",
    doctor: "Dr. Priya Sharma",
    speciality: "Endocrinologist",
    sharedAt: "2024-03-20 10:30",
    expiresIn: "Expired",
    status: "expired",
  },
  {
    id: "2",
    doctor: "Dr. Anil Gupta",
    speciality: "Cardiologist",
    sharedAt: "2024-04-15 14:00",
    expiresIn: "2h 30m",
    status: "active",
  },
];

export const mockSafetyTrend = [
  { date: "Apr 21", score: 72 },
  { date: "Apr 22", score: 68 },
  { date: "Apr 23", score: 55 },
  { date: "Apr 24", score: 62 },
  { date: "Apr 25", score: 70 },
  { date: "Apr 26", score: 75 },
  { date: "Apr 27", score: 65 },
];

export const mockAdminUsers = [
  { id: "1", name: "Rahul Sharma", email: "rahul@gmail.com", role: "Patient", medicines: 5, status: "active", joined: "Jan 15, 2024" },
  { id: "2", name: "Dr. Priya Sharma", email: "priya@hospital.in", role: "Doctor", medicines: 0, status: "active", joined: "Feb 3, 2024" },
  { id: "3", name: "Anita Patel", email: "anita@gmail.com", role: "Caregiver", medicines: 8, status: "active", joined: "Mar 12, 2024" },
  { id: "4", name: "Suresh Kumar", email: "suresh@gmail.com", role: "Patient", medicines: 3, status: "inactive", joined: "Apr 1, 2024" },
  { id: "5", name: "Meera Joshi", email: "meera@clinic.in", role: "Doctor", medicines: 0, status: "active", joined: "Apr 20, 2024" },
];

export const mockAdminMedicines = [
  { id: "1", name: "Metformin", category: "Allopathy", interactions: 14, risk: "high", verified: true },
  { id: "2", name: "Karela (Bitter Gourd)", category: "Ayurveda", interactions: 8, risk: "medium", verified: true },
  { id: "3", name: "Ashwagandha", category: "Ayurveda", interactions: 6, risk: "low", verified: true },
  { id: "4", name: "Lisinopril", category: "Allopathy", interactions: 22, risk: "high", verified: true },
  { id: "5", name: "Tulsi Extract", category: "Herbal", interactions: 3, risk: "low", verified: false },
];

export const mockAnalytics = [
  { month: "Jan", checks: 4200, alerts: 890 },
  { month: "Feb", checks: 5100, alerts: 1020 },
  { month: "Mar", checks: 6300, alerts: 1150 },
  { month: "Apr", checks: 7800, alerts: 1400 },
];
