const fallbackData = {
  personal: {
    name: 'DIP BISWAS',
    title: 'Information Technology Graduate',
    role: 'Web Developer • UI/UX Designer',
    location: 'Rajbari, Bangladesh',
    email: 'bddip470@gmail.com',
    phone: '+880 1707690536',
    linkedin: 'https://www.linkedin.com/in/dip-biswas-7b897a243/',
    website: 'https://dipbiswas.netlify.app',
    about: 'Information Technology graduate (B.E., 2026) with hands-on experience in web development, UI/UX design, and graphic design. Builds responsive web applications with React, Next.js, and Node.js, and enjoys creating simple, user-friendly digital solutions. Fast learner who adapts quickly, works well in teams, and welcomes new challenges. Seeking an entry-level role to apply my skills, gain real-world experience, and grow professionally.'
  },
  education: [
    {
      id: 1,
      degree: 'Bachelor of Engineering in Information Technology',
      institution: 'Chandigarh University',
      period: 'Completed 2026',
      details: 'Mohali, Punjab, India'
    },
    {
      id: 2,
      degree: 'Higher Secondary (Class 12)',
      institution: 'Kumarkhali Govt. College, Kushtia',
      period: 'Completed 2021',
      details: 'Kushtia, Bangladesh'
    }
  ],
  experience: [
    {
      id: 1,
      company: 'UnceFab',
      position: 'Web Developer',
      period: 'Feb 2024 – Nov 2025',
      description: [
        'Updated and maintained the UnceFab website, including content, product listings, and promotional materials.',
        'Collaborated with the design team to build responsive, mobile-friendly web pages aligned with the brand’s aesthetics.'
      ]
    },
    {
      id: 2,
      company: 'IEEE Computer Society',
      position: 'Graphic Designer & Webmaster',
      period: 'Jan 2023 – Dec 2024',
      description: [
        'Managed and updated the chapter’s website, posting events and relevant content on time.',
        'Designed promotional materials (posters, social media graphics) to support events and branding.',
        'Worked with the marketing team to deliver visually cohesive content on a consistent schedule.'
      ]
    }
  ],
  projects: [
    {
      id: 1,
      title: 'BloodGroup Finder',
      company: 'Healthcare Project',
      description: 'Developed a system to identify and determine blood groups for medical use.',
      tags: ['Healthcare', 'Medical Tech', 'System Design'],
      year: '2025',
      goal: 'Support safe blood donation and emergency blood transfusion management.',
      results: 'Built a dependable solution for medical identification and emergency support workflows.',
      overview: 'A practical healthcare system focused on fast and accurate blood group detection for medical use cases.'
    },
    {
      id: 2,
      title: 'Travel Management System',
      company: 'Booking Platform',
      description: 'Developed a single platform for booking buses, trains, hotels, and flights.',
      tags: ['Travel', 'Booking', 'Web App'],
      year: '2025',
      goal: 'Create a unified travel booking system with reservation management and scheduling.',
      results: 'Streamlined booking workflows and integrated secure payment processing.',
      overview: 'A full-stack travel app designed to simplify trip planning and reservation management across key travel services.'
    },
    {
      id: 3,
      title: 'Restaurant QR Order System',
      company: 'Food Tech Project',
      description: 'Developed a QR-based ordering system that lets customers view menus and place orders from their smartphones.',
      tags: ['QR Ordering', 'UX', 'Restaurant Tech'],
      year: '2025',
      goal: 'Improve ordering speed and reduce manual errors in restaurant service.',
      results: 'Enabled real-time order management and faster service for customers and staff.',
      overview: 'A digital ordering solution built to improve the restaurant experience through contactless menu browsing and order updates.'
    },
    {
      id: 4,
      title: 'Face Recognition System',
      company: 'Security & AI Project',
      description: 'Developed a system to identify and verify users using image processing techniques.',
      tags: ['Computer Vision', 'AI', 'Security'],
      year: '2025',
      goal: 'Implement real-time face detection and authentication for secure access workflows.',
      results: 'Improved security and authentication accuracy with reliable real-time identification.',
      overview: 'An AI-driven face verification system focused on authentication accuracy, speed, and practical security use cases.'
    }
  ],
  achievements: [
    { id: 1, title: 'IEEE Start Award', year: 2023, type: 'Award' },
    { id: 2, title: '1st Position - Web Design Competition, Hack TechSociety', year: 2024, type: 'Achievement' },
    { id: 3, title: '1st Position - Photography Competition, Photonics Society, Chandigarh University', year: 2025, type: 'Achievement' },
    { id: 4, title: 'React Native', year: 2026, type: 'Certificate', image: '/achievements/Coursera React Native.pdf' },
    { id: 5, title: '5G Mobile Networks', year: 2026, type: 'Certificate', image: '/achievements/Coursera  5G Mobile Networks.pdf' },
    { id: 6, title: 'Theory of Angular Momentum', year: 2026, type: 'Certificate', image: '/achievements/Coursera Theory of Angular Momentum.pdf' },
    { id: 7, title: 'Wireless Communications for Everybody', year: 2026, type: 'Certificate', image: '/achievements/Coursera Wireless Communications for Everybody.pdf' },
    { id: 8, title: 'Industrial IoT Markets and Security', year: 2026, type: 'Certificate', image: '/achievements/Coursera Industrial IoT Markets and Security.pdf' },
    { id: 9, title: 'Machine Learning Introduction for Everyone', year: 2026, type: 'Certificate', image: '/achievements/Coursera Machine Learning Introduction for Everyone.pdf' }
  ],
  toolbox: [
    { id: 1, name: 'Figma', image: '/Figma.png' },
    { id: 2, name: 'VS Code', image: '/VSCode.png' },
    { id: 3, name: 'ChatGPT', image: '/Chatgpt.png' },
    { id: 4, name: 'Photoshop', image: '/Photoshop.png' },
    { id: 5, name: 'Canva', image: '/Canva.png' },
    { id: 6, name: 'IntelliJ', image: '/IntelliJ_IDEA.png' },
    { id: 7, name: 'MongoDB', image: '/MongoDB.png' }
  ],
  testimonials: [
    { id: 1, name: 'Avisekh Golder', role: 'Asst. Engineer', testimonial: 'Dip has an incredible attention to detail and consistently turns simple ideas into thoughtful, polished work.', avatar: '👤' },
    { id: 2, name: 'Nitish Kumar', role: 'Founder And Mentor', testimonial: 'Working with Dip has been an absolute pleasure. His understanding of user needs is outstanding.', avatar: '👩' },
    { id: 3, name: 'Jatin gautam', role: 'UI/UX Designer', testimonial: 'Working with Dip has been an absolute pleasure. His understanding of user needs is outstanding.', avatar: '👩' }
  ]
};

export default fallbackData;
