export interface GeneratedIdea {
  title: string
  description: string
  targetAudience: string
  contentType: string
  keywords: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  readingTime: number
}

const templates = {
  'Blog': [
    "The Complete Guide to {Topic}",
    "{Topic}: What Nobody Tells You",
    "Why {Topic} Matters More Than Ever",
    "A Deep Dive Into {Topic}",
    "The Future of {Topic}: What to Expect",
    "Debunking Common Myths About {Topic}",
    "How {Topic} Changed My Perspective",
    "Understanding {Topic} in the Modern Era",
    "{Topic} vs. The Alternatives: A Breakdown",
    "The Evolution of {Topic}",
    "Is {Topic} Still Relevant Today?",
    "{Topic} Explained Simply",
    "The Hidden Benefits of {Topic}",
    "My Journey with {Topic}",
    "Navigating the World of {Topic}",
    "The Psychology Behind {Topic}",
    "{Topic}: A Comprehensive Overview",
    "Why We Need to Talk About {Topic}",
    "The Dark Side of {Topic}",
    "{Topic}: Fact vs Fiction"
  ],
  'Tutorial': [
    "Getting Started with {Topic}: A Hands-On Guide",
    "Master {Topic} in 30 Days",
    "The Ultimate {Topic} Tutorial for Beginners",
    "Step-by-Step {Topic} Implementation",
    "Advanced {Topic} Techniques You Should Know",
    "Building Your First Project with {Topic}",
    "From Zero to Hero with {Topic}",
    "{Topic} Workflow Optimization",
    "How to Debug {Topic} Like a Pro",
    "Setting Up {Topic} for Production",
    "Integrating {Topic} into Your Stack",
    "The Best Ways to Learn {Topic}",
    "A Practical Approach to {Topic}",
    "{Topic} Masterclass: Core Concepts",
    "Scaling {Topic} Effectively",
    "Testing {Topic}: A Developer's Guide",
    "Securing Your {Topic} Applications",
    "Deploying {Topic} with Confidence",
    "Optimizing {Topic} Performance",
    "Migrating to {Topic}: A Survival Guide"
  ],
  'Listicle': [
    "10 {Topic} Tips That Will Change Your Workflow",
    "7 Common {Topic} Mistakes to Avoid",
    "5 Tools Every {Topic} Professional Needs",
    "Top 10 Resources for Learning {Topic}",
    "15 Secrets to Mastering {Topic}",
    "8 Examples of {Topic} Done Right",
    "12 {Topic} Trends to Watch This Year",
    "9 Ways {Topic} Can Boost Your Productivity",
    "Top 5 Alternatives to Traditional {Topic}",
    "20 Essential {Topic} Hacks",
    "6 Books About {Topic} You Must Read",
    "11 Myths About {Topic} Busted",
    "7 Things Nobody Tells You About {Topic}",
    "10 Questions to Ask Before Starting with {Topic}",
    "8 Inspiring {Topic} Success Stories",
    "5 Reasons to Start Using {Topic} Today",
    "Top 10 {Topic} Communities to Join",
    "7 {Topic} Best Practices",
    "9 Signs You Need to Reevaluate Your {Topic} Strategy",
    "15 Quotes About {Topic} to Inspire You"
  ],
  'How-to': [
    "How to Master {Topic} in Record Time",
    "How to Use {Topic} to Boost Your Productivity",
    "How to Get Started with {Topic} on a Budget",
    "How to Overcome {Topic} Challenges",
    "How to Build a Career in {Topic}",
    "How to Evaluate {Topic} Tools",
    "How to Automate Your {Topic} Workflow",
    "How to Collaborate on {Topic} Projects",
    "How to Present {Topic} to Stakeholders",
    "How to Sell {Topic} Services",
    "How to Create a {Topic} Strategy",
    "How to Measure {Topic} Success",
    "How to Audit Your {Topic} Setup",
    "How to Upgrade Your {Topic} Skills",
    "How to Stay Updated on {Topic}",
    "How to Transition to {Topic}",
    "How to Balance {Topic} with Other Priorities",
    "How to Pitch {Topic} Ideas",
    "How to Document {Topic} Processes",
    "How to Lead a {Topic} Team"
  ],
  'Case Study': [
    "{Topic} in Practice: A Real-World Case Study",
    "How We Used {Topic} to Transform Our Process",
    "The Impact of {Topic} on Our Bottom Line",
    "A {Topic} Success Story",
    "Lessons Learned from Implementing {Topic}",
    "Why Our {Topic} Experiment Failed (And What We Learned)",
    "Scaling {Topic}: A Journey",
    "{Topic} ROI: An In-Depth Analysis",
    "How {Company} Leveraged {Topic}",
    "The Transition to {Topic}: A Case Study",
    "{Topic} Before and After",
    "Solving [Problem] with {Topic}",
    "The Journey to {Topic} Mastery",
    "Anatomy of a {Topic} Project",
    "{Topic} Metrics That Matter",
    "Evaluating {Topic} in the Enterprise",
    "{Topic} for Small Businesses",
    "A Data-Driven Approach to {Topic}",
    "Redesigning Our Architecture with {Topic}",
    "The Cultural Shift Required for {Topic}"
  ],
  'Opinion': [
    "Why I Think {Topic} Is the Future",
    "The Unpopular Truth About {Topic}",
    "Stop Doing {Topic} This Way",
    "Why {Topic} Is Overrated",
    "The Real Problem with {Topic}",
    "In Defense of {Topic}",
    "Why You Should Care About {Topic}",
    "The {Topic} Bubble is About to Burst",
    "{Topic} Isn't Dead Yet",
    "My Problem with the {Topic} Community",
    "Why {Topic} is Harder Than It Looks",
    "The Unspoken Rules of {Topic}",
    "Why We Need Better {Topic} Education",
    "The Ethics of {Topic}",
    "Why {Topic} Matters More Than Ever",
    "The Problem with 'Best Practices' in {Topic}",
    "Why I Switched from {Topic}",
    "The {Topic} Hype Cycle",
    "What We're All Getting Wrong About {Topic}",
    "The Future of {Topic} Belongs to [Group]"
  ]
}

const difficulties: Array<'Beginner' | 'Intermediate' | 'Advanced'> = ['Beginner', 'Intermediate', 'Advanced']
const contentTypesList = Object.keys(templates)

export function generateIdeas(params: {
  topic: string
  audience?: string
  tone?: string
  contentType?: string
}): GeneratedIdea[] {
  const { topic, audience = 'General Audience', tone = 'Informative', contentType } = params
  
  const ideas: GeneratedIdea[] = []
  const capitalizedTopic = topic.charAt(0).toUpperCase() + topic.slice(1)
  
  for (let i = 0; i < 10; i++) {
    const selectedContentType = contentType && templates[contentType as keyof typeof templates] 
      ? contentType 
      : contentTypesList[Math.floor(Math.random() * contentTypesList.length)]
    
    const typeTemplates = templates[selectedContentType as keyof typeof templates]
    const template = typeTemplates[Math.floor(Math.random() * typeTemplates.length)]
    
    const title = template.replace(/{Topic}/g, capitalizedTopic).replace(/{topic}/g, topic)
    
    // Generate a simple description based on tone and audience
    const description = `An ${tone.toLowerCase()} ${selectedContentType.toLowerCase()} exploring ${topic} specifically tailored for ${audience}. Readers will learn key insights and practical takeaways.`
    
    const keywords = [topic.toLowerCase(), selectedContentType.toLowerCase(), tone.toLowerCase(), 'insights', 'guide']
    const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
    const readingTime = Math.floor(Math.random() * 15) + 3 // 3 to 17 minutes
    
    ideas.push({
      title,
      description,
      targetAudience: audience,
      contentType: selectedContentType,
      keywords,
      difficulty,
      readingTime
    })
  }
  
  return ideas
}
