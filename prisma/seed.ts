import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hasher les mots de passe
  const passwordHash = await bcrypt.hash("password123", 10);

  // Création des utilisateurs
  const users = await prisma.user.createMany({
    data: [
      { name: "Mamadou Traoré", email: "mamadou.traore@example.com", password: passwordHash, role: "ADMIN" },
      { name: "Fatoumata Diarra", email: "fatoumata.diarra@example.com", password: passwordHash, role: "USER" },
      { name: "Ibrahima Konaté", email: "ibrahima.konate@example.com", password: passwordHash, role: "USER" },
      { name: "Aissata Keita", email: "aissata.keita@example.com", password: passwordHash, role: "USER" },
    ],
  });

  // Récupérer les utilisateurs créés
  const [admin, user1, user2, user3] = await prisma.user.findMany();

  // Création des articles sur les langages de programmation
  await prisma.post.createMany({
    data: [
      {
        title: "Introduction à JavaScript",
        content: "JavaScript est un langage de programmation polyvalent utilisé pour le développement web.",
        thumbnail: "https://source.unsplash.com/400x300/?javascript",
        authorId: admin.id,
      },
      {
        title: "Les bases de Python",
        content: "Python est apprécié pour sa simplicité et sa lisibilité, idéal pour les débutants et les experts.",
        thumbnail: "https://source.unsplash.com/400x300/?python",
        authorId: user1.id,
      },
      {
        title: "Développer avec Java",
        content: "Java est un langage robuste et multiplateforme, utilisé pour les applications d'entreprise et mobiles.",
        thumbnail: "https://source.unsplash.com/400x300/?java",
        authorId: user2.id,
      },
      {
        title: "React : La révolution du Frontend",
        content: "React est une bibliothèque JavaScript puissante pour créer des interfaces utilisateur interactives.",
        thumbnail: "https://source.unsplash.com/400x300/?react",
        authorId: user3.id,
      },
      {
        title: "Pourquoi apprendre TypeScript ?",
        content: "TypeScript ajoute un typage statique à JavaScript, facilitant la maintenance des grands projets.",
        thumbnail: "https://source.unsplash.com/400x300/?typescript",
        authorId: admin.id,
      },
      {
        title: "Golang : L'avenir du backend ?",
        content: "Go (Golang) est un langage rapide et concurrentiel, idéal pour le développement de serveurs et d'API.",
        thumbnail: "https://source.unsplash.com/400x300/?golang",
        authorId: user1.id,
      },
      {
        title: "Django : Le framework Python ultime",
        content: "Django permet un développement rapide et sécurisé d'applications web grâce à son approche opinionnée.",
        thumbnail: "https://source.unsplash.com/400x300/?django",
        authorId: user2.id,
      },
      {
        title: "Node.js pour le développement backend",
        content: "Node.js est une plateforme qui permet d'exécuter du JavaScript côté serveur.",
        thumbnail: "https://source.unsplash.com/400x300/?nodejs",
        authorId: user3.id,
      },
    ],
  });

  console.log("🌱 Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
