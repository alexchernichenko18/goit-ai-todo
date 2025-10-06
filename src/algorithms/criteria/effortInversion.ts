import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';
import { clamp01 } from '../../utils';

const w = {
  matchKeyword: 0.5,
  locationHint: 0.3,
  tagAffinity: 0.2
};

const ENV = {
  currentContext: 'work',
  currentLocation: 'office'
};

export default function contextFit(todo: ITodo, _ctx: ScoringContext): number {
  let score = 0;

  if (todo.context && ENV.currentContext && todo.context === ENV.currentContext) {
    score += w.matchKeyword;
  }

  if (todo.location && ENV.currentLocation && todo.location === ENV.currentLocation) {
    score += w.locationHint;
  }

  if (todo.tag === 'work' && ENV.currentContext === 'work') {
    score += w.tagAffinity;
  }

  return clamp01(score);
}