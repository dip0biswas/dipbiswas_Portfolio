const fallbackProjects = [
  {
    id: 1,
    title: 'Fika Bakery & Coffee Bar',
    company: 'Brand Identity, 2024',
    description: 'Warm identity exploration with a soft, premium visual direction.',
    tags: ['Brand Identity', 'Visual Design', 'Art Direction'],
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    goal: 'Build a warm and memorable identity that feels calm, approachable, and premium across every brand touchpoint.',
    results: 'The final identity system stayed consistent across menus, signage, packaging, and social previews while remaining easy to scale.',
    overview: 'A brand identity concept centered on handwritten personality, soft textures, and quiet visual balance for a modern coffee space.',
    detailImages: [
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&w=1200&q=80'
    ]
  },
  {
    id: 2,
    title: 'La Barbetta',
    company: 'Brand Identity, 2025',
    description: 'Editorial brand mood with dramatic contrast and motion.',
    tags: ['Brand Identity', 'Editorial', 'Visual System'],
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
    goal: 'Create a bold editorial identity with cinematic contrast, motion, and a refined luxury feeling.',
    results: 'The visual system translated well across large-format visuals, digital assets, and presentation mockups.',
    overview: 'A dramatic identity study that combines black-and-white imagery, light trails, and elegant typography.'
  },
  {
    id: 3,
    title: 'Farrow Studio',
    company: 'Web Design, 2024',
    description: 'Product-led landing page concept with a bright, modern feel.',
    tags: ['Web Design', 'UI Design', 'Prototype'],
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    goal: 'Design a bright, product-focused web experience that feels polished and easy to scan.',
    results: 'The concept balances promotional storytelling with strong imagery and clean spacing.',
    overview: 'A landing page exploration built around type hierarchy, bold photography, and modern editorial rhythm.'
  }
];

const fallbackData = {
  personal: {
    name: 'Dip Biswas',
    title: 'Engineer & Full Stack Developer',
    location: 'Raipur, India',
    email: 'biddo470@email.com',
    phone: '+880 170 7690 5536',
    linkedin: 'https://www.linkedin.com/in/dip-biswas-7b897a243/',
    about: "The most valuable lesson I've learned is the importance of smart work and focus. I aspire to be an Engineer and have developed a passion for AI/ML innovations."
  },
  education: [
    { id: 1, degree: 'Bachelor of Engineering in Information Technology', institution: 'Chandigarh University', period: 'Jan 2022 - Dec 2026', details: 'Pursuing (7.35 CGPA)' },
    { id: 2, degree: 'Class 12', institution: 'Kumarkhatri Govt. College, Kushia', period: 'Completed in 2022' }
  ],
  experience: [
    { id: 1, company: 'IEEE Computer Society', position: 'Graphic Designer & Webmaster', period: 'Jan 2023 - Dec 2024', description: ['Designed promotional materials and managed the chapter website.'] },
    { id: 2, company: 'UncleFAB', position: 'Web Developer', period: '2023 - 2025', description: ['Maintained responsive web pages and promotional content.'] },
    { id: 3, company: 'Biostack', position: 'UI/UX Designer', period: '2023 - 2024', description: ['Created wireframes, prototypes, and high-fidelity designs.'] }
  ],
  projects: fallbackProjects,
  achievements: [
    { id: 1, title: 'Got The IEEE Start Award', year: 2023 },
    { id: 2, title: '1st Position - Web Design Competition by Hack TechSociety', year: 2023 },
    { id: 3, title: '1st Position - Photography Competition by Photonics Society', year: 2023 }
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
    { id: 1, name: 'UX Anudeep', role: 'UX GYM Founder & Mentor', testimonial: 'Dip has an incredible attention to detail and consistently turns simple ideas into thoughtful, polished work.', avatar: '👤' },
    { id: 2, name: 'Priya Singh', role: 'Product Manager', testimonial: 'Working with Dip has been an absolute pleasure. His understanding of user needs is outstanding.', avatar: '👩' }
  ]
};

export default fallbackData;
