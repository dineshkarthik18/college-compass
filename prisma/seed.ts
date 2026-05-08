import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const colleges = [
  {
    slug: "iit-delhi",
    name: "Indian Institute of Technology Delhi",
    city: "New Delhi",
    state: "Delhi",
    location: "New Delhi, Delhi",
    type: "Public",
    establishedYear: 1961,
    accreditation: "Institute of National Importance",
    overview:
      "IIT Delhi is a premier engineering and research institution known for strong technology programs, deep industry links, and an active innovation ecosystem.",
    fees: 220000,
    rating: 4.8,
    placementPercentage: 92,
    averagePackage: 25.8,
    highestPackage: 82,
    campusSize: "320 acres",
    website: "https://home.iitd.ac.in",
    courses: [
      ["B.Tech Computer Science and Engineering", "UG", "4 years", 230000, 120],
      ["B.Tech Electrical Engineering", "UG", "4 years", 225000, 110],
      ["M.Tech Artificial Intelligence", "PG", "2 years", 160000, 60]
    ],
    reviews: [
      ["Aarav Mehta", 4.9, "Excellent academic depth", "The peer group and faculty access make the workload worth it."],
      ["Nisha Rao", 4.7, "Placement support is strong", "Career services and alumni connects are very useful during final year."]
    ]
  },
  {
    slug: "bits-pilani",
    name: "BITS Pilani",
    city: "Pilani",
    state: "Rajasthan",
    location: "Pilani, Rajasthan",
    type: "Private",
    establishedYear: 1964,
    accreditation: "NAAC A",
    overview:
      "BITS Pilani offers flexible engineering, science, and management programs with a strong practice school model and entrepreneurial culture.",
    fees: 540000,
    rating: 4.6,
    placementPercentage: 89,
    averagePackage: 18.2,
    highestPackage: 60,
    campusSize: "328 acres",
    website: "https://www.bits-pilani.ac.in",
    courses: [
      ["B.E. Computer Science", "UG", "4 years", 560000, 170],
      ["B.E. Electronics and Instrumentation", "UG", "4 years", 545000, 120],
      ["MBA Business Analytics", "PG", "2 years", 480000, 70]
    ],
    reviews: [
      ["Kabir Shah", 4.6, "Great flexibility", "The no-attendance policy and electives help serious students move fast."],
      ["Ira Sen", 4.4, "Expensive but valuable", "Fees are high, but internships and placements offset the investment."]
    ]
  },
  {
    slug: "christ-university",
    name: "Christ University",
    city: "Bengaluru",
    state: "Karnataka",
    location: "Bengaluru, Karnataka",
    type: "Private",
    establishedYear: 1969,
    accreditation: "NAAC A+",
    overview:
      "Christ University is known for commerce, management, humanities, and technology programs with a structured campus life and urban industry exposure.",
    fees: 185000,
    rating: 4.3,
    placementPercentage: 78,
    averagePackage: 7.4,
    highestPackage: 22,
    campusSize: "25 acres",
    website: "https://christuniversity.in",
    courses: [
      ["BBA Finance and International Business", "UG", "3 years", 210000, 180],
      ["B.Com Honours", "UG", "3 years", 165000, 220],
      ["MCA", "PG", "2 years", 175000, 90]
    ],
    reviews: [
      ["Megha Iyer", 4.2, "Disciplined campus", "Good for students who want structure and regular academic momentum."],
      ["Rohan Das", 4.1, "Strong city exposure", "Bengaluru location helps with internships and networking."]
    ]
  },
  {
    slug: "srcc-delhi",
    name: "Shri Ram College of Commerce",
    city: "New Delhi",
    state: "Delhi",
    location: "New Delhi, Delhi",
    type: "Public",
    establishedYear: 1926,
    accreditation: "NAAC A++",
    overview:
      "SRCC is one of India's most selective commerce colleges, valued for finance, economics, society culture, and strong consulting outcomes.",
    fees: 45000,
    rating: 4.7,
    placementPercentage: 86,
    averagePackage: 13.5,
    highestPackage: 35,
    campusSize: "16 acres",
    website: "https://www.srcc.edu",
    courses: [
      ["B.Com Honours", "UG", "3 years", 47000, 500],
      ["B.A. Economics Honours", "UG", "3 years", 45000, 155],
      ["PG Diploma in Global Business Operations", "PG Diploma", "2 years", 160000, 90]
    ],
    reviews: [
      ["Ananya Gupta", 4.8, "Top commerce brand", "The college brand helps a lot for internships and placements."],
      ["Dev Malhotra", 4.6, "Competitive environment", "You need to be proactive, but the opportunities are excellent."]
    ]
  },
  {
    slug: "manipal-institute-of-technology",
    name: "Manipal Institute of Technology",
    city: "Manipal",
    state: "Karnataka",
    location: "Manipal, Karnataka",
    type: "Private",
    establishedYear: 1957,
    accreditation: "NAAC A++",
    overview:
      "MIT Manipal provides broad engineering choices, modern labs, a residential campus, and balanced outcomes across tech and core branches.",
    fees: 335000,
    rating: 4.2,
    placementPercentage: 81,
    averagePackage: 10.5,
    highestPackage: 44,
    campusSize: "188 acres",
    website: "https://manipal.edu/mit.html",
    courses: [
      ["B.Tech Computer Science", "UG", "4 years", 360000, 240],
      ["B.Tech Mechanical Engineering", "UG", "4 years", 310000, 180],
      ["M.Tech Data Science", "PG", "2 years", 250000, 45]
    ],
    reviews: [
      ["Sameer Nair", 4.3, "Balanced campus life", "Academics, clubs, and hostel life are all strong."],
      ["Tanya Bhat", 4.0, "Good private engineering option", "Placements are branch-dependent, so compare departments carefully."]
    ]
  },
  {
    slug: "symbiosis-institute-of-business-management-pune",
    name: "Symbiosis Institute of Business Management Pune",
    city: "Pune",
    state: "Maharashtra",
    location: "Pune, Maharashtra",
    type: "Private",
    establishedYear: 1978,
    accreditation: "NAAC A++",
    overview:
      "SIBM Pune is a leading private business school with strong MBA placements, case competitions, and access to recruiters across consulting, BFSI, and FMCG.",
    fees: 720000,
    rating: 4.4,
    placementPercentage: 93,
    averagePackage: 26.1,
    highestPackage: 49,
    campusSize: "300 acres",
    website: "https://www.sibm.edu",
    courses: [
      ["MBA", "PG", "2 years", 745000, 180],
      ["MBA Innovation and Entrepreneurship", "PG", "2 years", 650000, 60],
      ["Executive MBA", "PG", "30 months", 420000, 80]
    ],
    reviews: [
      ["Prisha Kapoor", 4.5, "Career-focused MBA", "The recruiter mix is impressive and the campus is intense in a good way."],
      ["Yash Kulkarni", 4.3, "Great peer network", "Group projects and committees create a strong professional network."]
    ]
  },
  {
    slug: "loyola-college-chennai",
    name: "Loyola College Chennai",
    city: "Chennai",
    state: "Tamil Nadu",
    location: "Chennai, Tamil Nadu",
    type: "Private Aided",
    establishedYear: 1925,
    accreditation: "NAAC A++",
    overview:
      "Loyola College is a reputed arts, science, and commerce institution with strong undergraduate programs and a respected alumni network.",
    fees: 68000,
    rating: 4.5,
    placementPercentage: 72,
    averagePackage: 5.8,
    highestPackage: 14,
    campusSize: "99 acres",
    website: "https://www.loyolacollege.edu",
    courses: [
      ["B.Sc Computer Science", "UG", "3 years", 76000, 100],
      ["B.Com General", "UG", "3 years", 62000, 180],
      ["M.A. Social Work", "PG", "2 years", 54000, 45]
    ],
    reviews: [
      ["Joel Fernandes", 4.5, "Strong reputation", "The college has a calm academic environment and respected faculty."],
      ["Sneha Krishnan", 4.4, "Good value", "Fees are reasonable compared with outcomes and brand value."]
    ]
  },
  {
    slug: "amity-university-noida",
    name: "Amity University Noida",
    city: "Noida",
    state: "Uttar Pradesh",
    location: "Noida, Uttar Pradesh",
    type: "Private",
    establishedYear: 2005,
    accreditation: "NAAC A+",
    overview:
      "Amity University Noida is a large multidisciplinary private university with many course options, modern infrastructure, and metro-city access.",
    fees: 290000,
    rating: 4.0,
    placementPercentage: 69,
    averagePackage: 6.2,
    highestPackage: 21,
    campusSize: "60 acres",
    website: "https://www.amity.edu",
    courses: [
      ["B.Tech Information Technology", "UG", "4 years", 315000, 180],
      ["BBA", "UG", "3 years", 265000, 260],
      ["M.Sc Biotechnology", "PG", "2 years", 190000, 60]
    ],
    reviews: [
      ["Arjun Walia", 4.0, "Many choices", "Good if you want course variety and city access."],
      ["Lavanya Singh", 3.9, "Infrastructure is a plus", "The campus facilities are polished, though outcomes depend on effort."]
    ]
  }
];

async function main() {
  const passwordHash = await bcrypt.hash("student123", 10);

  await prisma.user.upsert({
    where: { email: "demo@student.com" },
    update: {},
    create: {
      name: "Demo Student",
      email: "demo@student.com",
      passwordHash
    }
  });

  for (const item of colleges) {
    const { courses, reviews, ...college } = item;
    await prisma.college.upsert({
      where: { slug: college.slug },
      update: college,
      create: {
        ...college,
        courses: {
          create: courses.map(([name, level, duration, annualFee, seats]) => ({
            name: String(name),
            level: String(level),
            duration: String(duration),
            annualFee: Number(annualFee),
            seats: Number(seats)
          }))
        },
        reviews: {
          create: reviews.map(([author, rating, title, body]) => ({
            author: String(author),
            rating: Number(rating),
            title: String(title),
            body: String(body)
          }))
        }
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
