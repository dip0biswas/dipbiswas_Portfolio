import React, { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
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
import HomeHighlights from './components/HomeHighlights';
import AdminPanel from './components/AdminPanel';
import fallbackData from './data';
import { apiUrl } from './api';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView();
      });
      return;
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

function PortfolioApp() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');
  const [portfolioData, setPortfolioData] = useState(fallbackData);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const [portfolioResponse, projectsResponse] = await Promise.allSettled([
          fetch(apiUrl('/api/portfolio')),
          fetch(apiUrl(`/api/github/projects?refresh=${Date.now()}`))
        ]);
        const portfolio = portfolioResponse.status === 'fulfilled' && portfolioResponse.value.ok
          ? await portfolioResponse.value.json()
          : fallbackData;
        const projectsData = projectsResponse.status === 'fulfilled' && projectsResponse.value.ok
          ? await projectsResponse.value.json()
          : null;
        const githubProjects = projectsData?.projects || [];
        const savedProjects = portfolio.projects || [];
        const mergedProjects = portfolio.projectsManaged
          ? savedProjects
          : [
            ...githubProjects.map((project) => {
              const override = savedProjects.find((saved) =>
                (saved.github_url && saved.github_url === project.github_url)
                || (saved.link && saved.link === project.link)
              );
              return override ? { ...project, ...override, id: project.id } : project;
            }),
            ...savedProjects.filter((saved) => !githubProjects.some((project) =>
              (saved.github_url && saved.github_url === project.github_url)
              || (saved.link && saved.link === project.link)
            ))
          ];

        setPortfolioData({
          ...fallbackData,
          ...portfolio,
          personal: { ...fallbackData.personal, ...portfolio.personal },
          projects: projectsData?.success || portfolio.projectsManaged ? mergedProjects : savedProjects
        });
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
        setPortfolioData(fallbackData);
      } finally {
        setLoading(false);
      }
    };

    if (isAdminRoute) {
      setLoading(false);
      return undefined;
    }

    fetchPortfolioData();
    const refreshTimer = window.setInterval(fetchPortfolioData, 5000);

    return () => window.clearInterval(refreshTimer);
  }, [isAdminRoute]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className={`App${isAdminRoute ? ' App--admin' : ''}`} id="top">
      {!isAdminRoute && <Header />}
      <Routes>
        <Route path="/admin/*" element={<AdminPanel />} />
        <Route path="/" element={
          <>
            <Hero data={portfolioData?.personal} />
            <Education data={portfolioData?.education} />
            <Experience data={portfolioData?.experience} />
            <Toolbox />
            <PeopleWorked data={portfolioData?.testimonials} />
            <HomeHighlights
              personal={portfolioData?.personal}
              education={portfolioData?.education}
              toolbox={portfolioData?.toolbox}
              resume={portfolioData?.resume}
            />
          </>
        } />
        <Route path="/projects" element={<ProjectsPage data={portfolioData?.projects} />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage data={portfolioData?.projects} personal={portfolioData?.personal} />} />
        <Route path="/gallery" element={<Gallery data={portfolioData?.gallery} />} />
        <Route path="/resume" element={<ResumePage resume={portfolioData?.resume} />} />
        <Route path="/achievements" element={<Achievements data={portfolioData?.achievements} page />} />
        <Route path="/contact" element={<Contact data={portfolioData?.personal} />} />
      </Routes>
      {!isAdminRoute && <Footer personal={portfolioData?.personal} />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <PortfolioApp />
    </Router>
  );
}

export default App;
