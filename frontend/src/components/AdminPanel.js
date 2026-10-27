import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { apiUrl } from '../api';
import './AdminPanel.css';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};
const firebaseConfigured = Object.values(firebaseConfig).every(Boolean);
let firebaseAuth = null;
let firebaseInitializationError = '';
if (firebaseConfigured) {
  try {
    const app = getApps().find((item) => item.name === '[DEFAULT]') || initializeApp(firebaseConfig);
    firebaseAuth = getAuth(app);
  } catch (error) {
    firebaseInitializationError = error.message;
  }
}

const adminEmail = 'bdip470@gmail.com';
const sections = [
  { id: 'dashboard', label: 'Dashboard', icon: '◫' },
  { id: 'projects', label: 'Projects', icon: '▧' },
  { id: 'gallery', label: 'Gallery', icon: '▦' },
  { id: 'messages', label: 'Inquiries', icon: '✉' },
  { id: 'achievements', label: 'Achievements', icon: '✧' },
  { id: 'settings', label: 'Settings', icon: '⚙' }
];
const arraySections = ['projects', 'gallery', 'achievements'];

async function requestJson(user, url, options = {}) {
  const token = await user.getIdToken();
  const response = await fetch(apiUrl(url), {
    ...options,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      Authorization: `Bearer ${token}`,
      ...options.headers
    }
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(result.error || `Request failed (${response.status}).`);
  }
  return result;
}

function mergeInitialProjects(githubProjects, savedProjects = []) {
  return [
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
}

function LoginScreen({ error, onLogin }) {
  const [email, setEmail] = useState(adminEmail);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setFormError('');
    setFormNotice('');
    try {
      await onLogin(email.trim(), password);
    } catch (loginError) {
      setFormError(loginError.message);
    } finally {
      setBusy(false);
    }
  };

  const resetPassword = async () => {
    setBusy(true);
    setFormError('');
    setFormNotice('');
    try {
      if (!firebaseAuth) throw new Error('Firebase is not configured.');
      await sendPasswordResetEmail(firebaseAuth, email.trim());
      setFormNotice(`Password reset instructions were sent to ${email.trim()}.`);
    } catch (resetError) {
      setFormError(resetError.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <div className="admin-brand-mark">D<span>.</span></div>
        <p className="admin-eyebrow">PORTFOLIO MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="admin-muted">Sign in with the authorized administrator account.</p>
        {error && <div className="admin-alert" role="alert">{error}</div>}
        {!firebaseConfigured && (
          <div className="admin-alert" role="alert">
            Firebase sign-in is not configured yet. Add the public Firebase settings to
            <code> frontend/.env </code> and restart the frontend.
          </div>
        )}
        {firebaseInitializationError && <div className="admin-alert" role="alert">{firebaseInitializationError}</div>}
        <form onSubmit={submit} className="admin-login-form">
          <label>
            Email address
            <input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </label>
          {formError && <p className="admin-form-error" role="alert">{formError}</p>}
          {formNotice && <p className="admin-form-notice" role="status">{formNotice}</p>}
          <button className="admin-primary-button admin-login-button" disabled={busy || !firebaseAuth}>
            {busy ? 'Signing in…' : 'Sign in securely'}
          </button>
          <button type="button" className="admin-reset-button" onClick={resetPassword} disabled={busy || !firebaseAuth}>
            Forgot your password?
          </button>
        </form>
        <div className="admin-login-footnote">Access is limited to verified administrator accounts.</div>
      </div>
      <div className="admin-login-aside">
        <span className="admin-aside-orb admin-aside-orb-one" />
        <span className="admin-aside-orb admin-aside-orb-two" />
        <div className="admin-aside-content">
          <p>YOUR DIGITAL SPACE</p>
          <h2>Good work deserves a great showcase.</h2>
          <span>Manage your projects, stories, and messages in one place.</span>
        </div>
      </div>
    </main>
  );
}

function AdminPanel() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [authError, setAuthError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [portfolio, setPortfolio] = useState(null);
  const [messages, setMessages] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [editor, setEditor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const loadData = useCallback(async (activeUser) => {
    setDataLoading(true);
    setError('');
    try {
      const [portfolioResponse, messageResponse] = await Promise.all([
        requestJson(activeUser, '/api/admin/portfolio'),
        requestJson(activeUser, '/api/admin/messages')
      ]);
      let content = portfolioResponse;
      if (!content.projectsManaged) {
        try {
          const githubResponse = await fetch(apiUrl('/api/github/projects'));
          if (githubResponse.ok) {
            const githubData = await githubResponse.json();
            if (githubData.success) {
              content = { ...content, projects: mergeInitialProjects(githubData.projects || [], content.projects || []) };
            }
          }
        } catch (projectError) {
          console.error('Could not load GitHub projects for the admin list:', projectError);
        }
      }
      setPortfolio(content);
      setMessages(messageResponse.messages || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!firebaseAuth) {
      setAuthLoading(false);
      return undefined;
    }
    return onAuthStateChanged(firebaseAuth, async (nextUser) => {
      setAuthLoading(true);
      setAuthError('');
      setUser(nextUser);
      setAuthorized(false);
      if (!nextUser) {
        setAuthLoading(false);
        return;
      }
      if (!nextUser.emailVerified) {
        try {
          await sendEmailVerification(nextUser);
        } catch (verificationError) {
          console.error('Could not send Firebase email verification:', verificationError);
        }
        setAuthError('Verify your email address using the link we sent, then sign in again.');
        await signOut(firebaseAuth);
        setAuthLoading(false);
        return;
      }
      try {
        await requestJson(nextUser, '/api/admin/session');
        setAuthorized(true);
        await loadData(nextUser);
      } catch (sessionError) {
        setAuthError(sessionError.message);
      } finally {
        setAuthLoading(false);
      }
    });
  }, [loadData]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeout = window.setTimeout(() => setNotice(''), 3500);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  const savePortfolio = useCallback(async (updates, successMessage) => {
    if (!user) return;
    setSaving(true);
    setError('');
    try {
      const result = await requestJson(user, '/api/admin/portfolio', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
      setPortfolio((current) => ({
        ...current,
        ...result.portfolio,
        personal: { ...current.personal, ...result.portfolio.personal }
      }));
      setNotice(successMessage);
    } catch (saveError) {
      setError(saveError.message);
      throw saveError;
    } finally {
      setSaving(false);
    }
  }, [user]);

  const uploadFile = useCallback(async (kind, file) => {
    const token = await user.getIdToken();
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(apiUrl(`/api/admin/uploads/${kind}`), {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || `Upload failed (${response.status}).`);
    return result.url;
  }, [user]);

  const saveItem = async (itemType, item) => {
    const items = portfolio?.[itemType] || [];
    const nextItems = editor?.item
      ? items.map((existing) => String(existing.id) === String(item.id) ? item : existing)
      : [...items, { ...item, id: `${Date.now()}` }];
    await savePortfolio({ [itemType]: nextItems }, `${editor?.item ? 'Changes' : 'New item'} saved.`);
    setEditor(null);
  };

  const deleteItem = async (itemType, item) => {
    if (!window.confirm(`Delete “${item.title || 'this item'}” from ${itemType}?`)) return;
    const nextItems = (portfolio?.[itemType] || []).filter((entry) => String(entry.id) !== String(item.id));
    try {
      await savePortfolio({ [itemType]: nextItems }, 'Item deleted.');
    } catch (saveError) {
      console.error('Could not delete portfolio item:', saveError);
    }
  };

  const updateMessage = async (message, updates) => {
    if (!user) return;
    try {
      if (updates.delete) {
        if (!window.confirm('Permanently delete this inquiry?')) return;
        await requestJson(user, `/api/admin/messages/${encodeURIComponent(message._id || message.id)}`, { method: 'DELETE' });
        setMessages((current) => current.filter((item) => String(item._id || item.id) !== String(message._id || message.id)));
        setNotice('Inquiry deleted.');
        return;
      }
      const result = await requestJson(user, `/api/admin/messages/${encodeURIComponent(message._id || message.id)}`, {
        method: 'PATCH',
        body: JSON.stringify({ isRead: updates.isRead })
      });
      setMessages((current) => current.map((item) =>
        String(item._id || item.id) === String(message._id || message.id) ? result.message : item
      ));
      setNotice(updates.isRead ? 'Inquiry marked as read.' : 'Inquiry marked as unread.');
    } catch (messageError) {
      setError(messageError.message);
    }
  };

  const filteredItems = useMemo(() => {
    if (!arraySections.includes(activeSection)) return [];
    const query = search.trim().toLowerCase();
    const items = portfolio?.[activeSection] || [];
    return query
      ? items.filter((item) => `${item.title || ''} ${item.description || ''} ${item.category || ''}`.toLowerCase().includes(query))
      : items;
  }, [activeSection, portfolio, search]);
  const unreadCount = messages.filter((message) => !message.isRead).length;

  if (authLoading) {
    return <div className="admin-loading"><span className="admin-spinner" /> Verifying secure access…</div>;
  }
  if (!user || !authorized) {
    return (
      <LoginScreen
        error={authError}
        onLogin={async (email, password) => {
          if (!firebaseAuth) throw new Error('Firebase is not configured.');
          await signInWithEmailAndPassword(firebaseAuth, email, password);
        }}
      />
    );
  }

  const openEditor = (itemType, item = null) => {
    setEditor({ itemType, item });
  };
  const logout = async () => {
    await signOut(firebaseAuth);
    setPortfolio(null);
    setMessages([]);
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <a className="admin-sidebar-brand" href="/">D<span>.</span><small>STUDIO</small></a>
        <p className="admin-sidebar-label">WORKSPACE</p>
        <nav className="admin-side-nav" aria-label="Admin navigation">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`admin-nav-item${activeSection === section.id ? ' is-active' : ''}`}
              onClick={() => { setActiveSection(section.id); setSearch(''); }}
            >
              <span className="admin-nav-icon">{section.icon}</span>
              <span>{section.label}</span>
              {section.id === 'messages' && unreadCount > 0 && <span className="admin-nav-badge">{unreadCount}</span>}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-bottom">
          <span className="admin-avatar">{(user.email || 'A').slice(0, 1).toUpperCase()}</span>
          <div className="admin-user-info"><strong>{user.displayName || 'Administrator'}</strong><span>{user.email}</span></div>
          <button className="admin-logout-button" onClick={logout} aria-label="Sign out" title="Sign out">↪</button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <div><span>Workspace</span><b>/</b><strong>{sections.find((item) => item.id === activeSection)?.label}</strong></div>
          <div className="admin-topbar-actions">
            <a href="/" target="_blank" rel="noreferrer" className="admin-view-site">View website <span>↗</span></a>
            <span className="admin-topbar-avatar">{(user.email || 'A').slice(0, 1).toUpperCase()}</span>
          </div>
        </header>

        <div className="admin-content">
          {notice && <div className="admin-toast" role="status">{notice}</div>}
          {error && <div className="admin-alert admin-page-alert" role="alert"><span>{error}</span><button onClick={() => setError('')} aria-label="Dismiss">×</button></div>}
          {dataLoading && <div className="admin-data-loading"><span className="admin-spinner" /> Refreshing your content…</div>}
          {activeSection === 'dashboard' && (
            <Dashboard portfolio={portfolio} messages={messages} unreadCount={unreadCount} setSection={setActiveSection} />
          )}
          {arraySections.includes(activeSection) && (
            <ContentManager
              type={activeSection}
              items={filteredItems}
              totalCount={(portfolio?.[activeSection] || []).length}
              search={search}
              setSearch={setSearch}
              onAdd={() => openEditor(activeSection)}
              onEdit={(item) => openEditor(activeSection, item)}
              onDelete={(item) => deleteItem(activeSection, item)}
            />
          )}
          {activeSection === 'messages' && (
            <InquiryManager messages={messages} onUpdate={updateMessage} />
          )}
          {activeSection === 'settings' && (
            <SettingsManager
              personal={portfolio?.personal || {}}
              resume={portfolio?.resume || '/resume.pdf'}
              onSave={(updates) => savePortfolio(updates, 'Profile settings updated.')}
              uploadFile={uploadFile}
              saving={saving}
            />
          )}
        </div>
      </main>
      {editor && (
        <ItemEditor
          key={`${editor.itemType}-${editor.item?.id || 'new'}`}
          type={editor.itemType}
          item={editor.item}
          uploadFile={uploadFile}
          saving={saving}
          onClose={() => setEditor(null)}
          onSave={(item) => saveItem(editor.itemType, item)}
        />
      )}
    </div>
  );
}

function Dashboard({ portfolio, messages, unreadCount, setSection }) {
  const stats = [
    { title: 'Projects', value: portfolio?.projects?.length || 0, icon: '▧', color: 'violet', section: 'projects' },
    { title: 'Gallery items', value: portfolio?.gallery?.length || 0, icon: '▦', color: 'blue', section: 'gallery' },
    { title: 'New inquiries', value: unreadCount, icon: '✉', color: 'amber', section: 'messages' },
    { title: 'Achievements', value: portfolio?.achievements?.length || 0, icon: '✧', color: 'green', section: 'achievements' }
  ];
  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">OVERVIEW</p><h1>Good to see you, Dip <span>✦</span></h1><p>Here’s what’s happening across your portfolio today.</p></div>
        <a className="admin-secondary-button" href="/" target="_blank" rel="noreferrer">Open portfolio <span>↗</span></a>
      </div>
      <div className="admin-stat-grid">
        {stats.map((stat) => (
          <button className="admin-stat-card" key={stat.title} onClick={() => setSection(stat.section)}>
            <span className={`admin-stat-icon ${stat.color}`}>{stat.icon}</span>
            <span className="admin-stat-title">{stat.title}</span>
            <strong>{stat.value}</strong>
            <span className="admin-stat-caption">Manage {stat.title.toLowerCase()} <b>→</b></span>
          </button>
        ))}
      </div>
      <section className="admin-panel-card admin-recent-panel">
        <div className="admin-panel-heading">
          <div><h2>Recent inquiries</h2><p>Messages from your website contact form</p></div>
          <button className="admin-text-button" onClick={() => setSection('messages')}>View inbox <span>→</span></button>
        </div>
        {messages.length === 0 ? (
          <div className="admin-empty-inline"><span>✉</span><p>No inquiries yet. Messages submitted through your contact page will appear here.</p></div>
        ) : (
          <div className="admin-recent-list">
            {messages.slice(0, 4).map((message) => (
              <div className="admin-recent-message" key={message._id || message.id}>
                <span className="admin-message-avatar">{(message.name || '?').slice(0, 1).toUpperCase()}</span>
                <div><strong>{message.name}</strong><span>{message.email}</span></div>
                <p>{message.message}</p>
                {!message.isRead && <i>New</i>}
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="admin-quick-panel">
        <div><span className="admin-quick-icon">✦</span><div><strong>Your portfolio updates live</strong><p>Saved content appears on your public website automatically, usually within a few seconds.</p></div></div>
        <a href="/" target="_blank" rel="noreferrer">Preview site ↗</a>
      </section>
    </>
  );
}

const managerCopy = {
  projects: { eyebrow: 'SHOWCASE', title: 'Projects', description: 'Manage the work and projects featured on your portfolio.', add: 'Add project', empty: 'No projects found. Add a project to get started.' },
  gallery: { eyebrow: 'VISUALS', title: 'Gallery', description: 'Curate the images and moments shown in your gallery.', add: 'Add image', empty: 'No gallery items found. Add an image to get started.' },
  achievements: { eyebrow: 'MILESTONES', title: 'Achievements', description: 'Share awards, certificates, and important milestones.', add: 'Add achievement', empty: 'No achievements found. Add one to get started.' }
};

function ContentManager({ type, items, totalCount, search, setSearch, onAdd, onEdit, onDelete }) {
  const copy = managerCopy[type];
  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">{copy.eyebrow}</p><h1>{copy.title}</h1><p>{copy.description}</p></div>
        <button className="admin-primary-button" onClick={onAdd}><span>＋</span> {copy.add}</button>
      </div>
      <section className="admin-panel-card">
        <div className="admin-list-toolbar">
          <div className="admin-item-count"><strong>{totalCount}</strong> {totalCount === 1 ? 'item' : 'items'}</div>
          <label className="admin-search"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${copy.title.toLowerCase()}…`} /></label>
        </div>
        {items.length === 0 ? (
          <div className="admin-empty-state"><span>{type === 'projects' ? '▧' : type === 'gallery' ? '▦' : '✧'}</span><h3>{copy.empty}</h3><button className="admin-secondary-button" onClick={onAdd}>{copy.add}</button></div>
        ) : (
          <div className={`admin-item-grid admin-item-grid-${type}`}>
            {items.map((item) => (
              <article className="admin-item-card" key={item.id ?? item.title}>
                <div className="admin-item-image">
                  {item.image && !item.image.toLowerCase().endsWith('.pdf')
                    ? <img src={apiUrl(item.image)} alt="" />
                    : <span className="admin-item-image-placeholder">{type === 'achievements' ? '✧' : '▧'}</span>}
                  {type === 'projects' && <span className="admin-item-pill">{item.year || 'Project'}</span>}
                </div>
                <div className="admin-item-details">
                  <div><h3>{item.title || 'Untitled item'}</h3><p>{item.description || item.category || item.type || 'No description added'}</p></div>
                  {type === 'projects' && item.tags && <div className="admin-tag-list">{(Array.isArray(item.tags) ? item.tags : String(item.tags).split(',')).slice(0, 3).map((tag) => <span key={tag}>{String(tag).trim()}</span>)}</div>}
                  {type === 'achievements' && <span className="admin-item-year">{item.type || 'Achievement'}{item.year ? ` · ${item.year}` : ''}</span>}
                  <div className="admin-item-actions"><button onClick={() => onEdit(item)}>Edit</button><button className="danger" onClick={() => onDelete(item)}>Delete</button></div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function InquiryManager({ messages, onUpdate }) {
  const [filter, setFilter] = useState('all');
  const filtered = messages.filter((message) => filter === 'all' || (filter === 'unread' ? !message.isRead : message.isRead));
  return (
    <>
      <div className="admin-page-heading">
        <div><p className="admin-eyebrow">INBOX</p><h1>Inquiries</h1><p>Messages sent through your portfolio contact form.</p></div>
        <span className="admin-inbox-count">{messages.length} {messages.length === 1 ? 'message' : 'messages'}</span>
      </div>
      <section className="admin-panel-card admin-inbox-panel">
        <div className="admin-inbox-toolbar">
          <div className="admin-filter-tabs">
            {['all', 'unread', 'read'].map((value) => <button key={value} className={filter === value ? 'selected' : ''} onClick={() => setFilter(value)}>{value[0].toUpperCase() + value.slice(1)}{value === 'unread' && unreadLabel(messages) > 0 ? ` (${unreadLabel(messages)})` : ''}</button>)}
          </div>
        </div>
        {filtered.length === 0 ? (
          <div className="admin-empty-state"><span>✉</span><h3>{messages.length ? 'No messages in this view' : 'Your inbox is clear'}</h3><p>New contact form submissions will appear here.</p></div>
        ) : (
          <div className="admin-inbox-list">
            {filtered.map((message) => (
              <article className={`admin-inquiry${message.isRead ? '' : ' is-unread'}`} key={message._id || message.id}>
                <span className="admin-message-avatar">{(message.name || '?').slice(0, 1).toUpperCase()}</span>
                <div className="admin-inquiry-content">
                  <div className="admin-inquiry-topline"><strong>{message.name}</strong><span>{formatDate(message.createdAt || message.savedAt)}</span></div>
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                  <p>{message.message}</p>
                  <div className="admin-inquiry-actions">
                    <a href={`mailto:${message.email}?subject=${encodeURIComponent('Re: your portfolio inquiry')}`} className="admin-reply-link">Reply by email ↗</a>
                    <button onClick={() => onUpdate(message, { isRead: !message.isRead })}>{message.isRead ? 'Mark unread' : 'Mark read'}</button>
                    <button className="danger" onClick={() => onUpdate(message, { delete: true })}>Delete</button>
                  </div>
                </div>
                {!message.isRead && <span className="admin-unread-dot" aria-label="Unread" />}
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function unreadLabel(messages) {
  return messages.filter((message) => !message.isRead).length;
}

function SettingsManager({ personal, resume, onSave, uploadFile, saving }) {
  const [form, setForm] = useState(personal);
  const [resumePath, setResumePath] = useState(resume);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    setForm(personal);
    setResumePath(resume);
  }, [personal, resume]);
  const updateField = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    try {
      await onSave({ personal: form, resume: resumePath });
    } catch (saveError) {
      console.error('Could not save profile settings:', saveError);
    } finally {
      setBusy(false);
    }
  };
  const chooseResume = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      setResumePath(await uploadFile('resume', file));
    } catch (uploadError) {
      window.alert(uploadError.message);
    } finally {
      setBusy(false);
      event.target.value = '';
    }
  };
  return (
    <>
      <div className="admin-page-heading"><div><p className="admin-eyebrow">PREFERENCES</p><h1>Settings</h1><p>Update the contact and profile information shown on your website.</p></div></div>
      <form onSubmit={submit} className="admin-settings-form">
        <section className="admin-panel-card admin-settings-card">
          <div className="admin-panel-heading"><div><h2>Profile information</h2><p>These details may appear on your homepage and contact page.</p></div></div>
          <div className="admin-form-grid">
            <label>Full name<input value={form.name || ''} onChange={(event) => updateField('name', event.target.value)} /></label>
            <label>Professional title<input value={form.title || ''} onChange={(event) => updateField('title', event.target.value)} /></label>
            <label>Email address<input type="email" value={form.email || ''} onChange={(event) => updateField('email', event.target.value)} /></label>
            <label>Location<input value={form.location || ''} onChange={(event) => updateField('location', event.target.value)} /></label>
            <label>Phone<input value={form.phone || ''} onChange={(event) => updateField('phone', event.target.value)} /></label>
            <label>LinkedIn URL<input type="url" value={form.linkedin || ''} onChange={(event) => updateField('linkedin', event.target.value)} /></label>
            <label className="admin-field-wide">About<textarea rows="5" value={form.about || ''} onChange={(event) => updateField('about', event.target.value)} /></label>
          </div>
        </section>
        <section className="admin-panel-card admin-settings-card">
          <div className="admin-panel-heading"><div><h2>Resume</h2><p>Upload a PDF to replace the resume linked from your portfolio.</p></div></div>
          <div className="admin-resume-row"><span className="admin-resume-icon">PDF</span><div><strong>{resumePath.split('/').pop() || 'Current resume'}</strong><span>{resumePath}</span></div><label className="admin-secondary-button">Upload PDF<input type="file" accept="application/pdf,.pdf" onChange={chooseResume} /></label></div>
        </section>
        <div className="admin-settings-actions"><span>Changes are saved to your live website.</span><button className="admin-primary-button" disabled={busy || saving}>{busy || saving ? 'Saving…' : 'Save changes'}</button></div>
      </form>
    </>
  );
}

const editorFieldMap = {
  projects: [
    ['title', 'Project name', 'text'],
    ['description', 'Short description', 'textarea'],
    ['company', 'Company / client', 'text'],
    ['year', 'Year', 'text'],
    ['tags', 'Technologies (comma separated)', 'text'],
    ['link', 'Project URL', 'url'],
    ['github_url', 'GitHub URL', 'url'],
    ['goal', 'Project goal', 'textarea'],
    ['results', 'Results', 'textarea'],
    ['overview', 'Overview', 'textarea']
  ],
  gallery: [
    ['title', 'Image title', 'text'],
    ['category', 'Category', 'text'],
    ['description', 'Description', 'textarea']
  ],
  achievements: [
    ['title', 'Title', 'text'],
    ['type', 'Type', 'text'],
    ['year', 'Year', 'text'],
    ['description', 'Description', 'textarea']
  ]
};

function ItemEditor({ type, item, uploadFile, saving, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...(item || {}), tags: Array.isArray(item?.tags) ? item.tags.join(', ') : item?.tags || '' }));
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const isAchievementDocument = type === 'achievements' && item?.image?.toLowerCase().endsWith('.pdf');
  const save = async (event) => {
    event.preventDefault();
    if (!form.title?.trim()) {
      setFormError('A title is required.');
      return;
    }
    setFormError('');
    try {
      await onSave({
        ...form,
        id: item?.id,
        title: form.title.trim(),
        tags: type === 'projects' ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : form.tags,
        year: form.year ? Number(form.year) || form.year : ''
      });
    } catch (saveError) {
      setFormError(saveError.message);
    }
  };
  const chooseImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFormError('');
    try {
      const kind = type === 'projects' ? 'projects' : type;
      const image = await uploadFile(kind, file);
      setForm((current) => ({ ...current, image }));
    } catch (uploadError) {
      setFormError(uploadError.message);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };
  const fields = editorFieldMap[type];
  return (
    <div className="admin-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className="admin-editor-modal" role="dialog" aria-modal="true" aria-labelledby="admin-editor-title">
        <header className="admin-editor-header"><div><p className="admin-eyebrow">{item ? 'EDIT CONTENT' : 'NEW CONTENT'}</p><h2 id="admin-editor-title">{item ? 'Edit' : 'Add'} {type === 'projects' ? 'project' : type === 'gallery' ? 'gallery item' : 'achievement'}</h2></div><button onClick={onClose} aria-label="Close">×</button></header>
        <form onSubmit={save}>
          <div className="admin-editor-body">
            {fields.map(([name, label, kind]) => (
              <label key={name} className={kind === 'textarea' ? 'admin-field-wide' : ''}>{label}
                {kind === 'textarea'
                  ? <textarea rows={name === 'description' ? 3 : 4} value={form[name] || ''} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />
                  : <input type={kind} value={form[name] || ''} onChange={(event) => setForm((current) => ({ ...current, [name]: event.target.value }))} />}
              </label>
            ))}
            <div className="admin-field-wide">
              <span className="admin-upload-label">{type === 'achievements' ? 'Image or certificate (PDF)' : 'Cover image'}</span>
              <div className="admin-image-upload-row">
                {form.image && <span className="admin-image-current">{isAchievementDocument || form.image.toLowerCase().endsWith('.pdf') ? 'PDF attached' : <img src={apiUrl(form.image)} alt="Current upload" />}</span>}
                <label className="admin-secondary-button">{uploading ? 'Uploading…' : form.image ? 'Replace file' : 'Choose file'}
                  <input type="file" accept={type === 'achievements' ? 'image/jpeg,image/png,image/webp,image/gif,application/pdf,.pdf' : 'image/jpeg,image/png,image/webp,image/gif'} onChange={chooseImage} disabled={uploading} />
                </label>
                {type === 'achievements' && <span className="admin-upload-hint">PDF or image · max 10 MB</span>}
              </div>
            </div>
          </div>
          {formError && <p className="admin-form-error admin-editor-error" role="alert">{formError}</p>}
          <footer className="admin-editor-footer"><button type="button" className="admin-secondary-button" onClick={onClose}>Cancel</button><button className="admin-primary-button" disabled={uploading || saving}>{saving ? 'Saving…' : item ? 'Save changes' : 'Add item'}</button></footer>
        </form>
      </section>
    </div>
  );
}

function formatDate(value) {
  if (!value) return 'Date unavailable';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Date unavailable';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
}

export default AdminPanel;
