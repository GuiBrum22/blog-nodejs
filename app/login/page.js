'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Fazendo a requisição POST corretamente
    const res = await fetch('/api/auth/login', {
      method: 'POST', // Certifique-se de que o método é POST
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), // Enviando email e senha
    });

    const data = await res.json();

    if (res.ok) {
      // Se o login foi bem-sucedido, armazena o token e redireciona para a página inicial
      localStorage.setItem('token', data.token);
      router.push('/'); // Redireciona para a página inicial
    } else {
      // Exibe a mensagem de erro, como credenciais inválidas
      alert(data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
