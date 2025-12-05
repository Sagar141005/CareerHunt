import React from "react";
import { motion } from "motion/react";
import { RiStarFill, RiDoubleQuotesL } from "@remixicon/react";

const testimonials = [
  {
    name: "Sarah Jenkins",
    role: "Product Designer @ Spotify",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    text: "I was skeptical about AI resume builders, but this one actually understands design context. I landed interviews at 3 top tech firms in a week.",
  },
  {
    name: "David Chen",
    role: "Software Engineer @ Meta",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
    text: "The job tracker board is a game changer. Being able to visualize my application pipeline saved me so much stress during my search.",
  },
  {
    name: "Emily W.",
    role: "Marketing Lead @ Airbnb",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb",
    text: "Recruiters actually started replying. The keywords optimization feature is like magic. Highly recommended for anyone stuck in the black hole.",
  },
  {
    name: "Marcus Johnson",
    role: "Frontend Dev @ Netflix",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6",
    text: "Cleanest UI I've seen in a career tool. It makes the tedious process of applying to jobs actually feel productive and organized.",
  },
  {
    name: "Priya Patel",
    role: "Data Scientist @ Amazon",
    img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f",
    text: "I used the interview prep AI to practice behavioral questions. It gave me feedback on my tone that I hadn't realized before.",
  },
];

const TestimonialsCard = ({ name, role, img, text }) => (
  <div className="w-[350px] sm:w-[400px] min-h-72 flex-shrink-0 p-8 rounded-3xl bg-white dark:bg-blue-900/10 border border-neutral-100 dark:border-white/5 shadow-xl shadow-neutral-200/50 dark:shadow-none mx-4 flex flex-col justify-between">
    <div>
      <div className="flex gap-1 mb-6 text-amber-400">
        {[...Array(5)].map((_, i) => (
          <RiStarFill key={i} size={18} />
        ))}
      </div>

      <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6 font-medium relative z-10">
        "{text}"
      </p>
    </div>

    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-neutral-100 dark:border-white/5">
      <img
        src={`${img}?w=100&q=80`}
        alt={name}
        className="w-12 h-12 rounded-full object-cover border border-neutral-200 dark:border-white/10"
      />
      <div>
        <h4 className="font-bold text-neutral-900 dark:text-white text-sm">
          {name}
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          {role}
        </p>
      </div>
      <RiDoubleQuotesL
        className="ml-auto text-blue-100 dark:text-blue-900/40"
        size={40}
      />
    </div>
  </div>
);

const TestimonialsSection = () => {
  return (
    <section className="py-32 bg-neutral-50 dark:bg-neutral-950 border-y border-neutral-200 dark:border-white/5 overflow-hidden">
      <div className="max-w-3xl mx-auto px-6 text-center mb-16">
        <h3 className="text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6">
          Don't take our word for it.
        </h3>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Join thousands of professionals who found their dream jobs faster.
        </p>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 w-32 md:w-64 bg-gradient-to-r from-neutral-50 dark:from-[#020617] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 md:w-64 bg-gradient-to-l from-neutral-50 dark:from-[#020617] to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex"
          animate={{ x: "-50%" }}
          transition={{
            duration: 50,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ width: "max-content" }}
        ></motion.div>
        <div className="flex w-max animate-infinite-scroll hover:[animation-play-state:paused]">
          {[...testimonials, ...testimonials, ...testimonials].map(
            (review, idx) => (
              <TestimonialsCard key={idx} {...review} />
            )
          )}
        </div>
      </div>

      <style>{`
        @keyframes infinite-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); } /* 1/3rd because list is triplicated */
        }
        .animate-infinite-scroll {
          animation: infinite-scroll 60s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default TestimonialsSection;
