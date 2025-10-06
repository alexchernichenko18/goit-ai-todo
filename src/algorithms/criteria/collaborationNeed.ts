import { ITodo } from '../../utils/types';
import { ScoringContext } from '../types';

export default function collaborationNeed(todo: ITodo, _ctx: ScoringContext): number {
  if (todo.tag === 'work') return 0.8;
  if (todo.tag === 'study') return 0.5;
  if (todo.tag === 'home') return 0.3;
  return 0.1;
}