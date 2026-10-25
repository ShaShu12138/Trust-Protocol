import type { DialoguePresentation } from '../ui/dialogue-panel';

const tutorialImage = '/assets/brands/trust-protocol/brand-trust-protocol-mark.svg';

export const DESKTOP_TUTORIAL: readonly DialoguePresentation[] = [
  {
    id: 'tutorial.welcome',
    kind: 'tutorial',
    eyebrowKey: 'dialogue.kind.tutorial',
    speakerKey: 'tutorial.welcome.title',
    bodyKey: 'tutorial.welcome.body',
    imagePath: tutorialImage,
    step: 1,
    stepCount: 3,
    primaryAction: { id: 'next', labelKey: 'dialogue.next' },
    secondaryAction: { id: 'skip', labelKey: 'dialogue.skipTutorial' },
  },
  {
    id: 'tutorial.desktop',
    kind: 'tutorial',
    eyebrowKey: 'dialogue.kind.tutorial',
    speakerKey: 'tutorial.desktop.title',
    bodyKey: 'tutorial.desktop.body',
    imagePath: tutorialImage,
    step: 2,
    stepCount: 3,
    primaryAction: { id: 'next', labelKey: 'dialogue.next' },
    secondaryAction: { id: 'skip', labelKey: 'dialogue.skipTutorial' },
  },
  {
    id: 'tutorial.compare',
    kind: 'tutorial',
    eyebrowKey: 'dialogue.kind.tutorial',
    speakerKey: 'tutorial.compare.title',
    bodyKey: 'tutorial.compare.body',
    imagePath: tutorialImage,
    step: 3,
    stepCount: 3,
    primaryAction: { id: 'finish', labelKey: 'dialogue.start' },
    secondaryAction: { id: 'skip', labelKey: 'dialogue.skipTutorial' },
  },
];
