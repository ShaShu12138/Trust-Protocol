import type { IncomingCallPresentation } from '../../apps/phone/incoming-call';
import type { DialoguePresentation } from '../../ui/dialogue-panel';
import { assetUrl } from '../../ui/asset-url';

const unknownPortrait = assetUrl('/assets/system/icons/contact-unknown.svg');

export const DAY_01_SUSPICIOUS_CALL: IncomingCallPresentation = {
  id: 'call.day01.suspicious-bank-support',
  phoneNumber: '+31 20 794 0148',
  portraitPath: unknownPortrait,
};

export const DAY_01_POLICE_CALL: IncomingCallPresentation = {
  id: 'call.day01.police-warning',
  phoneNumber: '112',
  portraitPath: assetUrl('/assets/system/icons/system-notification.svg'),
};

export const DAY_01_SUSPICIOUS_CALL_LINES: readonly DialoguePresentation[] = [
  {
    id: 'dialogue.day01.suspicious.intro',
    kind: 'call',
    eyebrowKey: 'dialogue.kind.call',
    speakerKey: 'day01.call.unknownSpeaker',
    bodyKey: 'day01.call.suspicious.intro',
    imagePath: unknownPortrait,
    primaryAction: { id: 'mine', labelKey: 'day01.call.mine' },
    secondaryAction: { id: 'not-mine', labelKey: 'day01.call.notMine' },
  },
  {
    id: 'dialogue.day01.suspicious.instruction',
    kind: 'call',
    eyebrowKey: 'dialogue.kind.call',
    speakerKey: 'day01.call.unknownSpeaker',
    bodyKey: 'day01.call.suspicious.instruction',
    imagePath: unknownPortrait,
    primaryAction: { id: 'continue', labelKey: 'call.hangUp' },
  },

];

export const DAY_01_POLICE_CALL_LINES: readonly DialoguePresentation[] = [
  {
    id: 'dialogue.day01.police.stop',
    kind: 'call',
    eyebrowKey: 'dialogue.kind.call',
    speakerKey: 'day01.call.police.name',
    bodyKey: 'day01.call.police.stop',
    imagePath: assetUrl('/assets/system/icons/system-notification.svg'),
    primaryAction: { id: 'continue', labelKey: 'dialogue.continue' },
  },
  {
    id: 'dialogue.day01.police.explanation',
    kind: 'call',
    eyebrowKey: 'dialogue.kind.call',
    speakerKey: 'day01.call.police.name',
    bodyKey: 'day01.call.police.explanation',
    imagePath: assetUrl('/assets/system/icons/system-notification.svg'),
  },
];
