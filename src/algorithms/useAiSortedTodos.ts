import { useMemo } from 'react';
import { ITodo, EnergyLevel, Tag } from '../utils/types';
import { useAlgoModel } from '../app/store/useAlgoModel';

import urgency from './criteria/urgency';
import overdueSeverity from './criteria/overdueSeverity';
import importanceScore from './criteria/importanceScore';
import effortInversion from './criteria/effortInversion';
import postponePenalty from './criteria/postponePenalty';
import recency from './criteria/recency';
import streakConsistency from './criteria/streakConsistency';
import dependencyReadiness from './criteria/dependencyReadiness';
import contextFit from './criteria/contextFit';
import timeOfDayFit from './criteria/timeOfDayFit';
import energyFit from './criteria/energyFit';
import calendarConflict from './criteria/calendarConflict';
import rewardScore from './criteria/rewardScore';
import riskScore from './criteria/riskScore';
import collaborationNeed from './criteria/collaborationNeed';
import habitStrength from './criteria/habitStrength';
import deadlineUncertainty from './criteria/deadlineUncertainty';
import locationFit from './criteria/locationFit';
import focusRequirement from './criteria/focusRequirement';
import sessionLengthFit from './criteria/sessionLengthFit';
import { slotOf, clamp01 } from '../utils';
import { ScoringContext, TimeSlot } from './types';
import { WEIGHTS } from './constants';

export const useAiSortedTodos = (items: ITodo[]): ITodo[] => {
  const tagWeights = useAlgoModel(s => s.tagWeights as Record<Tag, number> | undefined);
  const energyWeights = useAlgoModel(s => s.energyWeights as Record<EnergyLevel, number> | undefined);
  const todWeights = useAlgoModel(s => s.timeOfDayWeights as Record<TimeSlot, number> | undefined);

  return useMemo(() => {
    const now = Date.now();
    const slot = slotOf(new Date(now));
    const ctx: ScoringContext = { now, slot };

    const scored = items.map(t => {
      const sUrgency = urgency(t, ctx);
      const sOverdue = overdueSeverity(t, ctx);
      const sImportance = importanceScore(t, ctx);
      const sEffortInv = effortInversion(t, ctx);
      const sPostpone = postponePenalty(t, ctx);
      const sRecency = recency(t, ctx);
      const sStreak = streakConsistency(t, ctx);
      const sDepReady = dependencyReadiness(t, ctx);
      const sContext = contextFit(t, ctx);
      const sTod = timeOfDayFit(t, ctx);
      const sEnergy = energyFit(t, ctx);
      const sCalendar = calendarConflict(t, ctx);
      const sReward = rewardScore(t, ctx);
      const sRisk = riskScore(t, ctx);
      const sCollab = collaborationNeed(t, ctx);
      const sHabit = habitStrength(t, ctx);
      const sDeadlineUnc = deadlineUncertainty(t, ctx);
      const sLocation = locationFit(t, ctx);
      const sFocus = focusRequirement(t, ctx);
      const sSession = sessionLengthFit(t, ctx);

      const base =
        WEIGHTS.urgency * sUrgency +
        WEIGHTS.overdueSeverity * sOverdue +
        WEIGHTS.importanceScore * sImportance +
        WEIGHTS.effortInversion * sEffortInv +
        WEIGHTS.postponePenalty * sPostpone +
        WEIGHTS.recency * sRecency +
        WEIGHTS.streakConsistency * sStreak +
        WEIGHTS.dependencyReadiness * sDepReady +
        WEIGHTS.contextFit * sContext +
        WEIGHTS.timeOfDayFit * sTod +
        WEIGHTS.energyFit * sEnergy +
        WEIGHTS.calendarConflict * sCalendar +
        WEIGHTS.rewardScore * sReward +
        WEIGHTS.riskScore * sRisk +
        WEIGHTS.collaborationNeed * sCollab +
        WEIGHTS.habitStrength * sHabit +
        WEIGHTS.deadlineUncertainty * sDeadlineUnc +
        WEIGHTS.locationFit * sLocation +
        WEIGHTS.focusRequirement * sFocus +
        WEIGHTS.sessionLengthFit * sSession;

      const boostTag = t.tag ? tagWeights?.[t.tag] ?? 0 : 0;
      const boostEnergy = t.energy ? energyWeights?.[t.energy] ?? 0 : 0;
      const boostTod = todWeights?.[slot] ?? 0;

      const learnedBoost = clamp01(boostTag + boostEnergy + boostTod);
      const score = base + learnedBoost;

      return { t, score };
    });

    const active = scored.filter(x => !x.t.completed).sort((a, b) => b.score - a.score);
    const completed = scored.filter(x => x.t.completed);
    return [...active.map(x => x.t), ...completed.map(x => x.t)];
  }, [items, tagWeights, energyWeights, todWeights]);
};

export default useAiSortedTodos;