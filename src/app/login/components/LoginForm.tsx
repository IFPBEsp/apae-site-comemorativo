'use client'; 

import Image from 'next/image';

export default function LoginForm() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ padding: '40px', background: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <Image 
            src="/apae-site-comemorativo/logo-apae.png"
            alt="Logo da APAE"
            width={150}
            height={50}
            style={{ objectFit: 'contain' }}
          />
        </div>

        <form>
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="email" style={{ display: 'block', marginBottom: '8px' }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="linda@framcreative.com"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="password" style={{ display: 'block', marginBottom: '8px' }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="**********"
              required
              style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', padding: '12px', background: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Entrar
          </button>
        </form>

        <a href="/esqueci-minha-senha" style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: '#007bff' }}>
          Esqueceu sua senha?
        </a>
      </div>
    </div>
  );
}