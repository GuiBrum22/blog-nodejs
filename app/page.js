'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  // Função para buscar postagens do banco de dados
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/post'); // Endpoint da API que retorna as postagens
      if (!res.ok) {
        throw new Error('Erro ao buscar postagens');
      }
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Erro ao buscar postagens:', error);
    }
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
      router.push(`/rate?postId=${postId}`); // Redireciona para a página de avaliação com o ID do post
    } else {
      console.error('Post ID is undefined');
    }
  };

  const handleAddPostClick = () => {
    router.push('/post'); // Redireciona para a página de adicionar postagem
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
          <a href="/login" className="primary">Login</a>
          <a href="/register" className="secondary">Registrar</a>
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
              <div key={post._id} className={styles.postContainer}>
                <div className={styles.postContent}>
                  <h3>{post.title}</h3>
                  <p>{post.content}</p>
                  <button 
                    className={styles.rateButton}
                    onClick={() => handleRateClick(post._id)}
                  >
                    Avaliar
                  </button>
                </div>
              </div>
            ))}
        </section>
      </main>

      {/* Botão para adicionar nova postagem */}
      <button onClick={handleAddPostClick} className={styles.addPostButton}>+</button>

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
