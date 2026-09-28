import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * 86400000)
}

function randomDate(startDaysAgo: number, endDaysAgo: number): Date {
  const start = Date.now() - startDaysAgo * 86400000
  const end = Date.now() - endDaysAgo * 86400000
  return new Date(start + Math.random() * (end - start))
}

async function main() {
  console.log('🌱 Seeding database...')

  // Clear existing data
  await prisma.viewEvent.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.postTag.deleteMany()
  await prisma.idea.deleteMany()
  await prisma.media.deleteMany()
  await prisma.post.deleteMany()
  await prisma.tag.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  const user = await prisma.user.create({
    data: {
      name: 'Alex Johnson',
      username: 'alexjohnson',
      email: 'demo@example.com',
      password: bcrypt.hashSync('Demo@123', 12),
      bio: 'Writer, developer, and creative thinker. I write about technology, productivity, and the intersection of creativity and code.',
      location: 'San Francisco, CA',
      website: 'https://alexjohnson.dev',
      socialTwitter: 'alexjohnson',
      socialGithub: 'alexjohnson',
      socialLinkedin: 'alexjohnson',
    },
  })
  console.log('  ✅ Created demo user')

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Technology', slug: 'technology', description: 'Articles about software, hardware, and tech trends', color: '#3B82F6' } }),
    prisma.category.create({ data: { name: 'Career', slug: 'career', description: 'Career development and professional growth', color: '#8B5CF6' } }),
    prisma.category.create({ data: { name: 'Productivity', slug: 'productivity', description: 'Tips and strategies for getting more done', color: '#10B981' } }),
    prisma.category.create({ data: { name: 'Lifestyle', slug: 'lifestyle', description: 'Life, culture, and everyday experiences', color: '#F59E0B' } }),
    prisma.category.create({ data: { name: 'Travel', slug: 'travel', description: 'Travel stories and destination guides', color: '#EC4899' } }),
    prisma.category.create({ data: { name: 'Personal', slug: 'personal', description: 'Personal stories and reflections', color: '#6366F1' } }),
    prisma.category.create({ data: { name: 'Business', slug: 'business', description: 'Business insights and entrepreneurship', color: '#14B8A6' } }),
    prisma.category.create({ data: { name: 'AI & ML', slug: 'ai-ml', description: 'Artificial intelligence and machine learning', color: '#F97316' } }),
  ])
  console.log('  ✅ Created 8 categories')

  // Create tags
  const tagNames = ['AI', 'Career', 'Coding', 'Leadership', 'Productivity', 'Travel', 'Lifestyle', 'React', 'TypeScript', 'Python', 'Design', 'Remote Work', 'Startups', 'Machine Learning', 'Web Development', 'Cloud Computing']
  const tags = await Promise.all(
    tagNames.map(name =>
      prisma.tag.create({ data: { name, slug: name.toLowerCase().replace(/\s+/g, '-') } })
    )
  )
  console.log('  ✅ Created 16 tags')

  // Create posts
  const postsData = [
    {
      title: 'The Future of AI in Software Development',
      slug: 'the-future-of-ai-in-software-development',
      subtitle: 'How artificial intelligence is reshaping the way we write, test, and deploy code',
      status: 'PUBLISHED',
      categoryId: categories[0].id, // Technology
      views: 2400,
      readingTime: 8,
      publishedAt: daysAgo(10),
      createdAt: daysAgo(12),
      tagIndices: [0, 13, 14], // AI, Machine Learning, Web Development
      content: `<h2>The AI Revolution in Coding</h2><p>Artificial intelligence is no longer a futuristic concept in software development — it's here, and it's transforming every aspect of how we build software. From AI-powered code completion to automated testing, the landscape of software engineering is evolving at an unprecedented pace.</p><h2>Code Generation and Assistance</h2><p>Modern AI tools can now generate entire functions, suggest code completions, and even write boilerplate code. Tools like GitHub Copilot and similar AI assistants have shown that AI can significantly boost developer productivity, reducing the time spent on repetitive tasks and allowing developers to focus on creative problem-solving.</p><h3>The Impact on Developer Workflows</h3><p>The integration of AI into development workflows is creating a paradigm shift. Developers are moving from writing every line of code manually to collaborating with AI systems that understand context, patterns, and best practices. This doesn't replace developers — it augments their capabilities.</p><h2>Automated Testing and Quality Assurance</h2><p>AI is revolutionizing testing by automatically generating test cases, identifying edge cases that humans might miss, and predicting which parts of the codebase are most likely to contain bugs. This leads to more robust software and faster release cycles.</p><h2>What This Means for the Future</h2><p>As AI continues to evolve, we can expect even more sophisticated tools that understand not just code syntax, but the intent behind software design decisions. The developers who embrace these tools and learn to work alongside AI will be the ones who thrive in the coming decade.</p><blockquote><p>The future of software development isn't about AI replacing developers — it's about developers who use AI replacing those who don't.</p></blockquote>`,
    },
    {
      title: '10 Productivity Habits That Actually Work',
      slug: '10-productivity-habits-that-actually-work',
      subtitle: 'Proven strategies to boost your output without burning out',
      status: 'PUBLISHED',
      categoryId: categories[2].id, // Productivity
      views: 1800,
      readingTime: 6,
      publishedAt: daysAgo(20),
      createdAt: daysAgo(22),
      tagIndices: [4, 3], // Productivity, Leadership
      content: `<h2>Beyond the Hype: What Really Works</h2><p>We've all read countless articles about productivity hacks and morning routines. But which habits actually stand the test of time? After years of experimentation and research, here are the ten habits that have consistently delivered results.</p><h2>1. Time Blocking</h2><p>Instead of keeping a vague to-do list, assign specific time blocks to specific tasks. This forces you to be realistic about what you can accomplish and reduces the mental overhead of deciding what to work on next.</p><h2>2. The Two-Minute Rule</h2><p>If a task takes less than two minutes, do it immediately. This prevents small tasks from piling up and consuming mental energy throughout the day.</p><h2>3. Deep Work Sessions</h2><p>Dedicate 90-minute blocks to focused, uninterrupted work. Turn off notifications, close unnecessary tabs, and immerse yourself completely in the task at hand. The quality of work produced during these sessions is dramatically higher.</p><h2>4. Weekly Reviews</h2><p>Every Friday, spend 30 minutes reviewing what you accomplished, what fell through the cracks, and what needs attention next week. This habit alone can transform your productivity.</p><h2>5. Strategic Breaks</h2><p>Working non-stop isn't productive — it's counterproductive. Take regular breaks using techniques like the Pomodoro method to maintain mental freshness throughout the day.</p><h2>The Common Thread</h2><p>All of these habits share one thing in common: they reduce decision fatigue and create systems that make productivity automatic rather than effortful.</p>`,
    },
    {
      title: 'Building Scalable Web Applications with Next.js',
      slug: 'building-scalable-web-applications-with-nextjs',
      subtitle: 'A comprehensive guide to building production-ready applications',
      status: 'PUBLISHED',
      categoryId: categories[0].id, // Technology
      views: 3200,
      readingTime: 12,
      publishedAt: daysAgo(30),
      createdAt: daysAgo(33),
      tagIndices: [7, 8, 14], // React, TypeScript, Web Development
      content: `<h2>Why Next.js?</h2><p>Next.js has become the go-to framework for building modern web applications. With its powerful features like server-side rendering, static site generation, and API routes, it provides everything you need to build scalable, performant applications.</p><h2>Architecture Decisions</h2><p>When building a scalable application, architecture decisions made early on can have lasting impacts. The App Router in Next.js 14+ provides a more intuitive way to organize your application with layouts, loading states, and error boundaries built right in.</p><h3>Project Structure</h3><p>A well-organized project structure is crucial for maintainability. Separating concerns into components, lib, hooks, and types directories keeps your codebase clean as it grows. Using barrel exports and consistent naming conventions makes navigation intuitive.</p><h2>Performance Optimization</h2><p>Server Components are one of the most powerful features of modern Next.js. By default, components render on the server, reducing the JavaScript sent to the client. Only interactive components need the 'use client' directive.</p><h2>Database Integration</h2><p>Prisma has emerged as the leading ORM for TypeScript applications. Its type-safe database queries, automatic migrations, and intuitive schema language make database management a joy rather than a chore.</p><h2>Deployment and Scaling</h2><p>With platforms like Vercel, deploying Next.js applications is seamless. But understanding caching strategies, edge functions, and incremental static regeneration is key to building truly scalable applications that serve millions of users.</p>`,
    },
    {
      title: 'Remote Work: Lessons From 3 Years of Working From Home',
      slug: 'remote-work-lessons-from-3-years',
      subtitle: 'What I learned about productivity, boundaries, and staying connected',
      status: 'PUBLISHED',
      categoryId: categories[3].id, // Lifestyle
      views: 1500,
      readingTime: 7,
      publishedAt: daysAgo(45),
      createdAt: daysAgo(47),
      tagIndices: [11, 6, 4], // Remote Work, Lifestyle, Productivity
      content: `<h2>The Remote Work Reality</h2><p>When I first started working from home, I imagined endless flexibility and perfect work-life balance. The reality was far more nuanced. Here's what three years of remote work has taught me about making it work — really work.</p><h2>Setting Boundaries Is Non-Negotiable</h2><p>The biggest lesson? Without physical separation between work and home, boundaries must be intentionally created. I designated a specific room as my office, set strict start and end times, and learned to "commute" by taking a walk before and after work.</p><h2>Communication Becomes a Superpower</h2><p>In a remote setting, over-communication is actually just the right amount. I learned to write detailed messages, document decisions, and proactively share updates. Async communication tools like Loom and Notion became as important as Zoom.</p><h2>The Loneliness Factor</h2><p>Nobody warns you about how isolating remote work can be. Building intentional social connections — virtual coffee chats, coworking days, and local meetups — became essential for my mental health and professional growth.</p><h2>Would I Go Back to an Office?</h2><p>Honestly? No. But not because remote work is perfect. It's because I've built systems and habits that make it work for me. The key is being honest about the challenges and addressing them head-on.</p>`,
    },
    {
      title: "A Beginner's Guide to TypeScript",
      slug: 'a-beginners-guide-to-typescript',
      subtitle: 'Everything you need to know to get started with TypeScript',
      status: 'PUBLISHED',
      categoryId: categories[0].id, // Technology
      views: 4100,
      readingTime: 15,
      publishedAt: daysAgo(60),
      createdAt: daysAgo(63),
      tagIndices: [8, 2, 14], // TypeScript, Coding, Web Development
      content: `<h2>What Is TypeScript?</h2><p>TypeScript is a superset of JavaScript that adds static type definitions. Think of it as JavaScript with guardrails — it catches errors at compile time rather than runtime, making your code more reliable and your development experience smoother.</p><h2>Why TypeScript?</h2><p>JavaScript's flexibility is both its strength and weakness. TypeScript addresses the weakness by providing type safety while keeping all of JavaScript's power. Companies like Microsoft, Google, and Airbnb have adopted TypeScript for good reason.</p><h2>Getting Started</h2><p>Setting up TypeScript is straightforward. Install it globally with <code>npm install -g typescript</code>, then initialize a project with <code>tsc --init</code>. This creates a tsconfig.json file where you can configure compiler options.</p><h3>Basic Types</h3><p>TypeScript provides several basic types: <code>string</code>, <code>number</code>, <code>boolean</code>, <code>array</code>, <code>tuple</code>, <code>enum</code>, and more. You can also create custom types using interfaces and type aliases.</p><h2>Interfaces and Type Aliases</h2><p>Interfaces define the shape of objects. They're one of TypeScript's most powerful features, enabling you to create contracts for your data structures. Type aliases offer similar functionality with slightly different use cases.</p><h2>Generics</h2><p>Generics allow you to write reusable, type-safe code. Instead of writing separate functions for different types, you can write one function that works with any type while maintaining type safety.</p><h2>Next Steps</h2><p>This guide covers the fundamentals, but TypeScript goes much deeper. Explore advanced types, decorators, and module systems to unlock its full potential. The TypeScript handbook is an excellent resource for continued learning.</p>`,
    },
    {
      title: 'How I Built My Side Project Into a Business',
      slug: 'how-i-built-my-side-project-into-a-business',
      subtitle: 'From weekend hobby to revenue-generating product',
      status: 'PUBLISHED',
      categoryId: categories[6].id, // Business
      views: 2100,
      readingTime: 10,
      publishedAt: daysAgo(75),
      createdAt: daysAgo(78),
      tagIndices: [12, 3], // Startups, Leadership
      content: `<h2>It Started With a Problem</h2><p>Like many side projects, mine started with a personal frustration. I couldn't find a tool that did exactly what I needed, so I built one. What I didn't expect was that thousands of other people had the same frustration.</p><h2>The Early Days</h2><p>The first version was embarrassingly simple — a barely functional prototype that solved one specific problem. But I shipped it anyway. Getting it in front of real users was the most important step I took.</p><h3>Finding My First Users</h3><p>I shared my tool on Twitter, Reddit, and Hacker News. The initial response was modest but encouraging. More importantly, the feedback from early users shaped the product's direction in ways I never could have predicted.</p><h2>From Free to Paid</h2><p>The transition from free to paid was terrifying. I agonized over pricing for weeks. In the end, I started with a freemium model — basic features free, premium features paid. The conversion rate was higher than I expected.</p><h2>Lessons Learned</h2><ul><li><strong>Ship early, iterate often:</strong> Perfection is the enemy of progress</li><li><strong>Listen to users:</strong> They'll tell you what to build next</li><li><strong>Price with confidence:</strong> If no one complains about your pricing, you're charging too little</li><li><strong>Stay consistent:</strong> Building in public keeps you accountable</li></ul><h2>Where I Am Now</h2><p>Two years later, the side project generates enough revenue to be my full-time focus. It's not a unicorn startup, and it doesn't need to be. It's a sustainable business that solves a real problem for real people.</p>`,
    },
    {
      title: 'The Art of Writing Clean Code',
      slug: 'the-art-of-writing-clean-code',
      subtitle: 'Principles and practices for writing maintainable software',
      status: 'DRAFT',
      categoryId: categories[0].id, // Technology
      views: 0,
      readingTime: 10,
      publishedAt: null,
      createdAt: daysAgo(3),
      tagIndices: [2, 14], // Coding, Web Development
      content: `<h2>Why Clean Code Matters</h2><p>Clean code isn't just about aesthetics — it's about maintainability, readability, and reducing the cost of change. Code is read far more often than it's written, so investing in cleanliness pays dividends over time.</p><h2>Naming Things Well</h2><p>The most impactful thing you can do for code readability is choosing good names. Variables, functions, and classes should clearly communicate their purpose without requiring comments to explain them.</p><h2>Functions Should Do One Thing</h2><p>A function should do one thing, do it well, and do it only. If you find yourself writing a function that does multiple things, break it into smaller, focused functions that can be composed together.</p><p><em>This draft is still in progress. More sections on error handling, testing, and refactoring coming soon.</em></p>`,
    },
    {
      title: 'Career Advice I Wish I Had Earlier',
      slug: 'career-advice-i-wish-i-had-earlier',
      subtitle: 'Lessons that took me years to learn the hard way',
      status: 'DRAFT',
      categoryId: categories[1].id, // Career
      views: 0,
      readingTime: 8,
      publishedAt: null,
      createdAt: daysAgo(5),
      tagIndices: [1, 3], // Career, Leadership
      content: `<h2>The Advice Nobody Gives You</h2><p>When I started my career, I focused entirely on technical skills. While those matter, the lessons that truly shaped my trajectory were about communication, relationships, and strategic thinking.</p><h2>Your Network Is Your Net Worth</h2><p>I used to think networking was fake and uncomfortable. I was wrong. The relationships I've built throughout my career have opened doors that no amount of technical skill could have.</p><p><em>Draft in progress — expanding with more career advice sections.</em></p>`,
    },
    {
      title: 'Exploring Machine Learning with Python',
      slug: 'exploring-machine-learning-with-python',
      subtitle: 'A practical introduction to ML concepts and implementation',
      status: 'DRAFT',
      categoryId: categories[7].id, // AI & ML
      views: 0,
      readingTime: 12,
      publishedAt: null,
      createdAt: daysAgo(2),
      tagIndices: [0, 9, 13], // AI, Python, Machine Learning
      content: `<h2>Getting Started with Machine Learning</h2><p>Machine learning might seem intimidating, but Python's rich ecosystem of libraries makes it surprisingly accessible. In this guide, we'll explore the fundamental concepts and build our first ML model.</p><h2>Essential Libraries</h2><p>The Python ML ecosystem revolves around a few key libraries: NumPy for numerical computing, Pandas for data manipulation, Scikit-learn for classical ML algorithms, and TensorFlow or PyTorch for deep learning.</p><p><em>This article is being drafted — sections on data preprocessing, model training, and evaluation coming soon.</em></p>`,
    },
    {
      title: 'My Travel Journey Through Japan',
      slug: 'my-travel-journey-through-japan',
      subtitle: 'Two weeks of temples, technology, and incredible food',
      status: 'ARCHIVED',
      categoryId: categories[4].id, // Travel
      views: 900,
      readingTime: 9,
      publishedAt: daysAgo(90),
      createdAt: daysAgo(95),
      tagIndices: [5, 6], // Travel, Lifestyle
      content: `<h2>Landing in Tokyo</h2><p>Nothing can prepare you for Tokyo. The moment you step out of Narita Airport and onto the Narita Express, you realize you're somewhere truly unique. The perfect blend of ancient tradition and cutting-edge technology is everywhere.</p><h2>Kyoto: A Step Back in Time</h2><p>After the sensory overload of Tokyo, Kyoto feels like a deep breath. The bamboo groves of Arashiyama, the golden pavilion of Kinkaku-ji, and the thousands of vermillion torii gates at Fushimi Inari — each place tells a story spanning centuries.</p><h2>The Food Alone Is Worth the Trip</h2><p>From street-side ramen in Tokyo to kaiseki dining in Kyoto, Japanese food exceeded every expectation. The attention to detail, the freshness of ingredients, and the artistry in presentation made every meal an experience.</p><h2>Practical Tips</h2><ul><li>Get a Japan Rail Pass — it pays for itself in two days</li><li>Learn basic Japanese phrases — locals deeply appreciate the effort</li><li>Visit convenience stores — 7-Eleven in Japan is a culinary destination</li><li>Book ryokans in advance — traditional inns fill up quickly</li></ul><h2>Would I Go Back?</h2><p>In a heartbeat. Japan is a country that rewards repeat visits. There's always another hidden temple, another incredible restaurant, another moment that reminds you why travel matters.</p>`,
    },
  ]

  const posts = []
  for (const postData of postsData) {
    const { tagIndices, ...data } = postData
    const post = await prisma.post.create({
      data: {
        ...data,
        authorId: user.id,
        excerpt: data.subtitle,
        seoTitle: data.title,
        seoDescription: data.subtitle,
      },
    })
    posts.push(post)

    // Create post-tag relations
    for (const tagIdx of tagIndices) {
      await prisma.postTag.create({
        data: { postId: post.id, tagId: tags[tagIdx].id },
      })
    }
  }
  console.log('  ✅ Created 10 blog posts with tags')

  // Create view events for published posts
  const publishedPosts = posts.filter((_, i) => postsData[i].status === 'PUBLISHED')
  for (const post of publishedPosts) {
    const postData = postsData[posts.indexOf(post)]
    const numEvents = Math.floor(postData.views * 0.06) // ~6% of views as tracked events
    for (let i = 0; i < numEvents; i++) {
      await prisma.viewEvent.create({
        data: {
          postId: post.id,
          createdAt: randomDate(90, 0),
        },
      })
    }
  }
  console.log('  ✅ Created view events')

  // Create comments
  const comments = [
    'Great article! Really insightful.',
    'This is exactly what I needed to read today.',
    'I disagree with point 3, but overall a solid piece.',
    'Thanks for sharing your experience!',
    'Could you elaborate more on the testing section?',
    'Bookmarked this for future reference.',
    'Your writing style is so engaging!',
    'I tried this approach and it worked perfectly.',
    'Would love to see a follow-up on this topic.',
    'This changed how I think about productivity.',
    'Incredibly well-researched article.',
    'The code examples are very helpful.',
    'Shared this with my entire team.',
    'When is part 2 coming?',
    'One of the best articles I have read on this topic.',
  ]

  for (let i = 0; i < comments.length; i++) {
    const postIdx = i % publishedPosts.length
    await prisma.comment.create({
      data: {
        content: comments[i],
        postId: publishedPosts[postIdx].id,
        authorId: user.id,
        createdAt: randomDate(60, 0),
      },
    })
  }
  console.log('  ✅ Created 15 comments')

  // Create likes
  for (const post of publishedPosts) {
    if (Math.random() > 0.3) {
      await prisma.like.create({
        data: {
          postId: post.id,
          userId: user.id,
          createdAt: randomDate(60, 0),
        },
      })
    }
  }
  console.log('  ✅ Created likes')

  // Create saved ideas
  const ideas = [
    { title: 'Building a Personal Knowledge Management System', description: 'Explore tools and methodologies for creating an effective PKM system that enhances learning and creativity.', targetAudience: 'Knowledge workers', contentType: 'How-to', keywords: 'PKM, Notion, Obsidian, note-taking', difficulty: 'Intermediate', readingTime: 10, tone: 'Educational' },
    { title: 'The Rise of AI-Powered Development Tools', description: 'A comprehensive look at how AI is transforming the developer toolkit landscape.', targetAudience: 'Software developers', contentType: 'Blog', keywords: 'AI, developer tools, Copilot, automation', difficulty: 'Intermediate', readingTime: 8, tone: 'Professional' },
    { title: 'How to Create a Successful Technical Blog', description: 'Tips and strategies for building an audience through technical writing.', targetAudience: 'Aspiring tech bloggers', contentType: 'How-to', keywords: 'blogging, technical writing, audience building', difficulty: 'Beginner', readingTime: 12, tone: 'Educational' },
    { title: 'Understanding Microservices Architecture', description: 'A deep dive into microservices patterns, benefits, and common pitfalls.', targetAudience: 'Backend developers', contentType: 'Tutorial', keywords: 'microservices, architecture, distributed systems', difficulty: 'Advanced', readingTime: 15, tone: 'Professional' },
    { title: 'The Future of Remote Work Technology', description: 'Exploring emerging tools and technologies shaping the future of distributed work.', targetAudience: 'Remote workers and managers', contentType: 'Blog', keywords: 'remote work, collaboration tools, future of work', difficulty: 'Beginner', readingTime: 7, tone: 'Casual' },
    { title: 'Getting Started with Rust Programming', description: 'An introductory guide to Rust for developers coming from other languages.', targetAudience: 'Experienced developers', contentType: 'Tutorial', keywords: 'Rust, systems programming, memory safety', difficulty: 'Intermediate', readingTime: 20, tone: 'Educational' },
    { title: 'Designing for Accessibility', description: 'Why accessibility matters and practical steps to make your web applications inclusive.', targetAudience: 'Frontend developers and designers', contentType: 'How-to', keywords: 'accessibility, a11y, inclusive design, WCAG', difficulty: 'Intermediate', readingTime: 10, tone: 'Professional' },
    { title: 'The Psychology of Productive Habits', description: 'Understanding the science behind habit formation and how to leverage it.', targetAudience: 'Professionals and self-improvers', contentType: 'Blog', keywords: 'habits, psychology, productivity, behavior', difficulty: 'Beginner', readingTime: 8, tone: 'Storytelling' },
    { title: 'Building APIs with GraphQL', description: 'A practical guide to designing and implementing GraphQL APIs.', targetAudience: 'Full-stack developers', contentType: 'Tutorial', keywords: 'GraphQL, API design, Apollo, queries', difficulty: 'Intermediate', readingTime: 14, tone: 'Educational' },
    { title: 'Web Performance Optimization Techniques', description: 'Actionable strategies to make your web applications faster and more efficient.', targetAudience: 'Web developers', contentType: 'Listicle', keywords: 'performance, optimization, Core Web Vitals, speed', difficulty: 'Intermediate', readingTime: 10, tone: 'Professional' },
    { title: 'Introduction to Cloud Native Development', description: 'Understanding containers, orchestration, and cloud-native application design.', targetAudience: 'DevOps engineers and developers', contentType: 'Blog', keywords: 'cloud native, Docker, Kubernetes, CI/CD', difficulty: 'Advanced', readingTime: 12, tone: 'Professional' },
    { title: 'The Art of Code Review', description: 'Best practices for giving and receiving code reviews that improve code quality and team dynamics.', targetAudience: 'Development teams', contentType: 'How-to', keywords: 'code review, collaboration, best practices', difficulty: 'Beginner', readingTime: 8, tone: 'Professional' },
  ]

  for (const idea of ideas) {
    await prisma.idea.create({
      data: {
        ...idea,
        userId: user.id,
        saved: true,
      },
    })
  }
  console.log('  ✅ Created 12 saved ideas')

  console.log('\n✅ Seeding complete!')
  console.log('\n📧 Demo credentials:')
  console.log('   Email: demo@example.com')
  console.log('   Password: Demo@123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
