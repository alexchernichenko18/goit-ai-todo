import { ITodo } from '../utils/types';

export const useAiSortedTodos = (items: ITodo[]): ITodo[] => {
  return items.reverse();
};