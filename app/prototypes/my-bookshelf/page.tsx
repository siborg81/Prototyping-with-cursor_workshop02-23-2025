'use client';

import { useState, useEffect } from 'react';
import styles from './styles.module.css';

interface Book {
  id: string;
  properties: {
    Title: { title: Array<{ plain_text: string }> };
    Author: { rich_text: Array<{ plain_text: string }> };
    Genre: { select: { name: string } };
    'Cover Image': { files: Array<{ file?: { url: string }, external?: { url: string } }> };
    Rating: { number: number };
    Review: { rich_text: Array<{ plain_text: string }> };
  };
}

export default function Bookshelf() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('/api/books');
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        console.log('Received data from API:', data);
        setBooks(data);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to load books');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return <div className={styles.container}>Loading your galaxy of books...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  const getTitle = (book: Book) => {
    try {
      return book.properties.Title.title[0]?.plain_text || 'Untitled';
    } catch (e) {
      return 'Untitled';
    }
  };

  const getAuthor = (book: Book) => {
    try {
      return book.properties.Author.rich_text[0]?.plain_text || 'Unknown Author';
    } catch (e) {
      return 'Unknown Author';
    }
  };

  const getGenre = (book: Book) => {
    try {
      return book.properties.Genre.select?.name || 'Uncategorized';
    } catch (e) {
      return 'Uncategorized';
    }
  };

  const getRating = (book: Book) => {
    try {
      return book.properties.Rating.number || 0;
    } catch (e) {
      return 0;
    }
  };

  const getReview = (book: Book) => {
    try {
      return book.properties.Review.rich_text[0]?.plain_text || '';
    } catch (e) {
      return '';
    }
  };

  const getCoverImage = (book: Book) => {
    try {
      const file = book.properties['Cover Image'].files[0];
      return file?.file?.url || file?.external?.url || null;
    } catch (e) {
      return null;
    }
  };

  // Group books by genre
  const booksByGenre = books.reduce((acc, book) => {
    const genre = getGenre(book);
    if (!acc[genre]) {
      acc[genre] = [];
    }
    acc[genre].push(book);
    return acc;
  }, {} as Record<string, Book[]>);

  return (
    <div className={styles.container}>
      <h1>My galaxy</h1>
      {Object.entries(booksByGenre).map(([genre, genreBooks]) => (
        <div key={genre}>
          <h2 className={styles.genreTitle}>{genre}</h2>
          <div className={styles.grid}>
            {genreBooks.map((book) => {
              const coverUrl = getCoverImage(book);
              const rating = getRating(book);
              const review = getReview(book);
              
              return (
                <div key={book.id} className={styles.book}>
                  {coverUrl && (
                    <img
                      src={coverUrl}
                      alt={getTitle(book)}
                      className={styles.cover}
                    />
                  )}
                  <div className={styles.bookInfo}>
                    <h3>{getTitle(book)}</h3>
                    <p className={styles.author}>by {getAuthor(book)}</p>
                    {review && (
                      <p className={styles.review}>{review}</p>
                    )}
                    <div className={styles.rating}>
                      {rating}/5
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
} 