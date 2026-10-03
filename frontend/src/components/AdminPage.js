import React, { useEffect, useState } from 'react';
import fallbackData from '../data';

const API_BASE = process.env.REACT_APP_API_URL
  || (process.env.NODE_ENV === 'development' ? 'http://localhost:5001' : '');

const initialGallery = [
  { id: 1, title: 'Studio Frame', category: 'Photography', image: '/gallery/IMG_0538.JPG', description: '' },
  { id: 2, title: 'Portrait Study', category: 'Portrait', image: '/gallery/IMG_3364.JPG', description: '' },
  { id: 3, title: 'Candid Moment', category: 'Lifestyle', image: '/gallery/IMG_5574.JPG', description: '' },
  { id: 4, title: 'Event Detail', category: 'Event', image: '/gallery/IMG_5881.JPG', description: '' },
  { id: 5, title: 'Night Walk', category: 'Street', image: '/gallery/1726854847155.JPG', description: '' }
];

const parseEditableJson = (text) => {
  // Permit a common editing mistake: trailing commas before ] or }.
  const withoutTrailingCommas = text.replace(/,\s*([}\]])/g, '$1');
  return JSON.parse(withoutTrailingCommas);
};

function JsonEditor({ title, description, value, onChange, onApplied, minHeight = 'min-h-48' }) {
  const [draft, setDraft] = useState(JSON.stringify(value || [], null, 2));
  const [error, setError] = useState('');

  useEffect(() => {
    setDraft(JSON.stringify(value || [], null, 2));
  }, [value]);

  const apply = () => {
    try {
      const next = parseEditableJson(draft);
      if (!Array.isArray(next)) throw new Error('Value must be a JSON array.');
      onChange(next);
      setDraft(JSON.stringify(next, null, 2));
      setError('');
      onApplied(`${title} changes applied. Click Save changes to publish them.`);
    } catch (parseError) {
      setError(parseError.message || 'Enter valid JSON before applying.');
    }
  };

  return (
    <section className="bg-white p-6 rounded-2xl border">
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      {description && <p className="text-sm text-gray-500 mb-4">{description}</p>}
      <textarea
        value={draft}
        onChange={(event) => { setDraft(event.target.value); setError(''); }}
        className={`w-full ${minHeight} border p-3 font-mono text-sm`}
        spellCheck="false"
      />
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
      <div className="flex gap-2 mt-3">
        <button type="button" onClick={apply} className="bg-gray-900 text-white px-3 py-2 text-sm rounded">Apply changes</button>
        <button type="button" onClick={() => { setDraft(JSON.stringify(value || [], null, 2)); setError(''); }} className="border px-3 py-2 text-sm rounded">Reset</button>
      </div>
      <p className="text-xs text-gray-400 mt-2">Edit freely, click Apply changes, then click Save changes.</p>
    </section>
  );
}

function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState(null);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState('');
  const [achievementMeta, setAchievementMeta] = useState({ title: '', year: new Date().getFullYear(), achievementType: 'Certificate' });
  const [testimonialPersonId, setTestimonialPersonId] = useState('');
  const [projectPhotoId, setProjectPhotoId] = useState('');
  const [notice, setNotice] = useState('');

  const api = async (url, options = {}) => {
    const response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...(options.headers || {}) }
    });
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new Error('Admin API is unavailable. Start the backend server on port 5001.');
    }
    const result = await response.json();
    if (!response.ok) {
      const error = new Error(result.error || 'Request failed');
      error.status = response.status;
      throw error;
    }
    return result;
  };

  const login = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`${API_BASE}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new Error('Admin API is unavailable. Start the backend server on port 5001.');
      }
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      localStorage.setItem('adminToken', result.token);
      setToken(result.token);
      setStatus('Logged in.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const loadAdmin = async () => {
    try {
      const [saved, inbox, github] = await Promise.all([
        api('/api/admin/content'),
        api('/api/admin/messages'),
        fetch(`${API_BASE}/api/github/projects?refresh=${Date.now()}`).then((response) => response.ok ? response.json() : null)
      ]);
      const liveProjects = github?.projects || [];
      const savedProjects = saved.data.projects || [];
      const projects = liveProjects.length > 0
        ? liveProjects.map((project) => {
          const override = savedProjects.find((savedProject) =>
            (savedProject.github_url && savedProject.github_url === project.github_url)
            || (savedProject.link && savedProject.link === project.link)
          );
          return override ? { ...project, ...override, id: project.id } : project;
        })
        : savedProjects;
      setContent({
        ...fallbackData,
        ...saved.data,
        personal: saved.data.personal || {},
        achievements: saved.data.achievements || fallbackData.achievements,
        gallery: saved.data.gallery || initialGallery,
        resume: saved.data.resume || '/resume.pdf',
        education: saved.data.education || fallbackData.education,
        experience: saved.data.experience || fallbackData.experience,
        toolbox: saved.data.toolbox || fallbackData.toolbox,
        testimonials: saved.data.testimonials || fallbackData.testimonials,
        skills: saved.data.skills || fallbackData.skills,
        projects: projects.length > 0 ? projects : fallbackData.projects
      });
      setMessages(inbox.data || []);
    } catch (error) {
      if (error.status === 401) {
        localStorage.removeItem('adminToken');
        setToken('');
        setContent(null);
        setStatus('Your admin session expired. Please sign in again.');
        return;
      }
      setStatus(error.message);
    }
  };

  React.useEffect(() => {
    if (token) loadAdmin();
  }, [token]);

  const save = async () => {
    try {
      await api('/api/admin/content', { method: 'PUT', body: JSON.stringify(content) });
      setStatus('Changes saved.');
      setNotice('Changes saved successfully. The website will update shortly.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const deleteAchievement = async (id) => {
    try {
      const result = await api(`/api/admin/achievements/${encodeURIComponent(id)}`, { method: 'DELETE' });
      setContent((current) => ({ ...current, achievements: result.data.achievements || [] }));
      setStatus('Achievement deleted.');
    } catch (error) {
      setStatus(error.message);
    }
  };

  const upload = (type, event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const result = await api('/api/admin/upload', {
          method: 'POST',
          body: JSON.stringify({
            type,
            name: file.name,
            data: reader.result,
            personId: testimonialPersonId,
            projectId: projectPhotoId,
            ...achievementMeta
          })
        });
        setContent((current) => ({ ...current, ...result.data }));
        setStatus(`${file.name} uploaded.`);
      } catch (error) {
        setStatus(error.message);
      }
    };

    reader.readAsDataURL(file);
  };

  if (!token) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <form onSubmit={login} className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          <h1 className="text-2xl font-black text-gray-900 mb-2">Admin panel</h1>
          <p className="text-sm text-gray-500 mb-6">Sign in to manage your portfolio.</p>
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Admin password" className="w-full border p-3 mb-4" required />
          <button className="w-full bg-gray-900 text-white p-3 font-bold">Sign in</button>
          {status && <p className="text-sm text-red-600 mt-4">{status}</p>}
        </form>
      </main>
    );
  }

  if (!content) return <main className="p-8">Loading admin panel...</main>;

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black">Admin panel</h1>
          <button onClick={() => { localStorage.removeItem('adminToken'); setToken(''); }} className="border px-4 py-2">Log out</button>
        </div>
        {status && <p className="bg-green-50 text-green-700 p-3">{status}</p>}

        <section className="bg-white p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-4">Personal information</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {['name', 'title', 'location', 'email', 'phone', 'linkedin'].map((field) => (
              <input key={field} value={content.personal[field] || ''} onChange={(event) => setContent({ ...content, personal: { ...content.personal, [field]: event.target.value } })} placeholder={field} className="border p-3" />
            ))}
          </div>
          <label className="block mt-3">
            <span className="block text-sm font-semibold text-gray-700 mb-2">Homepage About text</span>
            <textarea
              value={content.personal.about || ''}
              onChange={(event) => setContent({ ...content, personal: { ...content.personal, about: event.target.value } })}
              placeholder="Write the paragraph shown on the homepage"
              className="border p-3 w-full min-h-28"
            />
          </label>
          <p className="text-xs text-gray-400 mt-2">Edit this paragraph, then click Save changes to update the homepage.</p>
        </section>

        <JsonEditor title="Education" description="Manage every education entry shown on the homepage." value={content.education} onChange={(education) => setContent({ ...content, education })} onApplied={setNotice} />
        <JsonEditor title="Experience" description="Manage companies, roles, periods, icons, and description bullet points." value={content.experience} onChange={(experience) => setContent({ ...content, experience })} onApplied={setNotice} minHeight="min-h-64" />
        <JsonEditor title="Tools I use" description="Manage toolbox items. Each item can include id, name, and image." value={content.toolbox} onChange={(toolbox) => setContent({ ...content, toolbox })} onApplied={setNotice} />
        <JsonEditor title="Skills" description="Manage skill categories and levels." value={content.skills} onChange={(skills) => setContent({ ...content, skills })} onApplied={setNotice} />
        <section className="bg-white p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-2">People I work with</h2>
          <p className="text-sm text-gray-500 mb-4">Choose a person and upload a photo. The photo replaces the emoji/avatar on the homepage.</p>
          <div className="flex flex-wrap gap-3 items-center">
            <select value={testimonialPersonId} onChange={(event) => setTestimonialPersonId(event.target.value)} className="border p-3">
              <option value="">Select person</option>
              {content.testimonials.map((person) => <option key={person.id} value={person.id}>{person.name}</option>)}
            </select>
            <label className={`border px-4 py-3 cursor-pointer ${!testimonialPersonId ? 'opacity-50 pointer-events-none' : ''}`}>
              Upload person photo
              <input type="file" accept="image/*" onChange={(event) => upload('testimonial', event)} className="hidden" disabled={!testimonialPersonId} />
            </label>
          </div>
        </section>
        <JsonEditor title="Edit people details" description="Manage testimonials, names, roles, quotes, and avatar values." value={content.testimonials} onChange={(testimonials) => setContent({ ...content, testimonials })} onApplied={setNotice} minHeight="min-h-64" />

        <section className="bg-white p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-4">Achievements</h2>
          <div className="grid md:grid-cols-3 gap-3 mb-4">
            <input value={achievementMeta.title} onChange={(event) => setAchievementMeta({ ...achievementMeta, title: event.target.value })} placeholder="Certificate or achievement title" className="border p-3" />
            <input value={achievementMeta.year} onChange={(event) => setAchievementMeta({ ...achievementMeta, year: event.target.value })} type="number" placeholder="Year" className="border p-3" />
            <select value={achievementMeta.achievementType} onChange={(event) => setAchievementMeta({ ...achievementMeta, achievementType: event.target.value })} className="border p-3">
              <option>Certificate</option>
              <option>Achievement</option>
              <option>Award</option>
            </select>
          </div>
          <label className="inline-block border px-4 py-2 cursor-pointer mb-4">Upload certificate or achievement photo<input type="file" accept="image/*,.pdf" onChange={(event) => upload('achievement', event)} className="hidden" /></label>
          <JsonEditor title="Edit achievement records" value={content.achievements} onChange={(achievements) => setContent({ ...content, achievements })} onApplied={setNotice} minHeight="min-h-40" />
          <div className="mt-4 space-y-2">
            {content.achievements.map((achievement) => (
              <div key={achievement.id} className="flex items-center justify-between border-b py-2 gap-3">
                <span className="text-sm">{achievement.title} ({achievement.year})</span>
                <button type="button" onClick={() => deleteAchievement(achievement.id)} className="text-sm text-red-600">Delete</button>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-4">Gallery uploads</h2>
          <label className="inline-block mt-4 border px-4 py-2 cursor-pointer">Upload gallery image<input type="file" accept="image/*" onChange={(event) => upload('gallery', event)} className="hidden" /></label>
        </section>

        <JsonEditor title="Edit gallery records" description="Add, delete, or replace gallery entries. Uploaded image paths are stored in the image field." value={content.gallery} onChange={(gallery) => setContent({ ...content, gallery })} onApplied={setNotice} minHeight="min-h-52" />

        <JsonEditor title="Projects" description="GitHub projects are loaded live. Edit only if you need to override details." value={content.projects} onChange={(projects) => setContent({ ...content, projects })} onApplied={setNotice} minHeight="min-h-72" />

        <section className="bg-white p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-2">Project photos</h2>
          <p className="text-sm text-gray-500 mb-4">Choose any project and upload a custom photo. It will stay attached when GitHub data refreshes.</p>
          <div className="flex flex-wrap gap-3 items-center">
            <select value={projectPhotoId} onChange={(event) => setProjectPhotoId(event.target.value)} className="border p-3">
              <option value="">Select project</option>
              {content.projects.map((project) => <option key={project.id} value={project.id}>{project.title || project.name}</option>)}
            </select>
            <label className={`border px-4 py-3 cursor-pointer ${!projectPhotoId ? 'opacity-50 pointer-events-none' : ''}`}>
              Upload project photo
              <input type="file" accept="image/*" onChange={(event) => upload('project', event)} className="hidden" disabled={!projectPhotoId} />
            </label>
          </div>
        </section>

        <section className="bg-white p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-4">Resume</h2>
          <p className="text-sm text-gray-500 mb-3">Current file: {content.resume}</p>
          <label className="inline-block border px-4 py-2 cursor-pointer">Replace resume PDF<input type="file" accept="application/pdf" onChange={(event) => upload('resume', event)} className="hidden" /></label>
        </section>

        <section className="bg-white p-6 rounded-2xl border">
          <h2 className="text-xl font-bold mb-4">Contact submissions ({messages.length})</h2>
          <div className="space-y-3">{messages.map((message) => <article key={message.id || message._id} className="border-b pb-3"><strong>{message.name}</strong> <span className="text-gray-500">{message.email}</span><p>{message.message}</p></article>)}</div>
        </section>

        <button onClick={save} className="fixed bottom-6 right-6 bg-orange-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">Save changes</button>
      </div>
      {notice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-gray-200">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xl mb-4">✓</div>
            <h2 className="text-xl font-black text-gray-900 mb-2">Update confirmed</h2>
            <p className="text-sm text-gray-600 leading-relaxed">{notice}</p>
            <button type="button" onClick={() => setNotice('')} className="mt-5 rounded-lg bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-orange-500">Continue</button>
          </div>
        </div>
      )}
    </main>
  );
}

export default AdminPage;
