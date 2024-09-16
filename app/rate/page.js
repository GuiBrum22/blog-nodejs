'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '../page.module.css'; // Ajuste o caminho conforme necessário

export default function Rate() {
  const [post, setPost] = useState(null);
  const [stars, setStars] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams.get('postId'); // Obtém o postId da URL

  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        const res = await fetch(`/api/post/${postId}`); // Endpoint da API para obter um post específico
        const data = await res.json();
        setPost(data);
      };

      fetchPost();
    }
  }, [postId]);

  const handleRating = async () => {
    const token = localStorage.getItem('token'); // Token JWT

    const res = await fetch('/api/rate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, postId, stars }),
    });

    const data = await res.json();
    console.log(data);
    // Redireciona após o envio da avaliação
    router.push('/');
  };

  if (!post) return <p>Carregando...</p>;

  return (
    <div className={styles.page}>
      <h2>Avalie a Postagem</h2>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
      {[...Array(5)].map((_, i) => (
        <button 
          key={i} 
          onClick={() => setStars(i + 1)}
          className={i < stars ? styles.starActive : styles.star}
        >
          {i < stars ? '★' : '☆'}
        </button>
      ))}
      <button onClick={handleRating} className={styles.submitButton}>Enviar Avaliação</button>
    </div>
  );
}
