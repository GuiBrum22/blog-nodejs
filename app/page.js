'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  // Função para buscar postagens do banco de dados
  const fetchPosts = async () => {
    const res = await fetch('/api/post'); // Endpoint da API que retorna as postagens
    const data = await res.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts(); // Busca postagens quando o componente é montado
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const handleRateClick = (postId) => {
    if (postId) {
      // Redireciona para a página de avaliação com o ID do post
      router.push(`/rate?postId=${postId}`);
    } else {
      console.error('Post ID is undefined');
    }
  };

  return (
    <div className={styles.page}>
      {/* Cabeçalho com barra de pesquisa e links de navegação */}
      <header className={styles.header}>
        <input
          type="text"
          placeholder="Pesquisar"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchBar}
        />
        <nav className={styles.nav}>
          <a href="/login">Login</a>
          <a href="/register">Registrar</a>
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        </nav>
      </header>

      {/* Área principal com as postagens */}
      <main className={styles.main}>
        <section className={styles.postsSection}>
          <h2>Postagens</h2>
          {posts
            .filter((post) =>
              post.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((post) => (
              <div key={post.id} className={styles.postContainer}>
                <div className={styles.postContent}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <button 
                    className={styles.rateButton}
                    onClick={() => handleRateClick(post.id)}
                  >
                    Avaliar
                  </button>
                </div>
              </div>
            ))}
        </section>
      </main>

      {/* Rodapé */}
      <footer className={styles.footer}>
        <p>Dados para rodapé - Footer</p>
        <p>
          &copy; {new Date().getFullYear()} Talk Blog - Todos os direitos
          reservados.
        </p>
      </footer>
    </div>
  );
}
