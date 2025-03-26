'use client';
import React from 'react';
import { PostTag } from '@/types';

interface TagSelectorProps {
  selectedTags: PostTag[];
  onChange: (tags: PostTag[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({ selectedTags, onChange }) => {
  const handleTagToggle = (tag: PostTag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    onChange(newTags);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Tags</label>
      <div className="flex flex-wrap gap-2">
        {Object.values(PostTag).map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => handleTagToggle(tag)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedTags.includes(tag)
                ? 'bg-green-100 text-green-800 border border-green-300'
                : 'bg-gray-100 text-gray-800 border border-gray-300'
            } hover:bg-gray-200 transition-colors`}
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;