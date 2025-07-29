/**
 * Enhanced question component with automatic tooltip detection and language translation
 */
'use client';

import React from 'react';

import { TERM_DEFINITIONS } from '@/lib/termDefinitions';
import { useTranslatedText } from '@/hooks/useLanguage';
import InfoTooltip from '@/components/InfoTooltip';

interface QuestionTextProps {
  text: string;
  className?: string;
}

export default function QuestionText({ text, className = '' }: QuestionTextProps) {
  const { translateText } = useTranslatedText();
  
  // First translate the text, then parse for tooltips
  const translatedText = translateText(text);
  
  // Function to parse text and add tooltips for technical terms
  const parseTextWithTooltips = (inputText: string) => {
    const elements: React.ReactNode[] = [];
    let remainingText = inputText;
    let index = 0;

    // Define terms to look for (in order of priority - longer terms first)
    const terms = Object.keys(TERM_DEFINITIONS).sort((a, b) => b.length - a.length);

    while (remainingText.length > 0) {
      let foundMatch = false;

      for (const term of terms) {
        // Create regex for this term (case-insensitive, word boundaries)
        const regex = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
        const match = remainingText.match(regex);

        if (match && match.index !== undefined) {
          // Add text before the match
          if (match.index > 0) {
            elements.push(
              <span key={`text-${index}`}>
                {remainingText.substring(0, match.index)}
              </span>
            );
            index++;
          }

          // Add the tooltip for the matched term
          elements.push(
            <InfoTooltip
              key={`tooltip-${index}`}
              term={match[0]}
              definition={TERM_DEFINITIONS[term]}
              className="mx-0.5"
            />
          );
          index++;

          // Update remaining text
          remainingText = remainingText.substring(match.index + match[0].length);
          foundMatch = true;
          break;
        }
      }

      // If no match found, add the remaining text and break
      if (!foundMatch) {
        if (remainingText.length > 0) {
          elements.push(
            <span key={`text-${index}`}>
              {remainingText}
            </span>
          );
        }
        break;
      }
    }

    return elements.length > 0 ? elements : [<span key="original">{inputText}</span>];
  };

  return (
    <div className={className}>
      {parseTextWithTooltips(translatedText)}
    </div>
  );
}
