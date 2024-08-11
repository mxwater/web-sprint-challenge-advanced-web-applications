import React, { useState } from 'react';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import Articles from './Articles';
import LoginForm from './LoginForm';
import Message from './Message';
import ArticleForm from './ArticleForm';
import Spinner from './Spinner';

const articlesUrl = 'http://localhost:9000/api/articles';
const loginUrl = 'http://localhost:9000/api/login';

export default function App() {
  const [message, setMessage] = useState('');
  const [articles, setArticles] = useState([]);
  const [currentArticleId, setCurrentArticleId] = useState(null);
  const [spinnerOn, setSpinnerOn] = useState(false);

  const navigate = useNavigate();

  const redirectToLogin = () => navigate('/');
  const redirectToArticles = () => navigate('/articles');

  const handleResponse = (response) => {
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  };

  const handleError = (error) => {
    setMessage(`An error occurred: ${error.message}`);
    if (error.message === 'Unauthorized') {
      localStorage.removeItem('token');
      redirectToLogin();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setMessage('Goodbye!');
    redirectToLogin();
  };
  const login = ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);

    fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(data.error);
        }
        return response.json();
      })
      .then(data => {
        localStorage.setItem('token', data.token);
        setMessage(data.message);
        redirectToArticles();
      })
      .catch(error => {
        setMessage(error.message);
      })
      .finally(() => {
        setSpinnerOn(false);
      });

  }
  const getArticles = () => {

    setMessage('');
    setSpinnerOn(true);

    fetch(articlesUrl, {
      method: 'GET',
      headers: { 'Authorization': localStorage.getItem('token') },
    })
      .then(response => response.json())

      .then(data => {
        const username = localStorage.getItem('username');
        setArticles(data.articles);
        setMessage(data.message);
      })
      .catch(error => {
        handleError(error);
      })
      .finally(() => {
        setSpinnerOn(false);
      });
  };

  const postArticle = async (article) => {
    setMessage('');
    setSpinnerOn(true);

    try {
      const response = await fetch(articlesUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify(article),
      });

      const data = await response.json()

      if (response.ok) {
        setArticles(prevArticles => [...prevArticles, data.article]);
        setMessage(data.message);
      } else {
        setMessage(data.message); 
      }

    } catch (error) {
      setMessage(data.error);
    } finally {
      setSpinnerOn(false);
    }
  };

  const updateArticle = async (article_id, articleData) => {
    setMessage(''); // Clear the message when the spinner is active
    setSpinnerOn(true);
  
    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('token'),
        },
        body: JSON.stringify(articleData)
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setArticles(prevArticles => {
          const updatedArticles = prevArticles.map(article =>
            article.article_id === article_id ? { ...article, ...articleData } : article
          );
          return updatedArticles; // Return the updated array directly
        });
  
        setMessage(data.message); // Display the success message
        setCurrentArticleId(null); // Reset the form
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage(`An error occurred: ${error.message}`);
    } finally {
      setSpinnerOn(false);
    }
  };  
  


  const deleteArticle = async (article_id) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await fetch(`${articlesUrl}/${article_id}`, {
        method: 'DELETE',
        headers: { 'Authorization': localStorage.getItem('token') },
      });
      const data = await handleResponse(response);
      const username = localStorage.getItem('username')

      setArticles(articles.filter(a => a.article_id !== article_id));
      setMessage(data.message);
    } catch (error) {
      handleError(error);
    } finally {
      setSpinnerOn(false);
    }
  };

  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="/articles" element={
            <>
              <ArticleForm
                postArticle={postArticle}
                updateArticle={updateArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
                articles={articles}
              />
              <Articles
                articles={articles}
                getArticles={getArticles}
                deleteArticle={deleteArticle}
                setCurrentArticleId={setCurrentArticleId}
                currentArticleId={currentArticleId}
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  );
}

