import { motion } from 'framer-motion';

const jobTitles = [
  "Frontend Developer", "Full Stack Engineer", "Data Scientist", 
  "Product Manager", "UI/UX Designer", "DevOps Engineer",
  "Backend Developer", "ML Engineer", "Software Architect",
  "iOS Developer", "Android Developer", "Cloud Engineer",
  "Security Engineer", "QA Engineer", "Technical Writer"
];

export default function InfiniteMarquee() {
  return (
    <div className="relative overflow-hidden py-4 my-8">
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-teal-500/5 to-transparent" />
      <motion.div
        animate={{ x: [0, -1920] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex gap-8 whitespace-nowrap"
      >
        {[...jobTitles, ...jobTitles].map((title, i) => (
          <span
            key={i}
            className="text-gray-400 text-sm font-mono tracking-wide hover:text-teal-400 transition-colors duration-300"
          >
            {title}
            <span className="mx-4 text-teal-400">✦</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}