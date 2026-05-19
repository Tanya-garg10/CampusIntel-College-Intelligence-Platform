// Mock Database utility using localStorage to run 100% locally with zero setup!

const DEFAULT_POSTS = [
  {
    _id: "post_1",
    title: "TCS National Qualifier Test (NQT) 2026 - Registration Open",
    description: "TCS NQT registration is officially open for 2026 batch candidates. Eligible branches: CSE, IT, ECE, EE with no active backlogs and minimum 60% throughout 10th, 12th, and Graduation. The test will evaluate Cognitive Skills and Coding Abilities (C/C++, Java, Python). Last date to apply is October 15, 2026. Hall tickets will be issued by Oct 18.",
    category: "placement",
    urgency: "high",
    college: "State Engineering College",
    branch: "Computer Science",
    trustScore: 12,
    anonymous: false,
    createdBy: "user_rahul",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString() // 2 hours ago
  },
  {
    _id: "post_2",
    title: "Google Generation Scholarship (APAC) 2026",
    description: "Google is offering the Generation Scholarship for women in computer science. Selected students will receive an award of $2,500 USD to fund their tuition, books, and study resources. Eligibility: Must be currently enrolled as a 2nd-year student in a Bachelor’s program, majoring in CS/IT. Deadline is November 5, 2026.",
    category: "scholarships",
    urgency: "high",
    college: "National Institute of Technology",
    branch: "Information Technology",
    trustScore: 24,
    anonymous: false,
    createdBy: "user_sneha",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString() // 5 hours ago
  },
  {
    _id: "post_3",
    title: "DBMS Mid-Sem Viva & Theory Strategy Guides",
    description: "Here is the leaked internal strategy for the upcoming DBMS Mid-Sem Exams. Dr. Sharma's viva questions are heavily focused on Normalization (specifically 3NF and BCNF differences), ACID properties, and writing complex Joins in SQL. Focus on Chapter 4 ER-diagram mappings as they carry 15 marks.",
    category: "academics",
    urgency: "medium",
    college: "State Engineering College",
    branch: "Computer Science",
    trustScore: 8,
    anonymous: true,
    createdBy: "user_anonymous",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString() // 12 hours ago
  },
  {
    _id: "post_4",
    title: "GDSC Android Development Study Jam - Kickoff",
    description: "Google Developer Student Clubs (GDSC) is launching the official Android Development Study Jam. We will cover Kotlin fundamentals, Jetpack Compose layouts, and how to build responsive mobile apps from scratch. Open for all branches and years. Bring your laptop and pre-installed Android Studio. Certificates will be provided.",
    category: "clubs",
    urgency: "low",
    college: "State Engineering College",
    branch: "Electronics",
    trustScore: 4,
    anonymous: false,
    createdBy: "user_vikram",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString() // 1 day ago
  }
];

export const getMockPosts = () => {
  const posts = localStorage.getItem('mock_posts');
  if (!posts) {
    localStorage.setItem('mock_posts', JSON.stringify(DEFAULT_POSTS));
    return DEFAULT_POSTS;
  }
  return JSON.parse(posts);
};

export const addMockPost = (postData) => {
  const posts = getMockPosts();
  const newPost = {
    _id: "post_" + Math.random().toString(36).substr(2, 9),
    ...postData,
    trustScore: 0,
    createdAt: new Date().toISOString()
  };
  posts.unshift(newPost);
  localStorage.setItem('mock_posts', JSON.stringify(posts));
  
  // Dispatch event for real-time HMR behavior
  window.dispatchEvent(new Event('mockPostsUpdated'));
  return newPost;
};

export const upvoteMockPost = (postId) => {
  const posts = getMockPosts();
  const index = posts.findIndex(p => p._id === postId);
  if (index !== -1) {
    posts[index].trustScore += 1;
    localStorage.setItem('mock_posts', JSON.stringify(posts));
    window.dispatchEvent(new Event('mockPostsUpdated'));
    return posts[index].trustScore;
  }
  return 0;
};
