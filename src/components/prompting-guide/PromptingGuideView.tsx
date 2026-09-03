'use client';

import { useMemo, useState } from 'react';
import PromptFlipCard from '@/components/prompting-guide/PromptFlipCard';
import { promptingGuideData } from '@/data/promptingGuide';

function formatPercent(value: number): string {
  return `${Math.max(0, Math.min(100, value))}%`;
}

export default function PromptingGuideView() {
  const [activeCategory, setActiveCategory] = useState(promptingGuideData[0]?.id ?? '');
  const [stepIndices, setStepIndices] = useState<Record<string, number>>(
    () => Object.fromEntries(promptingGuideData.map((category) => [category.id, 0]))
  );

  const category = useMemo(
    () => promptingGuideData.find((item) => item.id === activeCategory) ?? promptingGuideData[0],
    [activeCategory]
  );

  if (!category) return null;

  const catIndex = promptingGuideData.findIndex((item) => item.id === category.id);
  const currentStep = stepIndices[category.id] ?? 0;
  const totalSteps = category.steps.length;
  const step = category.steps[currentStep];
  const totalExercises = promptingGuideData.reduce((total, item) => total + item.steps.length, 0);
  const completedBeforeCategory = promptingGuideData
    .slice(0, catIndex)
    .reduce((total, item) => total + item.steps.length, 0);
  const overallStep = completedBeforeCategory + currentStep + 1;
  const progressPercent = formatPercent(((currentStep + 1) / Math.max(1, totalSteps)) * 100);

  const goTo = (delta: number) => {
    const nextStep = currentStep + delta;

    if (nextStep >= totalSteps) {
      if (catIndex < promptingGuideData.length - 1) {
        const nextCategory = promptingGuideData[catIndex + 1];
        setActiveCategory(nextCategory.id);
        setStepIndices((prev) => ({ ...prev, [nextCategory.id]: 0 }));
      }
      return;
    }

    if (nextStep < 0) {
      if (catIndex > 0) {
        const previousCategory = promptingGuideData[catIndex - 1];
        setActiveCategory(previousCategory.id);
        setStepIndices((prev) => ({ ...prev, [previousCategory.id]: previousCategory.steps.length - 1 }));
      }
      return;
    }

    setStepIndices((prev) => ({ ...prev, [category.id]: nextStep }));
  };

  const backDisabled = currentStep === 0 && catIndex === 0;
  const nextDisabled = currentStep === totalSteps - 1 && catIndex === promptingGuideData.length - 1;

  return (
    <section className="pg-guide">
      <div className="pg-toolbar">
        <div className="container-max">
          <div className="pg-toolbar-sticky">
            <div className="pg-tabs-scroll">
              <div className="pg-tabs" role="tablist" aria-label="Prompting guide categories">
                {promptingGuideData.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`pg-tab${item.id === category.id ? ' is-active' : ''}`}
                    onClick={() => setActiveCategory(item.id)}
                    role="tab"
                    aria-selected={item.id === category.id}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pg-progress">
              <p className="pg-progress-overall">
                Exercise {overallStep} of {totalExercises}
              </p>
              <p className="pg-progress-current">
                Guide {currentStep + 1} of {totalSteps}
              </p>
              <span className="pg-category-chip">{category.label}</span>
            </div>
            <div
              className="pg-progress-track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Number(progressPercent.replace('%', ''))}
            >
              <div className="pg-progress-fill" style={{ width: progressPercent }} />
            </div>
          </div>
        </div>
      </div>

      <div className="container-max">
        <div className="pg-body">
          <PromptFlipCard
            key={`${category.id}-${currentStep}`}
            badPrompt={step.badPrompt}
            goodPrompt={step.goodPrompt}
            whyBetter={step.whyBetter}
            additionalTips={step.additionalTips}
            stepTitle={step.title}
            stepExplanation={step.explanation}
            stepNumber={overallStep}
            onBack={() => goTo(-1)}
            onNext={() => goTo(1)}
            backDisabled={backDisabled}
            nextDisabled={nextDisabled}
          />
        </div>
      </div>
    </section>
  );
}
