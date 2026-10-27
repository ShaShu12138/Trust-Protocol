import { describe, expect, it } from 'vitest';
import { dialogueTextParts, revealDialogue } from './dialogue-text';
describe('progressive call text', () => {
  it('reveals Chinese and emoji without splitting characters or showing formatting markers', () => {
    const parts = dialogueTextParts('你好 **Nova🏦**！');
    expect(revealDialogue(parts, 5)).toEqual([
      {text:'你好 ', strong:false}, {text:'No', strong:true}, {text:'', strong:false},
    ]);
    expect(revealDialogue(parts, 8).map(part => part.text).join('')).toBe('你好 Nova🏦');
    expect(revealDialogue(parts, 99)).toEqual(parts);
  });
  it('preserves emphasis through partial reveal, including the police warning', () => {
    const parts = dialogueTextParts('**等一下！！** 请暂停。');
    expect(revealDialogue(parts, 5)[0]).toEqual({text:'等一下！！',strong:true});
    expect(revealDialogue(parts, 6)[1].text).toBe(' ');
    expect(revealDialogue(parts, 0).every(part => !part.text)).toBe(true);
    expect(parts[1].text).toBe(' 请暂停。');
  });
  it('does not interpret HTML as formatting', () => {
    expect(dialogueTextParts('<script>example</script>')[0]).toEqual({text:'<script>example</script>',strong:false});
    expect(dialogueTextParts('')).toEqual([]);
  });
});
