import Link from "next/link";
import styles from './styles/home.module.css';
import { Geist } from 'next/font/google';

const geist = Geist({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'] 
});

export default function Home() {
  // Add your prototypes to this array
  const prototypes = [
    {
      title: 'Getting started',
      description: 'How to create a prototype',
      path: '/prototypes/example'
    },
    {
      title: 'Design library',
      description: 'Reusable components that you can use in your prototypes',
      path: '/prototypes/design-library'
    },
    {
      title: 'Digital Piano',
      description: 'A retro-styled synthesizer with customizable waveforms in monochromatic pink',
      path: '/prototypes/digital-piano'
    },
    {
      title: 'Rainbow Piano',
      description: 'A colorful synthesizer inspired by Rainbow Brite with rainbow effects',
      path: '/prototypes/rainbow-piano'
    },
    {
      title: 'Typography Experiments',
      description: 'Interactive typography effects using pure CSS, including 3D text, circular text, and variable fonts',
      path: '/prototypes/typography-experiments'
    },
    {
      title: 'Noted OS',
      description: 'A nostalgic operating system-inspired note-taking app with window management, rich text editing, and drawing capabilities',
      path: '/prototypes/noted-os'
    },
    {
      title: 'My bookshelf',
      description: 'A reading tracker powered by Notion that helps you manage and review your books',
      path: '/prototypes/my-bookshelf'
    },
    // Add your new prototypes here like this:
    // {
    //   title: 'Your new prototype',
    //   description: 'A short description of what this prototype does',
    //   path: '/prototypes/my-new-prototype'
    // },
  ];

  return (
    <div className={`${styles.container} ${geist.className}`}>
      <header className={styles.header}>
        <h1>Silas's prototypes</h1>
      </header>

      <main>
        <section className={styles.grid}>
          {/* Goes through the prototypes list (array) to create cards */}
          {prototypes.map((prototype, index) => (
            <Link 
              key={index}
              href={prototype.path} 
              className={styles.card}
            >
              <h3>{prototype.title}</h3>
              <p>{prototype.description}</p>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
