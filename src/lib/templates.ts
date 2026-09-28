export interface BlogTemplate {
  id: string
  name: string
  description: string
  bestFor: string
  icon: string
  estimatedReadingTime: number
  content: string
}

export const blogTemplates: BlogTemplate[] = [
  {
    id: 'personal-story',
    name: 'Personal Story',
    description: 'Share personal experiences and life lessons.',
    bestFor: 'Personal blogs, memoirs, life updates',
    icon: 'Heart',
    estimatedReadingTime: 8,
    content: `
<h2>Introduction</h2>
<p>[Hook the reader with a compelling opening statement or question...]</p>

<h2>Setting the Scene</h2>
<p>[Describe the context and background of your story...]</p>

<h2>The Experience</h2>
<p>[Detail the main events of your story...]</p>
<blockquote>[Insert a meaningful quote or thought from that time...]</blockquote>

<h2>The Turning Point</h2>
<p>[Describe the climax or the moment things changed...]</p>

<h2>Lessons Learned</h2>
<ul>
  <li><strong>Lesson 1:</strong> [Explain first lesson...]</li>
  <li><strong>Lesson 2:</strong> [Explain second lesson...]</li>
  <li><strong>Lesson 3:</strong> [Explain third lesson...]</li>
</ul>

<h2>Reflection</h2>
<p>[Share your thoughts looking back...]</p>

<h2>What I'd Do Differently</h2>
<p>[Discuss how you would approach the situation now...]</p>

<h2>Conclusion</h2>
<p>[Wrap up your story and provide a final thought for the reader...]</p>
    `
  },
  {
    id: 'how-to-guide',
    name: 'How-To Guide',
    description: 'Step-by-step instructional guide.',
    bestFor: 'Educational content, DIY guides, tutorials',
    icon: 'BookOpen',
    estimatedReadingTime: 10,
    content: `
<h2>Introduction</h2>
<p>[Introduce what you will be teaching and why it's valuable...]</p>

<h2>What You'll Need</h2>
<ul>
  <li>[Prerequisite or tool 1]</li>
  <li>[Prerequisite or tool 2]</li>
  <li>[Prerequisite or tool 3]</li>
</ul>

<h2>Step 1: [First Step Name]</h2>
<p>[Detailed explanation of the first step...]</p>

<h2>Step 2: [Second Step Name]</h2>
<p>[Detailed explanation of the second step...]</p>

<h2>Step 3: [Third Step Name]</h2>
<p>[Detailed explanation of the third step...]</p>

<h2>Step 4: [Fourth Step Name]</h2>
<p>[Detailed explanation of the fourth step...]</p>

<h2>Step 5: [Fifth Step Name]</h2>
<p>[Detailed explanation of the fifth step...]</p>

<h2>Common Mistakes to Avoid</h2>
<ul>
  <li>[Mistake 1 and how to avoid it]</li>
  <li>[Mistake 2 and how to avoid it]</li>
</ul>

<h2>Pro Tips</h2>
<p>[Share some advanced tips for better results...]</p>

<h2>Conclusion & Next Steps</h2>
<p>[Summarize what was learned and tell the reader what to do next...]</p>
    `
  },
  {
    id: 'tutorial',
    name: 'Tutorial',
    description: 'In-depth technical tutorial with code examples.',
    bestFor: 'Technical articles, programming guides',
    icon: 'Code',
    estimatedReadingTime: 15,
    content: `
<h2>Introduction</h2>
<p>[Introduce the technology and what you will build...]</p>

<h2>Prerequisites</h2>
<p>Before starting, make sure you have:</p>
<ul>
  <li>[Requirement 1]</li>
  <li>[Requirement 2]</li>
</ul>

<h2>Project Setup</h2>
<p>[Explain how to initialize the project...]</p>
<pre><code>[Insert setup commands here...]</code></pre>

<h2>Implementation: Part 1</h2>
<p>[Explain the first part of the implementation...]</p>
<pre><code>[Insert code block here...]</code></pre>

<h2>Implementation: Part 2</h2>
<p>[Explain the next part of the implementation...]</p>
<pre><code>[Insert code block here...]</code></pre>

<h2>Implementation: Part 3</h2>
<p>[Explain the final part of the implementation...]</p>
<pre><code>[Insert code block here...]</code></pre>

<h2>Testing</h2>
<p>[Explain how to test what was built...]</p>

<h2>Troubleshooting</h2>
<p>[List common issues and their solutions...]</p>

<h2>Conclusion</h2>
<p>[Summarize the tutorial and link to the source code...]</p>
    `
  },
  {
    id: 'listicle',
    name: 'Listicle',
    description: 'Numbered list format.',
    bestFor: 'Quick reads, tips, recommendations',
    icon: 'ListOrdered',
    estimatedReadingTime: 7,
    content: `
<h2>Introduction</h2>
<p>[Introduce the topic and explain why this list is important...]</p>

<h2>1. [First Item Name]</h2>
<p>[Description of the first item and why it made the list...]</p>

<h2>2. [Second Item Name]</h2>
<p>[Description of the second item and why it made the list...]</p>

<h2>3. [Third Item Name]</h2>
<p>[Description of the third item and why it made the list...]</p>

<h2>4. [Fourth Item Name]</h2>
<p>[Description of the fourth item and why it made the list...]</p>

<h2>5. [Fifth Item Name]</h2>
<p>[Description of the fifth item and why it made the list...]</p>

<h2>6. [Sixth Item Name]</h2>
<p>[Description of the sixth item and why it made the list...]</p>

<h2>7. [Seventh Item Name]</h2>
<p>[Description of the seventh item and why it made the list...]</p>

<h2>8. [Eighth Item Name]</h2>
<p>[Description of the eighth item and why it made the list...]</p>

<h2>9. [Ninth Item Name]</h2>
<p>[Description of the ninth item and why it made the list...]</p>

<h2>10. [Tenth Item Name]</h2>
<p>[Description of the tenth item and why it made the list...]</p>

<h2>Honorable Mentions</h2>
<ul>
  <li><strong>[Item Name]:</strong> [Brief description]</li>
  <li><strong>[Item Name]:</strong> [Brief description]</li>
</ul>

<h2>Conclusion</h2>
<p>[Wrap up the list and ask the reader for their favorites...]</p>
    `
  },
  {
    id: 'product-review',
    name: 'Product Review',
    description: 'Detailed product/tool review.',
    bestFor: 'Tech reviews, software reviews, product comparisons',
    icon: 'Star',
    estimatedReadingTime: 10,
    content: `
<h2>Introduction</h2>
<p>[Introduce the product being reviewed and its context in the market...]</p>

<h2>Overview</h2>
<p>[Provide a high-level summary of what the product is and does...]</p>

<h2>First Impressions</h2>
<p>[Share your initial thoughts upon using the product...]</p>

<h2>Key Features</h2>
<ul>
  <li><strong>[Feature 1]:</strong> [Description]</li>
  <li><strong>[Feature 2]:</strong> [Description]</li>
  <li><strong>[Feature 3]:</strong> [Description]</li>
  <li><strong>[Feature 4]:</strong> [Description]</li>
</ul>

<h2>Pros</h2>
<ul>
  <li>[Pro 1]</li>
  <li>[Pro 2]</li>
  <li>[Pro 3]</li>
</ul>

<h2>Cons</h2>
<ul>
  <li>[Con 1]</li>
  <li>[Con 2]</li>
  <li>[Con 3]</li>
</ul>

<h2>Pricing</h2>
<p>[Discuss the pricing tiers and value for money...]</p>

<h2>Who Is This For?</h2>
<p>[Identify the ideal user or customer for this product...]</p>

<h2>Verdict</h2>
<p>[Provide your final conclusion on the product...]</p>

<h2>Rating</h2>
<p><strong>[X]/10</strong> - [Brief summary sentence]</p>
    `
  },
  {
    id: 'opinion',
    name: 'Opinion / Thought Leadership',
    description: 'Share professional opinions.',
    bestFor: 'Industry commentary, trend analysis',
    icon: 'MessageSquare',
    estimatedReadingTime: 8,
    content: `
<h2>Introduction</h2>
<p>[State your thesis or core argument clearly right away...]</p>

<h2>Context</h2>
<p>[Provide background information on the topic or current state of affairs...]</p>

<h2>My Perspective</h2>
<p>[Elaborate on your viewpoint and why you hold it...]</p>

<h2>Supporting Arguments</h2>
<h3>[Argument 1]</h3>
<p>[Evidence or reasoning for argument 1...]</p>

<h3>[Argument 2]</h3>
<p>[Evidence or reasoning for argument 2...]</p>

<h3>[Argument 3]</h3>
<p>[Evidence or reasoning for argument 3...]</p>

<h2>Counterarguments</h2>
<p>[Address the opposing viewpoints...]</p>
<p>[Explain why your perspective still holds true despite counterarguments...]</p>

<h2>What This Means For The Industry</h2>
<p>[Discuss the broader implications of your viewpoint...]</p>

<h2>Call to Action</h2>
<p>[What should the reader do next? Challenge them to think differently...]</p>
    `
  },
  {
    id: 'case-study',
    name: 'Case Study',
    description: 'Analyze a real-world example.',
    bestFor: 'Business analysis, project showcases',
    icon: 'FileSearch',
    estimatedReadingTime: 12,
    content: `
<h2>Executive Summary</h2>
<p>[Provide a brief overview of the case study and its main outcome...]</p>

<h2>Background</h2>
<p>[Introduce the subject, company, or project being analyzed...]</p>

<h2>The Challenge</h2>
<p>[Describe the specific problem or goal that needed addressing...]</p>

<h2>The Approach</h2>
<p>[Explain the strategy chosen to tackle the challenge and why...]</p>

<h2>Implementation</h2>
<p>[Detail the steps taken during execution...]</p>

<h2>Results</h2>
<p>[Share the measurable outcomes...]</p>
<ul>
  <li><strong>Metric 1:</strong> [Value]</li>
  <li><strong>Metric 2:</strong> [Value]</li>
  <li><strong>Metric 3:</strong> [Value]</li>
</ul>

<h2>Key Takeaways</h2>
<ul>
  <li>[Takeaway 1]</li>
  <li>[Takeaway 2]</li>
  <li>[Takeaway 3]</li>
</ul>

<h2>Conclusion</h2>
<p>[Summarize the significance of this case study...]</p>
    `
  },
  {
    id: 'career-advice',
    name: 'Career Advice',
    description: 'Professional development guidance.',
    bestFor: 'Career blogs, mentoring content',
    icon: 'Briefcase',
    estimatedReadingTime: 8,
    content: `
<h2>Introduction</h2>
<p>[Introduce the career topic or challenge being addressed...]</p>

<h2>My Background</h2>
<p>[Briefly share your relevant experience or qualifications...]</p>

<h2>The Advice</h2>
<h3>1. [Key Point 1]</h3>
<p>[Elaborate on the first piece of advice...]</p>

<h3>2. [Key Point 2]</h3>
<p>[Elaborate on the second piece of advice...]</p>

<h3>3. [Key Point 3]</h3>
<p>[Elaborate on the third piece of advice...]</p>

<h2>Real-World Examples</h2>
<p>[Share anecdotes or examples where this advice applied...]</p>

<h2>Common Pitfalls</h2>
<p>[Discuss mistakes people often make in this area...]</p>

<h2>Action Steps</h2>
<ol>
  <li>[First actionable step...]</li>
  <li>[Second actionable step...]</li>
  <li>[Third actionable step...]</li>
</ol>

<h2>Final Thoughts</h2>
<p>[Offer encouragement and a concluding thought...]</p>
    `
  },
  {
    id: 'travel-story',
    name: 'Travel Story',
    description: 'Document travel experiences.',
    bestFor: 'Travel blogs, adventure stories',
    icon: 'Plane',
    estimatedReadingTime: 10,
    content: `
<h2>Introduction</h2>
<p>[Set the scene: Where did you go and why?]</p>

<h2>Getting There</h2>
<p>[Describe the journey, travel methods, and arrival...]</p>

<h2>Day by Day Highlights</h2>
<h3>Day 1: [Highlight]</h3>
<p>[Describe what happened on day 1...]</p>

<h3>Day 2: [Highlight]</h3>
<p>[Describe what happened on day 2...]</p>

<h3>Day 3: [Highlight]</h3>
<p>[Describe what happened on day 3...]</p>

<h2>Cultural Experiences</h2>
<p>[Share insights into the local culture, people, and customs...]</p>

<h2>Food & Dining</h2>
<p>[Discuss memorable meals and local cuisine...]</p>

<h2>Practical Tips</h2>
<ul>
  <li><strong>Transportation:</strong> [Tip]</li>
  <li><strong>Accommodation:</strong> [Tip]</li>
  <li><strong>Must-Pack Items:</strong> [Tip]</li>
</ul>

<h2>Budget Breakdown</h2>
<p>[Provide a rough overview of costs...]</p>

<h2>Would I Go Back?</h2>
<p>[Share your final verdict on the destination...]</p>

<h2>Photo Gallery</h2>
<p>[Placeholder for image grid or gallery...]</p>
    `
  },
  {
    id: 'productivity',
    name: 'Productivity',
    description: 'Productivity tips and strategies.',
    bestFor: 'Self-improvement, work optimization',
    icon: 'Zap',
    estimatedReadingTime: 7,
    content: `
<h2>Introduction</h2>
<p>[Introduce the productivity challenge or concept...]</p>

<h2>The Problem</h2>
<p>[Describe why this is an issue for many people...]</p>

<h2>My Framework</h2>
<p>[Introduce your overarching strategy or philosophy...]</p>

<h2>Technique 1: [Name]</h2>
<p>[Explain the first specific technique...]</p>

<h2>Technique 2: [Name]</h2>
<p>[Explain the second specific technique...]</p>

<h2>Technique 3: [Name]</h2>
<p>[Explain the third specific technique...]</p>

<h2>Tools I Recommend</h2>
<ul>
  <li><strong>[Tool 1]:</strong> [Why use it]</li>
  <li><strong>[Tool 2]:</strong> [Why use it]</li>
</ul>

<h2>Measuring Progress</h2>
<p>[Explain how to track success with these techniques...]</p>

<h2>Conclusion</h2>
<p>[Final motivational thought on implementing these strategies...]</p>
    `
  },
  {
    id: 'technology',
    name: 'Technology Article',
    description: 'Deep dive into technology.',
    bestFor: 'Tech analysis, emerging technology',
    icon: 'Cpu',
    estimatedReadingTime: 12,
    content: `
<h2>Introduction</h2>
<p>[Hook the reader with the significance of the technology...]</p>

<h2>What Is [Technology]?</h2>
<p>[Provide a clear, high-level definition...]</p>

<h2>How It Works</h2>
<p>[Explain the underlying mechanics or principles...]</p>
<ul>
  <li>[Core component 1]</li>
  <li>[Core component 2]</li>
</ul>

<h2>Current Applications</h2>
<p>[Discuss how the technology is being used today...]</p>

<h2>Future Potential</h2>
<p>[Predict where this technology is heading in the next 3-5 years...]</p>

<h2>Challenges and Limitations</h2>
<p>[Address the current drawbacks or obstacles...]</p>

<h2>Getting Started</h2>
<p>[Provide actionable advice for those wanting to explore the tech...]</p>

<h2>Resources</h2>
<ul>
  <li>[Link/Resource 1]</li>
  <li>[Link/Resource 2]</li>
</ul>

<h2>Conclusion</h2>
<p>[Summarize the impact of this technology...]</p>
    `
  },
  {
    id: 'beginners-guide',
    name: 'Beginner\'s Guide',
    description: 'Introduction for newcomers.',
    bestFor: 'Educational content, onboarding guides',
    icon: 'GraduationCap',
    estimatedReadingTime: 15,
    content: `
<h2>Introduction</h2>
<p>[Welcome the reader and explain what the topic is...]</p>

<h2>Who This Is For</h2>
<p>[Clarify the target audience and what they will get out of this guide...]</p>

<h2>Key Concepts</h2>
<h3>[Concept 1]</h3>
<p>[Explain the first foundational idea...]</p>

<h3>[Concept 2]</h3>
<p>[Explain the second foundational idea...]</p>

<h3>[Concept 3]</h3>
<p>[Explain the third foundational idea...]</p>

<h2>Getting Started</h2>
<p>[Provide the initial steps to begin...]</p>

<h2>Your First Steps</h2>
<ol>
  <li>[Step 1]</li>
  <li>[Step 2]</li>
  <li>[Step 3]</li>
</ol>

<h2>Common Questions (FAQ)</h2>
<p><strong>Q: [Question 1]</strong></p>
<p>A: [Answer]</p>
<p><strong>Q: [Question 2]</strong></p>
<p>A: [Answer]</p>

<h2>Resources for Learning More</h2>
<p>[List books, courses, or websites for further study...]</p>

<h2>Next Steps</h2>
<p>[Tell the reader what they should do after finishing the guide...]</p>

<h2>Conclusion</h2>
<p>[Offer encouragement as they begin their journey...]</p>
    `
  },
  {
    id: 'comparison',
    name: 'Comparison Article',
    description: 'Compare two or more things.',
    bestFor: 'Product comparisons, technology comparisons',
    icon: 'ArrowLeftRight',
    estimatedReadingTime: 10,
    content: `
<h2>Introduction</h2>
<p>[Introduce the items being compared and why the comparison is relevant...]</p>

<h2>Overview of Options</h2>
<h3>Option A: [Name]</h3>
<p>[Brief summary of Option A...]</p>

<h3>Option B: [Name]</h3>
<p>[Brief summary of Option B...]</p>

<h2>Comparison Criteria</h2>
<p>[Explain how you will evaluate these options...]</p>

<h2>Detailed Comparison</h2>
<h3>Feature 1: [Feature Name]</h3>
<p>[Compare Option A and Option B on this feature...]</p>

<h3>Feature 2: [Feature Name]</h3>
<p>[Compare Option A and Option B on this feature...]</p>

<h3>Feature 3: [Feature Name]</h3>
<p>[Compare Option A and Option B on this feature...]</p>

<h2>Pricing Comparison</h2>
<p>[Break down the costs of both options...]</p>

<h2>Pros & Cons Summary</h2>
<h3>[Option A]</h3>
<ul>
  <li><strong>Pros:</strong> [List pros...]</li>
  <li><strong>Cons:</strong> [List cons...]</li>
</ul>
<h3>[Option B]</h3>
<ul>
  <li><strong>Pros:</strong> [List pros...]</li>
  <li><strong>Cons:</strong> [List cons...]</li>
</ul>

<h2>Our Recommendation</h2>
<p>[State clearly which option you prefer and why...]</p>

<h2>Conclusion</h2>
<p>[Wrap up the comparison and invite readers to share their choice...]</p>
    `
  },
  {
    id: 'interview',
    name: 'Interview',
    description: 'Q&A format article.',
    bestFor: 'Expert interviews, thought leader profiles',
    icon: 'Mic',
    estimatedReadingTime: 8,
    content: `
<h2>Introduction</h2>
<p>[Introduce the interviewee, their credentials, and why you are speaking with them...]</p>

<h2>Background</h2>
<p>[Provide context on the interviewee's career or current projects...]</p>

<h2>The Interview</h2>
<p><strong>[Your Name/Publication]:</strong> [Question 1...]</p>
<p><strong>[Interviewee Name]:</strong> [Answer 1...]</p>

<p><strong>[Your Name/Publication]:</strong> [Question 2...]</p>
<p><strong>[Interviewee Name]:</strong> [Answer 2...]</p>

<p><strong>[Your Name/Publication]:</strong> [Question 3...]</p>
<p><strong>[Interviewee Name]:</strong> [Answer 3...]</p>

<p><strong>[Your Name/Publication]:</strong> [Question 4...]</p>
<p><strong>[Interviewee Name]:</strong> [Answer 4...]</p>

<p><strong>[Your Name/Publication]:</strong> [Question 5...]</p>
<p><strong>[Interviewee Name]:</strong> [Answer 5...]</p>

<h2>Key Takeaways</h2>
<ul>
  <li>[Takeaway 1]</li>
  <li>[Takeaway 2]</li>
  <li>[Takeaway 3]</li>
</ul>

<h2>Where to Find [Interviewee]</h2>
<p>[Provide links to their website, social media, or latest work...]</p>

<h2>Conclusion</h2>
<p>[Thank the interviewee and wrap up the article...]</p>
    `
  },
  {
    id: 'newsletter',
    name: 'Newsletter',
    description: 'Newsletter-style update.',
    bestFor: 'Regular updates, curated content',
    icon: 'Mail',
    estimatedReadingTime: 5,
    content: `
<h2>Greeting</h2>
<p>[Welcome back the readers and provide a brief intro to this edition...]</p>

<h2>This Week's Highlight</h2>
<p>[Focus on one main story, thought, or announcement for the week...]</p>

<h2>What I've Been Working On</h2>
<p>[Share updates on your current projects or goals...]</p>
<ul>
  <li>[Project 1 update...]</li>
  <li>[Project 2 update...]</li>
</ul>

<h2>Interesting Finds</h2>
<p>Here are some things I found interesting this week:</p>
<ul>
  <li><strong><a href="#">[Link Title 1]</a>:</strong> [Brief description of why it's interesting...]</li>
  <li><strong><a href="#">[Link Title 2]</a>:</strong> [Brief description of why it's interesting...]</li>
  <li><strong><a href="#">[Link Title 3]</a>:</strong> [Brief description of why it's interesting...]</li>
</ul>

<h2>Quick Tips</h2>
<p>[Share 1-2 actionable tips related to your niche...]</p>

<h2>Upcoming Events</h2>
<p>[Mention any webinars, releases, or appearances coming soon...]</p>

<h2>Closing Note</h2>
<p>[Sign off with a warm closing and a prompt to reply...]</p>
    `
  }
]
