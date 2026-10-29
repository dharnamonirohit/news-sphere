import React from 'react';

export const CATEGORIES = [
  'All',
  'Technology',
  'Artificial Intelligence',
  'Science',
  'Business',
  'Cricket',
  'Sports',
  'World News',
  'India News',
  'Startups',
  'Space',
  'Cybersecurity',
  'Health',
  'Environment',
  'Education',
  'Politics',
  'Entertainment'
];

interface CategoryPillsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="relative w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center space-x-2 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-charcoal text-white dark:bg-stone-100 dark:text-charcoal shadow-sm'
                  : 'bg-white dark:bg-card-dark text-charcoal-muted hover:text-charcoal dark:hover:text-charcoal-dark border border-border-light dark:border-border-dark hover:border-stone-400 dark:hover:border-stone-600'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
