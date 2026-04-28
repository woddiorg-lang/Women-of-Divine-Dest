import { useState } from 'react';
import { useProgressStore } from '../store/progressStore';
import { Lock, Search, GraduationCap, HandMetal, Laptop } from 'lucide-react';
import { cn } from '../lib/utils';
import { useNavigate } from 'react-router';

// Partial mock data for courses based on prompt
export const COURSES = [
  { id: '1', title: 'Smartphone & Digital Awareness', track: 'Digital Skills', level: 'Beginner', rating: 4.4, tutor: 'WODDI Faculty', desc: 'Master your smartphone — settings, apps, storage, security, cloud backup.', duration: '2 hours' },
  { id: '2', title: 'WhatsApp for Communication', track: 'Digital Skills', level: 'Beginner', rating: 4.0, tutor: 'WODDI Faculty', desc: 'WhatsApp for personal, business, and community use.', duration: '1 hour' },
  { id: '5', title: 'Content Creation', track: 'Digital Skills', level: 'Intermediate', rating: 4.2, tutor: 'WODDI Faculty', desc: 'Plan, write, design engaging content for social media.', duration: '3 hours' },
  
  // Advanced Digital Skills
  { id: 'adv_d1', title: 'Search Engine Optimization (SEO)', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Master technical and on-page SEO.', duration: '5 hours' },
  { id: 'adv_d2', title: 'Paid Advertising (Google Ads)', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Campaign creation, bidding strategies, and optimization.', duration: '6 hours' },
  { id: 'adv_d3', title: 'Paid Advertising (Meta Ads)', track: 'Digital Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Facebook and Instagram ad campaigns and scaling.', duration: '5 hours' },
  { id: 'adv_d4', title: 'Marketing Analytics & Reporting', track: 'Digital Skills', level: 'Advanced', rating: 4.6, tutor: 'WODDI Faculty', desc: 'Track, analyze and report marketing performance.', duration: '4 hours' },
  { id: 'adv_d5', title: 'Brand Strategy & Positioning', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Build and position strong digital brands.', duration: '4 hours' },
  { id: 'adv_d6', title: 'Growth Marketing', track: 'Digital Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Growth hacking and scaling businesses.', duration: '5 hours' },
  { id: 'adv_d7', title: 'Advanced Excel & Dashboards', track: 'Digital Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Pivot tables, Power Query, and dynamic dashboards.', duration: '6 hours' },
  { id: 'adv_d8', title: 'SQL Fundamentals', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Querying and analyzing databases.', duration: '5 hours' },
  { id: 'adv_d9', title: 'Power BI / Tableau', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Data visualization and business intelligence.', duration: '6 hours' },
  { id: 'adv_d10', title: 'Business Intelligence Basics', track: 'Digital Skills', level: 'Advanced', rating: 4.6, tutor: 'WODDI Faculty', desc: 'Transforming data into actionable insights.', duration: '4 hours' },
  { id: 'adv_d11', title: 'No-Code App Development', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Build apps without writing code.', duration: '6 hours' },
  { id: 'adv_d12', title: 'Webflow Development', track: 'Digital Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Design and build custom websites visually.', duration: '8 hours' },
  { id: 'adv_d13', title: 'Automation with Zapier & Make', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Automate business workflows.', duration: '4 hours' },
  { id: 'adv_d14', title: 'API Fundamentals', track: 'Digital Skills', level: 'Advanced', rating: 4.6, tutor: 'WODDI Faculty', desc: 'Understanding and using APIs.', duration: '3 hours' },
  { id: 'adv_d15', title: 'UX Design Fundamentals', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'User research and experience design.', duration: '5 hours' },
  { id: 'adv_d16', title: 'UI Design with Figma', track: 'Digital Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Interface design and prototyping.', duration: '6 hours' },
  { id: 'adv_d17', title: 'Product Management Foundations', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Manage the product lifecycle.', duration: '5 hours' },
  { id: 'adv_d18', title: 'Agile & Scrum', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Agile methodologies for product development.', duration: '4 hours' },
  { id: 'adv_d19', title: 'AI Literacy', track: 'Digital Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'What AI is, how it works, changing work and life in Africa.', duration: '3 hours' },
  { id: 'adv_d20', title: 'Prompt Engineering', track: 'Digital Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Mastering AI prompts.', duration: '4 hours' },
  { id: 'adv_d21', title: 'AI for Marketing & Automation', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Using AI to scale marketing.', duration: '5 hours' },
  { id: 'adv_d22', title: 'AI Productivity Systems', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'AI tools for daily workflows.', duration: '3 hours' },
  { id: 'adv_d23', title: 'Consulting Fundamentals', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Start and grow a consulting business.', duration: '5 hours' },
  { id: 'adv_d24', title: 'B2B Sales Strategy', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Mastering B2B sales cycles.', duration: '6 hours' },
  { id: 'adv_d25', title: 'Advanced Client Management', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Retaining and growing client relationships.', duration: '4 hours' },
  { id: 'adv_d26', title: 'Remote Work & Team Collaboration', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Leading and managing distributed teams.', duration: '4 hours' },
  { id: 'adv_d27', title: 'Cybersecurity Fundamentals', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Protecting digital assets.', duration: '5 hours' },
  { id: 'adv_d28', title: 'Digital Privacy & Data Protection', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Data privacy compliance.', duration: '4 hours' },
  { id: 'adv_d29', title: 'Fintech Fundamentals', track: 'Digital Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Financial technology overview.', duration: '5 hours' },
  { id: 'adv_d30', title: 'Blockchain & Digital Assets Literacy', track: 'Digital Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Understanding crypto and blockchain.', duration: '4 hours' },

  { id: 'h1', title: 'Basic Tailoring & Garment Repair', track: 'Hands-On Skills', level: 'Beginner', rating: 4.6, tutor: 'Jane Okafor', desc: 'Hand and machine sewing for repairs, alterations, simple garment-making.', duration: '4 hours' },
  { id: 'h2', title: 'Soap Making', track: 'Hands-On Skills', level: 'Beginner', rating: 4.9, tutor: 'Sarah Amadi', desc: 'Bar soaps, cold and hot process. Ingredients, safety, colouring.', duration: '3 hours' },

  // Advanced Hands-On Skills
  { id: 'adv_h1', title: 'Fashion Business Management', track: 'Hands-On Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Manage and scale a fashion brand.', duration: '6 hours' },
  { id: 'adv_h2', title: 'Production Scaling & Quality Assurance', track: 'Hands-On Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Maintain quality at scale.', duration: '5 hours' },
  { id: 'adv_h3', title: 'Factory & Workshop Setup (Small Scale)', track: 'Hands-On Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Setup physical production spaces.', duration: '5 hours' },
  { id: 'adv_h4', title: 'Product Standardisation & Compliance', track: 'Hands-On Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Comply with product standards.', duration: '4 hours' },
  { id: 'adv_h5', title: 'Bulk Production Planning', track: 'Hands-On Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Plan and execute large orders.', duration: '5 hours' },
  { id: 'adv_h6', title: 'Supply Chain & Raw Materials Sourcing', track: 'Hands-On Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Source materials efficiently.', duration: '5 hours' },
  { id: 'adv_h7', title: 'Brand Expansion & Distribution', track: 'Hands-On Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Expand reach and distribution channels.', duration: '5 hours' },
  { id: 'adv_h8', title: 'Cooperative & Group Enterprise Management', track: 'Hands-On Skills', level: 'Advanced', rating: 4.7, tutor: 'WODDI Faculty', desc: 'Managing cooperative ventures.', duration: '4 hours' },
  { id: 'adv_h9', title: 'Export Readiness (Selected Products)', track: 'Hands-On Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Prepare products for international export.', duration: '6 hours' },
  { id: 'adv_h10', title: 'Business Registration & Compliance', track: 'Hands-On Skills', level: 'Advanced', rating: 4.8, tutor: 'WODDI Faculty', desc: 'Legal and regulatory compliance.', duration: '4 hours' },
  { id: 'adv_h11', title: 'Accessing Grants, Loans & Partnerships', track: 'Hands-On Skills', level: 'Advanced', rating: 4.9, tutor: 'WODDI Faculty', desc: 'Funding and partnership strategies.', duration: '5 hours' },
];

export default function Courses() {
  const { courseHubUnlocked } = useProgressStore();
  const navigate = useNavigate();

  const [activeTrack, setActiveTrack] = useState<'Digital Skills' | 'Hands-On Skills'>('Digital Skills');
  const [activeLevel, setActiveLevel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  if (!courseHubUnlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 space-y-6">
        <div className="w-24 h-24 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center text-gray-400">
          <Lock size={40} />
        </div>
        <h2 className="text-xl font-display font-bold text-center dark:text-white">Course Hub Locked</h2>
        <p className="text-gray-500 text-center max-w-xs">
          Complete both Rooting Phase and Blueprint Phase in your Journey to unlock the Course Hub.
        </p>
        <button 
          onClick={() => navigate('/journey')}
          className="py-3 px-8 bg-[#D4006A] text-white rounded-xl font-bold font-sans mt-4 active:scale-95 transition-transform"
        >
          Go to Journey
        </button>
      </div>
    );
  }

  const filteredCourses = COURSES.filter(c => {
    if (c.track !== activeTrack) return false;
    if (activeLevel !== 'All' && c.level !== activeLevel) return false;
    if (searchQuery && !c.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0F0F0F]">
      <div className="bg-white dark:bg-[#1A1A1A] px-4 py-3 border-b border-gray-100 dark:border-zinc-800 space-y-4">
        <h1 className="text-2xl font-display font-bold dark:text-white">Course Hub</h1>
        
        <div className="relative">
          <Search size={18} className="absolute left-3 top-3.5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-100 dark:bg-zinc-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#D4006A] outline-none dark:text-white"
          />
        </div>

        <div className="flex space-x-2 bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTrack('Digital Skills')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-md flex justify-center items-center space-x-2 shadow-sm transition-colors",
              activeTrack === 'Digital Skills' ? "bg-white dark:bg-[#27272A] text-current dark:text-white" : "text-gray-500 shadow-none dark:text-gray-400"
            )}
          >
            <Laptop size={16} /> <span>Digital</span>
          </button>
          <button 
            onClick={() => setActiveTrack('Hands-On Skills')}
            className={cn(
              "flex-1 py-2 text-sm font-semibold rounded-md flex justify-center items-center space-x-2 shadow-sm transition-colors",
              activeTrack === 'Hands-On Skills' ? "bg-white dark:bg-[#27272A] text-current dark:text-white" : "text-gray-500 shadow-none dark:text-gray-400"
            )}
          >
            <HandMetal size={16} /> <span>Hands-On</span>
          </button>
        </div>

        <div className="flex space-x-2 overflow-x-auto no-scrollbar pb-1">
          {['All', 'Beginner', 'Intermediate', 'Advanced'].map(level => (
            <button
              key={level}
              onClick={() => setActiveLevel(level)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
                activeLevel === level 
                  ? "bg-gray-800 text-white dark:bg-gray-200 dark:text-black" 
                  : "bg-gray-100 text-gray-600 dark:bg-zinc-800 dark:text-gray-300 border border-gray-200 dark:border-zinc-700"
              )}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col space-y-4">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No courses found matching your criteria.</div>
        ) : (
          filteredCourses.map(course => (
            <div key={course.id} className="bg-white dark:bg-[#1A1A1A] p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 flex flex-col space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-col space-y-1">
                  <div className="flex space-x-2">
                    <span className={cn(
                      "text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-sm",
                      course.level === 'Beginner' ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" :
                      course.level === 'Intermediate' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
                    )}>
                      {course.level}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold flex items-center">
                      ★ {course.rating.toFixed(1)}
                    </span>
                  </div>
                  <h3 className="font-bold leading-tight dark:text-white text-[15px]">{course.title}</h3>
                  <span className="text-xs text-gray-500">{course.tutor} • {course.duration}</span>
                </div>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                  activeTrack === 'Digital Skills' ? "bg-pink-50 text-[#D4006A] dark:bg-[#D4006A]/10" : "bg-green-50 text-[#7CB518] dark:bg-[#7CB518]/10"
                )}>
                  <GraduationCap size={20} />
                </div>
              </div>
              <div className="bg-gray-50/50 dark:bg-zinc-800/30 rounded-lg p-3 border border-gray-100 dark:border-zinc-800/50 mt-1">
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {course.desc}
                </p>
              </div>
              <button 
                onClick={() => navigate(`/courses/${course.id}`)}
                className={cn(
                  "w-full py-2.5 rounded-xl font-bold text-sm text-white shadow-sm transition-transform active:scale-95",
                  activeTrack === 'Digital Skills' ? "bg-[#D4006A]" : "bg-[#7CB518]"
                )}
              >
                Open Course
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
