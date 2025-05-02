'use client';
import { useState } from 'react';

export default function Home() {
  const [posts, setPosts] = useState<string[]>([]);
  const [aiResults, setAiResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const handleScrapePosts = async () => {
    setLoading(true);
    setMessage('');
  
    try {
      const scrapeRes = await fetch('/api/linkedin-posts');
      const data = await scrapeRes.json();
      
      console.log(data)
      // Add check before sending to AI process
      {Array.isArray(posts) && posts.length > 0 ? (
        posts.map((post, index) => (
          <div key={index} className="post">
            <p>{post}</p>
          </div>
        ))
      ) : (
        <div>No posts found or invalid format.</div>
      )}
  
      setPosts(data);
  
      const aiRes = await fetch('/api/linkedinscrape/aiprocess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ posts: data.posts }),
      });
  
      const aiData = await aiRes.json();
      console.log(aiData)
      
  
      setAiResults(aiData.results);
      setMessage('✅ Email drafts generated!');
    } catch (error) {
      console.error('Error:', error);
      setMessage('❌ Failed to generate email drafts.');
    }
  
    setLoading(false);
  };
  const handleSendEmails = async () => {
      setSending(true);
      setMessage('');
      try {
        const payload = aiResults.map((res) => ({
          email: res.email,
          subject: res.subject,
          draft: res.draft,
        }));
  
        const response = await fetch('/api/email_sender', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: payload }),
        });
  
        const result = await response.json();
        console.log('Emails sent:', result);
        setMessage('✅ Emails sent successfully!');
      } catch (error) {
        console.error('Sending email failed:', error);
        setMessage('❌ Failed to send emails.');
      }
      setSending(false);
    };
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem', fontFamily: 'Arial, sans-serif', color: '#333' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#0070f3' }}>📩 LinkedIn Email Generator</h1>
  
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          onClick={handleScrapePosts}
          disabled={loading}
          style={{
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            backgroundColor: loading ? '#bbb' : '#0070f3',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {loading ? 'Processing...' : 'Generate Emails'}
        </button>
  
        <button
          onClick={handleSendEmails}
          disabled={sending || aiResults.length === 0}
          style={{
            padding: '0.6rem 1.2rem',
            fontSize: '1rem',
            backgroundColor: sending ? '#bbb' : '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: sending ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s ease'
          }}
        >
          {sending ? 'Sending...' : 'Send Emails'}
        </button>
      </div>
  
      {message && (
        <div
          style={{
            marginBottom: '1rem',
            textAlign: 'center',
            color: message.startsWith('✅') ? '#28a745' : '#dc3545',
            fontWeight: 'bold'
          }}
        >
          {message}
        </div>
      )}
  
      {aiResults.map((res, index) => (
        <div
          key={index}
          style={{
            border: '1px solid #ddd',
            borderRadius: '10px',
            padding: '1.2rem',
            marginBottom: '1.5rem',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
          }}
        >
          <p><strong style={{ color: '#0070f3' }}>📧 To:</strong> {res.email}</p>
          <p><strong style={{ color: '#0070f3' }}>📌 Subject:</strong> {res.subject}</p>
          <div style={{ marginTop: '0.5rem' }}>
            <strong style={{ color: '#0070f3' }}>📝 Draft:</strong>
            <pre style={{
              backgroundColor: '#f8f9fa',
              padding: '1rem',
              borderRadius: '6px',
              whiteSpace: 'pre-wrap',
              marginTop: '0.5rem',
              color: '#212529',
              fontSize: '0.95rem',
              lineHeight: '1.5'
            }}>
              {res.draft}
            </pre>
          </div>
        </div>
      ))}
    </div>
  );
}
