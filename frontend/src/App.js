import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ProjectDetailPage from './components/ProjectDetailPage';
import Gallery from './components/Gallery';
import ResumePage from './components/ResumePage';
import Experience from './components/Experience';
import Education from './components/Education';
import Toolbox from './components/Toolbox';
import ProjectsPage from './components/ProjectsPage';
import PeopleWorked from './components/PeopleWorked';
import Achievements from './components/Achievements';
import Contact from './components/Contact';
import Footer from './components/Footer';
import fallbackData from './data';
import AdminPage from './components/AdminPage';

function App() {
  const [portfolioData, setPortfolioData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [portfolioResponse, projectsResponse] = await Promise.allSettled([
          fetch('/api/portfolio'),
          fetch(`/api/github/projects?refresh=${Date.now()}`)
        ]);
        const portfolio = portfolioResponse.status === 'fulfilled' && portfolioResponse.value.ok
          ? await portfolioResponse.value.json()
          : fallbackData;
        const projectsData = projectsResponse.status === 'fulfilled' && projectsResponse.value.ok
          ? await projectsResponse.value.json()
          : null;
        const githubProjects = projectsData?.projects || [];
        const savedProjects = portfolio.projects || [];
        const mergedProjects = githubProjects.map((project) => {
          const override = savedProjects.find((saved) =>
            (saved.github_url && saved.github_url === project.github_url)
            || (saved.link && saved.link === project.link)
          );
          return override ? { ...project, ...override, id: project.id } : project;
        });

        setPortfolioData({
          ...fallbackData,
          ...portfolio,
          personal: { ...fallbackData.personal, ...portfolio.personal },
          projects: projectsData?.success ? mergedProjects : savedProjects
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setPortfolioData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
    const refreshTimer = window.setInterval(fetchPortfolioData, 5000);

    return () => window.clearInterval(refreshTimer);
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Hero data={portfolioData?.personal} />
              <Education data={portfolioData?.education} />
              <Experience data={portfolioData?.experience} />
              <Toolbox data={portfolioData?.toolbox} />
              <PeopleWorked data={portfolioData?.testimonials} />
              <Contact data={portfolioData?.personal} />
            </>
          } />
          <Route path="/projects" element={<ProjectsPage data={portfolioData?.projects} />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage data={portfolioData?.projects} />} />
          <Route path="/gallery" element={<Gallery data={portfolioData?.gallery} />} />
          <Route path="/resume" element={<ResumePage resume={portfolioData?.resume} />} />
          <Route path="/achievements" element={<Achievements data={portfolioData?.achievements} page />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/contact" element={<Contact data={portfolioData?.personal} />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
