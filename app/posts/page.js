'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PostsPage() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const router = useRouter();

  useEffect(() => {
    // Função para buscar as postagens da API
    const fetchPosts = async () => {
      const res = await fetch('/api/posts');
      const data = await res.json();
      setPosts(data);
    };

    fetchPosts();
  }, []);

  // Função para criar uma nova postagem
  const handleCreatePost = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const res = await fetch('/api/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newPost),
    });

    if (res.ok) {
      const post = await res.json();
      setPosts([...posts, post]);
      setNewPost({ title: '', content: '' }); // Limpar o formulário
    } else {
      alert('Erro ao criar postagem');
    }
  };

  // Função para deletar uma postagem
  const handleDeletePost = async (id) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/post`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setPosts(posts.filter(post => post._id !== id));
    } else {
      alert('Erro ao deletar postagem');
    }
  };

  return (
    <div>
      <h1>Postagens</h1>

      <form onSubmit={handleCreatePost}>
        <input
          type="text"
          placeholder="Título da Postagem"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Conteúdo da Postagem"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
        />
        <button type="submit">Criar Postagem</button>
      </form>

      <ul>
        {posts.map((post) => (
          <li key={post._id}>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
            <p><strong>Autor:</strong> {post.author.username}</p>
            <button onClick={() => handleDeletePost(post._id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
